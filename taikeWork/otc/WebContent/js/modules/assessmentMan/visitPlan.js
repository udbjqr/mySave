
import React from 'react'
import MemberTabel from  '../react-utils/table'     /*表格组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import DatePicker from 'antd/lib/date-picker';      /*antd 年月选择*/
import Tabs from 'antd/lib/tabs';                   /*tabs 组件*/
import Pagination from 'antd/lib/pagination'                  /*antd 分页组件*/
import message from 'antd/lib/message'                  /*antd 提示组件*/
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import Select from 'antd/lib/select';/*antd select*/
const Option = Select.Option;
import Input from 'antd/lib/input'     /*表单*/
import '../../../less/tablePage.less'
const MonthPicker = DatePicker.MonthPicker;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;              /*antd 弹窗组件*/
import Badge from 'antd/lib/badge';
import Loading from '../react-utils/loading'         /*加载中组件*/
import Button from 'antd/lib/button'

var object = new Object();

/*通用表格页面*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/visitPlan.do') {
        var $this = this;
        $.ajax({
            type:"post",
            url:javaUrl,
            data:{paramMap:JSON.stringify(data)},
            dataType: "json",
            async:false,	//false 表示ajax执行完成之后在执行后面的代码
            success:function(data){
                if(!data.success){/*首先判断这个属性，错误在判断原因*/
                    switch(data.errorCode){
                        case  (1):
                            Modal.warning({title: '警告提示：',content:'获取当前登录用户信息失败，请重新登录！',onOk() {
                                window.location.href = 'login.html';
                            }});
                            break;
                        case  (2):
                            Modal.warning({title: '警告提示：',content: '此用户不存在或已禁用，请联系管理员！'});
                            break;
                        case  (3):
                            Modal.error({title: '错误提示：',content: '发生严重错误，请联系管理员！！'});
                            break;
                        case  (4):
                            Modal.error({title: '错误提示：',content: '发生严重错误，请联系管理员！！'});
                            break;
                        case  (5):
                            Modal.warning({title: '警告提示：',content: '当前用户没有此操作权限！'});
                            break;
                        case  (8):
                            Modal.warning({title: '警告提示：',content: '相关数据格式有误，请检查后重新填写！'});
                            break;
                        case  (9):
                            Modal.info({title: '提示：',content: '相关数据未填写完整，请检查！'});
                            break;
                        default:
                            Modal.warning({title: '警告提示：',content: data.msg});
                            break;
                    }
                }else{
                    callback.call($this,data);
                }
                $("#loading").addClass("none");
            },
            error(){
                $("#loading").addClass("none");
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }

        });
    },
    getInitialState:function(){
        var startTime = initDate();
        var endTime = initDate(false);

        return {
            dataTab : [],   /*表格数据*/
            pageNum:1,      /*页数默认选中*/
            showLine:20,	/*显示行数*/
            dataLen:0,		/*数据条数*/
            employee:[],        /*负责人*/
            startTime:startTime,     /*开始时间*/
            endTime:endTime,         /*结束时间*/
            thisId:'',           /*当前负责人ID*/
            modalVisible:false,      /*弹窗*/
            status:"请选择",        /*是否考核默认值*/
            isReason:false,          /*是否显示驳回原因栏*/
            opinion:'',              /*驳回原因*/
            estate:"3"               /*状态选择初始值*/
        };
    },
    componentWillMount:function(){
        /*请求头部负责人*/
        this.ajaxFn({"controlType":"queryAll","startTime":this.state.startTime,"endTime":this.state.endTime},function (data) {
            var key = (data.map.list[0].id) + "";
            this.setState({employee:data.map.list,thisId:key},function(){
                /*工作计划审核列表*/
                this.ajaxFn({"controlType":"auditList","pageSize":20,"pageNumber":1,"employee_id":key,"startTime":this.state.startTime,"endTime":this.state.endTime,"flag":this.state.estate},function (data) {
                    data.map.count == "0" ? message.warning("暂无可审核数据！") : message.success("加载完成！");
                    this.setState({
                        dataTab:data.map.list,
                        dataLen:data.map.count
                    });
                });
            });
        },'/otcdyanmic/employee.do');

    },/*跳页*/
    pageNumber(page){
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"auditList","pageSize":this.state.showLine,"pageNumber":page,"employee_id":this.state.thisId,"startTime":this.state.startTime,"endTime":this.state.endTime,"flag":this.state.estate},function (data) {
            this.setState({dataTab:data.map.list,pageNum:page});
        });
    },//保存时间范围，回调函数
    searchTime:function(sd,ed){
        if(sd){
            this.setState({startTime:sd});
        }else if(ed){
            this.setState({endTime:ed});
        };
    },/*条件搜索*/
    termSearch(){
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"queryAll","startTime":this.state.startTime,"endTime":this.state.endTime},function (data) {
            this.setState({employee:data.map.list},function(){
                /*工作计划审核列表*/
                this.ajaxFn({"controlType":"auditList","pageSize":20,"pageNumber":1,"employee_id":this.state.thisId,"startTime":this.state.startTime,"endTime":this.state.endTime,"flag":this.state.estate},function (data) {
                    data.map.count == "0" ? message.warning("暂无可审核数据！") : message.success("加载完成！");
                    this.setState({
                        dataTab:data.map.list,
                        dataLen:data.map.count
                    });
                });
            });
        },'/otcdyanmic/employee.do');
    },/*tabs 选择负责人时重新渲染表格*/
    opCustomer:function (key) {
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"auditList","pageSize":20,"pageNumber":1,"employee_id":key,"startTime":this.state.startTime,"endTime":this.state.endTime,"flag":this.state.estate},function (data) {
            data.map.count == "0" ? message.warning("暂无可审核数据！") : message.success("加载完成！");
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count,
                pageNum:1,
                thisId:key
            });
        })
    },/*取消弹窗*/
    handleCancel(){
        this.setState({status:"请选择",opinion:"",modalVisible:false,isReason:false});
    },/*修改请假状态*/
    edit(e){
        var $this = this;
        var strData= $(e.currentTarget).attr("value");
        var thisId = JSON.parse(strData).id;
        confirm({
            title: '提示：',
            content: '确认修改为请假吗？',
            onOk() {
                $this.ajaxFn({"controlType":"updateLeave","planId":thisId,"isleave":1},function (data) {
                    message.success("已修改为请假");
                    this.ajaxFn({"controlType":"auditList","pageSize":20,"pageNumber":1,"employee_id":this.state.thisId,"startTime":this.state.startTime,"endTime":this.state.endTime,"flag":this.state.estate},function (data) {
                        this.setState({
                            dataTab:data.map.list,
                            dataLen:data.map.count
                        });
                    });
                });
            },
            onCancel() {},
        });
    },/*同意/驳回 打开弹窗*/
    statusChange(e){
        if(this.state.dataLen != 0){
            var val = e.target.value;
            this.setState({status:val,modalVisible:true});
            if(val == "2"){
                this.setState({isReason:true});
            }else{
                this.setState({isReason:false});
            }
        }else{
            message.warning("暂无可审核数据！");
        }
    },/*提交审核*/
    examineOk(){
        if(this.state.status == "1"){
            this.ajaxFn({"controlType":"audit","employee_id":this.state.thisId,"startTime":this.state.startTime,"endTime":this.state.endTime,"flag":this.state.status,"opinion":this.state.opinion},function (data) {
                message.success("审核成功！");
                this.setState({status:"",opinion:"",modalVisible:false,isReason:false});
                /*请求头部负责人*/
                this.ajaxFn({"controlType":"queryAll","startTime":this.state.startTime,"endTime":this.state.endTime},function (data) {
                    this.setState({employee:data.map.list,thisId:data.map.list[0].id,"startTime":this.state.startTime,"endTime":this.state.endTime});
                    /*工作计划审核列表*/
                    this.ajaxFn({"controlType":"auditList","pageSize":20,"pageNumber":1,"employee_id":data.map.list[0].id,"startTime":this.state.startTime,"endTime":this.state.endTime,"flag":this.state.estate},function (data) {
                        data.map.count == "0" ? message.warning("暂无可审核数据！") : message.success("加载完成！");
                        this.setState({
                            dataTab:data.map.list,
                            dataLen:data.map.count,
                            pageNum:1,
                        });
                    });
                },'/otcdyanmic/employee.do');
            })
        }else if(this.state.status == "2"){
            if(this.state.status && this.state.opinion){
                this.ajaxFn({"controlType":"audit","employee_id":this.state.thisId,"startTime":this.state.startTime,"endTime":this.state.endTime,"flag":this.state.status,"opinion":this.state.opinion},function (data) {
                    message.success("审核成功！");
                    this.setState({status:"",opinion:"",modalVisible:false,isReason:false});
                    /*请求头部负责人*/
                    this.ajaxFn({"controlType":"queryAll","startTime":this.state.startTime,"endTime":this.state.endTime},function (data) {
                        this.setState({employee:data.map.list,thisId:data.map.list[0].id,"startTime":this.state.startTime,"endTime":this.state.endTime});
                        /*工作计划审核列表*/
                        this.ajaxFn({"controlType":"auditList","pageSize":20,"pageNumber":1,"employee_id":data.map.list[0].id,"startTime":this.state.startTime,"endTime":this.state.endTime,"flag":this.state.estate},function (data) {
                            data.map.count == "0" ? message.warning("暂无可审核数据！") : message.success("加载完成！");
                            this.setState({
                                dataTab:data.map.list,
                                dataLen:data.map.count,
                                pageNum:1,
                            });
                        });
                    },'/otcdyanmic/employee.do');
                })
            }else{
                message.warning("请填写驳回原因！");
            }
        }
    },/*导出*/
    export(){
        this.ajaxFn({"controlType":"fileExport","employee_id":this.state.thisId,"startTime":this.state.startTime,"endTime":this.state.endTime},function (data) {
            if(data.map.filePath){
                message.success(data.map.msg);
                window.location.href = data.map.filePath;
            }else{
                message.warning(data.map.msg);
            }
        });
    },
    render:function(){
        return (
            <QueueAnim>
            <div className="h50 border0" key="1">工作计划审核</div>
            <Tabs type="card" onChange={this.opCustomer}  key="2" activeKey={this.state.thisId}>

        {this.state.employee.map(function (data,i) {
            return <TabPane
            tab={
                <Badge style={{right:"-15px",top:"-8px"}} dot={(data.unaudit == 0 ? false : true)} >
            <div style={{padding:"0 10px"}}> {data.name}</div>
            </Badge>}
            key={data.id}>

            </TabPane>
        })}
        </Tabs>
        <div className="operation" id="operation" style={{"paddingTop":"0"}}  key="3">
            <label className="label-style">
            计划日期
            </label>
            <DateRange size="large" showTime  searchTime={this.searchTime} />
        <div style={{"width":"400px","display":"inline-block"}}>
        <label className="p-l-r">状态</label>
            <Select size="large" style={{width:250}}  onChange={(val)=>this.setState({estate:val})} defaultValue="3">
            <Option value="1">已通过</Option>
            <Option value="2">已驳回</Option>
            <Option value="3">待审核</Option>
            </Select>
            </div>
            <a href="javascript:void(0)" className="btn btn-search" onClick={this.termSearch}>搜索</a>
        <a href="javascript:void(0)" className="btn btn-search" onClick={this.export}>导出</a>
        <button type="button" className="btn btn-search" onClick={this.statusChange} value="1" disabled={(this.state.dataLen == 0 || this.state.estate != "3" ) ? true:false} >同意</button>
        <button type="button" className="btn btn-search" onClick={this.statusChange} value="2" disabled={(this.state.dataLen == 0 || this.state.estate != "3" ) ? true:false} >驳回</button>
        </div>
        <MemberTabel
        key="4"
        dataTable={this.state.dataTab}
        titleName={["checkbox","客户编号","单位名称","地址","日期","时段","计划状态","标记状态","请假状态","操作"]}
        dataKey={["custom_id","coustom","address","time","hours","statusShow","mark_type","leaveShow"]}
        controlArr={(this.state.estate == 1 ? [{conId:6,conClass:"cleflo",callback:this.edit}]:[])}
        />
        <div className="mem-footer row"  key="5">
            <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
        <div className="col-md-11">
            <Pagination current={this.state.pageNum} urrent={1} className="antd-page" showQuickJumper total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
        </div>
        </div>

        <Modal title="审核操作" visible={this.state.modalVisible} onOk={this.examineOk} onCancel={this.handleCancel}>
        <h4 className={(this.state.isReason ? "none" :"")}>确定审核通过吗？</h4>
        <div className={"row "+(this.state.isReason ? "" :"none")}>
            <div className="col-lg-12">
            <div className="entrySelect">
            <label>驳回原因</label>
            <Input style={{width: 419}} value={this.state.opinion}  type="textarea" rows={4} onChange={(e)=>this.setState({opinion:e.target.value})}/>
        </div>
        </div>
        </div>

        </Modal>
        <Loading loading={this.state.loading} />
        </QueueAnim>
        );
    }
});


