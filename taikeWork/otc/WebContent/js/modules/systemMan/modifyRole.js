import React from 'react'
import Tabs from 'antd/lib/tabs';                   /*tabs 组件*/
const TabPane = Tabs.TabPane;
import Tree from 'antd/lib/tree';                        /*树形组件*/
const TreeNode = Tree.TreeNode;
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';                /*antd 提示组件*/
import '../../../less/addInformation.less'


var object = new Object();
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/roleGroup.do') {
        var $this = this;
        $.ajax({
            type:"post",
            url:javaUrl,
            data:{paramMap:JSON.stringify(data)},
            dataType: "json",
            //async:false,	//false 表示ajax执行完成之后在执行后面的代码
            success:function(data){
                $this.setState({loading:false});
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
            roleInfo:{},        /*角色信息*/
            roleJson:[],        /*功能权限JSON文件*/
            dataJson:[],        /*数据权限JSON文件*/
            defaultKeys:[],     /*功能权限默认选中*/
            dataDefaultKey:[],  /*数据权限默认选中*/
            jurisdiction:'',     /*选中功能权限数据*/
            checkData:'',       /*选中的数据权限数据*/
            thisDataId:''       /*当前数据ID*/
        };
    },
    componentDidMount:function(){
        var $this = this;
        var productId = '';
        if(sessionStorage.getItem("roleId")){
            productId =  sessionStorage.getItem("roleId");
            sessionStorage.removeItem("roleId")
        }else{
            var strData = sessionStorage.getItem("TK_strData");
            productId = JSON.parse(strData).id;
        }
        this.setState({thisDataId:productId});
        /*角色基本数据*/
        this.ajaxFn({"controlType":"load","loadType":"role","role_id":productId},function (data) {
            object = data.map.info;
            this.setState({roleInfo:data.map.info});
            /*数据权限数据*/
            this.ajaxFn({"controlType":"load","loadType":"data","role_id":productId},function (data) {
                var dataDefaultKey = data.map.info.premissionStr.split(",");
                this.setState({
                    dataJson:data.map.info.items,
                    dataDefaultKey:dataDefaultKey
                });
                this.dataCheck(dataDefaultKey);
            });
        });

        /*功能权限默认选中数据*/
        this.ajaxFn({"controlType":"load","loadType":"function","role_id":productId},function (data) {
            var defaultKey = data.map.info.permission.split(",");
            this.setState({defaultKeys:defaultKey});
            this.antdCheck(defaultKey);
        });

        /*功能权限数据*/
        $.getJSON('/otcdyanmic/permission.json',function(json){
            
            $this.setState({roleJson:json});
        });

    },/*功能权限选中操作*/
    antdCheck:function (info) {
        var arr = [];
        info.forEach(function (data,i) {
            var isNumber = data * 1;
            if(isNumber){
                arr.push(data+":1");
            }
        });
        this.setState({jurisdiction:arr.toString()});
    },/*数据权限选中操作*/
    dataCheck:function (info) {
        var arr = [];
        info.forEach(function (data,i) {
            var isNumber = data * 1;
            if(!isNumber){
                arr.push(data);
            }
        });
        this.setState({checkData:arr.toString()});
    },/*提交角色信息*/
    submitRoleInfo(){
        object.controlType = "update";
        object.updateType = "role";
        object.role_id = this.state.thisDataId;
        this.ajaxFn(object,function (data) {
            message.success('修改成功！');
            window.location.href = "index.html#/roleMan";
        });
    },/*提交功能权限*/
    submitFnJu(){
        this.ajaxFn({"controlType":"update","updateType":"function","permission":this.state.jurisdiction,"role_id":this.state.thisDataId},function (data) {
            message.success('修改成功！');
            window.location.href = "index.html#/roleMan";
        })
    },/*提交数据权限*/
    submitDataJu(){
        this.ajaxFn({"controlType":"update","updateType":"data","role_id":this.state.thisDataId,"datapermission":this.state.checkData},function (data) {
            message.success('修改成功！');
            window.location.href = "index.html#/roleMan";
        });

    },/*退出*/
    out(){
        window.location.href = "index.html#/roleMan";
    },
    render:function(){
        return (
            <div>
                <div className="h50 border0">修改角色</div>
                <Tabs type="card">
                    <TabPane tab="角色信息" key="1">
                        <div className="row mt20">
                            <div className="col-lg-7">
                                <InputGroup tle="角色名称" inputClass="form-control role-md-input" val={this.state.roleInfo.group_name} typeName="group_name" stars="yy_stars" />
                                <InputGroup tle="角色描述" inputClass="form-control role-lg-input" val={this.state.roleInfo.remark} typeName="remark" />
                            </div>
                        </div>
                        <div className="btn-box mt50 ml70">
                            <button className="btn btn-w btn-c-o fl" onClick={this.submitRoleInfo}>保存</button>
                            <button className="btn btn-w btn-c-t fl" onClick={this.out}>返回</button>
                        </div>
                    </TabPane>
                    <TabPane tab="功能权限" key="2">
                        <div className="row">
                            <div className="col-lg-12">
                                <Tree className="myCls" showLine checkable
                                      defaultExpandAll={true}
                                      onCheck={this.antdCheck}
                                      defaultCheckedKeys={this.state.defaultKeys}
                                >

                                    {this.state.roleJson.map(function (data,i) {
                                        return (
                                            <TreeNode title={data.name} key={data.key}>
                                            {data.items.map(function (data1,i1) {
                                                return (
                                                    <TreeNode title={data1.name} key={data1.key}>
                                                        {data1.items.map(function (data2,i2) {
                                                            return(
                                                                <TreeNode className="inlineBlock" title={data2.name} key={data2.value} />
                                                            );
                                                        })}
                                                    </TreeNode>
                                                );
                                            })}
                                            </TreeNode>
                                        );
                                    })}

                                </Tree>
                            </div>
                        </div>
                        <div className="btn-box mt50 ml70">
                            <button className="btn btn-w btn-c-o fl" onClick={this.submitFnJu}>保存</button>
                            <button className="btn btn-w btn-c-t fl" onClick={this.out}>返回</button>
                        </div>
                    </TabPane>
                    <TabPane tab="数据权限" key="3">
                        <div className="row">
                            <div className="col-lg-12">
                                <Tree className="myCls" showLine checkable
                                      defaultExpandAll={true}
                                      onCheck={this.dataCheck}
                                      defaultCheckedKeys={this.state.dataDefaultKey}
                                >
                                    {this.state.dataJson.map(function (data,i) {
                                        return (
                                            <TreeNode title={data.name} key={data.key}>
                                                {data.items.map(function (data1,i1) {
                                                    return (
                                                        <TreeNode title={data1.name} key={data1.key}>
                                                            {data1.items.map(function (data2,i2) {
                                                                return(
                                                                    <TreeNode className="inlineBlock" title={data2.name} key={data2.value} />
                                                                );
                                                            })}
                                                        </TreeNode>
                                                    );
                                                })}
                                            </TreeNode>
                                        );
                                    })}

                                </Tree>
                            </div>
                        </div>
                        <div className="btn-box mt50 ml70">
                            <button className="btn btn-w btn-c-o fl" onClick={this.submitDataJu}>保存</button>
                            <button className="btn btn-w btn-c-t fl" onClick={this.out}>返回</button>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
});



var InputGroup=React.createClass({
    getInitialState(){
        return{
            first:true,
        }
    },
    KeyupInput(e){
        object[this.props.typeName] = e.target.value;
        this.setState({first:false});
    },
    render(){
        if(this.state.first){
            object[this.props.typeName] = this.props.val;
        }
        return (
            <div className={"form-inline mb15 "+(this.props.stars ? this.props.stars :"")}>
                <label className="text-center">{this.props.tle}</label>
                <input value={object[this.props.typeName]} type="text" className={this.props.inputClass} onChange={this.KeyupInput} />
            </div>
        );
    }
});
