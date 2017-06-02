
import React from 'react'
import {render} from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import Uploadfiles from '../../js/mobile_modules/uploadfiles.js';
import '../../css/mobile/uploadfiles.css';
//import '../../node_modules/antd-mobile/lib/icon/style/index.less';


var currturl = window.location.href;  //获取当前url
var Signin = React.createClass({
  getInitialState: function(){
    return {
      isgetmap: false,    //是否获取到坐标
      Y_signin: false,  //是否已签到
      referrer: topreurl("index"), //上一页
      custom_id: geturl('custom_id'), //custom_id
      plan_id: geturl('plan_id'),   //plan_id
      signType: "",
      Point:"",
      firstpoint:"",
      showPoint:"",
      isgetpoint:"0",  //是否获取到定位
      pointtype:"",

    };
  },

  componentDidMount: function () {
  $("#hidemap").html("");
  $("#allmap").html("");
   localStorage.clear();
   this.getlng(); //获取定位并显示地图
   var suij=generateMixed(2);

    var currentTime = getNowFormatDate(); //获取当前时间
   // this.refs.signin_time.innerHTML = currentTime;


    //this.showposition();
    var phoneH = window.innerHeight;
    //$("#allmap").css("height", phoneH - 130 + "px");
    },

  //点击显示坐标
  clicksigin:function(){
    var shuz=generateMixed(2);
    var  lastpoint =sessionStorage.getItem("getpoint"); //缓存中定位
   layer.open({
      shade: false,
      content: '<br> 本次坐标：'+this.state.showPoint+"<br> 上次定位："+lastpoint,
      btn: ['我知道了']
      });
     sessionStorage.setItem("getpoint", this.state.showPoint);
   //点击显示坐标结束
  },



//清空
 clearpoint:function(){
  sessionStorage.setItem("getpoint", "");
  this.setState({
      Point:"", //清空定位
      firstpoint:"",
      showPoint:"",
      })

 },



  //获取定位
  getlng:function() {
	  var noncestr=generateMixed(16)  //随机数
     var timestamp=Timestamp();  //时间戳
      var $this=this;
       //获取基本信息
    var object = new Object();
    object.controlType = "getJsapiTicket";
    var showbox = document.getElementById("erroconter");
    var referrer="index.html";
    ajaxFn(object, $this, function (data) {

     var ticket=isnull(data.map.ticket);

     var url=currturl.split("#")[0]//.replace("http://","")  //"http://demo.itaike.cn:8088/otc/mobile/getpoint.html" //currturl.split("#")[0] //"demo.itaike.cn:8088";

     var string="jsapi_ticket="+ticket+"&noncestr="+noncestr+"&timestamp="+timestamp+"&url="+url;

      var signature=hex_sha1(string);


      wx.config({
     debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
     appId: 'wxbbfff10e577b27a7', // 必填，公众号的唯一标识
     timestamp: timestamp, // 必填，生成签名的时间戳
     nonceStr: noncestr, // 必填，生成签名的随机串
     signature:signature,// 必填，签名，见附录1
     jsApiList: [
        'openLocation',
        'getLocation'
      ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });


    wx.ready(function(){
   // 1 判断当前版本是否支持指定 JS 接口，支持批量判断


    wx.getLocation({
    type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
    success: function (res) {
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude ; // 经度，浮点数，范围为180 ~ -180。
        var speed = res.speed; // 速度，以米/每秒计
        var accuracy = res.accuracy; // 位置精度
        //alert("纬度1："+latitude+"；经度1："+longitude+"；位置精度1："+accuracy);
        //$this.getmap(longitude,latitude,);
        wx.openLocation({
           latitude: latitude, // 纬度，浮点数，范围为90 ~ -90
           longitude: longitude, // 经度，浮点数，范围为180 ~ -180。
           name: '', // 位置名
           address: '', // 地址详情说明
           scale: 18, // 地图缩放级别,整形值,范围从1~28。默认为最大
           infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        });
    }
  });


  }); //wx.ready结束

    }, "/otcdyanmic/employee.do",$this, referrer)
    //获取基本信息结束

 },
//获取定位结束

//转百度地图
geoconv:function(x,y,ts) {
 $.jsonp({
      url:"http://api.map.baidu.com/geoconv/v1/",
      data: {"coords":x+","+y,"ak":"N1Yz6CruGgPjun8ZpqWZv1ehq5BjdAOe","from":"1","to":"5","output":"json"},
      callbackParameter: "callback",
      success: function (data) {
        var lng=data.result[0].x;
        var lat=data.result[0].y;
       // console.log(lng,lat);
       // alert("转换成功："+lng+","+lat)
        ts.getmap(lng, lat);
      },
      error: function (xOptions, textStatus) {
        alert("error:"+textStatus);
        console.log(textStatus);
      }
    });
  },
//显示地图
 getmap:function(x,y) {
   localStorage.clear();
   var old=this.state.firstpoint
   var $this=this;
   var xx =x;
   var yy = y;
   //alert(old);

  //地图初始化
    var bm = new BMap.Map("allmap");
     bm.addControl(new BMap.NavigationControl());
     var point_default = new BMap.Point(115.89,28.68);
     bm.centerAndZoom(point_default,18);
     bm.enableDragging();
        bm.enableInertialDragging();
        bm.enableScrollWheelZoom();
        bm.enablePinchToZoom();
        bm.enableContinuousZoom();
        bm.enableKeyboard();
        bm.addControl(new BMap.NavigationControl({ offset: new BMap.Size(10, 10) })); //缩放比例控件
        //bm.addControl(new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP] })); //图层控件：2D图，卫星图
      //  bm.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_LEFT })); //比例尺map.enableDragging();
        bm.addControl(new BMap.GeolocationControl()); //定位到当前




    var gpsPoint = new BMap.Point(xx,yy);

       //添加GPS标注
     var markergps = new BMap.Marker(gpsPoint);
     bm.addOverlay(markergps); //添加GPS标注
     //添加GPS位置 label
     var labelgps = new BMap.Label("当前位置", { offset: new BMap.Size(20, -10) });
     markergps.setLabel(labelgps); //添加GPS位置  label
     bm.panTo(gpsPoint);
     $this.setState({
      Point:"" //清空定位
      })

},


//显示地图结束
 getpoints:function(){
   $("#hidemap").html("");
  $("#allmap").html("");
  this.setState({
      Point:"" //清空定位
      })

 // localStorage.clear();
   this.getlng(); //获取定位并显示地图

 },
 option(key, valueArr) {
    alert("valueArr:"+valueArr);
        if (Array.isArray(valueArr) && valueArr.length != 0) {
            var valArr = [];
            valueArr.forEach(function (data) {
                valArr.push(data.split(";")[1]);
            });
            this.setState({ [key]: valArr.toString() });
        } else {
            this.setState({ [key]: "" });
        }
    },//关键字搜索
  render: function () {
    return (
      <div>
        <div className="profile white" id="pagenav">
          <span className="toleft"> <a href={this.state.referrer}></a></span>
          <span ref="Signinname1">定位测试 {this.state.pointtype}</span>
        </div>
          <Uploadfiles
          even={this.option}
          />
        <div className="signin_map" id="allmap">
        </div>
        <div className="to_signin">

            <button className="signin-btn" onTouchEnd={this.clicksigin} ref="Signinbtn">显示坐标</button>


            <button className="signin-btn" onTouchEnd={this.getpoints} >重新定位</button>

          <button className="signin-btn" onTouchEnd={this.clearpoint} ref="Signinbtn">清除坐标</button>
          <div className="fn-hide1 " id="hidemap"></div>
        </div>

      </div>
    );
  }
});

ReactDOM.render(
  <Signin />,
  document.getElementById('conter')
);
