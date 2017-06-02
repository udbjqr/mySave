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
var parenturl = "";
if(custtomertype=="2"){ //商业客户 
parenturl = "BusinessCustomers.html?chain_id=" + geturl('custom_id') + "&plan_id=" + geturl('plan_id')+ "&day=" + daydate //上一页
}
else{ //门店客户
parenturl = "CustomerDetails.html?custom_id=" + geturl('custom_id') + "&plan_id=" + geturl('plan_id')+ "&day=" + daydate //上一页
}

var Historyrecord = React.createClass({
    getInitialState: function () {
        return {
            loginY: false,       //是否登录
            referrer: topreurl(parenturl), //上一页
            custom_id: geturl('custom_id'),
            plan_id: geturl('plan_id'),
            
        };
    },



    componentDidMount: function () {

        this.getinfo();
    },
    //获取初始数据
    getinfo: function () {
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "query";
        object.pageSize = "10";
        object.pageNumber = "1";
        object.customer_id = this.state.custom_id;
        $.ajax({
            url: url,
            data: { paramMap: JSON.stringify(object) },
            type: "post",
            dataType: "json",
            success: function (data) {
                if (this.isMounted()) {
                    if (data != "" && data != null && data != undefined) {
                        //获取库存信息成功
                        if (data.success == true) {
                            console.log("获取获取信息成功")

                            var clientlist = "";

                            if (data.map.list != "" && data.map.list != null && data.map.list != undefined) {
                                var clientdata = data.map.list;
                                for (var i = 0; i < clientdata.length; i++) {
                                    var visitName = isnull(clientdata[i].visitName);
                                    var visits_time = dateformdate(clientdata[i].visits_time, 2);
                                    var Time = dateformdate(clientdata[i].visits_time, 5);
                                    var weekold = isnull(clientdata[i].dayWeek);
                                    var visits_id = isnull(clientdata[i].visits_id);
                                    //获取星期

                                    var week = weekold.replace("0", "日").replace("1", "一").replace("2", "二").replace("3", "三").replace("4", "四").replace("5", "五").replace("6", "六")

                                    clientlist += ' <dl class="white toico margint_1r">';
                                    clientlist += '<a href="corditem.html?custom_id=' + this.state.custom_id + '&plan_id=' + this.state.plan_id + '&visits_id=' + visits_id+ '&day='+ daydate +"&custtomertype="+custtomertype+'" class="profile_pading">'
                                    clientlist += '<dt class="cord_time">';
                                    clientlist += visits_time + '  星期' + week + "<em>" + Time + "</em>";
                                    clientlist += '</dt>';
                                    clientlist += '</a>';
                                    clientlist += '</dl>';
                                }


                                this.refs.Historyrecord_list.innerHTML = clientlist
                            }
                            else {
                                this.refs.Historyrecord_list.innerHTML = Datafaile("暂时没有数据", "", "", "", "0")
                            }


                        }
                        //获取获取信息失败
                        if (data.success == false) {
                            
                            //未登录
                            if (data.errorCode == "1") {
                                var dodatate = generateMixed(6)
                                window.location.href = wxurl(dodatate);
                            }
                            //未登录结束


                            this.refs.Historyrecord_list.innerHTML = Datafailed;


                            console.log("获取获取信息失败:" + data.msg)
                        }
                    }

                } // this.isMounted() End
            }.bind(this),
            error: function (jqXHR, textStatus, errorThrown) {
                if (this.isMounted()) {
                    this.refs.Historyrecord_list.innerHTML = Datafailed1;
                    console.log("获取获取信息失败：网络错误")
                }
            }.bind(this)
        });
    },
    render: function () {

        return (
            <div>
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    历史来访纪录
                </div>
                <div className="profile" ref="Historyrecord_list">

                </div>
            </div>

        )

    }

});

ReactDOM.render(
    <Historyrecord />,
    document.getElementById('conter')
);
