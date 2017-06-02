import React from 'react'
import MemberTabel from  '../react-utils/table'         /*表格组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import Modal from 'antd/lib/modal'                      /*antd 弹窗组件*/
import message from 'antd/lib/message'
import Upload from 'antd/lib/upload'                    /*antd 上传组件*/
import Select from 'antd/lib/select';                      /*antd select*/
import Dropdown from 'antd/lib/dropdown'
import Button from 'antd/lib/button'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
const Option = Select.Option;
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import Loading from '../react-utils/loading'         /*加载中组件*/


var object = new Object();
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
                $this.setState({btnLoading:false});
                $("#loading").addClass("none");
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
            showLine: 20,            /*显示行数*/
            dataLen: 0,              /*数据条数*/
            pageNum:1,                 /*页码默认选中值*/
            dataTab:[],              /*表格数据*/
            addVisible:false,        /*控制新增弹窗是否显示*/
            editVisible:false,       /*控制修改弹窗是否显示*/
            dataInfo:{},              /*资料详情*/
            deputy:[],                       /*选择人员数据*/
            dataArr:[],                  /*资料数据*/
            reset:Math.random() ,                    /*重置KEY的值*/
            memberName:"", //搜索关键字
            deletevisible:false,   /*删除弹窗是否显示*/
            deletestrData:{}, /* 获取所要删除的数据 */
            datatype:"1",  // 1.普通下拉数据 2.搜索关键字数据
        }
    },
    componentWillMount(){
        $("#loading").removeClass("none");

        if(Object.keys(object).length != 0){
            for (var key in object) {
                this.setState({[key]:object[key]});
            }
        }

        /*获取人员数据*/
        this.ajaxFn({"controlType":"query","id":1},function(data){
            this.setState({deputy:data.map.list});
        },'/otcdyanmic/employee.do');

        /*资料数据*/
        this.ajaxFn({"controlType":"queryAll","documentType":1},function(data){
            this.setState({dataArr:data.map.list});
        },"/otcdyanmic/documents.do");

    },/*跳页*/
    pageNumber(page){
        this.setState({loading:true,pageNum:page});
        this.ajaxFn({"controlType":"query","selectType":"educate","pageSize":this.state.showLine,"pageNumber":page,"documentName":this.state.memberName},function (data) {
            this.setState({dataTab:data.map.list});
        });
    },//关键字搜索
    nameSearch:function (e) {
        var e = e || window.event;
        if(e && e.keyCode==13 || e.type ==="click"){
            $("#loading").removeClass("none");
            var memberName = this.refs.memberName.value;
            this.ajaxFn({"controlType":"query","selectType":"educate","documentName":memberName,"pageSize":this.state.showLine,"pageNumber":1},function (data) {
                data.map.count == "0" ? message.warning("暂无数据！") : message.success("加载完成！");
                this.setState({
                    dataLen:data.map.count,
                    dataTab:data.map.list,
                    pageNum:1,
                    memberName:memberName,
                });
            })
        }
    },/*条件搜索*/
    termSearch(){
        $("#loading").removeClass("none");
        this.setState({memberName:""})
        this.ajaxFn({"controlType":"query","selectType":"educate","pageSize":20,"pageNumber":1,"employee_id":this.state.personnel,"document_id":this.state.dataId},function(data){
            this.setState({
                dataLen:data.map.count,
                dataTab:data.map.list,
                pageNum:1
            });
        });
    },/*新增确定*/
    addOk(){
        const {document_id,employee_id,play_nunmer_less_than,play_time_less_than} = this.state;
        if(document_id && employee_id && play_nunmer_less_than && play_time_less_than){
            this.setState({btnLoading:true},function(){
                this.ajaxFn({"controlType":"add","addType":"educate","document_id":document_id,"employee_id":employee_id,"play_nunmer_less_than":play_nunmer_less_than,"play_time_less_than":play_time_less_than},function (data) {
                    message.success("新增成功！");
                    this.setState({addVisible:false,reset:Math.random()});
                    /*刷新列表数据*/
                    this.ajaxFn({"controlType":"query","selectType":"educate","pageSize":20,"pageNumber":this.state.pageNum},function (data) {
                        this.setState({
                            dataTab:data.map.list,
                            dataLen:data.map.count
                        });
                    })
                })
            });
        }else{
            message.warning("请填写完整内容！");
        }
    },/*弹窗取消*/
    handleCancel(){
        object={};
        this.setState({addVisible:false,editVisible:false,dataInfo:{},reset:Math.random()});
    },/*打开修改弹窗*/
    editStore(e){
        this.setState({editVisible:true});
        var strData = $(e.currentTarget).attr("value");
        var employee_id = JSON.parse(strData).employee_id;
        var document_id = JSON.parse(strData).document_id;
        sessionStorage.setItem("TK_strData",strData);
        this.ajaxFn({"controlType":"load","loadType":"educate","employee_id":employee_id,"document_id":document_id},function (data) {
            object = data.map.info;
            this.setState({dataInfo:data.map.info});
        },)
    },/*修改确定*/
    editOk(){
        this.setState({btnLoading:true},function(){
            var strData = sessionStorage.getItem("TK_strData");
            object.controlType = "update";
            object.updateType = "educate";
            object.employee_id = JSON.parse(strData).employee_id;
            object.document_id = JSON.parse(strData).document_id;
            this.ajaxFn(object,function (data) {
                object={};
                message.success("修改成功！");
                this.setState({editVisible:false});
                /*刷新列表数据*/
                this.ajaxFn({"controlType":"query","selectType":"educate","pageSize":this.state.showLine,"pageNumber":this.state.pageNum},function (data) {
                    this.setState({dataTab:data.map.list});
                })
            })
        });
    },/*导出*/
    export(){
        this.ajaxFn({"controlType":"fileExport","exportType":"educate"},function (data) {
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
          $this.ajaxFn({"controlType": "fileImport","importType":"educate","fileName":fileName,"file":e.target.result}, function (data) {
              message.success(fileName+`导入成功。`);
              /*列表数据*/
              this.ajaxFn({"controlType":"query","selectType":"educate","pageSize":this.state.showLine,"pageNumber":1},function (data) {
                  this.setState({
                      dataTab:data.map.list,
                      dataLen:data.map.count,
                      pageNum:1
                  });
              })
          })
      };
    },/*多选选中,获取值*/
    option(key,valueArr){
        object[key] = valueArr.toString();
        this.setState({[key]:valueArr.toString()});
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
     var documentid=JSON.parse(this.state.deletestrData).document_id;
     var employeeid=JSON.parse(this.state.deletestrData).employee_id;
     this.ajaxFn({"controlType":"delete","deleteType":"educate","document_id":documentid,"employee_id":employeeid},function (data) {
      message.success("删除成功");
      this.setState({deletevisible:false,randomKey:Math.random()});
                    /*刷新列表数据*/
            /*刷新列表数据*/
                this.ajaxFn({"controlType":"query","selectType":"educate","pageSize":this.state.showLine,"pageNumber":this.state.pageNum},function (data) {
                    this.setState({
                      dataTab:data.map.list,
                      dataLen:data.map.count,
                        });
                })

    },'/otcdyanmic/appraisalConfig.do');
    },
    render(){
        return (
            <QueueAnim>
                <div className="operation" id="operation" style={{"paddingTop":"0"}} key="1">
                    <div className="inlineBlock vam">
                        <MultiSelect tle="考核人员" placeholder="请选择考核人员" options={this.state.deputy} typeName="personnel" even={this.option} content={object.personnel}  />
                    </div>
                    <div className="inlineBlock vam">
                        <MultiSelect tle="资料" placeholder="请选择资料" options={this.state.dataArr} typeName="dataId" even={this.option} content={object.dataId} />
                    </div>

                    <button type="button" className="btn btn-search" onClick={this.termSearch}>搜索</button>
                    <a href="javascript:void(0)" className="btn btn-add" onClick={()=>this.setState({addVisible:true})}><span className="icon-add"></span>新增</a>
                    <div className="form-group fr mem-search" style={{marginTop:"15px"}}>
                        <input type="text" className="fl pl15" placeholder="搜索资料名称" ref="memberName" onKeyUp={this.nameSearch} />
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                    </div>
                </div>
                <MemberTabel
                    key="2"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox","资料名称","考核人","播放次数不得低于","播放时长不得低于","操作"]}
                    dataKey={["documentName","employeeName","play_nunmer_less_than","play_time_less_than"]}
                    controlArr={[{conId:2,conClass:"cleflo",callback:this.editStore},{conId:1,conClass:"cleflo",callback:this.delete}]}

                />
                <div className="mem-footer row" key="3">
                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-md-11">
                        <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                    </div>
                </div>

                {/*新增弹窗*/}
                <Modal title="新增教育考核设置" visible={this.state.addVisible} onOk={this.addOk} onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.addOk}>确定</Button>,
                    ]}
                >
                    <GaoModalSelect key={this.state.reset+1} tle="资料" onChange={(val)=>this.setState({document_id:val})} options={this.state.dataArr}/>
                   {/*<GaoModalSelect key={this.state.reset+2} tle="考核人" onChange={(val)=>this.setState({employee_id:val})} className="mt10" options={this.state.deputy} /> */}
                    <MultiSelecttip tle="考核人" keyval={this.state.reset+2} placeholder="请选择考核人" options={this.state.deputy} typeName="employee_id" even={this.option} divStyle={{marginTop:"10px"}} selectStyle={{ "width": "419px" }}  />
                    <div className="row">
                        <div className="col-md-6"><AddInput key={this.state.reset} tle="播放次数大于" onChange={(val)=>this.setState({play_nunmer_less_than:val})} dataType="number"/></div>
                        <div className="col-md-6"><AddInput key={this.state.reset} tle="播放时长大于" onChange={(val)=>this.setState({play_time_less_than:val})} dataType="number"/></div>
                    </div>
                </Modal>


                {/*修改弹窗*/}
                <Modal title="修改教育考核设置" visible={this.state.editVisible} onOk={this.editOk} onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.editOk}>确定</Button>,
                    ]}
                >
                    <ProductName tle="资料：" content={this.state.dataInfo.documentName} />
                    <div className="mt10">

                        <ProductName tle="考核人：" content={this.state.dataInfo.employeeName} />

                    </div>
                    <div className="row">
                        <div className="col-md-6"><AddInput tle="播放次数大于" content={this.state.dataInfo.play_nunmer_less_than} onChange={(val) => object.play_nunmer_less_than = val} dataType="number"/></div>
                        <div className="col-md-6"><AddInput tle="播放时长大于" content={this.state.dataInfo.play_time_less_than} onChange={(val) => object.play_time_less_than = val} dataType="number"/></div>
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


