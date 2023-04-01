/**
* 搜索
* @params {string} key
* @returns {[{name, author, cover, detail}]}
*/
const search = (key) => {
let response = POST("https://www.23qb.net/saerch.php", {
data: `searchkey=${ENCODE(key,"gbk")}&searchtype=all`
})
let array = []
let $ = HTML.parse(response)
$('#nr').forEach((child) => {
let $ = HTML.parse(child)
array.push({
name: $('h3 > a').text(),
author: $('dd.book_other > span:nth-child(1)').text(),
cover: $('img').attr('_src'),
detail: `https://www.23qb.net${$('h3 > a').attr('href')}`
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
$('#chapterList > li').forEach((chapter) => {
let $ = HTML.parse(chapter)
array.push({
name: $("a").text(),
url: `https://www.23qb.net${$("a").attr("href")}`
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
let response = GET(url).replaceAll("铅笔小说 23qb.net", "")
let $ = HTML.parse(response)
return $("#TextContent").remove("dt,div")
}

var bookSource = JSON.stringify({
name: "铅笔小说",
url: "23qb.net",
version: 100,
authorization: "https://www.23qb.net/login.php",
cookies: [".23qb.net"],
})