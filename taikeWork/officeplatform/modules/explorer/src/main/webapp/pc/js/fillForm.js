import React from 'react'
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import {Icon,Button,Modal,Input,message,Popconfirm,Form, DatePicker, TimePicker,Select,Radio,Switch,Upload,Checkbox } from 'antd'
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
import {OaModalInput,GaoModalSelect} from './GaoReact.js';

const FillForm = Form.create()(React.createClass({
    //ajax 封装
    ajaxFn(data,callback,javaUrl = '/officedyanmic/handle.do') {
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
            formData:[],
            formName:""
        }
    },
    componentWillMount(){
        if(sessionStorage.getItem("JJ_task_id")){
            let task_id = sessionStorage.getItem("JJ_task_id");
            this.ajaxFn({controlType:"query",task_id},data=>{
                let formObj = data.values.formStructure;
                this.setState({formData:formObj.formArr,formName:formObj.formName,task_id});
            });
        }
    },
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let formDataObj = {};
                const {task_id} = this.state;
                for (var key in values) {
                    var keyData = key.split(":");
                    if(keyData[1] === "dateControl"){
                        formDataObj[keyData[0]] = values[key].format('YYYY-MM-DD');
                    }else if(keyData[1] === "timeControl"){
                        formDataObj[keyData[0]] = values[key].format('HH:mm:ss');
                    }else{
                        formDataObj[keyData[0]] = values[key];
                    }
                }
                formDataObj.task_id = task_id;
                this.ajaxFn(formDataObj,data=>{
                    message.success("提交成功！");
                    window.location.href = "index.html#/todo";
                });
            }else{
                console.log("失败");
            }
        });
    },
    normFile(e) {
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
    },/*请求数据源*/
    dataSource(dataType){
        let acceptData="";
        const dataArr = dataType.split("_");
        this.ajaxFn({controlType:"query",dataType:dataArr[0],dataName:dataArr[1]},data=>{
            acceptData = data.values;
        },'/officedyanmic/dataSource.do')
        return acceptData;
    },
    render(){
        const $this = this;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {labelCol: { span: 7 },wrapperCol: { span: 17 }}
        /*单选的验证*/
        function checkPassword(rule, value, callback) {
            const isRequired = rule.field.split(":");
            if (typeof value != "number" &&　isRequired[1] != 0) {
                callback();
            }
        }
        return (
            <QueueAnim>
                <div key="a" className="md-title">
                    <h3>{this.state.formName}</h3>
                    <Button onClick={()=>window.location.href = "index.html#/todo"} style={{margin:"19px 5px",float:"right"}} size="large">返回</Button>
                    <Button onClick={this.handleSubmit} style={{margin:"19px 5px",float:"right"}} type="primary" htmlType="submit" size="large">提交</Button>
                </div>
                <div key="b" className="form-container">
                    <Form onSubmit={this.handleSubmit}>
                        {this.state.formData.map((obj,i)=>{
                            if(obj && obj.formType === "dateControl" ){
                                return (
                                    <FormItem
                                        key={i}
                                        {...formItemLayout}
                                        label={obj.title}
                                        className="show-form"
                                        style={{width:300,height:obj.domHeight,left:obj.domX,top:obj.domY}}
                                    >
                                        {getFieldDecorator(obj.id+":"+obj.formType, {
                                            rules: [{ type: 'object', required:obj.isRequired ? true : false, message: '请选择日期！' }]
                                        })(
                                            <DatePicker style={{width:200}} />
                                        )}
                                    </FormItem>
                                )
                            }else if (obj && obj.formType === "timeControl") {
                                return (
                                    <FormItem
                                        key={i}
                                        {...formItemLayout}
                                        label={obj.title}
                                        className="show-form"
                                        style={{width:300,height:obj.domHeight,left:obj.domX,top:obj.domY}}
                                    >
                                            {getFieldDecorator(obj.id+":"+obj.formType, {
                                            rules: [{ type: 'object', required:obj.isRequired ? true : false, message: '请选择时间！' }]
                                        })(
                                            <TimePicker style={{width:200}} />
                                        )}
                                    </FormItem>
                                )
                            }else if (obj && obj.formType === "dropDownControl") {
                                return (
                                    <FormItem
                                        key={i}
                                        {...formItemLayout}
                                        label={obj.title}
                                        className="show-form"
                                        style={{width:300,height:obj.domHeight,left:obj.domX,top:obj.domY}}
                                    >
                                        {getFieldDecorator(obj.id, {
                                            rules: [{required: obj.isRequired ? true : false, message: '请选择选项！'}]
                                        })(
                                            <Select placeholder="请选择" style={{width:200}}>
                                                {($this.dataSource(obj.dataSource) || []).map((o,i)=>{
                                                    return <Option key={o.value||i}>{o.name}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </FormItem>
                                )
                            }else if (obj && obj.formType === "radioControl") {
                                return (
                                    <FormItem
                                        key={i}
                                        {...formItemLayout}
                                        label={obj.title}
                                        className="show-form"
                                        style={{width:"320px",height:obj.domHeight,left:obj.domX,top:obj.domY}}
                                    >
                                        {getFieldDecorator(obj.id+":"+obj.isRequired,{
                                            rules: [
                                                {required:obj.isRequired ? true : false,message:"请填写完整"},
                                                {validator:checkPassword}
                                            ],
                                            initialValue: true,
                                        })(
                                            <RadioGroup>
                                                {($this.dataSource(obj.dataSource) || []).map((o,i)=>{
                                                    return <Radio key={i} value={i+""}>{o}</Radio>
                                                })}
                                            </RadioGroup>
                                        )}
                                    </FormItem>
                                )
                            }else if (obj && obj.formType === "checkboxControl") {
                                const plainOptions = $this.dataSource(obj.dataSource) || [];
                                return (
                                    <FormItem
                                        key={i}
                                        {...formItemLayout}
                                        label={obj.title}
                                        className="show-form"
                                        style={{width:"320px",height:obj.domHeight,left:obj.domX,top:obj.domY}}
                                    >
                                        {getFieldDecorator(obj.id,{
                                            rules: [
                                                {type:"array",required:obj.isRequired ? true : false,message:"请填写完整"},
                                            ],

                                        })(
                                            <CheckboxGroup options={plainOptions} />
                                        )}
                                    </FormItem>
                                )
                            }else if (obj && obj.formType === "attachmentControl") {
                                return (
                                    <FormItem
                                        key={i}
                                        {...formItemLayout}
                                        label={obj.title}
                                        className="show-form"
                                        style={{width:obj.domWidth,height:obj.domHeight,left:obj.domX,top:obj.domY}}
                                    >
                                        {getFieldDecorator(obj.id, {
                                            rules: [{required: obj.isRequired ? true : false, message: '请选择上传文件！'}],
                                            valuePropName: 'fileList',
                                            normalize: $this.normFile,
                                        })(
                                            <Upload name="logo" action='/officedyanmic/handle.do' listType="text">
                                                <Button>
                                                    <Icon type="upload" />点击上传
                                                </Button>
                                            </Upload>
                                        )}
                                    </FormItem>
                                )
                            }else if (obj && obj.formType === "textControl") {
                                return (
                                    <FormItem
                                        key={i}
                                        {...formItemLayout}
                                        label={obj.title}
                                        className="show-form"
                                        style={{width:obj.domWidth,height:obj.domHeight,left:obj.domX,top:obj.domY}}
                                    >
                                        {getFieldDecorator(obj.id, {
                                            rules: [{required:obj.isRequired ? true : false, message: '请填写内容！'}]
                                        })(
                                            <Input type={obj.textType == "1" ? "textarea":"text"} />
                                        )}
                                    </FormItem>
                                )
                            }else if (obj && obj.formType === "switchControl") {
                                return (
                                    <FormItem
                                        key={i}
                                        {...formItemLayout}
                                        label={obj.title}
                                        className="show-form"
                                        style={{width:obj.domWidth,height:obj.domHeight,left:obj.domX,top:obj.domY}}
                                    >
                                        {getFieldDecorator(obj.id, {valuePropName: 'checked'})(
                                            <Switch />
                                        )}
                                    </FormItem>
                                )
                            }

                        })}
                    </Form>
                </div>
            </QueueAnim>
        )
    }
}));

export default FillForm;




/*


checkPassword(rule, value, callback) {
    console.log(rule);
    // const form = this.props.form;
    // console.log(form.getFieldsValue(['17_duoxuan:1']));

    const isRequired = rule.field.split(":");
    if (typeof value != "number" &&　isRequired[1] != 0) {
        callback();
    }
},
*/
