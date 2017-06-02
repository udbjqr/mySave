import React from 'react'
import MemberTabel from '../react-utils/table'         /*表格组件*/
import Modal from 'antd/lib/modal'                      /*antd 弹窗组件*/
import Dropdown from 'antd/lib/dropdown'
import Button from 'antd/lib/button'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
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
    ajaxFn: function (returnData, callback, javaUrl = '/otcdyanmic/sale.do') {
        var $this = this;
        $.ajax({
            type: "post",
            url: javaUrl,
            data: { paramMap: JSON.stringify(returnData) },
            async: false,	//false 表示ajax执行完成之后在执行后面的代码
            dataType: "json",
            success: function (data) {
                if (!data.success) {/*首先判断这个属性，错误在判断原因*/
                    switch (data.errorCode) {
                        case (1):
                            Modal.warning({
                                title: '警告提示：', content: '获取当前登录用户信息失败，请重新登录！', onOk() {
                                    window.location.href = 'login.html';
                                }
                            });
                            break;
                        case (2):
                            Modal.warning({ title: '警告提示：', content: '此用户不存在或已禁用，请联系管理员！' });
                            break;
                        case (3):
                            Modal.error({ title: '错误提示：', content: '发生严重错误，请联系管理员！！' });
                            break;
                        case (4):
                            Modal.error({ title: '错误提示：', content: '发生严重错误，请联系管理员！！' });
                            break;
                        case (5):
                            Modal.warning({ title: '警告提示：', content: '当前用户没有此操作权限！' });
                            break;
                        case (8):
                            Modal.warning({ title: '警告提示：', content: '相关数据格式有误，请检查后重新填写！' });
                            break;
                        case (9):
                            Modal.info({ title: '提示：', content: '相关数据未填写完整，请检查！' });
                            break;
                        default:
                            Modal.warning({ title: '警告提示：', content: data.msg });
                            break;
                    }
                } else {
                    callback.call($this, data);
                }
                $("#loading").addClass("none");
            },
            error() {
                $("#loading").addClass("none");
                Modal.error({ title: '错误提示：', content: '出现系统异常，请联系管理员！！' });
            }
        });
    },
    getInitialState: function () {
        var sameMonth = sessionStorage.getItem("sale_startTime") ? sessionStorage.getItem("sale_startTime") : initDate(false);
        var planDay = sessionStorage.getItem("sale_endTime") ? sessionStorage.getItem("sale_endTime") : initDate();
        return {
            dataTab: [],   /*表格*/
            showLine: 20,	/*显示行数*/
            pageNum: 1,          /*分页选中值*/
            dataLen: 0,		/*数据条数*/
            conditionObj:{},    /*缓存的条件数据*/
            salesVolume: {},  /*总销售额对象*/
            suppliers: [],     /*供应商数据*/
            sameMonth: sameMonth,     /*一周前日期*/
            planDay: planDay,     /*当前年月日*/
            cost_price2show: "false",  //判断是否有权限显示
            cost_price3show: "false",   //判断是否有权限显示
            memberName: "", //搜索关键字
            suppliersval: "",
            chainArr:"", //chainArr数据
            chainid:"",
        };
    },/*进入时初始化*/
    componentDidMount: function () {

        if(dateObj){
            console.log(dateObj);
            this.setState({conditionObj:dateObj});
        }

         /*客户接口*/
        this.ajaxFn({controlType:"queryAll"},function(data){
            this.setState({chainArr:data.map.list});
        },'/otcdyanmic/chainCustomer.do');

        /*进入时初始化*/
        this.ajaxFn({ "controlType": "query", "pageSize": 20, "pageNumber": 1, "startTime": this.state.sameMonth, "endTime": this.state.planDay }, function (data) {
            this.setState({
                cost_price2show: data.map.permission.cost_price2,  //判断是否有权限显示
                cost_price3show: data.map.permission.cost_price3,   //判断是否有权限显示
            });
        });

        /*获取供应商数据*/
        this.ajaxFn({ "controlType": "querySupplierByPermission" }, function (data) {
            this.setState({ suppliers: data.map.list});
        }, '/otcdyanmic/supplier.do');

    },/*跳页*/
    pageNumber(page) {
        this.setState({ loading: true, pageNum: page });
        this.ajaxFn({ "controlType": "query", "pageSize": this.state.showLine, "pageNumber": page, "startTime": this.state.sameMonth, "endTime": this.state.planDay, "name": this.state.memberName, "supplierId": dateObj.suppliersval,customerId:dateObj.chainid}, function (data) {
            this.setState({ dataTab: data.map.saleList });
        });
    },//行数选中回调函数
    lineNumber: function (obj) {
        var num = obj.key * 1;
        this.ajaxFn({ "controlType": "query", "pageSize": num, "pageNumber": 1, "startTime": this.state.sameMonth, "endTime": this.state.planDay, "name": this.refs.memberName.value, "supplierId":dateObj.suppliersval,customerId:dateObj.chainid}, function (data) {
            this.setState({
                dataTab: data.map.saleList,
                salesVolume: data.map,
                showLine: num,
                pageNum: 1

            });
        });
    },//关键字搜索
    nameSearch: function (e) {
        var e = e || window.event;
        if ((e && e.keyCode == 13) || e.type == "click") { // enter 键
            $("#loading").removeClass("none");
            var memberName = this.refs.memberName.value==""?"":this.refs.memberName.value.replace("，",",");
            this.ajaxFn({ "controlType": "query", "name": memberName, "pageSize": this.state.showLine, "pageNumber": 1, "startTime": this.state.sameMonth, "endTime": this.state.planDay }, function (data) {
                data.map.count == "0" ? message.warning("暂无相关数据！") : message.success("加载完成！");
                this.setState({
                    salesVolume: data.map,
                    dataLen: data.map.count,
                    dataTab: data.map.saleList,
                    memberName: memberName,
                    pageNum: 1
                });
            })
        }
    }, //保存时间范围，回调函数
    searchTime: function (sd, ed) {
        if (sd != false && ed == false) {
            this.setState({ sameMonth: sd });
        } else if (ed != false && sd == false) {
            this.setState({ planDay: ed });
        };
    },//按范围查询
    saleSearch: function () {
        $("#loading").removeClass("none");
        this.setState({
            memberName: "",
        })
        this.ajaxFn({ "controlType": "query", "pageSize": this.state.showLine, "pageNumber": 1, "startTime": this.state.sameMonth, "endTime": this.state.planDay, "supplierId": dateObj.suppliersval,customerId:dateObj.chainid}, function (data) {
            data.map.count == "0" ? message.warning("暂无数据！") : message.success("加载完成！");
            this.setState({
                dataTab: data.map.saleList,
                dataLen: data.map.count,
                salesVolume: data.map,
                pageNum: 1

            });
        });
    },	/*导出*/
    export() {
        this.ajaxFn({ "controlType": "fileExport", "startTime": this.state.sameMonth, "endTime": this.state.planDay,"supplierId": dateObj.suppliersval,customerId:dateObj.chainid  }, function (data) {
            if (data.map.filePath) {
                message.success(data.map.msg);
                window.location.href = data.map.filePath;
            } else {
                message.warning(data.map.msg);
            }
        });
    },
    /*    判断成本2成本3显示权限     */
    isshowPrice: function () {
        var price2 = this.state.cost_price2show;
        var price3 = this.state.cost_price3show;
        if (price2 == "true" && price3 == "true") {
            return (
                <MemberTabel
                    key="4"
                    tableStyle="clean"
                    dataTable={this.state.dataTab}
                    titleName={["业务时间", "ID/品名/规格","供应商", "批次", "数量", "批发价", "金额", "开票价", "销售成本2", "销售成本3", "销售客户", "销售成本价", "零售价"]}
                    dataKey={["saleTme", "goodsName", "supplier", "id", "salesVolume", "sellingPrice", "sellingMoney", "unitprice", "costPrice2", "costPrice3", "customerName", "retailsCostPrice", "retails"]}
                    titlestyle={{"styles9":{minWidth:"60px"},"styles10":{minWidth:"60px"}}}
                />
            )
        }
        if (price2 == "false" && price3 == "false") {
            return (
                <MemberTabel
                    key="4"
                    tableStyle="clean"
                    dataTable={this.state.dataTab}
                    titleName={["业务时间", "ID/品名/规格", "供应商", "批次", "数量", "批发价", "金额", "开票价", "销售客户", "销售成本价", "零售价"]}
                    dataKey={["saleTme", "goodsName",  "supplier", "id", "salesVolume", "sellingPrice", "sellingMoney", "unitprice", "customerName", "retailsCostPrice", "retails"]}
                    />
            )

        }
        if (price2 == "true" && price3 == "false") {
            return (
                <MemberTabel
                    key="4"
                    tableStyle="clean"
                    dataTable={this.state.dataTab}
                    titleName={["业务时间", "ID/品名/规格",  "供应商", "批次", "数量", "批发价", "金额", "开票价", "销售成本2", "销售客户", "销售成本价", "零售价"]}
                    dataKey={["saleTme", "goodsName",  "supplier", "id", "salesVolume", "sellingPrice", "sellingMoney", "unitprice", "costPrice2", "customerName", "retailsCostPrice", "retails"]}
                    />
            )
        }
        if (price2 == "false" && price3 == "true") {
            return (
                <MemberTabel
                    key="4"
                    tableStyle="clean"
                    dataTable={this.state.dataTab}
                    titleName={["业务时间", "ID/品名/规格", "供应商", "批次", "数量", "批发价", "金额", "开票价", "销售成本3", "销售客户", "销售成本价", "零售价"]}
                    dataKey={["saleTme", "goodsName",  "supplier", "id", "salesVolume", "sellingPrice", "sellingMoney", "unitprice", "costPrice3", "customerName", "retailsCostPrice", "retails"]}
                    />
            )

        }
    },/*供应商选中,获取产品*/
    option(key,valueArr){
        dateObj[key] = valueArr.toString();
    },
    render: function () {
        return (
            <QueueAnim delay={200} >
                <div className="mb-title border0" key="1">销售查询</div>
                <div className="row sales" key="2">
                    <div className="col-sm-12 col-md-12 col-lg-7 sales-l" style={{width:"100%"}}>
                        <span className="s-l-span">总销售额：<i>{this.state.salesVolume.saleCountMoeny}</i>元</span>
                        <span className="s-l-span">总开票额：<i>{this.state.salesVolume.countCostPrice1}</i>元</span>
                        <span className="s-l-span">总销售成本2：<i>{this.state.salesVolume.countCostPrice2}</i>元</span>
                        <span className="s-l-span">总销售成本3：<i>{this.state.salesVolume.countCostPrice3}</i>元</span>
                    </div>
                    <div className="col-sm-12 col-md-12 col-lg-5 sales-r" style={{width:"100%"}}>
                        <div className="fr1">
                            <span className="s-r-span" style={{marginLeft:"0px"}}>总批发额：<i>{this.state.salesVolume.countWholesaleprice}</i>元</span>
                            <span className="s-r-span">总销售成本额：<i>{this.state.salesVolume.countRetailsCostPrice}</i>元</span>
                            <span className="s-r-span">总零售额：<i>{this.state.salesVolume.countRetails}</i>元</span>
                        </div>
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
                        <Button type="ghost" style={{ height: "34px", marginRight: "20px" }}>
                            {this.state.showLine} <Icon type="circle-o-down" />
                        </Button>
                    </Dropdown>
                    <DateRange size="large" showTime searchTime={this.searchTime} />

                    <MultiSelect className="inlineBlock" tle="供应商" options={this.state.suppliers} typeName="suppliersval" even={this.option} content={this.state.conditionObj.suppliersval} />
                    <MultiSelect className="inlineBlock" tle="客户" options={this.state.chainArr} typeName="chainid" even={this.option} content={this.state.conditionObj.chainid} />

                    <button type="button" className="btn btn-search" onClick={this.saleSearch}>搜索</button>
                    <a href="javascript:void(0)" className="btn btn-search mb15 vam-none" onClick={this.export}>导出</a>
                    <div className="form-group fr mem-search">
                        <input type="text" style={{ width: 230 }} className="fl pl15" placeholder="搜索品名、供应商、客户、产品ID" ref="memberName" onKeyUp={this.nameSearch} />
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                    </div>
                </div>

                {this.isshowPrice()}

                <div className="mem-footer row" key="5">
                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-md-11">
                        <Pagination current={this.state.pageNum} className="antd-page" showQuickJumper total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber} />
                    </div>
                </div>

                <Loading loading={this.state.loading} />
            </QueueAnim>
        );
    }
});




