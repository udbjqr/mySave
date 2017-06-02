import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';                /*antd 提示组件*/
import '../../../less/addInformation.less'


var object = new Object();
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/userManger.do') {
        var $this = this;
        $.ajax({
            type:"post",
            url:javaUrl,
            data:{paramMap:JSON.stringify(data)},
            dataType: "json",
            async:false,	//false 表示ajax执行完成之后在执行后面的代码
            success:function(data){
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
                            Modal.warning({title: '警告提示：',content:'请输入完整内容！'});
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
            regions:[],          /*地区数据*/
            roles:[],             /*角色数据*/
            departments:[]          /*部门数据*/
        }
    },
    componentWillMount() {
        /*查询角色数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({roles:data.map.list});
        },"/otcdyanmic/roleGroup.do");

        /*进入时请求地区数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({regions:data.map.data});
        },'/otcdyanmic/areaDivision.do');

        /*请求部门数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({departments:data.map.list});
        },"/otcdyanmic/department.do");


    },/*提交新增数据*/
    submit(){
        object.controlType = 'add';
        this.ajaxFn(object,function (data) {
            message.success('新增成功');
            window.location.href = 'index.html#/userMan';
        })
    },
    out(){
        window.location.href = 'index.html#/userMan';
    },
    render:function(){
		return (
			<div>
				<div className="mb-title">新增管理员</div>
				<div className="col-lg-4 addAdmin">
                    <AddInput tle="帐号名" typeName="login_name" />
                    <AddInput tle="密码" typeName="password" />
                    <AddInput tle="员工姓名" typeName="real_name" isStars="true" />
                    <AddInput tle="微信号" typeName="weixin_name" isStars="true" />
                    <AddSelect tle="部门" typeName="department_id" options={this.state.departments} />
                    <AddSelect tle="地区" typeName="area_id" options={this.state.regions} />
                    <AddSelect tle="用户类型" typeName="employee_type"
                               options={[{"name":"代表","id":1},{"name":"主管","id":2},{"name":"行政","id":3},{"name":"厂家","id":4},{"name":"区域经理","id":5},{"name":"总经理","id":6}]}
                    />
                    <AddSelect tle="角色" typeName="role_group_id" options={this.state.roles} />
                    <div className="col-lg-11 col-lg-offset-1 mt50 form-inline">
                        <div className="form-group">
                            <button className="btn btn-c-o fl ml20" onClick={this.submit}>确定</button>
                            <button className="btn btn-c-t fl ml20" onClick={this.out}>返回</button>
                        </div>
                    </div>
				</div>
			</div>
		);
	}
})

var AddInput = React.createClass({
    changeVal(e){
        object[this.props.typeName] = e.target.value;
    },
    render(){
        return (
            <div className={"form-group form-inline stars "+(this.props.isStars ? "":"yy_stars")}>
                <label>{this.props.tle}</label>
                <input type="text" className="form-control" onChange={this.changeVal} />
            </div>
        );
    }
});


var AddSelect = React.createClass({
    changeVal(e){
        object[this.props.typeName] = e.target.value;
    },
    render(){
        return (
            <div className="form-group form-inline stars yy_stars" >
                <label>{this.props.tle}</label>
                <select className="form-control" onChange={this.changeVal}>
                    <option value="">--请选择--</option>
                    {this.props.options.map(function (data,i) {
                        return <option key={i+"AddSelectt"} value={data.id}>{data.name}</option>
                    })}
                </select>
            </div>
        );
    }
})
