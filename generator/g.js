'use strict';

var sha1 = require('sha1');
var Promise = require('bluebird');
var log = require('./log');
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
            log('...........正在编译文件');
            data = JSON.parse(data);
            log('编译文件完成............');
        }
        catch (e) {
            log('编译失败.......开始更新票据');
            //    如果失败,则更新票据
            return that.updateAccessToken();
        }
        //    第二部,检测合法性
        log('正在检测,票据的有效性..........');
        if (that.isValidAccessToken(data)) {
            //    如果合法,则通过promise resolve向下传递
            log('===>检测:合格<====');
            return Promise.resolve(data);
        } else {
            //    如果不合法,同样需要,更新票据
            log('==>检测:失败<==');
            log('进行更新票据...........');
            return that.updateAccessToken();
        }
    })
    //    获得合法token 将其挂在实例上
    .then(function (data) {
        log('<==开始保存文件===>');
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
    log('............收到检测任务');
    log('检测文件完整性...........');
    if (!data || !data.access_token || !data.expires_in) {
        return false
    }
//    第二部,检测是否过期
    log('...........' + '完整度:100%');
    log('检测文件有效性.................');
    var expires_in = data.expires_in;   //获得票据的过期日期.
    var now = new Date().getTime();
    var heihei = now < expires_in;
    log('.............' + '结果:' + heihei);
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
        log('.......正在请求更新');
        request({url: url, json: true})
        .then(function (response) {
//    在得到请求地址之后. 通过request 进行请求,更新
            log('获得' +
                '文件类型:...........' + typeof response);
            var data = response.body;                 //获得信息
            log('获得重要文件......');
            log('..........正在设置过期时间');
            var now = new Date().getTime();         //获得当前日期
            data.expires_in = now + (data.expires_in - 20) * 1000;
            log('设置完成.............');
            resolve(data);
        })
    })
    
};


module.exports = function (opt) {
    var wechat = new Wechat(opt);
    // setInterval(Wechat(opt),1000);
    
    
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
