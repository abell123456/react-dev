/**
 * 开发模式的构建，注意，此时构建出的所有文件都位于内存中
 */

/* eslint no-console: 0 */
import debugCommon from './utils/debug-common';

const buildConfig = require('../buildConfig');
const wpConfig = buildConfig.webpackConfig.debugHot;

export default (gulp) => {
    debugCommon(gulp, wpConfig, 'debugHot');
};
