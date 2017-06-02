import React from 'react'
import Transfer from 'antd/lib/transfer';
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message'              /*antd 提示组件*/
import Input from 'antd/lib/input'                  /*antd Input*/
import '../../../less/addInformation.less'



var object = new Object();
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/department.do') {
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
    getInitialState:function () {
        return {
            mockData: [],        /*交换框数据*/
            targetKeys: [],       /*交换框数据*/
            groups:[],              /*组长集合*/
            groupName:'',            /*组名称*/
            administrator_id:'',         /*组长*/
            remark:''                   /*说明*/
        }
    },
    componentDidMount() {
        var strData = sessionStorage.getItem("TK_strData");
        var userId = JSON.parse(strData).deptId;
        /*获取用户组数据*/
        this.ajaxFn({"controlType":"load","deptId":userId},function (data) {
            object = data.map.info;
            this.setState({
                groupName:data.map.info.dept_name,
                administrator_id:data.map.info.administrator_id,
                remark:data.map.info.remark
            });
        });

        this.ajaxFn({"controlType":"query","id":2},function (data) {
            this.setState({groups:data.map.list});
        },"/otcdyanmic/employee.do");

        //this.getMock(data.map.info.administrator_id,data.map.users);
    },/*初始交换框*/
    getMock(value,groups) {
        var arr = [];
        var targetKeys = [];
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            data.map.list.forEach(function (obj,i) {
                var  data = {key:obj.id,title:obj.name,disabled:true};
                arr.push(data);
            });
            if(groups){
                groups.forEach(function (obj,i) {
                    targetKeys.push(obj*1);
                });
            }else{
                targetKeys.push(value*1);
            }
            this.setState({
                mockData:arr,
                targetKeys:targetKeys
            });
        },'/otcdyanmic/userManger.do');
    },/*组长选择*/
    selectChange:function (key,value,groups) {
        object.administrator_id = value;
       // this.getMock(value,groups);
    },/*交换框操作*/
    handleChange(targetKeys, direction, moveKeys) {
        this.setState({ targetKeys });
    },/*组名称*/
    groupName(e){
        object.dept_name = e.target.value;
        this.setState({groupName:e.target.value});
    },
    textarea(e){
        object.remark = e.target.value;
        this.setState({remark:e.target.value});
    },/*确定提交*/
    submit(){
        var strData = sessionStorage.getItem("TK_strData");
        var deptId = JSON.parse(strData).deptId;
        object.controlType = "update";
        object.userIdStr = this.state.targetKeys.toString();
        object.deptId = deptId;
        this.ajaxFn(object,function (data) {
            message.success('修改成功！');
            window.location.href = "index.html#/userGroup";
        })
    },/*返回*/
    out(){
        window.location.href = "index.html#/userGroup";
    },
    render:function(){
        return (
            <div>
                <div className="mb-title ">修改用户组</div>
                <div className="row">
                    <div className="col-ms-12 col-md-6 col-lg-6 addAdmin">
                        <div className="form-group form-inline yy_stars">
                            <label className="text-center w100">组名称</label>
                            <input value={this.state.groupName} type="text" className="form-control" onChange={this.groupName}/>
                        </div>
                        <SelectData tle="组长" options={this.state.groups} even={this.selectChange} keys="group_leader" content={this.state.administrator_id}/>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-ms-12 col-md-12 col-lg-12">
                        <div className="form-group form-inline stars">
                            <label className="text-center fl w100">组员</label>
                            <Transfer
                                style={{"float":"left"}}
                                dataSource={this.state.mockData}
                                targetKeys={this.state.targetKeys}
                                onChange={this.handleChange}
                                render={item => item.title}
                                titles={["全部人员","已分配人员"]}
                                operations={['添加', '删除']}
                                listStyle={{
                                    width: 200,
                                    height: 300,
                                }}
                            />
                        </div>
                    </div>
                </div> */}
                <div className="row">
                    <div className="col-ms-12 col-md-12 col-lg-12">
                        <div className="form-group form-inline stars">
                            <label className="text-center fl w100 mr10">用户组说明</label>
                            <Input value={this.state.remark}  type="textarea" className="user-sm" onChange={this.textarea} rows={4} />
                        </div>
                        <div className="col-lg-11 col-lg-offset-1 mt50 form-inline">
                            <div className="form-group">
                                <button className="btn btn-c-o fl ml20" onClick={this.submit}>确定</button>
                                <button className="btn btn-c-t fl ml20" onClick={this.out}>返回</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});



/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    handleChange:function (e) {
        if(e.target.value != 0){
            this.props.even(this.props.keys,e.target.value);
        }
    },
    render:function(){
        var val = this.props.content;
        return (
            <div className="form-group form-inline stars yy_stars">
                <label className="text-center w100">{this.props.tle}</label>
                <select type="text" className="form-control xz" onChange={this.handleChange} >
                    <option value="0">--请选择--</option>
                    {this.props.options.map(function(data,i){
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
});
