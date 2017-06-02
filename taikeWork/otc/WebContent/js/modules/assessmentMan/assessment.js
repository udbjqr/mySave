import React from 'react'
import MemberTabel from  '../react-utils/table'
import Pagination from 'antd/lib/pagination';        /*antd 分页组件*/
import DatePicker from 'antd/lib/date-picker';      /*antd 年月选择*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';                /*antd 提示组件*/
const MonthPicker = DatePicker.MonthPicker;
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import Loading from '../react-utils/loading'         /*加载中组件*/
import Select from 'antd/lib/select';                      /*antd select*/
const Option = Select.Option;
import '../../../less/tablePage.less'




var object = new Object();

/*通用表格页面*/
export default React.createClass({
    /*ajax 封装*/
    ajaxFn:function(returnData,callback,javaUrl = '/otcdyanmic/appraisalUser.do'){
        var $this = this;
        $.ajax({
            type:"post",
            url:javaUrl,
            data:{paramMap:JSON.stringify(returnData)},
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
        var planDay = yearMonth();
        return {
            dataTab : [],       /*table初始数据*/
            showLine:20,	    /*显示行数*/
            dataLen:0,		    /*数据条数*/
            pageNum:1,          /*页码选中值*/
            planDay:planDay,     /*年月*/
            personInChargeId:[],     /*拜访人员*/
            memberName:"", //搜索关键字
        };
    },
    componentDidMount:function(){
        if(Object.keys(object).length != 0){
            for (var key in object) {
                this.setState({[key]:object[key]});
            }
        }

        /*获取列表数据*/
        this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":1,"time":this.state.planDay},function (data) {
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count
            });
        });

        /*拜访人员（代表）*/
        this.ajaxFn({"controlType":"query","id":1},function (data) {
            this.setState({personInChargeId:data.map.list});
        },'/otcdyanmic/employee.do');

    },/*跳页*/
    pageNumber(page){
        this.setState({loading:true,pageNum:page});
        this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":page,"time":this.state.planDay,name:this.state.memberName},function (data) {
            this.setState({dataTab:data.map.list});
        });
    },//关键字搜索
    nameSearch:function (e) {
        var e = e || window.event;
        if((e && e.keyCode==13) || e.type == "click"){
            $("#loading").removeClass("none");
            var memberName = this.refs.memberName.value;
            this.ajaxFn({"controlType":"query","name":memberName,"pageSize":20,"pageNumber":1,"time":this.state.planDay},function (data) {
                data.map.count == "0" ? message.warning("暂无相关数据！") : message.success("加载完成！");
                this.setState({
                    dataLen:data.map.count,
                    dataTab:data.map.list,
                    pageNum:1,
                    memberName:memberName,
                });
            })
        }

    },/*日期搜索*/
    ant_date:function (value,dateString){
        $("#loading").removeClass("none");
        this.setState({
         memberName:"",
         })
        this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":1,"time":(dateString ? dateString : yearMonth())},function (data) {
            data.map.count == "0" ? message.warning("暂无数据！") : message.success("加载完成！");
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count,
                planDay:dateString,
                pageNum:1
            });
        });
    },/*导出*/
    export(){
        this.ajaxFn({"controlType":"fileExport","time":this.state.planDay},function (data) {
            if(data.map.filePath){
                window.location.href = '/otcdyanmic/'+data.map.filePath;
            }else{
                message.warning('暂无数据！');
                return false;
            }
        });
    },/*拜访人员选中*/
    chainEvent(val){
        if(this.state.employee_id == "all" || this.state.employee_id==""){
            /*获取列表数据*/
            this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":1,"time":this.state.planDay},function (data) {
                data.map.count == "0" ? message.warning("暂无数据！") : message.success("加载完成！");
                this.setState({
                    dataTab:data.map.list,
                    dataLen:data.map.count
                });
            });
        }else{
            /*获取列表数据*/
            this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":1,"time":this.state.planDay,"employee_id":this.state.employee_id},function (data) {
                data.map.count == "0" ? message.warning("暂无数据！") : message.success("加载完成！");
                this.setState({
                    dataTab:data.map.list,
                    dataLen:data.map.count
                });
            });
        }
    },/*查看*/
    see(e){
    var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
    },/*多选选中,获取值*/
    option(key,valueArr){
        object[key] = valueArr.toString();
        this.setState({[key]:valueArr.toString()});
    },
    render:function(){
        return (
            <QueueAnim>
                <div className="mb-title" key="1">考核查询</div>
                <div className="operation" id="operation" key="2">
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{width:"220px"}}>
                        <MonthPicker placeholder="请选择月份"  onChange={this.ant_date}  defaultValue={this.state.planDay} style={{float:"left"}} />
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <MultiSelect tle="拜访人员" placeholder="请选择拜访人员" options={this.state.personInChargeId} typeName="employee_id" even={this.option} content={object.employee_id} />
                    </div>
                    <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4" style={{width:"100px"}}>
                    <button type="button" className="btn btn-search mb15" onClick={this.chainEvent}>搜索</button>
                    </div>
                    <a href="javascript:void(0)" className="btn btn-search" onClick={this.export}>导出</a>
                    <div className="form-group fr mem-search">
                        <input type="text" className="fl pl15" placeholder="搜索员工姓名" ref="memberName" onKeyUp={this.nameSearch} />
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                    </div>
                </div>
                <MemberTabel
                    key="3"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox","序号","员工姓名","员工地区","角色","总分","操作"]}
                    dataKey={["index","employeeName","areaName","roleName","score"]}
                    controlArr={[{conId:3,conUrl:"managementPage",conClass:"cleflo",callback:this.see}]}
                />
                {/*controlArr={[{conId:3,conUrl:"managementPage",callback:this.see}]}*/}
                <div className="mem-footer row" key="4">
                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-md-11">
                        <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                    </div>
                </div>
                <Loading loading={this.state.loading} />
            </QueueAnim>
        );
    }
});

