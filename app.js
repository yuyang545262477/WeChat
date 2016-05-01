'use strict';

var Koa = require('koa');
var config = require('./config');
var weixin = require('./weixin');
var wechat = require('./generator/g');

//initial Koa

var app = new Koa();

app.use(wechat(config.wechat, weixin.reply));

app.listen(4925);
console.log('its running : 4925');






