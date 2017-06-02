import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';                /*antd 提示组件*/
import '../../../less/addInformation.less'





var object = new Object();

export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/userManger.do',isasync = "true") {
        var $this = this;
        $.ajax({
            type:"post",
            url:javaUrl,
            data:{paramMap:JSON.stringify(data)},
            dataType: "json",
            async:isasync,
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
            }
        });
    },
    getInitialState:function () {
        return {
            regions:[],                 /*地区数据*/
            roles:[],                  /*角色数据*/
            departments:[],              /*部门数据*/
            login_name:'',              /*帐号名*/
            real_name:'',               /*员工姓名*/
            weixin_name:'',               /*微信号*/
            mobile:'',                  /*手机号码*/
            email:'',                   /*邮箱*/
            department_id:'',               /*部门*/
            areaName:'',                  /*地区*/
            employee_type:'',               /*用户类型*/
            role_group_id:'',               /*角色*/

        }
    },
    componentWillMount(){
        /*通过ID查询数据*/
        var strData = sessionStorage.getItem("TK_strData");
        var productId = JSON.parse(strData).id;
        /*管理员详情*/
        this.ajaxFn({"controlType":"load","employee_id":productId},function (data) {
            object = data.map.employee
            this.setState({
                login_name:object.login_name,              /*帐号名*/
                real_name:object.real_name,               /*员工姓名*/
                weixin_name:object.weixin_name,               /*微信号*/
                mobile:object.mobile,                    /*手机号码*/
                email:object.email,                        /*邮箱*/
                department_id:object.department_id,               /*部门*/
                areaName:object.areaName,                  /*地区*/
                employee_type:object.employee_type,               /*用户类型*/
                role_group_id:object.role_group_id               /*角色*/
            });
        },'/otcdyanmic/userManger.do');

        /*进入时请求地区数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({regions:data.map.data});
        },'/otcdyanmic/areaDivision.do');

        /*请求部门数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({departments:data.map.list});
        },"/otcdyanmic/department.do");

        /*查询角色数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({roles:data.map.list});
        },"/otcdyanmic/roleGroup.do");



    },/*提交*/
    submit(){
        var strData = sessionStorage.getItem("TK_strData");
        var productId = JSON.parse(strData).id;
        object.employee_id = productId;
        object.controlType = "update";
        this.ajaxFn(object,function (data) {
            message.success('修改成功');
            window.location.href = 'index.html#/userMan';
        })
    },
    out(){
        window.location.href = 'index.html#/userMan';
    },
    render:function(){
        return (
            <div>
                <div className="mb-title">修改管理员信息</div>
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-4 addAdmin">

                    <AddInput tle="帐号名" typeName="login_name" content={this.state.login_name} disabled="true" />
                    <AddInput tle="员工姓名" typeName="real_name" content={this.state.real_name} />
                    <AddInput tle="微信号" typeName="weixin_name" content={this.state.weixin_name}  />
                    <AddSelect tle="部门" typeName="department_id" options={this.state.departments} content={this.state.department_id} />
                    <AddSelect tle="地区" typeName="area_id" options={this.state.regions} content={this.state.areaName} />
                    <AddSelect
                        tle="用户类型" typeName="employee_type"
                        options={[{"name":"代表","id":1},{"name":"主管","id":2},{"name":"行政","id":3},{"name":"厂家","id":4},{"name":"区域经理","id":5},{"name":"总经理","id":6}]}
                        content={this.state.employee_type}
                    />
                    <AddSelect tle="角色" typeName="role_group_id" options={this.state.roles} content={this.state.role_group_id} />
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
});




/*input框  可编辑*/
var AddInput = React.createClass({
    getInitialState(){
        return{
            first:true,
        }
    },
    keyUpVal(e){
        object[this.props.typeName] = e.target.value;
        this.setState({first:false});
    },
    render(){
        if(this.state.first){
            object[this.props.typeName] = this.props.content;
        }
        return (
            <div className="form-group form-inline stars">
                <label>{this.props.tle}</label>
                <input ref="input" disabled={(this.props.disabled ? true : false)} value={object[this.props.typeName]}  type="text" className="form-control" onChange={this.keyUpVal} />
            </div>
        );
    }
});



var AddSelect = React.createClass({
    changeVal(e){
        object[this.props.typeName] = e.target.value;
    },
    render(){
        var val = this.props.content;
        return (
            <div className="form-group form-inline stars">
                <label>{this.props.tle}</label>
                <select className="form-control" onChange={this.changeVal} >
                    <option value="">--请选择--</option>
                    {this.props.options.map(function (data,i) {
                        if(data.name == val || data.id == val){
                            return <option value={data.id} key={i+"po"} selected="true" >{data.name}</option>
                        }else{
                            return <option value={data.id} key={i+"po"} >{data.name}</option>
                        }
                    })}
                </select>
            </div>
        );
    }
})




