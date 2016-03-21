/**
 * 开发模式的构建，注意，此时构建出的所有文件都位于内存中
 */

/* eslint no-console: 0 */
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import definePlugin from './define-plugin.js';

const optimizations = [definePlugin];

const buildConfig = require('../../buildConfig');

export default (gulp, wpConfig, taskName) => {
    taskName = taskName || 'debug';

    gulp.task(taskName, function() {
        wpConfig.plugins = wpConfig.plugins ? wpConfig.plugins.concat(
            optimizations) : optimizations;

        let proxy = {};
        if (buildConfig.devServer && buildConfig.devServer.proxy) {
            proxy = buildConfig.devServer.proxy;
        }
        let headers = {};
        if (buildConfig.devServer && buildConfig.devServer.headers) {
            headers = buildConfig.devServer.headers;
        }

        const compiler = webpack(wpConfig);
        const server = new WebpackDevServer(compiler, {
            contentBase: wpConfig.context,
            hot: taskName === 'debugHot',
            quiet: false,
            noInfo: false,
            watchOptions: {
                aggregateTimeout: 300,
                poll: true
            },
            headers,
            stats: {
                chunks: false,
                colors: true
            },
            historyApiFallback: true,
            proxy
        });
        server.listen(8080, 'localhost', function() {
            console.log('Webpack-Dev-Server: started on port 8080');
        });
    });
};
