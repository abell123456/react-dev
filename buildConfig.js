module.exports = {
    webpackConfig: {
        debug: require('./webpack-dev-server.config.js'),
        debugHot: require('./webpack-hot-dev-server.config.js'),
        production: require('./webpack-production.config.js')
    },
    devServer: {
        // webpack-dev-server的设置
        proxy: {
            // 在这里放置你定制的代理路由, e.g.:
            // '/api/': 'http://localhost:8081'
        },
        headers: {
            // put your custom headers here, e.g.:
            // 'X-TEST': 1
        }
    }
};
