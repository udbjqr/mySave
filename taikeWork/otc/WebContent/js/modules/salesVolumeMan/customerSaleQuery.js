
import React from 'react'
import MemberTabel from  '../react-utils/table'         /*表格组件*/
import Modal from 'antd/lib/modal'                      /*antd 弹窗组件*/
import Dropdown from 'antd/lib/dropdown'
import Button from 'antd/lib/button'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import Upload from 'antd/lib/upload'                /*上传 */
import DatePicker from 'antd/lib/date-picker';          /*antd 日期组件*/
import message from 'antd/lib/message';                /*antd 提示组件*/
import QueueAnim from 'rc-queue-anim';                  /*antd 进出场动画*/
import Select from 'antd/lib/select';                      /*antd select*/
const Option = Select.Option;
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import Loading from '../react-utils/loading'         /*加载中组件*/
import '../../../less/tablePage.less'


var dateObj = {};       /*日期范围初始对象*/

/*通用表格页面*/
export default React.createClass({
    /*ajax 封装*/
    ajaxFn:function(returnData,callback,javaUrl = '/otcdyanmic/customerSale.do'){
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
            },
            error(){
                $("#loading").addClass("none");
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    getInitialState:function(){
        var startTime = initDate(false);
        var endTime = initDate();
        return {
            dataTab : [],   /*表格*/
            showLine:20,	/*显示行数*/
            pageNum:1,          /*分页选中值*/
            dataLen:0,		/*数据条数*/
            conditionObj:{},    /*缓存的条件数据*/
            startTime:startTime,   /*开始时间*/
            endTime:endTime,     /*结束时间*/
            storeArr:[],     /*门店数据*/
            goodsArr:[],     /*产品数据*/
            chainArr:[],        /*导入里面连锁门店数据*/
            saleMoneyTotal:0,    /*总销售额*/
            visible:false,              /*弹窗是否显示*/
            memberName:"", //搜索关键字
        };
    },/*进入时初始化*/
    componentDidMount:function(){

        if(dateObj){
            this.setState({conditionObj:dateObj})
            for (var key in dateObj) {
                this.setState({[key]:dateObj[key]});
            }
        }

        /*门店接口*/
        this.ajaxFn({"controlType":"queryAll"},function(data){
            this.setState({storeArr:data.map.list});
        },'/otcdyanmic/customer.do');

        /*产品接口*/
        this.ajaxFn({controlType:"queryGoodsByPermission"},function(data){
            this.setState({goodsArr:data.map.list});
        },'/otcdyanmic/goods.do');

        /*客户接口*/
        this.ajaxFn({controlType:"queryAll"},function(data){
            this.setState({chainArr:data.map.list});
        },'/otcdyanmic/chainCustomer.do');


    },/*跳页*/
    pageNumber(page){
        this.setState({loading:true,pageNum:page});
        this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":page,"startTime":this.state.startTime,"endTime":this.state.endTime,"customer_id":this.state.customer_id,"goods_id":this.state.goods_id,"name": this.state.memberName},function (data) {
            this.setState({
                dataTab:data.map.saleList,
                dataLen:data.map.count
            });
        });
    },//行数选中回调函数
    lineNumber:function (obj) {
        var num = obj.key * 1;
        this.ajaxFn({"controlType":"query","pageSize":num,"pageNumber":1,"startTime":this.state.startTime,"endTime":this.state.endTime,"customer_id":this.state.customer_id,"goods_id":this.state.goods_id},function (data) {
            this.setState({
                dataTab:data.map.saleList,
                salesVolume:data.map,
                showLine:num,
                pageNum:1

            });
        });
    }, //保存时间范围，回调函数
    searchTime:function(sd,ed){
        if(sd){
            this.setState({startTime:sd});
        }else if(ed){
            this.setState({endTime:ed});
        };
    },//按条件查询
    saleSearch:function () {
        $("#loading").removeClass("none");
        this.setState({memberName:""})
        const {showLine,pageNum,startTime,endTime,customer_id,goods_id} = this.state;
        this.ajaxFn({"controlType":"query","pageSize":showLine,"pageNumber":pageNum,"startTime":startTime,"endTime":endTime,"customer_id":customer_id,"goods_id":goods_id},function(data){
            data.map.count == "0" ? message.warning("暂无数据！") : message.success("加载完成！");
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count,
                saleMoneyTotal:data.map.saleMoneyTotal
            });
        });

    },/*搜索条件选中*/
    changeEvent(key,value){
        if(value == "all"){
            this.setState({[key]:""});
        }else {
            this.setState({[key]:value});
        }
    },/*上传文件方法*/
    fileHandle(e){
        var $this = this;
        var reader = new FileReader();
        var fileName = e.target.files[0].name;
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function(e){
            $this.setState({
                fileName:fileName,
                file:e.target.result
            });
        };
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
    },/*关闭弹窗*/
    handleCancel(){
        this.setState({visible:false});
    },/*确定*/
    handleOk(){
        const {fileName,file,chain_customer_id} = this.state;
        if(file && chain_customer_id){
            this.ajaxFn({"controlType": "fileImport","fileName":fileName,"file":file,"chain_customer_id":chain_customer_id}, function (data) {
                message.success(fileName+`导入成功。`);
                this.setState({visible:false})
                /*重新渲染列表*/
                this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":1,"startTime":this.state.startTime,"endTime":this.state.endTime,"customer_id":this.state.customer_id,"goods_id":this.state.goods_id},function (data) {
                    this.setState({
                        dataTab:data.map.list,
                        dataLen:data.map.count,
                        saleMoneyTotal:data.map.saleMoneyTotal
                    });
                });
            })
        }else{
            message.warning("请选择连锁门店或选择上传导入文件！");
        }
    },//关键字搜索
    nameSearch:function (e) {
        var e = e || window.event;
        if((e && e.keyCode==13) || e.type == "click"){ // enter 键
            $("#loading").removeClass("none");
            var memberName = this.refs.memberName.value;
            const {showLine,startTime,endTime} =this.state;
            this.ajaxFn({"controlType":"query","name":memberName,"pageSize":showLine,"pageNumber":1,"startTime":startTime,"endTime":endTime},function (data) {
                data.map.count == "0" ? message.warning("暂无相关数据！") : message.success("加载完成！");
                this.setState({
                    dataTab:data.map.list,
                    dataLen:data.map.count,
                    saleMoneyTotal:data.map.saleMoneyTotal,
                    memberName:memberName
                });
            })
        }
    },
    /*多选选中,获取值*/
    option(key,valueArr){
        dateObj[key] = valueArr.toString();
        this.setState({[key]:valueArr.toString()});
    },
    render:function(){
        return (
            <QueueAnim delay={200} >
                <div className="mb-title border0" key="1">客户门店销量查询</div>
                <div className="row sales"  key="2">
                    <div className="col-sm-12 col-md-12 col-lg-7 sales-l">
                        <span className="s-l-span">总销售额：<i>{this.state.saleMoneyTotal}</i>元</span>
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
                        <Button type="ghost" style={{height:"34px",marginRight:"20px"}}>
                            {this.state.showLine} <Icon type="circle-o-down" />
                        </Button>
                    </Dropdown>
                    <input ref="file" type="file" style={{display:"none"}} className="fileStyle" onChange={this.fileHandle} />
                    <DateRange size="large" showTime  searchTime={this.searchTime} />
                        <MultiSelect className="inlineBlock" tle="门店" placeholder="请选择门店" typeName="customer_id" options={this.state.storeArr}  even={this.option} content={this.state.conditionObj.customer_id} />
                    <div style={{display:"inline-block",marginBottom:"15px"}}>
                        <MultiSelect className="inlineBlock" tle="产品" placeholder="请选择产品" typeName="goods_id" options={this.state.goodsArr} even={this.option} content={this.state.conditionObj.goods_id} />
                    </div>

                    <button type="button" className="btn btn-search" onClick={this.saleSearch}>搜索</button>
                    <a href="javascript:void(0)" className="btn btn-search" onClick={this.export}>导出</a>
                    <a href="javascript:void(0)" className="btn btn-search" onClick={()=> this.setState({visible:true})}>导入</a>
                    <a href="/otcdyanmic/templates/importCustomerSaleTemplate.xls" className="btn btn-search">下载导入模版</a>

                    <div className="form-group fr mem-search">
                        <input type="text" style={{width:200}} className="fl pl15" placeholder="搜索门店、产品、连锁名称" ref="memberName" onKeyUp={this.nameSearch} />
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                    </div>
                </div>
                <MemberTabel
                    key="4"
                    tableStyle="checkbox"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox","连锁名称","门店名称","产品名称","产品规格","销售数量","销售额2"]}
                    dataKey={["china_customer_name","customer_name","goods_name","specification","goods_num","goods_saleMoney"]}
                />

                <div className="mem-footer row" key="5">
                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-md-11">
                        <Pagination current={this.state.pageNum} className="antd-page" showQuickJumper total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                    </div>
                </div>

                <Modal title="导入" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} >
                    <div className="row">
                        <div className="col-md-12">
                            <GaoModalSelect tle="连锁门店" options={this.state.chainArr} onChange={(val)=>this.setState({chain_customer_id:val})}  />
                        </div>
                        <p className="text-center">支持 excel 格式</p>
                        <div className="col-md-6 col-md-offset-4 mt15">
                            <Button type="ghost" onClick={() => $(this.refs.file).click()}>
                                <Icon type="upload"/>选择上传导入文件
                            </Button>
                        </div>
                    </div>
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
            <div className={"Gao-modal-select "+className} style={style}>
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




/*select 组件，参数：标题，option数组对象*/
var GaoSelect = React.createClass({
    handleChange(val){
        this.props.onChange(this.props.keyName,val);
    },
    render(){
        const {tle , options ,size = "large",placeholder = "请选择",width,onChange,keyName} = this.props;
        return (
            <div style={{display:"inline-block",marginBottom:"15px"}}>
                <label style={{padding:"0 10px"}}>{tle}</label>
                <Select size={size}  placeholder={placeholder} style={{ width:width }} onChange={this.handleChange} showSearch optionFilterProp="children">
                    <Option value="all">全部</Option>
                    {options.map(function(obj,i){
                        return <Option key={i} value={obj.id+""} title={(obj.name ? obj.name:obj.goodsName)}>{(obj.name ? obj.name:obj.goodsName)}</Option>
                    })}
                </Select>
            </div>
        )
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



/*时间范围组件*/
var DateRange = React.createClass({
    getInitialState() {
        /*默认第一次传的时间数据*/
        var sameMonth =  initDate(false);
        var planDay =  initDate();
        return {
            startValue: sameMonth,  /*一周前日期*/
            endValue: planDay,      /*当前日期*/
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
            return year + "-" +(month > 9 ? (month + "") : ("0" + month))  + "-" + (day > 9 ? (day + "") : ("0" + day));
        }else{
            message.warning('请先填写日期范围！');
            return "";
        }
    },
    searchTime:function (sd,ed) {
        this.props.searchTime(sd,ed);
    },
    render() {
        return (
            <div className="inlineBlock" style={{marginRight:"20px",marginBottom:"15px"}}>
                <DatePicker
                    placeholder="开始日期"
                    onChange={this.onStartChange}
                    defaultValue={this.state.startValue}
                />
                <span> ~ </span>
                <DatePicker
                    placeholder="结束日期"
                    onChange={this.onEndChange}
                    defaultValue={this.state.endValue}
                />
            </div>
        );
    },
});


/*返回当前或者一周前的日期*/
function initDate(choice = true){
    if(choice){
        return CurrentTime();   //当前时间
    }else{
        return getYestoday();   //前一周时间
    }
    function CurrentTime(){
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var dates = myDate.getDate();
        var currentDate = year + "-" +(month < 10 ? '0'+month:month)+ "-" + (dates<10?'0'+dates:dates);
        return currentDate;
    }

    function getYestoday(){
        var d=new Date();
        var yesterday_milliseconds=d.getTime()-7000*60*60*24;
        var yesterday = new Date();
        yesterday.setTime(yesterday_milliseconds);
        var strYear = yesterday.getFullYear();
        var strDay = yesterday.getDate();
        var strMonth = yesterday.getMonth()+1;
        var datastr = strYear+"-"+(strMonth < 10 ? '0' + strMonth : strMonth )+"-"+(strDay < 10 ? '0' + strDay : strDay );
        return datastr;
      }
}
