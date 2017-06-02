import React from 'react'
import MemberTabel from '../react-utils/table'     /*表格组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message'              /*antd 提示组件*/
import Select from 'antd/lib/select';                      /*antd select*/
const Option = Select.Option;
import Loading from '../react-utils/loading'         /*加载中组件*/
import DatePicker from 'antd/lib/date-picker';          /*antd 日期组件*/
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/



export default React.createClass({
    /*容器对象*/
    container:{},//ajax 封装
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
    getInitialState(){
        var TKdata = JSON.parse(JSON.stringify(sessionStorage.getItem("TK_dataManage")));
        return {
            dataTab:[],
            dataLen:0,
            pageNum:1,
            showLine:20,
            staffArr:[],
            TKdata:TKdata, //缓存获取的数据
            document_id:JSON.parse(TKdata).id, //资料ID
            pptInfo:{}  /*表头数据*/
        }
    },
    componentDidMount:function(){


  /* 加载宣传人员  */
     this.ajaxFn({"controlType":"query","id":1},function (data) {
            this.setState({
                staffArr:data.map.list,
            });
       },"/otcdyanmic/employee.do");

    /*加载初始数据 */
    this.ajaxFn({"controlType":"queryEducate","pageSize":this.state.showLine,"pageNumber":this.state.pageNum,"document_id":this.state.document_id},function (data) {
            this.setState({
                dataTab:data.map.data,
                dataLen:data.map.count,
                pptInfo:data.map
            });
       },"/otcdyanmic/documents.do");

    }, /*跳页*/
    pageNumber(page){
        $("#loading").removeClass("none");
         this.ajaxFn({"controlType":"queryEducate","pageSize":this.state.showLine,"pageNumber":page,"document_id":this.state.document_id,"startDate":this.state.startTime,"endDate":this.state.endTime,"employee_ids":this.state.employeeval},function (data) {
            this.setState({
                dataTab:data.map.data,
                dataLen:data.map.count,
                pageNum: page,
            });
       },"/otcdyanmic/documents.do");
    },/*时间搜索*/
     searchTime: function (sd, ed) {
        if (sd) {
            this.setState({ startTime: sd });
        } else if (ed) {
            this.setState({ endTime: ed });
        };
    },/*按条件搜索*/
    saleSearch(){
         this.ajaxFn({"controlType":"queryEducate","pageSize":this.state.showLine,"pageNumber":this.state.pageNum,"document_id":this.state.document_id,"startDate":this.state.startTime,"endDate":this.state.endTime,"employee_ids":this.state.employeeval},function (data) {
            this.setState({
                dataTab:data.map.data,
                dataLen:data.map.count,
            });
       },"/otcdyanmic/documents.do");
    },
    /*多选选中,获取值*/
    option(key,valueArr){
        this.setState({[key]:valueArr.toString()});
    },
    out(){
        window.location.href = "index.html#/dataManage"
    },
    render(){
        return (
            <QueueAnim>
                <div key="1" className="mb-title">宣传PPT</div>
                <div key="2" className="row mt15">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3">
                        <GaoLabelP tle="文件名：" content={this.state.pptInfo.document_name}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3">
                        <GaoLabelP tle="上传人：" content={this.state.pptInfo.upload_employee}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3">
                        <GaoLabelP tle="更新时间：" content={this.state.pptInfo.update_time}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3">
                        <GaoLabelP tle="下载次数：" content={this.state.pptInfo.download_number}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-3">
                        <GaoLabelP tle="播放次数：" content={this.state.pptInfo.play_number}/>
                    </div>
                </div>
                <div className="row" style={{marginTop:"10px"}}>
                    <MultiSelect className="inlineBlock mr20 mb15" tle="宣传人员" typeName="employeeval"  options={this.state.staffArr} selectStyle={{ "width": "200px" }} even={this.option} />
                    <div className="inlineBlock">
                        <label className="label-style">时间范围</label>
                        <DateRange searchTime={this.searchTime} />
                    </div>
                    <button type="button" className="btn btn-search ml20" onClick={this.saleSearch}>搜索</button>
                    <button type="button" className="btn btn-search ml20" onClick={this.out}>返回</button>
                </div>
                <MemberTabel
                    key="4"
                    tableStyle="clean"
                    dataTable={this.state.dataTab}
                    titleName={["宣传人","播放开始时间","播放结束时间","播放时长"]}
                    dataKey={["employeeName","startDateStr","endDateStr", "duration"]}
                />
                <div className="mem-footer row" key="5">
                    <div className="col-xs-3 col-sm-3 col-md-2 col-lg-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-xs-8 col-sm-9 col-md-10 col-lg-11">
                        <Pagination current={this.state.pageNum} className="antd-page" showQuickJumper total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                    </div>
                </div>
            </QueueAnim>
        );
    }
});