/*弹窗新增上的select*/
var AddSelect = React.createClass({
    render: function () {
        return (
            <div className="addselect">
            <label>{this.props.tle}</label>
        <Select
        showSearch
        size="large"
        style={{width:250}}
        optionFilterProp="children"
        onChange={this.props.onChange}
        value={this.props.value}
        >
        <Option value="请选择客户">请选择客户</Option>
            {this.props.options.map(function (data, i) {
                return <Option key={i + "and_option"} value={"" + data.id}>{data.name}</Option>
            })}
        </Select>
        </div>
        );
    }
});




/*时间范围组件*/
var DateRange = React.createClass({
    getInitialState() {
        /*默认第一次传的时间数据*/
        var sameMonth =  initDate();
        var planDay =  initDate(false);
        return {
            startValue: sameMonth,  /*今天日期*/
            endValue: planDay,      /*未来一周日期*/
            endOpen: false
        };
    },
    onStartChange(value) {
        this.setState({startValue: this.formatDate(value)});
        this.searchTime(this.formatDate(value));
    },
    onEndChange(endVal) {
        this.setState({endValue: this.formatDate(endVal)});
        this.searchTime(null,this.formatDate(endVal));
    },/*格式转换*/
    formatDate:function (date) {
        if(date !== null){
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return year + "-" +(month > 9 ? (month + "") : ("0" + month))  + "-" + (day > 9 ? (day + "") : ("0" + day));
        }else{
            message.warning('请先填写日期范围！');
            return "";
        }
    },
    searchTime:function (sd,ed) {
        this.props.searchTime(sd,ed);
    },
    render() {
        return (
            <div className="inlineBlock" style={{marginRight:"20px",marginBottom:"15px"}}>
    <DatePicker
        placeholder="开始日期"
        onChange={this.onStartChange}
        defaultValue={this.state.startValue}
    />
    <span> ~ </span>
        <DatePicker
        placeholder="结束日期"
        onChange={this.onEndChange}
        defaultValue={this.state.endValue}
    />
    </div>
    );
    },
});


/*返回当前或者一周前的日期*/
function initDate(choice = true){
    if(choice){
        return CurrentTime();   //当前时间
    }else{
        return getYestoday();   //前一周时间
    }
    function CurrentTime(){
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var dates = myDate.getDate();
        var currentDate = year + "-" + (month<10?'0'+month:month) + "-" + (dates<10?'0'+dates:dates);
        return currentDate;
    }

    function getYestoday(){
        var d=new Date();
        var yesterday_milliseconds=d.getTime()+7000*60*60*24;
        var yesterday = new Date();
        yesterday.setTime(yesterday_milliseconds);
        var strYear = yesterday.getFullYear();
        var strDay = yesterday.getDate();
        var strMonth = yesterday.getMonth()+1;
        var datastr = strYear+"-"+(strMonth < 10 ? '0' + strMonth : strMonth )+"-"+(strDay < 10 ? '0' + strDay : strDay );
        return datastr;
    }
}
