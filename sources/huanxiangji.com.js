/**
* 搜索
* @params {string} key
* @returns {[{name, author, cover, detail}]}
*/
const search = (key) => {
let response = POST("http://www.huanxiangji.com/modules/article/search.php", {
data: `searchkey=${ENCODE(key,"gbk")}`
})
let array = []
let $ = HTML.parse(response)
if ($('h2.layout-tit').text().match(/搜素/)) {
$('ul.txt-list > li:nth-child(n+2)').forEach((child) => {
let $ = HTML.parse(child)
let bid = $('span.s2 > a').attr('href').replace("http://www.huanxiangji.com/book/", "").replace("/", "")
array.push({
name: $('span.s2').text(),
author: $('span.s4').text(),
detail: $('span.s2 > a').attr('href')
})
})
} else {
array.push({
name: $('[property=og:novel:book_name]').attr('content'),
author: $('[property=og:novel:author]').attr('content'),
cover: $('[property=og:image]').attr('content'),
detail: $('[property=og:url]').attr('content')
})
}
return JSON.stringify(array)
}

/**
* 详情
* @params {string} url
* @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
*/
const detail = (url) => {
let response = GET(url)
let $ = HTML.parse(response)
let book = {
summary: $('[property=og:description]').attr('content'),
status: $('[property=og:novel:status]').attr('content'),
category: $('[property=og:novel:category]').attr('content'),
words: $('div.booknav2 > p:nth-child(4)').text().replace(/字.+/, ""),
update: $('[property=og:novel:update_time]').attr('content'),
lastChapter: $('[property=og:novel:latest_chapter_name]').attr('content'),
catalog: url
}
return JSON.stringify(book)
}

/**
* 目录
* @params {string} url
* @returns {[{name, url, vip}]}
*/
const catalog = (url) => {
let response = GET(url)
let $ = HTML.parse(response)
let array = []
$('#section-list > h2,#section-list > li').forEach((chapter) => {
let $ = HTML.parse(chapter)
if ($("h2").text()) array.push({
name: $("h2").text()
})
else array.push({
name: $("a").text(),
url: `${url}${$("a").attr("href")}`
})
})
return JSON.stringify(array)
}

/**
* 章节
* @params {string} url
* @returns {string}
*/
const chapter = (url) => {
let response = GET(url)
let $ = HTML.parse(response)
return $("#content")
}

var bookSource = JSON.stringify({
name: "幻想姬小说",
url: "huanxiangji.com",
version: 100
})