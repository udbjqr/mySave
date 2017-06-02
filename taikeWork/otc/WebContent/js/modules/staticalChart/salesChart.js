import React from 'react'
import Modal from 'antd/lib/modal'               /*antd 弹窗组件*/
import message from 'antd/lib/message'           /*antd 提示组件*/
import Select from 'antd/lib/select';            /*select 框*/
const Option = Select.Option;
import DatePicker from 'antd/lib/date-picker';          /*antd 日期组件*/
const MonthPicker = DatePicker.MonthPicker;
import '../../../less/home.less'

/*echarts 报表组件*/
import echarts from 'echarts/lib/echarts'        /*echarts 报表组件*/
import 'echarts/lib/chart/line';                 /*折线图*/
import 'echarts/lib/chart/bar';                 /*折线图*/
import 'echarts/lib/component/tooltip';          /*报表提示*/
import 'echarts/lib/component/title';            /*标题*/
import 'echarts/lib/component/legend';           /*图列*/
import 'echarts/lib/component/markPoint';        /*最大值，最小值*/
import 'echarts/lib/component/markLine';         /*平均值*/








export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/saleStatistics.do') {
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
    },/*渲染报表方法*/
    renderingChart(){
        var $this = this;
        var saleInfo=this.state.saleInfo;
      ///  alert(Object.getOwnPropertyNames(saleInfo).length);
        var lastYear = (this.state.saleInfo.lastYear+"");
        var todayYear = (this.state.saleInfo.todayYear+"");
        var salesChartData = {
            grid: {
                left: '2%',
                right: '3%',
                bottom: '5%',
                containLabel: true
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:[lastYear,todayYear,'同比增长']
            },
            xAxis: [
                {
                    type: 'category',
                    data:this.state.saleInfo.monthYears
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '总销售额（万）',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '增长率',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name:lastYear,
                    type:'bar',
                    barWidth: '25%',
                    data:this.state.saleInfo.lastList,
                    itemStyle: {
                        normal: {
                            color: '#3cb4d6',
                        }
                    }
                },
                {
                    name:todayYear,
                    type:'bar',
                    barWidth: '25%',
                    data:this.state.saleInfo.todayList,
                    itemStyle: {
                        normal: {
                            color: '#4bca85',
                        }
                    }
                },
                {
                    name:'同比增长',
                    type:'line',
                    yAxisIndex: 1,
                    data:this.state.saleInfo.rateOfRise,
                    itemStyle: {
                        normal: {
                            color: '#ec8d2f',
                        }
                    }
                }
            ]
        };
        /*销售统计*/
        var salesChart = echarts.init(document.getElementById('salesChart'));
        salesChart.setOption(salesChartData);
    },
    getInitialState(){
        var lastYear = initDate(true);  /*今年的第一个月*/
        var upMonth = initDate();       /*当前月*/
        return {
            suppliers:[],        /*供应商数据*/
            supplierId:'',      /*供应商ID*/
            goodsArr:[],        /*产品数据*/
            goodskey:true,      /*产品的key*/
            startTime:lastYear,       /*开始时间*/
            endTime:upMonth,          /*结束时间*/
            compareStartTime:getLastYearDate(lastYear),           /*同比开始时间*/
            compareEndTime:getLastYearDate(upMonth),                        /*同比结束时间*/
            saleInfo:{},              /*报表数据对象*/
            todayList:"",
            goods_Id:"",
            isAssess:"", //是否考核
        }
    },
    componentWillMount(){
        /*获取供应商数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({suppliers:data.map.list});
        },'/otcdyanmic/supplier.do');
    },
    componentDidMount(){
        //this.renderingChart();
    },/*供应商选中,获取产品*/
    option(key,valueArr){
       if(Array.isArray(valueArr) && valueArr.length != 0){
            var valArr = [];
            valueArr.forEach(function(data){
                valArr.push(data.split(";")[1]);
            });
            this.setState({
                supplierId:valArr.toString(),
                goodsId:""
                });
                 this.ajaxFn({"controlType":"queryGoodsBySuperId","supplierId":valArr.toString(),"isAssess":this.state.isAssess},function(data){
                var mark = !this.state.goodskey;
                this.setState({goodskey:mark,goodsArr:data.map.data});
               // data.map.count == "0" ? message.warning("暂无产品数据！") : message.success("加载完成！");
            },'/otcdyanmic/goods.do');
            }else{
            this.setState({
                supplierId:"",
                goodsId:""
                });
                 this.ajaxFn({"controlType":"queryGoodsBySuperId","supplierId":"","isAssess":this.state.isAssess},function(data){
                var mark = !this.state.goodskey;
                this.setState({goodskey:mark,goodsArr:data.map.data});
               // data.map.count == "0" ? message.warning("暂无产品数据！") : message.success("加载完成！");
            },'/otcdyanmic/goods.do');
            }

           
          
           
       // }else{
          //  this.setState({supplierId:"",goodsId:""});
        //}
    },/*产品选中*/
    goodsEven(valueArr){
        if(Array.isArray(valueArr) && valueArr.length != 0){
            var valArr = [];
            valueArr.forEach(function(data){
                valArr.push(data.split(";")[1]);
            });
            this.setState({goodsId:valArr.toString()});
        }else{
            this.setState({goodsId:""});
        }
    },//保存时间范围，回调函数
    searchTime:function(sd,ed){
        if(sd){
            this.setState({startTime:sd,compareStartTime:getLastYearDate(sd),compareEndTime:getLastYearDate(this.state.endTime)});
        }else if(ed){
            this.setState({endTime:ed,compareStartTime:getLastYearDate(this.state.startTime),compareEndTime:getLastYearDate(ed)});
        }
    },/*同比时间*/
    compareDate(sd,ed){
        if(sd){
            this.setState({compareStartTime:sd});
        }else if (ed) {
            this.setState({compareEndTime:ed});
        };
    },/*搜索*/
    saleSearch(){
        const {startTime,endTime,compareStartTime,compareEndTime,supplierId,goodsId} = this.state;
        this.ajaxFn({"controlType":"query","startTime":startTime,"endTime":endTime,"compareStartTime":compareStartTime,"compareEndTime":compareEndTime,"supplierId":supplierId,"goodsId":goodsId,ids:this.state.goods_Id,isAssess:this.state.isAssess},function(data){
            var todayYearSale = 0;
            var lastYearSale = 0;
            if(data.map.todayList!==""&& data.map.todayList!=undefined && data.map.todayList!=null){

            
            data.map.todayList.forEach(function(obj,i){
                todayYearSale +=(obj*1);
            });
            data.map.lastList.forEach(function(obj,i){
                lastYearSale +=(obj*1);
            });
            var growthRate = ((todayYearSale - lastYearSale ) / lastYearSale).toFixed(2);
            this.setState({
                saleInfo:data.map,
                todayYearSale:todayYearSale.toFixed(2),
                lastYearSale:lastYearSale.toFixed(2),
                growthRate:(growthRate === "NaN" ? 0 : growthRate)
            },function(){
                this.renderingChart();
            });

            }
        });
    },/*id搜索  */
    idSearch:function(key,val){
    var goods_id=this.refs.goodsids.value==""?"":this.refs.goodsids.value.replace("，",",");
    
     this.setState({
         goods_Id:goods_id
     })
    },
    Assessoption(key,valueArr){
        var valueArrs=valueArr==""?"":valueArr.split(";")[1];
        this.setState({
            isAssess:valueArrs,
        })
           this.ajaxFn({"controlType":"queryGoodsBySuperId","supplierId":this.state.supplierId,"isAssess":valueArrs},function(data){
                var mark = !this.state.goodskey;
                this.setState({goodskey:mark,goodsArr:data.map.data});
               // data.map.count == "0" ? message.warning("暂无产品数据！") : message.success("加载完成！");
            },'/otcdyanmic/goods.do');
    },
    render(){
        return (
            <div className="home-body">
                <div className="chart-body">
                    <div className="row chart-head">
                        <div className="col-md-3">
                            <span className="chart-title pl20">销售统计报表</span>
                        </div>
                    </div>
                    <div className="row mt20">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4" style={{width:"280px"}}>
                                <MultiSelect className="pl20 mb20 inlineBlock" tle="供应商" options={this.state.suppliers} typeName="supplierId" divStyle={{width:"280px",minWidth:"100px"}} selectStyle={{"width":200}} even={this.option} />
                            </div>
                             <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4" style={{width:"160px"}}>
                             
                               <SingleSelect tle="状态"  placeholder="请选择状态" typeName="isAssess"  options={[{"name":"全部","id":""},{"name":"考核","id":"1"},{"name":"非考核","id":"0"}]} even={this.Assessoption}   divStyle={{width:"160px",minWidth:"100px"}} selectStyle={{ "width": "100px" }}  />
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4" style={{width:"310px"}}>
                                <div className="form-inline pl20 mb20 inlineBlock">
                                    <label style={{"padding":"0 15px"}}>产品</label>
                                    <Select multiple key={this.state.goodskey}  size="large" style={{"width":200}}  onChange={this.goodsEven} searchPlaceholder="标签模式" placeholder="请选择" >
                                        {this.state.goodsArr.map(function (data,i) {
                                            return <Option key={data.name+";"+data.id} title={data.id+"/"+data.name+"/"+data.specification} >{data.id+"/"+data.name+"/"+data.specification}</Option>
                                        })}
                                    </Select>
                                </div>
                            </div>
                             <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4" style={{width:"280px"}}>
                              <label style={{"padding":"0 15px"}}>产品ID</label>
                             <input type="text" ref="goodsids" style={{width:"180px",height:"32px",border:"1px solid #D9D9D9",borderRadius:"6px",fontSize: "12px"}} className=" pl15" placeholder="请输入产品ID"  onKeyUp={(value)=>this.idSearch("userid",value)} />
                             </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-5" style={{width:"400px"}}>
                            <div className="inlineBlock">
                                <label className="label-style">本期时间</label>
                                <DateRange className="mb20" size="large" showTime  searchTime={this.searchTime} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-5" style={{width:"400px"}}>
                            <div className="inlineBlock">
                                <label className="label-style">同比时间</label>
                                <AnDateRange className="mb20" searchTime={this.compareDate} compareStartTime={this.state.compareStartTime} compareEndTime={this.state.compareEndTime} />
                            </div>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-6 col-lg-2">
                            <button type="button" style={{"verticalAlign":"initial"}} className="btn btn-search mb20" onClick={this.saleSearch}>搜索</button>
                        </div>
                    </div>
                    <div className="row charts-box">
                        <div className="col-lg-12">
                            <div className="salesChart" id="salesChart"></div>
                            <p className="sales-p-text">本期总销售额：<i className="sales-i-text">{this.state.todayYearSale}</i>万， 同比总销售额：<i className="sales-i-text">{this.state.lastYearSale}</i>万，本期同比增长：<i className="sales-i-text">{this.state.growthRate>0?parseFloat((this.state.growthRate*100).toPrecision(12))+"%":"0"}</i>。</p>
                        </div>
                    </div>
                </div>
            </div>
    );
    }
});


