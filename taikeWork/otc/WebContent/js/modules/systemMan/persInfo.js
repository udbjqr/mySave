import React from 'react'
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import '../../../less/addInformation.less'

export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/employee.do') {
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
            persInfo:{}         /*个人信息*/
        }
    },
    componentWillMount(){
        this.ajaxFn({"controlType":"load"},function (data) {
            this.setState({persInfo:data.map.employee});
        })
    },
	render:function(){
		return (
			<QueueAnim>
				<div className="mb-title" key="1">个人信息</div>
				<div className="row persInfo mt40" key="2">
					<div className="col-md-2 col-lg-1 col-md-offset-1 persInfo-from">
						<div>帐号名</div>
						<div>姓名</div>
						<div>微信号</div>
						<div>手机号码</div>
						<div>创建时间</div>
						<div>最后登入</div>
					</div>
					<div className="col-md-4 col-lg-3 persInfo-from" key="3">
						<div>{this.state.persInfo.loginName}</div>
						<div>{this.state.persInfo.realName}</div>
						<div>{this.state.persInfo.weixinName}</div>
						<div>{this.state.persInfo.mobile}</div>
						<div>{this.state.persInfo.createTime}</div>
						<div>{this.state.persInfo.lastLoginTime}</div>
						<a href="#eidtInfo" className="btn btn-c-o fl ml20 mt30">修改</a>
					</div>
				</div>
			</QueueAnim>
		);
	}
})
