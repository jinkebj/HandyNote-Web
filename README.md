# HandyNote-Web

> HandyNote - Web App

## Build Setup

``` bash
# Optional, set npm mirror to speed up npm install in China
npm config set registry https://registry.npm.taobao.org

# install dependencies
npm install

# Optional, set HANDYNOTE_WEB_PORT & HANDYNOTE_SERVICE_API
# if not set, will use HANDYNOTE_WEB_PORT=9080, HANDYNOTE_SERVICE_API=http://localhost:3000/api
export HANDYNOTE_WEB_PORT={portnum} # only apply for debug mode
export HANDYNOTE_SERVICE_API=http://IP:Port/api

# run in debug mode with hot reload
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