/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    handleChange:function (value) {
        this.props.even(this.props.typeName,value);
    },
    render:function(){
        return (
            <div className={"form-inline "+this.props.className}>
                <label style={{"padding":"0 15px"}}>{this.props.tle}</label>
                <Select
                    multiple
                    size="large"
                    placeholder="请选择"
                    style={this.props.selectStyle}
                    searchPlaceholder="标签模式"
                    onChange={this.handleChange}
                >
                    {this.props.options.map(function (data,i) {
                        return <Option key={data.name+";"+data.id} title={data.name} >{data.name}</Option>
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
                    showSearch
                    size="large"
                    placeholder={this.isnull(this.props.placeholder)==""?"请选择":this.props.placeholder}
                    style={this.props.selectStyle}
                    searchPlaceholder="标签模式"
                    onChange={this.handleChange}
                    key={this.isnull(this.props.keyval)}
                    
                    >
                    {this.props.options.map(function (data,i) {
                         var todata=$this.isnull($this.props.todata)==""?"":data[$this.props.todata];
                         var name=$this.isnull($this.props.names)==""?data["name"]:data[$this.props.names];
                         var id=$this.isnull($this.props.Ids)==""?data["id"]:data[$this.props.Ids];
                         var showdate="";
                          if($this.props.typeName=="goods_id"){
                           showdate=id+"-"+name+""+todata;
                          }else{
                           showdate=name+""+todata;
                          }
                         
                        return <Option key={name+";"+id} title={showdate} >{showdate}</Option>
                    })}
                </Select>
            </div>
        );
    }
});
/* 单选 */
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
               
               {this.isnull(this.props.tle)==""?"":<label style={{"padding":"0 5px",marginRight:"5px"}}>{this.props.tle}</label>} 
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
/*同比时间范围组件*/
var AnDateRange = React.createClass({
    getInitialState() {
        return {
            startValue: 0,  /*去年的上个月*/
            endValue: 0      /*上个月*/
        };
    },
    onStartChange(value) {
        this.searchTime(this.formatDate(value),null);
    },
    onEndChange(endVal) {
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
            return year + "-" +(month > 9 ? (month + "") : ("0" + month));
        }else{
            message.warning('请先填写日期范围！');
            return "";
        }
    },
    searchTime:function (sv,ev) {
        this.props.searchTime(sv,ev);
    },
    render() {
        const {compareStartTime,compareEndTime} = this.props;
        return (
            <div className={"inlineBlock "+this.props.className} style={{"marginRight":"20px"}}>
                <MonthPicker
                    size="large"
                    placeholder="开始月份"
                    onChange={this.onStartChange}
                    value={compareStartTime}
                    style={{width:"120px"}}
                />
                <span> ~ </span>
                <MonthPicker
                    size="large"
                    placeholder="结束月份"
                    onChange={this.onEndChange}
                    value={compareEndTime}
                    style={{width:"120px"}}
                />
            </div>
        );
    },
});


