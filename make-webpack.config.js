/*
 * @Author: xiangzhong.wxz
 * @Date:   2015-12-05
 * @Last Modified by:   xiangzohng.wxz
 * @Last Modified time: 2015-12-05
 * @info: 因为是多版本，故不再搞hash路径生成：[contenthash:8]
 */

'use strict';

var webpack = require('webpack'),
    path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    pkg = require('./package.json'),
    appDir = path.resolve(process.cwd(), 'app'),
    CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
    fs = require('fs'),
    excludeFromStats = [
        /node_modules[\\\/]/
    ],

    config;

module.exports = function(options) {
    options = options || {};

    var debug = options.debug || false,
        hot = options.hot || false,
        mock = options.mock || false,
        baseEntry = [
            'webpack-dev-server/client?http://0.0.0.0:8080',
            'webpack/hot/only-dev-server',
            './app/app.js'
        ],

        entry = (mock || !debug) ? {
            app: baseEntry[2]
        } : (hot ? baseEntry : (baseEntry.splice(1, 1), baseEntry)),

        devtool = debug ? 'inline-source-map' : null,

        providePlugin = [new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            React: "react",
            Reflux: 'reflux'
        })],
        plugins = debug ?

        (hot ? providePlugin.concat(new webpack.HotModuleReplacementPlugin()) : providePlugin) :

        providePlugin.concat(new ExtractTextPlugin('app.min.css', {
            allChunks: true
        }), new HtmlWebpackPlugin({
            // template: path.resolve(__dirname, 'index.html'),
            templateContent: function(templateParams, compilation) {
                return fs.readFileSync(path.resolve(__dirname, 'index.html')).toString().replace(/<script[^>]*>(\s|\n|\r)*<\/script>/ig, '');
            },
            filename: 'index.html',
            inject: 'body',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                minifyJS: true,
                minifyCSS: true
            }
        })),

        module = debug ? {
            /*preLoaders: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'eslint'
            }],*/
            loaders: [{
                test: /\.css$/,
                loaders: ['style', 'css']
            }, {
                test: /\.json$/,
                loader: 'json'
            }, {
                test: /\.less$/,
                loaders: ['style', 'css', 'less']
            }, {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass']
            }, {
                test: /\.styl$/,
                loaders: ['style', 'css', 'stylus']
            }, {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel?loose=all']
            }, {
                test: /\.woff\d?(\?.+)?$/,
                loader: 'url?limit=10000&minetype=application/font-woff'
            }, {
                test: /\.ttf(\?.+)?$/,
                loader: 'url?limit=10000&minetype=application/octet-stream'
            }, {
                test: /\.eot(\?.+)?$/,
                loader: 'url?limit=10000'
            }, {
                test: /\.svg(\?.+)?$/,
                loader: 'url?limit=10000&minetype=image/svg+xml'
            }, {
                test: /\.png$/,
                loader: 'url?limit=10000&mimetype=image/png'
            }, {
                test: /\.gif$/,
                loader: 'url?limit=10000&mimetype=image/gif'
            }]
        } : {
            loaders: [{
                test: /\.(jsx?)$/,
                exclude: /node_modules/,
                loader: 'babel?loose=all'
            }, {
                test: /\.json$/,
                loaders: ["json"]
            }, {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style',
                    'css!less')
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style',
                    'css?minimize')
            }, {
                test: /\.png$/,
                loader: 'url?mimetype=image/png'
            }, {
                test: /\.gif$/,
                loader: 'url?mimetype=image/gif'
            }, {
                test: /\.jpe?g$/,
                loader: 'url?mimetype=image/jpeg'
            }, {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file?name=fonts/[name].[ext]'
            }]
        },

        resolve = debug ? {
            root: path.resolve(__dirname),
            extensions: ['', '.js', '.jsx'],
            modulesDirectories: ['node_modules']
        } : {
            root: path.resolve(__dirname),
            packageMains: ['style', 'main'],
            extensions: ['', '.js', '.json', '.jsx', '.css', '.less'],
            modulesDirectories: ['node_modules', 'app']
        };

    config = {
        target: 'web',
        devtool: devtool,
        debug: debug,
        context: path.resolve(__dirname),
        entry: entry,
        output: {
            path: path.join(__dirname, '.build', pkg.name),
            publicPath: '/' + pkg.name + '/',
            filename: debug ? 'app.js' : 'app.min.js'
        },
        resolve: resolve,
        node: {
            fs: 'empty',
        },
        module: module,
        plugins: plugins,
        devServer: {
            stats: {
                cached: false,
                exclude: excludeFromStats,
                colors: true
            }
        }
    };

    if (!debug) {
        config.frameworks = ['webpack'];
    }

    if (debug) {
        config.eslint = {
            configFile: path.join(__dirname, '.eslintrc'),
        };
    }

    return config;
};