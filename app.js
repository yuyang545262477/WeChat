'use strict';

var Koa = require('koa');
var sha1 = require('sha1');
var config = {
    wechat: {
        appID: 'wxa41198eb824d5209',
        appSecret: '6dabafc584ea2af75a148e956cb206de',
        token: 'yuxiaoyang'
    }
};

//initial Koa

var app = new Koa();

app.use(function *(next) {
    console.log(this.query);
    // get somthing
    var token = config.wechat.token,
        signature = this.query.signature,
        nonce = this.query.nonce,
        timestamp = this.query.timestamp,
        echostr = this.query.echostr;
    //  deal with sthing.

    var str = [token, timestamp, nonce].sort().join(''),
        sha = sha1(str);

    if (sha == signature) {
        this.body = echostr + '';
    } else {
        this.body = 'wrong';
    }


});

app.listen(8080);
console.log('its running : 8080');


