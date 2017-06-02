import React from 'react'
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import {GaoLabelInput,GaoNavSelect,OaFormFn,GaoNavRadio,OaModalInput,GaoModalSelect} from './GaoReact.js'
import {DatePicker,Form, Icon, Input, Button, Checkbox ,TimePicker,Select,Radio,Upload,Modal,message,Switch} from 'antd'
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;



let object = new Object();

export default React.createClass({
	//ajax 封装
    ajaxFn(data,callback,javaUrl = '/officedyanmic/module.do') {
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
			thisControl:'',		/*当前选中的控件*/
			thisFormType:'',	/*当前选中的文本类型*/
			formArr:[],			/*表单集合JSON*/
			showForm:[],		/*需要显示的属性表单*/
			formInfo:{},		/*form的数据*/
			randomKey:0,		/*刷新的key*/
			visible:false,		/*添加弹窗的显示状态*/
			functionName:""			/*功能名称*/
		}
	},
	componentWillMount(){
		let obj = {
					"a":{"a1":"a1","a2":"a2","a3":"a3"},
					"b":{"b1":"b1","b2":"b2","b3":"b3"}
				  }
 		for (var key in obj) {
			console.log(obj[key].a1);
 		}
		var str = '^[A-Za-z]+$';
		var re =new RegExp(str);
		var isnum = re.test("a");

	},
	componentDidMount(){
		var $this = this;
        var keepData = sessionStorage.getItem('JJ_keepData');
        this.ajaxFn({controlType:"load",module_id:JSON.parse(keepData).module_id},data=>{
            this.setState({
                functionName:data.values.module_name,
                formArr:(data.values.form_structure ? data.values.form_structure.formArr :[])
            });
        });

	},/*根据不同的表单类型设置属性类型*/
	validateType(type){
		if(type == "dateControl"){
			this.setState({showForm:["title","defaultValue","help","isRequired"]});
		}else if(type == "timeControl"){
			this.setState({showForm:["title","defaultValue","isRequired"]});
		}else if(type == "dropDownControl"){
			this.setState({showForm:["title","help","value","isRequired","isRequiredisRequired","selectiveValue"]});
		}else if(type == "radioControl"){
			this.setState({showForm:["title","help","value","isRequired","selectiveValue"]});
		}else if(type == "checkboxControl"){
			this.setState({showForm:["title","help","value","isRequired","selectiveValue"]});
		}else if(type == "attachmentControl"){
			this.setState({showForm:["title","help","isRequired"]});
		}else if(type == "textControl"){
			this.setState({showForm:["title","defaultValue","help","isMultiLine","isRequired","textType","efficacy"]});
		}else if(type == "switchControl"){
            this.setState({showForm:["title","help","isSwitch"]});
        }
	},/*控件选中新增*/
	control(e,title,type){
        object = {};
        var $this = this;
        var X = e.pageX;
        var Y = e.pageY;
        var temp = $("<img src='./images/"+type+".png' />");
        var formArr = this.state.formArr;
        var parentX = $("#productionArea").offset().left;
        var parentY = $("#productionArea").offset().top;
        var parentWidth = $("#productionArea").width();
        var parentHeight = $("#productionArea").height();
        $("body").append(temp);
        temp.css({position:"absolute",left:X,top:Y});
        $(document).mousemove(function(e){
			X = e.pageX;
			Y = e.pageY;
            if(Y > parentY && Y < parentY+parentHeight && X > parentX && X < parentX+parentWidth){
                temp.css({position:"absolute",left:X,top:Y,cursor:"inherit"});
            }else{
                temp.css({position:"absolute",left:X,top:Y,cursor:"no-drop"});
            }
		})
		$(document).mouseup(function(){
			$(document).unbind("mousemove");
			$(document).unbind("mouseup");
            /*判断边界*/
            if(Y > parentY && Y < parentY+parentHeight && X > parentX && X < parentX+parentWidth){
                object.domX = X - $("#productionArea").offset().left;
                object.domY = Y - $("#productionArea").offset().top;
                object.domWidth = temp.innerWidth();
                object.domHeight = temp.innerHeight();
                object.formType = type;
                formArr.push(object);
                $this.setState({formArr});
            }
            temp.remove();
		});
	},/*元素的拖拽事件*/
	dragEvent(e){
        var X,Y;
        var $this = this;
        var pos = getXY(e);
		var $temp = $(e.currentTarget).parents(".formclass");
		var index = $("#productionArea").find(".formclass").index($temp);
        var deviationX= pos.x - $temp.position().left;  //偏移量
        var deviationY = pos.y - $temp.position().top;  //偏移量
        var tempWidth = $temp.innerWidth();             //移动元素的宽度
        var tempHeight = $temp.innerHeight();           //移动元素的高度
        var parentWidth = $("#productionArea").width();
        var parentHeight = $("#productionArea").height();
		$(document).mousemove(function(e){
            var posMove = getXY(e);
            X = posMove.x - deviationX;
			Y = posMove.y - deviationY;
            var rightX = X + tempWidth;
            var bottomY = Y + tempHeight;
            if(X <= 0)X = 0;
            if(X >= (parentWidth-tempWidth))X = parentWidth-tempWidth;
            if(Y <= 0)Y = 0;
            if(Y >= (parentHeight-tempHeight))Y = parentHeight-tempHeight;
			$temp.css({"position": "absolute","left":X+"px","top":Y+"px"});
            $("#productionArea").find(".formclass").addClass("border-c-ccc");
            $("#productionArea .line-top").css({top:Y+"px",borderColor:"#ccc"});
            $("#productionArea .line-right").css({left:rightX+"px",borderColor:"#ccc"});
            $("#productionArea .line-bottom").css({top:bottomY+"px",borderColor:"#ccc"});
            $("#productionArea .line-left").css({left:X+"px",borderColor:"#ccc"});
		})
		$(document).mouseup(function(){
			$(document).unbind("mousemove");
			$(document).unbind("mouseup");
            $this.state.formArr[index].domX = X;
            $this.state.formArr[index].domY = Y;
            $this.state.formArr[index].domWidth = $temp.innerWidth();
            $this.state.formArr[index].domHeight = $temp.innerHeight();
            $("#productionArea").find(".formclass").removeClass("border-c-ccc");
            $("#productionArea .align-line").css({borderColor:"transparent"});
		});
	},/*删除*/
	removeForm(e){
		var dom = $(e.target).parents(".formclass");
		var index = $("#productionArea").find(".formclass").index(dom);
		var formArr = this.state.formArr;
		formArr.splice(index,1);
		this.setState({formArr},function(){
			message.success("删除成功!");
		});
	},/*表单点击修改*/
	formClick(e){
		var dom = $(e.target).parents(".formclass");
		var index = $("#productionArea").find(".formclass").index(dom);
		var formInfo = this.state.formArr[index];
        var formTitle = dom.attr("name");
		this.setState({index,formInfo,thisControl:formTitle,visible:true,randomKey:Math.random()},function(){
			this.validateType(formInfo.formType);
		});
		object = formInfo;
	},/*修改确定*/
	handleOk(){
		var index = this.state.index;
		var formArr = this.state.formArr;
		formArr[index] = object;
		this.setState({formArr,randomKey:Math.random()},function(){
			object = {};
			this.setState({visible:false})
		});
	},/*保存*/
	keep(){
		var formObj = {};
		var formArr = this.state.formArr;
		formObj.formArr = formArr;
		formObj.formLen = formArr.length;
        formObj.formName = this.state.functionName;
		var keepData = sessionStorage.getItem('JJ_keepData');
		this.ajaxFn({"controlType":"update","form_structure":formObj,"module_id":JSON.parse(keepData).module_id,"module_name":this.state.functionName},(data)=>{
			message.success("保存成功!");
			window.location.href = "index.html#/functionManagement";
		})
	},/*关闭*/
	close(){
		window.location.href = "index.html#/functionManagement";
	},
	render(){
		const $this = this;
		return (
			<QueueAnim>
				<div className="row page-border-b" key="1">
					<div className="col-lg-8">
						<h3 className="page-title">表单设置</h3>
					</div>
					<div className="col-lg-4">
						<Button className="fr mt18 ml20" size="large" onClick={this.close}>关闭</Button>
						<Button className="fr mt18 ml20" type="primary" size="large" onClick={this.keep}>保存</Button>
                        <Button className="fr mt18" type="primary" size="large">使用模板</Button>
					</div>
				</div>
				<div className="md-content mt15" key="2">
					<div className="nav-form pt5">
                        <label className="function-name">功能名称：{this.state.functionName}</label>
					</div>
					<div className="row marginNone">
						<div className="col-lg-8">
							<div className="domain-nav">
								<OaFormFn iconClass="date-icon" title="日期控件" type="dateControl" onClick={this.control} />
								<OaFormFn iconClass="time-icon" title="时间控件" type="timeControl" onClick={this.control}/>
								<OaFormFn iconClass="dropDown-icon" title="下拉选择器" type="dropDownControl" onClick={this.control} />
								<OaFormFn iconClass="radio-icon" title="单选选择器" type="radioControl" onClick={this.control}/>
								<OaFormFn iconClass="checkbox-icon" title="多选选择器" type="checkboxControl" onClick={this.control}/>
								<OaFormFn iconClass="attachment-icon" title="附件" type="attachmentControl" onClick={this.control}/>
								<OaFormFn iconClass="text-icon" title="文本控件" type="textControl" onClick={this.control}/>
                                <OaFormFn iconClass="switch-icon" title="开关控件" type="switchControl" onClick={this.control}/>
							</div>
							<div id="productionArea" className="production-area">
									{this.state.formArr.map(function(obj,i){
										if(obj && obj.formType === "dateControl"){
											return (
												<DateForm key={i} formInfo={obj} clickForm={$this.formClick} onMouseDown={$this.dragEvent} removeForm={$this.removeForm} />
											);
										}else if (obj && obj.formType === "timeControl") {
											return (
												<TimeForm key={i} formInfo={obj} clickForm={$this.formClick} onMouseDown={$this.dragEvent} removeForm={$this.removeForm} />
											);
										}else if (obj && obj.formType === "dropDownControl") {
											return (
												<DropDownForm key={i} formInfo={obj} clickForm={$this.formClick} onMouseDown={$this.dragEvent} removeForm={$this.removeForm} />
											);
										}else if (obj && obj.formType === "radioControl") {
											return (
												<RadioForm key={i} formInfo={obj} clickForm={$this.formClick} onMouseDown={$this.dragEvent} removeForm={$this.removeForm} />
											);
										}else if (obj && obj.formType === "checkboxControl") {
											return (
												<CheckForm key={i} formInfo={obj} clickForm={$this.formClick} onMouseDown={$this.dragEvent} removeForm={$this.removeForm} />
											);
										}else if (obj && obj.formType === "attachmentControl") {
											return (
												<AttachmentForm key={i} formInfo={obj} clickForm={$this.formClick} onMouseDown={$this.dragEvent} removeForm={$this.removeForm} />
											);
										}else if (obj && obj.formType === "textControl") {
											return (
												<TextForm key={$this.state.randomKey+i} formInfo={obj} clickForm={$this.formClick} onMouseDown={$this.dragEvent} removeForm={$this.removeForm}  />
											);
										}else if(obj && obj.formType === "switchControl"){
                                            return (
                                                <SwitchForm key={$this.state.randomKey+i} formInfo={obj} clickForm={$this.formClick} onMouseDown={$this.dragEvent} removeForm={$this.removeForm} />
                                            )
                                        }
									})}
                                    <div className="align-line line-top"></div>
                                    <div className="align-line line-right"></div>
                                    <div className="align-line line-bottom"></div>
                                    <div className="align-line line-left"></div>
							</div>
						</div>
						<div className="col-lg-4">
							<div className="attribute-column">
								<div className="attribute-tle">预览手机效果</div>
								<div className="attribute-box">
									<div className="phone-style">
										<img src="images/phone.png"  />
										<div key={this.state.randomKey} className="phone-middle">
										{this.state.formArr.map((item,i) =>{
											const {title} = item;
											return (
												<div key={i} className="phone-line">
													<span className="phone-l-t">{title}</span>
													<Icon className="phone-l-i" type="right" />
												</div>
											)
										})}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<AttributeForm
					key={this.state.randomKey+3}
					thisControl={this.state.thisControl}
					showForm={this.state.showForm}
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={()=>{this.setState({visible:false})}}
					formInfo={this.state.formInfo}
				/>

			</QueueAnim>
		);
	}
});












