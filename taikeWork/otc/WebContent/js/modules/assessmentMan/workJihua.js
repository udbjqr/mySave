import React from 'react'
import MemberTabel from '../react-utils/table'
import Pagination from 'antd/lib/pagination';/*antd 分页组件*/
import Modal from 'antd/lib/modal'
const confirm = Modal.confirm;              /*antd 弹窗组件*/
import message from 'antd/lib/message'      /*antd 提示组件*/
import DatePicker from 'antd/lib/date-picker';/*antd 年月选择*/
const MonthPicker = DatePicker.MonthPicker;
import Select from 'antd/lib/select';       /*antd select*/
const Option = Select.Option;
import Upload from 'antd/lib/upload'        /*antd 上传组件*/
import Button from 'antd/lib/button'        /*antd 按钮组件*/
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import Loading from '../react-utils/loading'         /*加载中组件*/
import '../../../less/tablePage.less'



var editObject = new Object();

/*拜访计划*/
export default React.createClass({
    //ajax 封装
    ajaxFn: function (data, callback, javaUrl = '/otcdyanmic/visitPlan.do') {
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
                $this.setState({ btnLoading: false });
            },
            error() {
                $this.setState({ btnLoading: false });
                $("#loading").addClass("none");
                Modal.error({ title: '错误提示：', content: '出现系统异常，请联系管理员！！' });
            }
        });
    },
    getInitialState: function () {
        var planDay = yearMonth();
        return {
            btnLoading: false,            /*按钮等待状态*/
            dataTab: [],        /*table初始数据*/
            customers: [],      /*客户数据*/
            planDay: planDay,   /*当前月份*/
            showLine: 20,       /*显示行数*/
            pageNum: 1,          /*页码选中值*/
            dataLen: 0,         /*数据条数*/
            editVisible: false, /*弹窗状态*/
            addVisible: false,   /*新增弹窗状态*/
            canControl: '',           /*判断两个按钮是否可用*/
            auditNote: '',           /*意见*/
            randomKey: 0,             /*局部刷新*/
            listInfo: {},             /*单条列表的详情*/
            memberName: "", //搜索关键字
        };
    },
    componentDidMount: function () {
        $("#loading").removeClass("none");
        /*列表数据*/
        this.ajaxFn({ "controlType": "query", "pageSize": 20, "pageNumber": 1, "planDay": this.state.planDay }, function (data) {
            this.setState({
                auditNote: data.map.auditNote,
                canControl: data.map.canControl,
                dataTab: data.map.list,
                dataLen: data.map.count
            });
        });

        /*请求客户*/
        this.ajaxFn({ "controlType": "queryPlanStore" }, function (data) {
            this.setState({ customers: data.map.list });
        }, '/otcdyanmic/customer.do');

    }, /*跳页*/
    pageNumber(page) {
        $("#loading").removeClass("none");
        this.ajaxFn({ "controlType": "query", "pageSize": this.state.showLine, "pageNumber": page, "planDay": this.state.planDay, "customerName": this.state.memberName, }, function (data) {
            this.setState({ dataTab: data.map.list, pageNum: page });
        });
    },//关键字搜索
    nameSearch: function (e) {
        var e = e || window.event;
        if ((e && e.keyCode == 13) || e.type == "click") {
            var cruxName = this.refs.memberName.value;
            $("#loading").removeClass("none");
            this.ajaxFn({ "controlType": "query", "customerName": cruxName, "pageSize": 20, "pageNumber": 1, "planDay": this.state.planDay }, function (data) {
                if (data.map.count == "0") {
                    message.warning('没有相关单位名称！');
                }
                this.setState({
                    dataTab: data.map.list,
                    dataLen: data.map.count,
                    pageNum: 1,
                    memberName: cruxName,
                });
            });
        }
    }, /*年月选择*/
    dateChange: function (value, dateString) {
        if (dateString) {
            $("#loading").removeClass("none");
            this.setState({
                memberName: "",
            })
            this.ajaxFn({ "controlType": "query", "pageSize": 20, "pageNumber": 1, "planDay": dateString }, function (data) {
                this.setState({
                    auditNote: data.map.auditNote,
                    dataTab: data.map.list,
                    dataLen: data.map.count,
                    planDay: dateString,
                    pageNum: 1
                });
            });
        } else {
            message.warning('请输入月份');
        }
    },/*提交审批*/
    submission() {
        this.ajaxFn({ "controlType": "submit", "planDay": this.state.planDay }, function (data) {
            if (data.map.count == "0") {
                message.warning('暂无可提交数据！');
            } else {
                message.success('提交审批成功！');
                /*列表数据*/
                this.ajaxFn({ "controlType": "query", "pageSize": 20, "pageNumber": 1, "planDay": this.state.planDay }, function (data) {
                    this.setState({
                        auditNote: data.map.auditNote,
                        canControl: data.map.canControl,
                        dataTab: data.map.list,
                        dataLen: data.map.count,
                        pageNum: 1
                    });
                });
            }
        });
    },/*限制日期选择*/
    disabledDate(date) {
        var backyear = new Date(this.state.planDay).getFullYear();
        var backMonth = new Date(this.state.planDay).getMonth() + 2;
        var thisdate = date.valueOf().time;                             /*每次进来的时间毫秒数*/
        if (backMonth > 12) {
            backyear += 1;
            backMonth = "01";
        } else if (backMonth < 10) {
            backMonth = "0" + backMonth;
        }
        var MinDate = new Date(this.state.planDay).getTime();               /*最大时间范围*/
        var MaxDate = new Date((backyear + "-" + backMonth)).getTime();         /*最小时间范围*/
        if (thisdate < MinDate) {
            return true;
        } else if (thisdate > MaxDate) {
            return true;
        } else {
            return false;
        }
    },/*新增确定*/
    addOk() {
        this.setState({ btnLoading: true }, function () {
            const {customerAndTypeStr, planDate, planTime, planDay} = this.state;
            if (customerAndTypeStr && planDate && planTime) {
                this.ajaxFn({ "controlType": "add", "customerAndTypeStr": customerAndTypeStr.toString(), "planDay": planDay, "planDate": planDate, "planTime": planTime }, function (data) {
                    message.success('新增成功！');
                    this.setState({ addVisible: false, randomKey: Math.random(), customerAndTypeStr: "", planDate: "", planTime: "" });
                    /*列表数据*/
                    this.ajaxFn({ "controlType": "query", "pageSize": 20, "pageNumber": this.state.pageNum, "planDay": this.state.planDay }, function (data) {
                        this.setState({
                            auditNote: data.map.auditNote,
                            canControl: data.map.canControl,
                            dataTab: data.map.list,
                            dataLen: data.map.count
                        });
                    });
                })
            }
        });
    }, /*修改*/
    edit(e) {
        var strData = $(e.currentTarget).attr("value");
        var planId = JSON.parse(strData).id;
        this.ajaxFn({ "controlType": "load", "planId": planId }, function (data) {
            editObject.planId = planId;
            editObject.planDate = data.map.info.time;
            editObject.planTime = data.map.info.hours;
            this.setState({ editVisible: true, listInfo: data.map.info });
        })
    }, /*确定修改*/
    eidtOk() {
        this.setState({ btnLoading: true }, function () {
            editObject.controlType = "update";
            this.ajaxFn(editObject, function (data) {
                editObject = {};
                message.success("修改成功！");
                this.setState({ editVisible: false });
                /*列表数据*/
                this.ajaxFn({ "controlType": "query", "pageSize": 20, "pageNumber": this.state.pageNum, "planDay": this.state.planDay }, function (data) {
                    this.setState({
                        auditNote: data.map.auditNote,
                        canControl: data.map.canControl,
                        dataTab: data.map.list,
                        dataLen: data.map.count
                    });
                });
            });
        });
    },/*删除*/
    remove(e) {
        var $this = this;
        var strData = $(e.currentTarget).attr("value");
        confirm({
            title: '提示：',
            content: '确认删除该条数据吗？',
            onOk() {
                $this.ajaxFn({ "controlType": "delete", "planId": JSON.parse(strData).id }, function (data) {
                    message.success('删除成功！');
                    /*列表数据*/
                    this.ajaxFn({ "controlType": "query", "pageSize": 20, "pageNumber": this.state.pageNum, "planDay": this.state.planDay }, function (data) {
                        this.setState({
                            auditNote: data.map.auditNote,
                            canControl: data.map.canControl,
                            dataTab: data.map.list,
                            dataLen: data.map.count
                        });
                    });
                });
            },
            onCancel() { },
        });
    },/*清空*/
    empty() {
        var $this = this;
        confirm({
            title: '提示：',
            content: '确认清空数据吗？',
            onOk() {
                $this.ajaxFn({ "controlType": "reset", "planDay": $this.state.planDay }, function (data) {
                    message.success('清空成功！');
                    /*列表数据*/
                    this.ajaxFn({ "controlType": "query", "pageSize": 20, "pageNumber": 1, "planDay": this.state.planDay }, function (data) {
                        this.setState({
                            auditNote: data.map.auditNote,
                            dataTab: data.map.list,
                            dataLen: data.map.count,
                            pageNum: 1
                        });
                    });
                });
            },
            onCancel() { },
        });
    },/*上传文件方法*/
    fileHandle(e) {
        var $this = this;
        var reader = new FileReader();
        var fileName = e.target.files[0].name;
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function (e) {
            $this.ajaxFn({ "controlType": "fileImport", "fileName": fileName, "file": e.target.result, "planMonth": $this.state.planDay }, function (data) {
                message.success(fileName + `导入成功。`);
                /*重新渲染列表*/
                this.ajaxFn({ "controlType": "query", "pageSize": 20, "pageNumber": 1, "planDay": this.state.planDay }, function (data) {
                    this.setState({
                        auditNote: data.map.auditNote,
                        dataTab: data.map.list,
                        dataLen: data.map.count,
                        pageNum: 1
                    });
                });
            })
        };
    }, /*导出*/
    export() {
        this.ajaxFn({ "controlType": "fileExport", "planDay": this.state.planDay }, function (data) {
            if (data.map.filePath) {
                message.success(data.map.msg);
                window.location.href = data.map.filePath;
            } else {
                message.warning(data.map.msg);
            }
        });
    },/*取消弹窗*/
    handleCancel() {
        editObject = {};
        this.setState({ editVisible: false, addVisible: false, randomKey: Math.random(), customerAndTypeStr: "", planDate: "", planTime: "" });
    },
    render: function () {
        return (
            <QueueAnim>
                <div className="mb-title h50" key="1">
                    拜访计划
                    <p className="view">审核意见：{this.state.auditNote}</p>
                </div>
                <div className="operation" id="operation" key="2">
                    <MonthPicker style={{ "float": "left", "marginBottom": "15px" }} placeholder="请选择月份" onChange={this.dateChange} defaultValue={this.state.planDay} />
                    <button className="btn btn-search po-re mb15" onClick={() => { return $(this.refs.file).click() } }>
                        <input ref="file" type="file" style={{ display: "none" }} className="fileStyle" onChange={this.fileHandle} />
                        导入
                    </button>
                    <a href="javascript:void(0)" className="btn btn-search mb15" onClick={this.export}>导出</a>
                    <a href="/otcdyanmic/templates/importVisitsPlan.xls" className="btn btn-search mb15" >下载导入模版</a>
                    <a href="javascript:void(0)" className="btn btn-add mb15" onClick={this.submission} disabled={this.state.canControl == 0 ? true : false}>提交审批</a>
                    <a href="javascript:void(0)" className="btn btn-add mb15" onClick={this.empty} disabled={this.state.canControl == 0 ? true : false}>清空数据</a>
                    <a href="javascript:void(0)" className="btn btn-add mb15" onClick={() => this.setState({ addVisible: true })}><span className="icon-add"></span>新增</a>
                    <div className="form-group fr mem-search">
                        <input type="text" className="fl pl15" placeholder="搜索单位名称" ref="memberName" onKeyUp={this.nameSearch} />
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                    </div>
                </div>
                <MemberTabel
                    key="3"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox", "客户编号", "单位名称", "地址", "日期", "时段", "状态","标记状态","请假状态", "操作"]}
                    dataKey={["custom_id", "coustom", "address", "time", 'hours', 'statusShow',"mark_type","leaveShow"]}
                    controlArr={[{ conId: 2, callback: this.edit }, { conId: 1, callback: this.remove }]}
                    />
                <div className="mem-footer row" key="4">
                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-md-11">
                        <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen}
                            pageSize={this.state.showLine} onChange={this.pageNumber} />
                    </div>
                </div>



                {/*新增弹窗*/}
                <Modal title="新增拜访计划" visible={this.state.addVisible} onOk={this.addOk} onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.addOk}>确定</Button>,
                    ]}
                    >
                    <AddSelect key={this.state.randomKey} tle="选择客户" options={this.state.customers} onChange={val => this.setState({ customerAndTypeStr: val })} />
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="addInput">
                                <label>选择日期</label>
                                <DatePicker
                                    key={this.state.randomKey}
                                    size="large"
                                    style={{ "width": "70%" }}
                                    disabledDate={this.disabledDate}
                                    onChange={(value, dateString) => this.setState({ planDate: dateString })}
                                    />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="addInput">
                                <label>选择时段</label>
                                <Select
                                    key={this.state.randomKey}
                                    size="large"
                                    style={{ width: "70%" }}
                                    optionFilterProp="children"
                                    onChange={(val) => this.setState({ planTime: val })}
                                    >
                                    <Option value="请选择时段">请选择时段</Option>
                                    <Option value="AM">上午</Option>
                                    <Option value="PM">下午</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Modal>

                {/*修改弹窗*/}
                <Modal title="修改拜访计划" visible={this.state.editVisible} onOk={this.eidtOk} onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.eidtOk}>确定</Button>,
                    ]}
                    >
                    <EditSelect tle="选择客户" options={this.state.customers} content={this.state.listInfo.custom_id} />
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="addInput">
                                <label>选择日期</label>
                                <DatePicker
                                    size="large"
                                    style={{ "width": "70%" }}
                                    disabledDate={this.disabledDate}
                                    onChange={(val) => editObject.planDate = val}
                                    defaultValue={this.state.listInfo.time}
                                    />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="addInput">
                                <label>选择时段</label>
                                <Select
                                    size="large"
                                    style={{ width: "70%" }}
                                    optionFilterProp="children"
                                    onChange={(val) => editObject.planTime = val}
                                    defaultValue={this.state.listInfo.hours}
                                    >
                                    <Option value="AM">上午</Option>
                                    <Option value="PM">下午</Option>
                                </Select>
                            </div>
                        </div>
                    </div>
                </Modal>


                <Loading loading={this.state.loading} />
            </QueueAnim>
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


/*弹窗修改上的select*/
var EditSelect = React.createClass({
    render: function () {
        var val = this.props.content ? this.props.content + "" : "";
        return (
            <div className="entrySelect">
                <label>{this.props.tle}</label>
                <Select
                    showSearch
                    size="large"
                    style={{ width: 410 }}
                    optionFilterProp="children"
                    onChange={this.props.onChange}
                    value={val}
                    disabled
                    >
                    {this.props.options.map(function (data, i) {
                        return <Option key={i + "and_option"} value={"" + data.id}>{data.name}</Option>
                    })}
                </Select>
            </div>
        );
    }
});



/*弹窗新增上的select*/
var AddSelect = React.createClass({
    render: function () {
        return (
            <div>
                <label className="label1">{this.props.tle}</label>
                <Select
                    tags
                    size="large"
                    style={{ width: 419 }}
                    searchPlaceholder="标签模式"
                    onChange={this.props.onChange}
                    placeholder="请选择"
                    >
                    {this.props.options.map(function (data, i) {
                        return <Option key={i + "and_option"} value={data.id + ":" + data.type} title={data.name}>{data.name}</Option>
                    })}
                </Select>
            </div>
        );
    }
});
