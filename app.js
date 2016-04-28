'use strict';

var Koa = require('koa');
var verify = require('./generator/verify');
var config = {
    wechat: {
        appID: 'wxa41198eb824d5209',
        appSecret: '6dabafc584ea2af75a148e956cb206de',
        token: 'yuxiaoyang'
    }
};

//initial Koa

var app = new Koa();

app.use(verify(config.wechat));

app.listen(8080);
console.log('its running : 8080');






