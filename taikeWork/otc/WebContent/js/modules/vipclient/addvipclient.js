import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';
import '../../../less/addInformation.less';
import Select from 'antd/lib/select';                      /*antd select*/
const Option = Select.Option;
import DatePicker from 'antd/lib/date-picker';          /*antd 日期组件*/
import QueueAnim from 'rc-queue-anim';                  /*antd 进出场动画*/






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
            chainCustomerId:[],         /*门店客户*/
            keyval:true,
            customers:[],        /*门店集合*/
            chain:[],            /*连锁门店*/
            customerid:"", //下拉选择的门店
            chain_customId:"",//下拉选择的连锁总门店
            buyer:"",//门店联系人
            customerName:"",//门店名称
            areaName:"",//区域名称
            personInChargeName:"",//主管
            attributesName:"", //门店类型
            phone_number:"",//手机
            birthday:"",//生日
            email:"",//邮箱
            address:"",//地址
            real_name:"", //客户姓名
            position:"",//客户职位
            customer_type:"",//客户类型
        }
    },//之前
    componentWillMount:function(){
           /*查询门店*/
        this.ajaxFn({"controlType":"queryAll","chain_customId":""},function (data) {
            this.setState({customers:data.map.list});
        },'/otcdyanmic/customer.do');
    }, //提交
    submit() {
        if(this.state.customerid==""){
         message.warning("请选择门店！");
         return false;
        }
        if(this.state.real_name==""){
         message.warning("请填写真实姓名！");
         return false;
        }
        if(this.state.position==""){
         message.warning("请填写职位！");
         return false;
        }
        if(this.state.customer_type==""){
         message.warning("请选择客户类型！");
         return false;
        }
        
        if(this.state.phone_number==""){
         message.warning("请填写手机号码！");
          return false;
        }
         if(this.state.birthday==""){
         message.warning("请填写生日！");
          return false;
        }
        
        if(this.state.email==""){
         message.warning("请填写邮箱地址！");
          return false;
        }
        var reg=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        if(!reg.exec(this.state.email)){
         message.warning("请填写正确的邮箱地址！");
          return false;
        }

       if(this.state.address==""){
         message.warning("请填写地址！");
        return false;
        }else{
            var object={};
           
            object.controlType = "add";
            object.real_name=this.state.real_name;
            object.position=this.state.position;
            object.customer_type=this.state.customer_type;
            object.customer_id=this.state.customerid;
            object.phone_number=this.state.phone_number;
            object.email=this.state.email;
            object.address=this.state.address;
            object.birthday=this.state.birthday;
            this.ajaxFn(object,function(data){
                message.success("新增成功！");
                window.location.href = 'index.html#/vipclientlist';
            },"/otcdyanmic/vipCustomer.do")
             }
        
    },/*返回*/
    out(){
    window.location.href = "index.html#/vipclientlist";
    },//保存时间范围，回调函数
    searchTime: function (sd) {
    this.setState({ birthday: sd });
    },/*门店事件*/
    customerEvent(key,value){
        
         if(value==""){
          this.setState({[key]:""});
          return false;
         }else{
           var  values=value.split(";")[1]; 
           
          this.setState({[key]:values}); 
          /*请求客户信息数据*/
        this.ajaxFn({"controlType":"load","id":values},function (data) {
            this.setState({
            buyer:data.map.customer.buyer,//门店联系人
            customerName:data.map.customer.customerName,//门店名称
            areaName:data.map.customer.areaName,//区域名称
            personInChargeName:data.map.customer.personInChargeName,//主管
            attributesName:data.map.customer.attributesName, //门店类型
            })
            //this.setState({contentObj:data.map.customer});
        },'/otcdyanmic/customer.do');
          console.log("value:"+value+"values:"+values[1])
         }
       
        
},/*  显示门店信息 */
showcustominfo:function(){
 if(this.state.customerid==""){
  return "";
 }else{
 return (
   <div>
   <div className="row addinformation mt30">
      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                <div className="col-lg-4" style={{width:"100px"}}>
                    <label>联系人:</label>
                </div>
                <div className="col-lg-8 " style={{width:"auto"}}>
                    {this.state.buyer}
                </div>
      </div>
       <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4" style={{width:"66%"}}>
                <div className="col-lg-4" style={{width:"100px"}}>
                    <label>单位名称:</label>
                </div>
                <div className="col-lg-8 " style={{width:"auto"}}>
                    {this.state.customerName}
                </div>
      </div>
    
   </div>
   <div className="row addinformation mt30">
       <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4" >
                <div className="col-lg-4" style={{width:"100px"}}>
                    <label>区域:</label>
                </div>
                <div className="col-lg-8 " style={{width:"auto"}}>
                    {this.state.areaName}
                </div>
      </div>
      <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                <div className="col-lg-4" style={{width:"100px"}}>
                    <label>主管:</label>
                </div>
                <div className="col-lg-8 " style={{width:"auto"}}>
                    {this.state.personInChargeName}
                </div>
      </div>
       <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                <div className="col-lg-4" style={{width:"100px"}}>
                    <label>门店类型:</label>
                </div>
                <div className="col-lg-8 " style={{width:"auto"}}>
                    {this.state.attributesName}
                </div>
      </div>
      
   </div>
   </div>
 )
 }
},/*获取手机输入框值*/
    phoneOption(key,e){
      var value=e.target.value
      var reg= /^([1-9]\d*|[0]{1,1})$/
       console.log("value1:"+e.target.value);
      if(!reg.exec(value)){
                message.warning('只能输入数字！');
                e.target.value=e.target.value.substring(0,(e.target.value.length-1));    /*如果不是数字就把这次输入的值截取掉*/
               
                return false;
     }else{  
         this.setState({[key]:value});
     }
    },/*获取输入框值*/
    option(key,e){
     console.log("1")   
    var value=e.target.value;  
    this.setState({[key]:value});
    },
    customeroption:function(key,value){
     if(value==""){
          this.setState({[key]:""});
          return false;
         }else{
           var  values=value.split(";")[1]; 
          this.setState({[key]:values}); 
         }
    },
    render:function(){
        return (
            <div>
            <div className="mb-title" style={{border:"none"}} >新增vip客户{this.state.customer_type}</div>
          <div style={{margin:"10px 0px 6px 0px",borderBottom:"1px solid #e4e4e4",paddingBottom:"16px"}}>
           <MultiSelect  even={this.customerEvent}  placeholder="请选择门店" typeName="customerid"  options={this.state.customers} divStyle={{width:"250px",minWidth:"100px"}} selectStyle={{ "width": "240px" }} />
            <button type="button" style={{ marginLeft: "10px" }} className="btn btn-search" onClick={this.saleSearch}>搜索</button>
         </div>
            {this.showcustominfo()}
              <div className="row addinformation mt30">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <InputBox tle="客户姓名" typeName="real_name" even={this.option} />
                    </div>
                    
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <InputBox tle="客户职位" typeName="position" even={this.option}/>
                    </div>
                    <div className="col-lg-4">
                     <MultiSelect tle="客户类型"  even={this.customeroption}  placeholder="请选择门店" typeName="customer_type"  options={[{"name":"一星","id":1},{"name":"二星","id":2}]} divStyle={{width:"100%",minWidth:"100px"}} selectStyle={{ "width": "170px" }} />
                    
                    </div>
                </div>
               
              <div className="row addinformation mt30">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <InputBox tle="手机号码" typeName="phone_number" even={this.phoneOption} />
                    </div>
                    
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                            
                        <DateRange size="large" showTime searchTime={this.searchTime} />
                        {/*<InputBox tle="客户生日" typeName="birthday" even={this.option}/>*/}
                    </div>
                    <div className="col-lg-4">
                     <InputBox tle="邮箱" typeName="email" even={this.option}/>
                    </div>
                </div>
                <div className="row addinformation mt30">
                    <div className="col-lg-8">
                    <RegionInput tle="地址" typeName="address" even={this.option}  />
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
        this.props.even(this.props.typeName,e);
        //object[this.props.typeName] = e.target.value;
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
        this.props.even(this.props.typeName,e);
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
            //object[this.props.typeName] = e.target.value;
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

/*select 组件，参数：标题，option数组对象*/
var MultiSelect = React.createClass({
    handleChange:function (value) {
        this.props.even(this.props.typeName,value);
    },/*去除""或undefind null*/
    isnull:function(str) {
     if (str == null || str == undefined || str == "undefined") {
        return "";
    }
    else {
       return str;
    }
    },
    render:function(){
        var $this=this;
       
        return (
            <div className={"suppliers form-inline "+this.isnull(this.props.className)} style={this.props.divStyle}>
               
               {this.isnull(this.props.tle)==""?"":<label style={{"padding":"0 5px",marginRight:"5px",width:"33.3%",textAlign:"left",fontSize:"13px"}}>{this.props.tle}</label>} 
                <Select
                    showSearch
                    size="large"
                    placeholder={this.isnull(this.props.placeholder)==""?"请选择":this.props.placeholder}
                    style={this.props.selectStyle}
                   
                    onChange={this.handleChange}
                     key={this.isnull(this.props.keyval)}
                    dropdownClassName={this.props.dropdownClassName}
                >
                     <Option value="">请选择</Option>
                    {this.props.options.map(function (data,i) {
                         var todata=$this.isnull($this.props.todata)==""?"":"—"+data[$this.props.todata];
                        return <Option key={data.name+";"+data.id} title={data.name+todata} >{data.name+todata}</Option>
                    })}
                </Select>
            </div>
        );
    }
});

/*时间范围组件*/
var DateRange = React.createClass({
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
            <div className="form-group">
            <div className="col-lg-4">
            <label>客户生日:</label>
            </div>
            <div className="col-lg-8 ">
             <DatePicker
                    style={{ width: "100%" }}
                    placeholder="选择生日"
                    onChange={this.onStartChange}
                    defaultValue={this.state.startValue}
                    />
            </div>
            </div>
           
            
        );
    },
});
