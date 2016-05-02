'use strict';
var fs = require('fs');
var Promise = require('bluebird');
var log = require('./log');
var request = Promise.promisify(require('request'));
var util = require('./xml2js');
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    upload: prefix + 'media/upload?'//上海临时材料.
    
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
    this.fetchAccessToken();
    
}
Wechat.prototype.fetchAccessToken = function (data) {
    var that = this;

    //检测,是否存在合法的access_token
    if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
        return Promise.resolve(this);
    }
    
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
        that.access_token = data.access_token;
        that.expires_in = data.expires_in;  //过期的东西
        
        //保存起来
        that.saveAccessToken(data);
        return Promise.resolve(data);
    })
    
};

/*
 * 实现合法性检查,
 * 将其增加在原型连上.
 * */

Wechat.prototype.isValidAccessToken = function (data) {

    if (!data || !data.access_token || !data.expires_in) {
        return false
    }
//    第二部,检测是否过期

    var now = new Date().getTime();
    var expires_in = data.expires_in;   //获得票据的过期日期.
    

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

/*
 * 上传临时文件.
 * */
Wechat.prototype.uploadMaterial = function (type, pathfile) {
    log('进去upload方法.....');
    var that = this;
    var form = {
        media: fs.createReadStream(pathfile)
    };

//    新建Promise
    return new Promise(function (resolve, reject) {
        that
        .fetchAccessToken() //    获取全局的access_token
        .then(function (data) {
            //    存放,上传地址.
            var url = api.upload + 'access_token=' + data.access_token + '&type=' + type;
            //    拿到url 通过request进行上传
            request({method: 'POST', url: url, formData: form, json: true})
            .then(function (res) {
                if (!res.body) throw  new Error('上传,返回的信息,失败');
                resolve(res.body);
            })
        })
        .catch(function (err) {
            reject(err); //捕获整个流程的错误.
        })
    })
};

/*
 * 回复模板.
 * */
Wechat.prototype.reply = function () {
    var content = this.body;//拿到回复的内容
    var message = this.weixin;//拿到消息.

//    将回复的内容,和拿到的消息,传递给工具函数
    var xml = util.tpl(content, message);
    
    this.status = 200;
    this.type = 'application/xml';
    this.body = xml;
    
};
module.exports = Wechat;
    
