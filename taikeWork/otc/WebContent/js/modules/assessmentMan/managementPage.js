import React from 'react'
import {Link} from 'react-router'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import Tabs from 'antd/lib/tabs';                   /*tabs 组件*/
const TabPane = Tabs.TabPane;
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import '../../../less/tablePage.less'






/*门店拜访统计 中转页*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/appraisalConfig.do') {
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
            },
            error(){
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    getInitialState(){
        return {
            assessmentInfo:{}
        }
    },
    componentDidMount:function(){
        this.ajaxFn({"controlType":"queryAll"},function(data){
            this.setState({assessmentInfo:data.map.info});
        });

        var tabsKey = sessionStorage.getItem("TK_assessTabs");
        if(tabsKey == 1){
            window.location.href = "index.html#/managementPage/assessInfoMaintain";
        }else if(tabsKey == 2){
            window.location.href = "index.html#/managementPage/assessInfoEducate";
        }else if(tabsKey == 3){
            window.location.href = "index.html#/managementPage/assessInfoEducateSales";
        }
    },
    visitChildPage:function (key) {
        if(key == 1){
            sessionStorage.setItem("TK_assessTabs",key)
            window.location.href = "index.html#/managementPage/assessInfoMaintain";
        }else if(key == 2){
            sessionStorage.setItem("TK_assessTabs",key)
            window.location.href = "index.html#/managementPage/assessInfoEducate";
        }else if(key == 3){
            sessionStorage.setItem("TK_assessTabs",key)
            window.location.href = "index.html#/managementPage/assessInfoEducateSales";
        }
    },
    render:function(){
        return (
            <QueueAnim>
                <div className="h50 border0" key="a">考核设置</div>
                {/*
                <div className="check-data mb15">
                    <p className="kpi-p"><span className="aColor090">KPI总得分：</span></p>
                    <p className="kpi-p">维护考核得分：</p>
                    <p className="kpi-p">教育考核得分：</p>
                    <p className="kpi-p">销量考核得分：</p>
                    <p className="kpi-p"><span className="aColor090">排名：</span></p>
                </div>
               */ }
                <Tabs type="card" onChange={this.visitChildPage} defaultActiveKey={sessionStorage.getItem("TK_assessTabs") ? sessionStorage.getItem("TK_assessTabs") : '1'} key="b">
                    <TabPane tab="维护考核详情" key="1"></TabPane>
                    <TabPane tab="教育考核详情" key="2"></TabPane>
                    <TabPane tab="销量考核详情" key="3"></TabPane>
                </Tabs>
                <div key="c">
                    {this.props.children}
                </div>
            </QueueAnim>
        );
    }
});
