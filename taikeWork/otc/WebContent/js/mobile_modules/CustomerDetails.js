import React from 'react'
import ReactDOM from 'react-dom'
import Badge from 'antd-mobile/lib/badge';
import Userfooter from '../../js/mobile_modules/footer.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
var url = "/otcdyanmic/customerMobile.do";
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
            custom_id: geturl('custom_id'), //custom_id
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
            isnosigninout: false,//是否存在未签出的拜访计划！
            customday: "" //判断门店拜访时间  today：当天   before 当天之前  after 当天之后
        };
    },
    componentWillMount: function () {
        /*
         *
         判断门店拜访时间是不是当日
         *
         */
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
            this.setState({
                customday: "after"
            })
        }
        //小于当日
        if (Date.parse(listdate) < Date.parse(currdatetime)) {
            this.setState({
                customday: "before"
            })
        }
        //等于当日
        if (Date.parse(listdate) == Date.parse(currdatetime)) {
            this.setState({
                customday: "today"
            })
        }


    },
    componentDidMount: function () {
        this.issingin();
        this.getinfo();
    },

    //获取初始数据
    getinfo: function () {
        var $this = this;
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "getCustomerInfo";
        object.id = this.state.custom_id;

        var showbox = this.refs.CustDetailMain;
        var referrer = this.state.referrer;
        //获取门店初始数据ajax
        ajaxFn(object, $this, function (data) {
            console.log("获取门店初始数据成功")
            if (data.map.customer != "" && data.map.customer != null && data.map.customer != undefined) {

                var visitsNumber =isnull(data.map.customer.visitsNumber)==""?0:data.map.customer.visitsNumber;
                this.setState({
                    visitsNumber: visitsNumber,
                    realName: isnull(data.map.customer.realName),
                    attributesName: isnull(data.map.customer.attributesName),
                    address: isnull(data.map.customer.address),
                    buyerPhone: isnull(data.map.customer.buyerPhone),
                    areaName: isnull(data.map.customer.areaName),
                    id: isnull(data.map.customer.id),
                    customerName: isnull(data.map.customer.customerName),
                    personInChargeName: isnull(data.map.customer.personInChargeName),
                    buyer: isnull(data.map.customer.buyer)
                });

            }
        }, url, showbox, referrer)
        //获取门店初始数据ajax结束
    },

    //点击拨打电话
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


    //判断是否签到
    issingin: function () {
        var $this = this;
        //判断是否签入
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "checkSign";
        object.plan_id = this.state.plan_id;
        var showbox = this.refs.CustDetailMain;
        var referrer = this.state.referrer;

        //获取签到信息ajax
        ajaxFn(object, $this, function (data) {
            console.log("获取签到信息成功")
            var signType = data.map.signType;
            this.setState({
                signType: signType
            });
        }, issigninurl, showbox, referrer)
    },

    //获取签到状态
    signintypes: function () {
        var signintypes = this.state.signType;
        var sigintext = "";
        var siginico = "";
        if (signintypes == "signIn") {
            sigintext = "签到"
            siginico = "icon-dynamic_in"
        }
        if (signintypes == "signOut") {
            sigintext = "签出"
            siginico = "icon-dynamic_out"
        }
        if (signintypes == "alreadySign") {
            sigintext = "已签出"
            siginico = "icon-dynamic_out"
        }
        var signinOptions = {
            sigintext: sigintext,
            siginico: siginico
        };
        return signinOptions;
    },

    //通过签到状态判断签到链接
    istosignin: function () {

        //today：当天   before 当天之前  after 当天之后
        var istodays = this.state.customday;
        var text = this.signintypes().sigintext;
        var signintypes = this.state.signType;
        var signinlink = "signin.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate

        switch (istodays) {
            case ("today"):
                if (signintypes == "signIn") {
                 window.location.href = signinlink;
                }
                if (signintypes == "signOut"){
                      window.location.href = signinlink;
                }
                if (signintypes == "alreadySign") {
                   layer.open({
                    shade: false,
                    content: '门店已经签出，当日不能再签到签出',
                    skin: 'msg',
                    className: 'tip',
                    time: 2 //2秒后自动关闭
                });
                }
               
                break;
            case ("before"):
                layer.open({
                    shade: false,
                    content: '门店已经过期，不能' + text,
                    skin: 'msg',
                    className: 'tip',
                    time: 2 //2秒后自动关闭
                });
                break;
            case ("after"):
                layer.open({
                    shade: false,
                    content: '只有当天的门店才能' + text,
                    skin: 'msg',
                    className: 'tip',
                    time: 2 //2秒后自动关闭
                });
                break;
        }
    },
    /*
   判断能否盘核产品
    */
    istotestproduct: function () {
        var istodays = this.state.customday;
        var signintypes = this.state.signType;
        var testproductLink = "testproducts.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&singintype=" + this.state.signType + "&day=" + daydate

        switch (istodays) {
            case ("today"):
                if (signintypes == "signIn") {
                    layer.open({
                        shade: false,
                        content: '你还没有签到，不能考核产品',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                }
                if (signintypes == "signOut") {
                    window.location.href = testproductLink;
                }
                if (signintypes == "alreadySign") {
                    window.location.href = testproductLink;
                }
                break;
            case ("before"):
                if (signintypes == "alreadySign") {
                    window.location.href = testproductLink;
                } else {
                    layer.open({
                        shade: false,
                        content: '门店已经过期，不能考核产品',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                }
                break;
            case ("after"):
                if (signintypes == "alreadySign") {
                    window.location.href = testproductLink;
                } else {
                    layer.open({
                        shade: false,
                        content: '只有当天的门店产品才能考核',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                }
                break;
        }

    },

    render: function () {
        return (
            <div className="CustDetails">
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    门店详情
                </div>
                <div className="CustDetailMain" ref="CustDetailMain">
                    <div className="profile">
                        <dl className="white profile_pading ">
                            <dt className="customerphoto"><img src={"../images/mobile/u45.png"} /></dt>
                            <dd className="customer_info">
                                <h2>{this.state.customerName}</h2>
                                <p className="Customer_Attrbt">属性: {this.state.attributesName}</p>
                            </dd>
                        </dl>
                        <dl className="white  toico">
                            <a href={"Storelocation.html?address=" + this.state.address + "&name=" + this.state.customerName + "&custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate} className="profile_pading">
                                <dt className="customer_dress">

                                    {this.state.address}

                                </dt>
                            </a>
                        </dl>
                    </div>
                    <h1 className="customer_title">负责代表</h1>
                    <div className="profile ">
                        <dl className="white profile_pading toico principal_name">
                            <dt className="chainrpb_name">{this.state.realName}</dt>
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
                            <a href={"infomationedit.html?updatetype=customerInfo&update=customerName&updateval=" + this.state.buyer + "&customerid=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate} className="profile_pading">
                                <dt className="stockrpb_name">{this.state.buyer}</dt>
                            </a>
                        </dl>
                        <dl className="white  toico principal_phone">
                            <a href={"infomationedit.html?updatetype=customerInfo&update=customerphone&updateval=" + this.state.buyerPhone + "&customerid=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate} className="profile_pading">

                                <dt className="stockrpb_phone" > <span onClick={this.tel}> {this.state.buyerPhone}</span></dt>
                            </a>
                        </dl>
                    </div>

                    <div className="profile margint_1r">
                        <dl className="white toico">
                            <a href={"stock.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate} className="profile_pading">
                                <dt className="stockrpb_name">库存</dt>
                            </a>
                        </dl>
                        <dl className="white toico">
                            <a href={"purchase.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate} className="profile_pading">
                                <dt className="stockrpb_name">进货</dt>
                            </a>
                        </dl>
                        <dl className="white toico">
                            <a href={"sale.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate} className="profile_pading">
                                <dt className="stockrpb_name">销量</dt>
                            </a>
                        </dl>
                        {/*
                    <dl className="white toico">
                        <a href={"javascript:void(0)"} className="profile_pading" onTouchStart={this.remarkshow}>
                            <dt className="stockrpb_name">备注</dt>

                        </a>
                    </dl>
                   */ }
                    </div>

                    <footer className="white index-nav">
                        <ul className="wd-nav">
                            <li className="client for_gaq" id="singintp" ref="singintp" onTouchEnd={this.istosignin}>
                                {/*<a href={"signin.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate}>*/}
                                <p className={"footer-action-icon " + this.signintypes().siginico}></p>
                                <h2 className="signintp">{this.signintypes().sigintext}</h2>

                            </li>
                            <li className="product for_gaq" id="toproduct" ref="toproduct" onTouchEnd={this.istotestproduct}>
                                <p className="footer-action-icon icon-dynamic5"></p>
                                <h2>考核盘点</h2>
                            </li>
                            <li className="myprofild for_gaq">
                                <a href={"historyrecord.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate}>
                                    <p className="footer-action-icon icon-dynamic6"></p>
                                    <h2>来访纪录</h2>
                                </a>
                               {/*this.state.visitsNumber==0?"":<em>{this.state.visitsNumber}</em>*/} 
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
