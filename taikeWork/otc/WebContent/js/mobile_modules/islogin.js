var pagesize = 10;//每页条数
var OpenID = isnull(sessionStorage.getItem("OpenID")); //缓存中的OpenID;
var currturl = window.location.href;  //获取当前url
var mname = "";
var code = "2e77e836fe07868acf005b603c7459e2"
var code1 = "cb33b9db8e150e8b2db1b1b6a627b740"
var dft_img = "../images/mobile/default.png"; //默认图片 
var dft_headimg = "../images/mobile/17.png"; //默认头像图片 

var crrentindex = currturl.split("mobile")[0];

/*  判断是本地测试还是正式服务器  */
var istest = (function () {
    var firsturl = currturl.split(".")[0]
    if (firsturl == "http://192" || firsturl == "192") {
        return true;
    }
    else {
        return false;
    }
})();


//微信登录code
function wxurl(statenum) {
    statenum=isnull(statenum) == ""?generateMixed(6):statenum;
    
    var xurl = "";
    if (is_weixin) {
        wxurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbfff10e577b27a7&redirect_uri=" + crrentindex + "mobile/getcode.html&response_type=code&scope=snsapi_base&state=" + statenum + "#wechat_redirect";
    }
    else {
        wxurl = "getcode.html?code=" + code + "&state=" + statenum;
    }
    return wxurl;
}


//绑定账号页面获取微信头像code
function wxheadurl(statenum) {
    if (isnull(statenum) == "") {
        statenum = generateMixed(6);
    }
    var xurl = "";
    if (is_weixin) {
        //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbfff10e577b27a7&redirect_uri=http://demo.itaike.cn:8088/otc/mobile/login.html&response_type=code&scope=snsapi_base&state=ak2017&connect_redirect=1#wechat_redirect
        wxurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbfff10e577b27a7&redirect_uri=" + crrentindex + "mobile/login.html&response_type=code&scope=snsapi_base&state=" + statenum + "#wechat_redirect";
    }
    else {
        wxurl = "login.html?code=" + code1 + "&state=" + statenum;
    }
    return wxurl;
}

//上传头像页面获取微信头像code
function wxauth(state){
    if (isnull(state) == "") {
        state = generateMixed(6);
    }
    var wxauth = "";
    if (is_weixin) {
        wxauth = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbfff10e577b27a7&redirect_uri=" + crrentindex + "mobile/getauthcode.html&response_type=code&scope=snsapi_base&state=" + state + "#wechat_redirect";
    }
    else {
        wxauth = "getauthcode.html?code=" + code1 + "&state=" + generateMixed(6);
    }
    return wxauth;
}


/*
页面div中显示信息
*
显示方式
showmsg({
msg:"",  //显示的信息,
isbtn:"",   //是否显示按钮,
url:"",//点击按钮时的跳转链接 为空时为刷新,
showimg:"",//错误图片,
btntext:"",//按钮文字,
classname:"",//样式名
})
*/

function showmsg(str) {
    var msg = isnull(str.msg)==""?"系统错误，请联系管理员":str.msg;
    var url = isnull(str.url);
    var btntext = isnull(str.btntext)==""?"立即刷新":str.btntext;
    var showimg = isnull(str.showimg)==""?"../images/mobile/Datafailed.png":str.showimg;
    var isbtn = isnull(str.isbtn);
    var classname = isnull(str.classname);
    var backurl=url ==""? "1":"2";

    if (isbtn == "") {
        isbtn = false;
    }
    else if (isbtn != true && isbtn != false) {
        isbtn = false;
    }
    var showmsg = "";
    var btns = backurl == "1" ? "<button class='nonetwork_btn' onTouchEnd=reload()>" + btntext + "</button>" : "<button class='nonetwork_btn' onTouchEnd=linkto('" + url + "')>" + btntext + "</button>"
    var isshowbtn = isbtn ? btns : "";
    showmsg += "<div class='nonetwork " + classname + "'>";
    showmsg += "<div class='nonetworkwarp'>";
    showmsg += "<img src='" + showimg + "'>";
    showmsg += "<p> " + msg + "</p>";
    showmsg += isshowbtn;
    showmsg += "</div>";
    showmsg += "</div>";
    return showmsg;
}


