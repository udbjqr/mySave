import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import DateRange from '../react-utils/dateRange.js' /*antd 日期范围组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import message from 'antd/lib/message';
import DatePicker from 'antd/lib/date-picker';          /*antd 日期组件*/
import Input from 'antd/lib/input';
import '../../../less/vipclient.less'



var object =new Object();

/*连锁客户详情*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/vipCustomer.do') {
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
        var strData = sessionStorage.getItem("TK_strData");
        return {
            strData:strData,
            customer_id:JSON.parse(strData).customer_id, //门店id
            vipId:JSON.parse(strData).id, //vipId客户id
            vipdata:[], //vip客户详情
            Maintaindata:[], //维系详情
            addVisible:false, //新增维系信息弹框
            randomKey:0,
            time:"",
            addtitle:"",
            addconter:"",
            head_portrait:'',
        }
    },//之前
    componentWillMount:function(){
        
         
         
        /*进入时请求vip客户详情数据*/
        this.ajaxFn({"controlType":"load","id":this.state.vipId},function (data) {
           this.setState({vipdata:data.map.data});
           console.log(data.map.data)
        },"/otcdyanmic/vipCustomer.do");
        /*请求维系详情数据*/
        this.ajaxFn({"controlType":"query","vip_customer_id":this.state.vipId},function (data) {
           this.setState({Maintaindata:data.map.list});
        },"/otcdyanmic/vipCustomerRelation.do");
    },/*返回*/
    out:function () {
        window.location.href = "index.html#/vipclientlist";
    },//保存时间范围，回调函数
    searchTime: function (sd) {
        
    this.setState({ time: sd });
    },
    toupdate:function(){
    //
    var vipData={};
       vipData={
       id:this.state.vipdata.id,
       customer_id:this.state.customer_id,
       real_name:this.state.vipdata.real_name,
       position:this.state.vipdata.position,
       birthday:this.state.vipdata.birthday,
       customer_name:this.state.vipdata.customer_name,
       area_name:this.state.vipdata.area_name,
       phone_number:this.state.vipdata.phone_number,
       principal:this.state.vipdata.principal,
       email:this.state.vipdata.email,
       address:this.state.vipdata.address,
       customer_type:this.state.vipdata.customer_type,
    };
    console.log(vipData)
    sessionStorage.setItem("vip_strData",JSON.stringify(vipData));
    window.location.href = "index.html#/updatevipclient";
    },/*打开新增维系信息弹框*/
    openadd(){
       
        this.setState({
           addVisible:true,
        });
    },/*关闭弹窗*/
    handleCancel(){
        this.setState({addVisible:false,randomKey:Math.random()});
    },/*选中,获取值*/
    option(key,value){
       
        if(isnull(value)==""){
         this.setState({[key]:""})
        }else{
             this.setState({[key]:value})
        }
    },
    toadd:function(){
    this.ajaxFn({"controlType":"add","vip_customer_id":this.state.vipId,title:this.state.addtitle,content:this.state.addconter,time:this.state.time},function (data) {
            message.success("添加维系信息成功！");
             /*请求维系详情数据*/
        this.ajaxFn({"controlType":"query","vip_customer_id":this.state.vipId},function (data) {
           this.setState({Maintaindata:data.map.list,addVisible:false});

        },"/otcdyanmic/vipCustomerRelation.do");

        },"/otcdyanmic/vipCustomerRelation.do");
    },
    render:function(){
        return (
            <div style={{overflow:"hidden "}}>

               <div className="mb-title border0" key="1" >
                    <i style={{ cursor: "pointer",fontStyle:"12px" }} onClick={this.out}>vip客户管理</i> <i style={{ "fontFamily": "新宋体" }}>&gt;&gt;</i> vip客户详情
                {this.state.addtitle}
                </div>
                <div style={{margin:"20px 10px 10px 0px"}}>
                <div style={{width:"350px",border:"1px solid #E4E4E4",minHeight:"380px",borderRadius:"6px",overflow:"hidden",paddingBottom:"10px",float:"left"}}>
                <h2 style={{height:"40px",lineHeight:"40px",backgroundColor:"#F3F3F3",position:"relative",borderBottom:"1px solid #E4E4E4"}}><i className="fa fa-flag-checkered fa-lg" style={{fontSize:"13px",margin:"auto 6px",color:"#666"}}></i>客户信息 <span onClick={this.toupdate} style={{position:"absolute",right:"8px",fontSize:"17px",cursor: "pointer"}}><i className="fa fa-edit"></i></span></h2>
                <ul>
                <Viplist tle="客户姓名:"  vipdata={this.state.vipdata.real_name}/>
                <Viplist tle="职位："     vipdata={this.state.vipdata.position}/>
                <Viplist tle="客户生日：" vipdata={removet(this.state.vipdata.birthday)}/>
                <Viplist tle="单位名称：" vipdata={this.state.vipdata.customer_name}/>
                <Viplist tle="区域："     vipdata={this.state.vipdata.area_name}/>
                <Viplist tle="手机号码：" vipdata={this.state.vipdata.phone_number}/>
                <Viplist tle="负责人："   vipdata={this.state.vipdata.principal}/>
                <Viplist tle="邮箱："     vipdata={this.state.vipdata.email}/>
                <Viplist tle="家庭住址：" vipdata={this.state.vipdata.address}/>
                </ul>

                </div>

                <div style={{width:"600px",margin:"0px 0px 20px 25px",border:"1px solid #E4E4E4",minHeight:"380px",borderRadius:"6px",overflow:"hidden",paddingBottom:"10px",float:"left"}}>
                  <h2 style={{height:"40px",lineHeight:"40px",backgroundColor:"#F3F3F3",position:"relative",borderBottom:"1px solid #E4E4E4"}}><i className="fa fa-list-alt fa-lg" style={{fontSize:"13px",margin:"auto 6px",color:"#666"}}></i>维系详情 <span style={{position:"absolute",right:"8px",fontSize:"17px"}} onClick={this.openadd}><i className="fa fa-plus-square-o" ></i></span></h2>

              
                <Timeline options={this.state.Maintaindata}/>
 



                </div>
                 
                </div>
                
                
              <Modal title="新增系统维系" visible={this.state.addVisible} onOk={this.toadd} onCancel={this.handleCancel} >
                   <Datecheck size="large" showTime searchTime={this.searchTime} defaultValue={this.state.birthday} />
                   <AddInput tle="标题" typeName="addtitle" style={{width:"80%"}} even={this.option}  />
                   <AddInput tle="内容" typeName="addconter" type="textarea" even={this.option}  style={{width:"80%",minRows:6,maxRows:10}}/>
               </Modal>
               
            </div>
        );
    }
});