/*表单的属性弹窗*/
var AttributeForm = React.createClass({
    //ajax 封装
    ajaxFn(data,callback,javaUrl = '/officedyanmic/dataSource.do') {
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

                }else{
                    callback.call($this,data);
                }
            },
            error(){
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    componentWillMount(){
        this.ajaxFn({controlType:"queryDateType"},data=>{
            this.setState({dataSource:data.values});
        })
    },
	getInitialState(){
		return {
			efficacy:'',
			randomKey:0,
            dataSource:[],       /*数据源*/
		}
	},
	render(){
		var $this = this;
		const selectAfter = (
		  <Select key={this.state.randomKey} defaultValue="选择效验码" style={{ width: 100 }} onChange={val => this.setState({efficacy:val})} >
		    <Option value="^[0-9]*$">效验数字</Option>
		    <Option value="^((-\d+)|(0+))$">效验非数字</Option>
		    <Option value="^\w+[-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$">效验邮箱</Option>
		  </Select>
		);
		const {thisControl,showForm,visible,onOk,onCancel,formInfo} = this.props;


		return (
			<Modal title={thisControl+"设置属性"} visible={visible} onOk={onOk} onCancel={onCancel} >
				<div className="row">
					{showForm.map(function(obj,i){
						if(obj && obj === "title"){
							return (
								<div key={i} className="col-lg-6">
									<OaModalInput tle="表单标题：" defaultValue={formInfo.title} onChange={(e) => object.title = e.target.value} width="70%"/>
								</div>
							);
						}else if (obj && obj === "id") {
							return (
								<div key={i} className="col-lg-6">
									<OaModalInput tle="ID：" defaultValue={formInfo.id} onChange={(e) => object.id = e.target.value}  width="70%"/>
								</div>
							);
						}else if(obj && obj === "defaultValue"){
							return (
								<div key={i} className="col-lg-6">
									<OaModalInput tle="默认值：" defaultValue={formInfo.defaultValue} onChange={(e) => object.defaultValue = e.target.value}  width="70%"/>
								</div>
							);
						}else if (obj && obj === "help") {
							return (
								<div key={i} className="col-lg-6">
									<OaModalInput tle="备注：" defaultValue={formInfo.help} onChange={(e) => object.help = e.target.value}  width="70%"/>
								</div>
							);
						}else if (obj && obj === "efficacy") {
							return (
								<div key={i} className="col-lg-12 mb15">
									<Input size="large" style={{width:"387px"}} placeholder="效验码" addonBefore={selectAfter} value={$this.state.efficacy} onChange={e => {object.efficacy = e.target.value;$this.setState({efficacy:e.target.value,randomKey:Math.random()})}} />
								</div>
							);
						}else if (obj && obj === "textType") {
							return (
								<div key={i} className="col-lg-12">
									<GaoModalSelect tle="文本类型：" options={[{"name":"字符串","id":"string"},{"name":"数字型","id":"number"}]} onChange={val => object.dataType = val} />
								</div>
							);
						}else if (obj && obj === "isRequired") {
							return (
                                <GaoNavRadio key={i} tle="是否必填：" radios={[{"name":"非必填","id":"0"},{"name":"必填","id":"1"}]} defaultValue={formInfo.isRequired ? formInfo.isRequired : 0} onChange={e => object.isRequired = e.target.value} />
                            )
						}else if (obj && obj === "isSwitch") {
							return (
                                <GaoNavRadio className="pt5" key={i} tle="默认值：" radios={[{"name":"开","id":1},{"name":"关","id":0}]} defaultValue={formInfo.isSwitch} onChange={e => object.isSwitch = e.target.value} />
                            )
						}else if (obj && obj === "isMultiLine") {
						    return (
                                <GaoNavRadio className="pt5" key={i} tle="是否多行：" radios={[{"name":"否","id":"0"},{"name":"是","id":"1"}]} defaultValue={formInfo.textType?formInfo.textType:0} onChange={e => object.textType = e.target.value} />
                            )
						}else if(obj && obj === "selectiveValue"){
                            return (
                                <div key={i} className="col-lg-12" style={{borderTop:"1px solid #e8e1e1",paddingTop:"25px"}}>
                                    <GaoModalSelect defaultValue={formInfo.dataSource} tle="数据源：" options={$this.state.dataSource} onChange={val => object.dataSource = val} valId="dataType" valName="dataName"/>
                                </div>
                            )
                        }
					})}
				</div>
			</Modal>
		);
	}
});













