'use strict';

var sha1 = require('sha1');
var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var prefix = 'https://api.weixin.qq.com/cgi-bin/token?';
var api = {
    accessToken: prefix + 'grant_type=client_credential'
};


function Wechat(opt) {
//    读取文件,判断文件是否过期
//    如果过期,就从微信服务器重新获取一次,新的票据信息,写入文件中
//    两个点:票据的读出,票据的写入.
    
    var that = this;
    this.appID = opt.appID;
    this.appSecret = opt.appSecret;
    
    this.getAccessToken = opt.getAccessToken;
    this.saveAccessToken = opt.saveAccessToken;
    
    
    this.getAccessToken()
        //    第一步:由于从静态资源取出为字符串,所以转化成JOSN格式 .
    .then(function (data) {
        try {
            data = JSON.parse(data);
        }
        catch (e) {
            //    如果失败,则更新票据
            return that.updateAccessToken();//updateAccessToken还没有写.
        }
        //    第二部,检测合法性
        if (that.isValidAccessToken(data)) {
            //    如果合法,则通过promise resolve向下传递
            Promise.resolve(data);
        } else {
            //    如果不合法,同样需要,更新票据
            return that.updateAccessToken();
        }
    })
        //    获得合法token 将其挂在实例上
    .then(function (data) {
        that.access_token = data.access_token;
        that.expires_in = data.expires_in;  //过期的东西
        
        //保存起来
        that.saveAccessToken(data);
        
        
    })
}
/*
 * 实现合法性检查,
 * 将其增加在原型连上.
 * */

Wechat.prototype.isValidAccessToken = function (data) {
//    第一步,检查是否存在
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }
//    第二部,检测是否过期
    
    var expires_in = data.expires_in;   //获得票据的过期日期.
    var now = new Date().getTime();
    return now < expires_in;
    
    
};

/*
 * 更新票据
 * 同样挂在圆形链上.
 * */
Wechat.prototype.updateAccessToken = function () {
//    第一步,获取appID和appSecret
    var appID = this.appID;
    var appSecret = this.appSecret;
    var url = api.accessToken + '&appid=' + appID + '&secret=' + appSecret;
    
    return new Promise(function (resolve, reject) {
        request({url: url, json: true})
        .then(function (response) {
//    在得到请求地址之后. 通过request 进行请求,更新
            console.log(typeof response);
            var data = response.body;                 //获得信息
            console.log(data);
            var now = new Date().getTime();         //获得当前日期
            data.expires_in = now + (data.expires_in - 20) * 1000;
            resolve(data);
        })
    })
    
};


module.exports = function (opt) {
    var wechat = new Wechat(opt);
    
    //服务器设置验证部分
    return function *(next) {
        console.log(this.query);
        // get somthing
        var token = opt.token;
        var signature = this.query.signature;
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var echostr = this.query.echostr;
        //  deal with sthing.
        var str = [token, timestamp, nonce].sort().join(''),
            sha = sha1(str);
        
        if (sha == signature) {
            this.body = echostr;
        } else {
            console.log('wrong');
        }
        
    }
};
