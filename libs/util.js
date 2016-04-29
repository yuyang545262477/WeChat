'use strict';

//引用模块
var fs = require('fs');
var Promise = require('bluebird');
var log = require('../generator/log');


//导出函数
//1.readFileSync
exports.readFileSync = function (fpath, encoding) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fpath, encoding, function (err, content) {
            console.log('........正在读取文件');
            if (!err) {
                log('读取成功......');
                resolve(content);
            } else {
                console.log('读取文件失败........');
                reject(err);
            }
        })
    })
};
//2.writeFileSync
exports.writeFileSync = function (fpath, content) {
    log('..........启动任务');
    return new Promise(function (resolve, reject) {
        fs.writeFile(fpath, content, function (err) {
            log('保存地址   :' + fpath + '\t');
            log('保存内容   :' + content + '\t');
            if (err) {
                log('任务失败>>>>>>>>>' + err);
                reject(err)
            } else {
                log('任务成功>>>>>>>>>>');
                resolve(content);
                log('>===结束保存文件====<');
            }
            
        })
        
    })
};




