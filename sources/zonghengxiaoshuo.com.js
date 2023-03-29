require('crypto-js')

const decrypt = function(data, iv) {
let key = CryptoJS.enc.Hex.parse('32343263636238323330643730396531')
iv = CryptoJS.enc.Hex.parse(iv)
let HexStr = CryptoJS.enc.Hex.parse(data)
let Base64Str = CryptoJS.enc.Base64.stringify(HexStr)
let decrypted = CryptoJS.AES.decrypt(Base64Str, key, {
iv: iv,
mode: CryptoJS.mode.CBC,
padding: CryptoJS.pad.Pkcs7
})
return decrypted.toString(CryptoJS.enc.Utf8)
}

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

const headers = ['platform: android', 'app-version: 20400', 'application-id: com.xk.qreader', `sign: ${CryptoJS.MD5("app-version=20400application-id=com.xk.qreaderplatform=androidd3dGiJc651gSQ8w1")}`, 'user-agent:webviewversion/0']

/**
* 搜索
* @params {string} key
* @returns {[{name, author, cover, detail}]}
*/
const search = (key) => {
let sign = CryptoJS.MD5(`wd=${key}d3dGiJc651gSQ8w1`)
let response = GET(`https://api-bc.zonghengxiaoshuo.com/api/v7/search/words?wd=${encodeURI(key)}&sign=${sign}`, {
headers
})
let array = []
let $ = JSON.parse(response)
$.data.books.filter($ => $.show_type != 4 && $.show_type != 2).forEach(($) => {
array.push({
name: $.original_title,
author: $.original_author,
cover: $.image_link,
detail: $.id
})
})
return JSON.stringify(array)
}

//详情
const detail = (url) => {
let sign = CryptoJS.MD5(`id=${url}d3dGiJc651gSQ8w1`)
let response = GET(`https://api-bc.zonghengxiaoshuo.com/api/v5/book/detail?id=${url}&sign=${sign}`, {
headers
})
let $ = JSON.parse(response).data.book
let book = {
summary: $.intro,
status: $.is_over == 0 ? '连载' : '完结',
category: $.book_tag_list.map((item) => {
return item.title
}).join(" "),
words: $.category_over_words.match(/\d{1,}万/)[0],
update: timestampToTime($.update_time),
lastChapter: $.latest_chapter_title,
catalog: $.id
}
return JSON.stringify(book)
}

//目录
const catalog = (url) => {
let sign = CryptoJS.MD5(`id=${url}d3dGiJc651gSQ8w1`)
let response = GET(`https://api-ks.zonghengxiaoshuo.com/api/v1/chapter/chapter-list?id=${url}&sign=${sign}`, {
headers
})
let $ = JSON.parse(response)
let array = []
$.data.chapter_lists.forEach((chapter) => {
array.push({
name: chapter.title,
url: `chapterId=${chapter.id}&id=${url}`
})
})
return JSON.stringify(array)
}

//章节
const chapter = (url) => {
let sign = CryptoJS.MD5(`${url.replace("&","")}d3dGiJc651gSQ8w1`)
let response = GET(`https://api-ks.zonghengxiaoshuo.com/api/v1/chapter/content?${url}&sign=${sign}`, {
headers
})
let $ = JSON.parse(response)
let txt = CryptoJS.enc.Base64.parse($.data.content).toString()
let iv = txt.slice(0, 32)
return decrypt(txt.slice(32), iv).trim()
}

var bookSource = JSON.stringify({
name: "星空免费小说",
url: "zonghengxiaoshuo.com",
version: 100
})