'use strict';
var path = require('path');
var util = require('./libs/util');
var wechat_file = path.join(__dirname, './config/wechat.txt');

var config = {
    wechat: {
        appID: 'wxa41198eb824d5209',
        appSecret: '6dabafc584ea2af75a148e956cb206de',
        token: 'yuxiaoyang',
        getAccessToken: function () {
            return util.readFileSync(wechat_file);
        },
        saveAccessToken: function (data) {
            //noinspection JSDuplicatedDeclaration
            var data = JSON.stringify(data);
            return util.writeFileSync(wechat_file, data);
        }
        
    }
};

module.exports = config;