/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    render: function () {
        return (
            <div className="form-group form-inline suppliers">
                <label>{this.props.tle}</label>
                <Select
                    showSearch
                    size="large"
                    style={this.props.selectStyle}
                    placeholder="请选择"
                    optionFilterProp="children"
                    onChange={this.props.handleChange}
                    >
                    <Option key="and_option" value="all">全部</Option>
                    {this.props.options.map(function (data, i) {
                        return <Option key={i + "and_option"} value={"" + data.id} title={data.name}>{data.name}</Option>
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
        var sameMonth = sessionStorage.getItem("sale_startTime") ? sessionStorage.getItem("sale_startTime") : initDate(false);
        var planDay = sessionStorage.getItem("sale_endTime") ? sessionStorage.getItem("sale_endTime") : initDate();
        return {
            startValue: sameMonth,  /*一周前日期*/
            endValue: planDay,      /*当前日期*/
            endOpen: false
        };
    },
    onStartChange(value) {
        this.setState({ startValue: this.formatDate(value) });
        sessionStorage.setItem("sale_startTime", this.formatDate(value));
        this.searchTime(this.formatDate(value));
    },
    onEndChange(endVal) {
        this.setState({ endValue: this.formatDate(endVal) });
        sessionStorage.setItem("sale_endTime", this.formatDate(endVal));
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
            return year + "-" + (month > 9 ? (month + "") : ("0" + month)) + "-" + (day > 9 ? (day + "") : ("0" + day)) + " 00:00:00";
        } else {
            message.warning('请先填写日期范围！');
            return "";
        }
    },
    searchTime: function (sv, ev) {
        var sd = sv ? sv : false;
        var ed = ev ? ev : false;
        this.props.searchTime(sd, ed);
    },
    render() {
        return (
            <div className="inlineBlock" style={{ marginRight: "20px", marginBottom: "15px" }}>
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
        const {tle,selectStyle={ "width": "300px" },divStyle,options,placeholder="请选择",content="",className=""} = this.props;
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
        var currentDate = year + "-" + month + "-" + dates + " 00:00:00";
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
        var datastr = strYear + "-" + (strMonth < 10 ? '0' + strMonth : strMonth) + "-" + (strDay < 10 ? '0' + strDay : strDay) + " 00:00:00";
        return datastr;
    }
}
