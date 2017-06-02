import React from 'react'
import MemberTabel from  '../react-utils/table'     /*表格组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import DatePicker from 'antd/lib/date-picker';      /*antd 年月选择*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import Select from 'antd/lib/select';                      /*antd select*/
const Option = Select.Option;
import Radio from 'antd/lib/radio'                  /*antd 单选框*/
const RadioGroup = Radio.Group;
import Loading from '../react-utils/loading'         /*加载中组件*/
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import message from 'antd/lib/message'              /*antd 提示组件*/
const MonthPicker = DatePicker.MonthPicker;



var object = new Object();
export  default  React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/visitStat.do') {
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
        var timeStart = initDate(false);   /*开始默认时间*/
        var timeEnd = initDate();    /*获取昨天的日期*/
        return {
            keyval:true,
            modalVisible:false,
            dataTab : [],
            showLine:20,	/*显示行数*/
            pageNum:1,      /*页码选中值*/
            dataLen:0,		/*数据条数*/
            conditionObj:{},    /*保存的条件数据*/
            customers:[],        /*门店集合*/
            chain:[],            /*连锁门店*/
            personInChargeId:[], /*代表人员*/
            visitsInfo:{},              /*客户数据*/
            timeStart:timeStart,        /*开始时间*/
            timeEnd:timeEnd             /*结束时间*/

        };
    },
    componentDidMount:function(){

        if(object){
            this.setState({conditionObj:object})
            for (var key in object) {
                this.setState({[key]:object[key]});
            };
            this.ajaxFn({"controlType":"queryAll","chain_customId":object.chain_customId},function (data) {
                data.map.list.length != 0?message.success("加载成功！"):message.warning("暂无数据！");
                var mark = !this.state.keyval;
                this.setState({keyval:mark,customers:data.map.list});
            },'/otcdyanmic/customer.do');
        }


        /*进入时初始化*/
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"queryEmployeeStat","selectType":"store","pageSize":20,"pageNumber":1,"timeStart":this.state.timeStart,"timeEnd":this.state.timeEnd},function (data) {
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count
            });
        })

        /*连锁门店*/
        this.ajaxFn({"controlType":"queryAll"},function(data){
            this.setState({chain:data.map.list});
        },'/otcdyanmic/chainCustomer.do');

    },/*跳页*/
    pageNumber(page){
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"queryEmployeeStat","selectType":"store","pageSize":this.state.showLine,"pageNumber":page,"timeStart":this.state.timeStart,"timeEnd":this.state.timeEnd,"custom_id":object.custom_id,"chain_customId":object.chain_customId},function (data) {
            this.setState({dataLen:data.map.count,dataTab:data.map.list,pageNum:page});
        });
    },/*条件搜索*/
    termSearch(){
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"queryEmployeeStat","selectType":"store","pageSize":this.state.showLine,"pageNumber":1,"timeStart":this.state.timeStart,"timeEnd":this.state.timeEnd,"custom_id":object.custom_id,"chain_customId":object.chain_customId},function (data) {
            data.map.count == "0" ? message.warning('暂无数据') : message.success('加载完成');
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count,
                pageNum:1
            });
        })
    },/*连锁门店事件*/
    chainEvent(key,valueArr){
        object[key] = valueArr.toString();
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":"queryAll","chain_customId":valueArr.toString()},function (data) {
            data.map.list.length != 0?message.success("加载门店数据成功！"):message.warning("暂无门店数据！");
            var mark = !this.state.keyval;
            this.setState({keyval:mark,customers:data.map.list,conditionObj:{}});
            object.custom_id = ""
        },'/otcdyanmic/customer.do');

        // // if(valueArr.length != 0){
        // //
        // // }else{
        // //     message.warning("暂无数据！");
        // //     var mark = !this.state.keyval;
        // //     this.setState({keyval:mark,customers:[],conditionObj:{}});
        // //     object.custom_id = ""
        // }
    },/*门店事件*/
    customerEvent(key,valueArr){
        object[key] = valueArr.toString();
    },//按时间范围保存
    searchTime:function(sd,ed){
        if(sd){
            this.setState({timeStart:sd});
        }else if(ed){
            this.setState({timeEnd:ed});
        }
    },/*查看*/
    see(e){
        var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
         sessionStorage.setItem("back_page","代表");

        if(JSON.parse(strData).costomType == 2){
            this.ajaxFn({"controlType":"loadChainStockByEmployee","visits_id":JSON.parse(strData).id},function(data){
                if(data.map.info){
                    this.setState({visitsInfo:data.map.info,modalVisible:true});
                }else{
                    message.success("此次拜访未做备注！");
                }
            });
        }else{
            window.location.href = "index.html#/inventoryDetail"
        }

    },/*取消弹窗*/
    handleCancel(){
        this.setState({modalVisible:false});
    },/*确定*/
    yesOk(){
        this.setState({modalVisible:false});
    },
    render(){
        return (
            <QueueAnim>
                <div className="mb-title h50" key="0">代表拜访查询</div>
                <div className="operation" id="operation" key="2">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 mb15" >
                            <MultiSelect tle="连锁总门店" options={this.state.chain} typeName="chain_customId" even={this.chainEvent} content={this.state.conditionObj.chain_customId} />
                        </div>
                        <div className="col-xs-12 col-sm-6 col-md-6 col-lg-4 mb15" >
                            <MultiSelect tle="门店" key={this.state.keyval} options={this.state.customers} typeName="custom_id" even={this.customerEvent} content={this.state.conditionObj.custom_id}  />
                         </div>
                        <div className="col-xs-12 col-sm-8 col-md-8 col-lg-6">
                            <div className="mb15">
                                <label className="label-style">日期</label>
                                <DateRange searchTime={this.searchTime} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-4 col-md-4 col-lg-6">
                            <a href="javascript:void(0)" className="btn btn-search mb15" onClick={this.termSearch}>搜索</a>
                        </div>
                    </div>
                </div>
            <MemberTabel
                key="3"
                dataTable={this.state.dataTab}
                titleName={["checkbox","编号","门店名称","门店类型","地址","签到时间","签出时间","逗留时间","拜访人","状态","标记状态","操作"]}
                dataKey={["id","coustom","costomTypeName","address","sign_in_time","sign_out_time","stayTime","visitor","flag","mark_type"]}
                controlArr={[{conId:3,conClass:"cleflo",callback:this.see}]}
                titlestyle={{"styles4":{minWidth:"70px"},"styles9":{minWidth:"70px"},"styles10":{minWidth:"70px"},"styles11":{minWidth:"70px"}}}
            />
            <div className="mem-footer row" key="4">
                <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                <div className="col-md-11">
                    <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                </div>
            </div>
            <Loading loading={this.state.loading} />

            <Modal title="查看备注" visible={this.state.modalVisible} onOk={this.yesOk} onCancel={this.handleCancel}>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="entrySelect">
                            <label>客户名称：</label>
                            <p style={{width:419,float:"left",lineHeight:"32px"}}>{this.state.visitsInfo.customer}</p>
                        </div>
                    </div>
                </div>
                <div className="row mt10">
                    <div className="col-lg-12">
                        <div className="entrySelect">
                            <label>备注：</label>
                            <p style={{width:419,float:"left"}}>{this.state.visitsInfo.remark}</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </QueueAnim>
    )
    }
})

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




