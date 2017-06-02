import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'

var url = "/otcdyanmic/employee.do";
var currturl = window.location.href;  //获取当前url

var cuspranterurl = "CustomerDetails.html?custom_id=" + geturl('customerid') + "&plan_id=" + geturl('plan_id') + "&day=" + geturl('day');
var buspranterurl = "BusinessCustomers.html?chain_id=" + geturl('chain_id') + "&plan_id=" + geturl('plan_id') + "&day=" + geturl('day');

var Informationedit = React.createClass({
    getInitialState: function () {
        return {
            updatetype: geturl('updatetype'),
        };
    },


    render: function () {
        if (this.state.updatetype == "userInfo") { //个人信息模块
            return (
                <div>
                    <Saveuserinfo />
                </div>
            )
        }
        if (this.state.updatetype == "customerInfo") { //门店客户信息模块
            return (
                <div>
                    <Savecustomerinfo />
                </div>
            )
        }
        if (this.state.updatetype == "chainInfo") { //商业客户门店客户信息模块
            return (
                <div>
                    <Savechaininfo />
                </div>
            )
        }

        else {
            var showerro = showmsg({
                msg: "没有找到此页面信息",  //显示的信息,
                isbtn: true,   //是否显示按钮,
                url: topreurl("index.html"),//点击按钮时的跳转链接 为空时为刷新,
                showimg: "",//错误图片,
                btntext: "立即返回",//按钮文字,
                classname: "",//样式名
            })
            return (
                <div dangerouslySetInnerHTML={createMarkup(showerro)}>

                </div>
            )

        }
    }

});