/*时间范围组件*/
var DateRange = React.createClass({
    getInitialState() {
        /*默认第一次传的时间数据*/
        var lastYear = initDate(true);
        var upMonth = initDate();
        return {
            startValue: lastYear,  /*去年的上个月*/
            endValue: upMonth      /*上个月*/
        };
    },
    onStartChange(value) {
        this.searchTime(this.formatDate(value),null);
    },
    onEndChange(endVal) {
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
            return year + "-" +(month > 9 ? (month + "") : ("0" + month));
        }else{
            message.warning('请先填写日期范围！');
            return "";
        }
    },
    searchTime:function (sv,ev) {
        this.props.searchTime(sv,ev);
    },
    render() {
        return (
            <div className={"inlineBlock "+this.props.className} style={{"marginRight":"20px"}}>
                <MonthPicker
                    placeholder="开始月份"
                    onChange={this.onStartChange}
                    defaultValue={this.state.startValue}
                    style={{width:"120px"}}
                />
                <span> ~ </span>
                    <MonthPicker
                    placeholder="结束月份"
                    onChange={this.onEndChange}
                    defaultValue={this.state.endValue}
                    style={{width:"120px"}}
                />
            </div>
        );
    },
});






/*返回当前或者一周前的日期*/
function initDate(choice){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var dates = date.getDate();
    var startTime = year+"-01";
    var endTime = year+"-"+(month<10?"0"+month:month);
    if(choice){
        return startTime;   //今年的一月
    }else{
        return endTime;   //当前月份
    }
}



//获取去年的时间
function getLastYearDate(date){
    var lastDate = date;
    var lastYear = lastDate.substring(0,4)-1;
    var surplus = lastDate.substring(4);
    var lastYearDate = lastYear +surplus;
    return lastYearDate;
}

/*获取上个月的月份,(本来是获取去年的上个月，现在改成了今年的一月开始)
function getLastMonth(){
    var lastYear = '';
    var lastMonth = '';
    if(month==1) {
        lastYear = year-1;
        lastMonth = 12;
    }else{
        lastYear = year;
        lastMonth = month-1;
    }
    return lastYear+"-"+(lastMonth < 10 ? 0+lastMonth : lastMonth);
}
if(choice){
    return getLastYearDate(getLastMonth());   //去年的上个月
}else{
    return getLastMonth();   //上个月
}
*/


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

