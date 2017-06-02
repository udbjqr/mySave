import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import '../../../less/addInformation.less';
import message from 'antd/lib/message';
import Icon from 'antd/lib/Icon'
import Alert from 'antd/lib/alert';
var object =new Object();

/*新增商业客户*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/chainCustomer.do') {
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
    getInitialState:function(){
        return {
            regions:[],        /*区域数据*/
            personInChargeId:[]     /*负责代表*/
        }
    },//之前
    componentWillMount:function(){
        /*进入时请求地区数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({regions:data.map.data});
        },'/otcdyanmic/areaDivision.do');

        /*请求代表数据*/
        this.ajaxFn({"controlType":"query","id":1},function (data) {
            this.setState({personInChargeId:data.map.list});
        },'/otcdyanmic/employee.do');
    }, //提交
    submit:function () {
        console.log(object);
        if(object.chain_id && object.chain_name && object.area_id && object.employee_id){
            object.controlType = "add";
            this.ajaxFn(object,function(data){
                object = {};
                message.success('新增成功');
                window.location.href = 'index.html#/businessCustomers';
            })
        }else{
            message.warning('请填写完整新增信息');
        }

    },/*返回*/
    out(){
        window.location.href = "index.html#/businessCustomers";
    },
    render:function(){
        return (
            <div>
                <div className="mb-title">新增商业客户</div>
                <div className="row addinformation mt30">
                    <div className="col-sm-12 col-md-5 col-lg-5 ">
                        <InputBox tle="英克系统ID" typeName="chain_id"  validate="true" isStars="true" />
                        <div style={{width:"250px",position:"absolute",right:"-230px",top:"-1%"}}>
                            <Alert message="客户ID请填写南华ERP内的连锁店ID" type="warning" showIcon />
                        </div>
                        <InputBox tle="客户名称" typeName="chain_name" isStars="true" />
                        <SelectData tle="负责代表" options={this.state.personInChargeId} typeName="employee_id" isStars="true"/>
                        <SelectData tle="区域" options={this.state.regions} typeName="area_id" isStars="true"/>
                        <SelectData tle="客户类型" options={[{"name":"连锁","id":"1"},{"name":"批发","id":"2"}]} typeName="custom_type" isStars="true"/>
                    </div>
                </div>
                <div className="btn-box col-md-offset-1 mt50">
                    <button className="btn btn-w btn-c-o fl" onClick={this.submit}>确定</button>
                    <button className="btn btn-w btn-c-t fl" onClick={this.out}>返回</button>
                </div>
            </div>
        );
    }
});










/*input 大组件 需传参数：组件标题，组件业务类型，组件错误返回值*/
var InputBox = React.createClass({
    handleChange:function(e){
        if(this.props.validate){
            if(!isNaN(e.target.value)){
                object[this.props.typeName] = e.target.value;
            }else{
                e.target.value = e.target.value.replace(/\D/gi,"");
                message.warning("ID只能为数字！");
            }
        }else{
            object[this.props.typeName] = e.target.value;
        }
    },
    render:function () {
        return (
            <div className={"form-group form-inline stars po-re "+(this.props.isStars ? "yy_stars":"")}>
                <label className={this.props.lab}>{this.props.tle}</label>
                <input type="text" className="form-control" onChange={this.handleChange} onBlur={this.isblur}/>
            </div>
        );
    }
});


/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    handleChange:function (e) {
        if(e.target.value != 0){
            object[this.props.typeName] = e.target.value;
        }
    },
    render:function(){
        return (
            <div className="form-group form-inline stars yy_stars">
                <label  className={this.props.lab}>{this.props.tle}</label>
                <select type="text" className="form-control xz" onChange={this.handleChange} >
                    <option value="0">--请选择--</option>
                    {this.props.options.map(function(data,i){
                        return <option value={data.id} key={i+"po"} >{data.name}</option>
                    })}
                </select>
            </div>
        );
    }
});
