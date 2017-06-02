import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'

//import { Modal, Button, WhiteSpace, WingBlank } from 'antd-mobile/lib/';
var url = "/otcdyanmic/customer.do";

var Planreviewmain = React.createClass({
    getInitialState: function () {
        return {
            Y_login: true,  //是否登录  
            Planreviewtype: "list",
            dateid: ""
        };
    },

    componentDidMount: function () {
        var $this = this
        this.pubsub_token = PubSub.subscribe('changtype', function (topic, newItem) {
            $this.setState({
                Planreviewtype: newItem.Kpishowtype,  //显示方式
                dateid: newItem.dateid
            });
        });
    },
    componentWillUnmount: function () {
        PubSub.unsubscribe(this.pubsub_token);
    },
    render: function () {
        if (this.state.Planreviewtype == "list") {

            return (
                <div>

                    <Planreviewlist />
                </div>
            )

        }
        if (this.state.Planreviewtype == "Planreview") {

            return (
                <div>

                    <Planreview dateid={this.state.dateid} />
                </div>
            )

        }

        else {
            return (
                <div>

                    {Planreviewlist}
                </div>
            )
        }
    }
});

//审核人列表
var Planreviewlist = React.createClass({
    getInitialState: function () {
        return {
            value: '',
            isload: true,
            moreload: false,
            page: "",
            isnextpage: "",
            referrer: topreurl("index.html"), //上一页
            isclick: true,
            json: []
        };
    },
    componentDidMount: function () {
        var $this = this
        this.getlist();

    },
    /*
     查询员工需审核计划
    */
    getlist: function () {
        var $this = this
        var showbox = this.refs.content;
        var referrer = this.state.referrer;
        var current_year = gettoday().currYear; //当前年份
        var current_month = parseInt(gettoday().currmonth);  //当前月份
        var lastday = getLastDay(current_year, current_month); //获取当前月份最后一天
        var startTime = current_year + "-" + current_month + "-01"; //开始时间
        var endTime = current_year + "-" + current_month + "-" + lastday; //结束时间
        //alert(current_year+"-"+current_month);
        //查询员工需审核计划ajax
        var object = new Object();
        object.controlType = "queryAll";
        object.startTime = startTime //startTime;
        object.endTime = endTime //endTime;
        ajaxFn(object, $this, function (data) {
            console.log("获取员工审核计划成功");
            this.setState({
                json: data.map.list,
            });
        }, "/otcdyanmic/employee.do", showbox, referrer)

        //查询员工需审核计划ajax结束
    },
    toPlanreview: function (event) {
        //传数据
        var id = event.currentTarget.dataset.id;
        console.log("date_id:" + id)
        var Planreviewinfo = {
            Kpishowtype: "Planreview",
            dateid: id
        }
        PubSub.publish('changtype', Planreviewinfo);
    },
    noPlanreview: function () {

    },
    render: function () {
        var $this = this;

        return (
            <div className="planreview_main">
                <div className="profile white" id="pagenav">

                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    工作计划审核
        </div>
                <div ref="content">
                    <div className="" id="planreviewlist" ref="planreviewlist" >
                        {this.state.json.map(function (obj, i) {
                            var assess = obj.unaudit;
                            var isassess = obj.unaudit > 0 ? <em className="reviewico"><i className="fa fa-circle isassess"></i></em> : "";
                            var toPlanreviews = obj.unaudit > 0 ? $this.toPlanreview : $this.noPlanreview
                            return (
                                <div key={i} className="profile margint_1r">
                                    <dl className="white toico" id={"customerlist" + (i + 1)} data-id={obj.id} onClick={toPlanreviews} >

                                        <dt className="planreviewdt profile_pading">
                                            <h2 className="addplanNames">{obj.name}{isassess}</h2>
                                        </dt>

                                    </dl>
                                </div>
                            )
                        })
                        }
                    </div>




                </div>
            </div>



        );

    }

});






