import React from 'react';
import {Button,Select,DatePicker,Input,Radio,Modal,message} from 'antd'
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;


/*
    GaoReact JS   组件库
    配合 antd Bootstrap 使用

    版本： 1.0.0
    开发： 高志强
    时间：2016-11-18


*/

/*【单选框】*/
var GaoNavRadio = React.createClass({
    render(){
        const {tle,onChange,style,className="",radios,defaultValue=1} = this.props;
        return (
            <div className={"Gao-form "+className} style={style}>
                <label>{tle}</label>
                <RadioGroup onChange={onChange} defaultValue={defaultValue} >
                    {radios.map((obj,i)=>{
                        return (
                            <Radio key={i} value={obj.id*1}>{obj.name}</Radio>
                        )
                    })}
                </RadioGroup>
            </div>
        )
    }
});


/*【 label + antd select 框 选择】 用于菜单的搜素 */
var GaoNavSelect = React.createClass({
    handleChange(val){
        /*如果传入了键名那么就执行带有键名的方法*/
        if(this.props.keyName){
            this.props.onChange(this.props.keyName,val);
        }else{
            this.props.onChange(val);
        }
    },
    render(){
        const {tle="" , options =[],className="", width="220px" ,onChange , keyName , size = "large",placeholder = "请选择"} = this.props;
        return (
            <div className={"Gao-nav-select "+className}>
                <label>{tle}</label>
                <Select size={size}  placeholder={placeholder} style={{ width:width }} onChange={this.handleChange}>
                    {options.map(function(obj,i){
                        return <Option key={i} value={obj.id+""}>{obj.name}</Option>
                    })}
                </Select>
            </div>
        )
    }
});


/*【 label + p  标题、信息 显示组件 】 用于数据信息显示 */
var GaoLabelP = React.createClass({
    render:function(){
        const {pStyle,tle,content} = this.props;
        return (
            <div className="Gao-label-p">
                <label className="gao-label">{tle}</label>
                <p style={pStyle}>{content}</p>
            </div>
        );
    }
});

/*【label + antd-Input】 nav 上面输入u*/
var GaoLabelInput = React.createClass({
    render(){
        const {tle,onChange,style,className,defaultValue,width="220px",size="large",placeholder="请输入"} = this.props;
        return (
            <div className={"Gao-form "+className} style={style}>
                <label>{tle}</label>
                <Input style={{width:width}} defaultValue={defaultValue} size={size} placeholder={placeholder} onChange={onChange}/>
            </div>
        );
    }
})




/*【弹窗上的select框】 配合antd Modal组件使用   **回填下拉应该在做一个不方便公用  */

var GaoModalSelect = React.createClass({
    handleChange(val){
        /*如果传入了键名那么就执行带有键名的方法*/
        if(this.props.keyName){
            this.props.onChange(this.props.keyName,val);
        }else{
            this.props.onChange(val);
        }
    },
    render(){
        const {className="",tle,defaultValue="",options=[],style,placeholder="请选择",size="large",valId="id",valName="name"} = this.props;
        return (
            <div className={"Gao-modal-select "+className} style={style}>
                <label>{tle}</label>
                <Select showSearch size={size} style={{ width: 419 }} placeholder={placeholder} optionFilterProp="children" defaultValue={defaultValue+""} onChange={this.handleChange} >
                    {options.map(function (data,i) {
                        return <Option key={i} value={""+data[valId]}>{data[valName]}</Option>
                    })}
                </Select>
            </div>
        )
    }
});


/*【弹窗上input输入框，可以回填值做修改框 】 适用于一行两个小输入框*/
var GaoModalInput = React.createClass({
    getInitialState(){
        return{
            first:true,
        }
    },
    changeVal(e){
        if(this.props.dataType == "number"){
            if(isNaN(e.target.value)){
                e.target.value  = e.target.value.substring(0,(e.target.value.length-1));    /*如果不是数字就把这次输入的值截取掉*/
                message.warning('只能输入数字！');
                return false;
            }
        }
        var val = e.target.value.replace(/(^\s*)|(\s*$)/g, "");
        object[this.props.typeName] = val;           /*这个是必须的，否则不能输入*/
        this.props.onChange(val);
        this.setState({first:false});
    },
    render(){
        const {className,content,typeName,tle} = this.props;
        if(this.state.first){
            object[typeName] = content;
        }
        return (
            <div className={"Gao-modal-input "+className}>
                <label>{tle}</label>
                <input defaultValue={object[typeName]} className="form-control" onChange={this.changeVal} />
            </div>
        );
    }
});



