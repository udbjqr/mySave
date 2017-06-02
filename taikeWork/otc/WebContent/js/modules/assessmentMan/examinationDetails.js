import React from 'react'
import MemberTabel from  '../react-utils/table'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import DatePicker from 'antd/lib/date-picker';      /*antd 年月选择*/
const MonthPicker = DatePicker.MonthPicker;
import '../../../less/tablePage.less'




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
            dataTab : [],       /*table初始数据*/
            pageNum:1,		    /*默认选择页码*/
            showLine:20,	    /*显示行数*/
            dataLen:0		    /*数据条数*/
        };
    },
    componentDidMount:function(){
        var $this = this;
        this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":1},function (data) {
            var obj = data.map.memberList;
            var pageNum = Math.ceil(data.map.pageCount / $this.state.showLine);
            $this.setState({
                dataTab:obj,
                pageNum:pageNum,
                dataLen:data.map.pageCount
            });
            $this.jqPaginator();
        });

    },
    render:function(){
        return (
            <div>
                <div className="border0">{}考核详情</div>
                <div className="kpi">
                    <span className="fl">KPI得分：<i></i></span>
                    <span className="fr">排名：<i></i></span>
                </div>
                <div className="operation" id="operation">
                    <MonthPicker placeholder="请选择月份" />
                    <button type="button" className="btn btn-search" onClick={this.searchTime}>搜索</button>
                    <button type="button" className="btn btn-search" onClick={this.searchTime}>导出</button>
                    <button type="button" className="btn btn-search" onClick={this.searchTime}>导出</button>
                    <div className="form-group fr mem-search">
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                        <input type="text" className="fr" placeholder="搜索关键字 " ref="memberName" />
                    </div>
                </div>
                <MemberTabel
                    tableStyle="checkbox"
                    dataTable={this.state.dataTab}
                    eventPopup={this.eventPopup}
                    ajaxUrl='otcdyanmic/otcdyanmic.tab.json'
                    titleName={["checkbox","编号","产品","规格","供应商","平均陈列面","平均陈列数","铺点数","平均加权价","南华销售总额","得分"]}
                    dataKey={["identifier","product_name","yg_name","role","clm_score","cls_score","average","pds_score","xsze_score","total_score"]}
                />

            
            </div>
        );
    }
});
