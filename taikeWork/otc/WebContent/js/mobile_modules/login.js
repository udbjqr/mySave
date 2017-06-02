import React from 'react'
import { render } from 'react-dom'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import PubSub from '../../js/mobile/build/PubSub.js'


var url = "/otcdyanmic/wechatBind.do";
var backtourl = "index.html";

/* url参数  */
var thcode = geturl('code');

var Applogin = React.createClass({
  getInitialState: function () {
    return {
      Y_login: true,  //是否登录
      thcode: geturl('code'),
      referrer: topreurl("index.html"), //上一页
      OpenID: isnull(sessionStorage.getItem("OpenID")) //缓存中的OpenID; 
    };
  },


  componentDidMount: function () {
    $("#wx_name").val(this.state.OpenID);
    var headcode = this.state.thcode;
    //this.gethead(headcode);

    //判断是否登录
    if (this.state.OpenID == "" && this.state.OpenID.length <= 0) {
      layer.open({
        shade: true,
        content: '您还没有登录，请先登录',
        skin: 'msg',
        className: 'tip',
        time: 2 //2秒后自动关闭
      });
      setTimeout(function () {
        var dodatate = generateMixed(6)
        window.location.href = wxurl()
        //"http://192.168.10.116/otc/mobile/?code="+code+"&state="+dodatate;
      }, 2000);
    }
    //判断是否登录结束

  },

  //获取头像
  gethead: function (headcode) {

    var object = new Object();
    object.code = headcode;

    $.ajax({
      url: "/otcdyanmic/wechatGetImg.do",
      data: { paramMap: JSON.stringify(object) },
      type: "post",
      dataType: "json",
      success: function (data) {

        if (data != "" && data != null && data != undefined) {
          //用户获取信息成功
          if (data.success == true) {
            //alert(1);

            if (data.map.imgUrl != "" && data.map.imgUrl != null && data.map.imgUrl != undefined) {
              console.log("获取头像信息成功")

              $("#wx_name").css("background", "url(/otc/" + data.map.imgUrl + ") no-repeat scroll .8rem center")
              $("#wx_name").css("background-size", "2.2rem")
            }
            else {
              layer.open({
                shade: true,
                content: '获取头像信息失败，头像为空',
                skin: 'msg',
                btn: ['知道了']
              });
              console.log("获取头像信息失败，头像为空")
            }

            //window.location.href = "/otc/mobile/"



          }
          //获取头像信息失败
          if (data.success == false) {
            //alert( data.errorCode + ";" + data.msg);
            console.log("获取头像信息失败;" + isnull(data.openId))
            //openid失效
            if (data.errorCode == "169") {

              if (is_weixin) {
                var failetext = "用户已过期，请返回重新登录"
                $("#conter").html(Datafaile(failetext, backtourl));
              }
              else {
                var failetext = "用户已过期，请更新code后重新登录"
                $("#conter").html(Datafaile(failetext, backtourl));
              }
              return false;
            }
            //openid失效结束
            if (data.errorCode == "1") {
              layer.open({
                shade: true,
                content: '获取信息失败！请重试登录',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
              });
            }
            if (data.errorCode == "8") {

              var failetext = "请求参数出现异常！请返回重新登录"
              $("#conter").html(Datafaile(failetext, backtourl));

              return false;
            }
            if (data.errorCode == "9") {
              var failetext = "获取前端数据失败！请返回重新登录"
              $("#conter").html(Datafaile(failetext, backtourl));
              return false;
            }

            if (data.errorCode == "11") {
              var failetext = "登录发生异常！请返回重新登录"
              $("#conter").html(Datafaile(failetext, backtourl));
              return false;
            }
            if (data.errorCode == "152") {

              var failetext = "此微信号未绑定！3秒后自动跳转到绑定页面"
              $("#conter").html(Datafaile(failetext, backtourl, "立即跳转"));
              setTimeout(function () {
                window.location.href = "login.html";//返回上一页.
              }, 3000)
              return false;
            }
            console.log("获取信息失败")
          }
        }
        else {
          var failetext = "内部异常！请返回重新登录"
          $("#conter").html(Datafaile(failetext, backtourl));

        }


      }.bind(this),


      error: function () {

        var failetext = "获取头像信息失败：网络错误！请返回重新登录"
        $("#conter").html(Datafaile(failetext, backtourl));
        console.log("获取头像信息失败：网络错误")

      }.bind(this)
    });
  },



  /*用户绑定 */
  loaginajax: function () {
    var $this = this;
    var wx_name = $("#wx_name").val();  //微信名
    var OTC_name = $("#OTC_name").val(); //用户名
    var OTC_password = $("#OTC_password").val(); //密码
    var realName = $("#realName").val(); //真实姓名
    var object = new Object();
    object.openId = this.state.OpenID;
    object.wxName = wx_name;
    object.loginName = OTC_name;
    object.passWord = OTC_password;
    object.realName = realName;
    ajaxFn(object, $this, function (data) {
      //用户绑定成功
      layer.open({
        shade: true,
        content: '用户绑定成功:',
        skin: 'msg',
        className: 'tip',
        time: 2 //2秒后自动关闭
      });
      setTimeout(function(){
       window.location.href ="index.html"
      },2000)

      /*获取微信头像*/
      /*
      if (is_weixin) {
        updatephoto = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbfff10e577b27a7&redirect_uri=" + crrentindex + "mobile/getauthcode.html&response_type=code&scope=snsapi_base&state=" + state + "#wechat_redirect";
      }
      else {

        updatephoto = "index.html"
      }

      window.location.href = updatephoto;
       */
    }, url, this.refs.content, this.state.referrer)
   
  },

  check: function () {
    var wx_name = $("#wx_name").val();
    //  var wx_password = $("#wx_password").val();
    var OTC_name = $("#OTC_name").val();
    var OTC_password = $("#OTC_password").val();
    var realName = $("#realName").val();
    if (OTC_name == "" && OTC_name.length <= 0) {
      layer.open({
        shade: true,
        content: '请输入真实姓名',
        skin: 'msg',
        className: 'tip',
        time: 3 //2秒后自动关闭
      });
      return false;
    }
    if (OTC_name == "" && OTC_name.length <= 0) {
      layer.open({
        shade: true,
        content: '请输入OTC事业管理系统账号',
        skin: 'msg',
        className: 'tip',
        time: 3 //2秒后自动关闭
      });
      return false;
    }
    if (OTC_password == "" && OTC_password.length <= 0) {
      layer.open({
        shade: true,
        content: '请输入OTC事业管理系统密码',
        skin: 'msg',
        className: 'tip',
        time: 3 //2秒后自动关闭
      });
      return false;
    }
    else {
      this.loaginajax();
    }
  },

  render: function () {
    return (
      <div ref="content">
        <div className="ui-adduser-main">
          <ul>
            <li className="white"> <input type="text" className="input" id="wx_name" name="wx_name" placeholder="请输入微信账号" /></li>
            <li className="white"> <input type="text" className="input" id="realName" name="realName" placeholder="请输入真实姓名" /></li>
            <li className="white"> <input type="text" className="input" id="OTC_name" name="OTC_name" placeholder="请输入OTC事业管理系统账号" /></li>
            <li className="white"> <input type="password" className="input" id="OTC_password" name="user_password" placeholder="请输入OTC事业管理系统密码" /> </li>
          </ul>
          <button className="fn-btn" id="adduserBtn" onClick={this.check}>确认</button>
          <div className="isbland">已经绑定 <a href="index.html">立即登录</a></div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <Applogin />,
  document.getElementById('conter')
);




