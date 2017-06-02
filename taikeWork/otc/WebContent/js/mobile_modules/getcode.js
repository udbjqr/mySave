import React from 'react'
import { render } from 'react-dom'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import PubSub from '../../js/mobile/build/PubSub.js'

var url = "/otcdyanmic/wechatBind.do";
var backtourl = "index.html";

/* url参数  */
var code = geturl('code'); //code


var Applogin = React.createClass({
    getInitialState: function () {
        return {
            isclick: true,  //按钮点击
            referrer: topreurl("index.html"), //上一页
            OpenID: isnull(sessionStorage.getItem("OpenID"))
        };
    },

    componentDidMount: function () {
     this.tologin();
    },
    /* 用户登录   */
    tologin: function () {
       
        var $this = this;
        var object = new Object();
        object.code = code;
        ajaxFn(object, $this, function (data) {
            var openids = data.map.openId;
            var mname = data.map.mname;
            console.log("获取登录信息成功");
            /*
            layer.open({
                shade: false,
                content: '登录成功',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
           */
            sessionStorage.setItem("OpenID", data.map.openId); //缓存获取的OpenId
            setTimeout(function(){
              window.location.href = $this.state.referrer;//返回上一页
            },2000)
           
        }, "/otcdyanmic/userLogin.do", this.refs.content, this.state.referrer)
    },
    render: function () {
        return (
           
                <div ref="content">
                    <div className='loading'>
                        <div className='spinner'>
                            <div className='bounce1'></div>
                            <div className='bounce2'></div>
                            <div className='bounce3'></div>
                        </div>
                        <p> 正在登录... </p>
                    </div>
                </div>
          
        );
    }
});
ReactDOM.render(
    <Applogin />,
    document.getElementById('conter')
);