/**
 * 执行构建的任务，会将构建出的文件放置于目标文件夹中
 */

import gutil from 'gulp-util';
import webpack from 'webpack';
import definePlugin from './utils/define-plugin.js';

// 优化插件
const optimizations = [
    definePlugin,
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
        output: {
            comments: false,
        },
        compress: {
            warnings: false,
        }
    })
];

// 获取构建配置
const buildConfig = require('../buildConfig');
// 获取webpack config
const wpConfig = buildConfig.webpackConfig.production;

// 导出用于初始化的模块
export default (gulp) => {
    gulp.task('build', function(callback) {
        wpConfig.plugins = wpConfig.plugins ? wpConfig.plugins.concat(
            optimizations) : optimizations;
        // 运行 webpack
        webpack(wpConfig, function(err, stats) {
            if (err) {
                throw new gutil.PluginError('webpack', err);
            }

            // 出错时打印出错误
            gutil.log('[webpack]: ', stats.toString({
                chunks: false,
                modules: false,
                colors: true,
            }));

            callback();
        });
    });
};
