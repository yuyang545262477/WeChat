'use strict';

var sha1 = require('sha1');
var getRawBody = require('raw-body');
var Wechat = require('./token');
var log = require('./log');
var xml2js = require('./xml2js');

module.exports = function (opt) {
    
    var wechat = new Wechat(opt);
    // setInterval(Wechat(opt),1000);
    
    
    //服务器设置验证部分
    return function *(next) {
        console.log(this.query);
        var that = this;
        // get somthing
        var token = opt.token;
        var signature = this.query.signature;
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var echostr = this.query.echostr;
        //  deal with sthing.
        var str = [token, timestamp, nonce].sort().join(''),
            sha = sha1(str);
        //判断请求
        if (this.method === 'GET') {
            if (sha == signature) {
                this.body = echostr;
            } else {
                console.log('wrong');
            }
        } else if (this.method === 'POST') {
            if (sha !== signature) {
                this.body = 'wrong';
                return false;
            }
            var data = yield getRawBody(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            });
            
            
            var content = yield xml2js.parseXMLAsync(data);
            // log(content);
            var message = xml2js.formatMessage(content);
            log(message);
            //    开启回复模式..
            if (message.MsgType == 'text') {
                // if (message.Event == 'subscribe') {
                //    生成当前时间
                var now = new Date().getTime();
                //    返回状态吗
                that.status = 200;
                //    返回类型
                that.type = 'application/xml';
                //    返回主题
                that.body =
                    "<xml>" +
                    "<ToUserName><![CDATA[" + message.FromUserName + "]]></ToUserName>" +
                    "<FromUserName><![CDATA[" + message.ToUserName + "]]></FromUserName>" +
                    "<CreateTime>"+ now + " </CreateTime>" +
                    "<MsgType><![CDATA[text]]></MsgType>" +
                    "<Content><![CDATA[哈哈哈哈]]></Content>" +
                    "</xml> ";
                log(that.body);
                return;
                // }
            }
            
            
        }
        
    }
};
