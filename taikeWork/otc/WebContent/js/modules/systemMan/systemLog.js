import React from 'react'
import MemberTabel from  '../react-utils/table'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import DateRange from '../react-utils/dateRange.js' /*antd 日期范围组件*/
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import Dropdown from 'antd/lib/dropdown'
import Button from 'antd/lib/button'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import '../../../less/tablePage.less'



/*通用表格页面*/
export default React.createClass({
    /*ajax 封装*/
    ajaxFn:function(returnData,callback){
        var $this = this;
        $.ajax({
            type:"post",
            url:'/otcdyanmic/otcdyanmic.do',
            data:{paramMap:JSON.stringify(returnData)},
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
            },
            error(){
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    getInitialState:function(){
        return {
            dataTab : [],
            showLine:20,	/*显示行数*/
            dataLen:0,		/*数据条数*/
            options:[]
        };
    },
    componentDidMount:function(){
        /*进入时初始化数据*/
        this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":1},function (data) {
            this.setState({
                dataTab:data.map.memberList,
                dataLen:data.map.count
            });
        });
    },/*跳页*/
    pageNumber(page){
        this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":page},function (data) {
            this.setState({dataTab:data.map.data});
        });
    },//行数选中回调函数
    lineNumber:function (obj) {
        var num = obj.key * 1;
        this.ajaxFn({"controlType":"query","pageSize":num,"pageNumber":1},function (data) {
            $this.setState({
                dataTab:data.map.memberList,
                showLine:num
            });
        });
    },//按时间范围搜索，回调函数
    searchTime:function(sd,ed){
        console.log(sd+"==="+ed);
        this.ajaxFn({"controlType":"query","startDate":sd,"endDate":ed},function (data) {
            this.setState({
                dataTab:data.map.memberList,
                dataLen:data.map.count
            });
        })

    },//关键字搜索
    nameSearch:function () {
        var memberName = this.refs.memberName.value;
        this.ajaxFn({"controlType":"query","name":memberName,"pageSize":20,"pageNumber":1},function (data) {
            if(!data.map.data){
                messages.warning('没有相关的关键字');
            }
            this.setState({
                dataLen:data.map.count,
                dataTab:data.map.data
            });
        })
    },
    render:function(){
        return (
            <QueueAnim>
                <div className="mb-title" key="1">系统日志</div>
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
                        <Button type="ghost" style={{height:"34px"}}>
                            {this.state.showLine} <Icon type="circle-o-down" />
                        </Button>
                    </Dropdown>
                    <DateRange size="large" showTime  searchTime={this.searchTime} />
                    <div className="form-group fr mem-search">
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                        <input type="text" className="fr" placeholder="搜索关键字" ref="memberName" />
                    </div>
                </div>
                <MemberTabel
                    key="3"
                    tableStyle="checkbox"
                    dataTable={this.state.dataTab}
                    eventPopup={this.eventPopup}
                    ajaxUrl='otcdyanmic/otcdyanmic.tab.json'
                    titleName={["checkbox","帐号名","IP地址","日志产生时间","操作描述"]}
                    dataKey={["accounts_name","ip_address","rzcs_timer","cz_describe"]}
                />

                <div className="mem-footer row" key="4">
                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-md-11">
                        <Pagination className="antd-page" showQuickJumper defaultCurrent={1} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                    </div>
                </div>
            </QueueAnim>
        );
    }
});
