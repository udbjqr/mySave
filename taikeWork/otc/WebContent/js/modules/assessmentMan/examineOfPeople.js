import React from 'react'
import MemberTabel from  '../react-utils/table'     /*表格组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message'              /*antd 提示组件*/
import Upload from 'antd/lib/upload'/*antd 上传组件*/
import Select from 'antd/lib/select';                      /*antd select*/
const Option = Select.Option;
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import Loading from '../react-utils/loading'         /*加载中组件*/
import Button from 'antd/lib/button'            /*按钮组件*/


var object = new Object();
var condition = new Object();
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/appraisalConfig.do') {
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
                $this.setState({btnLoading:false});
            },
            error(){
                $this.setState({btnLoading:false});
                $("#loading").addClass("none");
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    getInitialState:function(){
        return {
            btnLoading:false,            /*按钮等待状态*/
            dataTab:[],         /*表格数据*/
            suppliers:[],      /*供应商数据*/
            showLine: 20,       /*显示行数*/
            pageNum:1,          /*页码默认选中值*/
            dataLen: 0,         /*数据条数*/
            visible:false,       /*控制弹窗是否显示*/
            editVisible:false,     /*修改弹窗是否显示*/
            products:[],            /*产品列表数据*/
            productInfo:{},          /*单条产品信息*/
            personnelArr:[],                 /*考核人数据*/
            randomKey:0,
            memberName:"", //搜索关键字
            deletevisible:false,   /*删除弹窗是否显示*/
            deletestrData:{}, /* 获取所要删除的数据 */
            datatype:"1",  // 1.普通下拉数据 2.搜索关键字数据
            levelArr:[],                 /*门店类型数据*/

        }
    },
    componentWillMount(){
        $("#loading").removeClass("none");

        /*获取产品数据*/
        this.ajaxFn({"controlType":"assessGoods"},function (data) {
            this.setState({products:data.map.list});
        },'/otcdyanmic/goods.do');

        /*获取人员数据*/
        this.ajaxFn({"controlType":"query","id":1},function(data){
            this.setState({personnelArr:data.map.list});
        },'/otcdyanmic/employee.do');
       /*类型数据*/
        this.ajaxFn({"controlType":"queryAll"},function(data){
            this.setState({levelArr:data.map.data});
        },'/otcdyanmic/customerAttributes.do');
    },/*跳页*/
    pageNumber(page){
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"query","selectType":"employee","pageSize":this.state.showLine,"pageNumber":page,"employee_id":condition.employee_id,"goodsName":this.state.memberName},function (data) {
            this.setState({dataTab:data.map.list,pageNum:page});
        });
    },//关键字搜索
    nameSearch:function (e) {
        var e = e || window.event;
        if(e && e.keyCode==13 || e.type === "click"){
            $("#loading").removeClass("none");
            var memberName = this.refs.memberName.value;
            this.ajaxFn({"controlType":"query","selectType":"employee","goodsName":memberName,"pageSize":this.state.pageNum,"pageNumber":1},function (data) {
                if(data.map.count == "0"){
                    message.warning('没有相关产品！');
                }
                this.setState({
                    dataLen:data.map.count,
                    dataTab:data.map.list,
                    pageNum:1,
                    memberName:memberName,
                });
            })
        }
    },/*根据条件搜索*/
    termSearch(){
        $("#loading").removeClass("none");
        this.setState({ memberName:""})
        const {showLine,pageNum} = this.state;
        this.ajaxFn({"controlType":"query","selectType":"employee","pageSize":showLine,"pageNumber":1,"employee_id":condition.employee_id},function(data){
            this.setState({
                dataLen:data.map.count,
                dataTab:data.map.list,
                pageNum:1
            });
        });
    },/*提交新增*/
    handleOk(){
        if(object.good_id && object.display_surface&& object.employee_id && object.display_number && object.weighted_price && object.attributes_id){
            this.setState({btnLoading:true},function(){
                object.controlType = "add";
                object.addType = "employee"
                this.ajaxFn(object,function (data) {
                    object = {};
                    message.success("新增成功！");
                    this.setState({visible:false,productInfo:{},randomKey:Math.random()});
                    /*刷新列表数据*/
                    this.ajaxFn({"controlType":"query","selectType":"employee","pageSize":this.state.showLine,"pageNumber":this.state.pageNum},function (data) {
                        this.setState({
                            dataTab:data.map.list,
                            dataLen:data.map.count
                        });
                    })
                });
            });
        }else{
            message.warning("请填写的完整内容！");
        }
    },/*关闭弹窗*/
    handleCancel(){
        object={};
        this.setState({visible:false,editVisible:false,productInfo:{},randomKey:Math.random()});
    },/*打开修改产品*/
    edit(e){
        var strData= $(e.currentTarget).attr("value");
        var goodId = JSON.parse(strData).good_id;
        var employee_id = JSON.parse(strData).employee_id;
        sessionStorage.setItem("TK_strData",strData);
        this.ajaxFn({"controlType":"load","loadType":"employee","good_id":goodId,"employee_id":employee_id},function (data) {
            object = data.map.info;
            this.setState({productInfo:data.map.info,editVisible:true});
        },)
    },/*修改提交*/
    eidtOk(){
        /*存储的对象*/
        this.setState({btnLoading:true},function(){
            var strData = sessionStorage.getItem("TK_strData");
            object.controlType = "update";
            object.updateType = "employee";
            object.good_id = JSON.parse(strData).good_id;
            object.employee_id = JSON.parse(strData).employee_id;
            this.ajaxFn(object,function (data) {
                object={};
                message.success("修改成功！");
                this.setState({editVisible:false});
                /*刷新列表数据*/
                this.ajaxFn({"controlType":"query","selectType":"employee","pageSize":this.state.showLine,"pageNumber":this.state.pageNum},function (data) {
                    this.setState({dataTab:data.map.list,});
                })
            });
        });
    },/*导出*/
    export(){
        this.ajaxFn({"controlType":"fileExport","exportType":"employee"},function (data) {
            if(data.map.filePath){
                message.success(data.map.msg);
                 window.location.href = data.map.filePath;
            }else{
                 message.warning(data.map.msg);
            }
        });
    },/*上传文件方法*/
    fileHandle(e){
          var $this = this;
          var reader = new FileReader();
          var fileName = e.target.files[0].name;
          reader.readAsDataURL(e.target.files[0]);
          reader.onload = function(e){
              $this.ajaxFn({"controlType": "fileImport","importType":"employee","fileName":fileName,"file":e.target.result}, function (data) {
                  message.success(fileName+`导入成功。`);
                  /*列表数据*/
                  this.ajaxFn({"controlType":"query","selectType":"employee","pageSize":this.state.pageNum,"pageNumber":1},function (data) {
                      this.setState({
                          dataTab:data.map.list,
                          dataLen:data.map.count,
                          pageNum:1
                      });
                  });
              })
          };
    },/*多选选中,获取值*/
    option(key,valueArr){
        condition.employee_id = valueArr.toString();
    },/*多选选中,获取值*/
    tipoption(key,valueArr){
        if(Array.isArray(valueArr) && valueArr.length != 0){
            var valArr = [];
            valueArr.forEach(function(data){
                valArr.push(data.split(";")[1]);
            });
            object.employee_id=valArr.toString();
           // this.setState({[key]:valArr.toString()});
        }else{
            object.employee_id="";
            //this.setState({[key]:""});
        }
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
     var goodid=JSON.parse(this.state.deletestrData).good_id;
     var employeeid=JSON.parse(this.state.deletestrData).employee_id;
    this.ajaxFn({"controlType":"delete","deleteType":"employee","good_id":goodid,"employee_id":employeeid},function (data) {
      message.success("删除成功");
      this.setState({deletevisible:false,randomKey:Math.random()});
                    /*刷新列表数据*/
            this.ajaxFn({"controlType":"query","selectType":"employee","pageSize":this.state.showLine,"pageNumber":this.state.pageNum,"employee_id":condition.employee_id},function(data){
            this.setState({
                dataLen:data.map.count,
                dataTab:data.map.list,
                pageNum:1
            });
        });

    },'/otcdyanmic/appraisalConfig.do');
    },
   render(){
       return (
           <QueueAnim>
               <div className="operation" id="operation" style={{"paddingTop":"0"}} key="1">
                    <div className="inlineBlock mb15 vam">
                    <MultiSelect tle="考核人" placeholder="请选择考核人" options={this.state.personnelArr} typeName="employee_id" even={this.option} content={condition.employee_id}  />
                    </div>
                   <button type="button" className="btn btn-search mb15" onClick={this.termSearch}>搜索</button>
                   <a href="javascript:void(0)" className="btn btn-add mb15" onClick={() => this.setState({visible:true})}><span className="icon-add"></span>新增</a>
                   <div className="form-group fr mem-search">
                       <input type="text" className="fl pl15" placeholder="搜索产品名" ref="memberName" onKeyUp={this.nameSearch} />
                       <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                   </div>
               </div>
               <MemberTabel
                   key="2"
                   dataTable={this.state.dataTab}
                   controlArr={[{conId:2,conClass:"cleflo",callback:this.edit},{conId:1,conClass:"cleflo",callback:this.delete}]}
                   titleName={["checkbox","编号/产品/规格","供应商","类型","考核人","陈列面","陈列数","平均加价权","操作"]}
                   dataKey={["good_id/goods_name/specification","supplier","attributes_name","employeeName","display_surface","display_number","weighted_price"]}

               />
               <div className="mem-footer row" key="3">
                   <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                   <div className="col-md-11">
                       <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                   </div>
               </div>






               <Modal title="新增人员考核设置" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}
                   footer={[
                       <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
                       <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.handleOk}>确定</Button>,
                   ]}
               >
                    <div className="entrySelect">
                        <label>选择产品</label>
                        <Select
                            key={this.state.randomKey}
                            showSearch
                            size="large"
                            style={{ width: 419 }}
                            optionFilterProp="children"
                            onChange={(val) => object.good_id = val}
                            placeholder="请选择"
                        >
                            {this.state.products.map(function (data,i) {
                                return <Option key={i} title={data.goodsName+" —— "+data.specification} value={""+data.goodsId}>{data.goodsName+" —— "+data.specification}</Option>
                            })}
                        </Select>
                    </div>
                    <div className="entrySelect mt15">
                    <MultiSelecttip tle="考核人员" keyval={this.state.randomKey} placeholder="请选择考核人员" options={this.state.personnelArr} typeName="employee_id" even={this.tipoption} divStyle={{marginTop:"10px"}} selectStyle={{ "width": "419px" }}  />
                   </div>
                    <div className="entrySelect mt15">
                       <label>门店类型</label>
                       <Select
                            key={this.state.randomKey}
                           showSearch
                           size="large"
                           style={{ width: 419 }}
                           optionFilterProp="children"
                           onChange={(val)=>object.attributes_id = val}
                           placeholder="请选择"
                       >
                           {this.state.levelArr.map(function (data,i) {
                               return <Option key={i+"and_option"} value={""+data.id}>{data.name}</Option>
                           })}
                       </Select>
                   </div>
                   <div className="row">
                       <div className="col-md-6"><AddInput key={this.state.randomKey} tle="陈列面" typeName="display_surface" /></div>
                       <div className="col-md-6"><AddInput key={this.state.randomKey} tle="陈列数" typeName="display_number" /></div>
                   </div>
                   <div className="row">
                       <div className="col-md-6"><AddInput key={this.state.randomKey} tle="平均加权价" typeName="weighted_price" /></div>
                   </div>
               </Modal>



               <Modal title="修改人员考核设置" visible={this.state.editVisible} onOk={this.eidtOk} onCancel={this.handleCancel} >
                    <ProductName tle="考核产品：" content={this.state.productInfo.goodName}  />
                    <ProductName className="mt10" tle="考核人员：" content={this.state.productInfo.employeeName}  />
                    <div className="row">
                        <div className="col-md-6"><AddInput tle="陈列面" typeName="display_surface" content={this.state.productInfo.display_surface}  /></div>
                        <div className="col-md-6"><AddInput tle="陈列数" typeName="display_number" content={this.state.productInfo.display_number} /></div>
                    </div>
                    <div className="row">
                        <div className="col-md-6"><AddInput tle="平均加权价" typeName="weighted_price" content={this.state.productInfo.weighted_price} /></div>
                    </div>
               </Modal>
                <Modal title="提示" visible={this.state.deletevisible} onOk={this.todelete} onCancel={this.modalOff}>
                    <p>是否确认删除此条数据</p>
                </Modal>
               <Loading loading={this.state.loading} />
           </QueueAnim>
       );
   }
});








