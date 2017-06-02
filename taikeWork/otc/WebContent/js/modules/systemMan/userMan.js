import React from 'react'
import MemberTabel from  '../react-utils/table'
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';                /*antd 提示组件*/
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import Dropdown from 'antd/lib/dropdown'
import Button from 'antd/lib/button'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import Loading from '../react-utils/loading'         /*加载中组件*/
import DatePicker from 'antd/lib/date-picker';      /*antd 日期组件*/
import Select from 'antd/lib/select';/*antd select*/
const Option = Select.Option;
import Input from 'antd/lib/input'
import '../../../less/tablePage.less'




var object = new Object();

export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/userManger.do') {
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
                $("#loading").addClass("none");;
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    getInitialState:function(){
        return {
            dataTab : [],
            showLine:20,	    /*显示行数*/
            dataLen:0,		    /*数据条数*/
            visible:false,    /*弹框是否显示*/
            modalText:'',     /*弹窗显示的文字内容*/
            handleOk:function(){},       /*弹窗事件*/
            pageNum:1 ,          /*默认页数*/
            memberName:"", //搜索关键字 
        };
    },
    componentDidMount:function(){
        $("#loading").removeClass("none");
        /*进入时初始化数据*/
        this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":1},function (data) {
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count
            });
        });

    },/*跳页*/
    pageNumber(page){
        $("#loading").removeClass("none");
        this.setState({pageNum:page},function(){
            this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":page,"starTime":this.state.starTime,"endTime":this.state.endTime,employeeName:this.state.memberName},function (data) {
                message.success('加载完成！');
                this.setState({dataTab:data.map.list});
            });
        });

    },//行数选中回调函数
    lineNumber:function (obj) {
        var num = obj.key * 1;
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"query","pageSize":num,"pageNumber":1},function (data) {
            this.setState({
                showLine:num,
                dataTab:data.map.list,
                pageNum:1
            });
        });
    },//关键字搜索
    nameSearch:function (e) {
        var e = e || window.event;
        if((e && e.keyCode==13) || e.type == "click"){
            $("#loading").removeClass("none");
            var memberName = this.refs.memberName.value;
            this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":1,'employeeName':memberName},function (data) {
                if(data.map.count == "0"){
                    message.warning('没有相关员工姓名');
                }
                this.setState({
                    dataTab:data.map.list,
                    dataLen:data.map.count,
                    memberName:memberName,
                });
            })
        }

    },/*修改用户*/
    editUser(e){
        var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
    },/*重置密码*/
    reset(e){
        var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
        this.setState({
            visible:true,
            modalText:"确认将该用户的密码恢复为初始密码吗？",
            handleOk:this.handleOk
        });
    },/*关闭重置密码选项*/
    modalOff(){
        this.setState({
            visible:false
        });
    },/*确认重置密码*/
    handleOk(){
        var strData = sessionStorage.getItem("TK_strData");
        var productId = JSON.parse(strData).id;
        this.ajaxFn({"controlType":"resetPwd","employee_id":productId},function (data) {
            this.setState({visible:false});
            message.success('重置密码成功！重置后密码为：123456');
        })
    },/*打开清空用户数据弹窗*/
    empty(e){
        var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
        this.setState({
            visible:true,
            modalText:"确认清空该用户的数据吗？",
            handleOk:this.determineEmpty
        });
    },/*确定清空用户数据*/
    determineEmpty(){
        var strData = sessionStorage.getItem("TK_strData");
        var productId = JSON.parse(strData).id;
        this.ajaxFn({"controlType":"resetUserInfo","employee_id":productId},function(data){
            this.setState({visible:false});
            message.success('清空成功');
            /*重新渲染数据*/
            this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":this.state.pageNum},function (data) {
                this.setState({
                    dataTab:data.map.list
                });
            });
        });
    },/*查看用户*/
    userSee(e){
        var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
    },
    export(){
        /*导出链接*/
        this.ajaxFn({"controlType":"fileExport"},function (data) {
            window.location.href = data.map.filePath;
        });
    },//按时间范围保存
    searchTime:function(sd,ed){
        if(sd){
            object.starTime = sd;
        }else if(ed){
            object.endTime = ed;
        }
    },/*搜索条件选中事件*/
    handleChange(keyName,val){
        object[keyName] = val;
    },/*条件搜索*/
    termSearch(){
        $("#loading").removeClass("none");
        this.setState({
         memberName:"",
         })
        this.ajaxFn({"controlType":"query","starTime":object.starTime,"endTime":object.endTime,"pageSize":this.state.showLine,"pageNumber":1,"weixinName":object.weixinName,"useFlag":object.useFlag},function (data) {
            data.map.count == "0" ? message.warning("暂无相关数据！") : message.success("加载完成！");
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count
            });
        })
    },
    render:function(){
        return (
            <QueueAnim>
                <div className="mb-title" key="1">用户管理</div>
                <div className="operation" id="operation"  key="2">
                    <Dropdown
                        style={{marginBottom:"15px"}}
                        overlay={(
                            <Menu onClick={this.lineNumber}>
                                <Menu.Item key="10">10</Menu.Item>
                                <Menu.Item key="20">20</Menu.Item>
                                <Menu.Item key="50">50</Menu.Item>
                                <Menu.Item key="100">100</Menu.Item>
                            </Menu>)}
                    >
                        <Button type="ghost" style={{height:"34px",marginRight:'20px'}}>
                            {this.state.showLine} <Icon type="circle-o-down" />
                        </Button>
                    </Dropdown>
                    <DateRange searchTime={this.searchTime} />
                    <div className="inlineBlock">
                        <AntdSelect type="text" tle="微信号" size="large" placeholder="微信号" width={166} onChange={this.handleChange} keyName="weixinName" />
                        <AntdSelect tle="状态" size="large" placeholder="状态" width={166} onChange={this.handleChange} keyName="useFlag"  options={[{"name":"全部","id":""},{"name":"正常","id":"1"},{"name":"停用","id":"0"}]}/>
                    </div>
                    <a href="javascript:void(0)" className="btn btn-search" onClick={this.termSearch}>搜索</a>
                    <a href="javascript:void(0)" className="btn btn-search" onClick={this.export}>导出</a>
                    <a href="#newAdministrator" className="btn btn-add"><span className="icon-add"></span>新增</a>
                    <div className="form-group fr mem-search">
                        <input type="text" className="fl pl15" placeholder="搜索员工姓名" ref="memberName" onKeyUp={this.nameSearch} />
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                    </div>
                </div>
                <MemberTabel
                    key="3"
                    dataTable={this.state.dataTab}
                    eventPopup={this.eventPopup}
                    ajaxUrl='otcdyanmic/otcdyanmic.tab.json'
                    titleName={["checkbox","ID","帐号","员工地区","员工姓名","角色","手机号码","微信号","状态","创建时间","操作"]}
                    dataKey={["id","login_name","area_name","real_name","roleName","mobile","weixin_name","status","create_time"]}
                    controlArr={[{conId:2,conUrl:"adminModify",callback:this.editUser},{conId:3,callback:this.userSee,conUrl:"adminInfo"},{conId:4,callback:this.empty},{conId:5,callback:this.reset}]}
                   titlestyle={{
                        "styles11":{minWidth:"110px"}, 
                        }}
                />
                <div className="mem-footer row mb10 p-l-r"  key="4">
                    <div className="col-sm-12 col-lg-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-sm-12 col-lg-11">
                        <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                    </div>
                </div>




                <Modal title="提示" visible={this.state.visible} onOk={this.state.handleOk} onCancel={this.modalOff}>
                    <p>{this.state.modalText}</p>
                </Modal>
                <Loading loading={this.state.loading} />
            </QueueAnim>
        );
    }
});


