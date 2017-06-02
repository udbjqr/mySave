
import React from 'react'
import MemberTabel from  '../react-utils/table'     /*表格组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import message from 'antd/lib/message';                /*antd 提示组件*/
import Upload from 'antd/lib/upload'/*antd 上传组件*/
import Dropdown from 'antd/lib/dropdown'
import Button from 'antd/lib/button'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import Loading from '../react-utils/loading'         /*加载中组件*/
const confirm = Modal.confirm;
import '../../../less/tablePage.less'
import Select from 'antd/lib/select';                      /*antd select*/
const Option = Select.Option;


var object = new Object();
/*商业客户管理*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/chainCustomer.do') {
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
        return {
            dataTab : [],
            showLine:20,	/*显示行数*/
            dataLen:0,		/*数据条数*/
            pageNum:1,      /*默认页数*/
            regionArr:[],   /*地区数据*/
            personInChargeId:[],    /*负责代表数据*/
            area_id:"",         /*选中地区*/
            conditionObj:{},     /*缓存的条件对象*/
            memberName:"", //搜索关键字
        };
    },
    componentDidMount:function(){

        if(object){
          this.setState({conditionObj:object});
        }

        /*进入时请求地区数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({regionArr:data.map.data});
        },'/otcdyanmic/areaDivision.do');

        /*请求负责代表*/
        this.ajaxFn({"controlType":"query","id":1},function (data) {
            this.setState({personInChargeId:data.map.list});
        },'/otcdyanmic/employee.do');
    },/*跳页*/
    pageNumber(page){
        this.setState({loading:true,pageNum:page});
        this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":page,"chainCustomName":this.state.memberName,"area_id":this.state.area_id},function (data) {
            this.setState({dataTab:data.map.list});
        });
    },//行数选中回调函数
    lineNumber:function (obj) {
        var num = obj.key * 1;
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"query","pageSize":num,"pageNumber":1,"name":this.refs.memberName.value,"area_id":this.state.area_id},function (data) {
            this.setState({
                dataTab:data.map.list,
                showLine:num,
                pageNum:1

            });
        });
    },//关键字搜索
    nameSearch:function (e) {
        var e = e || window.event;
        if((e && e.keyCode==13) || e.type == "click"){ // enter 键
            $("#loading").removeClass("none");
            var memberName = this.refs.memberName.value;
            this.ajaxFn({"controlType":"query","chainCustomName":memberName,"pageSize":this.state.showLine,"pageNumber":1},function (data) {
                if(data.map.count == "0"){
                    message.warning('没有相关客户！');
                }
                this.setState({
                    dataLen:data.map.count,
                    dataTab:data.map.list,
                    pageNum:1,
                     memberName:memberName,
                });
            })
        }
    },/*查看详情*/
    edit(e){
        var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
    },/*查看详情*/
    seeInfo(e){
        var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
    },/*地区选中事件*/
    changeEvent(key,val){
        object[key] = val;
    },/*条件搜索*/
    searchAllRegion(){
        this.setState({
         memberName:"",
         })
        this.ajaxFn({"controlType":"query","pageNumber":1,"pageSize":this.state.showLine,"area_id":object.area_id,"employee_id":object.employee_id,"flag":object.flag,"custom_type":object.custom_type},function(data){
            if(data.map.count == "0"){
                message.warning("暂无数据！");
            }else{
                message.success("加载成功！");
            }
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count,
                pageNum:1
            });
        });
    },/*客户禁用 | 启用*/
    customerDisable(e){
        var $this = this;
        var strData = $(e.currentTarget).attr("value");
        var obj = JSON.parse(strData);
        var mark = obj.status == 0 ? true : false;
        confirm({
            title: '提示：',
            content:mark ? '您确定要启用该客户吗？':'您确定要禁用该客户吗？',
            onOk() {
                $this.ajaxFn({"controlType":"disable","chain_id":obj.id,"flag":(mark ? 1 : 0)},function(data){
                    message.success((mark ? "启用成功！":"禁用成功！"));
                    /*重新渲染列表*/
                    this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":this.state.pageNum,"area_id":object.area_id,"employee_id":object.employee_id,"flag":object.flag,"custom_type":object.custom_type},function (data) {
                        this.setState({
                            dataTab:data.map.list,
                            dataLen:data.map.count
                        });
                    });
                });
            },
            onCancel() {},
        })
    },/*多选选中,获取值*/
    option1(key,valueArr){
        object[key] = valueArr.toString();
    },
    render:function(){
        return (
            <QueueAnim>
                <div className="mb-title" key="1">商业客户管理</div>
                <div className="row mt15" key="2">
                    <div className="col-sm-12 col-md-6 col-lg-4 mb15">
                        <MultiSelect tle="区域"  placeholder="请选择区域" typeName="area_id"  options={this.state.regionArr} even={this.option1}    content={this.state.conditionObj.area_id} />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 mb15">
                       <MultiSelect tle="负责代表"  placeholder="请选择负责代表" typeName="employee_id"  options={this.state.personInChargeId} even={this.option1}    content={this.state.conditionObj.employee_id} />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 mb15">
                       <MultiSelect tle="客户类型" placeholder="请选择客户类型" options={[{"name":"连锁","id":"1"},{"name":"批发","id":"2"}]} typeName="custom_type" even={this.option1}   content={this.state.conditionObj.custom_type} />
                    </div>
                     <div className="col-sm-12 col-md-6 col-lg-4 mb15">
                        <SingleSelect tle="状态"  placeholder="请选择状态" typeName="flag"  options={[{"name":"正常","id":"1"},{"name":"停用","id":"0"}]} even={this.option1}   content={this.state.conditionObj.flag} />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 mb15">
                        <button type="button" className="btn btn-search" onClick={this.searchAllRegion}>搜索</button>
                    </div>
                </div>
                <div className="operation" id="operation" key="3">
                    <Dropdown
                        overlay={(
                            <Menu onClick={this.lineNumber}>
                                <Menu.Item key="10">10</Menu.Item>
                                <Menu.Item key="20">20</Menu.Item>
                                <Menu.Item key="50">50</Menu.Item>
                                <Menu.Item key="100">100</Menu.Item>
                            </Menu>)}
                    >
                        <Button type="ghost" style={{height:"34px",float:"left"}}>
                            {this.state.showLine} <Icon type="circle-o-down" />
                        </Button>
                    </Dropdown>
                    <a href="#addBusinessCustomers" className="btn btn-add"><span className="icon-add"></span>新增</a>
                    <div className="form-group fr mem-search">
                        <input type="text" className="fl pl15" placeholder="搜索客户名" ref="memberName" onKeyUp={this.nameSearch} />
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                    </div>
                </div>
                <MemberTabel
                    key="4"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox","编号","区域","客户名称","负责代表","客户类型","状态","操作"]}
                    dataKey={["id","areaName","name","employeeName","custom_type","status"]}
                    controlArr={[{conId:2,conUrl:"infoBusinessCustomers",callback:this.edit},{conId:3,conUrl:"seeBusinessCustomers",callback:this.seeInfo},{conId:7,callback:this.customerDisable}]}
                />
                <div className="mem-footer row"  key="5">
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









/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    selectChange(e){
        if(e){
            this.props.onChange(this.props.keys,e.target.value);
        }
    },
    render:function(){
      const {content} = this.props;
        return (
            <div className="mb15">
                <label className="gao-big-label">{this.props.tle}</label>
                <select className="form-control inlineBlock" onChange={this.selectChange} defaultValue={content} style={{width:"70%",minWidth:"200px",float:"float"}} >
                    <option value="" >请选择</option>
                    {this.props.options.map(function(data,i){
                        return <option value={data.id} key={i+"po"} >{data.name}</option>
                    })}
                </select>
            </div>
        );
    }
});

/*select 单选组件，参数：标题，option数组对象*/
var SingleSelect = React.createClass({
    handleChange:function (value) {
        this.props.even(this.props.typeName,value);
    },
    render:function(){
        const {tle,selectStyle={ "width": "220px" },divStyle,options,placeholder="请选择",content,className=""} = this.props;
        return (
            <div className={className} style={divStyle}>
               <label className="label-style">{tle}</label>
                <Select
                    size="large"
                    placeholder={placeholder}
                    style={selectStyle}
                    searchPlaceholder="标签模式"
                    onChange={this.handleChange}
                    defaultValue={content}
                >
                    {options.map(function (data,i) {
                        return <Option key={data.id} title={data.name} >{data.name}</Option>
                    })}
                </Select>
            </div>
        );
    }
});

/*select 多选组件，参数：标题，option数组对象*/
var MultiSelect = React.createClass({
    handleChange:function (value) {
        var valIds = [];
        value.forEach(obj=>{
            var item = obj.split(";")[1];
            valIds.push(item);
        })
        this.props.even(this.props.typeName,valIds);
    },
    render:function(){
        const {tle,selectStyle={ "width": "220px" },divStyle,options,placeholder="请选择",content="",className=""} = this.props;
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