var GaoModalSelect = React.createClass({
    handleChange(val){
        /*如果传入了键名那么就执行带有键名的方法*/
        if(this.props.keyName){
            this.props.onChange(this.props.keyName,val);
        }else{
            this.props.onChange(val);
        }
    },
    render(){
        const {className,tle,options,style,placeholder="请选择",size="large"} = this.props;
        return (
            <div className={"entrySelect "+className} style={style}>
                <label>{tle}</label>
                <Select showSearch size={size} style={{ width: 419 }} placeholder={placeholder} optionFilterProp="children" onChange={this.handleChange} >
                    {options.map(function (data,i) {
                        return <Option key={i} value={""+data.id}>{data.name}</Option>
                    })}
                </Select>
            </div>
        )
    }
});








var ProductName = React.createClass({
    render(){
        return (
            <div className="addselect">
                <label>{this.props.tle}</label>
                <p>{this.props.content}</p>
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
        var valIds = [];
        value.forEach(obj=>{
            var item = obj.split(";")[1];
            valIds.push(item);
        })
        this.props.even(this.props.typeName,valIds);
    },
    render:function(){
        const {tle,selectStyle={ "width": "200px" },divStyle,options,placeholder="请选择",content="",className=""} = this.props;
        return (
            <div className={"entrySelect "+this.props.className} style={this.props.divStyle}>
                <label>{this.props.tle}</label>
                <Select
                    multiple
                    size="large"
                    placeholder={placeholder}
                    style={this.props.selectStyle}
                    searchPlaceholder="标签模式"
                    onChange={this.handleChange}
                    key={this.props.keyval}
                >
                    {this.props.options.map(function (data,i) {
                        return <Option key={data.name+";"+data.id} title={data.name} >{data.name}</Option>
                    })}
                </Select>
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
        if(this.props.dataType == "number"){
            if(isNaN(e.target.value)){
                e.target.value  = e.target.value.substring(0,(e.target.value.length-1));    /*如果不是数字就把这次输入的值截取掉*/
                message.warning('只能输入数字！');
                return false;
            }
        }
        var val = e.target.value.replace(/(^\s*)|(\s*$)/g, "");
        object[this.props.typeName] = val;           /*这个是必须的，否则不能输入*/
        this.props.onChange(val);
        this.setState({first:false});
    },
    render(){
        if(this.state.first){
            object[this.props.typeName] = this.props.content;
        }
        return (
            <div className="addInput" id="editBox">
                <label>{this.props.tle}</label>
                <input defaultValue={object[this.props.typeName]} className="form-control clearinput" onChange={this.changeVal} />
            </div>
        );
    }
});
