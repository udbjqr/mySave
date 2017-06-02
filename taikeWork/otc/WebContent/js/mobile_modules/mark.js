import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import Userfooter from '../../js/mobile_modules/userfooter.js'
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import List from 'antd-mobile/lib/list';
import TextareaItem from 'antd-mobile/lib/textarea-item';
import Radio from 'antd-mobile/lib/radio';
const RadioItem = Radio.RadioItem;
import 'antd-mobile/lib/list/style/index.css';
import 'antd-mobile/lib/textarea-item/style/index.css';
import 'antd-mobile/lib/radio/style/index.css';

var planid=geturl('planId'); //
var totype=geturl('totype'); //判断是标注还是请假页面
var Markmain = React.createClass({
    getInitialState: function () {
        return {
            showtype: totype,
            referrer: topreurl("client.html"), //上一页
        };
    },
    componentDidMount: function () {
        var $this = this
        this.pubsub_token = PubSub.subscribe('changtype', function (topic, newItem) {
            $this.setState({
                showtype: newItem.showtype  //显示方式
            });
        });
    },
    componentWillUnmount: function () {
        PubSub.unsubscribe(this.pubsub_token);
    },
    render: function () {

        if (this.state.showtype == "mark" || this.state.showtype == "") {

            return (
                <QueueAnim>
                    <div key="1">
                        <Mark />
                    </div>
                </QueueAnim>
            )
        }
         if (this.state.showtype == "Leave") {

          return (
                <QueueAnim>
                    <div key="1">
                        <Leave />
                    </div>
                </QueueAnim>
            )
         }
        
    }
})






/*

*
*
标记页面

*
*/

var Mark = React.createClass({
    getInitialState: function () {
        return {
            isload: false,
            isclick: true,  //设置按钮是否可以点击 防止提交时多次点击按钮
            referrer: topreurl("client.html"), //上一页
            markvalue: "", //1 门店关门 2 门店搬迁
            marcks: "",  //备注

        };
    },

    componentDidMount: function () {
        var $this = this;

    },/* 单击选择  */
    select(e) {
        var val = e.currentTarget.dataset.type

        var id = e.currentTarget.getAttribute("id");
        var ischeck = $("#" + id).attr("data-checked")
        if (ischeck == "true") {

            this.setState({
                markvalue: ""
            })
            $("#" + id).attr("data-checked", "false").removeClass("check");

        }
        if (ischeck == "false") {
            var datatype = $("#" + id).attr("data-type")
            this.setState({
                markvalue: datatype
            })
            $("#" + id).attr("data-checked", "true").addClass("check").siblings("#mark dl").removeClass("check").attr("data-checked", "false");
        }


    },/* 获取备注值 */
    changemaks: function (val) {
        this.setState({
            marcks: val,
        })
    },/* 提交标注  */
    check: function () {
        if (this.state.markvalue == "") {
            layer.open({
                shade: false,
                content: '请选择标记',
                skin: 'msg',
                className: 'tip',
                time: 3 //3秒后自动关闭
            });
        }
        else {
            var $this = this;
            this.setState({  //禁止点击
                isclick: false,
                isload: true,  //正在加载
            })
            ajaxdong("正在保存信息...", this);
             var object = new Object();
            object.controlType = "addMarkContext";
            object.planId=planid;
            object.mark_type=this.state.markvalue;
            var showbox = this.refs.markcontent;
            var referrer = this.state.referrer;
            
            ajaxFn(object, $this, function (data) {
                console.log("用户信息保存成功")
                layer.open({
                    shade: false,
                    content: '用户信息保存成功',
                    skin: 'msg',
                    className: 'tip',
                    time: 2 //2秒后自动关闭
                });
                setTimeout(function () { window.location.href = "client.html" }, 2000);
                $this.setState({
                    isclick: true, //允许点击
                    isload: false,  //去除加载
                })
            }, "/otcdyanmic/visitMobilePlan.do", showbox, referrer)
            
        }
    },
    render: function () {


        return (
            <div className="mark" >
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    标记{this.state.marcks}
                </div>
                <div ref="markcontent">
                    <div className="profile margint_1r " id="mark">
                        <dl className="white infofile" id="tomak1" data-checked="false" data-type="1" onTouchEnd={this.select}>
                            <dt className="infovideoimg">
                                <h2>门店关门</h2>
                            </dt>
                            <dd ref="pharmacy1" data-check="false" className="isselect">

                            </dd>
                        </dl>
                        <dl className="white infofile" data-type="2" id="tomak2" data-checked="false" onTouchEnd={this.select}>
                            <dt className="infovideoimg">
                                <h2>门店搬迁</h2>
                            </dt>
                            <dd ref="pharmacy1" data-check="false" className="isselect">

                            </dd>
                        </dl>
                        <dl className="white infofile" data-type="3" id="tomak3" data-checked="false" onTouchEnd={this.select}>
                            <dt className="infovideoimg">
                                <h2>开会</h2>
                            </dt>
                            <dd ref="pharmacy1" data-check="false" className="isselect">

                            </dd>
                        </dl>
                       {/*
                           <h1 className="marksTitle">备注</h1>
                        <TextareaItem
                            placeholder="请输入"
                            data-seed="logId"
                            rows="5"
                            clear="true"
                            onChange={this.changemaks}
                            />
                        */}

                        <button className="fn-btn" id="addpalnBtn" onTouchStart={this.check}>提交</button>
                    </div>
                </div>

            </div>
        );
    }
});


