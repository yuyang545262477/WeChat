# wecaht development(保持清晰的思维)
---

##  在没有域名和服务器的临时方案.

*.  1.本地开启服务器 (python nodejs)

*.  2.  安装腾讯浏览器,并且,安装微信调试工具.

*.  3.  将app设置的端口号,输入进去,启动服务.

*.  3.进行开发.

#   一.接口信息验证

*.  1.自己设置token值

*.  2.微信服务器发送get请求.

*.  3.获得参数:signature,echostr,timestamp,nonce 四个参数

*.  4.将token,timestamp,nonce按顺序,放入数组.

*.  5.排序

*.  6.放入字符串中

*.  7.sha1加密

*.  8.将加密后的值,与signature进行比对

*.  9.如果正确,原样返回echostr

*.  10.完.


#   二.获取access_token






    
    
    
    
    
    


