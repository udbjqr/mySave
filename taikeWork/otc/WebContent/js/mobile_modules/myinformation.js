import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
//import cropper from 'cropper'


var url = "/otcdyanmic/employee.do";
var currturl = window.location.href;  //获取当前url
var Myinformation = React.createClass({
    render: function () {
        return (
            <div>
                <Information />
            </div>
        )
    }

});


var Information = React.createClass({
    getInitialState: function () {
        return {
            head_portrait: dft_headimg,
            realName: "",
            mobile: "",
            depName: "",
            loginName: "",
            areaName: "",
            position: "",
            group: "",
            groupName: "",
            email: "",
            referrer: topreurl("index.html"), //上一页
            isclick:true,
        };
    },

    componentDidMount: function () {
        var $this = this;
        //获取信息
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "load";
        var showbox = this.refs.content;
        ajaxFn(object,$this,function (data) {
            //设置属性
            sessionStorage.setItem("OpenID", isnull(data.map.employee.userId)); //获取缓存的OpenID
            sessionStorage.setItem("mname", isnull(data.map.employee.loginName));//获取缓存的登录名
            $this.setState({
                head_portrait: isnullheadimg(data.map.employee.headPortrait),//后台获取的头像
                realName: isnull(data.map.employee.realName),//真实姓名
                mobile: isnull(data.map.employee.mobile),//用户手机
                depName: isnull(data.map.employee.depName),//部门名称
                loginName: isnull(data.map.employee.loginName),//登录名
                areaName: isnull(data.map.employee.areaName),
                position: isnull(data.map.employee.position),
                group: isnull(data.map.employee.group),
                email: isnull(data.map.employee.email),
                groupName: isnull(data.map.employee.groupName)//职位
            });

        }, url, showbox)
        //获取信息结束
        //this.getinfo();

    },

    render: function () {
        var state = generateMixed(5);
        var crrentindex = currturl.split("mobile")[0];
        var updatephoto = "";
        if (is_weixin) {
            updatephoto = wxauth = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbfff10e577b27a7&redirect_uri=" + crrentindex + "mobile/getauthcode.html&response_type=code&scope=snsapi_base&state=" + state + "#wechat_redirect";
        }
        else {
            updatephoto = "avatar.html"
        }
        return (
            <div id="myinformation">
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    个人资料

                </div>
                <div ref="content">
                    <div className="profile Head_portrait">
                        <dl className="white toico profile_pading">
                            <a href={updatephoto} className="profile_pading">
                                <dt>头像</dt>
                                <dd><span className="Headportrait">
                                    <img id="preview" src={this.state.head_portrait} />
                                    {/*<input type="file" capture="camera" accept="image/*" id="filephoto" name="filephoto" />*/}
                                </span>
                                </dd>
                            </a>
                        </dl>
                    </div>

                    <div className="profile margint_1r">
                        <dl className="white toico ">
                            <a href={"infomationedit.html?updatetype=userInfo&update=realName&updateval="+this.state.realName} className="profile_pading">
                                <dt>姓名</dt>
                                <dd><span>{this.state.realName}</span></dd>
                            </a>
                        </dl>
                        <dl className="white toico">
                            <a href={"infomationedit.html?updatetype=userInfo&update=mobile&updateval="+this.state.mobile} className="profile_pading">
                                <dt>手机号码</dt>
                                <dd><span>{this.state.mobile}</span></dd>
                            </a>
                        </dl>
                        <dl className="white toico ">
                            <a href={"infomationedit.html?updatetype=userInfo&update=email&updateval="+this.state.email} className="profile_pading">
                                <dt>邮箱</dt>
                                <dd><span>{this.state.email}</span></dd>
                            </a>
                        </dl>
                    </div>
                    <div className="profile margint_1r">
                        <dl className="white profile_pading">
                            <dt>账号</dt>
                            <dd><span>{this.state.loginName}</span></dd>
                        </dl>
                        <dl className="white profile_pading">
                            <dt>部门</dt>
                            <dd><span>{this.state.depName}</span></dd>
                        </dl>
                        <dl className="white profile_pading">
                            <dt>员工职位</dt>
                            <dd><span>{this.state.position}</span></dd>
                        </dl>
                        <dl className="white profile_pading">
                            <dt>员工地区</dt>
                            <dd><span>{this.state.areaName}</span></dd>
                        </dl>
                        <dl className="white profile_pading">
                            <dt>角色</dt>
                            <dd><span>{this.state.groupName}</span></dd>
                        </dl>
                        <dl className="white profile_pading">
                            <dt>所属分组</dt>
                            <dd><span>{this.state.group}</span></dd>
                        </dl>
                    </div>



                </div>
            </div>
        );
    }
});





ReactDOM.render(
    <Myinformation />,
    document.getElementById('conter')
);




