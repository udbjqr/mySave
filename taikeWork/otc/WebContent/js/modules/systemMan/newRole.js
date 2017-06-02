import React from 'react'
import Tabs from 'antd/lib/tabs';                   /*tabs 组件*/
const TabPane = Tabs.TabPane;
import Tree from 'antd/lib/tree';
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
const TreeNode = Tree.TreeNode;
import message from 'antd/lib/message'              /*antd 提示组件*/
import '../../../less/addInformation.less'


var object = new Object();
/*通用表格页面*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/roleGroup.do') {
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
    componentDidMount:function(){

    },
    antdCheck:function (info) {
        console.log(info);
    },/*确定保存*/
    keep(){
        if(object.group_name){
            object.controlType = "add";
            this.ajaxFn(object,function (data) {
                message.success("新增角色成功，请为角色分配权限！");
                sessionStorage.setItem("roleId",data.map.role_id);
                window.location.href = "index.html#/modifyRole";

            })
        }else{
            message.warning("请填写完整内容！");
        }
    },/*返回*/
    out(){
        window.location.href = "index.html#/roleMan";
    },
    render:function(){
        return (
            <div>
                <div className="h50 border0">新增角色</div>
                <Tabs type="card">
                    <TabPane tab="角色信息" key="1">
                        <div className="row mt20">
                            <div className="col-lg-6">
                                <InputGroup tle="角色名称" inputClass="form-control role-md-input" typeName="group_name"  isStars="true " />
                                <InputGroup tle="角色描述" inputClass="form-control role-lg-input" typeName="remark"/>
                            </div>
                        </div>
                        <div className="btn-box mt50 ml70">
                            <button className="btn btn-w btn-c-o fl" onClick={this.keep} >保存</button>
                            <button className="btn btn-w btn-c-t fl" onClick={this.out}>返回</button>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});



var InputGroup=React.createClass({
    valChange(e){
        object[this.props.typeName] = e.target.value;
    },
    render(){
        return (
            <div className={"form-inline mb15"+(this.props.isStars ? " yy_stars" : "")}>
                <label>{this.props.tle}</label>
                <input type="text" className={this.props.inputClass} onChange={this.valChange} />
            </div>
        );
    }
});
