import React from 'react'
import Modal from 'antd/lib/modal'                      /*antd 弹窗组件*/
import message from 'antd/lib/message';                /*antd 提示组件*/
import '../../../less/addInformation.less'

export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/department.do') {
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
        return{
            userGroup:{},        /*用户组当前数据集合*/
            member:[]
        }
    },
    componentDidMount(){
        var $this = this;
        var strData = sessionStorage.getItem("TK_strData");
        var userId = JSON.parse(strData).deptId;
        /*获取用户组详情数据*/
        this.ajaxFn({"controlType":"load","deptId":userId},function (data) {
            this.setState({
                userGroup:data.map.info,
                member:data.map.userNames
            });
        });








    },
    render:function(){
        return (
            <div>
                <div className="mb-title">用户组详情</div>
                <div className="row persInfo mt40">
                    <div className="col-xs-12 col-ms-12 col-md-12 col-lg-12">
                        <InfoShow tle="用户组名称：" content={this.state.userGroup.dept_name} />
                    </div>
                    <div className="col-xs-12 col-ms-12 col-md-12 col-lg-12">
                        <InfoShow tle="用户组组长：" content={this.state.userGroup.administratorName} />
                    </div>
                    <div className="col-xs-12 col-ms-12 col-md-12 col-lg-12">
                        <InfoShow
                            tle="用户组成员："
                            content={this.state.member.map(function (data,i) {
                                return <span key={i} className="group-member">{data}</span>
                            })}
                        />
                    </div>
                    <div className="col-xs-12 col-ms-12 col-md-12 col-lg-12">
                        <InfoShow tle="用户组说明：" content={this.state.userGroup.remark} />
                    </div>
                    <div className="col-lg-11 col-lg-offset-1 mt50 form-inline">
                        <div className="form-group">
                            <a href="#userGroup" className="btn btn-c-t fl ml20" >返回</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
})

var InfoShow = React.createClass({
    render(){
        const {tle,content} = this.props;
        return (
            <div className="mb15 clear">
                <label className="w100 fl">{tle}</label>
                <p className="inlineBlock fl maxWidth800">{content}</p>
            </div>
        )
    }
});
