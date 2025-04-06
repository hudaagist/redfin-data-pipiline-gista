from airflow import DAG
from datetime import datetime, timedelta
from airflow.operators.python_operator import PythonOperator
import pandas as pd
import boto3
from airflow.operators.bash_operator import BashOperator

s3_client = boto3.client('s3')
target_bucket_name = 'redfin-data-bucket-gista'

# url link from redfin: county 
url_by_city = 'https://redfin-public-data.s3.us-west-2.amazonaws.com/redfin_market_tracker/county_market_tracker.tsv000.gz'

def extract_data(**kwargs):
    url = kwargs['url']
    df = pd.read_csv(url, compression='gzip', sep='\t')
    now = datetime.now()
    date_now_string = now.strftime("%Y%m%d-%H%M%S")
    file_str = 'redfin_data_' + date_now_string + '.csv'
    df.to_csv(file_str, index=False)
    # Save the file to a specific location
    output_file_path = f"/home/ubuntu/{file_str}"
    output_list = [output_file_path, file_str]
    return output_list

def transfrom_data(task_instance):
    data = task_instance.xcom_pull(task_ids = "task_extract_redfin_data")[0]
    object_key = task_instance.xcom_pull(task_ids = "task_extract_redfin_data")[1]
    df = pd.read_csv(data)

    #remove commas from the 'city' column
    df['city'] = df['city'].str.replace(',' '')
    cols = [
        'period_begin', 'period_end', 'city', 'state', 'state_code', 'property_type',
        'property_type_id', 'median_sale_price', 'median_list_price', 'median_ppsf',
        'median_list_ppsf', 'homes_sold', 'inventory', 'months_of_supply', 'median_dom',
        'avg_sale_to_list', 'sold_above_list', 'parent_metro_region_metro_code', 'last_updated'
    ]   
    df = df[cols]
    df = df.dropna()

    #change the priod_begin and period_end to datetime
    df['period_begin'] = pd.to_datetime(df['period_begin'])
    df['period_end'] = pd.to_datetime(df['period_end'])

    df['period_begin_in_years'] = df['period_begin'].dt.year
    df['period_end_in_years'] = df['period_end'].dt.year

    df['period_begin_in_months'] = df['period_begin'].dt.month
    df['period_end_in_months'] = df['period_end'].dt.month

    month_dict = {
        "period_begin_in_month": {
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "Apr",
            5: "May",
            6: "Jun",
            7: "Jul",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec"
        },
        "period_end_in_month": {
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "Apr",
            5: "May",
            6: "Jun",
            7: "Jul",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec"
        }
    }

    df = df.replace(month_dict)

    csv_data = df.to_csv(index=False)

    # upload csv to s3

    object_key = object_key
    s3_client.put_object(Bucket = target_bucket_name, Key = object_key, Body = csv_data)


default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2025, 4, 6),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 2,
    'retry_delay': timedelta(seconds=15),
}

with DAG(
    'redfin_analytics_dag',
    default_args=default_args,
    catchup=False,
    schedule_interval:'@weekly') 
    as dag:

    extract_redfin_data = PythonOperator(
        task_id = 'task_extract_redfin_data',
        python_callable = extract_data,
        op_kwargs = {
            'url': url_by_city
        }
    )

    transfrom_redfin_data = PythonOperator(
        task_id = 'task_transform_redfin_data',
        python_callable = transfrom_data
    )

    load_to_s3 = BashOperator(
        task_id = 'task_load_to_s3',
        bash_command = 'aws s3 mv {{ task_instance.xcom_pull(task_ids="task_transform_redfin_data") }} s3://{{ var.value.target_bucket_name }}'
    )

    extract_redfin_data >> transfrom_redfin_data >> load_to_s3  




