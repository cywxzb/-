require('crypto-js')

const uid = localStorage.getItem('uid') ? Number(localStorage.getItem('uid')) : -1

const token = localStorage.getItem('tk')

const headers = ["version:v3",`logintoken:${token}`]

//搜索
const search = (key) => {
  let sign = CryptoJS.MD5(`count=10&isDevice=Android&keywords=${key}&page=1&regDevice=2&key=87ac02d392a8d3566fe7748c8de00af3&secrect=57dcuidu8aa8062bfe8042ea65310669`).toString().toUpperCase()
  let data = JSON.stringify({
    count: 10,
    isDevice: "Android",
    keywords: key,
    page: 1,
    regDevice: "2",
    sign: sign
  })
  let response = POST('https://api.shaoniandream.com/Booklibrary/index',{data,headers})
  let $ = JSON.parse(response)
  let array = []
  $.data.forEach((child) => {
    array.push({
      name: child.title,
      author: child.penName,
      cover: `http://alioss.shaoniandream.com${child.picture}`,
      detail: child.BooksID
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let sign = CryptoJS.MD5(`BookID=${url}&UserID=${uid}&isDevice=Android&regDevice=2&key=87ac02d392a8d3566fe7748c8de00af3&secrect=57dcuidu8aa8062bfe8042ea65310669`).toString().toUpperCase()
  let data = JSON.stringify({
    BookID: url,
    UserID: uid,
    isDevice: "Android",
    regDevice: "2",
    sign: sign
  })
  let response = POST('https://api.shaoniandream.com/Booklibrary/bookdetail',{data,headers})
  let $ = JSON.parse(response).data
  let book = {
    summary: $.jianjie,
    status: $.tempSerialState,
    category: $.booklabel.replaceAll(","," "),
    words: $.FontCount.replace("字",""),
    update: $.ChapterAddTime,
    lastChapter: $.ChapterName.replace("连载至",""),
    catalog: $.id
  }
  return JSON.stringify(book)
}

//目录
const catalog = (url) => {
  let sign = CryptoJS.MD5(`BookID=${url}&UserID=${uid}&isDevice=Android&regDevice=2&key=87ac02d392a8d3566fe7748c8de00af3&secrect=57dcuidu8aa8062bfe8042ea65310669`).toString().toUpperCase()
  let data = JSON.stringify({
    BookID: url,
    UserID: uid,
    isDevice: "Android",
    regDevice: "2",
    sign: sign
  })
  let response = POST('https://api.shaoniandream.com/Booklibrary/readdir',{data,headers})
  let $ = JSON.parse(response)
  let array = []
  $.data.chapterList.forEach((booklet) => {
    array.push({ name: booklet.title })
    booklet.chapterList.forEach((chapter) => {
      array.push({
        name: chapter.title,
        url: `a?bid=${url}&cid=${chapter.id}`,
        vip: chapter.isFree == 1
      })
    })
  })
  return JSON.stringify(array)
}

//章节
const chapter = (url) => {
  let sign = CryptoJS.MD5(`BookID=${url.query('bid')}&UserID=${uid}&chapter_id=${url.query('cid')}&isDevice=Android&isMarket=true&regDevice=2&key=87ac02d392a8d3566fe7748c8de00af3&secrect=57dcuidu8aa8062bfe8042ea65310669`).toString().toUpperCase()
  let data = JSON.stringify({
    BookID: url.query('bid'),
    UserID: uid,
    chapter_id: url.query('cid'),
    isDevice: "Android",
    isMarket:"true",
    regDevice: "2",
    sign: sign
  })
  let response = POST('https://api.shaoniandream.com/Booklibrary/readchapter',{data,headers})
  let $ = JSON.parse(response)
  //未购买返回403和自动订阅地址
  if ($.msg == "请订阅该书籍!") throw JSON.stringify({
    code: 403,
    message: `https://h5.shaoniandream.com/pages/chapter/index?bookid=${$.data.BookID}&chapterid=${$.data.id}`
  })
  let content = $.data.show_content.map((item)=>{
    return DECODE(item.content,"base64")
  }).join("\n").trim()
  let img = $.data.chapterpic.map((item)=>{
    return `<img src="http://alioss.shaoniandream.com${item.url}" />`
  }).join("\n").trim()
  let miaoshu = DECODE($.data.miaoshu,"base64")
  if(miaoshu != "")
    return `${content}\n${img}\n作者有话说：\n${miaoshu}`
  else return `${content}\n${img}`
}

/**
 * 个人
 * @returns {[{url, nickname, recharge, balance[{name, coin}], sign}]}
 */
const profile = () => {
  let sign = CryptoJS.MD5(`UserID=${uid}&isDevice=Android&regDevice=2&key=87ac02d392a8d3566fe7748c8de00af3&secrect=57dcuidu8aa8062bfe8042ea65310669`).toString().toUpperCase()
  let data = JSON.stringify({
    UserID: uid,
    isDevice: "Android",
    regDevice: "2",
    sign: sign
  })
  let response = POST('https://api.shaoniandream.com/User/getUserInfo',{data,headers})
  let $ = JSON.parse(response).data
  return JSON.stringify({
    basic: [
      {
        name: '账号',
        value: $.nickname,
        url: 'https://h5.shaoniandream.com/pages/my/index'
      },
      {
        name: '萌币',
        value: $.wsMoney,
        url: 'https://h5.shaoniandream.com/pages/my/myrecharge/index',
      },
      {
        name: '临时萌币',
        value: $.giveMoney,
        url: 'https://h5.shaoniandream.com/pages/my/myrecharge/index',
      },
      {
        name: '月票',
        value: $.monthlyTickets,
        url: '',
      },
      {
        name: '硬币',
        value: $.recommendedVotes,
        url: '',
      }
    ],
    extra: [
      {
        name: '书架',
        type: 'books',
        method: 'bookshelf'
      }
    ]
  })
}

/**
 * 我的书架
 * @param {页码} page 
 */
const bookshelf = (page) => {
  let sign = CryptoJS.MD5(`UserID=${uid}&count=10&isDevice=Android&page=${page + 1}&regDevice=2&key=87ac02d392a8d3566fe7748c8de00af3&secrect=57dcuidu8aa8062bfe8042ea65310669`).toString().toUpperCase()
  let data = JSON.stringify({
    UserID: uid,
    count: 10,
    isDevice: "Android",
    page: page + 1,
    regDevice: "2",
    sign: sign
  })
  let response = POST('https://api.shaoniandream.com/Bookcase/favolist',{data,headers})
  let $ = JSON.parse(response)
  let books = $.data.map(book => ({
    name: book.BookName,
    author: book.penName,
    cover: `http://alioss.shaoniandream.com${book.picture}`,
    detail: book.id
  }))
  return JSON.stringify({
    end: $.data.length == 0,
    books: books
  })
}

//排行榜
const rank = (title, category, page) => {
  let sign = CryptoJS.MD5(`count=10&isDevice=Android&keywords=&page=1&regDevice=2&str=${title}_0_0_0_0_0_0_0_0_&key=87ac02d392a8d3566fe7748c8de00af3&secrect=57dcuidu8aa8062bfe8042ea65310669`).toString().toUpperCase()
  let data = JSON.stringify({
    count: 10,
    isDevice: "Android",
    keywords: "",
    page: page + 1,
    regDevice: "2",
    sign: sign,
    str: `${title}_0_0_0_0_0_0_0_0_`
  })
  let response = POST('https://api.shaoniandream.com/Booklibrary/index',{data,headers})
  let $ = JSON.parse(response)
  let books = []
  $.data.forEach((child) => {
    books.push({
      name: child.title,
      author: child.penName,
      cover: `http://alioss.shaoniandream.com${child.picture}`,
      detail: child.BooksID
    })
  })
  return JSON.stringify({
    end: $.data.length == 0,
    books: books
  })
}

const ranks = [
    {
        title: {
            key: '6',
            value: '奇幻冒险'
        }
    },
    {
        title: {
            key: '2',
            value: '仙侠玄幻'
        }
    },
    {
        title: {
            key: '9',
            value: '网游科幻'
        }
    },
    {
        title: {
            key: '8',
            value: '动漫幻想'
        }
    },
    {
        title: {
            key: '7',
            value: '历史策略'
        }
    },
    {
        title: {
            key: '10',
            value: '恐怖生存'
        }
    },
    {
        title: {
            key: '11',
            value: '都市人生'
        }
    }
]

const login = (args) => {
  let sign = CryptoJS.MD5(`isDevice=Android&password=${args[1]}&phone=${args[0]}&regDevice=2&key=87ac02d392a8d3566fe7748c8de00af3&secrect=57dcuidu8aa8062bfe8042ea65310669`).toString().toUpperCase()
  let data = JSON.stringify({
    isDevice: "Android",
    password: args[1],
    phone: args[0],
    regDevice: "2",
    sign: sign
  })
  let response = POST('https://api.shaoniandream.com/Login/login',{data,headers})
  let $ = JSON.parse(response)
  if($.status != 1) return $.msg
  let token = $.data.logintoken
  let uid = $.data.id
  localStorage.setItem("tk",token)
  localStorage.setItem("uid",String(uid))
}

var bookSource = JSON.stringify({
  name: "少年梦阅读",
  url: "shaoniandream.com",
  version: 101,
  authorization: JSON.stringify(['account','password']),
  cookies: [".shaoniandream.com"],
  ranks: ranks
})
