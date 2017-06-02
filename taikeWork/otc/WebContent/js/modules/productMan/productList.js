import React from 'react'
import MemberTabel from  '../react-utils/table.js'  /*表格组件*/
import Loading from '../react-utils/loading'         /*加载中组件*/
import message from 'antd/lib/message'              /*antd 提示组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import Select from 'antd/lib/select';                      /*antd select*/
const Option = Select.Option;
import Pagination from 'antd/lib/pagination';                  /*分页组件*/
import Menu from 'antd/lib/menu'
import Dropdown from 'antd/lib/dropdown'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Input from 'antd/lib/input'
import classNames from 'classnames';
const InputGroup = Input.Group;
import Popconfirm from 'antd/lib/popconfirm'        /*气泡确定*/
import '../../../less/tablePage.less'               //样式



var object = new Object();
var options = new Object();
var selectedId = "";
var entryTime = null;
/*通用表格页面*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/goods.do') {
        var $this = this;
        $.ajax({
            type:"post",
            url:javaUrl,
            data:{paramMap:JSON.stringify(data)},
            dataType: "json",
            timeout:5000,
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
            dataTab: [],
            showLine: 20,       /*显示行数*/
            dataLen: 0,         /*总数据条数*/
            pageNum:1,             /*默认选中页数*/
            suppliers:[],       //初始化select数据
            visible:false,       /*新增弹窗*/
            popVisible:false,       /*气泡窗口是否显示*/
            searchList:[],       /*搜索列表*/
            modalKey:true,       /*弹窗key状态*/
            keyIndex:0,           /*新增搜索的选中索引值*/
            memberName:"", //搜索关键字
            isAssess:"",//考核状态  1、正常 0、停用
            flag:""  //状态    1、正常 0、停用
        }
    },
    componentWillMount:function(){

        /*获取供应商数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({suppliers:data.map.list});
        },'/otcdyanmic/supplier.do');

        if(options){
            console.log(options);
            this.setState({conditionObj:options});
        }

    },//行数选中回调函数
    lineNumber:function (obj) {
        var num = obj.key * 1;
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"query","pageSize":num,"pageNumber":1},function (data) {
            this.setState({
                showLine:num,
                dataTab:data.map.data,
                pageNum:1
            });
        });
    },/*跳页*/
    pageNumber(page){
        this.setState({pageNum:page});
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"query","name":this.state.memberName,"pageSize":this.state.showLine,"pageNumber":page,isAssess:this.state.isAssess,flag:this.state.flag},function (data) {
            this.setState({dataTab:data.map.data});
        });
    },//关键字搜索
    nameSearch:function (e) {
        var e = e || window.event;
        if((e && e.keyCode==13) || e.type == "click"){ // enter 键
            $("#loading").removeClass("none");
            var memberName = this.refs.memberName.value==""?"":this.refs.memberName.value.replace("，",",");
            this.ajaxFn({"controlType":"query","name":memberName,"pageSize":this.state.showLine,"pageNumber":1},function (data) {
                if(data.map.count == "0"){
                    message.warning('没有相关产品！');
                }
                this.setState({
                    dataTab:data.map.data,
                    dataLen:data.map.count,
                    pageNum:1,
                    memberName:memberName
                });
            })
        }
    },//搜索-按下拉选择框进行搜索
    tj_search:function () {
        $("#loading").removeClass("none");
        this.setState({memberName:""});
        options.controlType = "query";
        options.pageSize = 20;
        options.pageNumber = 1;
        this.ajaxFn(options,function (data) {
            data.map.count == "0" ? message.warning("暂无数据！") : message.success("加载完成！");
            this.setState({
                dataTab:data.map.data,
                dataLen:data.map.count,
                pageNum:1
            });
        });
    },//导出
    export:function () {
        this.ajaxFn({"controlType":"fileExport"},function (data) {
            if(data.map.filePath){
                message.success(data.map.msg);
                window.location.href = data.map.filePath;
            }else{
                message.warning(data.map.msg);
            }
        });
    },/*修改编辑*/
    edit(e){
        var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
    },/*点击查看详情,缓存ID*/
    see(e){
        var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
    },/*打开弹窗新增产品ID*/
    addId(){
        this.setState({visible:true});
    },/*取消新增*/
    handleCancel(){
        var mark = !this.state.modalKey;
        selectedId = '';
        this.setState({visible:false,searchList:[],modalKey:mark});
    },/*提交新增*/
    handleOk(){

    },/*输入框时时查询*/
    changeVal(e,flag){
        this.setState({
         memberName:"",
         })
        if(e && e.keyCode==13 || flag){ //回车键提交
            var val = (typeof e === "object") ? e.target.value.replace(/\s+/g,"") : e.replace(/\s+/g,"");
            if(val != ""){
                this.ajaxFn({"controlType":"queryGoodsInfo","name":val,"pageSize":10,"pageNumber":1},function (data) {
                    if(data.map.data.length != 0){
                        this.setState({searchList:data.map.data},function(){
                            selectedId = $("#tableBody").find("tr").eq(this.state.keyIndex).find("td").eq(0).html();
                        });
                    }else {
                        message.warning("暂无数据！")
                        return false;
                    }
                })
            }else{
                this.setState({searchList:[]});
            }
        }else if(e && e.keyCode==38 ){ // up键
            var num = (this.state.keyIndex - 1) <= 0 ? 0 : this.state.keyIndex - 1;
            this.setState({keyIndex:num},function(){
                selectedId = $("#tableBody").find("tr").eq(num).find("td").eq(0).html();
                $("#tableBody").find("tr").removeClass("pitch-table").eq(num).addClass("pitch-table");
            });
        }else if(e && e.keyCode==40){//down键
            var num = this.state.keyIndex + 1 >= (this.state.searchList.length-1) ? (this.state.searchList.length-1) : this.state.keyIndex + 1 ;
            this.setState({keyIndex:num},function(){
                selectedId = $("#tableBody").find("tr").eq(num).find("td").eq(0).html();
                $("#tableBody").find("tr").removeClass("pitch-table").eq(num).addClass("pitch-table");
            });
        }
    },/*鼠标选中新增表格行*/
    trOn(e){
        var thIndex = $("#tableBody").find("tr").index($(e.currentTarget));
        this.setState({keyIndex:thIndex},function(){
            $("#tableBody").find("tr").removeClass("pitch-table").eq(thIndex).addClass("pitch-table");
            selectedId = $("#tableBody").find("tr").eq(thIndex).find("td").eq(0).html();
        });
    },/*新增在次确定*/
    inTimeConfirm(){
        if(selectedId){
            this.ajaxFn({"controlType":"add","id":selectedId},function (data) {
                selectedId = '';
                message.success('新增成功');
                var mark = !this.state.modalKey;
                this.setState({visible:false,searchList:[],modalKey:mark,keyIndex:0});
                /*重新渲染列表*/
                this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":this.state.pageNum},function (data) {
                    this.setState({
                        dataTab:data.map.data,
                        dataLen:data.map.count
                    });
                });
            })
        }
    },/*气泡窗口显示隐藏回调*/
    popconfirmVisible(visible){
        if(visible){
            if (selectedId) {
                this.setState({popVisible:visible});
            }else{
                message.warning('请先选择产品！');
            }
        }else{
            this.setState({popVisible:visible});
        }
    },/*多选选中,获取值*/
    option(key,valueArr){
        options[key] = valueArr.toString();
    },
    render:function(){
        var $this = this;
        return (
            <QueueAnim delay={300} >
                    <div className="mb-title" key="1" >产品列表</div>
                    <div className="row mt15" key="2">
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3" >
                            <MultiSelect className="mb15" tle="供应商" typeName="supplierId" options={this.state.suppliers} even={this.option} content={this.state.conditionObj.supplierId}/>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3" >
                            <SingleSelect className="mb15" tle="考核" options={[{"id":1,"name":"是"},{"id":0,"name":"否"}]} typeName="isAssess" even={this.option}  content={this.state.conditionObj.isAssess} />
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3" >
                            <SingleSelect className="mb15" tle="状态" options={[{"id":1,"name":"正常"},{"id":0,"name":"停用"}]}  typeName="flag" even={this.option}  content={this.state.conditionObj.flag} />
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3" >
                            <label className="gao-label" style={{height:"24px",width:"5px",minWidth:"5px",margin:"0px",display:"block",float:"left"}}></label>
                            <button type="button" className="btn btn-search" onClick={this.tj_search} style={{margin:"0px",display:"block",float:"left"}}>搜索</button>
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
                            <Button type="ghost" style={{height:"34px"}}>
                                {this.state.showLine} <Icon type="circle-o-down" />
                            </Button>
                        </Dropdown>
                        <a href="javascript:void(0)" className="btn btn-search" onClick={this.export}>导出</a>
                        <a href="javascript:void(0)" className="btn btn-add" onClick={this.addId}><span className="icon-add"></span>新增</a>
                        <div className="form-group fr mem-search">
                            <input type="text" style={{width:"200px"}} className="fl pl15" placeholder="搜索产品名、供应商、产品ID" ref="memberName" onKeyUp={this.nameSearch} />
                            <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                        </div>
                    </div>

                    <MemberTabel
                        key="4"
                        dataTable={this.state.dataTab}
                        titleName={["checkbox","ID号/品名/规格","供应商","库存","批发价","是否考核","状态","操作"]}
                        dataKey={["id/goodsName/specification","supplier","goodsqty","sellingPrice","isAssess","status"]}
                        controlArr={[{conId:2,conUrl:"modifyProduct",callback:this.edit},{conId:3,conUrl:"productDetails",callback:this.see}]}
                         titlestyle={{

                        "styles7":{minWidth:"60px"},

                        }}
                    />

                    <div className="mem-footer row mb10 p-l-r"  key="5">
                        <div className="col-sm-12 col-lg-1">共<span>{this.state.dataLen}</span>条</div>
                        <div className="col-sm-12 col-lg-11">
                            <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                        </div>
                    </div>


                <Modal title="新增产品" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} width={700}
                        footer={[
                            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
                            <Popconfirm  title="确认新增该产品吗?" onConfirm={this.inTimeConfirm} onCancel={this.cancel} onVisibleChange={this.popconfirmVisible} visible={this.state.popVisible}>
                                <Button key="submit" type="primary" size="large" onClick={this.handleOk}>确定</Button>
                            </Popconfirm>
                          ]}
                >
                    <div className="row">
                        <div className="col-md-12"><SearchInput key={this.state.modalKey} tle="新增产品" typeName="display_number" onKeyUp={this.changeVal} /></div>
                    </div>
                    <div className="row mt30">
                        <div className="col-lg-12">
                            <table className="table">
    							<thead>
    								<tr>
    									<th>ID</th>
    									<th>产品名</th>
    									<th>规格</th>
    									<th>厂家</th>
    								</tr>
    							</thead>
    							<tbody id="tableBody">
                                    {this.state.searchList.map(function(obj,i){
                                            return (
                                                <tr key={i} className={i==0?"pitch-table":""} onClick={$this.trOn}>
                                                    <td>{obj.goodsId}</td>
                                                    <td>{obj.goodsName}</td>
                                                    <td>{obj.specification}</td>
                                                    <td>{obj.supplierName}</td>
                                                </tr>
                                            )
                                    })}
    							</tbody>
    						</table>
                        </div>
                    </div>
                </Modal>


                <Loading loading={this.state.loading} />
            </QueueAnim>
        );
    }
});

