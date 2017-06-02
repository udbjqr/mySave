import React from 'react'
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import {Icon,Button,Table,Modal,Input,message,Popconfirm} from 'antd'
import {OaModalInput,GaoNavSelect} from './GaoReact.js';

var object = new Object();
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
                tableData:[],
                visibleAdd:false
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
    addprocess(){
        this.ajaxFn({controlType:"add"},(data)=>{
            this.componentWillMount()
        })
    },/*办理*/
    handle(record){
        sessionStorage.setItem("JJ_task_id",record.task_id);
        window.location.href = "index.html#/fillForm"
    },
    render(){
        const columns = [
            {title:"任务名",key:"任务名",dataIndex:"task_name"},
            {title:"发起人",key:"发起人",dataIndex:"create_user"},
            {title:"执行ID",key:"执行ID",dataIndex:"execution_id"},
            {title:"创建时间",key:"创建时间",dataIndex:"create_time"},
            {title:"操作",key:"操作",dataIndex:"操作",render:(text, record)=>
                {return (
                    <div value={JSON.stringify(record)} className="table-icon">
                        <Icon title="办理" type="edit" onClick={()=>this.handle(record)}/>
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
                    <h3>待办事项</h3>                    
                </div>
                <div className="row mt15">
                    <div className="col-lg-4"><GaoNavSelect tle="流程名称" /></div>
                    <div className="col-lg-4"><GaoNavSelect tle="流程类别" /></div>
                    <div className="col-lg-4"><GaoNavSelect tle="发起人" /></div>
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
