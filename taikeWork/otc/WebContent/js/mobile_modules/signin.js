
import React from 'react'
import {render} from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'

//import '../../node_modules/antd-mobile/lib/icon/style/index.less';

var issigninurl = "/otcdyanmic/appraisals.do";
var url = "/otcdyanmic/customer.do";
var parenturl="CustomerDetails.html?custom_id=" + geturl('custom_id')+ "&plan_id=" + geturl('plan_id') +"&day="+geturl('day'); //上一页
var currturl = window.location.href;  //获取当前url
var backtp=geturl('backtp');


var Signin = React.createClass({
    getInitialState: function(){
    return {
      isgetmap: false,    //是否获取到坐标
      Y_signin: false,  //是否已签到
      referrer: topreurl(parenturl), //上一页
      custom_id: geturl('custom_id'), //custom_id
      plan_id: geturl('plan_id'),   //plan_id
      signType: "",
      Point:"",
      firstpoint:"",
      isgetpoint:"0",  //是否获取到定位
      isclick: true,
      isload: false,
    };
  },
   componentWillMount: function () {

    },
  componentDidMount: function () {
     if(backtp=="1"){
     this.setState({
        referrer: parenturl, //上一页
     })
     }
     else{
      this.setState({
        referrer: topreurl(parenturl), //上一页
     })

     }
   $("#allmap").html("");
   localStorage.clear();
    var currentTime = getNowFormatDate(); //获取当前时间
    this.refs.signin_time.innerHTML = currentTime;
    this.issignIn();

    //this.showposition();
    var phoneH = window.innerHeight;
    $("#allmap").css("height", phoneH - 130 + "px");
    },

  //点击签到
  clicksigin:function(){
   var singintext="";
   //设置签到信息

    if(this.state.signType=="signIn"){   //签到
     singintext='<h2 class="tiptitle">温馨提示</h2><P>确定就不能修改签到位置，<br>在200米范围内签到有效</p>'
     this.tosignin(singintext);
    }
    if(this.state.signType=="signOut"){  //签出
    var $this=this;
    this.isInquire();
    }
   //设置签到信息结束

  },




  //点击签到
  tosignin: function (text) {
    var isgetmap = this.state.isgetpoint;   //是否获取到经纬度
    if (isgetmap == "1") {

      layer.open({
        content: text,
        btn: ['确认', '取消'],
        yes: function (index) {

      layer.close(index);
      if(this.state.isclick){
      this.setState({
        isclick:false
         })
          this.ajaxsigin();
          }
          ////签到签出结束
        }.bind(this)
      });

    }
    if (isgetmap == "0") {
       layer.open({
        shade: false,
        content: '还没有获取到你的位置，请稍后再试',
        skin: 'msg',
        className: 'tip',
        time: 2 //2秒后自动关闭
      });

    }
  },

  //签到签出ajax
  ajaxsigin: function () {
    var $this=this;
    if (this.state.signType == "alreadySign") {
      layer.open({
        shade: false,
        content: '你已经签到签出了，不能再次操作',
        skin: 'msg',
        className: 'tip',
        time: 2 //2秒后自动关闭
      });
      setTimeout(function(){
      window.location.href=topreurl(parenturl);
       },2000)
    }

    if (this.state.signType == "signIn" || this.state.signType == "signOut") {

      //签入签出
      var Point2=this.state.Point.split(",")
      var lng = Point2[0];  //经度
      var lat = Point2[1]; //纬度
      var myDate = new Date();
      var dateday=geturl('day');
      var datatime = myDate.toLocaleDateString().replace(/\//g, "-") + " " + myDate.getHours() + ":" + addzerro(myDate.getMinutes());
      // var signin_date=myDate
      this.refs.signin_time.innerHTML = datatime;


      var signType = this.state.signType == "signOut" ? "签出" : "签到"

      var object = new Object();
      object.openId = OpenID;
      object.controlType = "sign";
      object.plan_id = this.state.plan_id;
      object.customer_id = this.state.custom_id;
      object.planDay=dateday;
      object.sign_in_localtion = lng + "," + lat;


      $.ajax({
        url: issigninurl,
        data: { paramMap: JSON.stringify(object) },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (this.isMounted()) {
            if (data != "" && data != null && data != undefined) {
              //获取库存信息成功
              if (data.success == true) {
                console.log("获取获取信息成功")
                layer.open({
                  shade: false,
                  content: signType + '成功',
                  skin: 'msg',
                  className: 'tip',
                  time: 2 //2秒后自动关闭
                });

                this.refs.signin_Y.innerHTML = signType + '成功';
                this.setState({
                 isclick:true
                 })
                setTimeout(function(){
                window.location.href=$this.state.referrer;
                },2000)
              }
              //获取获取信息失败
              if (data.success == false) {
                //未登录
                this.setState({
                 isclick:true
                 })
            if (data.errorCode == "1") {
              var dodatate = generateMixed(6)
              window.location.href = wxurl(dodatate);
            }
            //未登录结束
                layer.open({
                  shade: false,
                  content: signType + '失败；'+data.msg,
                  skin: 'msg',
                  className: 'tip',
                  time: 2 //2秒后自动关闭
                });
                console.log("获取获取信息失败:" + data.msg)
              }
            }

          } // this.isMounted() End
        }.bind(this),
        error: function (jqXHR, textStatus, errorThrown) {
          if (this.isMounted()) {
            this.setState({
                 isclick:true
                 })
            layer.open({
              shade: false,
              content: '获取获取信息失败',
              skin: 'msg',
              className: 'tip',
              time: 2 //2秒后自动关闭
            });
            console.log("获取获取信息失败：网络错误")
          }
        }.bind(this)
      });

      //签入签出结束

    }


  },



  //判断是否还有产品未盘点
  isInquire:function(){
    var object = new Object();
    object.controlType = "checkSignOut";
    object.plan_id= this.state.plan_id;
    $.ajax({
      url: issigninurl,
      data: { paramMap: JSON.stringify(object) },
      type: "post",
      dataType: "json",
      success: function (data) {
        if (this.isMounted()) {
          if (data != "" && data != null && data != undefined) {
            //获取产品未盘点信息成功
            if (data.success == true) {
              console.log("获取产品未盘点信息成功")
              var singintext="";

              if(data.map.unStack!= "" && data.map.unStack != null && data.map.unStack != undefined){
              singintext='<h2 class="tiptitle">温馨提示</h2><P>你还有'+data.map.unStack+'个产品未盘点，是否确认签出</p>'
              }
              else{
              singintext='<P>是否确认签出</p>'
              }
             this.tosignin(singintext);


            }
            //获取产品未盘点信息失败
            if (data.success == false) {
               //未登录
            if (data.errorCode == "1") {
              var dodatate = generateMixed(6)
              window.location.href = wxurl(dodatate);
            }
            //未登录结束
              layer.open({
                shade: false,
                content: '获取产品未盘点信息失败',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
              });
              console.log("获取产品未盘点信息失败:" + data.msg)
            }
          }

        } // this.isMounted() End
      }.bind(this),
      error: function (jqXHR, textStatus, errorThrown) {
        if (this.isMounted()) {
          layer.open({
            shade: false,
            content: '获取产品未盘点信息失败',
            skin: 'msg',
            className: 'tip',
            time: 2 //2秒后自动关闭
          });
          console.log("获取产品未盘点信息失败：网络错误")
        }
      }.bind(this)
    });

  },

  //判断是否签入
    issignIn: function () {
   var $this=this;
    var object = new Object();
    object.openId = OpenID;
    object.controlType = "checkSign";
    object.plan_id = this.state.plan_id;
    $.ajax({
      url: issigninurl,
      data: { paramMap: JSON.stringify(object) },
      type: "post",
      dataType: "json",
      success: function (data) {
        if (this.isMounted()) {
          if (data != "" && data != null && data != undefined) {
            //获取库存信息成功
            if (data.success == true) {
              console.log("获取获取信息成功")

              var signType = data.map.signType;
              var location="";

              //获首次签到位置
              if(data.map.location != "" && data.map.location != null && data.map.location != undefined){
                location=data.map.location;
              }
              else{
                  location="";
              }
               //获首次签到位置结束

              this.setState({
                signType: signType,
                firstpoint:location,
              });
               if (is_weixin) { //微信页面定位
                  $this.wxgetlng(); //微信页面获取定位并显示地图
               }
               else{
                  $this.getlng(); //非微信页面获取定位并显示地图
               }

            }
            //获取获取信息失败
            if (data.success == false) {
               //未登录
            if (data.errorCode == "1") {
              var dodatate = generateMixed(6)
              window.location.href = wxurl(dodatate);
            }
            //未登录结束
              layer.open({
                shade: false,
                content: '获取获取信息失败',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
              });
              console.log("获取获取信息失败:" + data.msg)
            }
          }

        } // this.isMounted() End
      }.bind(this),
      error: function (jqXHR, textStatus, errorThrown) {
        if (this.isMounted()) {
          layer.open({
            shade: false,
            content: '获取获取信息失败',
            skin: 'msg',
            className: 'tip',
            time: 2 //2秒后自动关闭
          });
          console.log("获取获取信息失败：网络错误")
        }
      }.bind(this)
    });


  },



  //获取定位
  getlng:function() {
	var map = new BMap.Map("hidemap");
	var point = new BMap.Point(115.89,28.68);
	map.centerAndZoom(point,15);
  var $this=this;
	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
      //定位成功
			var mk =new BMap.Marker(r.point);
			map.addOverlay(mk);
			map.panTo(r.point);
      var point1=r.point.lng+','+r.point.lat;
      $this.setState({
      Point:point1,
      isgetpoint:"1" //判断是否获取到定位
      })
      $this.getmap(r.point.lng,r.point.lat);
    //$this.state.Point
			//alert('您的位置：'+r.point.lng+','+r.point.lat+";");
		}
		else {
      layer.open({
      shade: false,
      content: '定位失败:'+this.getStatus(),
      skin: 'msg',
      className: 'tip',
      time: 2 //2秒后自动关闭
      });

      $this.setState({
      isgetpoint:"0" //判断是否获取到定位
      })
			//alert('failed'+this.getStatus());
		}
	},{enableHighAccuracy: true})
 },