var DateForm = React.createClass({
	render(){
		const {formInfo,onMouseDown,clickForm,removeForm} = this.props;
        const {title="标题",help,domX,domY,isRequired} = formInfo;
		const formInfoStr = JSON.stringify(formInfo);
		return (
			<div name="日历控件" value={formInfoStr} className="formclass control-group" style={{left:domX+"px",top:domY+"px"}}>
				<label className={"see-form-label "+(isRequired?"required-icon":"")} >{title}：</label>
				<div className="form-box" >
					<DatePicker size="large" showTime format="YYYY-MM-DD" style={{width:"200px"}} />
					<p>{help}</p>
				</div>
                <div onMouseDown={onMouseDown} className="move-layer"></div>
                <div className="operation-btn">
                    <Icon className="editForm" type="edit" title="编辑"  onClick={clickForm} />
                    <Icon className="deleteForm" type="close-circle-o"  title="删除" onClick={removeForm} />
                </div>
			</div>
		);
	}
})



var TimeForm = React.createClass({
	render(){
		const {formInfo,onMouseDown,clickForm,removeForm} = this.props;
        const {title="标题",help,domX,domY,isRequired} = formInfo;
		const formInfoStr = JSON.stringify(formInfo);
		return (
			<div name="时间控件" value={formInfoStr} className="formclass control-group" style={{left:domX+"px",top:domY+"px"}}>
				<label className={"see-form-label "+(isRequired?"required-icon":"")}>{title}：</label>
				<div className="form-box">
					<TimePicker size="large" style={{width:"200px"}}/>
					<p>{help}</p>
				</div>
                <div onMouseDown={onMouseDown} className="move-layer"></div>
                <div className="operation-btn">
                    <Icon className="editForm" type="edit" title="编辑"  onClick={clickForm} />
                    <Icon className="deleteForm" type="close-circle-o"  title="删除" onClick={removeForm} />
                </div>
			</div>
		);
	}
});


