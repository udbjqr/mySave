import React from 'react'
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import {message,Modal,Table,Icon,Button,Input,Popconfirm} from 'antd'

export default React.createClass({
    //ajax 封装
    ajaxFn(data,callback,javaUrl = '/officedyanmic/task.do') {
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
            tableData:[]
        }
    },
    componentWillMount(){
        this.renderList();
    },/*渲染列表*/
    renderList(){
        this.ajaxFn({controlType:"queryWaitTask"},data=>{
            if(data.values)this.setState({tableData:data.values});
        })
    },
    render(){
        const {tableData} = this.state;

        const columns = [
            {title:"任务ID",key:"任务ID",dataIndex:"task_id"},
            {title:"任务名",key:"任务名",dataIndex:"task_name"},
            {title:"创建人",key:"创建人",dataIndex:"create_user"},
            {title:"创建时间",key:"创建时间",dataIndex:"create_time"},
            {title:"流程实例ID",key:"流程实例ID",dataIndex:"instance_id"},
            {title:"执行对象ID",key:"执行对象ID",dataIndex:"execution_id"},
            {title:"流程对象ID",key:"流程对象ID",dataIndex:"definition_id"},
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
            total:tableData.length,
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
                    <Table bordered columns={columns} dataSource={tableData} pagination={pagination} />
                </div>
            </QueueAnim>
        )
    }
})
