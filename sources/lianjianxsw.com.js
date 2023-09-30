require("crypto-js")

const decrypt = function (data) {
let key = CryptoJS.enc.Utf8.parse('6CE93717FBEA3E4F')
let iv = CryptoJS.enc.Utf8.parse('6CE93717FBEA3E4F')
decrypted = CryptoJS.AES.decrypt(data, key, {
iv: iv,
mode: CryptoJS.mode.CBC,
padding: CryptoJS.pad.NoPadding
})
return decrypted.toString(CryptoJS.enc.Utf8)
}

//搜索
const search = (key) => {
let data = JSON.stringify({
keyword: key
})
let response = POST("http://www.lianjianxsw.com/search",{data})
let array = []
let $ = JSON.parse(response)
$.data.forEach((child) => {
array.push({
name: child.name,
author: child.author,
cover: `http://www.lianjianxsw.com/pic/${child._id}.jpg`,
detail: `http://www.lianjianxsw.com/bookInfo?bookid=${child._id}`
})
})
return JSON.stringify(array)
}

//详情
const detail = (url) => {
let response = GET(url)
let $ = JSON.parse(response).data.book
let book = {
summary: $.intro,
status: $.update_state,
category: $.type,
update: $.updatetime,
lastChapter: $.last_chapter_name,
catalog: $._id
}
return JSON.stringify(book)
}

//目录
const catalog = (url) => {
let response = GET(`http://www.lianjianxsw.com/getCataLogs?bookid=${url}&page=1&limit=9999`)
let $ = JSON.parse(response)
let array = []
$.data.list.forEach((chapter) => {
array.push({
name: chapter.name,
url: `http://www.lianjianxsw.com/getContent?bookid=${url}&chapterid=${chapter._id}`
})
})
return JSON.stringify(array)
}

//章节
const chapter = (url) => {
let response = GET(url)
let $ = JSON.parse(response)
return decrypt($.data.chapterInfo.content).replaceAll("###$$$","\n")
}

var bookSource = JSON.stringify({
name: "读书阁",
url: "lianjianxsw.com",
version: 100
})
