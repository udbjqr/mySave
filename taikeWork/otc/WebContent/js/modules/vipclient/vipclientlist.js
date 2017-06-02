
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
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/vipCustomer.do') {
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
            dataType:"1",  //显示类型，1：下拉选择数据，2：关键字搜索数据
            employee_id:"",//代表id
            customer_type:"",//客户类型
            deletevisible:false,   /*删除弹窗是否显示*/
            deletestrData:{}, /* 获取所要删除的数据 */
        };
    },
    componentDidMount:function(){
        //进入时初始化
        this.getinfo(1,1)
        
        /*进入时请求地区数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({regionArr:data.map.data});
        },'/otcdyanmic/areaDivision.do');

        /*请求负责代表*/
        this.ajaxFn({"controlType":"query","id":1},function (data) {
            this.setState({personInChargeId:data.map.list});
        },'/otcdyanmic/employee.do');
    },/* 获取初始数据 */
    getinfo:function(type,page,showLine){
      type=isnull(type)==""?1:type;
      page=isnull(page)==""?this.state.pageNum:page;
      showLine=isnull(showLine)==""?this.state.showLine:showLine;
      var Object={};
      Object.controlType="query";
      Object.pageSize=showLine;
      Object.pageNumber=page;
      Object.area_id=isnull(type)==1?this.state.area_id:"";
      Object.principal_id=isnull(type)==1?this.state.employee_id:"";
      Object.customer_type=isnull(type)==1?this.state.customer_type:"";
      Object.name=isnull(type)==2?this.state.memberName:"";
      this.ajaxFn(Object,function (data) {
           message.success("获取初始数据成功！"); 
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count
            });
    });
    }, /*跳页*/ 
    pageNumber:function(page){
        this.setState({loading:true,pageNum:page});
         
         this.getinfo(this.state.dataType,page)
    },//行数选中回调函数
    lineNumber:function (obj) {
        var num = obj.key * 1;
        $("#loading").removeClass("none");
        this.getinfo(1,1,num)
    },//关键字搜索
    nameSearch:function (e) {
        var e = e || window.event;
        if((e && e.keyCode==13) || e.type == "click"){ // enter 键
            $("#loading").removeClass("none");
            var memberName = this.refs.memberName.value;
             this.setState({
             dataType:2,
            memberName:this.refs.memberName.value
            },function(){
             this.getinfo(2,1)
            })
           
        }
    },/*查看详情*/
    seeInfo(e){
        var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
    },/*条件搜索*/
    searchAllRegion(){
        this.setState({
         dataType:1,
         })
         this.getinfo(1,1)
        
    },/*多选选中,获取值*/
    option1(key,valueArr){
        if(Array.isArray(valueArr) && valueArr.length != 0){
            var valArr = [];
            valueArr.forEach(function(data){
                valArr.push(data.split(";")[1]);
            });
           this.setState({[key]:valArr.toString()});
           
           
        }else{
            this.setState({[key]:""});
           
          
        }
        
    },
    flagoption(key,valueArr){
    object[key] = valueArr.split(";")[1];
    },/*删除 */
   delete:function(e){
       this.setState({
           deletestrData:$(e.currentTarget).attr("value")
       })
       var deletestrData = $(e.currentTarget).attr("value");
       this.setState({
       deletevisible:true,
       })
     console.log("deletestrData:"+deletestrData)
   },
   modalOff:function(){
    this.setState({
       deletevisible:false,
       })
    },/* 确认删除  */
    todelete:function(){
     var id=JSON.parse(this.state.deletestrData).id;
    this.ajaxFn({"controlType":"delete","id":id},function (data) {
      message.success("删除成功");
      this.setState({deletevisible:false,randomKey:Math.random()});
                    /*刷新列表数据*/
                   this.getinfo(this.state.dataType)

    },'/otcdyanmic/vipCustomer.do');
    },//导出
    export: function () {
        this.ajaxFn({ "controlType": "fileExport"}, function (data) {
            if (data.map.filePath) {
                message.success(data.map.msg);
                window.location.href = data.map.filePath;
            } else {
                message.warning(data.map.msg);
            }
        }, "/otcdyanmic/vipCustomer.do");
    },
    render:function(){
        return (
            <QueueAnim>
                <div className="mb-title" key="1">vip客户管理{this.state.area_id}</div>
                <div className="row mt15" key="2">
                    <div className="col-sm-12 col-md-6 col-lg-4 mb15" style={{width:"270px"}}>
                        <MultiSelect tle="区域"  placeholder="请选择区域" typeName="area_id"  options={this.state.regionArr} even={this.option1}   divStyle={{width:"260px",minWidth:"100px"}} selectStyle={{ "width": "200px" }}  />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 mb15"  style={{width:"270px"}}>
                       <MultiSelect tle="负责人"  placeholder="请选择负责人" typeName="employee_id"  options={this.state.personInChargeId} even={this.option1}   divStyle={{width:"260px",minWidth:"100px"}} selectStyle={{ "width": "200px" }}  />
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 mb15"  style={{width:"280px"}}>
                       <MultiSelect tle="客户类型" placeholder="请选择客户类型" options={[{"name":"一星","id":"1"},{"name":"二星","id":"2"}]} typeName="customer_type" even={this.option1} divStyle={{width:"280px",minWidth:"100px"}} selectStyle={{ "width": "200px" }}  />
                    </div>
                     
                    <div className="col-sm-12 col-md-6 col-lg-4 mb15"  style={{width:"90px"}}>
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
                    <a href="#addvipclient" className="btn btn-add"><span className="icon-add"></span>新增</a>
                      <a href="javascript:void(0)" style={{ marginLeft: "10px" }} className="btn btn-search" onClick={this.export}>导出</a>
                    <div className="form-group fr mem-search">
                        <input type="text" className="fl pl15" placeholder="搜索客户名" ref="memberName" onKeyUp={this.nameSearch} />
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                    </div>
                </div>
                <MemberTabel
                    key="4"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox","编号","客户名称","负责人","区域","责任主管","地址","客户类型","联系次数","操作"]}
                    dataKey={["id","customer_name","principal","area_name","person_in_charge_name","address","customer_type","relation_count"]}
                    controlArr={[{conId:3,conUrl:"vipclientinfo",callback:this.seeInfo},{conId:1,callback:this.delete}]}
                />
                <div className="mem-footer row"  key="5">
                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-md-11">
                        <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                    </div>
                </div>
                <Modal title="提示" visible={this.state.deletevisible} onOk={this.todelete} onCancel={this.modalOff}>
                    <p>是否确认删除此条数据</p>
                </Modal>
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
    },/*去除""或undefind null*/
    isnull:function(str) {
     if (str == null || str == undefined || str == "undefined") {
        return "";
    }
    else {
       return str;
    }
    },
    render:function(){
        var $this=this;
       
        return (
            <div className={"suppliers form-inline "+this.isnull(this.props.className)} style={this.props.divStyle}>
               
               {this.isnull(this.props.tle)==""?"":<label style={{"padding":"0 5px",marginRight:"5px",width:"auto"}}>{this.props.tle}</label>} 
                <Select
                    size="large"
                    placeholder={this.isnull(this.props.placeholder)==""?"请选择":this.props.placeholder}
                    style={this.props.selectStyle}
                    searchPlaceholder="标签模式"
                    onChange={this.handleChange}
                >
                    {this.props.options.map(function (data,i) {
                         var todata=$this.isnull($this.props.todata)==""?"":"—"+data[$this.props.todata];
                        return <Option key={data.name+";"+data.id} title={data.name+todata} >{data.name+todata}</Option>
                    })}
                </Select>
            </div>
        );
    }
});
/*select 多选组件，参数：标题，option数组对象*/
/*
typeName: 下拉选择获取的数据集的状态名
className：最外层div的className
divStyle :最外层div的Style
tle:左边label的值，可以为空，为空时不显示label
placeholder：输入框的默认提示
selectStyle：下拉框的Style
todata：除id和name之外要显示的其他字段名
options：ajax数据
*/
var MultiSelect = React.createClass({
    handleChange:function (value) {
        this.props.even(this.props.typeName,value);
    },/*去除""或undefind null*/
    isnull:function(str) {
     if (str == null || str == undefined || str == "undefined") {
        return "";
    }
    else {
       return str;
    }
    },
    render:function(){
        var $this=this;
       
        return (
            <div className={"suppliers form-inline "+this.isnull(this.props.className)} style={this.props.divStyle}>
               
               {this.isnull(this.props.tle)==""?"":<label style={{"padding":"0 5px",marginRight:"5px",width:"auto"}}>{this.props.tle}</label>} 
                <Select
                    multiple
                    size="large"
                    placeholder={this.isnull(this.props.placeholder)==""?"请选择":this.props.placeholder}
                    style={this.props.selectStyle}
                    searchPlaceholder="标签模式"
                    onChange={this.handleChange}
                >
                    {this.props.options.map(function (data,i) {
                         var todata=$this.isnull($this.props.todata)==""?"":"—"+data[$this.props.todata];
                        return <Option key={data.name+";"+data.id} title={data.name+todata} >{data.name+todata}</Option>
                    })}
                </Select>
            </div>
        );
    }
});
/*
去除""或undefind null
*
*
*/

function isnull(str) {
    if (str == null || str == undefined || str == "undefined") {
        return "";
    }
    else {
        return str;
    }
}