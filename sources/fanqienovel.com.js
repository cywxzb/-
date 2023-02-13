//转换更新时间 时间戳
function timestampToTime(timestamp) {
  if(timestamp.toString().length == 13) var date = new Date(timestamp);
  else var date = new Date(timestamp * 1000);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
  var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
  var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
  var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
  var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
  return Y+M+D+h+m+s;
}

//搜索
const search = (key) => {
  let response = GET(`https://api5-normal-hl.fqnovel.com/reading/bookapi/search/tab/v/?use_correct=true&offset=0&tab_type=3&query=${key}&iid=2159861899465991&aid=1967&app_name=novelapp&version_code=360`)
  let $ = JSON.parse(response).search_tabs[2]
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
  let response = GET(`https://api5-normal-hl.fqnovel.com/reading/bookapi/detail/v/?book_id=${url}&iid=2159861899465991&aid=1967&app_name=novelapp&version_code=360`)
  let $ = JSON.parse(response).data
  let book = {
    summary: $.abstract,
    status: $.creation_status == 1 ? '连载' : '完结',
    category: $.tags.replaceAll(","," "),
    words: $.word_number,
    update: timestampToTime($.last_chapter_update_time),
    lastChapter: $.last_chapter_title,
    catalog: $.book_id
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(`https://api5-normal-hl.fqnovel.com/reading/bookapi/directory/all_items/v/?book_id=${url}&iid=2159861899465991&aid=1967&app_name=novelapp&version_code=360`)
  let $ = JSON.parse(response).data
  let array = []
  let v = []
  $.item_data_list.forEach((x) => {
    if (JSON.stringify(v).indexOf(x.volume_name) == -1) {
      array.push({
        name:x.volume_name
     	})
      v.push(x.volume_name)
    }
    array.push({
      name: x.title,
      url: `group_id=${x.item_id}&item_id=${x.item_id}`
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let response = GET(`https://novel.snssdk.com/api/novel/book/reader/full/v1/?${url}&aid=1967`)
  let $ = HTML.parse(response)
  return $("article")
}

var bookSource = JSON.stringify({
  name: "番茄小说",
  url: "fanqienovel.com",
  version: 111
})