'use strict';
var log = require('./log');

var ejs = require('ejs');
var heredoc = require('heredoc');
//根据不同的MsgType类型,回复特定的内容模块.

var tpl = heredoc(function () {
    /*
     <xml>
     <ToUserName><![CDATA[<%=ToUserName%>]]></ToUserName>
     <FromUserName><![CDATA[<%=FromUserName%>]]></FromUserName>
     <CreateTime><%=CreateTime%></CreateTime>
     <MsgType><![CDATA[<%=MsgType%>]]></MsgType>
     
     <% if (MsgType === 'text'){%>
     <Content><![CDATA[<%=content%>]]></Content>
     
     <%}else if(MsgType === 'image'){%>
     <Image>
     <MediaId><![CDATA[<%=content.MediaId%>]]></MediaId>
     </Image>
     
     <%}else if(MsgType === 'voice'){%>
     <Voice>
     <MediaId><![CDATA[<%=content.MediaId%>]]></MediaId>
     </Voice>
     
     <%}else if(MsgType === 'video'){%>
     <Video>
     <MediaId><![CDATA[<%=content.MediaId%>]]></MediaId>
     <Title><![CDATA[<%=content.Title%>]]></Title>
     <Description><![CDATA[<%=content.Description%>]]></Description>
     </Video>
     
     <%}else if(MsgType === 'music'){%>
     <Music>
     <Title><![CDATA[<%=content.Title%>]]></Title>
     <Description><![CDATA[<%=content.Description%>]]></Description>
     <MusicUrl><![CDATA[<%=content.MusicUrl%>]]></MusicUrl>
     <HQMusicUrl><![CDATA[<%=content.HQMusicUrl%>]]></HQMusicUrl>
     <ThumbMediaId><![CDATA[<%=content.ThumbMediaId%>]]></ThumbMediaId>
     </Music>
     
     <%}else if(MsgType === 'news'){%>
     <ArticleCount><%=content.length%></ArticleCount>
     <Articles>
     <% content.forEach(function(item){%>
     <item>
     <Title><![CDATA[<%=item.Title%>]]></Title> 
     <Description><![CDATA[<%=item.Description%>]]></Description>
     <PicUrl><![CDATA[<%=item.PicUr%>]]></PicUrl>
     <Url><![CDATA[<%=item.Url%>]]></Url>
     </item>
     <%})%>
     </Articles>
     <%}%>
     </xml>
     */
});
//看一下tpl的输出
//编译模板
var compiled = ejs.compile(tpl);


exports = module.exports = {
    compiled: compiled
};