//审核页面
var Planreview = React.createClass({
    getInitialState: function () {
        return {
            value: '',
            isload: true,
            moreload: false,
            page: "",
            isnextpage: "",
            thisweek: "",
            thislastday: "",
            visible: false,
            selectday: geturl('selectday'),
            referrer: topreurl("client.html"), //上一页
            isbefore: false,
            isclick: true,
            canControl: "0",
            startTime: "",
            endTime: "",
            currentmonth: "",
            date_id: this.props.dateid
        };
    },
    componentWillMount: function () {
        //获取开始结束时间
        var current_year = gettoday().currYear; //当前年份
        var current_month = parseInt(gettoday().currmonth);  //当前月份
        var lastday = getLastDay(current_year, current_month); //获取当前月份最后一天
        var startTime = current_year + "-" + current_month + "-01"; //开始时间
        var endTime = current_year + "-" + current_month + "-" + lastday; //结束时间

        this.setState({
            startTime: startTime,
            endTime: endTime,
            currentmonth: current_year + "-" + current_month
        })
        //获取开始结束时间end
    },

    componentDidMount: function () {
        var $this = this
        var dateid = this.props.dateid;
        var currYear = (new Date()).getFullYear();
        var currmonth = addzerro((new Date()).getMonth() + 1);
        var currday = addzerro((new Date()).getDate());
        var currdate = gettoday().currdate;  //当前日期

        // Mycalendar(currYear, currmonth, currday);

        var currdate = gettoday().currdate;


        console.log("dateid1:" + this.state.date_id)

        //获取数据
        this.getPlanreviewlist();
        // console.log(currdate)



    },
    toreferrer: function () {
        setTimeout(function () {
            var Planreviewinfo = {
                'Kpishowtype': "list",
            }
            PubSub.publish('changtype', Planreviewinfo);
        }, 320)

    },
    /*
    获取未审核计划列表
   */
    getPlanreviewlist: function () {
        var $this = this
        var showbox = this.refs.content;
        var referrer = "JavaScript:this.toreferrer()";
        var current_year = gettoday().currYear; //当前年份
        var current_month = parseInt(gettoday().currmonth);  //当前月份
        var lastday = getLastDay(current_year, current_month); //获取当前月份最后一天
        var startTime = current_year + "-" + current_month + "-01"; //开始时间
        var endTime = current_year + "-" + current_month + "-" + lastday; //结束时间

        //alert(current_year+"-"+current_month);
        //获取未审核计划列表ajax
        var object = new Object();
        object.controlType = "auditList";
        object.pageSize = 999;
        object.pageNumber = 1;
        object.employee_id = this.state.date_id;
        object.startTime = startTime;
        object.endTime = endTime;
        object.flag = "3";



        ajaxFn(object, $this, function (data) {
            console.log("获未审核计划列表成功");
            var a = [a];
            if (data.map.list != "" && data.map.list != null && data.map.list != undefined) {
                var clientdata = data.map.list;
                for (var i = 0; i < clientdata.length; i++) {
                    var coustom = isnull(clientdata[i].coustom); //拜访名
                    var palnday = parseInt(isnull(clientdata[i].day))
                    var palntime = isnull(clientdata[i].time)
                    var hours = isnull(clientdata[i].hours); //上午下午
                    var customer_type=(clientdata[i].customer_type=="1" ? "":"<img src='../images/mobile/16ls.png'>")
                    if (a.toString().indexOf(palnday) > -1) {
                        // console.log(palnday)
                        var clientlist1 = "";
                        clientlist1 += '<dl class="white infofile toico profile_pading">';
                        clientlist1 += '<dt class="plandt">';
                        clientlist1 += '<div class="plantype">'+customer_type+'</div>';
                        clientlist1 += '<h2 class="plan_name">' + coustom + '</h2>';
                        clientlist1 += '</dt>';
                        clientlist1 += '</dl>';
                        $("#plan_" + palnday).append(clientlist1);
                    }
                    if (a.toString().indexOf(palnday) == -1) {  //不存在
                        a.push(palnday);
                        var clientlist2 = "";
                        clientlist2 += ' <h1 class="Planreviewtime">' + palntime + '</h1>';
                        clientlist2 += '<div class="profile " id="plan_' + palnday + '">'
                        clientlist2 += '<dl class="white infofile toico profile_pading">';
                        clientlist2 += '<dt class="plandt">';
                        clientlist2 += '<div class="plantype">'+customer_type+'</div>';
                        clientlist2 += '<h2 class="plan_name">' + coustom + '</h2>';
                        clientlist2 += '</dt>';
                        clientlist2 += '</dl>';
                        clientlist2 += '</div>';
                        $("#planlist").append(clientlist2);
                    }
                }

            }
        }, "/otcdyanmic/visitPlan.do", showbox, referrer)

        //获取未审核计划列表ajax结束
    },
    /*
   提交驳回
  */
    submitreject: function (flag, text) {
        var $this = this
        var showbox = this.refs.content;
        var referrer = "JavaScript:this.toreferrer()";

        //提交驳回ajax
        var object = new Object();
        object.controlType = "audit";
        object.employee_id = this.state.date_id; //用户id
        object.startTime = this.state.startTime; //开始时间
        object.endTime = this.state.endTime;   //结束时间
        object.planMonth = this.state.currentmonth //当前年月
        object.flag = flag; //2为驳回或1为通过
        if (flag != "1") {
            object.opinion = text  //驳回原因
        }
        var tiptext = flag == "1" ? "提交审核计划成功" : "提交驳回成功"


        ajaxFn(object, $this, function (data) {
            console.log("提交驳回成功");
            layer.open({
                shade: false,
                content: tiptext,
                skin: 'msg',
                className: 'tip',
                time: 3 //3秒后自动关闭
            });
            setTimeout(function () {
                $this.toreferrer()  //跳转到审核列表
            }, 3000)
            $this.setState({
                isclick: true, //允许点击
                isload: false,  //去除加载
            })
        }, "/otcdyanmic/visitPlan.do", showbox, referrer)

        //提交驳回ajax结束
    },
    /*  驳回 */
    reviewback: function () {
        var text = '<div class="Planreviewtip"><textarea type="textarea" rows="4" class="ant-input" placeholder="请输入驳回原因"></textarea></div> '
        var $this = this;
        layer1.closeAll();
        
        layer.open({
            title: ['驳回操作', 'border-bottom: 1px solid #eee;font-size:1.4rem;height:3.2rem; line-height:3.2rem'], //第二个参数可以自定义标题的样式   
            shade: false,
            content: text,
           
            className: 'revietip',
            btn: ['确认', '取消'],
            yes: function () {
                /* 提交驳回审核  */
                var text = $(".ant-input").val();

                if (text == "" && text.length <= 0) {
                  
                    layer1.open({
                        shade: false,
                        content: '请输入驳回原因！',
                        skin: 'msg',
                        className: 'tip',
                        anim: 'up',
                        time: 1.5 //3秒后自动关闭
                    });
                }
                else {

                    if ($this.state.isclick) {
                        $this.setState({
                            isclick: false, //禁止点击
                            isload: true,  //正在加载
                        })
                        ajaxdong("正在提交驳回信息...", $this);
                        $("*").blur()
                        $this.submitreject("2", text)
                    }

                }
                /* 提交驳回审核结束  */
            },
            no: function () {
                $("*").blur()
                $("#Planreviewbtn").show();

            }

        });
        if (gopage == "mobile") {
            
              $(".layermchild").delegate('.layermend', 'touchend', function () {
                 
                    $("#Planreviewbtn").show();
              })
            $(".Planreviewtip").delegate('.ant-input', 'focus', function () {
                $(".layermmain").css({ 'position': 'fixed', "top": "4rem", 'bottom': '0rem', "margin": "auto" });
                $("#Planreviewbtn").hide();
            }).delegate('.ant-input', 'blur', function () {
                $("#Planreviewbtn").show();
                $(".layermmain").css({ 'position': 'fixed', 'bottom': '0rem', "top": "0rem", "margin": "auto" });
            });
        }


    },


    /*同意  */
    toreviewajax: function () {
          var $this=this;
            layer.open({
            title: ['温馨提醒', 'border-bottom: 1px solid #eee;font-size:1.4rem;height:3.2rem; line-height:3.2rem'], //第二个参数可以自定义标题的样式   
            shade: false,
            content: "<h2>确认提交审核计划？</h2>",
            skin: 'msg',
            className: 'revietip',
            btn: ['确认', '取消'],
            yes: function (){
                /* 提交审核  */
                if ($this.state.isclick){
            $this.setState({
                isclick: false, //禁止点击
                isload: true,  //正在加载
            })

                 ajaxdong("正在提交工作计划审核...", $this);
                $this.submitreject("1")
                 }
                /* 提交审核结束  */
            }
        });
           
       

    },

    render: function () {

        return (
            <div className="client_main">
                <div className="profile white" id="pagenav">

                    <span className="toleft" onTouchEnd={this.toreferrer}> <a href="javascript:void(0)"></a></span>
                    工作计划审核
                </div>
                <div ref="content">




                    <div className="profile" id="planlist" ref="client" >
                    </div>






                    <div id="Planreviewbtn">
                        <button className="fn-btn review_btn" id="reviewbtnback" onTouchEnd={this.reviewback}>驳回</button>
                        <button className="fn-btn review_btn" id="toreviewbtn" onTouchEnd={this.toreviewajax}>同意</button>
                    </div>

                </div>
            </div>



        );

    }
});



ReactDOM.render(
    <Planreviewmain />,
    document.getElementById('conter')
);




