require('crypto-js')

function decrypt(data) {
if(!(data.match(/{{{}}}/))) return data
let key = CryptoJS.enc.Utf8.parse('OW84U8Eerdb99rtsTXWSILDO')
let iv = CryptoJS.enc.Utf8.parse('SK8bncVu')
data = data.replace("{{{}}}","")
let decrypted = CryptoJS.TripleDES.decrypt(data, key, {
iv: iv,
mode: CryptoJS.mode.CBC,
padding: CryptoJS.pad.Pkcs7
})
return decrypted.toString(CryptoJS.enc.Utf8)
}


//搜索
const search = (key) => {
let response = GET(`https://souxs.leeyegy.com/search.aspx?key=${key}&page=1&siteid=app2`)
let array = []
let $ = JSON.parse(response)
$.data.forEach((child) => {
array.push({
name: child.Name,
author: child.Author,
cover: child.Img,
detail: child.Id
})
})
return JSON.stringify(array)
}

//详情
const detail = (url) => {
let response = GET(`https://infosxs.pysmei.com/BookFiles/Html/${parseInt(url/1000) + 1}/${url}/info.html`)
let $ = JSON.parse(response).data
let book = {
summary: $.Desc,
status: $.BookStatus,
category: $.CName,
update: $.LastTime,
lastChapter: $.LastChapter,
catalog: $.Id
}
return JSON.stringify(book)
}

//目录
const catalog = (url) => {
let response = GET(`https://infosxs.pysmei.com/BookFiles/Html/${parseInt(url/1000) + 1}/${url}/index.html`).replaceAll("},]","}]")
let $ = JSON.parse(response)
let array = []
$.data.list.forEach((booklet) => {
array.push({ name: booklet.name })
booklet.list.forEach((chapter) => {
array.push({
name: decrypt(chapter.name),
url: `${parseInt(url/1000) + 1}/${url}/${chapter.id}`
})
})
})
return JSON.stringify(array)
}

//章节
const chapter = (url) => {
let response = GET(`https://contentxs232.pysmei.com/BookFiles/Html/${url}.html`)
let $ = JSON.parse(response).data
return decrypt($.content.replaceAll("你正在使用的App我们将不再提供最新内容，请到https://www.biqugeapp.com/下载我们最新的App，如有不便，敬请见谅。","")).replaceAll("@@﻿@@","").replaceAll("@@","").replaceAll("@@@@","").replaceAll("正在更新中，请稍等片刻，内容更新后，重新进来即可获取最新章节！亲，如果觉得APP不错，别忘了点右上角的分享给您好友哦！","").replaceAll("内容正在手打中，请在10-30分后重新进入阅读，如果还是没有正常内容，请点击右上角的问题反馈，我们会第一时间处理！","").trim()
}

var bookSource = JSON.stringify({
name: "看书神器",
url: "pysmei.com",
version: 100
})
