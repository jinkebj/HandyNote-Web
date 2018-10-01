# HandyNote-Web

> HandyNote Web Portal, utilize [HandyNote-Service](https://github.com/jinkebj/HandyNote-Service) as backend service provider

- [Screenshot & HandyNote overall info](https://github.com/jinkebj/HandyNote)

## Software Requirements

- [Node.js 8.x or above](https://nodejs.org)

## Development Setup

``` bash
# Optional, set npm mirror to speed up npm install in China
npm config set registry https://registry.npm.taobao.org

# install dependencies
npm install

# Optional, set HANDYNOTE_SERVICE_API
# if not set, will use HANDYNOTE_SERVICE_API=http://localhost:3000/api
# please refer to https://github.com/jinkebj/HandyNote-Service/blob/master/README.md to setup HandyNote-Service debug env
export HANDYNOTE_SERVICE_API=http(s)://IP:Port/api

# run in debug mode with hot reload
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