/*
保存用户个人信息模块
*/
var Saveuserinfo = React.createClass({
    getInitialState: function () {
        return {
            isclick: true,
            isload: false,
            referrer: topreurl("myinformation.html"),//上一页
            update: geturl('update'),
            updateval: geturl("updateval"),
        };
    },
    componentDidMount: function () {
        this.refs.infomationedi.value = this.state.updateval;
    },

    //验证提交
    infocheck: function () {
        var update = isnull(this.state.update);

        switch (update) {

            /* 用户名  */
            case ("realName"):
                var realName = this.refs.infomationedi.value;
                if (realName == ""  && realName.length<=0) {
                    layer.open({
                        shade: false,
                        content: '请输入用户名',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (strlen(realName) < 4 || strlen(realName) > 16) {
                    console.log(strlen(realName))
                    layer.open({
                        shade: false,
                        content: '用户名长度必须为4~16位字符(中文为2个字符)',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                else {
                    this.saveinfo();
                }
                break;

            /* 手机 */
            case ("mobile"):

                var mobile = this.refs.infomationedi.value;
                if (mobile == "" && mobile.length<=0) {
                    layer.open({
                        shade: false,
                        content: '请输入手机号',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                var reg = /^([1-9]\d*|[0]{1,1})$/;
                if (!reg.exec(mobile)) {
                    layer.open({
                        shade: false,
                        content: '手机号必须为数字',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                }
                else {
                    this.saveinfo();
                }
                break;

            /* 邮箱 */
            case ("email"):
                var email = this.refs.infomationedi.value;
                if (email == "" && email.length<=0) {
                    layer.open({
                        shade: false,
                        content: '请输入邮箱',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                var emailreg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                if (!emailreg.exec(email)) {
                    layer.open({
                        shade: false,
                        content: '邮箱格式不正确',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                }
                else {
                    this.saveinfo();
                }
                break;

        }



    },

    //保存用户个人信息
    saveinfo: function () {
        var $this = this;
        if (this.state.isclick) {

            this.setState({
                isclick: false, //禁止点击
                isload: true,  //正在加载
            })
            ajaxdong("正在保存信息...", this);
            var update = this.state.update;
            var object = new Object();

            object.wxId = OpenID;
            object.controlType = "update";
            if (update == "realName") {
                object.realName = this.refs.infomationedi.value;
            }
            if (update == "mobile") {
                object.mobile = this.refs.infomationedi.value;
            }
            if (update == "email") {
                object.email = this.refs.infomationedi.value;
            }
            var showbox = this.refs.content;
            var referrer = this.state.referrer;
            //保存个人信息ajax
            ajaxFn(object, $this, function (data) {
                console.log("用户信息保存成功")
                layer.open({
                    shade: false,
                    content: '用户信息保存成功',
                    skin: 'msg',
                    className: 'tip',
                    time: 2 //2秒后自动关闭
                });
                setTimeout(function () { window.location.href = "myinformation.html" }, 2000);
                $this.setState({
                    isclick: true, //允许点击
                    isload: false,  //去除加载
                })
            }, url, showbox, referrer)
            //保存个人信息ajax结束
        }
    },
    render: function () {
        var update = this.state.update;
        var updateTitle = "";
        if (update == "realName") {
            updateTitle = "姓名";
        }
        if (update == "mobile") {
            updateTitle = "手机";
        }
        if (update == "email") {
            updateTitle = "邮箱";
        }

        return (
            <div>
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    <span className="updateTitle" ref="updateTitle">修改{updateTitle}</span>
                </div>
                <div ref="content">
                    <div className="profile margint_1r">
                        <dl className="white profile_pading infomatiodit">
                            {/* <dt>{updateTitle}</dt>  */}
                            <dd><input ref="infomationedi" type="text" className="infoedi-ipt" id={update} placeholder={"请输入你的" + updateTitle} /></dd>
                        </dl>
                    </div>
                    <button className="fn-btn" onTouchStart={this.infocheck}>确认</button>
                </div>
            </div>
        );

    }
});



/*
门店客户信息模块
*/
var Savecustomerinfo = React.createClass({
    getInitialState: function () {
        return {
            isclick: true,
            isload: false,
            referrer: topreurl(cuspranterurl),//上一页
            update: geturl('update'),
            updateval: geturl("updateval"),
            custom_id: geturl('customerid'), //门店id
        };
    },
    componentDidMount: function () {
        this.refs.infomationedi.value = this.state.updateval;
    },

    //验证提交
    infocheck: function () {
        var update = isnull(this.state.update);

        switch (update) {

            /* 门店名联系人  */
            case ("customerName"):
                var customerName = this.refs.infomationedi.value;
                if (customerName == "" && customerName.length<=0) {
                    layer.open({
                        shade: false,
                        content: '请输入门店联系人姓名',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (strlen(customerName) < 4 || strlen(customerName) > 16) {
                    console.log(strlen(customerName))
                    layer.open({
                        shade: false,
                        content: '联系人姓名长度必须为4~16位字符(中文为2个字符)',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                else {
                    this.savecustominfo();
                }
                break;

            /* 门店名联系人手机 */
            case ("customerphone"):

                var customerphone = this.refs.infomationedi.value;
                if (customerphone == "" && customerphone.length<=0) {
                    layer.open({
                        shade: false,
                        content: '请输入门店联系人手机号',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                var reg = /^([1-9]\d*|[0]{1,1})$/;
                if (!reg.exec(customerphone)) {
                    layer.open({
                        shade: false,
                        content: '手机号必须为数字',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                }
                else {
                    this.savecustominfo();
                }
                break;

        }



    },

    //保存门店信息
    savecustominfo: function () {
        var $this = this;
        if (this.state.isclick) {

            this.setState({
                isclick: false, //禁止点击
                isload: true,  //正在加载
            })
            ajaxdong("正在保存信息...", this);
            var update = this.state.update;
            var object = new Object();
            object.id = this.state.custom_id;
            object.controlType = "update";
            if (update == "customerName") {
                object.buyer = this.refs.infomationedi.value;
            }
            if (update == "customerphone") {
                object.buyerPhone = this.refs.infomationedi.value;
            }
            var showbox = this.refs.content;
            var referrer = this.state.referrer;
            //保存门店信息ajax
            ajaxFn(object, $this, function (data) {
                console.log("门店信息保存成功")
                layer.open({
                    shade: false,
                    content: '门店信息保存成功',
                    skin: 'msg',
                    className: 'tip',
                    time: 2 //2秒后自动关闭
                });
                setTimeout(function () { window.location.href = referrer }, 2000);
                $this.setState({
                    isclick: true, //允许点击
                    isload: false,  //去除加载
                })
            }, "/otcdyanmic/customerMobile.do", showbox, referrer)
            //保存门店信息ajax结束
        }
    },
    render: function () {
        var update = this.state.update;
        var updateTitle = "";
        if (update == "customerName") {
            updateTitle = "门店联系人姓名";
        }
        if (update == "customerphone") {
            updateTitle = "门店联系人手机";
        }


        return (
            <div>
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    <span className="updateTitle" ref="updateTitle">修改{updateTitle}</span>
                </div>
                <div ref="content">
                    <div className="profile margint_1r">
                        <dl className="white profile_pading infomatiodit">
                            {/* <dt>{updateTitle}</dt>  */}
                            <dd><input ref="infomationedi" type="text" className="infoedi-ipt" id={update} placeholder={"请输入" + updateTitle} /></dd>
                        </dl>
                    </div>
                    <button className="fn-btn" onTouchStart={this.infocheck}>确认</button>
                </div>
            </div>
        );

    }
});


/*
商业连锁门店信息模块
*/
var Savechaininfo = React.createClass({
    getInitialState: function () {
        return {
            isclick: true,
            isload: false,
            referrer: topreurl(buspranterurl),//上一页
            update: geturl('update'),
            updateval: isnull(geturl("updateval")),
            planUrl: geturl("plan_id"),
            chain_id: geturl("chain_id"),
            signType: geturl("signType"),
            detail_id: '',
            visits_id: '',
        };
    },
    componentDidMount: function () {
        if (this.state.update != "remark") {
          
            this.refs.infomationedi.value = this.state.updateval;
        }
        if (this.state.update == "remark") {
            if (this.state.signType != "signOut") {
                this.refs.updateTitle.innerHTML="备注"
                this.refs.updataBtn.style.display = "none"
            }

            /*获取备注初始信息 */
            var object = {};
            var $this = this;
            object.controlType = 'loadRemark';
            object.plan_id = this.state.planUrl;
            var showbox = this.refs.content;
            var referrer = this.state.referrer;
            //获取备注初始信息ajax
            ajaxFn(object, $this, function (data) {
                console.log("获取备注初始信息成功")
                $this.setState({
                    visits_id: data.map.visitObject.visits_id,
                    detail_id: data.map.visitObject.detail_id,
                    remark: data.map.visitObject.remark
                });
                $this.setState({
                    isclick: true, //允许点击
                    isload: false,  //去除加载
                })
            }, "/otcdyanmic/appraisals.do", showbox, referrer)
            //获取备注初始信息ajax结束

            /*获取备注初始信息结束*/
        }
    },

    //验证提交
    infocheck: function () {
        var update = isnull(this.state.update);

        switch (update) {

            /* 商业连锁门店联系人名 */
            case ("chinaName"):
                var chinaName = this.refs.infomationedi.value;
                if (chinaName == "") {
                    layer.open({
                        shade: false,
                        content: '请输入连锁门店联系人姓名',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                if (strlen(chinaName) < 4 || strlen(chinaName) > 16) {
                    console.log(strlen(chinaName))
                    layer.open({
                        shade: false,
                        content: '联系人姓名长度必须为4~16位字符(中文为2个字符)',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                else {
                    this.savechinainfo();
                }
                break;

            /* 商业连锁门店联系人手机 */
            case ("chinaPhone"):

                var chinaPhone = this.refs.infomationedi.value;
                if (chinaPhone == "" && chinaPhone.length<=0) {
                    layer.open({
                        shade: false,
                        content: '请输入连锁门店联系人手机号',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                var reg = /^([1-9]\d*|[0]{1,1})$/;
                if (!reg.exec(chinaPhone)) {
                    layer.open({
                        shade: false,
                        content: '手机号必须为数字',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                }
                else {
                    this.savechinainfo();
                }
                break;
            /* 备注 */
            case ("remark"):
                var remark = this.refs.remark.value;
               
                if (remark == "" && remark.length<=0) {
                    layer.open({
                        shade: false,
                        content: '请输入备注',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    return false;
                }
                else {
                    this.toRemark();
                }
                break;

        }



    },

    //保存商业连锁门店信息
    savechinainfo: function () {
        var $this = this;
        if (this.state.isclick) {

            this.setState({
                isclick: false, //禁止点击
                isload: true,  //正在加载
            })
            ajaxdong("正在保存信息...", this);
            var update = this.state.update;
            var object = new Object();
            object.controlType = "update";
            if (update == "chinaName") {
                object.buyer = this.refs.infomationedi.value;
            }
            if (update == "chinaPhone") {
                object.buyer_phone = this.refs.infomationedi.value;
            }
            object.chain_id = this.state.chain_id;
            var showbox = this.refs.content;
            var referrer = this.state.referrer;
            //保存商业连锁门店信息ajax
            ajaxFn(object, $this, function (data) {
                console.log("连锁门店信息保存成功")
                layer.open({
                    shade: false,
                    content: '连锁门店信息保存成功',
                    skin: 'msg',
                    className: 'tip',
                    time: 2 //2秒后自动关闭
                });
                setTimeout(function () { window.location.href = referrer }, 2000);
                $this.setState({
                    isclick: true, //允许点击
                    isload: false,  //去除加载
                })
            }, "/otcdyanmic/chainCustomerMobile.do", showbox, referrer)
            //保存商业连锁门店信息ajax结束
        }
    },

    /*提交备注*/
    toRemark() {
        console.log(this.refs.remark.value);
        var object = {};
        var $this = this;
        object.controlType = 'addRemark';
        object.visits_id = this.state.visits_id;
        object.remark = this.state.remark;
        object.detail_id = this.state.detail_id ? this.state.detail_id : "";
        var showbox = this.refs.content;
        var referrer = this.state.referrer;
        //提交备注ajax
        ajaxFn(object, $this, function (data) {
            console.log("提交备注成功")
            layer.open({
                shade: false,
                content: '您已成功修改备注！',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
            setTimeout(function () {
                window.location.href = referrer;
            }, 500);
            $this.setState({
                isclick: true, //允许点击
                isload: false,  //去除加载
            })
        }, "/otcdyanmic/appraisals.do", showbox, referrer)
        //提交备注ajax结束
    },/*备注签到事件*/
    remarkChange(e) {
        this.setState({ remark: e.target.value });

    },

    render: function () {
        var update = this.state.update;
        var updateTitle = "";
        var inputshows = ""
        if (update == "chinaName") {
            updateTitle = "连锁门店联系人";
            inputshows = <dd><input ref="infomationedi" type="text" className="infoedi-ipt" id={update} placeholder={"请输入" + updateTitle} /></dd>
        }
        if (update == "chinaPhone") {
            updateTitle = "连锁门店联系人手机";
            inputshows = <dd><input ref="infomationedi" type="text" className="infoedi-ipt" id={update} placeholder={"请输入" + updateTitle} /></dd>
        }
        if (update == "remark") {
            updateTitle = "备注";
            var remarks = this.state.remark == "" ? "没有备注" : this.state.remark
            inputshows = this.state.signType != "signOut" ? <dd><div className="remarkshows">{remarks}</div></dd> : <dd> <textarea onFocus={this.remarkChange} onChange={this.remarkChange} ref="remark" id="textarea" className="remark_input" value={this.state.remark}></textarea></dd>;
        }


        return (
            <div>
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    <span className="updateTitle" ref="updateTitle">修改{updateTitle}</span>
                </div>
                <div ref="content">
                    <div className="profile margint_1r">
                        <dl className="white profile_pading infomatiodit">
                            {/* <dt>{updateTitle}</dt>  */}
                            {inputshows}
                        </dl>
                    </div>
                    <button className="fn-btn" ref="updataBtn" onTouchStart={this.infocheck}>确认</button>
                </div>
            </div>
        );

    }
});

ReactDOM.render(
    <Informationedit />,
    document.getElementById('conter')
);