//ajax处理中提示
function ajaxdong(text, $this, time) {

    if (isnull(text) == "") {
        text = "正在处理中"
    }
    if (isnull(time) == "") {
        time = 2000
    }
    setTimeout(function () {

        if ($this.state.isload) {
            layer.open({
                shade: true,
                content: text,
                skin: 'msg',
                className: 'tip',
            });
        }
    }, 2000)
}



//加载
var loading = "";
loading += "<div class='loading'>";
loading += "<div class='spinner'>"
loading += "<div class='bounce1'></div>"
loading += "<div class='bounce2'></div>"
loading += "<div class='bounce3'></div>"
loading += "</div>"
loading += "<P>正在加载数据..</p>";
loading += "</div>";

//加载更多
var loadingmore = "";
loadingmore += "<div class='loading1'>";
loadingmore += "<i class='fa fa-spinner fa-pulse'></i>";
loadingmore += "</div>";





//无网络
var nonetwork = "";
nonetwork += "<div class='nonetwork'>";
nonetwork += "<div class='nonetworkwarp'>";
nonetwork += "<img src='../images/mobile/nonetwork.png'>";
nonetwork += "<p> 无法连接网络，请检查网络并刷新重试</p>";
nonetwork += "<button class='nonetwork_btn' onTouchEnd='reload()'>重试</button>";
nonetwork += "</div>";
nonetwork += "</div>";

//获取数据失败
var Datafailed = "";
Datafailed += "<div class='nonetwork'>";
Datafailed += "<div class='nonetworkwarp'>";
Datafailed += "<img src='../images/mobile/Datafailed.png'>";
Datafailed += "<p> 加载失败</p>";
Datafailed += "<button class='nonetwork_btn' onTouchEnd='reload()'>重试</button>";
Datafailed += "</div>";
Datafailed += "</div>";

var Datafailed1 = "";
Datafailed1 += "<div class='nonetwork'>";
Datafailed1 += "<div class='nonetworkwarp'>";
Datafailed1 += "<img src='../images/mobile/Datafailed.png'>";
Datafailed1 += "<p> 加载失败，数据超时</p>";
Datafailed1 += "<button class='nonetwork_btn' onTouchEnd='reload()'>重试</button>";
Datafailed1 += "</div>";
Datafailed1 += "</div>";




function Datafaile(str, url, btntext, imgurl, isbtn) {

    if (isnull(url) == "") {
        url = "index.html";
    }
    if (btntext == "" || btntext == undefined || btntext == null) {
        btntext = "立即返回";
    }

    if (imgurl == "" || imgurl == undefined || imgurl == null) {
        imgurl = "../images/mobile/Datafailed.png";
    }

    var Datafaile = "";
    Datafaile += "<div class='nonetwork'>";
    Datafaile += "<div class='nonetworkwarp'>";
    Datafaile += "<img src='" + imgurl + "'>";
    Datafaile += "<p> " + str + "</p>";
    if (isbtn == "0") {
    } else {
        Datafaile += "<button class='nonetwork_btn' onTouchEnd=back('" + url + "')>" + btntext + "</button>";
    }

    Datafaile += "</div>";
    Datafaile += "</div>";
    return Datafaile
}



function success(str, url, btntext) {

    if (url == "" || url == undefined || url == null) {
        url = "index.html";
    }
    if (btntext == "" || btntext == undefined || btntext == null) {
        btntext = "立即返回";
    }

    var Datafaile = "";
    Datafaile += "<div class='nonetwork'>";
    Datafaile += "<div class='nonetworkwarp'>";
    Datafaile += "<img src='../images/mobile/29.png' class='successimg'>";
    Datafaile += "<p> " + str + "</p>";
    Datafaile += "<button class='nonetwork_btn' onTouchEnd=back('" + url + "')>立即返回</button>";
    Datafaile += "</div>";
    Datafaile += "</div>";
    return Datafaile
}


// 刷新页面
function reload() {
    setTimeout(function () {
        location.reload();
    }, 320)
}

