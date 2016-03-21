# react-dev

基于webpack(打包)&gulp(工作流)&koa(数据mock)的本地开发环境

### 执行命令
 - `tnpm run start`  
   启用带有`hmr`功能的本地服务开发环境
 - `tnpm run debug`  
   启用不带`hrm`功能的本地服务开发环境
 - `tnpm run mock`  
   启用带有`数据mock`功能的本地服务开发环境（不带hmr，因该功能还不稳定[Webpack用来做模块热替换](http://segmentfault.com/a/1190000003872635)）
 - `tnpm run build`  
   执行项目构建，构建至`.build`文件夹，用于线上发布
 - `tnpm run test`  
   执行单元测试

### 数据mock配置说明
 - 目前数据mock功能只能支持mock一个接口（设定为`/api/list`，所以所有的mock请求都请求这一个接口），在配置中，需要将不同的请求区分配置放在req参数中，然后在配置对象中指定req对应值返回的数据即可。
 - 配置完数据后要想使得mock的数据生效，需要关闭当前本地服务，执行`tnpm run mock`重新启动服务，mock数据方可生效。

### 技术方案

 - reflux + react 
 - webpack + gulp + koa（用于mock数据）
 - tnpm

### 目录结构


        ├── .build                            [项目发布后生成的目录或文件]
        └─── sc-radar                         [前端开发代码目录]  
            ├── app.js                        [业务js目录]       
            ├── app.css                       [业务css目录]
            └── index.html                    [入口文件] 
        ├── app                               [前端开发静态资源]
        ├── gulp                              [gulp任务目录]
        ├── mock                              [ajax请求数据mock配置]
        ├── node_modules                      [依赖]
        ├── test                              [测试]
        ├── .editorconfig                     [代码格式化小工具配置]
        ├── .eslintrc                         [eslint代码检查配置文件]
        ├── .gitignore                        [配置git操作会忽略的文件]
        ├── buildConfig.js                    [构建配置文件]
        ├── gulpfile.js                       [gulp任务执行入口文件]
        ├── HISTORY.md                        [修改记录]
        ├── index.html                        [spa入口]
        ├── make-webpack.config.js            [webpack-config统一配置文件]
        ├── package.json                      [前端项目依赖配置]
        ├── READMD.md                         [你在看的文件]
        ├── routes.js                         [koa proxy路由]
        ├── server-with-mock.js               [koa利用中间件起本地服务]
        ├── webpack-dev-mock.config.js        [带mock功能的本地服务配置]
        ├── webpack-dev-server.config.js      [不带hmr功能的本地服务配置]
        ├── webpack-hot-dev-server.config.js  [带hmr功能的本地服务配置]
        └── webpack-production.config.js      [构建用于部署的静态资源文件配置]

### 依赖说明
  lodash
  "react-router": "1.0.0-beta3"  不稳定版本，后续要关注下更新


### webpack 记录

 - output 里的 publicPath: '/build/' 注释掉，此配置会导致生成build中的css引用的字体路径为/build/xxxx (publicPath:'/')

### BUG LIST

console 报错 Invariant Violation: addComponentAsRefTo(...): Only a ReactOwner can have refs. This usually means that you're trying to add a ref to a component that doesn't have an owner (that is, was not created inside of another component's `render` method). Try rendering this component inside of a new top-level component which will hold the ref.

解决方法：同时使用了两个版本的react,删除本地的react即可

#### react-highcharts 用webpack打包，使用babel打包后报错

解决方法：react-highcharts自身已经用webpack打包，二次打包时添加 'use strict'; 
手动删除 'use strict'; 报错消失，通过配置webpack config 的loader,修改{test: /\.(js)$/,loader: 'babel-loader?loose=all'}, 为 {test: /\.(js)$/,exclude: /node_modules/,loader: 'babel-loader?loose=all'}, 可以解决此问题。

#### 重构代码组织目录，点击菜单报错

`type.toUpperCase() is not a function` 
由于重构 sideItem ,sideNav 导致了循环引用。webpack并未报错，只是返回了 {} 。导致 React无法识别。

#### Reflux问题记录
模型：
    Stroe : state [a:'',b:''] ,
            onGetA: Ajax , trigger({a:a})
            onGetB: Ajax , trigger({b:b})
    componentsDidMount : Action.getA , Action.getB

问题：组件中的显示情况，当ajax获取到数据a后，组件中的a数据更新，当ajax获取到数据b后，组件中的b数据更新了，但是之前a数据更新的结果消失了。
调试：render中用console.log查看组件的state，一共有三条记录:
    this.state a:'',b:'' 第一次渲染
    this.state a;'value' ajax获取到了a的数据，但是state中没有b
    this.state b:'value' ajax获取到了b的数据，但是state中没有a
解决方法：
    将store中的trigger({a:a}),trigger({b:b})都修改为trigger({a:a,b:b})

#### jsPlumb 打包 

imports-loader 
exports-loader 

webpack.config.js :

    module.noParse : /min\.js|jsPlumb.*\.js/  ### 不解析依赖


usage method 1:

        var jsPlumb = require('imports-loader?this=>window!exports-loader?jsPlumb!./dom.jsPlumb-1.7.7-min.js');

usage method 2: 

        require('jsPlumb') ;
        // webpack.config.js 
        loaders: {test: /\.jsPlumb.*\.js$/, loader: 'imports-loader?this=>window!exports-loader?jsPlumb'}
        // or  resolve.alias 

#### moment-timezone 

webpack 加载 moment-timezone 问题处理：
http://stackoverflow.com/questions/29548386/how-should-i-use-moment-timezone-with-webpack
