//转换时间戳
function timestampToTime(timestamp) {
let date
if (timestamp.length == 13) date = new Date(timestamp);
else date = new Date(timestamp * 1000);
let Y = date.getFullYear() + '-';
let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
return Y + M + D + h + m + s;
}

//搜索
const search = (key) => {
let response = POST("https://api-new.iqingguo.com/apiv1/book/search",{data: `keyword=${key}&page=1`})
let $ = JSON.parse(response)
let array = []
$.data.list.forEach((child) => {
array.push({
name: child.title,
author: child.author,
cover: child.coverpic,
detail: child.id,
})
})
return JSON.stringify(array)
}

//详情
const detail = (url) => {
let response = POST("https://api-new.iqingguo.com/apiv1/book/detail",{data: `bid=${url}`})
let $ = JSON.parse(response).data
let book = {
summary: $.remark,
status: $.finishtime == 0 ? '连载' : '完结',
category: $.genre,
words: $.words,
update: timestampToTime($.update_time),
lastChapter: $.allchapter,
catalog: $.id
}
return JSON.stringify(book)
}

//目录
const catalog = (url) => {
let response = POST("https://api-new.iqingguo.com/apiv1/book/chapter",{data: `bid=${url}`})
let $ = JSON.parse(response)
let array = []
$.data.forEach((chapter) => {
array.push({
name: chapter.title,
url: chapter.id
})
})
return JSON.stringify(array)
}

//章节
const chapter = (url) => {
let response = POST("https://api-new.iqingguo.com/apiv1/book/chapterdetail",{data: `sid=${url}&sessionkey=`})
let $ = JSON.parse(response).data
return $.content
}

var bookSource = JSON.stringify({
name: "青果阅读",
url: "iqingguo.com",
version: 100
})
