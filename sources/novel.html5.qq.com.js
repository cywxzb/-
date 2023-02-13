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
  let response = GET(`https://so.html5.qq.com/ajax/real/search_result?tabId=360&q=${key}`)
  let array = []
  let $ = JSON.parse(response).data.state.filter(function(item) {
    return item.dataName == "novel_search_list" && item.items[0].label_text != "付费"
  });
  $.forEach((child) => {
    array.push({
      name: child.items[0].title,
      author: child.items[0].author,
      cover: child.items[0].cover_url,
      detail: child.items[0].jump_url
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let response = GET(`https://novel.html5.qq.com/qbread/api/novel/bookInfo?resourceId=${url.query("bookid")}`,{headers:[`Referer:https://novel.html5.qq.com/`]})
  let $ = JSON.parse(response).data.bookInfo
  let book = {
    summary: $.summary,
    status: $.isfinish == 0 ? "连载" : "完结",
    category: $.tag ? $.tag.replaceAll("|"," ") : $.subtype,
    words: $.sourcesize || $.contentsize,
    update: timestampToTime($.lastUpdatetime),
    lastChapter: $.lastSerialname,
    catalog: url.query("bookid")
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let response = GET(`https://novel.html5.qq.com/qbread/api/book/all-chapter?bookId=${url}`,{headers:["referer:https://novel.html5.qq.com"]})
  let $ = JSON.parse(response)
  let array = []
  $.rows.forEach((chapter) => {
    array.push({
      name: chapter.serialName,
      url: `a?bid=${url}&cid=${chapter.serialID}`
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let data = JSON.stringify({
    ContentAnchorBatch: [{
      BookID: url.query("bid"),
      ChapterSeqNo: [
        url.query("cid")
      ]
    }],
    Scene: "chapter",
    ReaderVersion: 2008
  })
  let response = POST("https://novel.html5.qq.com/be-api/content/ads-read",{data,headers:["Q-GUID:4bbcbac89f9b53a1fb75aa860a8188cb","QIMEI36:a2ba4d218c43293e3ce031f510001ef17111"]})
  let $ = JSON.parse(response)
  return $.data.Content[0].Content
}

var bookSource = JSON.stringify({
  name: "QQ浏览器免费小说",
  url: "novel.html5.qq.com",
  version: 104
})
