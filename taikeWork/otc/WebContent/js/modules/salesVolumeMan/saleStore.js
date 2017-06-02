import React from 'react'
import MemberTabel from  '../react-utils/table'
import Pagination from 'antd/lib/pagination';        /*antd 分页组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
const confirm = Modal.confirm;
import message from 'antd/lib/message';                /*antd 提示组件*/
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import Loading from '../react-utils/loading'         /*加载中组件*/
import Select from 'antd/lib/select';                      /*antd select*/
const Option = Select.Option;
import Menu from 'antd/lib/menu'
import Dropdown from 'antd/lib/dropdown'        /*下拉*/
import Button from 'antd/lib/button'            /*按钮*/
import Icon from 'antd/lib/icon'                /*图标*/

var object = new Object();
export default React.createClass({
    /*ajax 封装*/
    ajaxFn:function(returnData,callback,javaUrl = '/otcdyanmic/customerConfig.do'){
        var $this = this;
        $.ajax({
            type:"post",
            url:javaUrl,
            data:{paramMap:JSON.stringify(returnData)},
            async:false,	//false 表示ajax执行完成之后在执行后面的代码
            dataType: "json",
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
                $("#loading").addClass("none");
                $this.setState({btnLoading:false});
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    getInitialState(){
        return {
            dataTab: [],
            showLine: 20,       /*显示行数*/
            dataLen: 0,         /*总数据条数*/
            pageNum:1,             /*默认选中页数*/
            chainArr:[],             /*客户数据*/
            storeArr:[],             /*门店数据*/
            storeArr2:[],               /*过滤掉已增加后的数据*/
            randomKey:0,  /*用来局部刷新的key*/
            addVisible:false,           /*新增弹窗是否显示*/
            btnLoading:false,            /*按钮等待状态*/
            goodskey:true,
        }
    },
    componentWillMount(){
        /*客户接口*/
        this.ajaxFn({controlType:"queryAll"},function(data){
            this.setState({chainArr:data.map.list});
        },'/otcdyanmic/chainCustomer.do');



    },//行数选中回调函数
    lineNumber:function (obj) {
        var num = obj.key * 1;
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"query","pageSize":num,"pageNumber":1,"chain_customer_id":this.state.chain_customer_id,"customer_id":this.state.customer_id},function (data) {
            this.setState({
                showLine:num,
                dataTab:data.map.data,
                pageNum:1
            });
        });
    },/*跳页*/
    pageNumber(page){
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":page,"chain_customer_id":this.state.chain_customer_id,"customer_id":this.state.customer_id},function (data) {
            this.setState({dataTab:data.map.data,pageNum:page});
        });
    },/*客户选中联动门店*/
    chainChange(key,valueArr){
        if(Array.isArray(valueArr) && valueArr.length != 0){
            var valArr = [];
            valueArr.forEach(function(data){
                valArr.push(data.split(";")[1]);
            });
            this.setState({
                chain_customer_id:valArr.toString(),
                customer_id:""
                });
                /*门店接口*/
        this.ajaxFn({"controlType":"queryAll","chain_customId":valArr.toString()},function(data){
            var mark = !this.state.goodskey;
            data.map.list.length == 0 ? message.warning("暂无数据！") : message.success("门店加载完成！");
            this.setState({goodskey:mark,storeArr:data.map.list});
        },'/otcdyanmic/customer.do');
            }else{
            this.setState({
                chain_customer_id:"",
                customer_id:""
                });
            this.ajaxFn({"controlType":"queryAll","chain_customId":""},function(data){
            var mark = !this.state.goodskey;
            data.map.list.length == 0 ? message.warning("暂无数据！") : message.success("门店加载完成！");
            this.setState({goodskey:mark,storeArr:data.map.list});
        },'/otcdyanmic/customer.do');
            }

    },/*根据条件搜索*/
    serach(){
        this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":1,"chain_customer_id":this.state.chain_customer_id,"customer_id":this.state.customer_id},function(data){
            data.map.count == 0 ? message.warning("暂无数据！") : message.success("加载完成！");
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count,
                pageNum:1
            });
        });
    },//导出
    export:function () {
        if(this.state.customer_id){
            this.ajaxFn({"controlType":"fileExport"},function (data) {
                if(data.map.filePath){
                    message.success(data.map.msg);
                    window.location.href = data.map.filePath;
                }else{
                    message.warning(data.map.msg);
                }
            });
        }else{
            message.warning('导出前，请先选择客户！');
        }

    },/*关闭弹窗*/
    handleCancel(){
        this.setState({addVisible:false});
    },/*新增*/
    add(){
        if(this.state.chain_customer_id){
            this.setState({addVisible:true});
            this.ajaxFn({"controlType":"queryNotCofigCustomer","chain_customId":this.state.chain_customer_id},function(data){
                data.map.list.length == 0 ? message.warning("系统门店暂无数据！") : message.success("系统门店加载完成！");
                this.setState({storeArr2:data.map.list});
            },'/otcdyanmic/customerConfig.do');
        }else{
            message.warning('新增前，请先选择客户！');
        }
    },/*确定新增*/
    addOk(){
        const {targetCustomerId,customerId} = this.state;
        if(targetCustomerId && customerId){
            this.setState({btnLoading:true},function(){
                    this.ajaxFn({"controlType":"add","target_customer_id":targetCustomerId,"customer_id":customerId},function(data){
                        message.success(data.map.msg);
                        this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":this.state.pageNum,"chain_customer_id":this.state.chain_customer_id,"customer_id":this.state.customer_id},function(data){
                            this.setState({
                                dataTab:data.map.list,
                                dataLen:data.map.count,
                                randomKey:Math.random()
                            });
                        });
                    });
            });
        }else{
            message.warning("请填写的完整内容！");
        }
    },/*删除数据*/
    remove(e){
        var $this = this;
        var strData= $(e.currentTarget).attr("value");
        var dataId = JSON.parse(strData).id;
        confirm({
            title: '提示：',
            content: '您确定要删除该条数据吗?',
            onOk() {
                $this.ajaxFn({"controlType":"delete","id":dataId},function(data){
                    message.success('删除成功！');
                    this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":this.state.pageNum,"chain_customer_id":this.state.chain_customer_id,"customer_id":this.state.customer_id},function(data){
                        this.setState({
                            dataTab:data.map.list,
                            dataLen:data.map.count
                        });
                    });
                });
            },
            onCancel() {},
        });
    },/*多选选中,获取值*/
    option(key,valueArr){
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
    render(){
        return (
            <QueueAnim>
                <div className="operation" key="1">
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
                    <MultiSelect tle="客户" placeholder="请选择客户" typeName="chain_customer_id"  options={this.state.chainArr} even={this.chainChange} divStyle={{width:"300px",minWidth:"100px"}} selectStyle={{ "width": "240px" }} />
                    {/*<SelectData tle="客户" placeholder="请选择客户" typeName="chain_customer_id"  options={this.state.chainArr} divStyle={{width:"300px",minWidth:"100px"}} selectStyle={{ "width": "240px" }}  onChange={(val)=>{this.setState({randomKey:Math.random()});this.chainChange(val)}} />*/}
                    <MultiSelect tle="门店" keyval={this.state.goodskey} placeholder="请选择门店" typeName="customer_id"  options={this.state.storeArr} divStyle={{width:"300px",minWidth:"100px"}} selectStyle={{ "width": "240px" }} even={this.option}/>

                    <a href="javascript:void(0)" className="btn btn-search" onClick={this.serach}>搜索</a>
                    <a href="javascript:void(0)" className="btn btn-search" onClick={this.export}>导出</a>
                    <a href="javascript:void(0)" className="btn btn-add" onClick={this.add} >
                        <span className="icon-add"></span>新增
                    </a>
                </div>
                <MemberTabel
                    key="2"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox","客户","客户门店ID","系统门店ID","门店名称","操作"]}
                    dataKey={["china_customer_name","target_customer_id","customer_id","customer_name"]}
                    controlArr={[{conId:1,callback:this.remove,conClass:"cleflo"}]}
                />
                <div className="mem-footer row" key="3">
                    <div className="col-xs-3 col-sm-3 col-md-2 col-lg-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-xs-8 col-sm-9 col-md-10 col-lg-11">
                        <Pagination current={this.state.pageNum} className="antd-page" showQuickJumper total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                    </div>
                </div>


                {/*新增弹窗*/}
                <Modal title="新增门店设置" visible={this.state.addVisible} onOk={this.addOk} onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.addOk}>确定</Button>,
                    ]}
                >
                    <GaoModalSelect key={this.state.randomKey} className="mt10" tle="系统门店" options={this.state.storeArr2} onChange={(val) => this.setState({customerId:val})} />
                    <GaoModalInput key={this.state.randomKey+1} className="mt10" tle="客户门店ID" dataType="number" onChange={(val)=>this.setState({targetCustomerId:val})} />
                </Modal>

            </QueueAnim>
        )
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
        const {className,tle,options,style,defaultValue="请选择",placeholder="请选择",size="large"} = this.props;
        return (
            <div className={"entrySelect "+className} style={style}>
                <label>{tle}</label>
                <Select defaultValue={defaultValue+""} showSearch size={size} style={{ width: 419 }} placeholder={placeholder} optionFilterProp="children" onChange={this.handleChange} >
                    {options.map(function (data,i) {
                        return <Option key={i} value={""+data.id} title={data.name}>{data.name}</Option>
                    })}
                </Select>
            </div>
        )
    }
});

/*弹窗新增input*/
var GaoModalInput = React.createClass({
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
        object[this.props.typeName] = e.target.value;
        this.props.onChange(e.target.value);
        this.setState({first:false});
    },
    render(){
        const {className,content,typeName,tle} = this.props;
        if(this.state.first){
            object[typeName] = content;
        }
        return (
            <div className={"entrySelect "+className}>
                <label>{tle}</label>
                <input value={object[typeName]} className="form-control" onChange={this.changeVal} />
            </div>
        );
    }
});









/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    handleChange(value){
        this.props.onChange(value);
    },
    render:function(){
        const {placeholder="请选择"} = this.props;
        return (
            <div className="inlineBlock">
                <label className="label-style">{this.props.tle}</label>
                <Select
                    showSearch
                    size="large"
                    style={this.props.selectStyle}
                    placeholder={placeholder}
                    optionFilterProp="children"
                    onChange={this.handleChange}
                >
                    <Option key="and_option" value="">全部</Option>
                    {this.props.options.map(function (data,i) {
                        return <Option key={i+"and_option"} title={data.name} value={""+data.id}>{data.name}</Option>
                    })}
                </Select>
            </div>
        );
    }
});

/*select 多选组件，参数：标题，option数组对象*/

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