function back(str) {
    setTimeout(function () {
        window.location.href = topreurl(str);
    }, 320)
};

function linkto(str) {
    setTimeout(function () {
        window.location.href = str;
    }, 320)
};


//根据code获取头像
function getwxavatar(code, backtourl) {
    var object = new Object();
    object.code = code;
    console.log(code);
    $.ajax({
        url: "/otcdyanmic/wechatGetImg.do",
        data: { paramMap: JSON.stringify(object) },
        type: "post",
        dataType: "json",
        success: function (data) {
            console.log(data);
            if (data != "" && data != null && data != undefined) {
                //用户获取信息成功
                if (data.success == true) {
                    console.log("获取头像成功")
                    //设置属性
                    sessionStorage.setItem("avatar", isnull(data.map.imgUrl));

                    setTimeout(function () {
                        window.location.href = backtourl;
                    }, 2000);

                }
                //用户获取信息失败
                if (data.success == false) {

                    //sessionStorage.setItem("avatar", isnull(data.avatar));
                    console.log("获取信息失败;");
                    layer.open({
                        shade: false,
                        content: '获取头像失败！',
                        skin: 'msg',
                        className: 'tip',
                        time: 3 //3秒后自动关闭
                    });
                }
            }
            else {
                var failetext = "内部异常！请返回重新登录"
                $("#conter").html(Datafaile(failetext, backtourl));

            }


        }.bind(this),
        error: function () {
            console.log("2");
            var failetext = "获取登录信息失败：网络错误！请返回重新登录"
            $("#conter").html(Datafaile(failetext, backtourl));
            console.log("获取登录信息失败：网络错误")

        }.bind(this)
    });
}


//通用日期转换
/*
**
str    要转换的日期
type   1:yy-MM
type   2:yy-MM-dd
type   3:yy-MM-dd HH:mm
type   4:yy-MM-dd HH:mm:ss
type   5: HH:mm:ss
ico  修改中间横杆
*/
function dateformdate(str, type, ico) {
    var datetime = "";
    var dico = dateico(ico);
    if (str == null || str == undefined) {
        return "";
    }
    else {
        var date = str.replace(" ", "_").replace(/([^\u0000-\u00FF])/g, "_").replace(/\-/g, "_").replace(/\//g, "_").split("_")

        if (type == 1 && date.length >= 2) {
            var year = date[0];
            var money = date[1];
            datetime = year + dico + money;

            return datetime
        }
        if (type == 2 && date.length >= 3) {
            var year = date[0];
            var money = date[1];
            var day = date[2];
            datetime = year + dico + money + dico + day;

            return datetime
        }
        if (type == 3 && date.length >= 4) {
            var year = date[0];
            var money = date[1];
            var day = date[2];
            var time = dotime(date[3], 3);
            datetime = year + dico + money + dico + day + " " + time;

            return datetime
        }
        if (type == 4 && date.length >= 4) {
            var year = date[0];
            var money = date[1];
            var day = date[2];
            var time = removet(date[3]);
            datetime = year + dico + money + dico + day + " " + time;

            return datetime
        }
        if (type == 5 && date.length >= 4) {
            var year = date[0];
            var money = date[1];
            var day = date[2];
            var time = removet(date[3], 3);
            datetime = time;

            return datetime
        }
        else {
            return str;
        }
    }

}
//处理图标
function dateico(t) {

    if (t == "" || t == null || t == undefined) {
        return "-"
    }
    else {
        return t;
    }



}

function dotime(str, tp) {
    var time = removet(str);
    var timearr = time.split(":");
    if (tp == "3" && timearr.length >= 2) {
        return timearr[0] + ":" + timearr[1];
    }
    else {
        return time;
    }


}




//去除时间多余部分
function removet(s) {
    var time = "";

    if (s.indexOf(".") != "-1") {  //存在
        time = s.split(".")[0];
        return time;
    }
    else {
        time = s;
        return time;
    }
}

/*
通用日期转换结束

*/



/*
去除""或undefind null
*
*
*/

function isnull(str) {
    if (str == null || str == undefined || str == "undefined") {
        return "";
    }
    else {
        return str;
    }
}

//判断图片是否存在
function IsExist(imgurl) {


    var ImgObj = new Image(); //判断图片是否存在  
    ImgObj.src = imgurl;
    //没有图片，则返回-1  
    if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
        return true;
    } else {
        return false;
    }
}



