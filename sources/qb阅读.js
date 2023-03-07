//转换更新时间 时间戳
function timestampToTime(timestamp) {
if(timestamp.toString().length == 13) var date = new Date(timestamp);
else var date = new Date(timestamp * 1000);
var Y = date.getFullYear() + '-';
var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
return Y+M+D+h+m+s;
}

//搜索
const search = (key) => {
let response = GET(`https://so.html5.qq.com/ajax/real/search_result?tabId=360&q=${key}`)
let array = []
let $ = JSON.parse(response).data.state.filter(function(item) {
return item.dataName == "novel_search_list"
});
$.forEach((child) => {
array.push({
name: child.items[0].title,
author: child.items[0].author,
cover: child.items[0].cover_url,
detail: child.items[0].jump_url
})
})
return JSON.stringify(array)
}

//详情
const detail = (url) => {
let response = GET(`https://novel.html5.qq.com/qbread/api/novel/bookInfo?resourceId=${url.query("bookid")}`,{headers:[`Referer:https://novel.html5.qq.com/`]})
let $ = JSON.parse(response).data.bookInfo
let book = {
summary: $.summary,
status: $.isfinish == 0 ? "连载" : "完结",
category: $.tag ? $.tag.replaceAll("|"," ") : $.subtype,
words: $.sourcesize || $.contentsize,
update: timestampToTime($.lastUpdatetime),
lastChapter: $.lastSerialname,
catalog: url
}
return JSON.stringify(book)
}

//目录
const catalog = (url) => {
let response = GET(`https://novel.html5.qq.com/qbread/api/book/all-chapter?bookId=${url.query("bookid")}`,{headers:["referer:https://novel.html5.qq.com"]})
let $ = JSON.parse(response)
let array = []
$.rows.forEach((chapter) => {
array.push({
name: chapter.serialName,
url: `${url}&cid=${chapter.serialID}`
})
})
return JSON.stringify(array)
}

//章节
const chapter = (url) => {
let response = GET(`https://novel.html5.qq.com/qbread/api/wenxue/buy/ad-chapter/v3?resourceid=${url.query("bookid")}&serialid=${url.query("cid")}&apn=1`,{headers:[`Referer:https://novel.html5.qq.com/`]})
let $ = JSON.parse(response)
return $.data.content.join("\n")
}

var bookSource = JSON.stringify({
name: "qb阅读",
url: "qbread.cn",
version: 100
})