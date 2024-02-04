function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
  var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
  var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
  var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
  var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
  return Y+M+D+h+m+s;
}

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
  let response = GET(`https://api5-normal-sinfonlineb.fqnovel.com/reading/bookapi/multi-detail/v/?aid=1967&iid=1&version_code=999&book_id=${url}`)
  let $ = JSON.parse(response).data[0]
  let book = {
    summary: $.abstract,
    status: $.creation_status == 1 ? '连载' : '完结',
    category: $.category,
    words: $.word_number,
    update: timestampToTime($.last_chapter_update_time),
    lastChapter: $.last_chapter_title,
    catalog: $.book_id
  }
  return JSON.stringify(book)
}


const catalog = (url) => {
	let response = GET(`https://fanqienovel.com/api/reader/directory/detail?bookId=${url}`, { headers: ["User-Agent:Restler/0.17.6 (android)"] })
    let json = JSON.parse (response)
	let array = []
    
    json.data.chapterListWithVolume.forEach((volume) => {
        volume.forEach((book) => {
            array.push({
                name: book.title,
                id: book.itemId,
                vol: book.volume_name
            })
        })
    })
    
	let $ = JSON.parse(JSON.stringify(array))
    let v = []
    let list = []
    $.forEach($=>{
		V = $.vol
		if(JSON.stringify(v).indexOf(V)==-1){
				v.push(V)
				list.push({
						name: '📖['+V+']📖'
					});
			}
		 list.push({
				name: $.name,
			 url: `http://list.jingluofq.jilulu.cn/random#/content?item_id=${$.id}`
			})
	})
    return JSON.stringify(list)
}

const chapter = (url) => {
  let u = GET(url)
  let	ur = url.split("#")[1]
 	if (u.includes("list.jingluofq.jilulu.cn"))
		url = u + ur
	else
		url = `http://list.jingluofq.jilulu.cn` + ur
	
	data = JSON.parse(GET(url)).data

  let content = ""
	if (data.hasOwnProperty("data"))
		return data.data.content
	else
		return data.content
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
			name     : item.book_name,
			author   : item.author,
			summary	 : item.abstract,
			status   : item.creation_status == 1 ? '连载' : '完结',
			category : item.score + '分 ' + item.tags,
			words    : item.word_number,
			cover    : item.thumb_url,
			detail   : item.book_id
		})
	})
	return JSON.stringify({
		end: page == 1000000,
		books
	})
}

