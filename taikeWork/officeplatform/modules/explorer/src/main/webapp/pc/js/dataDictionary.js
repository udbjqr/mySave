import React from 'react'
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import {Icon,Button,Table,Modal,Input,message,Popconfirm} from 'antd'
import {OaModalInput} from './GaoReact.js'


var object = new Object();
export default React.createClass({
    //ajax 封装
    ajaxFn(data,callback,javaUrl = '/officedyanmic/dict.do') {
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
            visibleEdit:false,
            tableData:[],
            dictInfo:{},
            randomKey:0
        }
    },
    componentWillMount(){
        this.renderList();
    },/*渲染列表*/
    renderList(){
        /*重新渲染*/
        this.ajaxFn({controlType:"query"},data=>{
            if(data.values)this.setState({tableData:data.values});
        });
    },/*设置属性确定*/
    setAttr(){
        const {dict_name,para_name,para_value,remark} = object;
        if(dict_name,para_name,para_value){
            this.ajaxFn({controlType:"add",dict_name:dict_name,para_name:para_name,para_value:para_value,remark:remark},data=>{
                message.success("添加成功！");
                this.setState({visibleAdd:false,randomKey:Math.random()});
                object = {};
                this.renderList();
            });
        }else{
            message.warning("请填写完整内容！");
        }
    },/*修改属性*/
    edit(record){
        const dict_id = record.dict_id;
        sessionStorage.setItem("JJ_keepData",JSON.stringify(record));
        this.ajaxFn({controlType:"load",dict_id:dict_id},data=>{
            this.setState({dictInfo:data.values,visibleEdit:true,randomKey:Math.random()});
            object = data.values;
        });
    },/*弹窗修改属性确定按钮*/
    editAttr(){
        var strData = sessionStorage.getItem("JJ_keepData");
        const {dict_name,para_name,para_value,remark} = object;
        if(dict_name,para_name,para_value){
            this.ajaxFn({controlType:"update",dict_id:JSON.parse(strData).dict_id,dict_name:dict_name,para_name:para_name,para_value:para_value,remark:remark},data=>{
                message.success("修改成功！");
                this.setState({visibleEdit:false});
                object = {};
                this.renderList();
            });
        }else{
            message.warning("请填写完整内容！");
        }

    },/*删除数据*/
    delete(record){
        this.ajaxFn({controlType:"delete",dict_id:record.dict_id},data=>{
            message.success("删除成功！");
            this.renderList();
        })
    },
    render(){
        const columns = [
            {title:"字典名",key:"字典名",dataIndex:"dict_name"},
            {title:"参数名",key:"参数名",dataIndex:"para_name"},
            {title:"参数值",key:"参数值",dataIndex:"para_value"},
            {title:"备注",key:"备注",dataIndex:"remark"},
            {title:"操作",key:"操作",dataIndex:"操作",render:(text, record)=>
                {return (
                    <div value={JSON.stringify(record)} className="table-icon">
                        <Icon type="edit" onClick={()=>this.edit(record)}/>
                        <Popconfirm title="确定要删除这个功能吗?" onConfirm={() =>this.delete(record)} okText="确定" cancelText="取消">
                            <Icon type="delete" />
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
                    <h3>数据字典</h3>
                    <Button onClick={()=>this.setState({visibleAdd:true})} style={{backgroundColor:"#f36f48",borderColor:"#f36f48",margin:"21px 0",float:"right"}} icon="plus" type="primary">功能字典</Button>
                </div>

                <div key="b" className="table-box mt25">
                    <Table bordered columns={columns} dataSource={this.state.tableData} pagination={pagination} />
                </div>

                <Modal title="新增字典" visible={this.state.visibleAdd} onOk={this.setAttr} onCancel={()=>this.setState({randomKey:Math.random(),visibleAdd:false})} >
                    <div className="row">
                        <div className="col-lg-6">
                            <OaModalInput key={this.state.randomKey} tle="字典名：" width="70%" onChange={e => object.dict_name=e.target.value} />
                        </div>
                        <div className="col-lg-6 ">
                            <OaModalInput key={this.state.randomKey} tle="参数名：" width="70%" onChange={e => object.para_name=e.target.value}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <OaModalInput key={this.state.randomKey} tle="参数值：" width="70%" onChange={e => object.para_value=e.target.value}  />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 clear">
                            <label style={{width:"14%",textAlign:"center",float:"left",fontWeight:"400",color:"#333"}}>备注：</label>
                            <Input key={this.state.randomKey} type="textarea" autosize={{ minRows: 3, maxRows: 6 }} style={{maxWidth:"417px",float:"right"}} onChange={e => object.remark=e.target.value}/>
                        </div>
                    </div>
                </Modal>


                <Modal title="修改属性" visible={this.state.visibleEdit} onOk={this.editAttr} onCancel={()=>this.setState({visibleEdit:false})} >
                    <div className="row">
                        <div className="col-lg-6">
                            <OaModalInput key={this.state.randomKey} tle="字典名：" width="70%" defaultValue={this.state.dictInfo.dict_name}  onChange={e => object.dict_name=e.target.value} />
                        </div>
                        <div className="col-lg-6 ">
                            <OaModalInput key={this.state.randomKey} tle="参数名：" width="70%" defaultValue={this.state.dictInfo.para_name} onChange={e => object.para_name=e.target.value}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6">
                            <OaModalInput key={this.state.randomKey} tle="参数值：" width="70%" defaultValue={this.state.dictInfo.para_value} onChange={e => object.para_value=e.target.value}  />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 clear">
                            <label style={{width:"14%",textAlign:"center",float:"left",fontWeight:"400",color:"#333"}}>备注：</label>
                            <Input key={this.state.randomKey} type="textarea" autosize={{ minRows: 3, maxRows: 6 }} style={{maxWidth:"417px",float:"right"}} defaultValue={this.state.dictInfo.remark} onChange={e => object.remark=e.target.value}/>
                        </div>
                    </div>
                </Modal>
            </QueueAnim>
        );
    }
})