var DropDownForm = React.createClass({
	render(){
		const {formInfo,onMouseDown,clickForm,removeForm} = this.props;
        const {title="标题",help,domX,domY,selectiveValue,isRequired} = formInfo;
		const formInfoStr = JSON.stringify(formInfo);
		return (
			<div name="下拉选择器" value={formInfoStr} className="formclass control-group" style={{left:domX+"px",top:domY+"px"}} >
				<label className={"see-form-label "+(isRequired?"required-icon":"")}>{title}：</label>
				<div className="form-box">
					<Select size="large" style={{ width: 200 }} >
                        {(selectiveValue?selectiveValue.xzArr:[]).map((obj,i)=>{
                            return (
                                <Option key={i}>{obj}</Option>
                            )
                        })}
					</Select>
					<p>{help}</p>
				</div>
                <div onMouseDown={onMouseDown} className="move-layer"></div>
                <div className="operation-btn">
                    <Icon className="editForm" type="edit" title="编辑"  onClick={clickForm} />
                    <Icon className="deleteForm" type="close-circle-o"  title="删除" onClick={removeForm} />
                </div>
			</div>
		);
	}
});

var RadioForm = React.createClass({
	render(){
		const {formInfo,onMouseDown,clickForm,removeForm} = this.props;
        const {title="标题",help,domX,domY,isRequired} = formInfo;
		const formInfoStr = JSON.stringify(formInfo);
		return (
			<div name="单选选择器" value={formInfoStr} className="formclass control-group" style={{left:domX+"px",top:domY+"px"}}>
				<label className={"see-form-label "+(isRequired?"required-icon":"")}>{title}：</label>
				<div className="form-box" style={{width:226}}>
					<RadioGroup >
                    {(formInfo.selectiveValue?formInfo.selectiveValue.xzArr:["A","B","C"]).map((obj,i)=>{
                        return <Radio className="fontWeight400" key={i} value={i}>{obj}</Radio>
                    })}
					</RadioGroup>
					<p>{help}</p>
				</div>
                <div onMouseDown={onMouseDown} className="move-layer"></div>
                <div className="operation-btn">
                    <Icon className="editForm" type="edit" title="编辑"  onClick={clickForm} />
                    <Icon className="deleteForm" type="close-circle-o"  title="删除" onClick={removeForm} />
                </div>
			</div>
		)
	}
});

