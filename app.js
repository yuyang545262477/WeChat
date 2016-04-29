'use strict';

var Koa = require('koa');
var path = require('path');
var util = require('./libs/util');
var wechat = require('./generator/g');
var wechat_file = path.join(__dirname, './config/wechat.txt');
var config;
config = {
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
//initial Koa

var app = new Koa();
 
app.use(wechat(config.wechat));

app.listen(8080);
console.log('its running : 8080');






