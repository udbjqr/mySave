import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';
import '../../../less/addInformation.less';
import DatePicker from 'antd/lib/date-picker';          /*antd 日期组件*/






var object =new Object();

/*新增连锁客户*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/customer.do') {
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
            isError:{},                 /*错误对象初始值*/
            regions:[],                 /*区域初始值*/
            attributesId:[],            /*属性初始值*/
            chainCustomerId:[],         /*门店客户*/
            employeeId:[],              /*负责人*/
            personInChargeId:[],        /*责任主管*/
            areaManagerId:[],            /*区域经理*/
            levelArr:[]                 /*类型*/
        }
    },//之前
    componentWillMount:function(){
        /*进入时请求地区数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({regions:data.map.data});
        },'/otcdyanmic/areaDivision.do');
        /*请求属性数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({attributesId:data.map.data});
        },'/otcdyanmic/customerAttributes.do');

        /*查询主管*/
        this.ajaxFn({"controlType":"query","id":2},function (data) {
            this.setState({personInChargeId:data.map.list});
            /*查询区域经理*/
            this.ajaxFn({"controlType":"query","id":5},function (data) {
                this.setState({areaManagerId:data.map.list});
                /*查询代表*/
                this.ajaxFn({"controlType":"query","id":1},function (data) {
                    this.setState({employeeId:data.map.list});
                },'/otcdyanmic/employee.do');
            },'/otcdyanmic/employee.do');
        },'/otcdyanmic/employee.do');

        /*商业客户*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({chainCustomerId:data.map.list});
        },'/otcdyanmic/chainCustomer.do');

        /*类型数据*/
        this.ajaxFn({"controlType":"queryAll"},function(data){
            this.setState({levelArr:data.map.data});
        },'/otcdyanmic/customerAttributes.do');


    }, //提交
    submit() {
        if(object.customerName &&object.personInChargeId  && object.employeeId &&object.areaManagerId &&object.areaId &&object.chainCustomerId&&object.attributes_id){
            object.flag = 1;
            object.controlType = "add";
            this.ajaxFn(object,function(data){
                object = {};
                message.success("新增成功！");
                window.location.href = 'index.html#/chainCustomers';
            })
        }else{
            message.warning("请填写完整内容！");
        }
    },/*返回*/
    out(){
        window.location.href = "index.html#/chainCustomers";
    },
    render:function(){
        return (
            <div>
                <div className="mb-title">新增门店</div>
                <div className="row addinformation mt30">
                    <div className="col-lg-8">
                        <RegionInput tle="客户名称" typeName="customerName" isStars="position_stars"  />
                    </div>
                </div>

                <div className="row addinformation mt30">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <SelectData  tle="区域经理" options={this.state.areaManagerId} typeName="areaManagerId" isStars="position_stars"/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <SelectData  tle="区域" options={this.state.regions} typeName="areaId" isStars="position_stars"/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <SelectData  tle="商业客户" options={this.state.chainCustomerId} typeName="chainCustomerId" isStars="position_stars"/>
                    </div>
                </div>

                <div className="row addinformation mt30">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <SelectData tle="主管" options={this.state.personInChargeId} typeName="personInChargeId"  isStars="position_stars"/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <SelectData tle="代表" options={this.state.employeeId} typeName="employeeId" isStars="position_stars"/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <SelectData tle="门店类型" options={this.state.levelArr} typeName="attributes_id" isStars="position_stars"/>
                    </div>
                </div>



                <div className="row addinformation mt30">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <InputBox tle="门店联系人电话" typeName="buyerPhone" />
                    </div>
                    <div className="col-lg-4">
                        <InputBox tle="门店联系人" typeName="buyer" />
                    </div>
                    <div className="col-lg-4">

                    </div>
                </div>

                <div className="row addinformation mt30">
                    <div className="col-lg-8">
                        <RegionInput tle="地址" typeName="address"  />
                    </div>
                </div>
                <div className="col-lg-10 col-lg-offset-2 mt50 form-inline">
                    <div className="form-group">
                        <button className="btn btn-c-o fl ml20" onClick={this.submit}>确定</button>
                        <button className="btn btn-c-t fl ml20" onClick={this.out}>返回</button>
                    </div>
                </div>
            </div>
        );
    }
});










/*input 需传参数：组件标题，组件业务类型*/
var InputBox = React.createClass({
    handleChange:function(e){
        object[this.props.typeName] = e.target.value;
    },
    render:function () {
        return (
            <div className="form-group">
                <div className="col-lg-4">
                    <label>{this.props.tle}</label>
                </div>
                <div className={"col-lg-8 "+(this.props.isStars ? this.props.isStars : "")}>
                    <input type="text"  className="form-control h28" onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
});


/*加大表单输入框*/
var RegionInput = React.createClass({
    handleChange:function(e){
        object[this.props.typeName] = e.target.value;
    },
    render:function () {
        return (
            <div className="form-group">
                <div className="col-lg-2">
                    <label>{this.props.tle}</label>
                </div>
                <div className={"col-lg-10 "+(this.props.isStars ? this.props.isStars : "")}>
                    <input type="text"  className="form-control h28" onChange={this.handleChange}/>
                </div>
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
            <div className="form-group">
                <div className="col-lg-4">
                    <label>{this.props.tle}</label>
                </div>
                <div className={"col-lg-8 "+(this.props.isStars ? this.props.isStars : "")}>
                    <select className="form-control xzSelect" onChange={this.handleChange} >
                        <option value="0">--请选择--</option>
                        {this.props.options.map(function(data,i){
                            return <option value={data.id} key={i+"po"} >{data.name}</option>
                        })}
                    </select>
                </div>
            </div>
        );
    }
});
