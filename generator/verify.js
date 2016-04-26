var sha1 = require('sha1');


module.exports = function (opt) {
    return function *(next) {
        console.log(this.query);
        // get somthing
        var token = opt.token,
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

    }
};
