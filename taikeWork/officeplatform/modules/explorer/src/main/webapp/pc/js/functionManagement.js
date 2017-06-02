import React from 'react'
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import {Icon,Button,Table,Modal,Input,message,Popconfirm,Transfer} from 'antd'
import {GaoModalSelect} from './GaoReact.js'

var object = new Object();

export default React.createClass({
    //ajax 封装
    ajaxFn(data,callback,javaUrl = '/officedyanmic/module.do') {
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
            visible:false,      /*新增弹窗*/
            visibleFn:false,    /*功能弹窗*/
            tableData:[],        /*列表数据*/
            targetKeys:[],      /*穿梭框右边的数据*/
            mockData:[],         /*交换框左边的数据*/
            randomKey:0         /*刷新的KEY*/
        }
    },
    componentWillMount(){
        this.renderList();
    },/*渲染列表*/
    renderList(){
        this.ajaxFn({controlType:"query"},data=>{
            if(data.values){
                this.setState({tableData:data.values});
            }
        })
    },/*确定新增功能*/
    onOk(){
        const {moduleName,remark} = object;
        if($.trim(moduleName)){
            this.ajaxFn({controlType:"add",module_name:$.trim(moduleName),remark:remark},data=>{
                this.setState({visible:false,randomKey:Math.random()});
                message.success('新增成功！');
                object = {};
                /*刷新列表*/
                this.renderList();
            })
        }else{
            message.warning('请填写功能名称！');
        }
    },/*修改列表*/
    edit(e){
        var strData = $(e.target.parentNode).attr("value");
        sessionStorage.setItem('JJ_keepData',strData);
        window.location.href = "index.html#/formSetting";
    },/*删除列表*/
    delete(strData){
        this.ajaxFn({controlType:"delete",module_id:strData.module_id},data=>{
            message.success("删除成功！");
            /*列表*/
            this.renderList();
        });
    },/*选择添加功能*/
    addFn(strData){
        sessionStorage.setItem('JJ_keepData',JSON.stringify(strData));
        this.ajaxFn({controlType:"getHandles",module_id:strData.module_id},data=>{
            var HandArray = [];
            if(data.values.HandArray.length != 0){
                var strArray = data.values.HandArray.split(",");
                strArray.forEach(num=>{
                    HandArray.push((num*1));
                });
            }
            this.setState({visibleFn:true,mockData:data.values.unHandArray,targetKeys:HandArray});
        });
    },/*功能弹窗确定*/
    fnOnOk(){
        var strData = sessionStorage.getItem("JJ_keepData");
        this.ajaxFn({controlType:"bindHandle",module_id:JSON.parse(strData).module_id,"handIds":this.state.targetKeys.toString()},data=>{
            this.setState({visibleFn:false});
            message.success("添加成功！");
            this.renderList();
        });
    },/*交换框事件*/
    exchange(nextTargetKeys, direction, moveKeys){
        this.setState({ targetKeys: nextTargetKeys },()=>{
            /*列表*/
            this.renderList();
        });
    },
    render(){

        const columns = [
            {title:"名称",key:"名称",dataIndex:"module_name"},
            {title:"功能",key:"功能",dataIndex:"handle_name"},
            {title:"创建人",key:"创建人",dataIndex:"create_user"},
            {title:"创建时间",key:"创建时间",dataIndex:"create_time"},
            {title:"备注",key:"备注",dataIndex:"remark"},
            {title:"操作",key:"操作",dataIndex:"操作",width:"12%",render:(text, record)=>
                {return (
                    <div value={JSON.stringify(record)} className="table-icon">
                        <Icon title="添加功能" type="bars" onClick={()=>this.addFn(record)}/>
                        <Icon title="编辑" type="edit" onClick={this.edit}/>
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
            onShowSizeChange: (current, pageSize) => {
                console.log('Current: ', current, '; PageSize: ', pageSize);
            },
            onChange: (current) => {
                console.log('Current: ', current);
            },
            showTotal:(total)=>{
                return `共 ${total} 条`;
            }

        };

        return (
            <QueueAnim>
                <div key="a" className="md-title">
                    <h3>功能管理</h3>
                    <Button onClick={()=>this.setState({visible:true})} style={{backgroundColor:"#f36f48",borderColor:"#f36f48",margin:"21px 0",float:"right"}} icon="plus" type="primary">功能新增</Button>
                </div>

                <div key="b" className="table-box mt25">
                    <Table bordered columns={columns} dataSource={this.state.tableData} pagination={pagination} />
                </div>

                <Modal title="设置属性" visible={this.state.visible} onOk={this.onOk} onCancel={()=>this.setState({visible:false})} >
                    <div className="row">
                        <div className="col-lg-12">
                            <label className="modal-label">功能名称：</label>
                            <Input key={this.state.randomKey} size="large" style={{width:"86%"}} onChange={e => object.moduleName = e.target.value }/>
                        </div>
                        <div className="col-lg-12 mt15 clear">
                            <label className="modal-label fl">备注：</label>
                            <Input key={this.state.randomKey} type="textarea" autosize={{ minRows: 3, maxRows: 6 }} style={{maxWidth:"419px",float:"right"}} onChange={e => object.remark = e.target.value }/>
                        </div>
                    </div>
                </Modal>

                <Modal title="添加操作" visible={this.state.visibleFn} onOk={this.fnOnOk} onCancel={()=>this.setState({visibleFn:false})} >
                    <div className="row">
                        <div className="col-lg-12">
                            <Transfer
                                listStyle={{width: 222,height: 300,}}
                                titles={['可添加', '已添加']}
                                dataSource={this.state.mockData}
                                targetKeys={this.state.targetKeys}
                                onChange={this.exchange}
                                render={item => item.title}
                              />
                        </div>
                    </div>
                </Modal>
            </QueueAnim>
        );
    }
})
