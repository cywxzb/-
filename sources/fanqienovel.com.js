function spArr(arr, num) {
let newArr = []
for (let i = 0; i < arr.length;) {
newArr.push(arr.slice(i, i += num))
}
return newArr
}

//转换更新时间 时间戳
function timestampToTime(timestamp) {
let date
if (timestamp.toString().length == 13) date = new Date(timestamp);
else date = new Date(timestamp * 1000);
let Y = date.getFullYear() + '-';
let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
return Y + M + D + h + m + s;
}

//搜索
const search = (key) => {
let response = GET(`https://api5-normal-lf.fqnovel.com/reading/bookapi/search/tab/v/?query=${key}&tab_type=3&iid=2159861899465991&&aid=1967&app_name=novelapp&version_code=56920&update_version_code=56920`)
let $ = JSON.parse(response).search_tabs[4]
let array = []
$.data.forEach((child) => {
array.push({
name: child.book_data[0].book_name,
author: child.book_data[0].author,
cover: child.book_data[0].thumb_url,
detail: child.book_data[0].book_id
})
})
return JSON.stringify(array)
}

//详情
const detail = (url) => {
let response = GET(`https://api5-normal-lf.fqnovel.com/reading/bookapi/detail/v/?book_id=${url}&iid=2159861899465991&aid=1967&version_code=311&update_version_code=31132`)
let $ = JSON.parse(response).data
let book = {
summary: $.abstract,
status: $.creation_status == 1 ? '连载' : '完结',
category: $.tags.replaceAll(",", " "),
words: $.word_number,
update: timestampToTime($.last_chapter_update_time),
lastChapter: $.last_chapter_title,
catalog: $.book_id
}
return JSON.stringify(book)
}

//目录
const catalog = (url) => {
let res = GET(`https://api5-normal-lf.fqnovel.com/reading/bookapi/directory/all_items/v/?book_id=${url}&iid=2159861899465991&aid=1967&version_code=311&update_version_code=31132`)
let item_list = spArr(JSON.parse(res).data.item_list, 100)
console.log(item_list)
let array = []
let v = []
for (let i = 0; i < item_list.length; i++) {
let response = GET(`https://api5-normal-lf.fqnovel.com/reading/bookapi/directory/all_infos/v/?item_ids=${item_list[i]}&iid=2159861899465991&aid=1967&version_code=311&update_version_code=31132`)
let $ = JSON.parse(response)
$.data.forEach((x) => {
if (JSON.stringify(v).indexOf(x.volume_name) == -1) {
array.push({
name: x.volume_name
})
v.push(x.volume_name)
}
array.push({
name: x.title,
url: `group_id=${x.item_id}&item_id=${x.item_id}`
})
})
}
return JSON.stringify(array)
}

//章节
const chapter = (url) => {
let response = GET(`https://novel.snssdk.com/api/novel/book/reader/full/v1/?${url}&aid=1967`)
let $ = HTML.parse(JSON.parse(response).data.content)
return $("article").remove("title,link,h2")
}

var bookSource = JSON.stringify({
name: "番茄小说",
url: "fanqienovel.com",
version: 114
})