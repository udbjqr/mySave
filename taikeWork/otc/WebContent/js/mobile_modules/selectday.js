import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import SearchBar from 'antd-mobile/lib/search-bar'
import Userfooter from '../../js/mobile_modules/userfooter.js'
import Modal from 'antd-mobile/lib/Modal'
import Button from 'antd-mobile/lib/Button'
import WhiteSpace from 'antd-mobile/lib/white-space'
import WingBlank from 'antd-mobile/lib/wing-blank'




var Selectday = React.createClass({
  getInitialState: function () {
    return {
      customername: "",
      customerid: "",
      dateday: ""
    };
  },


  componentDidMount: function () {
    //$(".cs").html(customername + "<br />" + customerid + "<br />" + plandate + "<br />")

  },

  saveplan: function (id, date, month, time) {
    var plandate = geturl('addcustomerday');
    var object = new Object();
    object.controlType = "add";
    object.planDay = month; //计划月份
    object.custom_id = id //客户Id
    object.planDate = date //计划日期
    object.planTime = time //计划时间段（AM：上午，PM:下午）

    $.ajax({
      url: "/otcdyanmic/visitMobilePlan.do",
      data: { paramMap: JSON.stringify(object) },
      type: "post",
      dataType: "json",
      success: function (data) {

        if (data != "" && data != null && data != undefined) {
          //保存拜访计划成功
          if (data.success == true) {
            console.log("保存拜访计划成功")
            layer.open({
              shade: false,
              content: '保存拜访计划成功',
              skin: 'msg',
              className: 'tip',
              time: 3 //3秒后自动关闭
            });
            setTimeout(function () {
              var typeinfo = {
                showtype: "show",
              }
              // PubSub.publish('changshow', typeinfo);
              window.location.href = "addclient.html?selectday=" + plandate;
            }, 3000)
          }

          //保存拜访计划失败
          if (data.success == false) {
            //未登录
            if (data.errorCode == "1") {
              var dodatate = generateMixed(6)
              window.location.href = wxurl(dodatate);
            }
            //未登录结束
            if (data.errorCode == "7") {
              layer.open({
                shade: false,
                content: '当前用户没有此操作权限！',
                skin: 'msg',
                className: 'tip',
                time: 3 //3秒后自动关闭
              });
              setTimeout(function () {
                window.location.href = "client.html"
              }, 3000)

            }
            if (data.errorCode == "164") {
              layer.open({
                shade: false,
                content: '已存在审核通过计划，不能再次新增！',
                skin: 'msg',
                className: 'tip',
                time: 3 //3秒后自动关闭
              });
              setTimeout(function () {
                window.location.href = "addclient.html?selectday=" + plandate;
              }, 3000)
            }
            else {
              layer.open({
                shade: false,
                content: '保存拜访计划信息失败，请重新再试！',
                skin: 'msg',
                className: 'tip',
                time: 3 //3秒后自动关闭
              });
            }


            console.log("保存拜访计划信息失败:" + data.msg)

          }
        }


      }.bind(this),

      error: function (jqXHR, textStatus, errorThrown) {
        if (this.isMounted()) {

          layer.open({
            shade: false,
            content: '保存拜访计划失败：网络错误！',
            skin: 'msg',
            className: 'tip',
            time: 3 //3秒后自动关闭
          });


          console.log("保存拜访计划失败：网络错误")


        }
      }.bind(this)

    });





  },

  addstime: function (event) {
    var  plantime = event.target.parentNode.dataset.time;
    var plandate = geturl('addcustomerday');
    var plandate1 = geturl('addcustomerday').split("-");
     var customerid=geturl('customerid')
    //$(".cs").html(customername + "<br />" + customerid + "<br />" + plandate + "<br />" + plantime)
    this.saveplan(customerid, plandate, plandate1[0] + "-" + plandate1[1], plantime);
  },
  
   referrer: function () {
       setTimeout(function(){
   window.location.href=topreurl("addcustomer.html");
    },320)
  },

  render: function () {
    return (
      <div>
        <div className="profile white" id="pagenav">
          <span className="toleft" onTouchEnd={this.referrer}> <a href="javascript:void(0)"></a></span>
          选择时段
        </div>
        <div className="profile white margint_1r" id="selsectdaytime">
          <dl className="white infofile   ">
            <a href="javascript:void(0)" data-time="AM" className="profile_pading daytimelist" onTouchStart={this.addstime} >
              <dt class="productimg fontsize_0r">上午</dt>
            </a>
          </dl>
          <dl className="white infofile   ">
            <a href="javascript:void(0)" data-time="PM" className="profile_pading daytimelist" onTouchStart={this.addstime}>
              <dt className="productimg fontsize_0r">下午</dt>
            </a>
          </dl>
        </div>


        <div className="cs">


        </div>
      </div>
    )
  }
})

ReactDOM.render(
  <Selectday />,
  document.getElementById('conter')
);