/*获取当前年月*/
function yearMonth(symbol){
    var planYear = new Date().getFullYear();
    var planDay = new Date().getMonth() + 1 ;
    var S = symbol ? symbol : '-';
    return planYear+S+(planDay < 10 ? '0'+planDay : planDay );
}



/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    render:function(){
        return (
            <div className="form-inline fl newadd" style={{"marginLeft":"15px"}}>
                <div className="form-group">
                    <label className="label-style">{this.props.tle}</label>
                    <Select
                        showSearch
                        size="large"
                        style={{ width:170 }}
                        placeholder="请选择拜访人员"
                        optionFilterProp="children"
                        onChange={this.props.onChange}
                    >
                        <Option value="all">全部</Option>
                        {this.props.options.map(function (data,i) {
                            return <Option key={i+"and_option"} value={""+data.id}>{data.name}</Option>
                        })}
                    </Select>
                </div>
            </div>
        );
    }
});


/*select 多选组件，参数：标题，option数组对象*/
var MultiSelect = React.createClass({
    handleChange(value) {
        var valIds = [];
        value.forEach(obj=>{
            var item = obj.split(";")[1];
            valIds.push(item);
        })
        this.props.even(this.props.typeName,valIds);
    },
    render(){
        const {tle,selectStyle={"width":"220px"},divStyle,options,placeholder="请选择",content="",className=""} = this.props;
        const haveContent = content ? content.split(","):[];
        haveContent.forEach((obj,i)=>{
            options.forEach(data=>{
                if(data.id == (obj*1)){
                    haveContent[i] = data.name+";"+obj;
                }
            });
        });
        return (
            <div className={className} style={divStyle}>
               <label className="label-style">{tle}</label>
                <Select
                    multiple
                    size="large"
                    placeholder={placeholder}
                    style={selectStyle}
                    searchPlaceholder="标签模式"
                    onChange={this.handleChange}
                    defaultValue={haveContent}
                >
                    {options.map(function (data,i) {
                        return <Option key={data.name+";"+data.id} title={data.name} >{data.name}</Option>
                    })}
                </Select>
            </div>
        );
    }
});
