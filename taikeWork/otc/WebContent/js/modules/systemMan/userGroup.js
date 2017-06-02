import React from 'react'
import MemberTabel from '../react-utils/table'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import Dropdown from 'antd/lib/dropdown'
import Button from 'antd/lib/button'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import DateRange from '../react-utils/dateRange.js'             /*antd 日期范围组件*/
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import message from 'antd/lib/message'              /*antd 提示组件*/
import '../../../less/tablePage.less'



/*通用表格页面*/
export default React.createClass({
    //ajax 封装
    ajaxFn: function (data, callback, javaUrl = '/otcdyanmic/department.do') {
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
            },
            error() {
                Modal.error({ title: '错误提示：', content: '出现系统异常，请联系管理员！！' });
            }
        });
    },
    getInitialState: function () {
        return {
            dataTab: [],
            showLine: 20,	/*显示行数*/
            dataLen: 0,		/*数据条数*/
            pageNum: 1,       /*页码选中值*/
            memberName: "", //搜索关键字
        };
    },
    componentDidMount: function () {
        /*进入时初始化数据*/
        this.ajaxFn({ "controlType": "query", "pageSize": 20, "pageNumber": 1 }, function (data) {
            this.setState({
                dataTab: data.map.list,
                dataLen: data.map.count
            });
        });
    },/*跳页*/
    pageNumber(page) {
        this.ajaxFn({ "controlType": "query", "pageSize": this.state.showLine, "pageNumber": page, deptName: this.state.memberName }, function (data) {
            this.setState({ dataTab: data.map.data, pageNum: page });
        });
    },//行数选中回调函数
    lineNumber: function (obj) {
        var num = obj.key * 1;
        this.setState({ showLine: num });
        this.ajaxFn({ "controlType": "query", "pageSize": num, "pageNumber": 1 }, function (data) {
            this.setState({
                dataTab: data.map.list,
                showLine: num,
                pageNum: 1
            });
        });
    },//按时间范围搜索，回调函数
    searchTime: function (sd, ed) {
        console.log(sd + "==" + ed);
        if (sd != "" && ed != "") {
            this.setState({
                memberName: "",
            })
            this.ajaxFn({ "controlType": "query", "pageSize": this.state.showLine, "pageNumber": this.state.pageNum, "startDate": sd, "endDate": ed }, function (data) {
                this.setState({
                    dataTab: data.map.list,
                    dataLen: data.map.count,
                    pageNum: 1
                });
            })
        }
    },//关键字搜索
    nameSearch: function (e) {
        var e = e || window.event;
        if ((e && e.keyCode == 13) || e.type == "click") {
            var memberName = this.refs.memberName.value;
            this.ajaxFn({ "controlType": "query", "deptName": memberName, "pageSize": this.state.showLine, "pageNumber": 1 }, function (data) {
                if (data.map.count == "0") {
                    message.warning('没有相关用户组');
                }
                this.setState({
                    dataLen: data.map.count,
                    dataTab: data.map.list,
                    pageNum: 1,
                    memberName: memberName,
                });
            })
        }
    },/*修改*/
    edit(e) {
        var strData = $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData", strData);
    },/*查看详情*/
    see(e) {
        var strData = $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData", strData);
    },
    render: function () {
        return (
            <QueueAnim>
                <div className="mb-title" key="1">用户组管理</div>
                <div className="operation" id="operation" key="2">
                    <Dropdown
                        overlay={(
                            <Menu onClick={this.lineNumber}>
                                <Menu.Item key="10">10</Menu.Item>
                                <Menu.Item key="20">20</Menu.Item>
                                <Menu.Item key="50">50</Menu.Item>
                                <Menu.Item key="100">100</Menu.Item>
                            </Menu>)}
                        >
                        <Button type="ghost" style={{ height: "34px", marginRight: '20px' }}>
                            {this.state.showLine} <Icon type="circle-o-down" />
                        </Button>
                    </Dropdown>
                    <DateRange size="large" showTime searchTime={this.searchTime} />
                    <a href="#userGroupMan" className="btn btn-add"><span className="icon-add"></span>新增</a>
                    <div className="form-group fr mem-search">
                        <input type="text" className="fl pl15" placeholder="搜索用户组名称" ref="memberName" onKeyUp={this.nameSearch} />
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                    </div>
                </div>
                <MemberTabel
                    key="3"
                    tableStyle="control"
                    dataTable={this.state.dataTab}
                    eventPopup={this.eventPopup}
                    ajaxUrl='otcdyanmic/otcdyanmic.tab.json'
                    titleName={["序号", "用户组名称", "用户组组长", "用户组说明", "创建时间", "操作"]}
                    dataKey={["index", "dept_name", "adminName", "remark", "create_time"]}
                    controlArr={[{ conId: 2, conUrl: "userGroupModify", callback: this.edit }, { conId: 3, conUrl: "userGroupDetails", callback: this.see }]}
                    />

                <div className="mem-footer row" key="4">
                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-md-11">
                        <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber} />
                    </div>
                </div>
            </QueueAnim>
        );
    }
});
