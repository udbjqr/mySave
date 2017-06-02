
import React from 'react'
import {Link} from 'react-router'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import DatePicker from 'antd/lib/date-picker'       //ant 日期组件
import Tabs from 'antd/lib/tabs';                   /*tabs 组件*/
const TabPane = Tabs.TabPane;
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import '../../../less/tablePage.less'






/*门店拜访统计 中转页*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/visitStat.do') {
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
    getInitialState:function(){
        return {
            visiKey:1
        }
    },
    componentDidMount:function(){
        var visiKey = sessionStorage.getItem("TK_visiKey");
        this.setState({visiKey:visiKey});
    },
    visitChildPage:function (key) {
        if(key == 1){
            window.location.href = "index.html#/idMatchSetUp/saleStore";
        }else{
            window.location.href = "index.html#/idMatchSetUp/saleProduct";
        }
        sessionStorage.setItem("TK_visiKey",key);
    },
    render:function(){
        return (
            <QueueAnim>
                <div className="h50 border0" key="1">ID匹配设置</div>
                <Tabs type="card" onChange={this.visitChildPage}  key="2" defaultActiveKey={this.state.visiKey}>
                    <TabPane tab="门店" key="1"></TabPane>
                    <TabPane tab="产品" key="2"></TabPane>
                </Tabs>
                <div key="3">
                    {this.props.children}
                </div>
            </QueueAnim>
        );
    }
});
