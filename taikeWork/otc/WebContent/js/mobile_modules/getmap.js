// 百度地图API功能
 function getlng(oldlng) {
	var map = new BMap.Map("hidemap");
	var point = new BMap.Point(115.89,28.68);
	map.centerAndZoom(point,15);

	var geolocation = new BMap.Geolocation();
	geolocation.getCurrentPosition(function(r){
		if(this.getStatus() == BMAP_STATUS_SUCCESS){
			var mk = new BMap.Marker(r.point);
			map.addOverlay(mk);
			map.panTo(r.point);
      getmap(r.point.lng, r.point.lat, oldlng)
		//	alert('您的位置：'+r.point.lng+','+r.point.lat);
		}
		else {
      layer.open({
      shade: false,
      content: '定位失败:'+this.getStatus(),
      skin: 'msg',
      className: 'tip',
      time: 2 //2秒后自动关闭
      });
			//alert('failed'+this.getStatus());
		}        
	},{enableHighAccuracy: true})
 }
	//关于状态码
	//BMAP_STATUS_SUCCESS	检索成功。对应数值“0”。
	//BMAP_STATUS_CITY_LIST	城市列表。对应数值“1”。
	//BMAP_STATUS_UNKNOWN_LOCATION	位置结果未知。对应数值“2”。
	//BMAP_STATUS_UNKNOWN_ROUTE	导航结果未知。对应数值“3”。
	//BMAP_STATUS_INVALID_KEY	非法密钥。对应数值“4”。
	//BMAP_STATUS_INVALID_REQUEST	非法请求。对应数值“5”。
	//BMAP_STATUS_PERMISSION_DENIED	没有权限。对应数值“6”。(自 1.1 新增)
	//BMAP_STATUS_SERVICE_UNAVAILABLE	服务不可用。对应数值“7”。(自 1.1 新增)
	//BMAP_STATUS_TIMEOUT	超时。对应数值“8”。(自 1.1 新增)

/*
var options = { timeout: 8000 };
function getlng(oldlng) {
 var geolocation = new qq.maps.Geolocation("OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77", "myapp");
 geolocation.getLocation(showPosition, showErr, options);


function showPosition(position) {

    var date = JSON.stringify(position, null, 4)

    layer.open({
      shade: false,
      content: '定位成功',
      skin: 'msg',
      className: 'tip',
      time: 2//2秒后自动关闭
    });
    
    //position.city
    var lng1 = position.lng
    var lat1 = position.lat
    geoconv(lng1,lat1,oldlng)
  };

 function showErr() {

    layer.open({
      shade: false,
      content: '抱歉，定位失败',
      skin: 'msg',
      className: 'tip',
      time: 2 //2秒后自动关闭
    });
    

  }
}

//QQ坐标转换
function getqqconv(x,y,oldlng){
$.jsonp({
      url: 'http://apis.map.qq.com/ws/coord/v1/translate?locations='+lat1+','+lng1+'&type=5&key=DWXBZ-QKFRR-IGFWC-W4UGW-FSPYT-55FEP&output=jsonp',
      data: {},
      callbackParameter: "callback",
      success: function (data) {
        var data1=JSON.stringify(data);
        
      //  console.log(data.status + ";X坐标:" + data.result[0].x + ";Y坐标:" + data.result[0].y);
       // $("body").html(data.status + ";X坐标:" + data.result[0].x + ";Y坐标:" + data.result[0].y);
        var lng=JSON.stringify(data.locations[0].lng);
        var lat=JSON.stringify(data.locations[0].lat);
         alert(lng+","+lat);
         //getmap(lng, lat, oldlng);
        //console.log(xOptions);
        //geoconv(lng,lat,oldlng)
       // getmap(lng, lat, oldlng);
      },
      error: function (xOptions, textStatus) {
        
        console.log(textStatus);
      }
    });
}







//转百度地图
function geoconv(x,y,oldlng) {
$.jsonp({
      url:"http://api.map.baidu.com/geoconv/v1/",
      data: {"coords":x+","+y,"ak":"N1Yz6CruGgPjun8ZpqWZv1ehq5BjdAOe","from":"3","to":"5","output":"json"},
      callbackParameter: "callback",
      success: function (data) {
        var lng=data.result[0].x;
        var lat=data.result[0].y;
        console.log(lng,lat);

        getmap(lng, lat, oldlng);
      },
      error: function (xOptions, textStatus) {
        
        console.log(textStatus);
      }
    });
    
  };

 function showErr() {

    layer.open({
      shade: false,
      content: '抱歉，定位失败',
      skin: 'msg',
      className: 'tip',
      time: 2 //2秒后自动关闭
    });




}




*/


function getmap(x, y, old) {
 
  
  
  if (old != "" && old != undefined && old != null) {
    //alert(1);
    // 百度地图API功能
    //GPS坐标
    var xx = x;
    var yy = y;
    var old1 = old.split(",")
    
   // alert(old1+"；"+old1[0]+","+old1[1]);
    var gpsPoint = new BMap.Point(xx, yy);
    var gpsPointold = new BMap.Point(old1[0], old1[1]);
    //地图初始化
    var bm = new BMap.Map("allmap");
    bm.centerAndZoom(gpsPointold, 15);
    bm.centerAndZoom(gpsPoint, 15);
    bm.addControl(new BMap.NavigationControl());
    
    //添加谷歌marker和label
    var markergps = new BMap.Marker(gpsPoint);
    var markergpsold = new BMap.Marker(gpsPointold);
    bm.addOverlay(markergps); //添加GPS标注
    bm.addOverlay(markergpsold); //添加GPS标注
    var labelgps = new BMap.Label("当前位置", { offset: new BMap.Size(20, -10) });
    var labelgpsold = new BMap.Label("首次签到位置", { offset: new BMap.Size(20, -10) });
    markergps.setLabel(labelgps); //添加GPS标注
    markergpsold.setLabel(labelgpsold); //添加GPS标注
    bm.setCenter(gpsPointold);
    bm.panTo(gpsPoint);
   $(".isgetmap").html("1"); //设置位置获取状态
   $(".lng").html(xx); //设置经度
   $(".lat").html(yy); //设置纬度
  }
  else {
  //alert(2);
    var xx = x;
    var yy = y;
    
 
    var gpsPoint = new BMap.Point(xx, yy);
    //地图初始化
    var bm = new BMap.Map("allmap");
    bm.centerAndZoom(gpsPoint, 15);
    bm.addControl(new BMap.NavigationControl());

    //添加谷歌marker和label
    var markergps = new BMap.Marker(gpsPoint);
    bm.addOverlay(markergps); //添加GPS标注
    var labelgps = new BMap.Label("当前位置",{offset:new BMap.Size(20,-10)});
    markergps.setLabel(labelgps); //添加GPS标注
    bm.setCenter(gpsPoint);
      $(".isgetmap").html("1"); //设置位置获取状态
      $(".lng").html(xx); //设置经度
      $(".lat").html(yy); //设置纬度
    //坐标转换完之后的回调函数
   

   



  }

}
