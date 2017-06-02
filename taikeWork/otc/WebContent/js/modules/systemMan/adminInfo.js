import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';                /*antd 提示组件*/
import '../../../less/addInformation.less'

export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/userManger.do') {
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
            contentObj:{}     /*管理员信息详情*/
        }
    },
    componentWillMount(){
        /*通过ID查询数据*/
        var strData = sessionStorage.getItem("TK_strData");
        var productId = JSON.parse(strData).id;
        this.ajaxFn({"controlType":"load","employee_id":productId},function (data) {
            this.setState({
                contentObj:data.map.employee
            });
        })
    },
	render:function(){
		return (
			<div>
				<div className="mb-title">管理员信息详情</div>
				<div className="row persInfo mt40">
					<div className="col-md-2 col-lg-2 persInfo-from">
						<div className="text-center">帐号名：</div>
                        <div className="text-center">员工姓名：</div>
                        <div className="text-center">微信号：</div>
                        <div className="text-center">手机号码：</div>
						<div className="text-center">部门：</div>
						<div className="text-center">地区：</div>
                        <div className="text-center">角色：</div>
                        <div className="text-center">用户类型：</div>
					</div>
					<div className="col-md-3 col-lg-3 persInfo-from">
						<div>{this.state.contentObj.login_name}</div>
						<div>{this.state.contentObj.real_name}</div>
						<div>{this.state.contentObj.weixin_name}</div>
						<div>{this.state.contentObj.mobile}</div>
                        <div>{this.state.contentObj.departmentName}</div>
                        <div>{this.state.contentObj.areaName}</div>
                        <div>{this.state.contentObj.employee_type_name}</div>
                        <div>{this.state.contentObj.roleName}</div>
					</div>
				</div>
                <div className="row">
                    <div className="col-md-1 col-md-offset-1">
                        <a href="#userMan" className="btn btn-block btn-c-t mt20">返回</a>
                    </div>
                </div>
			</div>
		);
	}
})
