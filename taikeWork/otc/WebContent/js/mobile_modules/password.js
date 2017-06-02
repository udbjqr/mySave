//import React from 'react'
//import {render} from 'react-dom'

var url = "../otcdyanmic/userLogin.do";
var Password = React.createClass({
  getInitialState: function () {
    return {
      Y_login: true,  //是否登录
      referrer: topreurl("index.html") //上一页
    };
  },
  componentDidMount: function () {

  },
  loaginajax: function (newpwd) {
    var object = new Object();
    object.wxId = OpenID;
    object.newpwd = newpwd;
    $.ajax({
      url: url,
      data: { paramMap: JSON.stringify(object) },
      type: "post",
      dataType: "json",
      success: function (data) {

        if (data != "" && data != null && data != undefined) {

          //修改密码成功
          if (data.success == true) {
            layer.open({
              shade: false,
              content: '修改密码成功，请重新登录',
              skin: 'msg',
              className: 'tip',
              time: 2 //2秒后自动关闭
            });
            setTimeout(function () { window.location.href = "login.html" }, 2000);
          }

          //修改密码失败
          if (data.success == false) {
            //未登录
            if (data.errorCode == "1") {
              var dodatate = generateMixed(6)
              window.location.href = wxurl(dodatate);
            }
            //未登录结束
            layer.open({
              shade: false,
              content: "修改密码失败,请重新修改",
              skin: 'msg',
              className: 'tip',
              time: 2//2秒后自动关闭
            });
          }
          //修改密码失败End
        }

      },
      error: function (data) {
        layer.open({
          shade: false,
          content: '网络错误,请重新修改 ',
          skin: 'msg',
          className: 'tip',
          time: 2//2秒后自动关闭
        });
      }
    });
  },

  check: function () {
    var oldpwd = this.refs.oldpwd.value;
    var newpwd = this.refs.newpwd.value;
    var confirmpwd = this.refs.confirmpwd.value;

    if (oldpwd == "" && oldpwd.length <= 0) {
      layer.open({
        shade: false,
        content: '请输入原密码',
        skin: 'msg',
        className: 'tip',
        time: 2//2秒后自动关闭
      });
      return false;
    }
    if (newpwd == "" && newpwd.length <= 0) {
      layer.open({
        shade: false,
        content: '请输入新密码',
        skin: 'msg',
        className: 'tip',
        time: 2//2秒后自动关闭
      });
      return false;
    }
    if (newpwd.length <= 6) {
      layer.open({
        shade: false,
        content: '密码必须大于6位',
        skin: 'msg',
        className: 'tip',
        time: 2//2秒后自动关闭
      });
      return false;
    }
    if (confirmpwd == "" && confirmpwd.length <= 0) {
      layer.open({
        shade: false,
        content: '请输入确认密码',
        skin: 'msg',
        className: 'tip',
        time: 2 //2秒后自动关闭
      });

      return false;
    }
    if (confirmpwd != newpwd) {
      layer.open({
        shade: false,
        content: '确认密码与新密码不一致',
        skin: 'msg',
        className: 'tip',
        time: 2 //2秒后自动关闭
      });
      return false;
    }
    else {
      this.loaginajax(newpwd)
    }
  },

  render: function () {
    return (
      <div>
        <div className="profile white" id="pagenav">
          <span className="toleft"> <a href={this.state.referrer}></a></span>
          修改密码
                </div>
        <div className="ui-adduser-main profile marginb_2r">
          <dl className="white">
            <dt className="pwdlab">原密码:</dt>
            <dd><input type="password" className="input" ref="oldpwd" id="oldpwd" name="oldpwd" placeholder="请输入原密码" /></dd>
          </dl>
          <dl className="white">
            <dt className="pwdlab">新密码:</dt>
            <dd><input type="password" className="input" ref="newpwd" id="newpwd" name="newpwd" placeholder="请输入新密码" /></dd>
          </dl>
          <dl className="white">
            <dt className="pwdlab">确认密码:</dt>
            <dd><input type="password" className="input" ref="confirmpwd" id="confirmpwd" name="confirmpwd" placeholder="再次输入密码" /></dd>
          </dl>
        </div>
        <button className="fn-btn" id="adduserBtn" onTouchStart={this.check}>确认</button>
      </div>
    );
  }
});

ReactDOM.render(
  <Password />,
  document.getElementById('conter')
);




