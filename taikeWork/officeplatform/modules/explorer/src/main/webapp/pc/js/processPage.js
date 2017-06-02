import React from 'react'
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import {Icon,Button,Table,Modal,Input,message,Popconfirm} from 'antd'
import {OaModalInput} from './GaoReact.js';

var object = new Object();
export default React.createClass({
    //ajax 封装
    ajaxFn(data,callback,javaUrl = '/officedyanmic/processManger.do') {
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
            tableData:[],
            visibleAdd:false
        }
    },
    componentWillMount(){
        this.renderList();
    },/*渲染列表*/
    renderList(){
        this.ajaxFn({controlType:"query"},data=>{
            if(data.values){
                this.setState({tableData:data.values})
            }
        })
    },
    addprocess(){
        this.ajaxFn({controlType:"add"},(data)=>{
            this.renderList();
        })
    },/*部署*/
    deploy(record){
        this.ajaxFn({controlType:"deploy",model_id:record.model_id},data=>{
            message.success("部署成功！");
            this.renderList();
        },'/officedyanmic/processManger.do')
    },/*编辑*/
    bianjiprocess(record){
        console.log(record.model_id);
        window.location.href='./editor/index.html?modelId='+record.model_id;
    },/*删除*/
    processdelete(record){
        this.ajaxFn({controlType:"delete",model_id:record.model_id},(data)=>{
            this.renderList();
        })
    },
    render(){
        const columns = [
            {title:"模版ID",key:"模版ID",dataIndex:"model_id"},
            {title:"模版名",key:"模版名",dataIndex:"model_name"},
            {title:"流程版本ID",key:"流程版本ID",dataIndex:"def_id"},
            {title:"流程名",key:"流程名",dataIndex:"deployment_name"},
            {title:"描述",key:"描述",dataIndex:"description"},
            {title:"流程ID",key:"流程ID",dataIndex:"deployment_id"},
            {title:"是否部署",key:"是否部署",dataIndex:"isDeoloy",width:"10%",render:(text, record)=>{
                    return text == 1 ? <span className="green">是</span>:<span className="red">否</span>;
                }
            },
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
            total: this.state.tableData.length,
            showSizeChanger: true,
            showTotal:(total)=>{
                return `共 ${total} 条`;
            }
        };
        return (
            <QueueAnim>
                <div key="a" className="md-title">
                    <h3>流程管理列表</h3>
                    <Button onClick={()=>this.addprocess()} style={{backgroundColor:"#f36f48",borderColor:"#f36f48",margin:"21px 0",float:"right"}} icon="plus" type="primary">新增</Button>
                </div>

                <div key="b" className="table-box mt25">
                    <Table bordered columns={columns} dataSource={this.state.tableData} pagination={pagination} />
                </div>

                <Modal title="新增流程" visible={this.state.visibleAdd} onOk={this.submitNew} onCancel={()=>this.setState({visibleAdd:false})} >
                    <div className="row">
                        <div className="col-lg-6">
                            <OaModalInput key={this.state.randomKey} tle="任务名称" width="70%" placeholder="请输入任务名称" onChange={e => object.dict_name=e.target.value} />
                        </div>
                        <div className="col-lg-6 ">
                            <OaModalInput key={this.state.randomKey} tle="任务介绍" width="70%" placeholder="请输入任务详情介绍" onChange={e => object.para_name=e.target.value}/>
                        </div>
                    </div>
                </Modal>

            </QueueAnim>
        );
    }
})
