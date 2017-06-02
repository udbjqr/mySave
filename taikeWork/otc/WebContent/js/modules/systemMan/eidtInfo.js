import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';

var infoObj = new Object();
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
            infoObj:{}
        }
    },
    componentDidMount(){
        this.ajaxFn({"controlType":"load"},function (data) {
            this.setState({infoObj:data.map.employee});
        });
    },
    submit:function () {
        if(infoObj.realName == "" || infoObj.realName == null){
            message.warning("请填写姓名");
            return false;
        }else if(infoObj.mobile == "" || infoObj.mobile == null){
            message.warning("请填写手机号");
            return false;
        }else if(infoObj.weixinName == "" || infoObj.weixinName == null){
            message.warning("请填写微信号");
            return false;
        }
        infoObj.controlType = "update";
        this.ajaxFn(infoObj,function (data) {
            message.success('修改成功！');
            window.location.href = 'index.html#/persInfo';
        })
    },
    out(){
      window.location.href = 'index.html#/persInfo';
    },
    render:function () {
        return (
            <div>
                <div className="mb-title ">修改个人信息</div>
                <div className="col-md-4 modifyPswd">
                    <div className="form-group form-inline">
                        <label className="big-label">姓名</label>
                        <InputEidt typeName="realName" infoObj={this.state.infoObj.realName} />
                    </div>
                    <div className="form-group form-inline">
                        <label className="big-label">手机号码</label>
                        <InputEidt typeName="mobile" infoObj={this.state.infoObj.mobile} />
                    </div>
                    <div className="form-group form-inline">
                        <label className="big-label">微信号</label>
                        <InputEidt typeName="weixinName" infoObj={this.state.infoObj.weixinName} />
                    </div>
                    <div className="col-lg-11 col-lg-offset-1 mt50 form-inline">
                        <div className="form-group">
                            <button className="btn btn-c-o fl ml20" onClick={this.submit}>确定</button>
                            <button className="btn btn-c-t fl ml20" onClick={this.out}>返回</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});



var InputEidt = React.createClass({
    getInitialState(){
        return{
            first:true,
        }
    },
    infoEven:function (e) {
        infoObj[this.props.typeName] = e.target.value;
        this.setState({first:false});
    },
    render:function () {
        if(this.state.first){
            infoObj[this.props.typeName] = this.props.infoObj;
        }
        return <input ref="input" type="text" className="form-control" onChange={this.infoEven} value={infoObj[this.props.typeName]} />
    }
});