//判断图片是否为空
function isnullimg(str) {

    if (isnull(str) == null) {
        return dft_img;
    }
    else {
        var firsturl = currturl.split(".")[0]

        if (istest) {   //测试环境
            return crrentindex.replace("otc", "otcdyanmic") + str.replace("otc", "");
        }
        else {
            return str;
        }

    }
}

//判断图片是否为空
function isnullimg1(str) {

    if (str == null || str == undefined || str == "") {
        return dft_img;
    }
    else {
        var firsturl = currturl.split(".")[0]

        if (istest) {   //测试环境
            return crrentindex.replace("otc", "otcdyanmic") + str.replace("otc", "otcdyanmic");
        }
        else {
            return "/otc/" + str;
        }

    }
}

//判断头像是否为空
function isnullheadimg(str) {
    var firsturl = currturl.split(".")[0]
    if (str == null || str == undefined || str == "") {
        return dft_headimg;
    }
    else {
        var headimg = istest ? str.replace("otc", "otcdyanmic") : str  //istest为true时为测试环境
        return headimg;
    }
}

//加零
function addzerro(str) {
    if (parseInt(str) < 10) {
        return "0" + parseInt(str);
    }
    else {
        return parseInt(str);
    }

}

//获取url参数
function geturl(name) {
    var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
    if (reg.test(location.href)) return decodeURI(RegExp.$2.replace(/\+/g, " ")); return "";
};


//下载
/*
function downloadFile() {
    alert(6);
    var imgURL = "otcdyanmic/images/u45.png";

    if (document.all.a1 == null) {
        objIframe = document.createElement("IFRAME");
        document.body.insertBefore(objIframe);
        objIframe.outerHTML = "<iframe name=a1 style='width:400px;hieght:300px' src=" + imageName.href + "></iframe>";
        re = setTimeout("savepic()", 1)
    }
    else {
        clearTimeout(re)
        pic = window.open(imageName.href, "a1")
        pic.document.execCommand("SaveAs")
        document.all.a1.removeNode(true)
    }

}
*/








//判断是否可以分页及总共多少页
function pagey(pagesize, cont, currentpage) {
    var pageinfo;
    pagesize = parseInt(pagesize);
    cont = parseInt(cont);
    currentpage = parseInt(currentpage);
    if (cont > pagesize) {  //总数大于每页数  分页

        var z = cont / pagesize;
        var z1 = cont % pagesize;

        var pagecont;
        if (z1 == 0) {
            pagecont = parseInt(z);

        }
        if (z1 > 0) {
            pagecont = parseInt(z) + 1;

        }
        var ispage;

        if (currentpage < pagecont) {
            ispage = "true"
        }
        if (currentpage >= pagecont) {
            ispage = "false"
        }

        pageinfo = { "pagecont": pagecont, "ispage": ispage }
        return pageinfo
    }
    else {   //一页，不分页

        $(".showmore").html("");
        pageinfo = { "pagecont": "1", "ispage": "false" }

        return pageinfo;
    }

}


//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + addzerro(month) + seperator1 + addzerro(strDate)
        + " " + addzerro(date.getHours()) + seperator2 + addzerro(date.getMinutes())
        + seperator2 + addzerro(date.getSeconds());
    return currentdate;
}


//获取星期

//type 1或空时为大写 如星期一，2时为数字
function getweek(day, type) {
    //获取星期
    var arys1 = new Array();
    arys1 = day.split('-');     //日期为输入日期，格式为 2013-3-10
    var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);

    var week1 = String(ssdate.getDay()) //就是你要的星期几
    var week = week1.replace("0", "星期日").replace("1", "星期一").replace("2", "星期二").replace("3", "星期三").replace("4", "星期四").replace("5", "星期五").replace("6", "星期六")

    if (type == "2") {
        return week1;
    }
    else {
        return week;
    }



}


