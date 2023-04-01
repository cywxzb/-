/**
* 搜索
* @params {string} key
* @returns {[{name, author, cover, detail}]}
*/
const search = (key) => {
let response = POST("https://www.69shu.com/modules/article/search.php", {
data: `searchkey=${ENCODE(key,"gbk")}&searchtype=all`
})
let array = []
let $ = HTML.parse(response)
$('div.newbox > ul > li').forEach((child) => {
let $ = HTML.parse(child)
array.push({
name: $('h3 > a:nth-child(2)').text(),
author: $('div.labelbox > label:nth-child(1)').text(),
cover: $('img').attr('data-src'),
detail: $('a').attr('href')
})
})
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
catalog: `https://www.69shu.com${$("a.more-btn").attr("href")}`
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
$('#catalog > ul > li').forEach((chapter) => {
let $ = HTML.parse(chapter)
array.push({
name: $("a").text(),
url: $("a").attr("href")
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
let response = GET(url).replace("(本章完)","")
let $ = HTML.parse(response)
return $(".txtnav").remove("div,h1")
}

var bookSource = JSON.stringify({
name: "69书吧",
url: "69shu.com",
version: 100
})