/*vip客户详情列表*/
var Viplist = React.createClass({
    render:function () {
        return (
      <li style={{height:"auto",minHeight:"40px",lineHeight:"40px"}}>
        <label style={{margin:"0px 20px 0px 10px",fontSize:"14px",width:"80px",textAlign:"right"}}>{this.props.tle}</label>
        <span style={{lineHeight:"12px"}}>{this.props.vipdata}</span>
        </li>
        );
    }

});

/*时间轴*/
var Timeline = React.createClass({
    render:function () {
        return (
         <div className="Timelinemain">
         
         {this.props.options.map(function (data,i) {
                    var time=data.time;
                    var title=data.title;
                    var principa=data.principa
                    var content=data.content  
                    var head_portrait=isnull(data.head_portrait)==""?"images/mobile/17.png":data.head_portrait
                    if(i%2==0){ //偶数
                     return ( 
                <div className="Timelinelist">   
                <div className="Timelinewarp">
                <div className="Timelines linecLeft">
                 <h2>{title}<label></label></h2>
                 <div className="linecontent">{content}</div>
                 <div className="tolinkL"></div>
                </div>
                
                </div>
                <div className="Timelinewarp ">
                <span className="Timelinetitle lineRight">
                <p>{principa}</p>
                <p>{time}</p>
                </span>
                </div>
                <div className="Timelinelog"><img src={head_portrait} /></div>
                </div>
                    )
                    }else{
                       return(
                <div className="Timelinelist">   
                <div className="Timelinewarp ">
                <span className="Timelinetitle lineLeft">
                <p>{principa}</p>
                <p>{time}</p>
                </span>
                </div>
                 <div className="Timelinewarp">
                <div className="Timelines linecRight">
                 <h2>{title}<label></label></h2>
                 <div className="linecontent">{content}</div>
                  <div className="tolinkR"></div>
                </div>
                </div>
                <div className="Timelinelog"><img src={head_portrait} /></div>
                </div>
                       )
                    }
                   
                    })}
         </div>           

        );
    }

});