//获取当月最后一天
function getLastDay(year, month) {
    var new_year = year;  //取当前的年份   
    var new_month = month++;//取下一个月的第一天，方便计算（最后一天不固定）   
    if (month > 12)      //如果当前大于12月，则年份转到下一年   
    {
        new_month -= 12;    //月份减   
        new_year++;      //年份增   
    }
    var new_date = new Date(new_year, new_month, 1);        //取当年当月中的第一天   
    return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();//获取当月最后一天日期   
}




//月份小写转大写

function changecapital(str) {
    var str2 = String(str);

    var str1 = str2.replace("10", "十").replace("11", "十一").replace("12", "十二").replace("0", "零").replace("1", "一").replace("2", "二").replace("3", "三").replace("4", "四").replace("5", "五").replace("6", "六").replace("7", "七").replace("8", "八").replace("9", "九")
    return str1;
}

//返回上一页
function topreurl(str) {


    var referrerurl = document.referrer   //获取的上一页
    var currenturl = window.location.href;  //获取当前url
    var prevUrl = sessionStorage.getItem("prevUrl"); //缓存中的上一页


    if (referrerurl == "") {
        // alert("0");
        sessionStorage.setItem("prevUrl", str);
        return str;


    }
    if (referrerurl != "") {

        if (prevUrl == "undefined" || prevUrl == undefined || prevUrl == "" || prevUrl == null || prevUrl == "null") {
            sessionStorage.setItem("prevUrl", referrerurl);
            return referrerurl;
        }
        else {
            var currenturldo = todourl(currenturl);  //处理后的当前url
            var referrerurldo = todourl(referrerurl)    //处理后的上一页
            var prevUrldo = todourl(prevUrl); //处理后的缓存中的上一页

            if (prevUrldo == currenturldo) {  //循环了
                // alert("1");
                sessionStorage.setItem("prevUrl", str);
                return str;
            }
            if (prevUrldo != currenturldo) {
                // alert("2");
                sessionStorage.setItem("prevUrl", referrerurl);
                return referrerurl;
            }

        }

    }






}


//处理当前url
function todourl(currturl) {
    if (currturl.indexOf("?") == "-1") {  //不存在
        if (currturl.indexOf("/") == "-1") {
            return currturl;
        }
        else {
            var currturl2 = currturl.split("/");
            return currturl2[currturl2.length - 1];
        }

    }
    else {
        var currturl1 = currturl.split("?");

        if (currturl1[0].indexOf("/") == "-1") {
            return currturl1[0];
        }
        else {
            var currturl3 = currturl1[0].split("/");
            return currturl3[currturl3.length - 1];

        }

    }
}



//生成随机数
/*
type:1 时生成数字  其他值为数字加字母
*/
var chars = [];
function generateMixed(n, type) {
    var num = 0;
    if (isnull(type) == 1) {
        // 数字
        chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        num = 9;
    }
    else {
        //数字加字母  
        chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        num = 35
    }
    var res = "";
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * num);
        res += chars[id];
    }
    return res;
}

//生成时间戳
function Timestamp() {
    var datetime = Date.parse(new Date());
    return datetime / 1000;
}

//判断是否是微信
var is_weixin = (function () { //判断微信UA
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
})();


//判断移动端还是电脑端
var gopage = (function () {
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        return "mobile" //手机端";
    }
    else {
        return "pc"//pc端
    }
})();


//获取当天日期
var gettoday = function () {

    var mydate = new Date();
    var currYear = parseInt(mydate.getFullYear());
    var currmonth = addzerro(mydate.getMonth() + 1);
    var currday = addzerro(mydate.getDate());
    var currdate = currYear + "-" + currmonth + "-" + currday;
    var gettoday = {
        "currYear": currYear,
        "currmonth": currmonth,
        "currday": currday,
        "currdate": currdate,
    }

    return gettoday;
};


