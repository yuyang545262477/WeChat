'use strict';

var xml2js = require('xml2js');
var Promise = require('bluebird');
var log = require('./log');


exports.parseXMLAsync = function (xml) {
    return new Promise(function (resolve, reject) {
        xml2js.parseString(xml, {trim: true}, function (err, data) {
            err ? reject(err) : resolve(data);
        })
    })
};
//以下是formatMessage 老师的代码.

//对解析后的xml进行深层次的解析.
// function formatMessage(result) {
//     var message = {};
//     log('1.......' + result);
//     if (typeof result === 'object') {
//         //    获取key值
//         var keys = Object.keys(result);
//        
//        
//         for (var i = 0, length = keys.length; i < length; i++) {
//             //value
//             var item = result[keys[i]];
//             //    index
//             var key = keys[i];
//             //    判断item 
//             if (!(item instanceof Array) || item.length === 0) {
//                 continue;
//             }
//             if (item.length == 1) {
//                 var val = item[0];
//                
//                 if (typeof val === 'object') {
//                     message[key] = formatMessage(val);
//                    
//                 } else {
//                     message[key] = (val || '').trim();
//                 }
//             } else {
//                 message[key] = [];
//                 for (var j = 0, k = item.length; j < k; j++) {
//                     message[key] = formatMessage(item[j]);
//                 }
//             }
//         }
//     }
//     return message;
//    
// }         

function formatMessage(xml) {
    var message = {};
//    第一步,判断xml类型
    if (typeof xml === 'object') {
//    第二部,筛选index为xml的值
        var a = Object.keys(xml);
        var content = xml[a];
//    第三部,对xml的值,进行for in 循环
        var x;
        for (x in content) {
            message[x] = (content[x][0]);
        }
        
        
    }
    return message;
//    第四步,对之后content,去除数组.
    
    
}
exports.formatMessage = formatMessage;