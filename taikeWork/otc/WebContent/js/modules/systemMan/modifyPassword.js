import React from 'react'
import { Button, Form, Input, Row, Col } from 'antd';
import message from 'antd/lib/message';                /*antd 提示组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import '../../../less/addInformation.less'
import classNames from 'classnames';
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
const createForm = Form.create;
const FormItem = Form.Item;

function noop() {
    return false;
}

let Demo =  React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/employee.do') {
        var $this = this;
        $.ajax({
            type:"post",
            url:javaUrl,
            data:{paramMap:JSON.stringify(data)},
            dataType: "json",
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
    getInitialState() {
        return {
            passBarShow: false, // 是否显示密码强度提示条
            rePassBarShow: false,
            passStrength: 'L', // 密码强度
            rePassStrength: 'L',
            password1:'',        /*旧密码*/
            password2:'',        /*新密码*/
            loading:false        /*按钮加载中状态*/
        };
    },/*提交按钮*/
    handleSubmit() {
        var $this = this;
        this.setState({loading:true});
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                message.error('两次密码输入不一致！');
                this.setState({loading:false});
                return;
            }else{
                var returnData = {"oldPass":values.oldPass,"pass":values.pass};
                $this.ajaxFn({"controlType":"update","oldPassword":$this.state.password1,"newPassword1":$this.state.password2,"newPassword2":$this.state.password2},function (data) {
                    message.success('修改成功！');
                })
            }
        });
    },
    /**/
    getPassStrenth(value, type) {

        if (value) {
            let strength;
            // 密码强度的校验规则自定义
            if (value.length < 6) {
                strength = 'L';             /*密码等级低*/
            } else if (value.length <= 9) {
                strength = 'M';             /*密码等级中*/
            } else {
                strength = 'H';             /*密码等级高*/
            }
            if (type === 'pass') {
                this.setState({ passBarShow: true, passStrength: strength });
            } else {
                this.setState({ rePassBarShow: true, rePassStrength: strength });
            }
        } else {
            if (type === 'pass') {
                this.setState({ passBarShow: false });
            } else {
                this.setState({ rePassBarShow: false });
            }
        }
    },
    /*新密码*/
    checkPass(rule, value, callback) {
        const form = this.props.form;
        this.getPassStrenth(value, 'pass');

        if (form.getFieldValue('pass')) {
            form.validateFields(['rePass'], { force: true });
        }

        callback();
    },
    /*确认密码*/
    checkPass2(rule, value, callback) {
        const form = this.props.form;
        this.getPassStrenth(value, 'rePass');

        if (value && value !== form.getFieldValue('pass')) {
            callback('两次输入密码不一致！');
        } else {
            callback();
        }
    },/*旧密码*/
    oldPass(rule, value, callback) {
        const form = this.props.form;
        this.getPassStrenth(value, 'oldPass');
        callback();
    },
    renderPassStrengthBar(type) {
        let strength;
        if(type === 'pass'){
            strength = this.state.passStrength;
        }else if(type === 'rePass'){
            strength =  this.state.rePassStrength;
        }else {
            return false;
        }
        const classSet = classNames({
            'ant-pwd-strength': true,
            'ant-pwd-strength-low': strength === 'L',
            'ant-pwd-strength-medium': strength === 'M',
            'ant-pwd-strength-high': strength === 'H',
        });
        const level = {
            L: '低',
            M: '中',
            H: '高',
        };

        return (
            <div>
                <ul className={classSet}>
                    <li className="ant-pwd-strength-item ant-pwd-strength-item-1"></li>
                    <li className="ant-pwd-strength-item ant-pwd-strength-item-2"></li>
                    <li className="ant-pwd-strength-item ant-pwd-strength-item-3"></li>
                    <span className="ant-form-text">
                        {level[strength]}
                    </span>
                </ul>
            </div>
        );
    },
	render:function(){
        const { getFieldProps } = this.props.form;
        const oldPassword = getFieldProps('oldPass',{
            rules: [
                { required: true, whitespace: true, message: '请填旧写密码' },
            ],
            onChange: (e) => {
                this.setState({password1:e.target.value});
            },
        });

        const passProps = getFieldProps('pass', {
            rules: [
                { required: true, whitespace: true, message: '请填写密码' },
                { validator: this.checkPass },
            ],
            onChange: (e) => {
                this.setState({password2:e.target.value});
            },
        });
        const rePassProps = getFieldProps('rePass', {
            rules: [{required: true, whitespace: true, message: '请再次输入密码'}, {
                validator: this.checkPass2,
            }],
        });

        const formItemLayout = {
            labelCol: { span:10 },
            wrapperCol: { span:14},
        };
		return (
            <QueueAnim>
                <Form horizontal form={this.props.form} style={{"marginTop":"70px"}} key="1">
                    <Row>
                        <Col span="7">
                            <FormItem {...formItemLayout} label="输入旧密码" className="ant-custom-label">
                                <Input {...oldPassword} type="password" maxLength="12"
                                       onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                       autoComplete="off" id="oldPass"
                                />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="7">
                            <FormItem {...formItemLayout} label="输入新密码" className="ant-custom-label" >
                                <Input {...passProps} type="password" maxLength="12"
                                       onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                       autoComplete="off" id="pass"
                                />
                            </FormItem>
                        </Col>
                        <Col span="6">
                            {this.state.passBarShow ? this.renderPassStrengthBar('pass') : null}
                        </Col>
                    </Row>

                    <Row>
                        <Col span="7">
                            <FormItem {...formItemLayout} label="确认密码" className="ant-custom-label" >
                                <Input {...rePassProps} type="password" maxLength="12"
                                       onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                                       autoComplete="off" id="rePass"
                                />
                            </FormItem>
                        </Col>
                        <Col span="6">
                            {this.state.rePassBarShow ? this.renderPassStrengthBar('rePass') : null}
                        </Col>
                    </Row>
                    <Row className="mt30">
                        <Col span="7">
                            <Col span="14" offset="10">
                                <Button className="btn-w h35" loading={this.state.loading} onClick={this.handleSubmit}>确定</Button>
                            </Col>
                        </Col>
                    </Row>
                </Form>
            </QueueAnim>
		);
	}
})

Demo = createForm()(Demo);


export default Demo
