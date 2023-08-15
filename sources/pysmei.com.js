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
url: `${url}/${chapter.id}`
})
})
})
return JSON.stringify(array)
}

//章节
const chapter = (url) => {
let response = GET(`https://novel-api.elklk.cn/cdn/book/content/${url}.html`)
let result = JSON.parse(response).result.info.content
if(result.indexOf("{{{}}}")>(-1)){
result =result.replace(/.*?{{{}}}/g,"")
result = decrypt(result)
}
return result
}

var bookSource = JSON.stringify({
name: "看书神器",
url: "pysmei.com",
version: 100
})