/*输入搜索框组件*/
const SearchInput = React.createClass({
  getInitialState() {
    return {
      value: '',
      focus: false,
    };
  },
  handleInputChange(e) {
    this.setState({
      value: e.target.value,
    });
  },
  handleFocusBlur(e) {
    this.setState({
      focus: e.target === document.activeElement,
    });
  },
  handleSearch() {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(this.state.value,true);
    }
  },
  render() {
    const btnCls = classNames({
      'ant-search-btn': true,
      'ant-search-btn-noempty': !!this.state.value.trim(),
    });
    const searchCls = classNames({
      'ant-search-input': true,
      'ant-search-input-focus': this.state.focus,
    });
    return (
        <div>
            <label className="product-label">{this.props.tle}</label>
            <div className="ant-search-input-wrapper" style={{ width:604,float:"right" }}>
                <InputGroup className={searchCls}>
                    <Input size="large" placeholder={this.props.placeholder} value={this.state.value} onChange={this.handleInputChange}
                    onFocus={this.handleFocusBlur} onBlur={this.handleFocusBlur} onKeyUp={this.props.onKeyUp}
                />
                <div className="ant-input-group-wrap">
                    <Button icon="search" className={btnCls} size="large" onClick={this.handleSearch} />
                </div>
                </InputGroup>
            </div>
        </div>

    );
  },
});

/*select 组件，参数：标题，option数组对象*/
var SingleSelect = React.createClass({
    handleChange:function (value) {
        this.props.even(this.props.typeName,value);
    },
    render:function(){
        const {tle,selectStyle={ "width": "200px" },divStyle,options,placeholder="请选择",content,className=""} = this.props;
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
        const {tle,selectStyle={ "width": "200px" },divStyle,options,placeholder="请选择",content="",className=""} = this.props;
        var haveContent = content ? content.split(","):[];
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

/*弹窗新增input*/
var AddInput = React.createClass({
    getDefaultProps(){
        return {
            mark:true
        }
    },
    render(){
        return (
            <div>
                <label className="product-label">{this.props.tle}</label>
                <SearchInput key={this.props.mark} size="large" search onSearch={this.props.onKeyUp}  style={{ width:604,float:"right"}} />
            </div>
        );
    }
});
