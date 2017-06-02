
import React from 'react'
import {render} from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'

//import '../../node_modules/antd-mobile/lib/icon/style/index.less';

var issigninurl = "/otcdyanmic/appraisals.do";
var url = "/otcdyanmic/customer.do";
var currturl = window.location.href;  //获取当前url
var daydate = geturl('day'); //走访时间
var parenturl="CustomerDetails.html?custom_id=" + geturl('custom_id') + "&plan_id=" + geturl('plan_id')+ "&day=" + daydate  //上一页
var Signin = React.createClass({
    getInitialState: function () {
        return {
            isgetmap: false,    //是否获取到坐标
            Y_signin: false,  //是否已签到
            referrer: topreurl(parenturl), //上一页
            address: geturl('address'), //custom_id
            name: geturl('name'),   //plan_id
            custom_id:geturl('custom_id'),
            plan_id:geturl('plan_id'),
            signType: ""
        };
    },
    componentDidMount: function () {
        //this.showposition();   
        
        var phoneH = window.innerHeight;
        $("#allmap").css("height", phoneH - 130 + "px");


    var map = new BMap.Map("allmap");
    var localSearch = new BMap.LocalSearch(map);
    localSearch.enableAutoViewport(); //允许自动调节窗体大小

    var keyword1 =this.state.address;
    var keyword
    
    if(keyword1.indexOf("(") == "-1" && keyword1.indexOf("（") == "-1"){
      
       keyword=keyword1
    }
    else {

            if(keyword1.indexOf("(") > "-1"){
            var currturl2 = keyword1.split("(");
           
            keyword=currturl2[0];
            }
             if(keyword1.indexOf("（") > "-1"){
                  
            var currturl2 = keyword1.split("（");
            keyword=currturl2[0];
            }
            
        }
    //"南昌红谷滩万达B3写字楼";
    
    localSearch.setSearchCompleteCallback(function (searchResult) {
        if(searchResult.getPoi(0)!="" && searchResult.getPoi(0)!=undefined && searchResult.getPoi(0)!=null){

        
    var poi = searchResult.getPoi(0);
    var gpsPoint = new BMap.Point(poi.point.lng,poi.point.lat);
    map.centerAndZoom(gpsPoint, 15);
    map.addControl(new BMap.NavigationControl());
    var marker = new BMap.Marker(gpsPoint);
    map.addOverlay(marker);
    map.setCenter(gpsPoint);
       // map.centerAndZoom(poi.point, 13);
        //var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // 创建标注，为要查询的地方对应的经纬度
        //map.addOverlay(marker);
    
        // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
        }
        else{
           layer.open({
                shade: false,
                content: '获取门店位置失败，请确认您填写的地址是否正确(地址必须加上城市名)',
                skin: 'msg',
                className: 'tip',
                time: 4 //4秒后自动关闭
              });
        }
    });
    localSearch.search(keyword);
       

       
        
    },






    render: function () {
        return (
            <div>
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    {this.state.name}
                </div>

                <div className="signin_map" id="allmap">
                </div>
                <div className="to_signin">
                    <span className="signin_address" ref="signin_Y">
                        {this.state.address}
                    </span>


                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Signin />,
    document.getElementById('conter')
);