var CheckForm = React.createClass({
	render(){
		const {formInfo,onMouseDown,clickForm,removeForm} = this.props;
        const {title="标题",help,domX,domY,isRequired} = formInfo;
		const formInfoStr = JSON.stringify(formInfo);

		return (
			<div name="多选选择器" value={formInfoStr} className="formclass control-group" style={{left:domX+"px",top:domY+"px"}}>
				<label className={"see-form-label "+(isRequired?"required-icon":"")}>{title}：</label>
				<div className="form-box pt5" style={{width:226}}>
					<CheckboxGroup options={formInfo.selectiveValue ? formInfo.selectiveValue.xzArr : ["A","B","C"]}  />
					<p>{help}</p>
				</div>
                <div onMouseDown={onMouseDown} className="move-layer"></div>
                <div className="operation-btn">
                    <Icon className="editForm" type="edit" title="编辑"  onClick={clickForm} />
                    <Icon className="deleteForm" type="close-circle-o"  title="删除" onClick={removeForm} />
                </div>
			</div>
		)
	}
});

var AttachmentForm  = React.createClass({
	render(){
		const {formInfo,onMouseDown,clickForm,removeForm} = this.props;
        const {title="标题",help,domX,domY,isRequired} = formInfo;
		const formInfoStr = JSON.stringify(formInfo);
		return (
			<div name="附件" value={formInfoStr} className="formclass control-group" style={{left:domX+"px",top:domY+"px"}}>
				<label className={"see-form-label "+(isRequired?"required-icon":"")}>{title}：</label>
				<div className="form-box">
					<Upload>
						<Button type="ghost">
						  <Icon type="upload" /> 上传文件
						</Button>
					</Upload>
					<p>{help}</p>
				</div>
                <div onMouseDown={onMouseDown} className="move-layer"></div>
                <div className="operation-btn">
                    <Icon className="editForm" type="edit" title="编辑"  onClick={clickForm} />
                    <Icon className="deleteForm" type="close-circle-o"  title="删除" onClick={removeForm} />
                </div>
			</div>
		)
	}
})

