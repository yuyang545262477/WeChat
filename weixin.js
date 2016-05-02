'use strict';
var path = require('path');
var config = require('./config');
var Wechat = require('./generator/token');
var log = require('./generator/log');


var wechatApi = new Wechat(config.wechat);

exports.reply = function *(next) {
    var message = this.weixin;
    /*
     * 监听事件.
     * */
    
    //关注事件
    if (message.MsgType === 'event' && message.Event === 'subscribe') {
        if (message.EventKey) {
            this.body = "哎哟,你关注的途径还不一样哟.";
        } else {
            this.body = "欢迎关注.";
        }
    }
    //取消关注事件
    if (message.MsgType === 'event' && message.Event === 'unsubscribe') {
        this.body = '';
        console.log('无情取关了.');
    }
    
    //上报地理位置事件.
    if (message.MsgType === 'event' && message.Event === 'LOCATION') {
        this.body = '你上报了地理位置\n' + '经度:' + message.Longitude + '\n纬度' + message.Latitude;
    }
    
    //自定义菜单事件一:拉去信息
    if (message.MsgType === 'event' && message.Event === "CLICK") {
        this.body = "点击了,拉取信息按钮" +
            "按钮代码是: \t" + message.EventKey;
    }
    //自定义菜单事件二:
    if (message.MsgType === 'event' && message.Event === 'VIEW') {
        this.body = "你点击了,菜单跳转事件\t" + message.EventKey;
    }
    
    
    /*
     *   接受普通消息. 
     *   一共7种
     * */
    
    //接受文本消息
    switch (message.MsgType) {
        //文字
        case 'text':
            // this.body = "哈哈哈,不想和你聊天";
            if (message.Content === '1') {
                log('收到微信服务器传递过来的信息....');
                var _data = yield  wechatApi.uploadMaterial('image', __dirname + '/2' +
                    '.jpg');
                this.body = {
                    type: 'image',
                    MediaId:_data.media_id
                };
                
            } else {
                this.body = '哈哈哈哈';
            }
            break;
        //图片
        case 'image':
            this.body = "你发的是图片" + message.PicUrl;
            break;
        //语音
        case 'voice':
            this.body = '你发的是语音' + message.Format;
            break;
        //视频
        case 'video':
            this.body = '你发的是视频' + message.ThumbMediaId;
            break;
        //    小视频
        case 'shortvideo':
            this.body = '你发的是小视频' + message.ThumbMediaId;
            break;
        //    地理位置
        case 'location':
            this.body = '你发送的是地理位置' + 'x:\t' + message.Location_X + '\ny:\t' + message.Location_Y;
            break;
        //    链接
        case 'link':
            this.body = '链接,我不点..' + message.Url;
            break;
        default:
            this.body = "我真不知道,你发送的是什么";
        
        
    }
    yield  next;
};