/*显示详情*/
var ProductName = React.createClass({
    render(){
        const {className} = this.props;
        return (
            <div className={"addselect "+className}>
                <label>{this.props.tle}</label>
                <p>{this.props.content}</p>
            </div>
        );
    }
});



/*弹窗新增input*/
var AddInput = React.createClass({
    getInitialState(){
        return{
            first:true,
        }
    },
    changeVal(e){
        if(!isNaN(e.target.value)){
            object[this.props.typeName] = e.target.value;
        }else{
            object[this.props.typeName] = e.target.value.replace(/\D/gi,"");
            message.warning('只能输入数字！');
        }
        this.setState({first:false});
    },
    render(){
        if(this.state.first){
            object[this.props.typeName] = this.props.content;
        }
        return (
            <div className="addInput" id="editBox">
                <label>{this.props.tle}</label>
                <input value={object[this.props.typeName]} className="form-control clearinput" onChange={this.changeVal} />
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

/*select 多选组件，参数：标题，option数组对象*/

var MultiSelecttip = React.createClass({
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
            <div className={"entrySelect "+this.isnull(this.props.className)} style={this.props.divStyle}>

               {this.isnull(this.props.tle)==""?"":<label>{this.props.tle}</label>}
                <Select
                    multiple
                    size="large"
                    placeholder={this.isnull(this.props.placeholder)==""?"请选择":this.props.placeholder}
                    style={this.props.selectStyle}
                    searchPlaceholder="标签模式"
                    onChange={this.handleChange}
                    key={this.isnull(this.props.keyval)}
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