var TextForm = React.createClass({
	render(){
		const {formInfo,onMouseDown,clickForm,removeForm} = this.props;
		const {title="标题",defaultValue,help,textType="text",domX,domY,isRequired} = formInfo;
		const formInfoStr = JSON.stringify(formInfo);
		return (
			<div name="文本控件" value={formInfoStr} className="formclass control-group" style={{left:domX+"px",top:domY+"px"}}>
				<label className={"see-form-label "+(isRequired?"required-icon":"")}>{title}：</label>
				<div className="form-box">
					<Input type={textType == "1" ? "textarea":"text"} size="large" defaultValue={defaultValue} style={{width:"200px"}} />
					<p>{help}</p>
				</div>
                <div onMouseDown={onMouseDown} className="move-layer"></div>
                <div className="operation-btn">
                    <Icon className="editForm" type="edit" title="编辑"  onClick={clickForm} />
                    <Icon className="deleteForm" type="close-circle-o"  title="删除" onClick={removeForm} />
                </div>
			</div>
		)
	}
})



var SwitchForm = React.createClass({
	render(){
		const {formInfo,onMouseDown,clickForm,removeForm} = this.props;
		const {title="标题",isSwitch=1,defaultValue,help,textType="text",domX,domY} = formInfo;
		const formInfoStr = JSON.stringify(formInfo);
		return (
			<div name="开关控件" value={formInfoStr} className="formclass control-group" style={{left:domX+"px",top:domY+"px"}}>
				<label className="see-form-label">{title}：</label>
				<div className="form-box pt3">
					<Switch defaultChecked={(isSwitch == 1?true:false)} />
					<p>{help}</p>
				</div>
                <div onMouseDown={onMouseDown} className="move-layer"></div>
                <div className="operation-btn">
                    <Icon className="editForm" type="edit" title="编辑"  onClick={clickForm} />
                    <Icon className="deleteForm" type="close-circle-o"  title="删除" onClick={removeForm} />
                </div>
			</div>
		)
	}
})

