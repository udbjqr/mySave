import React from 'react'
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import {Icon,Button,Table,Modal,Input,message,Popconfirm} from 'antd'
import {GaoModalSelect,OaModalInput} from './GaoReact.js';

var dataObj = new Object();
export default React.createClass({
    //ajax 封装
    ajaxFn(data,callback,javaUrl = '/officedyanmic/userManger.do') {
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
            visibleAdd:false,
            tableData:[],       /*表格数据*/
            personnelObj:{},     /*查询出来的人员数据*/
            modalType:"add"     /*弹窗类型*/
        }
    },
    componentWillMount(){
        this.renderList();
    },/*渲染列表*/
    renderList(){
        this.ajaxFn({controlType:"query"},data=>{
            if(data.values)this.setState({tableData:data.values});
        });
    },/*新增提交*/
    submitNew(){
        const {login_name,real_name,password,area_id,mobile,email,employee_type} = dataObj;
        if(login_name && real_name && password && employee_type){
            this.ajaxFn({controlType:"add",login_name,real_name,password,area_id,mobile,email,employee_type},data=>{
                dataObj = {};
                message.success("新增成功！");
                this.setState({visibleAdd:false,randomKey:Math.random()});
                this.renderList();
            })
        }else{
            message.warning("用户名、真实姓名、密码、用户类型 为必填项！",5);
        }
    },/*打开修改窗口，回填数据*/
    modify(record){
        const employee_id = record.id
        this.ajaxFn({controlType:"load",employee_id},data=>{
            dataObj = data.values;
            dataObj.employee_id = employee_id;
            if(data)this.setState({randomKey:Math.random(),personnelObj:data.values,visibleAdd:true,modalType:"modify"});
        })
    },/*提交修改*/
    submitModify(){
        const {employee_id,login_name,real_name,area_id,mobile,email,employee_type} = dataObj;
        if(login_name && real_name && employee_type && employee_id){
            this.ajaxFn({controlType:"update",employee_id,login_name,real_name,area_id,mobile,email,employee_type},data=>{
                dataObj = {};
                message.success("修改成功！");
                this.setState({visibleAdd:false,randomKey:Math.random()});
                this.renderList();
            })
        }else if(employee_id){
            message.warning("用户名、真实姓名、用户类型 为必填项！",5);
        }
    },/*删除*/
    delete(record){
        const employee_id = record.id
        this.ajaxFn({controlType:"delete",employee_id},data=>{
            message.success("删除成功！");
            this.renderList();
        });
    },/*重置*/
    reset(record){
        const employee_id = record.id
        this.ajaxFn({controlType:"resetPwd",employee_id},data=>{
            message.success("重置密码成功！重置后密码为：123456");
            this.renderList();
        });
    },
    render(){

        const columns = [
            {title:"登录名",key:"登录名",dataIndex:"login_name"},
            {title:"用户类型",key:"用户类型",dataIndex:"employee_type"},
            {title:"真实名称",key:"真实名称",dataIndex:"real_name"},
            {title:"手机号",key:"手机号",dataIndex:"mobile"},
            {title:"微信ID",key:"微信ID",dataIndex:"weixin_id"},
            {title:"创建时间",key:"创建时间",dataIndex:"create_time"},
            {title:"最后登录时间",key:"最后登录时间",dataIndex:"lastlogin_time"},
            {title:"状态",key:"状态",dataIndex:"flag",render:(text, record)=>{
                    return text == 1 ? <span className="green">启用</span>:<span className="red">停用</span>;
                }
            },
            {title:"操作",key:"操作",dataIndex:"操作",width: '12%',render:(text, record)=>
                {return (
                    <div value={JSON.stringify(record)} className="table-icon">
                        <Icon title="编辑" type="edit" onClick={()=>this.modify(record)}/>
                        <Popconfirm title="确定要重置该用户密码吗?" onConfirm={() =>this.reset(record)} okText="确定" cancelText="取消">
                            <Icon title="重置密码" type="reload" />
                        </Popconfirm>
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

        const {tableData,modalType,randomKey,personnelObj} = this.state;
        return (
            <QueueAnim>
                <div key="a" className="md-title">
                    <h3>人员管理</h3>
                    <Button onClick={()=>this.setState({visibleAdd:true,personnelObj:{},randomKey:Math.random(),modalType:"add"})} style={{backgroundColor:"#f36f48",borderColor:"#f36f48",margin:"21px 0",float:"right"}} icon="plus" type="primary">新增</Button>
                </div>

                <div key="b" className="table-box mt25">
                    <Table bordered columns={columns} dataSource={tableData} pagination={pagination} />
                </div>


                {/*新增弹窗*/}
                <Modal title={modalType === "add" ? "新增人员" : "修改人员信息"} visible={this.state.visibleAdd} onOk={modalType === "add" ? this.submitNew : this.submitModify} onCancel={()=>this.setState({visibleAdd:false})} >
                    <div className="row">
                        <div className={"col-lg-6"+(modalType === "add" ? "" :" none")}>
                            <OaModalInput key={randomKey} dataType="chinese" tle="登录名：" placeholder="请输入任务名称" defaultValue={personnelObj.login_name} onChange={e => dataObj.login_name=e.target.value} />
                        </div>
                        <div className="col-lg-6 ">
                            <OaModalInput key={randomKey} tle="真实姓名：" placeholder="请输入任务详情介绍" defaultValue={personnelObj.real_name} onChange={e => dataObj.real_name=e.target.value} />
                        </div>
                        <div className={"col-lg-6"+(modalType === "add" ? "" :" none")} >
                            <OaModalInput key={randomKey} dataType="number" tle="密码：" placeholder="请输入任务详情介绍" onChange={e => dataObj.password=e.target.value}/>
                        </div>
                        <div className="col-lg-6">
                            <OaModalInput key={randomKey} dataType="number" tle="手机：" placeholder="请输入任务名称" defaultValue={personnelObj.mobile} onChange={e => dataObj.mobile=e.target.value} />
                        </div>
                        <div className="col-lg-6 ">
                            <OaModalInput key={randomKey} tle="邮箱：" placeholder="请输入任务详情介绍" defaultValue={personnelObj.email} onChange={e => dataObj.email=e.target.value}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            <GaoModalSelect key={randomKey} tle="区域：" options={[{name:"南昌",id:1}]} defaultValue={personnelObj.area_id} onChange={val => dataObj.area_id = val} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <GaoModalSelect key={randomKey} tle="用户类型：" options={[{name:"员工",id:1}]} defaultValue={personnelObj.employee_type} onChange={val => dataObj.employee_type = val} />
                        </div>
                    </div>
                </Modal>


            </QueueAnim>
        );
    }
})