//获取定位结束

//微信端获取定位
  wxgetlng:function() {
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

        //$this.geoconv(longitude,latitude,$this)

        $this.setState({Point:(longitude+","+latitude),isgetpoint:"1"});

        $this.getmap(longitude,latitude);
    }
  });


  }); //wx.ready结束

    }, "/otcdyanmic/employee.do",$this, referrer)
    //获取基本信息结束
 },
//微信端获取定位结束

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
      var point1=lng+','+lat;
      ts.setState({
      Point:point1,
      isgetpoint:"1" //判断是否获取到定位
      })
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
   var old=this.state.firstpoint
   var $this=this;
   var points=this.state.Point;
   var points1=points.split(",");
   var xx =x;
   var yy =y;



  if (old != "" && old != undefined && old != null) {  //有首次签到位置

    //GPS坐标

    var old1 = old.split(",");

    var map = new qq.maps.Map(document.getElementById('allmap'),{
             center: new qq.maps.LatLng(y,x),
             zoom:20
         });

    var marker = new qq.maps.Marker({
         position: new qq.maps.LatLng(old1[1],old1[0]),
         map: map
    });

     var marker1 = new qq.maps.Marker({
         position: new qq.maps.LatLng(y,x),
         map: map
     });



  }else {



    var map = new qq.maps.Map(document.getElementById('allmap'),{
             center: new qq.maps.LatLng(y,x),
             zoom: 20
         });

    var marker1 = new qq.maps.Marker({
        position: new qq.maps.LatLng(y,x),
        map: map
    });



  }

},


//显示地图结束


  render: function () {
    var signType=this.state.signType;
    var signTypetext=this.state.signType=="signIn"? "签到":"签出";
    return (
      <div>
        <div className="profile white" id="pagenav">
          <span className="toleft"> <a href={this.state.referrer}></a></span>
          <span ref="Signinname1">{signTypetext}</span>
        </div>

        <div className="signin_map" id="allmap">
        </div>
        <div className="to_signin">
          <span className="signin_type" ref="signin_Y">
            <button className="signin-btn" onTouchStart={this.clicksigin} ref="Signinbtn">确认{signTypetext}</button>
          </span>
          <span className="signin_time" ref="signin_time"></span>
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