/*【时间范围组件】*/

var DateRange = React.createClass({
    /*格式转换*/
    formatDate:function (date) {
        if(date !== null){
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return year + "-" +(month > 9 ? (month + "") : ("0" + month));
        }else{
            message.warning('请先填写日期范围！');
            return "";
        }
    },
    getInitialState() {
        return {
            startValue: startTime,  /*去年的上个月*/
            endValue: endTime      /*上个月*/
        };
    },
    onStartChange(value) {
        this.searchTime(this.formatDate(value),null);
    },
    onEndChange(endVal) {
        this.searchTime(null,this.formatDate(endVal));
    },
    searchTime:function (sv,ev) {
        this.props.searchTime(sv,ev);
    },
    render() {
        const {className} = this.props;
        return (
            <div className={className} style={{"marginRight":"20px","display":"inlineBlock"}}>
                <MonthPicker
                    placeholder="开始时间"
                    onChange={this.onStartChange}
                    defaultValue={this.state.startValue}
                />
                <span> ~ </span>
                <MonthPicker
                    placeholder="结束时间"
                    onChange={this.onEndChange}
                    defaultValue={this.state.endValue}
                />
            </div>
        );
    },
});









/*---------------------【方法库】--------------------------*/



/*antd 日期组件，限制日期选择，只能选择 this.state.planDay参数当前的月份*/
function disabledDate(date){
    var backyear = new Date(this.state.planDay).getFullYear();
    var backMonth = new Date(this.state.planDay).getMonth()+2;
    var thisdate = date.valueOf().time;                             /*每次进来的时间毫秒数*/
    if(backMonth > 12){
        backyear += 1;
        backMonth = "01";
    }else if(backMonth < 10){
        backMonth = "0"+backMonth;
    }
    var MinDate = new Date(this.state.planDay).getTime();               /*最大时间范围*/
    var MaxDate = new Date((backyear+"-"+backMonth)).getTime();         /*最小时间范围*/
    if(thisdate < MinDate){
        return true;
    }else if(thisdate > MaxDate){
        return true;
    }else{
        return false;
    }
}



/*获取去年的时间的当前月时间*/
function getLastYearDate(date){
    var lastDate = date;
    var lastYear = lastDate.substring(0,4)-1;
    var surplus = lastDate.substring(4);
    var lastYearDate = lastYear +surplus;
    return lastYearDate;
}




/*---------------------【OA项目的组件】--------------------------*/

/*【表单功能控件】*/
var OaFormFn = React.createClass({
    event(e){
        this.props.onClick(e,this.props.title,this.props.type);
    },
    render(){
        const {iconClass,title} = this.props;
        return (
            <div className="oa-form-fn pointer user-select" onMouseDown={this.event}>
                <i className={iconClass}></i>
                <span>{title}</span>
            </div>
        )
    }
});


/*【label + antd-Input】 modal 上面输入*/
var OaModalInput = React.createClass({
    onChange(e){
        if(this.props.dataType == "number"){
            if(isNaN(e.target.value)){
                e.target.value  = e.target.value.substring(0,(e.target.value.length-1));    /*如果不是数字就把这次输入的值截取掉*/
                message.warning('只能输入数字！');
                return false;
            }
        }else if(this.props.dataType == "chinese"){
            if (/[\u4E00-\u9FA5]/i.test(e.target.value)) {
                e.target.value  = ""    /*清空*/
                message.warning("登录名不能有中文！");
                return false;
            }
        }
        var val = e.target.value.replace(/(^\s*)|(\s*$)/g, "");
        this.props.onChange(e,val);
    },
    render(){
        const {tle,onChange,style,className="",defaultValue="",width,size="large",placeholder="请输入"} = this.props;
        return (
            <div className={"Gao-modal-input "+className}>
                <label className="text-center">{tle}</label>
                <Input placeholder={placeholder} style={{width:width}} defaultValue={defaultValue} onChange={this.onChange} />
            </div>
        );
    }
})









/*---------------------导出的组件和方法--------------------*/
export {
    GaoLabelInput,
    GaoNavSelect,
    GaoLabelP,
    GaoModalSelect,
    GaoModalInput,
    DateRange,
    disabledDate,
    getLastYearDate,
    OaFormFn,
    GaoNavRadio,
    OaModalInput
 }
