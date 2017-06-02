import React from 'react'
import MemberTabel from '../react-utils/table'     /*表格组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import DatePicker from 'antd/lib/date-picker';      /*antd 年月选择*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import Loading from '../react-utils/loading'         /*加载中组件*/
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import message from 'antd/lib/message'              /*antd 提示组件*/
const MonthPicker = DatePicker.MonthPicker;
import Select from 'antd/lib/select';                      /*antd select*/
const Option = Select.Option;


var object = new Object();

export default React.createClass({
    //ajax 封装
    ajaxFn: function (data, callback, javaUrl = '/otcdyanmic/visitStat.do') {
        var $this = this;
        $.ajax({
            type: "post",
            url: javaUrl,
            data: { paramMap: JSON.stringify(data) },
            dataType: "json",
            async: false,	//false 表示ajax执行完成之后在执行后面的代码
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
        var planDay = yearMonth();
        return {
            dataTab: [],
            showLine: 20,	        /*显示行数*/
            pageNum: 1,              /*页码选中值*/
            dataLen: 0,		        /*数据条数*/
            planDay: planDay,        /*当前月份*/
            options: [],             /*考核产品*/
            customers: [],            /*客户*/
            conditionObj:{},    /*保存的条件数据*/
            goods_id: '',            /*产品ID*/
            showtype: "1",        //1、普通查询，2关键字查询
            memberName:"",
        };
    },
    componentDidMount: function () {

        if(Object.keys(object).length != 0){
            this.setState({conditionObj:object})
            for (var key in object) {
                this.setState({[key]:object[key]});
            };
        }


        $("#loading").removeClass("none");
        /*进入时初始化*/
        this.ajaxFn({ "controlType": "queryGoodsStatList", "selectType": "product", "pageSize": 20, "pageNumber": 1, "planMonth": this.state.planDay }, function (data) {
            this.setState({
                dataTab: data.map.list,
                dataLen: data.map.count
            });
            /*查询考核产品*/
            this.ajaxFn({ "controlType": "queryGoodsByPermission" }, function (data) {
                this.setState({ options: data.map.list });
            }, '/otcdyanmic/goods.do');
        })
    },/*跳页*/
    pageNumber(page) {
        this.setState({ pageNum: page });
        var object = new Object();
        object.controlType="queryGoodsStatList";
        object.pageSize=this.state.showLine;
        object.selectType="product";
        object.pageNumber=page
        object.planMonth=this.state.planDay;
        this.state.showtype=="1"?object.goods_id=this.state.goods_id:"";
        this.state.showtype=="2"?object.name=this.state.memberName:"";
        this.ajaxFn(object, function (data) {
            data.map.count == "0" ? message.warning("暂无数据！") : 　message.success("加载完成！");
            this.setState({ dataTab: data.map.list });
        });
    },/*年月份搜索*/
    ant_date(value, dateString) {
        this.setState({
            planDay: dateString,
        });
    },/*导出*/
    export() {
        this.ajaxFn({ "controlType": "fileExport", "selectType": "product", "planMonth": this.state.planDay }, function (data) {
             if (data.map.filePath) {
                message.success(data.map.msg);
                window.location.href = data.map.filePath;
            } else {
                message.warning(data.map.msg);
            }

        });
    },/*查看*/
    see(e) {
        var strData = $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData", strData);
    },/*条件搜索*/
    termSearch() {
        $("#loading").removeClass("none");
        this.setState({
            showtype: "1"
        })
        this.ajaxFn({ "controlType": "queryGoodsStatList", "selectType": "product", "pageSize": 20, "pageNumber": 1, "planMonth": this.state.planDay, "goods_id": this.state.goods_id }, function (data) {
            data.map.count == "0" ? message.warning("暂无数据！") : 　message.success("加载完成！");
            this.setState({
                dataTab: data.map.list,
                dataLen: data.map.count,
                pageNum: 1,
            });
        });

    },/*多选选中,获取值*/
    option(key, valueArr) {
        object[key] = valueArr.toString();
        this.setState({[key]:valueArr.toString()});
    },//关键字搜索
    nameSearch: function (e) {
        var e = e || window.event;
        if ((e && e.keyCode == 13) || e.type == "click") { // enter 键
            $("#loading").removeClass("none");

            var memberName = this.refs.memberName.value==""?"":this.refs.memberName.value.replace("，",",");
            this.setState({
                showtype: "2",
                memberName:memberName
            })

            this.ajaxFn({ "controlType": "queryGoodsStatList", "selectType": "product", "pageSize": 20, "pageNumber": 1, name: memberName, "planMonth": this.state.planDay }, function (data) {
                data.map.count == "0" ? message.warning("暂无数据！") : 　message.success("加载完成！");
                this.setState({
                    dataTab: data.map.list,
                    dataLen: data.map.count,
                    pageNum: 1,
                });
            });
        }
    },
    render: function () {
        return (
            <QueueAnim>
                <div className="mb-title h50" key="0">产品拜访统计</div>
                <div className="operation" id="operation" key="1">
                    <MonthPicker placeholder="请选择月份" onChange={this.ant_date} defaultValue={this.state.planDay} style={{ "float": "left" }} />
                    <MultiSelect className="inlineBlock fl" tle="产品"  placeholder="请选择产品" typeName="goods_id"  options={this.state.options} even={this.option} content={this.state.conditionObj.goods_id} />
                    <a href="javascript:void(0)" className="btn btn-search" onClick={this.termSearch}>搜索</a>
                    <a href="javascript:void(0)" className="btn btn-search" onClick={this.export}>导出</a>
                    <div className="form-group fr mem-search">
                        <input type="text" style={{ width: "220px" }} className="fl pl15" placeholder="搜索品名、供应商名、产品ID" ref="memberName" onKeyUp={this.nameSearch} />
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                    </div>
                </div>

                <MemberTabel
                    key="2"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox", "编号/产品/规格", "供应商", "总陈列面", "总陈列数", "平均陈列面", "平均陈列数", "平均加权价", "铺点数", "销售总额", "操作"]}
                    dataKey={["goods_id/goods_name/specification",  "supplier", "display_surface_count", "display_number_count", "display_surface", "display_number", "weighted_price", "shop_point", "sail_total"]}
                    controlArr={[{ conId: 3, conUrl: "productinfo", conClass: "cleflo", callback: this.see }]}
                    />
                <div className="mem-footer row" key="3">
                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-md-11">
                        <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber} />
                    </div>
                </div>
                <Loading loading={this.state.loading} />
            </QueueAnim>
        );
    }
});

/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    handleChange: function (e) {
        if (e.target.value != 0) {
            this.props.even(this.props.typeName, e.target.value);
        } else {
            this.props.even(this.props.typeName, "");
        }
    },
    render: function () {
        return (
            <div className="form-group form-inline fl newadd" style={{ "marginLeft": "15px" }}>
                <label style={{ "textAlign": "center", "paddingRight": "10px" }}>{this.props.tle}</label>
                <select type="text" className="form-control md-sele" onChange={this.handleChange} style={{ "width": "350px" }} >
                    <option value="0">--请选择--</option>
                    {this.props.options.map(function (data, i) {
                        return <option value={data.id} key={i + "po"} title={data.name + " — " + data.specification} >{data.name + " —" + data.specification}</option>
                    })}
                </select>
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
                        return <Option key={data.name+";"+data.id} title={data.id+"/"+data.name+"/"+data.specification} >{data.id+"/"+data.name+"/"+data.specification}</Option>
                    })}
                </Select>
            </div>
        );
    }
});







/*获取当前年月*/
function yearMonth(symbol) {
    var planYear = new Date().getFullYear();
    var planDay = new Date().getMonth() + 1;
    var S = symbol ? symbol : '-';
    return planYear + S + (planDay < 10 ? '0' + planDay : planDay);
}