var TitleForm = React.createClass({
    render(){
        return (
            <div style={{borderBottom:"1px solid #ccc"}}>
                标题
            </div>
        );
    }
})



//获取鼠标的位置，包括滚动条部分，并且兼容IE 678
	function getXY(e){
		var ev = e || window.event;//解决兼容
		var x=0,y=0;
		if(ev.pageX){ //可以直接获得鼠标在窗口的坐标，包括滚动条的距离
			x = ev.pageX;
			y = ev.pageY;
		}else{
			//获取当前已滚动的滚动条距离
			var sleft = 0,stop = 0;
			if(document.documentElement){//IE 678
				sleft = document.documentElement.scrollLeft;
				stop = document.documentElement.scrollTop;
			}else{//IE 9+ 谷歌
				sleft = document.body.scrollLeft;
				stop = document.body.scrollTop;
			}
            //ev.clientX  只能得到当前窗口的坐标，超出部分就不能获取
            //用当前窗口的坐标加上已滚动的滚动条距离就可以得到和pageY，pageX一样的效果
			x = ev.clientX + sleft;
			y = ev.clientY + stop;
		}
		return {x:x,y:y};
	};









    /*选择表单数据组件(已废弃的选择数据源组件，舍不得扔。。。。)*/
    // <CheckboxApp backfillValue={formInfo.selectiveValue} />
    // const CheckboxApp = React.createClass({
    //     //ajax 封装
    //     ajaxFn(data,callback,javaUrl = '/officedyanmic/dataSource.do') {
    //         var $this = this;
    //         $.ajax({
    //             type:"post",
    //             url:javaUrl,
    //             data:{paramMap:JSON.stringify(data)},
    //             dataType: "json",
    //             timeout:5000,
    //             async:false,	//false 表示ajax执行完成之后在执行后面的代码
    //             success:function(data){
    //                 if(!data.success){/*首先判断这个属性，错误在判断原因*/
    //
    //                 }else{
    //                     callback.call($this,data);
    //                 }
    //             },
    //             error(){
    //                 Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
    //             }
    //         });
    //     },
    //     getInitialState() {
    //         return {
    //             xzValue:[],
    //             checkedList: [],        /*选中的数据*/
    //             plainOptions:[],         /*所有数据*/
    //             allList:[],             /*全选的数据*/
    //             indeterminate: true,
    //             checkAll: false,
    //             backfillValue:{}
    //         };
    //     },
    //     componentWillMount(){
    //         console.log(this.props.backfillValue);
    //         if(this.props.backfillValue){
    //             if(this.props.backfillValue.xzVal){
    //                 this.ajaxFn({controlType:"query",dataType:this.props.backfillValue.xzVal.key,dataName:this.props.backfillValue.xzVal.label},data=>{
    //                     let [arr,checkedList] = [[],[]];
    //                     Array.from(data.values,obj=>{
    //                         checkedList.push(obj.value);
    //                         arr.push({label:obj.name,value:obj.value});
    //                     });
    //                     this.setState({plainOptions:arr,checkedList:this.props.backfillValue.xzArr,allList:checkedList,backfillValue:this.props.backfillValue.xzVal});
    //                 });
    //             };
    //         };
    //     },/*选择表单数据的值事件*/
    //     xzValueEvent(val){
    //         this.ajaxFn({controlType:"query",dataType:val.key,dataName:val.label},data=>{
    //             let [tempobj,arr,checkedList] = [{},[],[]];
    //             Array.from(data.values,obj=>{
    //                 checkedList.push(obj.value);
    //                 arr.push({label:obj.name,value:obj.value});
    //             });
    //             this.setState({plainOptions:arr,checkedList,allList:checkedList,backfillValue:val});
    //             tempobj.xzVal = val;
    //             tempobj.xzArr = checkedList;
    //             tempobj.dataType = val.key;
    //             object.selectiveValue = tempobj;
    //         });
    //     },
    //     onChange(checkedList) {
    //         console.log(checkedList);
    //         this.setState({
    //             checkedList,
    //             indeterminate: !!checkedList.length && (checkedList.length < this.state.plainOptions.length),
    //             checkAll: checkedList.length === this.state.plainOptions.length,
    //         });
    //         object.selectiveValue.xzArr = checkedList;
    //     },
    //     onCheckAllChange(e) {
    //         console.log(this.state.allList);
    //         this.setState({
    //             checkedList: e.target.checked ? this.state.allList : [],
    //             indeterminate: false,
    //             checkAll: e.target.checked,
    //         });
    //         object.selectiveValue.xzArr = e.target.checked ? this.state.allList : [];
    //     },
    //     render() {
    //         return (
    //             <div>
    //                 <div>
    //                     <label className="modal-label">数据源：</label>
    //                     <Select labelInValue value={this.state.backfillValue}  placeholder="选择数据源" size="large" style={{width:"86%"}} onChange={this.xzValueEvent} >
    //                         {this.state.xzValue.map((obj,i)=>{
    //                             if(Object.keys(obj).length != 0){
    //                                 return <Option key={obj.dataType} >{obj.dataName}</Option>
    //                             }
    //                         })}
    //                     </Select>
    //                 </div>
    //                 <div style={{marginTop:"15px",marginBottom:"15px"}}>
    //                     <Checkbox
    //                         indeterminate={this.state.indeterminate}
    //                         onChange={this.onCheckAllChange}
    //                         checked={this.state.checkAll}
    //                     >
    //                         全部
    //                     </Checkbox>
    //                 </div>
    //                 <CheckboxGroup options={this.state.plainOptions} value={this.state.checkedList} onChange={this.onChange} />
    //           </div>
    //         );
    //     }
    // });
