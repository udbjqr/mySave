import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';






var object =new Object();

/*商业客户详情*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/chainCustomer.do') {
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
            contentObj:{}       /*信息内容初始对象*/
        }
    },//之前
    componentWillMount:function(){
        var strData = sessionStorage.getItem("TK_strData");
        var customerId = JSON.parse(strData).id;

        /*请求商业客户详情*/
        this.ajaxFn({"controlType":"load","chain_id":customerId},function (data) {
            this.setState({contentObj:data.map.info});
        });

    },/*返回*/
    out:function () {
        window.location.href = "index.html#/businessCustomers";
    },
    render:function(){
        return (
            <div>
                <div className="mb-title">商业客户详情</div>
                <div className="paragraph-tle mt20">
                    <span className="paragraph_left">客户信息</span>
                </div>
                <div className="row addinformation mt30">
                    <div className="col-xs-12 col-sm-12 col-md-8 col-lg-5">
                        <InputBox tle="客户ID：" content={this.state.contentObj.chain_id} />
                        <InputBox tle="客户名称：" content={this.state.contentObj.china_customer_name} />
                        <InputBox tle="负责代表：" content={this.state.contentObj.employeeName} />
                        <SelectData tle="区域：" content={this.state.contentObj.areaName}/>
                    </div>
                </div>
                <div className="col-lg-11 col-lg-offset-1 mt50 form-inline">
                    <div className="form-group">
                        <button className="btn btn-c-t fl ml20" onClick={this.out}>返回</button>
                    </div>
                </div>
            </div>
        );
    }
});










/*input 大组件 需传参数：组件标题，组件业务类型，组件错误返回值*/
var InputBox = React.createClass({
    render:function () {
        return (
            <div className="form-group form-inline stars">
                <label className={this.props.lab}>{this.props.tle}</label>
                <p className="info-p">{this.props.content}</p>
            </div>
        );

    }
});


/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    render:function(){
        return (
            <div className="form-group form-inline stars">
                <label className={this.props.lab}>{this.props.tle}</label>
                <p className="info-p">{this.props.content}</p>
            </div>
        );
    }
});
