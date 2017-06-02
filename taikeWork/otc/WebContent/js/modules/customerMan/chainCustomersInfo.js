import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import DateRange from '../react-utils/dateRange.js' /*antd 日期范围组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import message from 'antd/lib/message';






var object =new Object();

/*连锁客户详情*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/customer.do') {
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
            contentObj:{}          /*信息内容初始对象*/
        }
    },//之前
    componentWillMount:function(){
        var strData = sessionStorage.getItem("TK_strData");
        var customerId = JSON.parse(strData).id;
        /*进入时请求客户信息数据*/
        this.ajaxFn({"controlType":"load","id":customerId},function (data) {
            this.setState({contentObj:data.map.customer});
        });
    },/*返回*/
    out:function () {
        window.location.href = "index.html#/chainCustomers";
    },
    render:function(){
        return (
            <div>
                <div className="mb-title">门店客户详情</div>
                <div className="paragraph-tle mt20">
                    <span className="paragraph_left">客户信息</span>
                </div>
                <div className="row addinformation mt30">
                    <div className="col-lg-4">
                        <InputBox tle="客户名称：" content={this.state.contentObj.customerName} />
                    </div>
                    <div className="col-lg-4">
                        <InputBox tle="区域："  content={this.state.contentObj.areaName}/>
                    </div>
                    <div className="col-lg-4">
                        <InputBox tle="连锁客户：" content={this.state.contentObj.chainCustomerName}/>
                    </div>
                </div>
                <div className="row addinformation mt30">
                    <div className="col-lg-4">
                        <InputBox tle="主管：" content={this.state.contentObj.personInChargeName}/>
                    </div>
                    <div className="col-lg-4">
                        <InputBox tle="代表：" content={this.state.contentObj.realName}/>
                    </div>
                    <div className="col-lg-4">
                        <InputBox tle="区域经理：" content={this.state.contentObj.areaManagerName}/>
                    </div>
                </div>
                <div className="row addinformation mt30">
                    <div className="col-lg-4">
                        <InputBox tle="门店类型：" content={this.state.contentObj.attributesName}/>
                    </div>
                    <div className="col-lg-4">
                        <InputBox tle="门店联系人：" content={this.state.contentObj.buyer}/>
                    </div>
                    <div className="col-lg-4">
                        <InputBox tle="门店联系人电话：" content={this.state.contentObj.buyerPhone}/>
                    </div>
                </div>

                <div className="row addinformation mt30">
                    <div className="col-lg-6">
                        <RegionData tle="地址：" content={this.state.contentObj.address}/>
                    </div>
                </div>

                <div className="btn-box col-md-offset-1 mt50">
                    <button className="btn btn-w btn-c-t fl" onClick={this.out}>返回</button>
                </div>
            </div>
        );
    }
});





/*input 大组件 需传参数：组件标题，组件业务类型，组件错误返回值*/
var InputBox = React.createClass({
    render:function () {
        return (
            <div className="form-group">
                <div className="col-lg-4">
                    <label>{this.props.tle}</label>
                </div>
                <div className="col-lg-8">
                    <p className="info-p">{this.props.content}</p>
                </div>
            </div>
        );
    }

});


/*select 组件，参数：标题，option数组对象*/
var RegionData = React.createClass({
    render:function(){
        return (
            <div className="form-group">
                <div className="col-lg-3">
                    <label>{this.props.tle}</label>
                </div>
                <div className="col-lg-9">
                    <p className="info-p">{this.props.content}</p>
                </div>
            </div>
        );
    }
});
