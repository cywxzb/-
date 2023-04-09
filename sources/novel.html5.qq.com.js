//转换时间戳
function timestampToTime(timestamp) {
    let date
    if (timestamp.length == 13) date = new Date(timestamp);
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
  let response = POST("https://novel.html5.qq.com/be-api/content/ads-read",{data,headers:["Q-GUID:33db0bf38d6e0427ec54339308fc88cb","QIMEI36:d99603dddd28d412febcd6b9100016c17319","Q-UA:ADRQBX123_GA/1235574&X5MTT_3/&ADR&6814114& Mi13 &73820&16261&Android13 &V3","Q-UA2:QV=3&PL=ADR&PR=QB&PP=com.tencent.mtt&PPVN=12.3.5.5574&TBSVC=45001&CO=BK&COVC=030000&PB=GE&VE=GA&DE=PHONE&CHID=73820&LCID=16261&MO= Mi13 &RL=1080*2250&OS=13&API=33&DS=64&RT=32&REF=qb_0&TM=00"]})
  let $ = JSON.parse(response)
  return $.data.Content[0].Content
}

var bookSource = JSON.stringify({
  name: "QQ浏览器免费小说",
  url: "novel.html5.qq.com",
  version: 105
})
