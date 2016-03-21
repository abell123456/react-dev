/**
 * @Info: 数据mock配置文件，配置说明如下：
 * 1、每一个配置对象对应一个接口；
 * 2、请求url统一为"/api/list"，不同接口需要在请求参数中配置req参数。下面export的对象中的属性即为不同req配置的返回数据；
 */

'use strict';

module.exports = {
    // 立即执行请求
    'exec-immediate': {
        code: 200,
        data: {
            score: 80,
            detail: [{
                rule: 'rule1',
                point: -2
            }, {
                rule: 'rule2',
                point: -6
            }, {
                rule: 'rule3',
                point: -5
            }, {
                rule: 'rule4',
                point: -3
            }, {
                rule: 'rule5',
                point: -1
            }]
        }
    },

    // 执行管理页搜索输入框实时联想
    'execute-link': (query) => {
        if (query.search === '') {
            return {
                status: true,
                returnData: []
            };
        } else {
            return {
                status: true,
                returnData: [{
                    id: "1",
                    name: 'link1'
                }, {
                    id: "2",
                    name: 'link2'
                }, {
                    id: "3",
                    name: 'link3'
                }]
            };
        }
    },

    // 执行管理搜索结果
    'execute-search': (query) => {
        query = query || {
            curPage: 1
        };

        if (query.search === '') {
            return {
                status: true,
                data: []
            };
        } else {
            return {
                status: true,
                totalPage: 2,
                curPage: query.curPage,
                data: [{
                    time: '17:20',
                    rule1: '-10',
                    rule2: '20',
                    // TODO:这里的value需要根据返回数据修改
                    operation: ''
                }, {
                    time: '17:25',
                    rule1: '-30',
                    rule2: '10',
                    operation: ''
                }]
            };
        }
    },

    // 工单管理页搜索输入框实时联想
    'worksheet-link': (query) => {
        if (query.search === '') {
            return {
                status: true,
                returnData: []
            };
        } else {
            return {
                status: true,
                returnData: [{
                    id: "1",
                    name: 'link1'
                }, {
                    id: "2",
                    name: 'link2'
                }, {
                    id: "3",
                    name: 'link3'
                }]
            };
        }
    },

    // 工单管理页搜索
    'worksheets-search': (query) => {
        query = query || {
            curPage: 1
        };
        let returnData = {
            1: {
                status: true,
                totalPage: 2,
                curPage: query.curPage,
                data: [{
                    worksheetName: '工单1',
                    worksheetId: '1',
                    result: [{
                        name: '业务线名称',
                        value: 'ww'
                    }, {
                        name: '执行时间',
                        value: '2015-12-20'
                    }, {
                        name: '状态',
                        value: 'create'
                    }]
                }, {
                    worksheetName: '工单2',
                    worksheetId: '2',
                    result: [{
                        name: '业务线名称',
                        value: 'dd'
                    }, {
                        name: '执行时间',
                        value: '2015-12-21'
                    }, {
                        name: '状态',
                        value: 'processing'
                    }]
                }]
            },
            2: {
                status: true,
                totalPage: 2,
                curPage: query.curPage,
                data: [{
                    worksheetName: '工单3',
                    worksheetId: '3',
                    result: [{
                        name: '业务线名称',
                        value: 'ww'
                    }, {
                        name: '执行时间',
                        value: '2015-12-20'
                    }, {
                        name: '状态',
                        value: 'create'
                    }]
                }, {
                    worksheetName: '工单4',
                    worksheetId: '4',
                    result: [{
                        name: '业务线名称',
                        value: 'dd'
                    }, {
                        name: '执行时间',
                        value: '2015-12-21'
                    }, {
                        name: '状态',
                        value: 'processing'
                    }]
                }]
            }
        };

        return returnData[query.curPage];
    },

    // 接收单子
    'accept-worksheet': (query) => {

        return {
            worksheetName: '工单' + query.worksheetId,
            worksheetId: query.worksheetId,
            result: [{
                name: '业务线名称',
                value: 'ww'
            }, {
                name: '执行时间',
                value: '2015-12-20'
            }, {
                name: '状态',
                value: 'complete'
            }]
        }

    },

    'complete-worksheet': (query) => {
        return {
            worksheetName: '工单' + query.worksheetId,
            worksheetId: query.worksheetId,
            result: [{
                name: '业务线名称',
                value: 'ww'
            }, {
                name: '执行时间',
                value: '2015-12-20'
            }, {
                name: '状态',
                value: 'complete'
            }]
        };
    }
};
