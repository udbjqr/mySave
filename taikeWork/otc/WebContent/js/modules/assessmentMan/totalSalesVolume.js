import React from 'react'
import MemberTabel from  '../react-utils/table'     /*表格组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message'              /*antd 提示组件*/
import Select from 'antd/lib/select';                      /*antd select*/
import Dropdown from 'antd/lib/dropdown'
import Button from 'antd/lib/button'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
const Option = Select.Option;
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import Loading from '../react-utils/loading'         /*加载中组件*/


var object = new Object();
var product = '';
export default React.createClass({
    //ajax 封装``
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
            showLine: 20,           /*显示行数*/
            dataLen: 0,             /*数据条数*/
            pageNum:1,              /*页码默认选中值*/
            dataTab:[],             /*表格数据*/
            products:[],            /*考核产品数据*/
            deputy:[],              /*考核人数据*/
            productInfo:[],         /*单条产品信息*/
            addVisible:false,       /*控制新增弹窗是否显示*/
            editVisible:false,       /*控制修改弹窗是否显示*/
            customers:[],            /*普通门店*/
            chainCustomerId:[],       /*连锁门店*/
            levelArr:[],                /*门店规模数据*/
            reset:0,                     /*重置组件的key*/
            deletevisible:false,   /*删除弹窗是否显示*/
            deletestrData:{}, /* 获取所要删除的数据 */
            datatype:"1",  // 1.普通下拉数据 2.搜索关键字数据
        }
    },
    componentWillMount(){

        if(Object.keys(object).length != 0){
            for (var key in object) {
                this.setState({[key]:object[key]});
            }
        }

        $("#loading").removeClass("none");

        /*获取考核产品数据*/
        this.ajaxFn({"controlType":"assessGoods"},function (data) {
            this.setState({products:data.map.list});
        },'/otcdyanmic/goods.do');

        /*获取考核人员数据*/
        this.ajaxFn({"controlType":"query","id":1},function(data){
            this.setState({deputy:data.map.list});
        },'/otcdyanmic/employee.do');

        /*普通门店*/
        this.ajaxFn({"controlType": "queryAll"}, function (data) {
            this.setState({customers: data.map.list});
        }, '/otcdyanmic/customer.do');

        /*连锁门店*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({chainCustomerId:data.map.list});
        },'/otcdyanmic/chainCustomer.do');

        /*门店规模数据*/
        this.ajaxFn({"controlType":"queryAll"},function(data){
            this.setState({levelArr:data.map.data});
        },'/otcdyanmic/customerAttributes.do');




    },/*跳页*/
    pageNumber(page){
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"query","selectType":"coustom","pageSize":this.state.showLine,"pageNumber":page,"employee_id":this.state.personnel},function (data) {
            this.setState({dataTab:data.map.list,pageNum:page});
        });
    }, //行数选中回调函数
    lineNumber:function (obj) {
        var num = obj.key * 1;
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"query","selectType":"coustom","pageSize":num,"pageNumber":this.state.pageNum,"employee_id":this.state.personnel},function (data) {
            this.setState({
                showLine:num,
                dataTab:data.map.list
            });
        });
    },/*按条件产品搜索*/
    productSearch(){
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"query","selectType":"coustom","good_id":this.state.good_id,"pageSize":this.state.showLine,"pageNumber":1},function (data) {
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count,
                pageNum:1
            });
        });
    },/*弹窗取消*/
    handleCancel(){
        this.setState({
            addVisible:false,
            productInfo:{},
            reset:Math.random(),
            custom_type:''
            });
        object={};
    },/*弹窗取消*/
    handleCancel1(){
        this.setState({
            editVisible:false,
            });
        object={};
    },/*新增确定*/
    addOk(){
        const {custom_type,chain_customer_id,customer_id,good_id,number,money,build_sell_count,attributes_id} = this.state;
        if(custom_type && good_id && number && money && build_sell_count || chain_customer_id){
            this.setState({btnLoading:true},function(){
                this.ajaxFn({"controlType":"add","addType":"coustom","custom_type":custom_type,"good_id":good_id,"number":number,"money":money,"build_sell_count":build_sell_count,"chain_customer_id":chain_customer_id,"customer_id":customer_id,"attributes_id":attributes_id},function (data) {
                    message.success("新增成功！");
                    this.setState({addVisible:false,reset:Math.random(),custom_type:'',good_id:'',number:'',money:'',build_sell_count:'',chain_customer_id:''});
                    /*刷新列表数据*/
                    this.ajaxFn({"controlType":"query","selectType":"coustom","pageSize":this.state.showLine,"pageNumber":this.state.pageNum,"employee_id":this.state.personnel},function (data) {
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
    },/*打开修改弹窗*/
    editStore(e){
        this.setState({editVisible:true});
        var strData = $(e.currentTarget).attr("value");
        var sale_id = JSON.parse(strData).id;
        var customer_id = JSON.parse(strData).customer_id;
        sessionStorage.setItem("TK_strData",strData);
        this.ajaxFn({"controlType":"load","loadType":"coustom","sale_id":sale_id,"customer_id":customer_id},function (data) {
            object = data.map.info;
            this.setState({productInfo:data.map.info});
        },)
    },/*修改确定*/
    editOk(){
        this.setState({btnLoading:true},function(){
            var strData = sessionStorage.getItem("TK_strData");
            object.controlType = "update";
            object.updateType = "coustom";
            object.sale_id = JSON.parse(strData).id;
            object.customer_id = JSON.parse(strData).customer_id;
            this.ajaxFn(object,function (data) {
                object={};
                message.success("修改成功！");
                this.setState({editVisible:false});
                /*刷新列表数据*/
                this.ajaxFn({"controlType":"query","selectType":"coustom","pageSize":this.state.showLine,"pageNumber":this.state.pageNum,"employee_id":this.state.personnel},function (data) {
                    this.setState({dataTab:data.map.list});
                })
            });
        });
    },/*导出*/
    export(){
        this.ajaxFn({"controlType":"fileExport","exportType":"coustom"},function (data) {
            if(data.map.filePath){
                message.success(data.map.msg);
                window.location.href = data.map.filePath;
            }else{
                message.warning(data.map.msg);
            }
        });
    },/*多选选中,获取值*/
    option(key,valueArr){
        object[key] = valueArr.toString();
        this.setState({[key]:valueArr.toString()});
    },/*删除 */
   delete:function(e){

       this.setState({
       deletevisible:true,
       deletestrData:$(e.currentTarget).attr("value")
       })
     console.log("deletestrData1:"+$(e.currentTarget).attr("value"))
   },
   modalOff:function(){
    this.setState({
       deletevisible:false,
       })
    },/* 确认删除  */
    todelete:function(){
     var saleid=JSON.parse(this.state.deletestrData).id;
     this.ajaxFn({"controlType":"delete","deleteType":"coustom","sale_id":saleid},function (data) {
      message.success("删除成功");
      this.setState({deletevisible:false,randomKey:Math.random()});

              /*刷新列表数据*/
                this.ajaxFn({"controlType":"query","selectType":"coustom","pageSize":this.state.showLine,"pageNumber":this.state.pageNum,"employee_id":this.state.personnel},function (data) {
                    this.setState({dataTab:data.map.list, dataLen:data.map.count});
                })

    },'/otcdyanmic/appraisalConfig.do');
    },
    render(){
        return (
            <QueueAnim>
                <div className="operation" id="operation" style={{"paddingTop":"0"}} key="1">
                    <Dropdown
                        overlay={(
                            <Menu onClick={this.lineNumber}>
                                <Menu.Item key="10">10</Menu.Item>
                                <Menu.Item key="20">20</Menu.Item>
                                <Menu.Item key="50">50</Menu.Item>
                                <Menu.Item key="100">100</Menu.Item>
                            </Menu>)}
                    >
                        <Button type="ghost" style={{height:"34px",marginRight:"20px"}}>
                            {this.state.showLine} <Icon type="circle-o-down" />
                        </Button>
                    </Dropdown>

                    <div className="inlineBlock vam">
                        <MultiSelect tle="产品" options={this.state.products} typeName="good_id"  even={this.option} content={object.good_id}  />
                    </div>
                    <button type="button" className="btn btn-search" onClick={this.productSearch}>搜索</button>
                    <a href="javascript:void(0)" className="btn btn-add" onClick={()=> this.setState({addVisible:true})}><span className="icon-add"></span>新增</a>
                </div>
                <MemberTabel
                    key="2"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox","编号/产品/规格","供应商","门店类型","门店规模","门店","目标销售件数","目标销售总金额","铺点数","操作"]}
                    dataKey={["id/goods_name/specification","supplier","customTypeShow","attributesName","customName",'number',"money","build_sell_count"]}
                    controlArr={[{conId:2,conClass:"cleflo",callback:this.editStore},{conId:1,conClass:"cleflo",callback:this.delete}]}
                />

                <div className="mem-footer row" key="3">
                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-md-11">
                        <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                    </div>
                </div>

                <Modal title="新增产品销量考核" visible={this.state.addVisible} onOk={this.addOk} onCancel={this.handleCancel} width={700}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.addOk}>确定</Button>,
                    ]}
                >
                    <GaoModalSelect key={this.state.reset+1} tle="门店类型" options={[{name:"普通门店",id:"1"},{name:"连锁门店",id:"2"}]} selectWidth="86%" onChange={(val)=>this.setState({custom_type:val})} />
                    <GaoModalSelect key={this.state.reset+1.5} style={{display:(this.state.custom_type==1?"block":"none")}} className="mt10" tle="门店规模" options={this.state.levelArr} selectWidth="86%" onChange={(val)=>this.setState({attributes_id:val})} />
                    <GaoModalSelect key={this.state.reset+2} style={{display:(this.state.custom_type==1?"block":"none")}} className="mt10" tle="普通门店" options={this.state.customers} selectWidth="86%" onChange={(val)=>this.setState({customer_id:val})} placeholder="如果未选择，默认选择规模配置" />
                    <GaoModalSelect key={this.state.reset+3} style={{display:(this.state.custom_type==2?"block":"none")}} className="mt10" tle="连锁门店" options={this.state.chainCustomerId} selectWidth="86%" onChange={(val)=>this.setState({chain_customer_id:val})} />
                    <div className="mt10">
                        <div className="entrySelect">
                            <label>选择产品</label>
                            <Select key={this.state.reset} showSearch size="large" style={{ width:"86%"}} placeholder="请选择" optionFilterProp="children" onChange={(val)=>this.setState({good_id:val})}>
                                {this.state.products.map(function (data,i) {
                                    return <Option key={i} title={data.goodsName+" —— "+data.specification} value={""+data.goodsId}>{data.goodsName+" —— "+data.specification}</Option>
                                })}
                            </Select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6"><AddInput key={this.state.reset} tle="目标销售件数" typeName="number" onChange={(val)=>this.setState({number:val})} /></div>
                        <div className="col-md-6"><AddInput key={this.state.reset} tle="目标销售总金额" typeName="money" onChange={(val)=>this.setState({money:val})}  /></div>
                    </div>
                    <div className="row">
                        <div className="col-md-6"><AddInput key={this.state.reset} tle="铺点数" typeName="build_sell_count" onChange={(val)=>this.setState({build_sell_count:val})}  /></div>
                    </div>
                </Modal>



                <Modal title="修改产品销量考核" visible={this.state.editVisible} onOk={this.editOk} onCancel={this.handleCancel1} width={700}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel1}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.editOk}>确定</Button>,
                    ]}
                >
                    <ProductName tle={this.state.productInfo.custom_type==1?"普通门店":"连锁门店"} content={this.state.productInfo.customName} />
                    <ProductName style={{display:(this.state.productInfo.custom_type==1?"block":"none")}} className="mt10" tle="门店规模" content={this.state.productInfo.attributesName} />
                    <ProductName className="mt10" tle="考核产品" content={this.state.productInfo.goodName} />

                    <div className="row">
                        <div className="col-md-6"><AddInput tle="目标销售件数" content={this.state.productInfo.number} typeName="number" onChange={(val)=>object.number = val} /></div>
                        <div className="col-md-6"><AddInput tle="目标销售总金额"content={this.state.productInfo.money} typeName="money" onChange={(val)=>object.money = val}/></div>
                    </div>
                    <div className="row">
                        <div className="col-md-6"><AddInput tle="铺点数" content={this.state.productInfo.build_sell_count} typeName="build_sell_count" onChange={(val)=>object.build_sell_count = val} /></div>
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
        const {className,tle,options,style,selectWidth="419",placeholder="请选择",size="large"} = this.props;
        return (
            <div className={"entrySelect "+className} style={style}>
                <label>{tle}</label>
                <Select showSearch size={size} style={{ width: selectWidth }} placeholder={placeholder} optionFilterProp="children" onChange={this.handleChange} >
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
        var val = e.target.value.replace(/(^\s*)|(\s*$)/g, "");
        if(this.props.onChange){
            if(!isNaN(val)){
                this.props.onChange(val);
                object[this.props.typeName] = val;
            }else{
                object[this.props.typeName] = val.replace(/\D/gi,"");
                message.warning('只能输入数字！');
            }
        }
        this.setState({first:false});
    },
    render(){
        if(this.state.first){
            object[this.props.typeName] = this.props.content;
        }
        return (
            <div className="addInput">
                <label>{this.props.tle}</label>
                <input value={object[this.props.typeName]} className="form-control" onChange={this.changeVal} />
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
                if(data.goodsId == (obj*1)){
                    haveContent[i] = data.goodsName+";"+obj;
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
                        return <Option key={data.goodsName+";"+data.goodsId} title={data.goodsId+"/"+data.goodsName+"/"+data.specification} >{data.goodsId+"/"+data.goodsName+"/"+data.specification}</Option>
                    })}
                </Select>
            </div>
        );
    }
});
