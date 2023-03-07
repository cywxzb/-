require('crypto-js')

//搜索
const search = (key) => {
    let time = Math.round(new Date() / 1000)
    let sign = CryptoJS.MD5(`amdryvsj9wpjntgsappId=&keyword=${key}&marketChannel=oppo&osType=2&packageName=com.yanyugelook.app&page_num=1&product=1&sysVer=12&time=${time}&token=&udid=a92b805a-99fc-393e-a102-b7233d55fdbe&ver=3.0.06b4n1zqka1vs89c092j0aovgnpbn7rgi`).toString().toUpperCase()
    let data = JSON.stringify({
        product: "1",
        ver: "3.0.0",
        marketChannel: "oppo",
        sign: sign,
        page_num: "1",
        sysVer: "12",
        token: "",
        appId: "",
        osType: "2",
        time: time,
        packageName: "com.yanyugelook.app",
        udid: "a92b805a-99fc-393e-a102-b7233d55fdbe",
        keyword: key
    })
    let response = POST(`http://api.jsword.net/book/search`, {
        data
    })
    let array = []
    let $ = JSON.parse(response)
    $.data.list.forEach((child) => {
        array.push({
            name: child.name,
            author: child.author,
            cover: child.cover,
            detail: child.book_id,
        })
    })
    return JSON.stringify(array)
}

//详情
const detail = (url) => {
    let time = Math.round(new Date() / 1000)
    let sign = CryptoJS.MD5(`amdryvsj9wpjntgsappId=&book_id=${url}&marketChannel=oppo&osType=2&packageName=com.yanyugelook.app&product=1&sysVer=12&time=${time}&token=&udid=a92b805a-99fc-393e-a102-b7233d55fdbe&ver=3.0.06b4n1zqka1vs89c092j0aovgnpbn7rgi`).toString().toUpperCase()
    let data = JSON.stringify({
        product: "1",
        ver: "3.0.0",
        appId: "",
        osType: "2",
        marketChannel: "oppo",
        sign: sign,
        sysVer: "12",
        time: time,
        packageName: "com.yanyugelook.app",
        book_id: url,
        udid: "a92b805a-99fc-393e-a102-b7233d55fdbe",
        token: ""
    })
    let response = POST(`http://api.jsword.net/book/info`, {
        data
    })
    let $ = JSON.parse(response).data.book
    let book = {
        summary: $.description,
        status: $.finished,
        category: $.tag[0].tab,
        words: $.total_words.replace("字", ""),
        update: $.last_chapter_time.replace("更新于", ""),
        lastChapter: $.last_chapter,
        catalog: $.book_id
    }
    return JSON.stringify(book)
}

//目录
const catalog = (url) => {
    let time = Math.round(new Date() / 1000)
    let sign = CryptoJS.MD5(`amdryvsj9wpjntgsappId=&book_id=${url}&marketChannel=oppo&osType=2&packageName=com.yanyugelook.app&product=1&sysVer=12&time=${time}&token=&udid=a92b805a-99fc-393e-a102-b7233d55fdbe&ver=3.0.06b4n1zqka1vs89c092j0aovgnpbn7rgi`).toString().toUpperCase()
    let data = JSON.stringify({
        product: "1",
        ver: "3.0.0",
        appId: "",
        osType: "2",
        marketChannel: "oppo",
        sign: sign,
        sysVer: "12",
        time: time,
        packageName: "com.yanyugelook.app",
        book_id: url,
        udid: "a92b805a-99fc-393e-a102-b7233d55fdbe",
        token: ""
    })
    let response = POST(`http://api.jsword.net/chapter/catalog`, {
        data
    })
    let $ = JSON.parse(response)
    let array = []
    $.data.chapter_list.forEach(chapter => {
        array.push({
            name: chapter.chapter_title,
            url: `a?bid=${url}&cid=${chapter.chapter_id}`
        })
    })
    return JSON.stringify(array)
}

//章节
const chapter = (url) => {
    let time = Math.round(new Date() / 1000)
    let sign = CryptoJS.MD5(`amdryvsj9wpjntgsappId=&book_id=${url.query("bid")}&chapter_id=${url.query("cid")}&marketChannel=oppo&osType=2&packageName=com.yanyugelook.app&product=1&sysVer=12&time=${time}&token=&udid=a92b805a-99fc-393e-a102-b7233d55fdbe&ver=3.0.06b4n1zqka1vs89c092j0aovgnpbn7rgi`).toString().toUpperCase()
    let data = JSON.stringify({
        product: "1",
        ver: "3.0.0",
        marketChannel: "oppo",
        appId: "",
        osType: "2",
        sign: sign,
        sysVer: "12",
        time: time,
        packageName: "com.yanyugelook.app",
        book_id: url.query("bid"),
        chapter_id: url.query("cid"),
        udid: "a92b805a-99fc-393e-a102-b7233d55fdbe",
        token: ""
    })
    let $ = JSON.parse(POST('http://api.jsword.net/chapter/text', {
        data
    })).data
    return $.content.trim().replace("如果章节乱码或者更新缓慢，可以打开浏览器访问yuntuxs.com下载『云兔搜书』，可以离线阅读，小说更新更快，换源阅读！","")
}

var bookSource = JSON.stringify({
    name: "乐兔小说",
    url: "jsword.net",
    version: 100