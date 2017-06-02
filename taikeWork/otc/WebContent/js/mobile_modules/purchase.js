
import React from 'react'
import {render} from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'

var daydate = geturl('day'); //走访时间
var url ="/otcdyanmic/goodsMobile.do";
var parenturl="CustomerDetails.html?custom_id="+geturl('custom_id')+"&plan_id="+geturl('plan_id')+ "&day=" + daydate //上一页
var currturl=window.location.href;  //获取当前url
var Purchase = React.createClass({
    getInitialState: function () {
        return {
            Y_login: true,  //是否登录
            referrer: topreurl(parenturl), //上一页
            custom_id:geturl('custom_id'),
            plan_id:geturl('plan_id'),
        };
    },
    componentDidMount: function () {
        
    this.getinfo();
    },
    //获取初始数据
  getinfo: function () {
    var object = new Object();
    object.openId = OpenID;
    object.controlType ="apprisalGoods";
    object.customer_id =this.state.custom_id;
    object.plan_id =this.state.plan_id;
    object.queryType ="purchase";
    $.ajax({
      url: url,
      data: { paramMap: JSON.stringify(object) },
      type: "post",
      dataType: "json",
      success: function (data) {
        if (this.isMounted()) {
          if (data != "" && data != null && data != undefined) {
            //获取库存信息成功
            if (data.success == true) {
              console.log("获取获取信息成功")
             var clientlist = "";
              
              if (data.map.list != "" && data.map.list != null && data.map.list != undefined) {
                var clientdata = data.map.list;
                for (var i = 0; i < clientdata.length; i++) {
                  var imgUrl=isnullimg1(clientdata[i].imgUrl);
                  var goodsName=isnull(clientdata[i].goodsName);
                  var batchNumber=isnull(clientdata[i].custom_id);
                  var number=isnull(clientdata[i].number);
                   var goodsId=isnull(clientdata[i].goodsId);
                   var time=dateformdate(clientdata[i].time,2);
                   var batchNumber=isnull(clientdata[i].batchNumber);
                    var supplier=isnull(clientdata[i].supplier); //供应商
                   var specification=isnull(clientdata[i].specification); //规格
                  clientlist += ' <dl class="white infofile profile_pading margint_1r">';
                  clientlist += '<dt class="stockphoto">';
                  clientlist +=  '<img  src="'+imgUrl+'" />';
                  clientlist += '</dt>';
                  clientlist += '<dd class="stockinfo">';
                  
                  clientlist += '<h2 class="stock_title">'+goodsName+'</h2>';
                 
                  clientlist += '<p class="batch_num">批号：'+batchNumber+'</p>';
                  clientlist += '<p> <em class="stock_Lt">数量：<i>'+number+'</i></em> <em class="stock_Rt"> '+time+'</em></p>';
                   clientlist += '<p class="specification">规格：' + specification +'</p>';
                  clientlist += '<p class="supplier">供应商：' + supplier + '</p>';
                  clientlist += '</dd>';
                  clientlist += '</dl>';
                }


                this.refs.purchase_cont.innerHTML = clientlist
              }
              else {
                this.refs.purchase_cont.innerHTML = "<P class='nodata'>暂时没有数据</p>"
              }
            
               /*
              
            */
            }
            //获取获取信息失败
            if (data.success == false) {
               //未登录
            if (data.errorCode == "1") {
              var dodatate = generateMixed(6)
              window.location.href = wxurl(dodatate);
            }
            //未登录结束
              this.refs.purchase_cont.innerHTML = Datafailed;
              console.log("获取获取信息失败:"+data.msg)
            }
          }

        } // this.isMounted() End
      }.bind(this),
      error: function (jqXHR, textStatus, errorThrown) {
        if (this.isMounted()) {
           this.refs.purchase_cont.innerHTML = Datafailed1;
          console.log("获取获取信息失败：网络错误")
        }
      }.bind(this)
    });
  },

    render: function () {
        return (
            <div>
                 <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                   进货
                </div>
                <div className="profile margint_1r " ref="purchase_cont">
                   
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Purchase />,
    document.getElementById('conter')
);