var AntdSelect = React.createClass({
    handleChange(val){
        if(this.props.type == "text"){
            this.props.onChange(this.props.keyName,val.target.value);
        }else{
            this.props.onChange(this.props.keyName,val);
        }
    },
    render(){
        const {tle , options ,size ,placeholder,width,type} = this.props;
        if(type == "text"){
            return (
                <span style={{marginRight:"10px",display:"inline-block",marginBottom:"10px"}}>
                    <label style={{padding:"0 10px"}}>{tle}</label>
                    <Input size={size}  placeholder={placeholder} style={{ width:width }} onChange={this.handleChange} />
                </span>
            )
        }else{
            return (
                <span style={{marginRight:"10px",display:"inline-block",marginBottom:"10px"}}>
                    <label style={{padding:"0 10px"}}>{tle}</label>
                    <Select  size={size}  placeholder={placeholder} style={{ width:width }} onChange={this.handleChange}>
                        {options.map(function(obj,i){
                            return <Option key={i} value={obj.id}>{obj.name}</Option>
                        })}
                    </Select>
                </span>
            )
        }
    }
});


/*时间范围组件*/
var DateRange = React.createClass({
    getInitialState() {
        /*默认第一次传的时间数据*/
        return {
            startValue: null,  /*开始时间*/
            endValue: null,      /*结束日期*/
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
            return year + "-" +(month > 9 ? (month + "") : ("0" + month))  + "-" + (day > 9 ? (day + "") : ("0" + day))+" 00:00:00";
        }else{
            message.warning('请先填写日期范围！');
            return "";
        }
    },
    searchTime:function (sv,ev) {
        var sd = sv ? sv : false;
        var ed = ev ? ev : false;
        this.props.searchTime(sd,ed);
    },
    render() {
        return (
            <div className="inlineBlock" style={{"marginRight":"20px","marginBottom":"15px"}}>
                <DatePicker
                    placeholder="开始日期"
                    onChange={this.onStartChange}
                />
                <span> ~ </span>
                <DatePicker
                    placeholder="结束日期"
                    onChange={this.onEndChange}
                />
            </div>
        );
    },
});
