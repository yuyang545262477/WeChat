'use strict';

//引用模块
var fs = require('fs');
var Promise = require('bluebird');


//导出函数
//1.readFileSync
exports.readFileSync = function (fpath, encoding) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fpath, encoding, function (err, content) {
            if (err) {
                reject(err);
            } else {
                resolve(content);
            }
        })
    })
};
//2.writeFileSync
exports.writeFileSync = function (fpath, content) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(fpath, content, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(content);
            }
            
        })
        
    })
};




