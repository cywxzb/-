const search = (key) => {
let response = GET(`https://www.xsyz.cc/tag/?key=${key}`)
let $ = HTML.parse(response)
let array = []
$(".item").forEach(child => {
let $ = HTML.parse(child)
array.push({
name: $("h3").text(),
author: $("p:nth-child(3)").text().replace("作者：",""),
cover: `https:${$("img").attr("src")}`,
status: $("p:nth-child(2) > span:nth-child(1)").text(),
category: $("p:nth-child(2) > span:nth-child(2)").text(),
update: $("ul > li:nth-child(1) > i").text(),
lastChapter: $("ul > li:nth-child(1) > a").text(),
detail: `https://www.xsyz.cc/${$("h3 > a").attr("href")}`
})
})
return JSON.stringify(array)
}

const detail = (url) => {
let response = GET(url)
let $ = HTML.parse(response)
let book = {
name: $("h3 > a").text(),
author: $(".itemtxt > p:nth-child(3)").text().replace("作者：",""),
cover: `https:${$(".item > a > img").attr("src")}`,
summary: $(".des:nth-child(2)").text(),
status: $(".itemtxt > p:nth-child(2) > span:nth-child(1)").text(),
words: $("h3 > i").text().replace("字",""),
category: $(".itemtxt > p:nth-child(2) > span:nth-child(2)").text(),
update: $("#dir > span").text().replace("最后更新：",""),
lastChapter: $(".itemtxt > ul > li:nth-child(1) > a").text(),
catalog: url
}
return JSON.stringify(book)
}

const catalog = (url) => {
let response = GET(url)
let $ = HTML.parse(response)
let array = []
$('#list > ul > li').forEach((chapter) => {
let $ = HTML.parse(chapter)
array.push({
name: $('a').text(),
url: `https://www.xsyz.cc/${$("a").attr("href")}`
})
})
return JSON.stringify(array)
}

const chapter = (url) => {
let response = GET(url)
let $ = HTML.parse(response)
return $(".con")
}

var bookSource = JSON.stringify({
name: "小说驿站",
url: "xsyz.cc",
version: 100
})
