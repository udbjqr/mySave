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
var name = isnull(geturl('name'));

var Applogin = React.createClass({
    getInitialState: function () {
        return {
            isclick: true,  //恢复按钮点击
            OpenID: isnull(sessionStorage.getItem("OpenID"))

        };
    },

    componentDidMount: function () {
    
        if(name=="1"){
        $("#username").val("administrator");
        return false
        }
        if(name=="2"){
        $("#username").val("nc03");
        return false
        }else{
        $("#username").val(name);
        }

    },
    /* 用户登录   */
    tologin: function (username) {
        var $this=this;
        var object = new Object();
        object.type="test";
        object.login_name = username;
        ajaxFn(object, $this, function (data) {
            var openids = data.map.openId;
            console.log("获取登录信息成功");
            sessionStorage.setItem("OpenID", data.map.openId);
            $this.setState({
                isclick: true  //恢复按钮点击
            });
            window.location.href = "index.html";//返回主页
        }, "/otcdyanmic/userLogin.do", this.refs.content, this.state.referrer)
    },
    /* 判断数据并登录 */
    tocheck:function(e){
     var e = e || window.event;   
    if((e && e.keyCode==13) || e.type == "click"){ // enter 键
     var username = $("#username").val();
    $("input").blur();
    var password=$("#user_password").val();
    if (username == "" && username.length <= 0) {
      layer.open({
        shade: true,
        content: '请输入用户名',
        skin: 'msg',
        className: 'tip',
        time: 3 //2秒后自动关闭
      });
      return false;
    }
    else{
         if(this.state.isclick){
         this.tologin(username,password, "testlogin.html")
         }

    }

    }
    },
    render: function () {
        return (
            <div id="conter">
                <div>
                    <div className="ui-adduser-main">
                        <ul>
                            <li className="white"> <input type="text" className="input" id="username" name="username" placeholder="请输入用户名" onKeyUp={this.tocheck} /></li>

                            <li className="white"> <input type="password" className="input" id="user_password" name="user_password" placeholder="请输入密码" onKeyUp={this.tocheck} /> </li>
                        </ul>
                        <button className="fn-btn" id="adduserBtn" onClick={this.tocheck} onKeyUp={this.tocheck}>确认</button>
                        <div className="isbland">已经登录<a href="index.html">立即返回</a></div>
                    </div>
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Applogin />,
    document.getElementById('conter')
);