/*select 组件，参数：标题，option数组对象*/
var GaoLabelP = React.createClass({
    handleChange:function (value) {
        this.props.event(this.props.typeName,value);
    },
    render:function(){
        const {className,pStyle,tle,content} = this.props;
        return (
            <div className={className} style={{"marginBottom":"15px"}}>
                <label className="label-style">{tle}</label>
                <span style={{fontSize:"12px"}}>{content}</span>
            </div>
        );
    }
});

/*select 多选组件，参数：标题，option数组对象*/
var MultiSelect = React.createClass({
    handleChange(value) {
        this.props.even(this.props.typeName,value);
    },
    render(){
        const {tle,selectStyle={"width":"220px"},divStyle,options,placeholder="请选择",content="",className=""} = this.props;
        const haveContent = content ? content.split(","):[];
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
                        return <Option key={data.id} title={data.name} >{data.name}</Option>
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
        return {
            startValue: null,  /*一周前日期*/
            endValue:null,      /*当前日期*/
            endOpen: false
        };
    },
    onStartChange(value) {
        this.setState({ startValue: this.formatDate(value) });
        this.searchTime(this.formatDate(value));
    },
    onEndChange(endVal) {
        this.setState({ endValue: this.formatDate(endVal) });
        this.searchTime(null, this.formatDate(endVal));
    },/*格式转换*/
    formatDate: function (date) {
        if (date !== null) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return year + "-" + (month > 9 ? (month + "") : ("0" + month)) + "-" + (day > 9 ? (day + "") : ("0" + day));
        } else {
            message.warning('请先填写日期范围！');
            return "";
        }
    },
    searchTime: function (sd, ed) {
        this.props.searchTime(sd, ed);
    },
    render() {
        return (
            <div className="inlineBlock" style={{ marginRight: "10px", marginBottom: "15px" }}>
                <DatePicker
                    size="large"
                    style={{ width: "200px" }}
                    placeholder="开始日期"
                    onChange={this.onStartChange}
                    defaultValue={this.state.startValue}

                    />
                <span> ~ </span>
                <DatePicker
                    size="large"
                    style={{ width: "200px" }}
                    placeholder="结束日期"
                    onChange={this.onEndChange}
                    defaultValue={this.state.endValue}
                    />
            </div>
        );
    },
});


/*返回当前或者一周前的日期*/
function initDate(choice = true) {
    if (choice) {
        return CurrentTime();   //当前时间
    } else {
        return getYestoday();   //前一周时间
    }
    function CurrentTime() {
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var dates = myDate.getDate();
        var currentDate = year + "-" + (month < 10 ? '0' + month : month) + "-" + (dates < 10 ? '0' + dates : dates);
        return currentDate;
    }

    function getYestoday() {
        var d = new Date();
        var yesterday_milliseconds = d.getTime() - 7000 * 60 * 60 * 24;
        var yesterday = new Date();
        yesterday.setTime(yesterday_milliseconds);
        var strYear = yesterday.getFullYear();
        var strDay = yesterday.getDate();
        var strMonth = yesterday.getMonth() + 1;
        var datastr = strYear + "-" + (strMonth < 10 ? '0' + strMonth : strMonth) + "-" + (strDay < 10 ? '0' + strDay : strDay);
        return datastr;
    }
}
