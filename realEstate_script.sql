-- DROP DATABASE IF EXISTS redfin_database;

CREATE DATABASE redfin_database_1;

-- CREATE WAREHOUSE redfin_warehouse;

-- create schema
CREATE SCHEMA redfin_schema;

//create table
-- TRUNCATE TABLE redfin_database.redfin_schema.redfin_table;

CREATE OR REPLACE TABLE REDFIN_DATABASE_1.REDFIN_SCHEMA.redfin_table(
    period_begin DATE,
    period_end DATE,
    city STRING,
    state STRING,
    state_code STRING,
    property_type STRING,
    property_type_id INT,
    median_sale_price FLOAT,
    median_list_price FLOAT,
    median_ppsf FLOAT,
    median_list_ppsf FLOAT,
    homes_sold FLOAT,
    inventory FLOAT,
    months_of_supply FLOAT,
    median_dom FLOAT,
    avg_sale_to_list FLOAT,
    sold_above_list FLOAT,
    parent_metro_region_metro_code STRING,
    last_updated DATETIME,
    period_begin_in_years INT,
    period_end_in_years INT,
    period_begin_in_months STRING,
    period_end_in_months STRING
);

SELECT * FROM REDFIN_DATABASE_1.REDFIN_SCHEMA.REDFIN_TABLE;

CREATE SCHEMA file_format_schema;
CREATE OR REPLACE FILE FORMAT REDFIN_DATABASE_1.file_format_schema.format_csv
    type = 'CSV'
    field_delimiter = ','
    RECORD_DELIMITER = '\n'
    skip_header = 1;

CREATE SCHEMA external_stage_schema;

CREATE OR REPLACE STAGE REDFIN_DATABASE_1.external_stage_schema.redfin_external_stage
    url = "s3://redfin-data-transformed-bucket-gista"
    credentials = (
        aws_key_id = 'AKIA563Y5ZP2UORCUABK' 
        aws_secret_key = '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'
        )
    FILE_FORMAT = REDFIN_DATABASE_1.FILE_FORMAT_SCHEMA.FORMAT_CSV;

-- check list inside my bucket
LIST @redfin_database_1.external_stage_schema.redfin_external_stage

-- create snow pipe (enable loading data as soon as the file available on the stage)
CREATE OR REPLACE SCHEMA redfin_database_1.snowpipe_schema;

-- create pipe
CREATE OR REPLACE PIPE REDFIN_DATABASE_1.SNOWPIPE_SCHEMA.REDFIN_SNOWPIPE
AUTO_INGEST = TRUE
AS
COPY INTO REDFIN_DATABASE_1.REDFIN_SCHEMA.REDFIN_TABLE
FROM @redfin_database_1.external_stage_schema.redfin_external_stage;

SELECT COUNT(*) FROM redfin_database_1.redfin_schema.redfin_table;

DESC PIPE REDFIN_DATABASE_1.SNOWPIPE_SCHEMA.REDFIN_SNOWPIPE;


SELECT * FROM REDFIN_DATABASE_1.REDFIN_SCHEMA.REDFIN_TABLE;

