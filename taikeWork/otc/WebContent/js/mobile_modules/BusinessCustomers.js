import React from 'react'
import ReactDOM from 'react-dom'
import Userfooter from '../../js/mobile_modules/footer.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'

// import { Modal, Button, WhiteSpace, WingBlank } from 'antd-mobile';

var url = "/otcdyanmic/chainCustomerMobile.do";
var url1 = "/otcdyanmic/appraisals.do";
var issigninurl = "/otcdyanmic/appraisals.do";
var currturl = window.location.href;  //获取当前url
var daydate = geturl('day'); //走访时间

var CustomerDetailsShow = React.createClass({
    render: function () {
        return (
            <div>
                <CustomerDetails />
            </div>
        )
    }
});



var CustomerDetails = React.createClass({
    getInitialState: function () {
        return {
            loginY: false, //是否登录
            referrer: topreurl("client.html"), //上一页
            custom_id: geturl('chain_id'), //custom_id
            plan_id: geturl('plan_id'),   //plan_id
            visitsNumber: 0,
            realName: "",
            attributesName: "",
            address: "",
            buyerPhone: "",
            areaName: "",
            id: "",
            customerName: "",
            personInChargeName: "",
            buyer: "",
            othersignout: "0",
            signType: "",
            isRemarks:true,
            employeeName:'',
            chinaName:'',
            buyer_phone:''
        };

    },
    componentDidMount: function () {
        this.issingin();
        this.getinfo();
    },//获取初始数据
    getinfo: function () {
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "getCustomerInfo";
        object.chain_id = this.state.custom_id;
        $.ajax({
            url: url,
            data: { paramMap: JSON.stringify(object) },
            type: "post",
            dataType: "json",
            success: function (data) {
                if(data){
                    this.setState({
                        employeeName:data.map.info.employeeName,
                        chinaName:data.map.info.china_customer_name,
                        address:data.map.info.areaName,
                        buyer:data.map.info.buyer,
                        buyerPhone:data.map.info.buyer_phone
                    });
                }
            }.bind(this),
            error: function (jqXHR, textStatus, errorThrown) {
                if (this.isMounted()) {
                    layer.open({
                        shade: true,
                        content: '获取走访客户信息失败,请检查你的网络是否正常',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    console.log("获取走访客户信息失败：网络错误")
                }
            }.bind(this)
        });
    },/*电话*/
    tel: function (event) {
        event.preventDefault();
        var u = navigator.userAgent;
        var tel = event.target.parentNode.innerText
        if (tel != "") {
            var phone = "15907099513"; //客服电话
            var service_manager = this.state.service_manager; //客服人员
            if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
                event.preventDefault();
                layer.open({
                    type: 1,
                    content: "<p style='text-align:center; margin:1.5rem 0'>呼叫  " + tel + "</p>",
                    btn: ['呼叫', '取消'],
                    yes: function () {
                        window.location.href = "tel:" + tel;
                    },
                });
                return false;
            }
            if (u.indexOf('iPhone') > -1) {
                window.location.href = "tel:" + tel; //苹果手机
                return false;
            }
            else {
                layer.open({
                    type: 1,
                    content: "<p style='text-align:center; margin:1.5rem 0'>呼叫  " + tel + "</p>",
                    btn: ['呼叫', '取消'],
                    yes: function () {
                        window.location.href = "tel:" + tel;
                    },
                });
                 return false;
            }
        }
    },
    issingin: function () {
        //判断是否签入
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "checkSign";
        object.plan_id = this.state.plan_id;
        $.ajax({
            url: issigninurl,
            data: { paramMap: JSON.stringify(object) },
            type: "post",
            dataType: "json",
            success: function (data) {
                if (this.isMounted()) {
                    if (data != "" && data != null && data != undefined) {
                        //获取库存信息成功
                        if (data.success == true) {
                            console.log("获取获取信息成功")
                            var signType = data.map.signType;
                            if (signType == "alreadySign") {
                                /*
                                layer.open({
                                  shade: false,
                                  content: '此门店已经拜访过，<br>2秒后将自动跳转到前一页',
                                  skin: 'msg',
                                  className: 'tip',
                                  time: 2000 //2秒后自动关闭
                                });
                                */
                            }
                            this.setState({
                                signType: signType
                            });
                            if (signType == "alreadySign") {

                                this.refs.singintp.innerHTML = '<p class="footer-action-icon icon-dynamic4" ></p> <h2 className="signintp">已签出</h2>';
                            }
                            if (signType == "signIn") {
                                var mydate = new Date();
                                //获取当天日期
                                var currYear = parseInt(mydate.getFullYear());
                                var currmonth = parseInt(mydate.getMonth() + 1);
                                var currday = parseInt(mydate.getDate());
                                var currdatetime = currYear + "-" + addzerro(parseInt(currmonth)) + "-" + addzerro(parseInt(currday));
                                //获取走访日期
                                var listdate = geturl('day'); //走访时间;
                                //大于当日
                                if (Date.parse(listdate) > Date.parse(currdatetime)) {
                                    this.refs.singintp.innerHTML = '<p class="footer-action-icon icon-dynamic4" id="aftersingnin" ></p> <h2 className="signintp" >签到</h2>';
                                    this.refs.toproduct.innerHTML = ' <p class="footer-action-icon icon-dynamic5"></p> <h2>考核盘点</h2>'
                                    $("#singintp").click(function () {
                                        layer.open({
                                            shade: false,
                                            content: '只能选择当日进行签到',
                                            skin: 'msg',
                                            className: 'tip',
                                            time: 2 //2秒后自动关闭
                                        });
                                    })

                                    $("#toproduct").click(function () {
                                        layer.open({
                                            shade: false,
                                            content: '只能盘核当日产品',
                                            skin: 'msg',
                                            className: 'tip',
                                            time: 2 //2秒后自动关闭
                                        });
                                    })
                                }
                                //等于当日
                                if (Date.parse(listdate) == Date.parse(currdatetime)) {

                                    $(".icon-dynamic4").css("background-image", "url(../images/mobile/23out.png)")
                                    $(".signintp").html("签到");
                                }

                                //小于当日
                                if (Date.parse(listdate) < Date.parse(currdatetime)) {

                                    this.refs.singintp.innerHTML = '<p class="footer-action-icon icon-dynamic4" id="beforesingnin" ></p> <h2 className="signintp" >签到</h2>';
                                    this.refs.toproduct.innerHTML = ' <p class="footer-action-icon icon-dynamic5"></p> <h2>考核盘点</h2>'
                                    $("#singintp").click(function () {
                                        layer.open({
                                            shade: false,
                                            content: '门店已经过期，不能签到',
                                            skin: 'msg',
                                            className: 'tip',
                                            time: 2 //2秒后自动关闭
                                        });
                                    })
                                    $("#toproduct").click(function () {
                                        layer.open({
                                            shade: false,
                                            content: '门店已经过期,不能盘核产品',
                                            skin: 'msg',
                                            className: 'tip',
                                            time: 2 //2秒后自动关闭
                                        });
                                    })
                                }
                            }
                            if (signType == "signOut") {
                                var mydate = new Date();
                                //获取当天日期
                                var currYear = parseInt(mydate.getFullYear());
                                var currmonth = parseInt(mydate.getMonth() + 1);
                                var currday = parseInt(mydate.getDate());
                                var currdatetime = currYear + "-" + addzerro(parseInt(currmonth)) + "-" + addzerro(parseInt(currday));

                                //获取走访日期
                                var listdate = geturl('day'); //走访时间;

                                //大于当日
                                if (Date.parse(listdate) > Date.parse(currdatetime)) {

                                    this.refs.singintp.innerHTML = '<p class="footer-action-icon icon-dynamic4" id="aftersingnin" ></p> <h2 className="signintp" >签出</h2>';
                                    this.refs.toproduct.innerHTML = ' <p class="footer-action-icon icon-dynamic5"></p> <h2>考核盘点</h2>'
                                    $("#singintp").click(function () {
                                        layer.open({
                                            shade: false,
                                            content: '只有当日签到的门店才能签出',
                                            skin: 'msg',
                                            className: 'tip',
                                            time: 2 //2秒后自动关闭
                                        });
                                    })

                                    $("#toproduct").click(function () {
                                        layer.open({
                                            shade: false,
                                            content: '只能盘核当日产品',
                                            skin: 'msg',
                                            className: 'tip',
                                            time: 2 //2秒后自动关闭
                                        });
                                    })
                                }
                                //等于当日
                                if (Date.parse(listdate) == Date.parse(currdatetime)) {


                                     $(".icon-dynamic4").css("background-image", "url(../images/mobile/22in.png)")
                                     $(".signintp").html("签出");
                                }

                                //小于当日
                                if (Date.parse(listdate) < Date.parse(currdatetime)) {

                                    this.refs.singintp.innerHTML = '<p class="footer-action-icon icon-dynamic4" id="beforesingnin" ></p> <h2 className="signintp" >签出</h2>';
                                    this.refs.toproduct.innerHTML = ' <p class="footer-action-icon icon-dynamic5"></p> <h2>考核盘点</h2>'
                                    $("#singintp").click(function () {
                                        layer.open({
                                            shade: false,
                                            content: '门店已经过期，不能签出',
                                            skin: 'msg',
                                            className: 'tip',
                                            time: 2 //2秒后自动关闭
                                        });
                                    })
                                    $("#toproduct").click(function () {
                                        layer.open({
                                            shade: false,
                                            content: '门店已经过期,不能盘核产品',
                                            skin: 'msg',
                                            className: 'tip',
                                            time: 2 //2秒后自动关闭
                                        });
                                    })
                                }
                            }
                        }
                        //获取获取信息失败
                        if (data.success == false) {
                            //未登录
                            if (data.errorCode == "1") {
                                var dodatate = generateMixed(6)
                                window.location.href = wxurl(dodatate);
                            }
                            if (data.errorCode == "172") {
                                //存在未签出的拜访计划！
                                this.refs.singintp.innerHTML = '<p class="footer-action-icon icon-dynamic4" id="othersingnout" ></p> <h2 className="signintp" >签到</h2>';
                                $("#singintp").click(function () {
                                    layer.open({
                                        shade: false,
                                        content: '存在未签出的拜访计划！',
                                        skin: 'msg',
                                        className: 'tip',
                                        time: 2 //2秒后自动关闭
                                    });
                                })
                            }

                            console.log("获取获取信息失败:" + data.msg)
                        }
                    }

                } // this.isMounted() End
            }.bind(this),
            error: function (jqXHR, textStatus, errorThrown) {
                if (this.isMounted()) {
                    layer.open({
                        shade: false,
                        content: '获取获取信息失败网络错误',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    console.log("获取获取信息失败：网络错误")
                }
            }.bind(this)
        });
    },/*备注*/
    remark(){

        if(this.state.signType == "signOut"){
            window.location.href = "infomationedit.html?updatetype=chainInfo&update=remark&chain_id="+this.state.custom_id+"&plan_id="+this.state.plan_id+"&day="+daydate+"&signType="+this.state.signType
        }else if(this.state.signType == "signIn"){
            layer.open({
                shade: false,
                content: '您暂未签到，请先签到再填写备注！',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
        }else {
            window.location.href = "infomationedit.html?updatetype=chainInfo&update=remark&chain_id="+this.state.custom_id+"&plan_id="+this.state.plan_id+"&day="+daydate+"&signType="+this.state.signType
        }

    },
    render: function () {
        var visitsNumber = this.state.visitsNumber;
        var visitsNumbershow

        if (visitsNumber == "0") {
            $(".myprofild em").hide();
        }
        else {
            $(".myprofild em").show();
        }

        return (
            <div className="CustDetails">
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    连锁客户
                </div>
                <div className="CustDetailMain" ref="CustDetailMain">
                    <div className="profile">
                        <dl className="white profile_pading ">
                            <dt className="customerphoto"><img src={"../images/mobile/u45.png"} /></dt>
                            <dd className="customer_info">
                                <h2>{this.state.chinaName}</h2>
                                {/*<p className="Customer_Attrbt">属性: {this.state.attributesName}</p>*/}
                            </dd>
                        </dl>
                        <dl className="white  toico">
                            <a href={"Storelocation.html?address=" + this.state.address + "&name=" + this.state.customerName + "&custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id+ "&day=" + daydate} className="profile_pading">
                                <dt className="customer_dress">

                                    {this.state.address}

                                </dt>
                            </a>
                        </dl>
                    </div>
                    <h1 className="customer_title">负责代表</h1>
                    <div className="profile ">
                        <dl className="white profile_pading toico principal_name">
                            <dt className="chainrpb_name">{this.state.employeeName}</dt>
                        </dl>
                      {/*
                        <dl className="white  toico principal_phone">

                            <a href={"javascript:void(0)"} onClick={this.tel} className="profile_pading">
                                <dt className="chainrpb_phone">{this.state.buyerPhone}</dt>
                            </a>
                        </dl>
                        */}
                    </div>
                    <h1 className="customer_title">门店联系人</h1>
                    <div className="profile ">
                        <dl className="white profile_pading toico principal_name">
                         <a href={"infomationedit.html?updatetype=chainInfo&update=chinaName&updateval="+this.state.buyer+"&chain_id="+this.state.custom_id+ "&plan_id=" + this.state.plan_id+ "&day=" + daydate} className="profile_pading">
                            <dt className="stockrpb_name">{this.state.buyer}</dt>
                            </a>
                        </dl>
                        <dl className="white  toico principal_phone">
                         <a href={"infomationedit.html?updatetype=chainInfo&update=chinaPhone&updateval="+this.state.buyerPhone+"&chain_id="+this.state.custom_id+ "&plan_id=" + this.state.plan_id+ "&day=" + daydate} className="profile_pading">
                                <dt className="stockrpb_phone" > <span onClick={this.tel}> {this.state.buyerPhone}</span></dt>
                            </a>
                        </dl>
                    </div>

                    <div className="profile margint_1r">
                            {/*
                                <dl className="white toico">
                                    <a href={"stock.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id+ "&day=" + daydate} className="profile_pading">
                                        <dt className="stockrpb_name">库存</dt>
                                    </a>
                                </dl>
                                <dl className="white toico">
                                    <a href={"purchase.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id+ "&day=" + daydate} className="profile_pading">
                                        <dt className="stockrpb_name">进货</dt>
                                    </a>
                                </dl>
                            */}
                            <dl className="white toico">
                                <a onClick={this.remark} className="profile_pading" href="javascript:void(0)" >
                                    <dt className="stockrpb_name">备注</dt>
                                </a>
                            </dl>
                    </div>
                    {/*
                        <div className="modalRemark">
                            <label className="remark-tle">备注</label>
                            <div className="remark_box">
                                <textarea id="textarea" className="remark_input" >

                                </textarea>
                            </div>
                        </div>
                    */}



                    <footer className="white index-nav">
                        <ul className="wd-nav">
                            <li className="client for_gaq" id="singintp" ref="singintp">
                                <a href={"signin.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate}>
                                    <p className="footer-action-icon icon-dynamic4"></p>
                                    <h2 className="signintp">签到</h2>
                                </a>
                            </li>
                            <li className="product for_gaq" id="toproduct" ref="toproduct">
                                <a onClick={this.remark} href="javascript:void(0)">
                                    <p className="footer-action-icon icon-dynamic5"></p>
                                    <h2>备注</h2>
                                </a>
                            </li>
                            <li className="myprofild for_gaq">
                                <a href={"historyrecord.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id+ "&day=" + daydate+"&custtomertype=2"}>
                                    <p className="footer-action-icon icon-dynamic6"></p>
                                    <h2>来访纪录</h2>
                                </a>
                                <em>{visitsNumber}</em>
                            </li>
                        </ul>
                    </footer>
                </div>
            </div>

        )

    }

});







ReactDOM.render(
    <CustomerDetailsShow />,
    document.getElementById('conter')
);
