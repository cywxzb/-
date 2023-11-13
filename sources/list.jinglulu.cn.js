const search = (key) => {
let response = GET(`http://list.jingluofq.jilulu.cn/search?query=${key}`)
let $ = JSON.parse(response).data.search_tabs[0].data
let array = []
let data = $.filter(item => item.book_data)
data.forEach((child) => {
array.push({
name: child.book_data[0].book_name,
author: child.book_data[0].author,
cover: child.book_data[0].thumb_url,
detail: child.book_data[0].book_id,
category: child.book_data[0].category,
summary: child.book_data[0].abstract,
status: child.book_data[0].creation_status == 1 ? '连载' : '完结'
})
})

return JSON.stringify(array)
}

const detail = (url) => {
let response = GET(`https://novel.snssdk.com/api/novel/book/directory/list/v1?book_id=${url}`)
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

//目录
const catalog = (url) => {
let response = GET(`https://fanqienovel.com/page/${url}`, { headers: ["User-Agent:Restler/0.17.6 (android)"] })
let $ = HTML.parse(response)
let array = []
$('.volume,.chapter-item').forEach((chapter) => {
let $ = HTML.parse(chapter)
if ($('div.volume').text().length != 0) {
array.push({ name: '📖[' + $('div.volume').text().replace(/共.*章/g, "") + ']📖' })
} else {
a = $('a').attr('href').replace(/\/reader\//, "")
array.push({
name: $('a').text(),
url: JSON.stringify({
url: `http://list.jingluofq.jilulu.cn/random#/content?item_id=${a}`,
chapterId: a,
bookId: url
}),
})
}
})
return JSON.stringify(array)
}


const COMMENT_URL = "https://api5-normal-sinfonlinea.fqnovel.com/reading/ugc/idea/list/v/?aid=1967&item_id=${chapterId}&book_id=${bookId}&item_version=1"

function getCommentIds (bookId, chapterId) {
let commentUrl = COMMENT_URL
.replace("${bookId}", bookId)
.replace("${chapterId}", chapterId);

let res = GET(commentUrl);
let data = JSON.parse(res).data.idea_data;
let json = {};
for(let key in data) {
json[key] = {
count: data[key].idea_count + "",
id : key
}
}
LOGE (json);
return json;
}

//章节
const chapter = (data) => {

let json = JSON.parse (data);
let url = json.url;
let bookId = json.bookId;
let chapterId = json.chapterId;

u = GET(url)
ur = url.split("#")[1]
if (u.includes("list.jingluofq.jilulu.cn"))
url = u + ur
else
url = `http://list.jingluofq.jilulu.cn` + ur

data = JSON.parse(GET(url)).data;
// 获得本章节评论数组; 评论不强求, 有异常就跳过;
let comments = {}
try {
comments = getCommentIds (bookId, chapterId)
} catch(err) { }

let res = {}
if (Object.keys(comments).length > 0) {
res.comments = comments;
}
/*
if (data.hasOwnProperty("data"))
res.content = data.data.content;
else
res.content = data.content;
*/
let content = ""
if (data.hasOwnProperty("data"))
content = data.data.content;
else
content = data.content;

content = content.replaceAll("img-width", "width")
content = content.replaceAll("img-height", "height")

res.content = content
return content
}

function fuckDate (date) {
return timestampFormat(date, 'yyyy-MM-dd HH:mm')
}


/**
* 获取评论回复列表
* @param {*} book, 由 catalog 方法返回的book章节信息, 应包含bookId, chapterId;
* @param {*} paragraph 大部分为String类型, 是评论的ID或是索引;如果无用则忽略;
* @param {*} commentId 大部分为String类型, 值对应的是评论的ID;
* @param {*} page 加载页数( 一页具体展示多少内容,由源自定 ), 从0开始;
* @returns
* [{
* replyUserName 回复用户名
* userName 发表用户名
* userImg 发表用户头 像牛逼
* content 发表评论内容
* date 发表评论日期
* local 发表所在地
* digg 此发表或的同意数量
* disagree 此发表获得反对数量
* image 发表图像数组
* }]
*/
const replyComment = (book, commentId, page, paragraph) => { // 番茄不需要~
return []
}

/**
* 加载评论列表；
* @param {*} book, 由 catalog 方法返回的book章节信息, 应包含bookId, chapterId;
* @param {*} commentId 大部分为String类型, 值对应的是评论的ID;
* @param {*} page 加载页数( 一页具体展示多少内容,由源自定 )
* @returns
* [{
* id 发表ID
* userName 发表用户名
* userImg 发表用户头像牛逼
* content 发表评论内容
* date 发表评论日期
* digg 此发表或的同意数量
* disagree 此发表获得反对数量
* local 发表所在地 -- 番茄木得有
* image [] 发表图像数组;
* replyCount 此发表内容回复数量, 只有此值大于 0 或 replys 不为空数组 时, 才显示展开加载回复布局;
* replys [] or id 此发表回复数据, 如果是数组, 则直接加载显示本数组内容, 如果是单个字符串, 则将其视为评论ID, 将调用 "replyComment" 获得回复数据;
* }]
*/
const comment = (book, commentId, pageIdx = 0) => {
let loadCount = 20;
let loadOffset= pageIdx * 20;

let bid = JSON.parse(book).bookId;
let cid = JSON.parse(book).chapterId;

let url = "https://api5-normal-sinfonlinea.fqnovel.com/reading/ugc/idea/comment_list/v/?should_not_impr=true&aid=1967&item_id=";
let res = GET(`${url}${cid}&book_id=${bid}&item_version=1&offset=${loadOffset}&count=${loadCount}&query_type=0&sort=1&para_index=${commentId}`);

let json = JSON.parse (res);
let array = []
for (let item of json.data.comments) {
let data = {}

data.id = item.comment_id;
if (item.hasOwnProperty("user_info")) {
array.push(data)
data.userName = item.user_info.user_name;
data.userImg = item.user_info.user_avatar;
data.content = item.text;
data.date = fuckDate(item.create_timestamp);
data.digg = item.digg_count;
data.disagree = item.disagree_count;
data.image = item.image_url;
data.replyCount = item.reply_count;
// 获得replyList
if (item.hasOwnProperty("reply_list")) {
let reply_list = []
for (let reply of item.reply_list) {
reply_list.push({
reply_id : reply.reply_id,
replyUserName: reply.reply_to_user_info ? reply.reply_to_user_info.user_name : null,
userName : reply.user_info.user_name,
userImg : reply.user_info.user_avatar,
content : reply.text,
date : fuckDate(reply.create_timestamp),
digg : reply.digg_count,
disagree : reply.disagree_count
})
}
data.replys = reply_list;
}
} else {
// LOGE ("ERROR: " + JSON.stringify(item))
}
}
return JSON.stringify(array);
}

const rank = (title, category, page) => {

let response = GET(`http://list.jingluofq.jilulu.cn/reading/bookapi/new_category/landing/v/?category_id=${category}&offset=${page * 10}&${title}&sub_category_id=&genre_type=0&limit=10&source=front_category&front_page_selected_category=&no_need_all_tag=true&query_gender=1`)
let json = JSON.parse(response).data

let data = []
if (json.hasOwnProperty("data"))
data = json.data.book_info;
else
data = json.book_info;

let books = []
data.forEach((item) => {
books.push({
name : item.book_name,
author : item.author,
summary : item.abstract,
status : item.creation_status == 1 ? '连载' : '完结',
category : item.score + '分 ' + item.tags,
words : item.word_number,
cover : item.thumb_url,
detail : item.book_id
})
})
return JSON.stringify({
end: page == 1000000,
books
})
}

const catagoryAll = [
{ "value": "玄幻", "key": "7" }, { "value": "大小姐", "key": "519" }, { "value": "钓鱼", "key": "493" }, { "value": "游戏体育", "key": "746" }, { "value": "游戏主播", "key": "509" }, { "value": "电竞", "key": "508" }, { "value": "双重生", "key": "524" }, { "value": "抗战谍战", "key": "504" }, { "value": "悬疑脑洞", "key": "539" }, { "value": "都市异能", "key": "516" }, { "value": "谍战", "key": "507" }, { "value": "穿书", "key": "382" }, { "value": "清朝", "key": "503" }, { "value": "武将", "key": "497" }, { "value": "宫廷侯爵", "key": "502" }, { "value": "宋朝", "key": "501" }, { "value": "皇帝", "key": "498" }, { "value": "破案", "key": "505" }, { "value": "搞笑轻松", "key": "778" }, { "value": "综漫", "key": "465" }, { "value": "衍生同人", "key": "718" }, { "value": "断层", "key": "500" }, { "value": "东方玄幻", "key": "511" }, { "value": "修仙", "key": "517" }, { "value": "前世今生", "key": "523" }, { "value": "高武世界", "key": "513" }, { "value": "大佬", "key": "520" }, { "value": "灵气复苏", "key": "514" }, { "value": "打脸", "key": "522" }, { "value": "囤物资", "key": "494" }, { "value": "开局", "key": "453" }, { "value": "求生", "key": "379" }, { "value": "末日求生", "key": "515" }, { "value": "神豪", "key": "20" }, { "value": "鉴宝", "key": "17" }, { "value": "三国", "key": "67" }, { "value": "二次元", "key": "39" }, { "value": "历史", "key": "12" }, { "value": "美食", "key": "78" }, { "value": "奶爸", "key": "42" }, { "value": "娱乐圈", "key": "43" }, { "value": "洪荒", "key": "66" }, { "value": "大唐", "key": "73" }, { "value": "外卖", "key": "75" }, { "value": "惊悚", "key": "322" }, { "value": "末世", "key": "68" }, { "value": "都市", "key": "1" }, { "value": "宠物", "key": "74" }, { "value": "学霸", "key": "82" }, { "value": "游戏动漫", "key": "57" }, { "value": "科幻", "key": "8" }, { "value": "体育", "key": "15" }, { "value": "直播", "key": "69" }, { "value": "年代", "key": "79" }, { "value": "文化历史", "key": "62" }, { "value": "诸天万界", "key": "71" }, { "value": "海岛", "key": "40" }, { "value": "神医", "key": "26" }, { "value": "明朝", "key": "126" }, { "value": "武侠", "key": "16" }, { "value": "灵异", "key": "100" }, { "value": "星际", "key": "77" }, { "value": "穿越", "key": "37" }, { "value": "剑道", "key": "80" }, { "value": "都市修真", "key": "124" }, { "value": "赘婿", "key": "25" }, { "value": "兵王", "key": "27" }, { "value": "盗墓", "key": "81" }, { "value": "四合院", "key": "495" }, { "value": "推理", "key": "61" }, { "value": "无限流", "key": "70" }, { "value": "种田", "key": "23" }, { "value": "战争", "key": "97" }, { "value": "天才", "key": "90" }, { "value": "职场", "key": "127" }, { "value": "悬疑", "key": "10" }, { "value": "成功励志", "key": "56" }, { "value": "重生", "key": "36" }, { "value": "系统", "key": "19" }, { "value": "空间", "key": "44" }, { "value": "腹黑", "key": "92" }, { "value": "诗歌散文", "key": "46" }, { "value": "家庭", "key": "125" }, { "value": "影视小说", "key": "45" }, { "value": "生活", "key": "48" }, { "value": "都市生活", "key": "2" }, { "value": "大秦", "key": "377" }, { "value": "无敌", "key": "384" }, { "value": "漫威", "key": "374" }, { "value": "火影", "key": "368" }, { "value": "西游", "key": "373" }, { "value": "龙珠", "key": "376" }, { "value": "聊天群", "key": "381" }, { "value": "海贼", "key": "370" }, { "value": "奥特同人", "key": "367" }, { "value": "特种兵", "key": "375" }, { "value": "反派", "key": "369" }, { "value": "校花", "key": "385" }, { "value": "女帝", "key": "378" }, { "value": "单女主", "key": "389" }, { "value": "神奇宝贝", "key": "371" }, { "value": "九叔", "key": "383" }, { "value": "求生", "key": "379" }, { "value": "无女主", "key": "391" }, { "value": "武魂", "key": "386" }, { "value": "网游", "key": "372" }, { "value": "都市脑洞", "key": "262" }, { "value": "都市种田", "key": "263" }, { "value": "都市日常", "key": "261" }, { "value": "历史脑洞", "key": "272" }, { "value": "玄幻脑洞", "key": "257" }, { "value": "奇幻仙侠", "key": "259" }, { "value": "都市青春", "key": "396" }, { "value": "传统玄幻", "key": "258" }, { "value": "历史古代", "key": "273" }]

const ranks = [
{
title: {
key: 'sub_category_id=&genre_type=0&limit=10&source=front_category&',
value: '综合'
},
categories: catagoryAll
},
{
title: {
key: 'sub_category_id=&genre_type=0&limit=10&sort_by=24&source=front_category&',
value: '热门'
},
categories: catagoryAll
},
{
title: {
key: 'sub_category_id=&genre_type=0&limit=10&sort_by=76&source=front_category&',
value: '最新'
},
categories: catagoryAll
},
{
title: {
key: 'sub_category_id=&genre_type=0&limit=10&sort_by=12&source=front_category&',
value: '评分'
},
categories: catagoryAll
}]

var bookSource = JSON.stringify({
name: "Fun番茄",
url: "list.jinglulu.cn",
version: 111,
ranks: ranks
})