/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    render:function(){
        return (
            <div className="mb15">
            <label className="gao-label">{this.props.tle}</label>
        <Select
        showSearch
        size="large"
        style={{ minWidth:"200px",width:"70%" }}
        placeholder="请选择"
        optionFilterProp="children"
        onChange={this.props.onChange}
        >
        <Option value="">全部</Option>
            {this.props.options.map(function (data,i) {
                return <Option key={i+"and_option"} value={""+data.id} title={data.name}>{data.name}</Option>
            })}
        </Select>
        </div>
        );
    }
});


/*时间范围组件*/
var DateRange = React.createClass({
    getInitialState() {
        var timeStart = initDate(false);   /*开始默认时间*/
        var timeEnd = initDate();    /*获取昨天的日期*/
        return {
            startValue: timeStart,  /*开始时间*/
            endValue: timeEnd,      /*结束日期*/
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
    searchTime:function (sv,ev) {
        var sd = sv ? sv : false;
        var ed = ev ? ev : false;
        this.props.searchTime(sd,ed);
    },
    render() {
        const {style} = this.props;
        return (
            <div className="inlineBlock" style={style}>
                <DatePicker
                    placeholder="开始日期"
                    onChange={this.onStartChange}
                    value={this.state.startValue}
                />
                <span> ~ </span>
                <DatePicker
                    placeholder="结束日期"
                    onChange={this.onEndChange}
                    value={this.state.endValue}
                />
            </div>
        );
    },
});


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