/*input 大组件 需传参数：组件标题，组件业务类型，组件错误返回值*/
var InputBox = React.createClass({
    render:function () {
        return (
            <div className="form-group">
                <div className="col-lg-4">
                    <label>{this.props.tle}</label>
                </div>
                <div className="col-lg-8">
                    <p className="info-p">{this.props.content}</p>
                </div>
            </div>
        );
    }

});


/*select 组件，参数：标题，option数组对象*/
var RegionData = React.createClass({
    render:function(){
        return (
            <div className="form-group">
                <div className="col-lg-3">
                    <label>{this.props.tle}</label>
                </div>
                <div className="col-lg-9">
                    <p className="info-p">{this.props.content}</p>
                </div>
            </div>
        );
    }
});

 //去除时间多余部分
function removet(s) {
    var time = "";

    if (s.indexOf(" ") != "-1") {  //存在
        time = s.split(" ")[0];
        return time;
    }
    else {
        time = s;
        return time;
    }
}






/*显示详情*/
var ProductName = React.createClass({
    render(){
        const {className} = this.props;
        return (
            <div className={"addselect "+className}>
                <label>{this.props.tle}</label>
                <p>{this.props.content}</p>
            </div>
        );
    }
});
/*弹窗新增input*/
var AddInput = React.createClass({
   
     handleChange:function (e) {
         var value=e.target.value;
        this.props.even(this.props.typeName,value);
    },
    render(){
       
        return (
            <div className="addInput" id="editBox">
                <label style={{width:"20%",height:"32px",lineHeight:"32px",margin:"0px",padding:"0px"}}>{this.props.tle}</label>
                <Input type={isnull(this.props.type)==""?"text":this.props.type}  className="form-control clearinput" onChange={this.handleChange}  style={this.props.style} />
            </div>
        );
    }
});

/*时间范围组件*/
var Datecheck = React.createClass({
    getInitialState() {
        /*默认第一次传的时间数据*/
        var sameMonth ="";
        var planDay = "";
        return {
            startValue: sameMonth,  /*一周前日期*/
            endOpen: false
        };
    },
    onStartChange(value) {
        this.setState({ startValue: this.formatDate(value) });
        this.searchTime(this.formatDate(value));
    },
    /*格式转换*/
    formatDate: function (date) {
        if (date !== null) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return year + "-" + (month > 9 ? (month + "") : ("0" + month)) + "-" + (day > 9 ? (day + "") : ("0" + day));
        } else {
            message.warning('请先填写日期范围！');
            return "";
        }
    },
    searchTime: function (sd) {
        this.props.searchTime(sd);
    },
    render() {
        return (
            <div className="addInput" >
           
            <label style={{width:"20%",height:"32px",lineHeight:"32px",margin:"0px",padding:"0px"}}>时间:</label>
             <DatePicker
                    style={{ width: "80%" }}
                    placeholder="选择时间"
                    onChange={this.onStartChange}
                  
                    />
           
            </div>
           
            
        );
    },
});


/*
去除""或undefind null
*
*
*/

function isnull(str) {
    if (str == null || str == undefined || str == "undefined") {
        return "";
    }
    else {
        return str;
    }
}

