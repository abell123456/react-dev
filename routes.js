/*
 * @Info: koa proxy路由配置
 * @Author: xiangzhong.wxz
 * @Date:   2015-12-05
 * @Last Modified by:   xiangzhong.wxz
 * @Last Modified time: 2015-12-05
 */

'use strict';

var proxy = require('koa-proxy'), // 用于设置代理，暂时未用到
    list = require('./mock/mock-list'),
    req, res;

module.exports = function(router, app) {
    router.get('/api/list', function*() {
        req = this.query.req;
        res = list[req];

        if (res) {
            this.body = (typeof res === 'function') ? res(this.query) : res;
        }
    });
};
