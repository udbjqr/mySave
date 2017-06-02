import React from 'react'
import MemberTabel from  '../react-utils/table'/*表格组件*/
import Modal from 'antd/lib/modal'/*antd 弹窗组件*/
import Dropdown from 'antd/lib/dropdown'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'/*antd 上传组件*/
import Button from 'antd/lib/button'/*antd 按钮组件*/
import message from 'antd/lib/message';                /*antd 提示组件*/
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import Pagination from 'antd/lib/pagination';/*分页组件*/
import Loading from '../react-utils/loading'         /*加载中组件*/
const confirm = Modal.confirm;
import '../../../less/tablePage.less'
import Select from 'antd/lib/select';                      /*antd select*/
const Option = Select.Option;

var options = {};

/*连锁客户管理*/
export default React.createClass({
    //ajax 封装
    ajaxFn: function (data, callback, javaUrl = '/otcdyanmic/customer.do') {
        var $this = this;
        $.ajax({
            type: "post",
            url: javaUrl,
            data: {paramMap: JSON.stringify(data)},
            dataType: "json",
            async:false,	//false 表示ajax执行完成之后在执行后面的代码
            success: function (data) {
                if (!data.success) {/*首先判断这个属性，错误在判断原因*/
                    switch (data.errorCode) {
                        case  (1):
                            Modal.warning({
                                title: '警告提示：', content: '获取当前登录用户信息失败，请重新登录！', onOk() {
                                    window.location.href = 'login.html';
                                }
                            });
                            break;
                        case  (2):
                            Modal.warning({title: '警告提示：', content: '此用户不存在或已禁用，请联系管理员！'});
                            break;
                        case  (3):
                            Modal.error({title: '错误提示：', content: '发生严重错误，请联系管理员！！'});
                            break;
                        case  (4):
                            Modal.error({title: '错误提示：', content: '发生严重错误，请联系管理员！！'});
                            break;
                        case  (5):
                            Modal.warning({title: '警告提示：', content: '当前用户没有此操作权限！'});
                            break;
                        case  (8):
                            Modal.warning({title: '警告提示：',content: '相关数据格式有误，请检查后重新填写！'});
                            break;
                        case  (9):
                            Modal.info({title: '提示：',content: '相关数据未填写完整，请检查！'});
                            break;
                        default:
                            Modal.warning({title: '警告提示：', content: data.msg});
                            break;
                    }
                } else {
                    callback.call($this, data);
                }
                $("#loading").addClass("none");
            },
            error(){
                $("#loading").addClass("none");
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    getInitialState: function () {
        return {
            dataTab: [],
            pageNum:1,                  /*默认页数*/
            showLine: 20,               /*显示行数*/
            dataLen: 0,                 /*数据条数*/
            regions: [],                /*下拉框地区数据初始值*/
            employeeId: [],             /*负责人*/
            conditionObj:{},               /*缓存的条件数据*/
             memberName:"", //搜索关键字
             personinchargearry:[],
             personInChargeId:"",          /*区域经理*/

        };
    }, /*进入时初始化数据*/
    componentDidMount: function () {


        if(options){
            console.log(options);
            this.setState({conditionObj:options});
        }

        /*查询代表*/
        this.ajaxFn({"controlType": "query", "id": 1}, function (data) {
            this.setState({employeeId: data.map.list});
            /*查询主管*/
            this.ajaxFn({"controlType":"query","id":2},function (data) {
                this.setState({personinchargearry:data.map.list});
            },'/otcdyanmic/employee.do');
        }, '/otcdyanmic/employee.do');
        /*查询地区数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({regions:data.map.data});
        },'/otcdyanmic/areaDivision.do');


        /*请求属性数据*/
        this.ajaxFn({"controlType": "queryAll"}, function (data) {
            this.setState({attributesId: data.map.data});
        }, '/otcdyanmic/customerAttributes.do');

    },//行数选中回调函数
    lineNumber: function (obj) {
        var num = obj.key * 1;
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType": "query", "pageSize": num, "pageNumber":1,"flag":options.flag,"personInChargeId":options.personInChargeId,"employeeId":options.employeeId,"areaId":options.areaId}, function (data) {
            this.setState({
                dataTab: data.map.customerList,
                showLine: num,
                pageNum:1
            });
        });
    }, /*跳页*/
    pageNumber(page){
        $("#loading").removeClass("none");
        var memberName = this.state.memberName;
        this.ajaxFn({"controlType": "query","name":memberName,"pageSize": this.state.showLine,"pageNumber":page,"flag":options.flag,"personInChargeId":options.personInChargeId,"employeeId":options.employeeId,"areaId":options.areaId}, function (data) {
            this.setState({dataTab: data.map.customerList,pageNum:page});
        });
    },//关键字搜索
    nameSearch: function (e) {
        var e = e || window.event;
        if((e && e.keyCode==13) || e.type == "click"){ // enter 键
            $("#loading").removeClass("none");
            var memberName = this.refs.memberName.value;
            this.ajaxFn({"controlType":"query","name":memberName,"pageSize":this.state.showLine,"pageNumber":1},function (data) {
                if(data.map.count == "0"){
                    message.warning('没有相关单位');
                }
                this.setState({
                    dataTab:data.map.customerList,
                    dataLen:data.map.count,
                    pageNum:1,
                    memberName:memberName,

                });
            })
        }

    },//下拉框组件：回调
    option: function (key, value) {
        options[key] = value;
    }, /*条件搜索*/
    tj_search(){
        $("#loading").removeClass("none");
        this.setState({
         memberName:"",
         })
        options.controlType = "query";
        options.pageSize = this.state.showLine;
        options.pageNumber = 1;
        this.ajaxFn(options, function (data) {
            if(data.map.count == "0"){
                message.warning("未查找到数据！");
            }else{
                message.success('加载完成！');
            }
            this.setState({
                dataTab: data.map.customerList,
                dataLen: data.map.count,
                pageNum:1
            });
        });
    }, /*查看*/
    see(e){
        var strData = $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData", strData);
    },/*修改*/
    edit(e){
        var strData = $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData", strData);
    },/*导出*/
    export(){
      /*获取导出链接*/
      this.ajaxFn({"controlType":"fileExport","flag":1},function (data) {
          if(data.map.filePath){
              message.success(data.map.msg);
              window.location.href = data.map.filePath;
          }else{
              message.warning(data.map.msg);
          }
      })
  },/*上传文件方法*/
    fileHandle(e){
        var $this = this;
        var reader = new FileReader();
        var fileName = e.target.files[0].name;
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function(e){
            $this.ajaxFn({"controlType": "fileImport","fileName":fileName,"file":e.target.result}, function (data) {
                message.success(fileName+`导入成功。`);
                /*重新渲染列表*/
                this.ajaxFn({"controlType": "query", "pageSize":this.state.showLine,"pageNumber": 1,"flag":options.flag,"personInChargeId":options.personInChargeId,"employeeId":options.employeeId,"areaId":options.areaId}, function (data) {
                    this.setState({
                        dataTab: data.map.customerList,
                        dataLen: data.map.count,
                        pageNum:1
                    });
                });
            })
        };
    },/*打开选择文件窗口*/
    openFile(){
        return  $(this.refs.file).click();
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
                $this.ajaxFn({"controlType":"disable","custom_id":obj.id,"flag":(mark ? 1 : 0)},function(data){
                    message.success((mark ? "启用成功！":"禁用成功！"));
                    /*重新渲染列表*/
                    console.log(this.state.flag);
                    this.ajaxFn({"controlType": "query", "pageSize":this.state.showLine, "pageNumber":this.state.pageNum,"flag":options.flag,"personInChargeId":options.personInChargeId,"employeeId":options.employeeId,"areaId":options.areaId}, function (data) {
                        this.setState({
                            dataTab: data.map.customerList,
                            dataLen: data.map.count
                        });
                    });
                });
            },
            onCancel() {},
        })
    },/*多选选中,获取值*/
    option1(key,valueArr){
        options[key] = valueArr.toString();
    },
    render: function () {
        return (
            <QueueAnim>
                <div className="mb-title" key="1">门店客户管理</div>
                <div className="row mt15" key="2">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mb15">
                        <MultiSelect tle="主管"  placeholder="请选择主管" typeName="personInChargeId"  options={this.state.personinchargearry} even={this.option1}     content={this.state.conditionObj.personInChargeId} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mb15">
                        <MultiSelect tle="代表"  placeholder="请选择代表" typeName="employeeId"  options={this.state.employeeId} even={this.option1}  content={this.state.conditionObj.employeeId} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 mb15">
                         <MultiSelect tle="区域"  placeholder="请选择区域" typeName="areaId"  options={this.state.regions} even={this.option1}    content={this.state.conditionObj.areaId} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                         <SingleSelect tle="状态"  placeholder="请选择状态" typeName="flag"  options={[{"name":"正常","id":"1"},{"name":"停用","id":"0"}]} even={this.option1}   content={this.state.conditionObj.flag} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <button type="button" className="btn btn-search" onClick={this.tj_search}>搜索</button>
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
                    <button className="btn btn-search po-re" onClick={this.openFile}>导入</button>
                    <input ref="file" type="file" style={{display:"none"}} className="fileStyle" onChange={this.fileHandle} />
                    <a href="javascript:void(0)" className="btn btn-search" onClick={this.export}>导 出</a>
                    <a href="/otcdyanmic/templates/importCustomerTemplate.xls" className="btn btn-search">下载导入模版</a>
                    <a href="#addChain" className="btn btn-add"><span className="icon-add"></span>新增</a>
                    <div className="form-group fr mem-search">
                        <input type="text" className="fl pl15" placeholder="搜索单位名称" ref="memberName" onKeyUp={this.nameSearch} />
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                    </div>
                </div>
                <MemberTabel
                    key="4"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox", "编号", "客户名称", "区域", "代表", "主管", "地址", "商业客户", "拜访次数","门店类型","状态","操作"]}
                    dataKey={["id","customerName","areaName", "realName", "personInChargeName","address","chainCustomerName","visitsNumber","attributesName","status"]}
                    controlArr={[{conId: 2, conUrl: "customerDetails", callback: this.edit},{conId:3,conUrl:"chainCustomersInfo",callback:this.see},{conId:7,callback:this.customerDisable}]}
                    titlestyle={{
                        "styles4":{minWidth:"70px"},
                        "styles5":{minWidth:"70px"},
                        "styles6":{minWidth:"70px"},
                        "styles11":{minWidth:"70px"},
                        }}
                    />

                <div className="mem-footer row" key="5">
                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-md-11">
                        <Pagination current={this.state.pageNum} className="antd-page" showQuickJumper total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}/>
                    </div>
                </div>

                <Loading loading={this.state.loading} />
            </QueueAnim>
        );
    }
});


/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    handleChange: function (e) {
        this.props.even(this.props.keys, e.target.value);
    },
    render: function () {
        const {content} = this.props;
        return (
            <div className="mb15">
                <label className="gao-big-label">{this.props.tle}</label>
                <select className="form-control inlineBlock" onChange={this.handleChange} defaultValue={content} style={{width:"70%",minWidth:"200px"}}>
                    <option value="">--请选择--</option>
                    {this.props.options.map(function (data, i) {
                        return <option value={data.id} key={i + "po"}>{data.name}</option>
                    })}
                </select>
            </div>
        );
    }
});

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
