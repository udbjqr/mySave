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
          groups:[]              /*组长*/
      }
    },
    componentDidMount() {
        /*查询组员*/
        this.ajaxFn({"controlType":"query","id":2},function (data) {
            this.setState({groups:data.map.list});
        },'/otcdyanmic/employee.do');

    },/*初始交换框*/
    getMock(value) {
        var arr = [];
        var targetKeys = [];
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            data.map.list.forEach(function (obj,i) {
                var  data = {
                    key:obj.id,
                    title:obj.name
                };
                arr.push(data);
            });
            targetKeys.push(value*1);
            this.setState({mockData:arr,targetKeys:targetKeys});
        },'/otcdyanmic/userManger.do');
    },/*交换框操作*/
    handleChange(targetKeys, direction, moveKeys) {
        this.setState({ targetKeys });
    },/*选择组长*/
    selectChange:function (value) {
        object.administrator_id = value;
        //this.getMock(value);
    },/*确定提交*/
    submit(){
        if(object.dept_name && object.remark && object.administrator_id){
            object.controlType = "add";
            object.userIdStr = this.state.targetKeys.toString();
            this.ajaxFn(object,function (data) {
                message.success('新增成功！');
                window.location.href = "index.html#/userGroup";
            });
        }else{
            message.warning("请填写完整内容！");
        }
    },/*获取组名*/
    groupName(e){
        object.dept_name = e.target.value;
    },/*获取说明*/
    textarea(e){
        object.remark = e.target.value;
    },/*返回*/
    out(){
        window.location.href = "index.html#/userGroup";
    },
    render:function(){
        return (
            <div>
                <div className="mb-title ">新增用户组</div>
                <div className="row">
                    <div className="col-ms-12 col-md-6 col-lg-6 addAdmin">
                        <div className="form-group form-inline yy_stars">
                            <label className="text-center w100">组名称</label>
                            <input type="text" className="form-control" onChange={this.groupName}/>
                        </div>
                        <SelectData tle="组长" options={this.state.groups} even={this.selectChange}/>
                    </div>
                </div>
                {/*<div className="row">*/}
                    {/*<div className="col-ms-12 col-md-12 col-lg-12">*/}
                        {/*<div className="form-group form-inline stars">*/}
                            {/*<label className="text-center fl w100">组员</label>*/}
                            {/*<Transfer*/}
                                {/*style={{"float":"left"}}*/}
                                {/*dataSource={this.state.mockData}*/}
                                {/*targetKeys={this.state.targetKeys}*/}
                                {/*onChange={this.handleChange}*/}
                                {/*render={item => item.title}*/}
                                {/*titles={["全部人员","已分配人员"]}*/}
                                {/*operations={['添加', '删除']}*/}
                                {/*listStyle={{*/}
                                    {/*width: 200,*/}
                                    {/*height: 300,*/}
                                {/*}}*/}
                            {/*/>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}
                <div className="row">
                    <div className="col-ms-12 col-md-12 col-lg-12">
                        <div className="form-group form-inline stars">
                            <label className="text-center fl w100 mr10">用户组说明</label>
                            <Input type="textarea" className="user-sm" onChange={this.textarea} rows={4} />
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
        this.props.even(e.target.value);
    },
    render:function(){
        return (
            <div className="form-group form-inline stars yy_stars">
                <label className="text-center w100">{this.props.tle}</label>
                <select type="text" className="form-control xz" onChange={this.handleChange} >
                    <option value="">--请选择--</option>
                    {this.props.options.map(function(data,i){
                        return <option value={data.id} key={i+"po"} >{data.name}</option>
                    })}
                </select>
            </div>
        );
    }
});
