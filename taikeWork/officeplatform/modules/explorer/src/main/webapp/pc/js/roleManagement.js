import React from 'react'
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import {Icon,Button,Table,Modal,Input,message,Popconfirm} from 'antd'
import {OaModalInput,GaoModalSelect} from './GaoReact.js';

var tableLoading = false;
var dataCache = new Object();
export default React.createClass({
    //ajax 封装
    ajaxFn(data,callback,javaUrl = '/officedyanmic/role.do') {
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
            tableLoading:true,      /*表格加载动画*/
            tableData:[],           /*表格数据*/
            visibleAdd:false,       /*新增弹窗*/
            visibleEdit:false,      /*修改弹窗*/
            editData:{},            /*修改的角色数据*/
        }
    },
    componentWillMount(){
        this.renderList();
    },/*渲染列表*/
    renderList(){
        this.ajaxFn({controlType:"query"},data=>{
            if(data.values){
                this.setState({tableLoading,tableData:data.values})
            }
        })
    },/*新增角色*/
    submitNew(){
        const {role_name,remark,parent_id} = dataCache;
        if(role_name){
            this.ajaxFn({controlType:"add",role_name,remark,parent_id},data=>{
                this.renderList();
                message.success("新增成功！");
                this.setState({visibleAdd:false});
            });
        }else{
            message.warning("请填写角色名！");
        }
    },/*修改列表数据*/
    edit(record){
        dataCache = record;
        this.setState({randomKey:Math.random(),visibleEdit:true,editData:record});
    },/*提交修改*/
    submitEdit(){
        const {role_id,role_name,remark,parent_id} = dataCache;
        if(role_name){
            this.ajaxFn({controlType:"update",role_id,role_name,remark,parent_id},data=>{
                message.success("修改成功！");
                this.setState({visibleEdit:false});
            });
        }else{
            message.warning("请填写角色名！");
        }
    },/*删除列表数据*/
    delete(record){
        const role_id = record.role_id;
        this.ajaxFn({controlType:"delete",role_id},data=>{
            message.success("删除成功！");
            this.renderList();
        })
    },
    render(){
        const columns = [
            {title:"角色ID",key:"角色ID",dataIndex:"role_id"},
            {title:"角色名",key:"角色名",dataIndex:"role_name"},
            {title:"父角色",key:"父角色",dataIndex:"parent_name"},
            {title:"备注",key:"备注",dataIndex:"remark"},
            {title:"操作",key:"操作",dataIndex:"操作",width: '8%',render:(text, record)=>
                {return (
                    <div value={JSON.stringify(record)} className="table-icon">
                        <Icon title="编辑/修改" type="edit" onClick={()=>this.edit(record)}/>
                        <Popconfirm title="确定要删除这个功能吗?" onConfirm={() =>this.delete(record)} okText="确定" cancelText="取消">
                            <Icon title="删除" type="delete" />
                        </Popconfirm>
                    </div>
                )}
            }
        ];
        const pagination = {
            total: this.state.tableData.length,
            showSizeChanger: true,
            showTotal:(total)=>{
                return `共 ${total} 条`;
            }
        };
        return (
            <QueueAnim>
                <div key="a" className="md-title">
                    <h3>角色管理列表</h3>
                    <Button onClick={()=>this.setState({visibleAdd:true})} style={{backgroundColor:"#f36f48",borderColor:"#f36f48",margin:"21px 0",float:"right"}} icon="plus" type="primary">新增</Button>
                </div>

                <div key="b" className="table-box mt25">
                    <Table loading={this.state.tableLoading} bordered columns={columns} dataSource={this.state.tableData} pagination={pagination} />
                </div>

                {/*新增弹窗*/}
                <Modal title="新增角色" visible={this.state.visibleAdd} onOk={this.submitNew} onCancel={()=>this.setState({visibleAdd:false})} >
                    <div className="row">
                        <div className="col-lg-6">
                            <OaModalInput key={this.state.randomKey} tle="角色名：" placeholder="请输入角色名" onChange={e => dataCache.role_name=e.target.value} />
                        </div>
                        <div className="col-lg-6 ">
                            <OaModalInput key={this.state.randomKey} tle="备注：" placeholder="请输入备注" onChange={e => dataCache.remark=e.target.value}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <GaoModalSelect key={this.state.randomKey} tle="角色ID：" options={this.state.tableData} onChange={val => dataCache.parent_id = val} valId="role_id" valName="role_name"/>
                        </div>
                    </div>
                </Modal>

                {/*修改弹窗*/}
                <Modal title="修改角色" visible={this.state.visibleEdit} onOk={this.submitEdit} onCancel={()=>this.setState({visibleEdit:false})} >
                    <div className="row">
                        <div className="col-lg-6">
                            <OaModalInput key={this.state.randomKey} tle="角色名：" defaultValue={this.state.editData.role_name} onChange={e => dataCache.role_name=e.target.value} />
                        </div>
                        <div className="col-lg-6 ">
                            <OaModalInput key={this.state.randomKey} tle="备注：" defaultValue={this.state.editData.remark} onChange={e => dataCache.remark=e.target.value}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <GaoModalSelect key={this.state.randomKey} tle="角色ID：" options={this.state.tableData} defaultValue={this.state.editData.parent_id} onChange={val => dataCache.parent_id = val} valId="role_id" valName="role_name"/>
                        </div>
                    </div>
                </Modal>


            </QueueAnim>
        );
    }
})