const catagoryAll = [
	{"value": "都市","key": "1"},{"value": "神豪","key": "20"},{"value": "种田","key": "23"},{"value": "娱乐圈","key": "43"},{"value": "历史","key": "12"},{"value": "搞笑轻松","key": "778"},{"value": "都市脑洞","key": "262"},{"value": "黑科技","key": "854"},{"value": "抗战谍战","key": "504"},{"value": "玄幻","key": "7"},{"value": "明朝","key": "126"},{"value": "火影","key": "368"},{"value": "科幻","key": "8"},{"value": "单女主","key": "389"},{"value": "无敌","key": "384"},{"value": "二次元","key": "39"},{"value": "诸天万界","key": "71"},{"value": "都市种田","key": "263"},{"value": "末世","key": "68"},{"value": "大唐","key": "73"},{"value": "直播","key": "69"},{"value": "奶爸","key": "42"},{"value": "都市日常","key": "261"},{"value": "谍战","key": "507"},{"value": "重生","key": "36"},{"value": "大佬","key": "520"},{"value": "衍生同人","key": "718"},{"value": "历史古代","key": "273"},{"value": "末日求生","key": "515"},{"value": "系统","key": "19"},{"value": "特种兵","key": "375"},{"value": "战争","key": "97"},{"value": "赛博朋克","key": "873"},{"value": "悬疑灵异","key": "751"},{"value": "漫威","key": "374"},{"value": "网游","key": "372"},{"value": "反派","key": "369"},{"value": "三国","key": "67"},{"value": "海贼","key": "370"},{"value": "灵异","key": "100"},{"value": "副本","key": "864"},{"value": "穿越","key": "37"},{"value": "武侠","key": "16"},{"value": "同人","key": "538"},{"value": "洪荒","key": "66"},{"value": "升级流","key": "830"},{"value": "年代","key": "79"},{"value": "西游","key": "373"},{"value": "规则怪谈","key": "851"},{"value": "大秦","key": "377"},{"value": "游戏主播","key": "509"},{"value": "都市修真","key": "124"},{"value": "都市异能","key": "516"},{"value": "皇帝","key": "498"},{"value": "架空","key": "452"},{"value": "修仙","key": "517"},{"value": "历史脑洞","key": "272"},{"value": "美食","key": "78"},{"value": "争霸","key": "837"},{"value": "奇幻仙侠","key": "259"},{"value": "学霸","key": "82"},{"value": "奥特同人","key": "367"},{"value": "玄幻脑洞","key": "257"},{"value": "游戏体育","key": "746"},{"value": "破案","key": "505"},{"value": "官场","key": "788"},{"value": "大小姐","key": "519"},{"value": "神医","key": "26"},{"value": "海贼王","key": "833"},{"value": "国运","key": "496"},{"value": "惊悚游戏","key": "537"},{"value": "校花","key": "385"},{"value": "轻小说","key": "858"},{"value": "东方玄幻","key": "511"},{"value": "乡村","key": "11"},{"value": "影视小说","key": "45"},{"value": "第四天灾","key": "855"},{"value": "异世大陆","key": "512"},{"value": "囤物资","key": "494"},{"value": "宋朝","key": "501"},{"value": "天灾","key": "658"},{"value": "女帝","key": "378"},{"value": "盗墓","key": "81"},{"value": "海岛","key": "40"},{"value": "电竞","key": "508"},{"value": "神奇宝贝","key": "371"},{"value": "宝可梦","key": "859"},{"value": "发家致富","key": "840"},{"value": "宠物","key": "74"},{"value": "都市生活","key": "2"},{"value": "聊天群","key": "381"},{"value": "清朝","key": "503"},{"value": "无脑爽","key": "850"},{"value": "悬疑脑洞","key": "539"},{"value": "黑化","key": "846"},{"value": "四合院","key": "495"},{"value": "特工","key": "518"},{"value": "体育","key": "15"},{"value": "九叔","key": "383"},{"value": "扮猪吃虎","key": "93"},{"value": "求生","key": "379"},{"value": "天才","key": "90"},{"value": "迪化","key": "843"},{"value": "空间","key": "44"},{"value": "灵气复苏","key": "514"},{"value": "废土","key": "869"},{"value": "龙珠","key": "376"},{"value": "无限流","key": "70"},{"value": "穿书","key": "382"},{"value": "开局","key": "453"},{"value": "赘婿","key": "25"},{"value": "星际","key": "77"},{"value": "封神","key": "731"},{"value": "克苏鲁","key": "705"},{"value": "战神","key": "27"},{"value": "鉴宝","key": "17"},{"value": "无后宫","key": "838"},{"value": "高武世界","key": "513"},{"value": "捉鬼","key": "867"},{"value": "职场","key": "127"},{"value": "传统玄幻","key": "258"},{"value": "悬疑","key": "10"},{"value": "山海经","key": "875"},{"value": "综漫","key": "465"},{"value": "断层","key": "500"},{"value": "推理","key": "61"},{"value": "都市青春","key": "396"},{"value": "钓鱼","key": "493"},{"value": "双重生","key": "524"},{"value": "家庭","key": "125"},{"value": "斩神","key": "857"},{"value": "科举","key": "832"},{"value": "宫廷侯爵","key": "502"},{"value": "全能","key": "856"},{"value": "卡牌","key": "874"},{"value": "双系统","key": "866"},{"value": "神探","key": "506"},{"value": "打脸","key": "522"},{"value": "剑道","key": "80"},{"value": "群像","key": "841"},{"value": "灵魂互换","key": "831"},{"value": "外卖","key": "75"},{"value": "文化历史","key": "62"},{"value": "高手下山","key": "845"},{"value": "无女主","key": "391"},{"value": "腹黑","key": "92"},{"value": "惊悚","key": "322"},{"value": "武将","key": "497"},{"value": "1v1","key": "834"},{"value": "生活","key": "48"},{"value": "文学小说","key": "47"},{"value": "魂穿","key": "852"},{"value": "第一人称","key": "871"},{"value": "剑修","key": "868"}
]

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
	name: "Fun番茄(接口目录)",
	url: "list.jingluofq.jilulu.cn.catlog.api",
	ranks: ranks,
    version: 103        
})
