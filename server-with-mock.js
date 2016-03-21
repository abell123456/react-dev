'use strict';

var http = require('http'),
    path = require('path'),

    koa = require('koa'),
    router = require('koa-router')(),
    serve = require('koa-static'),
    colors = require('colors'),

    pkg = require('./package.json'),
    env = process.env.NODE_ENV,
    debug = !env || env === 'development',
    viewDir = './',
    routes = require('./routes'),

    // koa初始化
    app = koa();

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

// 基本设置
app.keys = [pkg.name, pkg.description];
app.proxy = true;

// 全局事件监听
app.on('error', function(err, ctx) {
    err.url = err.url || ctx.request.url;
    console.error(err, ctx);
});

// favicon.ico
app.use(function*(next) {
    if (this.url.match(/favicon\.ico$/)) {
        this.body = '';
    } 
    
    yield next;
});

app.use(function*(next) {
    console.log(this.method.info, this.url);
    yield next;
});

// 使用routes
routes(router, app);
app.use(router.routes());

if (debug) {
    var webpackDevMiddleware = require('koa-webpack-dev-middleware'),
        webpack = require('webpack'),
        webpackDevConf = require('./webpack-dev-mock.config');

    app.use(webpackDevMiddleware(webpack(webpackDevConf), {
        contentBase: webpackDevConf.output.path,
        publicPath: webpackDevConf.output.publicPath,
        hot: true,
        stats: {
            cached: false,
            colors: true
        }
    }));
}

// 处理静态资源文件
app.use(serve(path.resolve(__dirname, viewDir), {
    maxage: 0
}));

app = http.createServer(app.callback());

app.listen(3005, '0.0.0.0', function() {
    console.log('app listen localhost:3005 success.');
});