/*

*
*
请假页面

*
*/

var Leave = React.createClass({
    getInitialState: function () {
        return {
            isload: false,
            isclick: true,  //设置按钮是否可以点击 防止提交时多次点击按钮
            referrer: topreurl("client.html"), //上一页
            Leavevalue: "", //1 门店关门 2 门店搬迁
            marcks: "",  //备注

        };
    },

    componentDidMount: function () {
        var $this = this;

    },/* 单击选择  */
    select(e) {
        var val = e.currentTarget.dataset.type

        var id = e.currentTarget.getAttribute("id");
        var ischeck = $("#" + id).attr("data-checked")
        if (ischeck == "true") {

            this.setState({
                Leavevalue: ""
            })
            $("#" + id).attr("data-checked", "false").removeClass("check");

        }
        if (ischeck == "false") {
            var datatype = $("#" + id).attr("data-type")
            this.setState({
                Leavevalue: datatype
            })
            $("#" + id).attr("data-checked", "true").addClass("check").siblings("#mark dl").removeClass("check").attr("data-checked", "false");
        }


    },/* 获取备注值 */
    changemaks: function (val) {
        this.setState({
            marcks: val,
        })
    },/* 提交请假  */
    check: function () {
        if (this.state.Leavevalue == "") {
            layer.open({
                shade: false,
                content: '请选择标记',
                skin: 'msg',
                className: 'tip',
                time: 3 //3秒后自动关闭
            });
        }
        else {
            var $this = this;
            this.setState({  //禁止点击
                isclick: false,
                isload: true,  //正在加载
            })
            ajaxdong("正在保存信息...", this);
             var object = new Object();
            object.controlType = "addLeaveContext";
            object.planId=planid;
            object.leave_type=this.state.Leavevalue;
            var showbox = this.refs.markcontent;
            var referrer = this.state.referrer;
            
            ajaxFn(object, $this, function (data) {
                console.log("用户信息保存成功")
                layer.open({
                    shade: false,
                    content: '用户信息保存成功',
                    skin: 'msg',
                    className: 'tip',
                    time: 2 //2秒后自动关闭
                });
                setTimeout(function () { window.location.href = "client.html" }, 2000);
                $this.setState({
                    isclick: true, //允许点击
                    isload: false,  //去除加载
                })
            }, "/otcdyanmic/visitMobilePlan.do", showbox, referrer)
            
        }
    },
    render: function () {


        return (
            <div className="mark" >
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    请假{this.state.marcks}
                </div>
                <div ref="markcontent">
                    <div className="profile margint_1r " id="mark">
                        <dl className="white infofile" id="tomak1" data-checked="false" data-type="1" onTouchEnd={this.select}>
                            <dt className="infovideoimg">
                                <h2>年假</h2>
                            </dt>
                            <dd ref="pharmacy1" data-check="false" className="isselect">

                            </dd>
                        </dl>
                        <dl className="white infofile" data-type="2" id="tomak2" data-checked="false" onTouchEnd={this.select}>
                            <dt className="infovideoimg">
                                <h2>事假</h2>
                            </dt>
                            <dd ref="pharmacy1" data-check="false" className="isselect">

                            </dd>
                        </dl>
                        <dl className="white infofile" data-type="3" id="tomak3" data-checked="false" onTouchEnd={this.select}>
                            <dt className="infovideoimg">
                                <h2>病假</h2>
                            </dt>
                            <dd ref="pharmacy1" data-check="false" className="isselect">

                            </dd>
                        </dl>
                        <dl className="white infofile" data-type="4" id="tomak4" data-checked="false" onTouchEnd={this.select}>
                            <dt className="infovideoimg">
                                <h2>退休</h2>
                            </dt>
                            <dd ref="pharmacy1" data-check="false" className="isselect">

                            </dd>
                        </dl>
                        <dl className="white infofile" data-type="5" id="tomak5" data-checked="false" onTouchEnd={this.select}>
                            <dt className="infovideoimg">
                                <h2>南华大药房</h2>
                            </dt>
                            <dd ref="pharmacy1" data-check="false" className="isselect">

                            </dd>
                        </dl>
                        {/*
                            <h1 className="marksTitle">备注</h1>
                        <TextareaItem
                            placeholder="请输入"
                            data-seed="logId"
                            rows="5"
                            clear="true"
                            onChange={this.changemaks}
                            />
                        */}
                        <button className="fn-btn" id="addpalnBtn" onTouchStart={this.check}>提交</button>
                    </div>
                </div>

            </div>
        );
    }
});
ReactDOM.render(
    <Markmain />,
    document.getElementById('conter')
);




