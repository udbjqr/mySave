
import React from 'react'
import MemberTabel from '../react-utils/table'         /*表格组件*/
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

/*echarts 报表组件*/
import echarts from 'echarts/lib/echarts'        /*echarts 报表组件*/
import 'echarts/lib/chart/line';                 /*折线图*/
import 'echarts/lib/chart/pie';         /*饼图*/
import 'echarts/lib/chart/bar';         /*柱形图*/
import 'echarts/lib/component/tooltip';          /*报表提示*/
import 'echarts/lib/component/toolbox';          /**/
import 'echarts/lib/component/title';            /*标题*/
import 'echarts/lib/component/legend';           /*图列*/
import 'echarts/lib/component/markPoint';        /*最大值，最小值*/
import 'echarts/lib/component/markLine';         /*平均值*/
import 'echarts/lib/component/grid';         /**/
import 'zrender/lib/vml/vml.js';         /**/

import Progress from 'antd/lib/progress';        /*antd 进度条*/
var dateObj = {};       /*日期范围初始对象*/

function eConsole(param) {
    if (typeof param.seriesIndex == 'undefined') {
        return;
    }
    if (param.type == 'click') {
        alert(param.name);
    }
}
/*通用表格页面*/
export default React.createClass({
    /*ajax 封装*/
    ajaxFn: function (returnData, callback, javaUrl = '/otcdyanmic/customerSale.do') {
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
        var startTime = initDate(false);
        var endTime = initDate();
        var strData = sessionStorage.getItem("TK_strData");
        return {
            dataTab: [],   /*表格*/
            showLine: 20,	/*显示行数*/
            pageNum: 1,          /*分页选中值*/
            dataLen: 0,		/*数据条数*/
            startTime: startTime,   /*开始时间*/
            endTime: endTime,     /*结束时间*/
            visible: false,              /*弹窗是否显示*/
            goodsname: JSON.parse(strData).goods_name,       /*产品名称*/
            goodsid: JSON.parse(strData).goods_id,           /*当前产品的ID*/
            chain: [],  //连锁门店
            chainid: "", //门店id
            representative: [], //代表
            representativeid: "", //代表id
            supplier: [], //供应商
            supplierid: "", //供应商id
            memberName: "", //搜索的关键字
            chainval: "",   //连锁门店选择的数据
            supplierval: "", //供应商选择的数据
            representativeval: "", //代表选择的数据
            loadtype: 1, //加载的数据类型  1：有铺点门店下拉  2无铺点门店下拉搜索数据

        };
    },/*进入时初始化*/
    componentDidMount: function () {

        /*连锁门店*/
        this.ajaxFn({ "controlType": "queryAll" }, function (data) {
            this.setState({ chain: data.map.list });
        }, '/otcdyanmic/chainCustomer.do');

        /*代表*/
        this.ajaxFn({ "controlType": "query", "id": 1 }, function (data) {
            this.setState({ representative: data.map.list });
        }, '/otcdyanmic/employee.do');
        /*供应商*/
        this.ajaxFn({ "controlType": "queryAll", "id": 1 }, function (data) {
            this.setState({ supplier: data.map.list });
        }, '/otcdyanmic/supplier.do');

        /*加载拜访统计产品详情：*/
        this.getvisitDetails(1);


    }, /*获取拜访统计产品详情：*/
    getvisitDetails: function (loadtype, page) {
        var page1 = isnull(page) == "" ? 1 : page;  //判断页码为空时为1
        var $this = this;
        var memberName = this.state.memberName;
        this.ajaxFn({ "controlType": "goodsStatisticsDetail", "goodsId": this.state.goodsid, "startDate": this.state.startTime, "endDate": this.state.endTime, "name": memberName, "chainCustomerId": this.state.chainid, "employeeId": this.state.representativeid, "supperId": this.state.supplierid, "pageSize": this.state.showLine, "pageNumber": page1 }, function (data) {
            /*设置属性  */
            var visitarr = {};
            visitarr = JSON.parse(JSON.stringify(data.map.areaDivisioRatio));
            this.setState({
                dataTab: loadtype == 2 ? data.map.noShopPointDetailList : data.map.list,
                dataLen: loadtype == 2 ? data.map.noShopPointDetailListCount : data.map.count
            });
            /*加载图表 */
            this.getvisitDetaildata(visitarr, "show", data.map.no_shop_point_ratio);//加载地区柱形数据 
            this.getshopdata(data.map.no_shop_point_ratio, $this)//加载门店饼图  
        }, '/otcdyanmic/visitStat.do');
    },/*加载门店饼图   */
    getshopdata: function (hashop, str) {
        if (hashop > 0) {
            var noshop = parseFloat((hashop * 100).toPrecision(12));
            var shop = parseFloat((100 - noshop).toPrecision(12));
            isshop(shop, noshop, str);
        }
    },/*加载地区柱形数据   */
    getvisitDetaildata: function (data, show, shop) {
        var xAxisData = [];
        var data1 = [];
        var visitDetails = data
        var visitnum = visitDetails.length;

        // alert("0.07*100值："+0.07*100)

        var z = 0
        for (var i = 0; i < visitDetails.length; i++) {
            for (var k in visitDetails[i]) {
                //遍历对象，k即为key，obj[k]为当前k对应的值
                if (show == "show") {
                    if (visitDetails[i][k] > 0) {
                        z++;
                        xAxisData.push(k);
                        data1.push(parseFloat((visitDetails[i][k] * 100).toPrecision(12)));
                    }
                } else {
                    xAxisData.push(k);
                    data1.push(parseFloat((visitDetails[i][k] * 100).toPrecision(12)));
                }

                //data1.push((Math.random() * 5).toFixed(2));
            }
        }
        console.log(z + "shop:" + shop)
        if (z == 0) {
            $(".echarts").css("display", "block");
            $("#shopbarlist").css("display", "none");
        }
        if (z == 0 && shop == 1) {
            $(".echarts").css("display", "none");
            $("#shopbarlist").css("display", "block");
        }
        if (z == 1) {
            $("#shopbarlist").css("width", "80px");
            $(".echarts,#shopbarlist").css("display", "block");
        }
        if (z <= 6 && z > 1) {
            console.log("小于4");
            $("#shopbarlist").css("width", 20 * visitnum + "px");
            $(".echarts,#shopbarlist").css("display", "block");
        }
        if (z > 6) {
            console.log("大于4");
            $("#shopbarlist").css("width", "100%");
            $(".echarts,#shopbarlist").css("display", "block");
        }
        bar(xAxisData, data1);
    },

    //保存时间范围，回调函数
    searchTime: function (sd, ed) {
        if (sd) {
            this.setState({ startTime: sd });
        } else if (ed) {
            this.setState({ endTime: ed });
        };
    },/*搜索条件选中*/
    changeEvent(key, value) {
        if (value == "all") {
            this.setState({ [key]: "" });
        } else {
            this.setState({ [key]: value });
        }

    },//按条件查询
    saleSearch: function () {
        $("#loading").removeClass("none");
        this.setState({
            pageNum: 1,
        })
        const {showLine, pageNum, startTime, endTime, customer_id, goods_id} = this.state;
        this.getvisitDetails(1);

    },/*跳页*/
    pageNumber(page) {
        this.setState({
            loading: true,
            pageNum: page
        });
        var loadtype = this.state.loadtype;
        this.getvisitDetails(loadtype, page);
    },//导出
    export: function () {
        this.ajaxFn({ "controlType": "fileExportGoodsStatisticsDetail", "goodsId": this.state.goodsid, "startDate": this.state.startTime, "endDate": this.state.endTime }, function (data) {
            if (data.map.filePath) {
                message.success(data.map.msg);
                window.location.href = data.map.filePath;
            } else {
                message.warning(data.map.msg);
            }
        }, "/otcdyanmic/visitStat.do");
    },/*查看货架详情*/
    see(e) {
        var strData = $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData1", strData);
        sessionStorage.setItem("back_page", "产品");
    },
    out() {
        window.location.href = "index.html#/product";
    },/* 点击饼图加载数据  */
    switchshop: function (str) {
        var type = str == "有铺点门店" ? 1 : 2;
        this.setState({
            pageNum: 1,
            loadtype: type,  //加载的数据类型 
        })
        this.getvisitDetails(type);
    },//关键字搜索
    nameSearch: function (e) {
        var e = e || window.event;
        var memberName = this.refs.memberName.value;
        this.setState({
            memberName: memberName,
        })
    },/*  显示的表格   */
    table: function () {
        if (this.state.loadtype == 1) {
            return (
                <MemberTabel
                    key="4"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox", "编号", "门店名称", "连锁", "代表", "供应商", "陈列面", "陈列数", "标签价", "铺点数", "库存", "开始时间", "结束时间", "操作"]}
                    dataKey={["id", "customer_name", "china_customer_name", "employee_name", "supplier_name", "display_surface", "display_number", "tag_price", "shop_point", "real_stock", "sign_in_time", "sign_out_time"]}
                    controlArr={[{ conId: 3, conUrl: "shelfDetails", conClass: "cleflo", callback: this.see }]}
                    titlestyle={{
                        "styles5":{minWidth:"70px"},
                        
                        }}
                    />
            )
        }
        if (this.state.loadtype == 2) {
            return (
                <MemberTabel
                    key="4"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox", "编号", "门店名称", "连锁", "代表", "供应商", "开始时间", "结束时间", "操作"]}
                    dataKey={["id", "customer_name", "china_customer_name", "employee_name", "supplier_name", "sign_in_time", "sign_out_time"]}
                    controlArr={[{ conId: 3, conUrl: "shelfDetails", conClass: "cleflo", callback: this.see }]}
                    />
            )
        }

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
    render: function () {
        var isshoptext = this.state.loadtype == 2 ? "无铺点门店" : "有铺点门店"
        return (
            <QueueAnim delay={200} >
                <div className="mb-titleh border0" key="1">
                    <i style={{ cursor: "pointer" }} onClick={this.out}>产品</i> <i style={{ "fontFamily": "新宋体" }}>&gt;&gt;</i> {this.state.goodsname}
                </div>

                <div className="operation" id="operation" key="3">

                    <input ref="file" type="file" style={{ display: "none" }} className="fileStyle" onChange={this.fileHandle} />
                    <DateRange size="large" showTime searchTime={this.searchTime} />

                    <div style={{ display: "inline-block", marginBottom: "15px", marginRight: "10px" }}>
                     <MultiSelect placeholder="请选择连锁名称" options={this.state.chain} typeName="chainid" even={this.option} divStyle={{width:"160px",minWidth:"100px"}} selectStyle={{ "width": "160px" }}  />
                        {/*
                        <Select size="large" placeholder="请选择连锁名称" style={{ width: "160px" }} onChange={(val) => { this.changeEvent("chainid", val) } } showSearch optionFilterProp="children">
                            <Option value="all" selected="selected">全部</Option>
                            {this.state.chain.map(function (obj, i) {
                                return <Option key={obj.id + ""} title={obj.name}>{obj.name}</Option>
                            })}
                        </Select>
                        */}
                    </div>
                    <div style={{ display: "inline-block", marginBottom: "15px", marginRight: "10px" }}>
                     <MultiSelect placeholder="请选择代表" options={this.state.representative} typeName="representativeid" even={this.option} divStyle={{width:"160px",minWidth:"100px"}} selectStyle={{ "width": "160px" }}  />
                       {/*
                       <Select size="large" placeholder="请选择代表" style={{ width: "160px" }} onChange={(val) => { this.changeEvent("representativeid", val) } } showSearch optionFilterProp="children">
                            <Option value="all" selected="selected">全部</Option>
                            {this.state.representative.map(function (obj, i) {
                                return <Option key={obj.id + ""} title={obj.name}>{obj.name}</Option>
                            })}
                        </Select>
                         */}
                    </div>
                    <div style={{ display: "inline-block", marginBottom: "15px", marginRight: "10px" }}>

                        <input type="text" style={{ width: 160, height: "30px", borderRadius: "6px", fontSize: "12px" }} className=" pl15" placeholder="搜索门店、代表、供应商" ref="memberName" onKeyUp={this.nameSearch} />

                    </div>
                    <button type="button" style={{ marginLeft: "10px" }} className="btn btn-search" onClick={this.saleSearch}>搜索</button>
                    <a href="javascript:void(0)" style={{ marginLeft: "10px" }} className="btn btn-search" onClick={this.export}>导出</a>
                </div>

                <div className="echarts" style={{ width: "100%", height: "400px", margin: "0px 0px 10px 0px" }}>
                    <div id="shoppie" style={{ width: "30%", height: "400px", float: "left" }}></div>
                    <div style={{ width: "70%", height: "400px", float: "left", text: "center" }}><div id="shopbarlist" style={{ width: "100%", height: "100%", margin: "auto" }}></div></div>
                </div>
                <a href="javascript:void(0)" className="btn btn-add" style={{ marginLeft: "0px", marginBottom: "10px" }}>{isshoptext}</a>

                {this.table()}


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
var GaoSelect = React.createClass({
    handleChange(val) {
        this.props.onChange(this.props.keyName, val);
    },
    render() {
        const {tle, options, size = "large", placeholder = "请选择", width, onChange, keyName} = this.props;
        return (
            <div style={{ display: "inline-block", marginBottom: "15px" }}>
                <label style={{ padding: "0 10px" }}>{tle}</label>
                <Select size={size} placeholder={placeholder} style={{ width: width }} onChange={this.handleChange} showSearch optionFilterProp="children">
                    <Option value="all">全部</Option>
                    {options.map(function (obj, i) {
                        return <Option key={i} value={obj.id + ""} title={(obj.name ? obj.name : obj.goodsName)}>{(obj.name ? obj.name : obj.goodsName)}</Option>
                    })}
                </Select>
            </div>
        )
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
key：联动时被联动下拉设置的对应的key
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
/*时间范围组件*/
var DateRange = React.createClass({
    getInitialState() {
        /*默认第一次传的时间数据*/
        var sameMonth = initDate(false);
        var planDay = initDate();
        return {
            startValue: sameMonth,  /*一周前日期*/
            endValue: planDay,      /*当前日期*/
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
                    style={{ width: "140px" }}
                    placeholder="开始日期"
                    onChange={this.onStartChange}
                    defaultValue={this.state.startValue}

                    />
                <span> 到 </span>
                <DatePicker
                    style={{ width: "140px" }}
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
/*有无铺点门店饼图数据*/
function isshop(shopdata, noshopdata, str) {

    /*利润情况数据*/

    var labelTop = {
        normal: {
            color: '#A5CB09',
            label: {
                show: true,
                position: 'center',
                formatter: '{b}:{d}%',
                textStyle: {
                    baseline: 'bottom',
                    fontSize: '16',
                }
            },
            labelLine: {
                show: true
            }
        }
    };
    var labelBottom = {

        normal: {
            color: '#ccc',
            label: {
                show: false,
                position: 'center',
                formatter: '{b}:{d}%',
                textStyle: {
                    baseline: 'right',
                    fontSize: "20px",
                    color: '#F00'
                },
                subtextStyle: {
                    padding: "10px",
                }
            },
            labelLine: {
                show: true
            }
        }
    };
    var isShopOption = {
        tooltip: {
            trigger: "item",
            formatter: "{b}:<br/> {c} ({d}%)"
        },
        legend: {
            orient: "horizontal",
            left: "left",
            data: ['有铺点门店', '无铺点门店'],
            selectedMode: false,
            formatter: "{name}",
            selected: function (params) {
                alert(name)
            }
        },

        series: [
            {
                name: "数据来源",
                type: 'pie',
                radius: ["50%", "70%"],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: false,
                        textStyle: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: true
                    }
                },
                data: [
                    { name: '有铺点门店', value: shopdata, itemStyle: labelTop },
                    { name: '无铺点门店', value: noshopdata, itemStyle: labelBottom }
                ]
            },


        ]
    };
    /* 有无门店饼图加载  */

    var salesSituation = echarts.init(document.getElementById('shoppie'));
    salesSituation.setOption(isShopOption);
    // 添加点击事件  
    salesSituation.on('click', function (params) {
        str.switchshop(params.name)

    });
}

/*地区门店柱形图*/
function bar(dataname, datamub) {
    var itemStyle = {
        normal: {
            color: function (params) {
                var colorList = ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                    '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                    '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'];
                return colorList[params.dataIndex];
            },
            label: {
                show: true,
                position: 'outside',
                formatter: '{c}%',
            }
        },
        emphasis: {
            label: {
                position: 'outside'
            },
            //barBorderColor: '#fff',
            /// barBorderWidth: 1,
            // shadowBlur: 5,
            //shadowOffsetX: 0,
            // shadowOffsetY: 0,
            // shadowColor: 'rgba(0,0,0,0.3)'
        }
    };
    var barOption = {
        tooltip: {
            trigger: "axis",
            formatter: "{b}:<br/> {c}%",
            axisPointer: {
                type: "shadow"
            },
        },

        xAxis: {
            data: dataname,
            silent: false,
            axisTick: {
                alignWithLabel: false,
                show: false
            },
            axisLabel: {
                show: true
            },

            axisLine: {
                onZero: true,
                show: false
            },
            splitLine: {
                show: false
            },
            splitArea: {
                show: false
            }
        },
        yAxis: {
            axisLine: {
                onZero: true,
                show: false
            },
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            splitArea: {
                show: false
            }
        },
        /*
        toolbox: {
            top: 10,
            // right: 20,
            feature: {
                magicType: {
                    type: ['line', 'bar']
                },

                saveAsImage: {
                    pixelRatio: 2
                },


            },


        },
        */
        series: [{
            name: 'bar',
            type: 'bar',

            itemStyle: itemStyle,
            data: datamub,

        }]
    }
    var barsalesSituation = echarts.init(document.getElementById('shopbarlist'));
    barsalesSituation.setOption(barOption);
}