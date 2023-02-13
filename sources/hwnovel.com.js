require('crypto-js')

function guid() {
return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
return v.toString(16);
}).replaceAll("-","");
}

const decrypt = function (data) {
let key = CryptoJS.enc.Utf8.parse('ZUreQN0E')
decrypted = CryptoJS.DES.decrypt(data, key, {
mode: CryptoJS.mode.ECB,
padding: CryptoJS.pad.Pkcs7
})
return decrypted.toString(CryptoJS.enc.Utf8)
}

const encrypt = function (data) {
let key = CryptoJS.enc.Utf8.parse('ZUreQN0E')
encrypted = CryptoJS.DES.encrypt(data, key, {
mode: CryptoJS.mode.ECB,
padding: CryptoJS.pad.Pkcs7
})
return encrypted.toString()
}

const headers = ["channel:25","deviceno:0000000000000000","platform:1","imei:","targetmodel:Mi 10","oaid:","version:3.2.5",`token:${localStorage.getItem('tk')}`,"user-agent:Mozilla/5.0 (Linux; Android 11; Pixel 4 XL Build/RP1A.200720.009; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/92.0.4515.115 Mobile Safari/537.36"]

const CGET = function (url, da) {
let timestamp = Math.round(new Date())
let requestId = guid()
let param = encrypt(JSON.stringify({
...da,
timestamp: timestamp
}))
let sign = CryptoJS.MD5(ENCODE(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`,"base64").replaceAll("\n","")).toString().toUpperCase()
let data = JSON.stringify({
param,
requestId,
sign,
timestamp
})
url = `https://api.hwnovel.com/${url}`
 let res = JSON.parse(POST(url,{data,headers}))
 return res
}

//搜索
const search = (key) => {
let timestamp = Math.round(new Date())
let requestId = guid()
let param = encrypt(JSON.stringify({
keyword: key,
pageNo: 1,
pageSize: 15,
rankType: "0",
timestamp: timestamp
}))
let sign = CryptoJS.MD5(ENCODE(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`,"base64").replaceAll("\n","")).toString().toUpperCase()
let response = GET(`https://api.hwnovel.com/api/ciyuanji/client/book/searchBookList?param=${param}&requestId=${requestId}&sign=${sign}&timestamp=${timestamp}`,{headers})
let $ = JSON.parse(response)
let array = []
$.data.esBookList.forEach((child) => {
array.push({
name: child.bookName,
author: child.authorName,
cover: child.imgUrl,
detail: child.bookId,
})
})
return JSON.stringify(array)
}

//详情
const detail = (url) => {
let timestamp = Math.round(new Date())
let requestId = guid()
let param = encrypt(JSON.stringify({
bookId:url,
timestamp:timestamp
}))
let sign = CryptoJS.MD5(ENCODE(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`,"base64").replaceAll("\n","")).toString().toUpperCase()
let response = GET(`https://api.hwnovel.com/api/ciyuanji/client/book/getBookDetail?timestamp=${timestamp}&requestId=${requestId}&sign=${sign}&param=${param}`,{headers})
let $ = JSON.parse(response).data.book
let book = {
summary: $.notes,
status: $.endState == 2 ? '连载' : '完结',
category: $.tagList.map((item)=>{ return item.tagName}).join(" "),
words: $.wordCount,
update: $.latestUpdateTime,
lastChapter: $.latestChapterName,
catalog: $.bookId
}
return JSON.stringify(book)
}

//目录
const catalog = (url) => {
let timestamp = Math.round(new Date())
let requestId = guid()
let param = encrypt(JSON.stringify({
sortType:"1",
pageNo:"1",
pageSize:"9999",
bookId:url.toString(),
timestamp:timestamp
}))
let sign = CryptoJS.MD5(ENCODE(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`,"base64").replaceAll("\n","")).toString().toUpperCase()
let response = GET(`https://api.hwnovel.com/api/ciyuanji/client/chapter/getChapterListByBookId?timestamp=${timestamp}&requestId=${requestId}&sign=${sign}&param=${param}`,{headers})
let vlist = []
let array = []
let vidlist = []
let list = JSON.parse(response).data.bookChapter.chapterList
list.forEach((booklet) => {
if (vidlist.indexOf(booklet.volumeId) == -1) {
vlist.push(booklet);
vidlist.push(booklet.volumeId)
}
})
vlist.forEach((booklet) => {
let vid = booklet.volumeId
array.push({
name: booklet.title
})
list.forEach((chapter) => {
if (vid == chapter.volumeId) {
array.push({
name: chapter.chapterName,
url: `a?bid=${url}&cid=${chapter.chapterId}`,
vip: chapter.isFee == 1
})
}
})
})
return JSON.stringify(array)
}

//章节
const chapter = (url) => {
let timestamp = Math.round(new Date())
let requestId = guid()
let param = encrypt(JSON.stringify({
bookId:url.query("bid").toString(),
chapterId:url.query("cid").toString(),
timestamp:timestamp
}))
let sign = CryptoJS.MD5(ENCODE(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`,"base64").replaceAll("\n","")).toString().toUpperCase()
let response = GET(`https://api.hwnovel.com/api/ciyuanji/client/chapter/getChapterContent?timestamp=${timestamp}&requestId=${requestId}&sign=${sign}&param=${param}`,{headers})
let $ = JSON.parse(response).data
//未购买返回403和自动订阅地址
if ($.isFee == 1&&$.isBuy == 0) throw JSON.stringify({
code: 403,
message: `https://www.ciyuanji.com/chapter/${url.query('cid')}.html?bookId=${url.query('bid')}&ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36`
})
if($.chapter.imgList) return decrypt($.chapter.content.replaceAll("\n","")).trim() + "\r\n" + $.chapter.imgList.map((item)=>{ return "<img src='" + item.imgUrl + "'/>"}).join("\n")
else return decrypt($.chapter.content.replaceAll("\n","")).trim()
}

/**
* 个人
* @returns {[{url, nickname, recharge, balance[{name, coin}], sign}]}
*/
const profile = () => {
if(localStorage.getItem('tk') != 0) {
let timestamp = Math.round(new Date())
let requestId = guid()
let param = encrypt(JSON.stringify({
timestamp:timestamp
}))
let sign = CryptoJS.MD5(ENCODE(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`,"base64").replaceAll("\n","")).toString().toUpperCase()
let response = GET(`https://api.hwnovel.com/api/ciyuanji/client/account/getAccountByUser?timestamp=${timestamp}&requestId=${requestId}&sign=${sign}&param=${param}`,{headers})
let $ = JSON.parse(response).data.accountInfo
return JSON.stringify({
basic: [
{
name: '账号',
value: $.nickName,
url: 'https://www.ciyuanji.com/personalCenter/info?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
},
{
name: '书币',
value: $.currencyBalance,
url: 'https://www.ciyuanji.com/recharge?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
},
{
name: '代币',
value: $.couponBalance,
url: 'https://www.ciyuanji.com/recharge?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
},
{
name: '月票',
value: $.monthCount,
url: 'https://www.ciyuanji.com/recharge?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
},
{
name: '推荐票',
value: $.dayCount,
url: 'https://www.ciyuanji.com/recharge?ua=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
}
],
extra: [
{
name: '自动签到',
type: 'permission',
method: 'sign',
times: 'day',
},
{
name: '书架',
type: 'books',
method: 'bookshelf'
}
]
})
}
}

/**
* 我的书架
* @param {页码} page
*/
const bookshelf = (page) => {
let timestamp = Math.round(new Date())
let requestId = guid()
let param = encrypt(JSON.stringify({
pageNo:1,
pageSize:9999,
timestamp:timestamp
}))
let sign = CryptoJS.MD5(ENCODE(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`,"base64").replaceAll("\n","")).toString().toUpperCase()
let response = GET(`https://api.hwnovel.com/api/ciyuanji/client/bookrack/getUserBookRackList?timestamp=${timestamp}&requestId=${requestId}&sign=${sign}&param=${param}`,{headers})
let $ = JSON.parse(response).data
let books = $.bookRackList.map(book => ({
name: book.bookName,
author: book.authorName,
cover: book.imgUrl,
detail: book.bookId
}))
return JSON.stringify({books})
}

const sign = () => {
CGET('api/ciyuanji/client/sign/sign',{}) //签到
CGET("api/ciyuanji/client/bookrack/addOrDeleteBookRack",{"bookIdList":["14447"],"isDelete":"0"}) //加入书架
CGET("api/ciyuanji/client/bookrack/addOrDeleteBookRack",{"bookIdList":["14447"],"isDelete":"1"}) //删除书架
return true
}

//排行榜
const rank = (title, category, page) => {
let timestamp = Math.round(new Date())
let requestId = guid()
let param = encrypt(JSON.stringify({
firstClassify:category,
rankType:"1",
pageNo:page + 1,
pageSize:15,
bookType: title,
timestamp:timestamp
}))
let sign = CryptoJS.MD5(ENCODE(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`,"base64").replaceAll("\n","")).toString().toUpperCase()
let response = GET(`https://api.hwnovel.com/api/ciyuanji/client/book/getBookListByParams?param=${param}&requestId=${requestId}&sign=${sign}&timestamp=${timestamp}`,{headers})
let $ = JSON.parse(response).data
let books = []
$.bookList.forEach((child) => {
books.push({
name: child.bookName,
author: child.authorName,
cover: child.imgUrl,
detail: child.bookId
})
})
return JSON.stringify({
end: $.bookList.length === 0,
books: books
})
}

const ranks = [
{
title: {
key: '1',
value: '男生'
},
categories: [
{ key: "101", value: "轻小说" },
{ key: "115", value: "同人" },
{ key: "102", value: "玄幻" },
{ key: "106", value: "都市" },
{ key: "105", value: "仙侠" },
{ key: "103", value: "西幻" },
{ key: "110", value: "游戏" },
{ key: "112", value: "科幻" },
{ key: "104", value: "武侠" },
{ key: "108", value: "历史" },
{ key: "113", value: "悬疑" },
{ key: "109", value: "军事" },
{ key: "107", value: "现实" },
{ key: "111", value: "体育" },
{ key: "114", value: "短篇" },
{ key: "21204", value: "剧本杀" }
]
},
{
title: {
key: '4',
value: '女生'
},
categories: [
{ key: "201", value: "古代言情" },
{ key: "202", value: "现代言情" },
{ key: "203", value: "玄幻言情" },
{ key: "204", value: "悬疑推理" },
{ key: "205", value: "浪漫青春" },
{ key: "206", value: "仙侠奇缘" },
{ key: "207", value: "科幻空间" },
{ key: "208", value: "游戏竞技" },
{ key: "209", value: "轻小说" },
{ key: "212", value: "衍生同人" },
{ key: "210", value: "短篇" },
{ key: "211", value: "现实生活" }
]
}
]

const login = (args) => {
if(args[0] != 0 && args[1] == 0) {
let timestamp = Math.round(new Date())
let requestId = guid()
let param = encrypt(JSON.stringify({
phone:args[0],
smsType:"1",
timestamp:timestamp
}))
let sign = CryptoJS.MD5(ENCODE(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`,"base64").replaceAll("\n","")).toString().toUpperCase()
let data = JSON.stringify({
param: param,
requestId: requestId,
sign: sign,
timestamp: timestamp
})
let response = POST(`https://api.hwnovel.com/api/ciyuanji/client/login/getPhoneCode`,{data,headers})
let $ = JSON.parse(response)
if($.code == 200) return "验证码已发送"
else return $.msg
}
if(args[0] != 0 && args[1] != 0) {
let timestamp = Math.round(new Date())
let requestId = guid()
let param = encrypt(JSON.stringify({
phone:args[0],
phoneCode:args[1],
timestamp:timestamp
}))
let sign = CryptoJS.MD5(ENCODE(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`,"base64").replaceAll("\n","")).toString().toUpperCase()
let data = JSON.stringify({
param: param,
requestId: requestId,
sign: sign,
timestamp: timestamp
})
let response = POST(`https://api.hwnovel.com/api/ciyuanji/client/login/phone`,{data,headers})
let $ = JSON.parse(response)
let token = $.data.userInfo.token
localStorage.setItem("tk",token)
if($.code == 200) return "登录成功"
else return $.msg
}
}

var bookSource = JSON.stringify({
name: "次元姬小说",
url: "hwnovel.com",
version: 104,
authorization: JSON.stringify(['account','password']),
cookies: [".hwnovel.com"],
ranks: ranks
})