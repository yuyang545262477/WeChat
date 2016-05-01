'use strict';
exports.reply = function *(next) {
    var message = this.weixin;
    
    if (message.MsgType == 'event' && message.Event == 'subscribe') {
        this.body = '关注了.....';
    } else if(message.MsgType == 'text') {
        this.body = 'hahah';
    }
    
    yield  next;
};


