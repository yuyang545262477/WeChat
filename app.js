'use strict';

var Koa = require('koa');
var sha1 = require('sha1');
var config = {
    wechat: {
        appID: 'wx4899993eb525d224',
        appSecret: 'bf6a554e226a37380779aecbed719233',
        token: 'yuxiaoyang'
    }
};

//initial Koa

var app = new Koa();

app.use(function *(next) {
    console.log(this.query);
});

app.listen(8080);
console.log('its running : 8080');