//删除图片
function remove(str) {
    alert(1 + str);
    var photonums = $(".Upload_photos").find(".imgwarp").length;
    var dataid = parseInt($(str).parent().parent().find(".imgnum").html());
    var id = $(str).parent().parent().attr("id");
    //$("#"+str).find(".imgclose").attr("data-id");
    console.log(id);
    if (photonums == 1) {

        $(str).parent().parent().remove()

    }
    if (photonums > 1) {
        if (dataid == photonums) {//删除最后一个，不用循环

            $(str).parent().parent().remove()
        }
        else {
            for (i = dataid + 1; i <= photonums; i++) {

                $(str).parent().parent().remove()
                $("#products" + i).find("p.imgnum").html(i - 1);
                $("#products" + i).attr("id", "products" + (i - 1));

            }

        }

    }



}


//调用state时显示html
function createMarkup(str) {
    return { __html: str };
}


//处理图片 判断单张还是多张 多张获取第一张
function todoimg(str) {
    //处理图片

    if (str == "" || str == undefined || str == null) {
        return "";
    }

    else {
        var imgs = str
        //单个
        if (imgs.indexOf(";") == -1) {  //单个

            return imgs;
        }
        //单个结束

        //多个
        if (imgs.indexOf(";") > -1) {  //多个

            var imgspits = imgs.split(";");

            return imgspits[0]
        }
        //多个结束
    }
    //producephoto

    //处理图片结束

}


/*
判断字符串长度 (汉字为两个字符)
*/
function strlen(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        }
        else {
            len += 2;
        }
    }
    return len;
}

/* 获取n天以后 */

 function getYestoday(str) {
        var d = new Date();
        var beforday=isnull(str)==""?"7000":str*1000
        var yesterday_milliseconds = d.getTime() - beforday * 60 * 60 * 24;
        var yesterday = new Date();
        yesterday.setTime(yesterday_milliseconds);
        var strYear = yesterday.getFullYear();
        var strDay = yesterday.getDate();
        var strMonth = yesterday.getMonth() + 1;
        var datastr = strYear + "-" + (strMonth < 10 ? '0' + strMonth : strMonth) + "-" + (strDay < 10 ? '0' + strDay : strDay);
        return datastr;
    }


