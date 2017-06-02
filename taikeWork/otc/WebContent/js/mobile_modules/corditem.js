import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
var url = "/otcdyanmic/appraisals.do";

var currturl = window.location.href;  //获取当前url
var daydate = geturl('day'); //走访时间
var custtomertype=geturl('custtomertype');
var parenturl = "historyrecord.html?custom_id=" + geturl('custom_id') + "&plan_id=" + geturl('plan_id')+ "&day=" + daydate+"&custtomertype="+custtomertype ;
var Corditem = React.createClass({
    getInitialState: function () {
        return {
            loginY: false,       //是否登录
            referrer: topreurl(parenturl), //上一页
            custom_id: geturl('custom_id'),
            plan_id: geturl('plan_id'),
            visits_id: geturl("visits_id"),
            visits_time: "",
            dayWeek: "",
            sign_in_time: "",
            sign_out_time: ""
        };
    },



    componentDidMount: function () {

        this.getinfo();
    },

    getinfo: function () {
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "load";
        object.visits_id = this.state.visits_id;
        $.ajax({
            url: url,
            data: { paramMap: JSON.stringify(object) },
            type: "post",
            dataType: "json",
            success: function (data) {
                if (this.isMounted()) {
                    if (data != "" && data != null && data != undefined) {
                        //获取信息成功
                        if (data.success == true) {
                            console.log("获取信息成功")
                            //设置属性
                            var dayWeek = isnull(data.map.visitObject.dayWeek);
                            var week = dayWeek.replace("0", "日").replace("1", "一").replace("2", "二").replace("3", "三").replace("4", "四").replace("5", "五").replace("6", "六")
                            this.setState({
                                visits_time: dateformdate(data.map.visitObject.visits_time, 2),
                                dayWeek: week,
                                sign_in_time: dateformdate(data.map.visitObject.sign_in_time, 4),
                                sign_out_time: dateformdate(data.map.visitObject.sign_out_time, 4),
                            });
                          //  var remark = isnull(data.map.visitObject.remark) == "" ? "无" : isnull(data.map.visitObject.remark);

                            //this.refs.remark.innerHTML = remark
                            if (data.map.list != "" && data.map.list != null && data.map.list != undefined) {
                                var historylist = "";
                                var historydata = data.map.list;
                                for (var i = 0; i < historydata.length; i++) {
                                    var goods_name = isnull(historydata[i].goods_name);             //产品名
                                    var purchase_source = isnull(historydata[i].purchase_source); //进货来源
                                    var display_surface = isnull(historydata[i].display_surface); // 陈列面
                                    var weighted_price = isnull(historydata[i].weighted_price);   //加价权
                                    var purchase_number = isnull(historydata[i].purchase_number); //进货数量
                                    var tag_price = isnull(historydata[i].tag_price);              //标签价
                                    var image_urls = isnullimg(todoimg(historydata[i].image_urls));            //图片
                                    var display_number = isnull(historydata[i].display_number);     //陈列数
                                    var real_stock = isnull(historydata[i].real_stock);             //实际库存
                                    var remark = isnull(historydata[i].remark);   
                                    var supplier=isnull(historydata[i].supplier); //供应商
                                     var specification=isnull(historydata[i].specification); //规格
                                     var batch_number=isnull(historydata[i].batch_number); //批号
                                     if(remark==""){
                                      remark="无"
                                     }
                                    historylist += '<h2 class="productTitle white">' + goods_name + '</h2>';
                                    historylist += '<p class="productsupplier white">' + supplier + '</p>';
                                   
                                    historylist += '<dl class="white profile_pading">'
                                    historylist += '<dt class="corditem_photo">'
                                    historylist += '<img src="../' + image_urls + '"/>'
                                    historylist += '</dt>'
                                    historylist += '<dd class="corditem_info">'
                                    historylist += '<p class="corditem_info1">'
                                     
                                    historylist += '<em>进货数：<font class="red">' + purchase_number + '</font></em>'
                                    historylist += '<em>进货来源：' + purchase_source + '</em>'
                                    historylist += '<em>批号：</em>'
                                    
                                    historylist += '</p>'
                                    historylist += '</dd>'
                                    historylist += '</dl>'
                                    historylist += '<dl class="white profile_pading">'
                                    historylist += ' <dt class="corditem_detinfo">'
                                    historylist += '<div class="detinfo1">'
                                   
                                    historylist += ' <span>陈列面：<font class="red">' + display_surface + '</font></span>'
                                    historylist += '<span>陈列数：<font class="blue">' + display_number + '</font></span>'
                                    historylist += '<span>标签价：<font class="blue">' + tag_price + '</font></span>'
                                    historylist += ' </div>'
                                   
                                    historylist += '<div class="detinfo2">'
                                  //  historylist += ' <span>平均加权价：' + weighted_price + '</span>'
                                    historylist += ' <span>实际库存：<font class="blue">' + real_stock + '</font></span>'
                                    historylist += '</div>'
                                    historylist += '<p class="specification white">规格：' + specification + '</p>'
                                    historylist += ' </dt>'
                                    historylist += '</dl>'
                                     historylist += '<h1 class="cord_titles">备注：</h1>';
                                     historylist += ' <div class="profile remark">';
                                     historylist += '<dl class="white  profile_pading" >';
                                     historylist += '<dt ref="remark">'+remark+'</dt>';
                                     historylist += '</dl>';
                                     historylist += '</div>';
                                }

                                this.refs.productlist.innerHTML = historylist
                                /*
                        <h1 className="cord_title">备注</h1>

                <div className="profile remark">
                    <dl className="white  profile_pading" >
                        <dt ref="remark"></dt>
                    </dl>
                </div>
                                */


                            }
                            else {
                                this.refs.productlist.innerHTML = "<P class='nodata'>没有找到数据</p>"
                            }



                        }
                        //获取信息失败
                        if (data.success == false) {

                            //未登录
                            if (data.errorCode == "1") {
                                var dodatate = generateMixed(6)
                                window.location.href = wxurl(dodatate);
                            }
                            //未登录结束

                            //设置属性
                            console.log("获取信息失败")
                        }
                    }

                } // this.isMounted() End
            }.bind(this),
            error: function () {

                if (this.isMounted()) {
                    console.log("获取信息失败：网络错误")
                }
            }.bind(this)
        });

    },
    render: function () {

        return (
            <div>
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    纪录详情
                </div>
                <h1 className="cord_title">{this.state.visits_time}星期{this.state.dayWeek}</h1>
                <div className="profile signintp">
                    <dl className="white  profile_pading">
                        <dt>签到时间：</dt>
                        <dd><p className="signintime">{this.state.sign_in_time}</p></dd>
                    </dl>
                    <dl className="white  profile_pading">
                        <dt>签出时间：</dt>
                        <dd><p className="signintime">{this.state.sign_out_time}</p></dd>
                    </dl>
                </div>
                <h1 className="cord_title">考核产品</h1>

                <div className="profile" ref="productlist">





                </div>
               
            </div>

        )

    }

});

ReactDOM.render(
    <Corditem />,
    document.getElementById('conter')
);
