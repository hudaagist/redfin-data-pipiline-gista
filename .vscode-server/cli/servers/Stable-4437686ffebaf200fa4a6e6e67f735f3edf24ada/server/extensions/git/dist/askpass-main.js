(()=>{"use strict";var e={231:function(e,t,r){var n,s=this&&this.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r);var s=Object.getOwnPropertyDescriptor(t,r);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,s)}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),i=this&&this.__importStar||(n=function(e){return n=Object.getOwnPropertyNames||function(e){var t=[];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[t.length]=r);return t},n(e)},function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r=n(e),i=0;i<r.length;i++)"default"!==r[i]&&s(t,e,r[i]);return o(t,e),t});Object.defineProperty(t,"__esModule",{value:!0});const c=i(r(9896)),a=r(7745);function u(e){console.error("Missing or invalid credentials."),console.error(e),process.exit(1)}!function(e){if(!process.env.VSCODE_GIT_ASKPASS_PIPE)return u("Missing pipe");if(!process.env.VSCODE_GIT_ASKPASS_TYPE)return u("Missing type");if("https"!==process.env.VSCODE_GIT_ASKPASS_TYPE&&"ssh"!==process.env.VSCODE_GIT_ASKPASS_TYPE)return u(`Invalid type: ${process.env.VSCODE_GIT_ASKPASS_TYPE}`);if("fetch"===process.env.VSCODE_GIT_COMMAND&&process.env.VSCODE_GIT_FETCH_SILENT)return u("Skip silent fetch commands");const t=process.env.VSCODE_GIT_ASKPASS_PIPE,r=process.env.VSCODE_GIT_ASKPASS_TYPE,n="https"===r?e[2]:e[3];let s,o,i;"https"===r&&(s=e[4].replace(/^["']+|["':]+$/g,"")),"ssh"===r&&(/passphrase/i.test(n)?o=e[6]?.replace(/^["']+|["':]+$/g,""):(s=e[6].replace(/^["']+|["':]+$/g,""),i=e[15])),new a.IPCClient("askpass").call({askpassType:r,request:n,host:s,file:o,fingerprint:i}).then((e=>{c.writeFileSync(t,e+"\n"),setTimeout((()=>process.exit(0)),0)})).catch((e=>u(e)))}(process.argv)},7745:function(e,t,r){var n,s=this&&this.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r);var s=Object.getOwnPropertyDescriptor(t,r);s&&!("get"in s?!t.__esModule:s.writable||s.configurable)||(s={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,s)}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),o=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),i=this&&this.__importStar||(n=function(e){return n=Object.getOwnPropertyNames||function(e){var t=[];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[t.length]=r);return t},n(e)},function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r=n(e),i=0;i<r.length;i++)"default"!==r[i]&&s(t,e,r[i]);return o(t,e),t});Object.defineProperty(t,"__esModule",{value:!0}),t.IPCClient=void 0;const c=i(r(8611));t.IPCClient=class{constructor(e){this.handlerName=e;const t=process.env.VSCODE_GIT_IPC_HANDLE;if(!t)throw new Error("Missing VSCODE_GIT_IPC_HANDLE");this.ipcHandlePath=t}call(e){const t={socketPath:this.ipcHandlePath,path:`/${this.handlerName}`,method:"POST"};return new Promise(((r,n)=>{const s=c.request(t,(e=>{if(200!==e.statusCode)return n(new Error(`Bad status code: ${e.statusCode}`));const t=[];e.on("data",(e=>t.push(e))),e.on("end",(()=>r(JSON.parse(Buffer.concat(t).toString("utf8")))))}));s.on("error",(e=>n(e))),s.write(JSON.stringify(e)),s.end()}))}}},9896:e=>{e.exports=require("fs")},8611:e=>{e.exports=require("http")}},t={},r=function r(n){var s=t[n];if(void 0!==s)return s.exports;var o=t[n]={exports:{}};return e[n].call(o.exports,o,o.exports,r),o.exports}(231),n=exports;for(var s in r)n[s]=r[s];r.__esModule&&Object.defineProperty(n,"__esModule",{value:!0})})();
//# sourceMappingURL=https://main.vscode-cdn.net/sourcemaps/4437686ffebaf200fa4a6e6e67f735f3edf24ada/extensions/git/dist/askpass-main.js.map