//通用ajax
/*
returnData 传递的参数
$this   获取当前this
callback  回调函数
javaUrl  ajax url链接
showbox  显示错误信息的div
backurl  返回上一页的url
*/
function ajaxFn(returnData, $this, callback, javaUrl, showbox, backurl, other) {
    //$this = this
    $.ajax({
        type: "post",
        url: javaUrl,
        data: { paramMap: JSON.stringify(returnData) },
        dataType: "json",
        //async: false,	//false 表示ajax执行完成之后在执行后面的代码
        success: function (data) {

            //数据为空
            if (isnull(data) == "") { //数据为空
                showbox.innerHTML = "没有数据";
                $this.setState({
                    isload: false,
                    isclick: true  //允许按钮点击
                });
                return false;
            }
            //数据为空结束

            //数据不为空时
            if (isnull(data) != "") { //数据不为空
                if (data.success) {
                    callback.call($this, data);

                    return false;
                }

                if (!data.success) {/*首先判断这个属性，错误在判断原因*/
                    layer.closeAll();
                    switch (data.errorCode) {
                        case (1):
                            layer.open({
                                shade: false,
                                content: '用户未登录或过期，<br>2秒后将自动重新登录',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //3秒后自动关闭
                            });
                            setTimeout(function () {
                                var dodatate = generateMixed(6) //获取随机数
                                window.location.href = wxurl(dodatate); //跳转到微信链接
                            }, 3000)
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (2):
                            layer.open({
                                shade: true,
                                content: "绑定的账号或密码错误！",
                                skin: 'msg',
                                className: 'tip',
                                time: 2//2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (3):
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (4):
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (5):
                            layer.open({
                                shade: true,
                                content: '相关数据未填写完整！请修改重试',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });

                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (6):
                            layer.open({
                                shade: true,
                                content: '未识别的用户操作类型',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });

                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (7):
                            showbox.innerHTML = showmsg({
                                msg: "当前用户没有此操作权限！",
                                classname: "",
                                isbtn: true,
                                url: backurl,
                                btntext: "立即返回",
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (8):
                            showbox.innerHTML = showmsg({
                                msg: "请求参数出现异常！",
                                classname: "",
                                isbtn: true,
                                url: backurl,
                                btntext: "立即返回",
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (9):
                            layer.open({
                                shade: true,
                                content: '相关数据未填写完整！请修改重试',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            //Modal.info({ title: '提示：', content: '相关数据未填写完整，请检查！' });
                            break;
                        case (11):
                            layer.open({
                                shade: true,
                                content: '登录发生异常！请返回重新登录',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                             case (12):
                              showbox.innerHTML = showmsg({
                                msg: "当前账号已停用！",
                                classname: "",
                                isbtn: true,
                                url: backurl,
                                btntext: "立即返回",
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                             break;
                        case (150):
                            layer.open({
                                shade: true,
                                content: '相关信息不存在',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });

                            break;
                        case (151):
                            layer.open({
                                shade: true,
                                content: "此用户已经绑定过其他微信！不能再进行绑定！",
                                skin: 'msg',
                                className: 'tip',
                                time: 2//2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (152):
                            if (isnull(sessionStorage.getItem("OpenID")) == "") {
                                sessionStorage.setItem("OpenID", isnull(data.openId));
                            }
                            layer.open({
                                shade: true,
                                content: '此微信号未绑定！2秒后自动跳转到绑定页面！',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });
                            setTimeout(function () {
                                window.location.href = "login.html";//前往绑定页面
                            }, 2000)
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (163):
                            layer.open({
                                shade: true,
                                content: '"非“驳回”或“未提交”状态不能操作！',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });
                            setTimeout(function () {
                                $("#dl_" + other).removeClass('selected');


                            }, 3000)
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (164):
                            layer.open({
                                shade: false,
                                content: '已存在审核通过计划，不能再次新增！',
                                skin: 'msg',
                                className: 'tip',
                                time: 3 //3秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (169):
                            var dodatate = generateMixed(6) //获取随机数
                            var backloginurl = wxurl();
                            showbox.innerHTML = showmsg({
                                msg: "用户已过期，请返回重新登录！",
                                classname: "",
                                isbtn: true,
                                url: backloginurl,
                                btntext: "立即返回",
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (170):
                            layer.open({
                                shade: true,
                                content: "此用户已经与微信号绑定过,请直接登录！",
                                skin: 'msg',
                                className: 'tip',
                                time: 2//2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (171):
                            layer.open({
                                shade: true,
                                content: "内部异常，请重新绑定！",
                                skin: 'msg',
                                className: 'tip',
                                time: 2//2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (172):  //存在未签出的拜访计划！
                            layer.open({
                                shade: false,
                                content: '存在未签出的拜访计划！',
                                skin: 'msg',
                                className: 'tip',
                                time: 3 //3秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true,  //允许按钮点击
                            });
                            break;
                        default:
                             showbox.innerHTML = showmsg({
                                msg: "出现系统异常，请联系管理员！",
                                classname: "",
                                isbtn: true,
                                url: backurl,
                                btntext: "立即返回",
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                    }  //switch结束
                    // return false;
                }
            }
            //数据不为空时结束 

        },
        error: function (jqXHR, textStatus, errorThrown) {
            layer.closeAll();

            var Datafailed = "";
            console.log("textStatus:" + textStatus);
            console.log("errorThrown:" + errorThrown);
            switch (textStatus) {
                case "timeout":
                    showbox.innerHTML = showmsg({
                        msg: "获取信息失败，网络超时，请检查你的网络是否连接正常！",
                        classname: "",
                        isbtn: true,
                        showimg: "../images/mobile/nonetwork.png"
                    });
                    $this.setState({
                        isload: false,
                        isclick: true  //允许按钮点击
                    });
                    break;

                default:
                    showbox.innerHTML = showmsg({
                        msg: "出现系统异常，请检查你的网络是否连接正常！",
                        classname: "",
                        isbtn: true,
                    });
                    $this.setState({
                        isload: false,
                        isclick: true  //允许按钮点击
                    });
                    break;
            }
            // console.log("错误信息：" + textStatus);
        }
    });
    return true;
}
