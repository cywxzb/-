function spArr(arr, num) {
let newArr = []
for (let i = 0; i < arr.length;) {
newArr.push(arr.slice(i, i += num))
}
return newArr
}

//搜索
const search = (key) => {
let response = GET(`https://api5-normal-sinfonlineb.fqnovel.com/reading/bookapi/search/page/v/?query=${key}&aid=1967&channel=0&os_version=0&device_type=0&device_platform=0&iid=466614321180296&version_code=999`)
let data = JSON.parse(response).data[0].book_data
let array = []
data.forEach((child) => {
array.push({
name: child.book_name,
author: child.author,
cover: child.thumb_url,
detail: child.book_id
})
})
return JSON.stringify(array)
}

//详情
const detail = (url) => {
let response = GET(`https://api5-normal-sinfonlineb.fqnovel.com/reading/bookapi/multi-detail/v/?aid=1967&iid=1&version_code=999&book_id=${url}`)
let $ = JSON.parse(response).data[0]
let book = {
catalog: $.book_id
}
return JSON.stringify(book)
}

//目录
const catalog = (url) => {
let res = GET(`https://novel.snssdk.com/api/novel/book/directory/list/v1/?book_id=${url}`)
function spArr(arr, num){
let newArr = []
for(let i = 0; i < arr.length;){
newArr.push(arr.slice(i, i += num))
}
return newArr
}
res = JSON.parse(res).data
let item_list = spArr(res["item_list"], 100)
let array = []
for(let i = 0; i < item_list.length; i ++){
let response = GET('https://novel.snssdk.com/api/novel/book/directory/detail/v1/?item_ids='+item_list[i])
let data = JSON.parse(response).data
data.forEach((x) => {
array.push({
name: x.title,
url: 'https://novel.snssdk.com/api/novel/book/reader/full/v1/?aid=2329&item_id='+x.item_id
})
})
}
return JSON.stringify(array)
}

//章节
const chapter = (url) => {
let response = GET(url)
let $ = HTML.parse(JSON.parse(response).data.content)
return $("article").remove("title,link,h2")
}

var bookSource = JSON.stringify({
name: "番茄小说",
url: "fanqienovel.com",
version: 114
})
