import React from 'react'
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import {Icon,Button,Table,Modal,Input,message,Popconfirm,Tree} from 'antd'
const TreeNode = Tree.TreeNode
import {OaModalInput,GaoModalSelect} from './GaoReact.js';

var dataCache = new Object();
export default React.createClass({
    //ajax 封装
    ajaxFn(data,callback,javaUrl = '/officedyanmic/department.do') {
        var $this = this;
        $.ajax({
            type:"post",
            url:javaUrl,
            data:{paramMap:JSON.stringify(data)},
            dataType: "json",
            timeout:5000,
            async:false,	//false 表示ajax执行完成之后在执行后面的代码
            success:function(data){
                if(!data.success){/*首先判断这个属性，错误在判断原因*/
                    switch(data.code){
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
                        case  (150):
                            Modal.warning({title: '警告提示：',content:"删除失败，该节点不是末尾节点或者没有权限！"});
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
            randomKey:0,
            randomKey1:0,
            rootData:{},
            rootNodes:[],
            roleNodes:[],
            personnelNodes:[],
            deptInfo:{},
            visibleAdd:false,
            visibleEdit:false
        }
    },
    componentWillMount(){



        /*查询根节点和部门*/
        this.ajaxFn({controlType:"getAllDeptByTree"},data=>{
            if(data.values){
                this.setState({rootNodes:data.values.root||[],rootData:data.values})
            }
        });
        /*查询全部角色组*/
        this.ajaxFn({controlType:"query"},data=>{
            if(data.values){
                this.setState({roleNodes:data.values});
            }
        },'/officedyanmic/role.do');

        /*查询全部人员*/
        this.ajaxFn({controlType:"query"},data=>{
            if(data.values){
                this.setState({personnelNodes:data.values});
            }
        },'/officedyanmic/userManger.do');

    },/*选中部门节点，查询角色组节点*/
    loadRoleNode(rootId){
        if(rootId){
            dataCache.dept_id = rootId;
            this.ajaxFn({controlType:"getRoleByDeptId",dept_id:rootId},data=>{
                var arr = Array.from(data.values,obj => obj.id+"");
                this.setState({randomKey:Math.random(),roleSelect1:arr,roleSelect:arr,rootId,personnelSelect:[]});
            })
        }else{
            this.setState({roleSelect:[],rootId,personnelSelect:[]});
        }

    },/*选中角色组节点，查询人员节点*/
    loadPersonnelNode(role_id){
        if(!this.state.roleSelect){
            message.warning("请先选择部门！");
            return false;
        }
        if(this.state.roleSelect.indexOf(role_id) != -1){
            this.ajaxFn({controlType:"getEmployeeByDeptAndrole",dept_id:this.state.rootId,role_id},data=>{
                var arr = Array.from(data.values,n=>n+"");
                this.setState({personnelSelect:arr,roleId:role_id});
            })
        }else{
            this.setState({roleId:"",personnelSelect:[]});
        }
    },/*选中角色事件*/
    roleEvent(ids){
        const {rootId} = this.state;
        if(rootId){
            this.setState({roleSelect:ids,checkRoles:ids.toString()})
        }else{
            message.warning("请先选择部门！");
        }

    },/*选中人员事件*/
    personnelEvent(ids){
        const {rootId,roleId} = this.state;
        if(rootId && roleId){
            this.setState({personnelSelect:ids,checkPersonnels:ids.toString()});
        }else if(rootId && !roleId){
            message.warning("请选择已有角色！");
        }else{
            message.warning("请先选择部门！");
        }

    },/*角色保存*/
    roleKeep(){
        const $this = this;
        const {rootId,checkRoles,roleSelect1,roleSelect} = this.state;
        if(rootId){
            if(roleSelect.length < roleSelect1.length){
                Modal.confirm({
                    title: '提示：',
                    content: '如果取消勾选的角色，那么对应绑定的人员也会删除！',
                    okText: '确定',
                    cancelText: '取消',
                    onOk(){
                        $this.ajaxFn({controlType:"updateDeptLinkRole",dept_id:rootId,roleIds:checkRoles},data=>{
                            message.success("保存成功！");
                        })
                    },
                    onCancel(){return false;}
                });
            }else{
                this.ajaxFn({controlType:"updateDeptLinkRole",dept_id:rootId,roleIds:checkRoles},data=>{
                    message.success("保存成功！");
                })
            }
            this.setState({roleSelect1:roleSelect});
            console.log(roleSelect.length,roleSelect1.length);
        }
    },/*人员保存*/
    personnelKeep(){
        const {rootId,roleId,checkPersonnels} = this.state;
        if(rootId && roleId ){
            this.ajaxFn({controlType:"updateDeptAndRolelinkEmployee",dept_id:rootId,role_id:roleId,employeeIds:checkPersonnels},data=>{
                message.success("保存成功！");
            })
        }
    },/*打开新增部门弹窗*/
    depaAdd(){
        this.setState({visibleAdd:true});
    },/*提交新增*/
    submitNew(){
        const {dept_name,administrator_id,dept_type,remark} = dataCache;
        if(dept_name){
            this.ajaxFn({controlType:"add",parent_id:this.state.rootId,dept_name,administrator_id,dept_type,remark},data=>{
                dataCache = {};
                message.success("新增成功！");
                this.setState({randomKey:Math.random(),visibleAdd:false});
                /*查询根节点和部门*/
                this.ajaxFn({controlType:"getAllDeptByTree"},data=>{
                    if(data.values){
                        this.setState({rootNodes:data.values.root||[],rootData:data.values})
                    }
                });
            })
        }else{
            message.warning("请填写部门名！");
        }
    },/*删除部门*/
    depaDelete(){
        if(this.state.rootId){
            this.ajaxFn({controlType:"delete",dept_id:this.state.rootId.toString()},data=>{
                message.success("删除成功！");
                /*查询根节点和部门*/
                this.ajaxFn({controlType:"getAllDeptByTree"},data=>{
                    if(data.values){
                        this.setState({rootNodes:data.values.root||[],rootData:data.values})
                    }
                });
            })
        }else{
            message.warning("请选择要删除的部门！");
        }
    },/*打开修改部门弹窗*/
    depaEdit(){
        if(this.state.rootId){
            this.ajaxFn({controlType:"load",dept_id:this.state.rootId},data=>{
                dataCache = data.values;
                this.setState({deptInfo:data.values,visibleEdit:true});
            })
        }else{
            message.warning("请选择要修改的部门！");
        }
    },/*提交修改*/
    submitEdit(){
        const {dept_id,parent_id,dept_name,administrator_id,dept_type,remark} = dataCache;
        if(dept_id && dept_name){
            this.ajaxFn({controlType:"update",dept_id,parent_id,dept_name,administrator_id,dept_type,remark},data=>{
                dataCache = {};
                message.success("修改成功！");
                this.setState({randomKey:Math.random(),visibleEdit:false});
                /*查询根节点和部门*/
                this.ajaxFn({controlType:"getAllDeptByTree"},data=>{
                    if(data.values){
                        this.setState({rootNodes:data.values.root||[],rootData:data.values})
                    }
                });
            })
        }
    },
    render(){
        const columns = [
            {title:"部门ID",key:"部门ID",dataIndex:"dept_id"},
            {title:"部门名",key:"部门名",dataIndex:"dept_name"},
            {title:"父部门",key:"父部门",dataIndex:"parent_id"},
            {title:"部门管理人",key:"部门管理人",dataIndex:"administrator_id"},
            {title:"创建时间",key:"创建时间",dataIndex:"create_time"},
            {title:"部门类型",key:"部门类型",dataIndex:"dept_type"},
            {title:"备注",key:"备注",dataIndex:"remark"},
            {title:"操作",key:"操作",dataIndex:"操作",width: '12%',render:(text, record)=>
                {return (
                    <div value={JSON.stringify(record)} className="table-icon">
                        <Icon title="部署" type="code-o" onClick={()=>this.deploy(record)}/>
                        <Icon title="编辑" type="edit" onClick={()=>this.bianjiprocess(record)}/>
                        <Popconfirm title="确定要删除这个功能吗?" onConfirm={() =>this.processdelete(record)} okText="确定" cancelText="取消">
                            <Icon title="删除" type="delete" />
                        </Popconfirm>
                    </div>
                )}
            }
        ];
        const pagination = {
            total:0,
            showSizeChanger: true,
            showTotal:(total)=>{
                return `共 ${total} 条`;
            }
        };
        return (
            <QueueAnim>
                <div key="a" className="md-title">
                    <h3>部门管理</h3>
                </div>

                <div key="b" className="row mt25">
                    <div className="col-lg-3">
                        <div className="depa-box">
                            <div className="depa-top-box">
                                <span className="depa-title">部门</span>
                                <Popconfirm title="确定要删除该部门吗?" onConfirm={this.depaDelete} okText="确定" cancelText="取消">
                                    <Icon title="删除" className="depa-delete-icon" type="delete" />
                                </Popconfirm>
                                <Icon onClick={this.depaAdd} title="新增" className="depa-add-icon" type="plus-circle-o" />
                                <Icon onClick={this.depaEdit} title="修改" className="depa-edit-icon" type="edit" />
                            </div>
                            <Tree defaultExpandAll={true}
                                onSelect={id => this.loadRoleNode(id.toString())}
                            >
                                <TreeNode title={this.state.rootData.name} key={this.state.rootData.id} >
                                    {this.state.rootNodes.map(function (data,i) {
                                        return (
                                            <TreeNode title={data.name} key={data.id} >
                                            {loopNode(data)}
                                            </TreeNode>
                                        );
                                    })}
                                </TreeNode>
                            </Tree>
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="depa-box">
                            <div className="depa-top-box">
                                <span className="depa-title">角色</span>
                                <Icon onClick={this.roleKeep} title="保存" className="depa-keep-icon" type="check-circle-o" />
                            </div>
                            <Tree showLine checkable key={this.state.randomKey}
                                checkedKeys={this.state.roleSelect}
                                onCheck={this.roleEvent}
                                onSelect={id => this.loadPersonnelNode(id.toString())}
                            >
                                {this.state.roleNodes.map(function (data,i) {
                                    return (
                                        <TreeNode title={data.role_name} key={data.role_id} />
                                    );
                                })}
                            </Tree>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="depa-box">
                            <div className="depa-top-box">
                                <span className="depa-title">人员</span>
                                <Icon onClick={this.personnelKeep} title="保存" className="depa-keep-icon" type="check-circle-o" />
                            </div>
                            <Tree showLine checkable key={this.state.randomKey}
                                checkedKeys={this.state.personnelSelect}
                                onCheck={this.personnelEvent}
                            >
                                {this.state.personnelNodes.map(function (data,i) {
                                    return (
                                        <TreeNode className="dib" title={data.real_name} key={data.id} />
                                    );
                                })}
                            </Tree>
                        </div>
                    </div>
                </div>

                {/*新增弹窗*/}
                <Modal title="新增部门" visible={this.state.visibleAdd} onOk={this.submitNew} onCancel={()=>this.setState({visibleAdd:false})} >
                    <div className="row">
                        <div className="col-lg-6">
                            <OaModalInput key={this.state.randomKey} tle="部门名：" placeholder="请输入部门名" onChange={e => dataCache.dept_name = e.target.value} />
                        </div>
                        <div className="col-lg-6 ">
                            <OaModalInput key={this.state.randomKey} tle="备注:" placeholder="请输入备注" onChange={e => dataCache.remark = e.target.value}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <GaoModalSelect key={this.state.randomKey} tle="部门类型：" options={[]} onChange={val => dataCache.dept_type = val} valName="real_name"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <GaoModalSelect key={this.state.randomKey} tle="部门管理人:" options={this.state.personnelNodes} onChange={val => dataCache.administrator_id = val} valName="real_name"/>
                        </div>
                    </div>
                </Modal>

                {/*修改弹窗*/}
                <Modal title="修改部门" visible={this.state.visibleEdit} onOk={this.submitEdit} onCancel={()=>this.setState({visibleEdit:false})} >
                    <div className="row">
                        <div className="col-lg-6">
                            <OaModalInput key={this.state.randomKey} tle="部门名：" defaultValue={this.state.deptInfo.dept_name} placeholder="请输入部门名" onChange={e => dataCache.dept_name = e.target.value} />
                        </div>
                        <div className="col-lg-6 ">
                            <OaModalInput key={this.state.randomKey} tle="备注:" defaultValue={this.state.deptInfo.remark} placeholder="请输入备注" onChange={e => dataCache.remark = e.target.value}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <GaoModalSelect key={this.state.randomKey} tle="部门类型：" options={[]} onChange={val => dataCache.dept_type = val} valName="real_name"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <GaoModalSelect key={this.state.randomKey} tle="部门管理人:" defaultValue={this.state.deptInfo.administrator_id} options={this.state.personnelNodes} onChange={val => dataCache.administrator_id = val} valName="real_name"/>
                        </div>
                    </div>
                </Modal>

            </QueueAnim>
        );
    }
})

/*递归循环树节点方法*/
function loopNode(data){
    return (data.child ? data.child.parent : []).map((data,i)=>{
        return (
            <TreeNode title={data.name} key={data.id} >
            {loopNode(data)}
            </TreeNode>
        )
    })
}
