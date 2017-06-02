import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';
import '../../../less/addInformation.less'

var object = new Object();
export default React.createClass({
    ajaxFn:function(returnData,callback,javaUrl = '/otcdyanmic/cost.do'){
        var $this = this;
        $.ajax({
            type:"post",
            url:javaUrl,
            data:{paramMap:JSON.stringify(returnData)},
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
            showContent:{},
            cost:{},        //保存成本的对象
            contentObj:{}      /*查询出来的初始值*/
        }
    },//进入时初始化
    componentWillMount:function () {
        var strData = sessionStorage.getItem("TK_strData");
        var productId = JSON.parse(strData).id;
        this.ajaxFn({"controlType":"load","id":productId},function (data) {
            this.setState({contentObj:data.map.data});
        })
    },//确定提交
    submit:function () {
        var strData = sessionStorage.getItem("TK_strData");
        var productId = JSON.parse(strData).id;
        this.ajaxFn({"controlType":"update","id":productId,"costPrice2":object.cost2,"costPrice3":object.cost3},function (data) {
            message.success('修改成功');
            window.location.href = 'index.html#/costControls';
        })
    }, /*返回*/
    out(){
        window.location.href = "index.html#/costControls";
    },
	render:function(){
		return (
			<div>
				<div className="mb-title">成本修改</div>
				<div className="col-lg-6 addAdmin">
                    <ShowContent tle="产品ID" content={this.state.contentObj.goodsId}/>
                    <ShowContent tle="产品名称" content={this.state.contentObj.goodsName}/>
                    <ShowContent tle="批次" content={this.state.contentObj.id}/>
                    <ShowContent tle="规格" content={this.state.contentObj.specification}/>
                    <ShowContent tle="供应商" content={this.state.contentObj.supplier}/>
                    <ShowContent tle="开票价" content={this.state.contentObj.costPrice1}/>
                    <InputBox tle="成本价2" content={this.state.contentObj.costPrice2} typeName="cost2"/>
                    <InputBox tle="成本价3" content={this.state.contentObj.costPrice3} typeName="cost3"/>
                    <ShowContent tle="批发价" content={this.state.contentObj.sellingMoney}/>
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


/*显示内容组件，参数：tle标题，content内容*/
var ShowContent = React.createClass({
	render:function () {
		return (
			<div className="form-group form-inline stars">
				<label>{this.props.tle}</label>
                <p className="show-info">{this.props.content}</p>
			</div>
		);
	}
});

/*input 大组件 需传参数：组件标题，组件业务类型，组件错误返回值*/
var InputBox = React.createClass({
    getInitialState(){
        return{
            first:true,
        }
    },
    handleChange:function(e){
        if(!isNaN(e.target.value)){
            object[this.props.typeName] = e.target.value;
        }else{
            object[this.props.typeName] = e.target.value.replace(/\D/gi,"");
            message.warning('只能输入数字！');
        }
        this.setState({first:false});
    },
    render:function () {
        if(this.state.first){
            object[this.props.typeName] = this.props.content;
        }
        return (
            <div className="form-group form-inline stars">
                <label>{this.props.tle}：</label>
                <input value={object[this.props.typeName]}  type="text"  className="form-control" onChange={this.handleChange} />
            </div>
        );
    }
});
