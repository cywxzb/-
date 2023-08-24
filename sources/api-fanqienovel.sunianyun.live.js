const header = ["user-agent:Mozilla/5.0 (Linux; Android 10.0; wv) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.110 Mobile Safari/537.36 T7/10.3 SearchCraft/2.6.2 (Baidu; P1 7.0)"]

//搜索
const search = (key) => {
let response = GET(`https://novel.snssdk.com/api/novel/channel/homepage/search/search/v1/?aid=13&q=${key}`,{headers:header})
let $ = JSON.parse(response).data.ret_data
let array = []
$.forEach((child) => {
array.push({
name: child.title.replace(/\<em\>/g,"").replace(/<\/em\>/g,""),
author: child.author,
cover: child.thumb_url,
detail: child.book_id
})
})
return JSON.stringify(array)
}

//详情
const detail = (url) => {
let response = GET(`https://novel.snssdk.com/api/novel/book/directory/list/v1?book_id=${url}`,{headers:header})
let $ = JSON.parse(response).data.book_info
let book = {
summary: $.abstract,
status: $.creation_status == 1 ? '连载' : '完结',
category: $.category,
words: $.word_number,
lastChapter: $.last_chapter_title,
catalog: $.book_id
}
return JSON.stringify(book)
}

const catalog = (url) => {
let response = GET(`https://fanqienovel.com/page/${url}`,{headers:["User-Agent:Restler/0.17.6 (android)"]})
let $ = HTML.parse(response)
let array = []
$('.volume,.chapter-item').forEach((chapter) => {
let $ = HTML.parse(chapter)
if ($('div.volume').text().length != 0) {
array.push({ name: $('div.volume').text().replace(/共.*章/g,"") })
} else {
a = $('a').attr('href').replace(/\/reader\//,"")
array.push({
name: $('a').text(),
url: `http://list.api-fanqienovel.sunianyun.live/random#/content?item_id=${a}`,
})
}
})
return JSON.stringify(array)
}

//章节
const chapter = (url) => {
u = GET(url)
ur = url.split("#")[1]
if (u.includes("api-fanqienovel.sunianyun.live"))
url = u + ur
else
url = `http://api.api-fanqienovel.sunianyun.live` + ur
return JSON.parse(GET(url)).data.data.content
}

var bookSource = JSON.stringify({
name: "旧版番茄",
url: "api-fanqienovel.sunianyun.live",
version: 103
})
