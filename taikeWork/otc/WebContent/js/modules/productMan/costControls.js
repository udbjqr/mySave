import React from 'react'
import MemberTabel from  '../react-utils/table.js'  /*表格组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import Dropdown from 'antd/lib/dropdown'
import Button from 'antd/lib/button'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import DatePicker from 'antd/lib/date-picker';      /*antd 日期组件*/
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import message from 'antd/lib/message'               /*antd 提示组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import Loading from '../react-utils/loading'         /*加载中组件*/
import '../../../less/tablePage.less'



var valArr=[]
/*成本管理页面*/
export default React.createClass({
    /*ajax 封装*/
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
                $("#loading").addClass("none");
            },
            error(){
                $("#loading").addClass("none");
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
	getInitialState:function(){
        /*默认第一次传的时间数据*/
       
        var sameMonth = sessionStorage.getItem("cost_startTime") ? sessionStorage.getItem("cost_startTime") : initDate(false);
        var planDay = sessionStorage.getItem("cost_endTime") ? sessionStorage.getItem("cost_endTime") : initDate();
		return {
			dataTab :[],       /*表格数据初始值*/
			pageNum:1,		    /*分页组件页数*/
			showLine:20,	    /*表格显示行数*/
			dataLen:0,		    /*表格数据条数*/
            timeframe:[],       /*时间范围*/
            sameMonth:sameMonth,     /*当月的第一天*/
            planDay:planDay,     /*当前年月日*/
            memberName:"", //搜索关键字
            checkArr:"",
            checkVisible:false,
            reset:Math.random(),                    /*重置KEY的值*/
            costPrice2:"", //成本2
            costPrice3:"", //成本3
            btnLoading:false, /*按钮等待状态*/ 
            isclean:"false",  //是否清除选择 
            checkarrs:"",
        }; 
	},	/*进入时初始化*/
	componentWillMount:function(){
        /*进入时初始化数据
		this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":1,"startTime":this.state.sameMonth,"endTime":this.state.planDay},function (data) {
			this.setState({
				dataTab:data.map.costList,
				dataLen:data.map.count
			});
		});
        */
	},/*跳页*/
	pageNumber(page){
        this.allclean();
        
        this.setState({loading:true,pageNum:page,dataTab:""});
		this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":page,"startTime":this.state.sameMonth,"endTime":this.state.planDay,"name":this.state.memberName},function (data) {
			this.setState({dataTab:data.map.costList});
           
		});
	},//行数选中回调函数
	lineNumber:function (obj) {
        var num = obj.key * 1;
		this.ajaxFn({"controlType":"query","pageSize":num,"pageNumber":this.state.pageNum,"startTime":this.state.sameMonth,"endTime":this.state.planDay,"name":this.refs.memberName.value},function (data) {
			this.setState({
				showLine:num,
				dataTab:data.map.costList,
			});
		});
	},//按时间范围搜索，回调函数
	searchTime:function(sd,ed){
        $("#loading").removeClass("none");
         this.setState({
         memberName:"",
         })
        this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":1,"startTime":sd,"endTime":ed},function (data) {
            data.map.count == "0" ? message.warning("暂无数据！") : message.success("加载完成！");
            this.setState({
            	dataTab:data.map.costList,
                dataLen:data.map.count,
                sameMonth:sd,
                planDay:ed,
                pageNum:1
            });
        })
	},//关键字搜索
    nameSearch:function (e) {
        var e = e || window.event;
        if((e && e.keyCode==13) || e.type == "click"){ // enter 键
            $("#loading").removeClass("none");
         
            var memberName = this.refs.memberName.value==""?"":this.refs.memberName.value.replace("，",",");
            this.ajaxFn({"controlType":"query","name":memberName,"pageSize":20,"pageNumber":1,"startTime":this.state.sameMonth,"endTime":this.state.planDay},function (data) {
                data.map.count == "0" ? message.warning("暂无相关数据！") : message.success("加载完成！");
                this.setState({
                    dataTab:data.map.costList,
                    dataLen:data.map.count,
                    pageNum:1,
                    memberName:memberName,
                });
            })
        }
    },	/*导出*/
    export(){
        this.ajaxFn({"controlType":"fileExport","startTime":this.state.sameMonth,"endTime":this.state.planDay},function (data) {
            if(data.map.filePath){
                message.success(data.map.msg);
                window.location.href = data.map.filePath;
            }else{
                message.warning(data.map.msg);
            }
        });
},/* 全选   */
allcheck:function(e){
if(e.target.checked == true){
                 $("#tyTable tr").each(function(){
                 $(this).find("td input").attr("data-checked","true")
                 $(this).find("td input").prop("checked",true);
                 var checkid= $(this).find("td input").attr("data-checkid");
                 if(isnull(checkid)!=""){
                  valArr.push(checkid);
                 }
                 })
                // checkarrs=valArr.toString();
                 this.setState({
                     checkarrs:valArr.toString()
                 })
               // isnull(this.props.checkid)!=""?this.props.checkid():"";
             
            }else{
               $("#tyTable tr").each(function(){
                 $(this).find("td input").attr("data-checked","false")
                 $(this).find("td input").prop("checked",false);
                 })
                //$("#mem-table .i-xz").attr("checked",false);
                valArr = [];
               // checkarrs=valArr.toString();
              this.setState({
                     checkarrs:valArr.toString()
                 })
            }
            
},/*  点击复选框  */
tocheck:function(e){
   
         if(e.target.dataset.checked == "true"){
               e.currentTarget.setAttribute("checked",false);
               e.currentTarget.dataset.checked="false"
               var checkid=e.currentTarget.dataset.checkid;
                 //valArr.remove(1);
               removeByValue(valArr, checkid);
               this.setState({
                     checkarrs:valArr.toString()
                 })
             //  this.tockecks(valArr.toString());
            }else{
                 e.currentTarget.setAttribute("checked",true);
                 e.currentTarget.dataset.checked="true"
                var checkid=e.currentTarget.dataset.checkid;
                if(isnull(checkid)!=""){
                  valArr.push(checkid);
                 }
                 this.setState({
                     checkarrs:valArr.toString()
                 })
                   //this.tockecks(valArr.toString());
            } 
    
},/* 复选全部清除  */
allclean:function(){
                $("#tyTable tr").each(function(){
                 $(this).find("td input").attr("data-checked","false")
                 $(this).find("td input").prop("checked",false);
                 })
                  $(".th-checkbox").prop("checked",false);
                 
                $("#mem-table .i-xz").attr("checked",false);
              this.setState({
                     checkarrs:"",
                })
               valArr=[];
        },

/*成本修改*/
    edit(e){
        var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
    },/* 显示多选修改弹窗   */
    ckecktip:function(){
    this.setState({checkVisible:true});
    },/*弹窗取消*/
    handleCancel(){
        this.refs.costPrice2.value="";
        this.refs.costPrice3.value="";
        this.setState({checkVisible:false,reset:Math.random()});
},/* 批量修改框值改变时执行  */
    handleChange:function(e){
    var vals=e.target.value;
    var key=e.target.dataset.tpyename
    console.log("value:"+vals+"keys:"+key);
    var reg=/^\d+(\.\d+)?$/
    if(vals ==""){
    this.setState({
        [key]:""
    })
    }
    if(vals !=""){
            if(!isNaN(vals)){
                this.setState({
                  [key]:vals
                   })
                return false;
            }else{
                e.target.value  = e.target.value.substring(0,(e.target.value.length-1));    /*如果不是数字就把这次输入的值截取掉*/
                message.warning('只能输入数字！');
            }
        }
    },/*修改确定*/
        editOk(){
        var costPrice2=this.state.costPrice2; //成本2
        var costPrice3=this.state.costPrice3;  //成本3
         if(costPrice2=="" && costPrice3==""){
         message.warning('成本2、成本3不能同时为空！');
         }else{
           this.setState({btnLoading:true},function(){
           this.ajaxFn({"controlType":"update","id":this.state.checkarrs,"costPrice2":this.state.costPrice2,"costPrice3":this.state.costPrice3},function (data) {
            message.success('修改成功了');
             location.reload();
           
            })
            
        });
         }
    },

	render:function(){
        var $this=this;
		return (
            <QueueAnim delay={200} >
                <div className="mb-title" key="1">成本管理</div>
                <div className="operation" id="operation" key="2">
                    <Dropdown
                        overlay={(
                            <Menu onClick={this.lineNumber}>
                                <Menu.Item key="10">10</Menu.Item>
                                <Menu.Item key="20">20</Menu.Item>
                                <Menu.Item key="50">50</Menu.Item>
                                <Menu.Item key="100">100</Menu.Item>
                            </Menu>)}
                    >
                        <Button type="ghost" style={{height:"34px",marginRight:"20px"}}>
                            {this.state.showLine} <Icon type="circle-o-down" />
                        </Button>
                    </Dropdown>
                    <DateRange size="large" showTime  searchTime={this.searchTime} />
                    <a href="javascript:void(0)" className="btn btn-search" onClick={this.export}>导出</a>
                    <div className="form-group fr mem-search">
                        <input type="text" style={{width:"225px"}} className="fl pl15" placeholder="搜索产品、供应商、客户、产品ID" ref="memberName" onKeyUp={this.nameSearch} />
                        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                    </div>
                </div>
                <div style={{height:"40px"}}>
               {this.state.checkarrs!=""?<div className="allupdate" onClick={this.ckecktip}>修改</div>:""}
               </div>
                <MemberTabel
                    key="3"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox","ID号/品名/规格","供应商","批次","成本价2","成本价3","批发价","调价次数","操作人","销售客户","开票价","销售成本价","零售价","成本价更改时间","操作"]}
                    dataKey={["goodsId/goodsName/goodstype","supplier","id","costPrice2","costPrice3","sellingPrice","modifyPrices","operatorName","customerName","unitprice","retailsCostPrice","retails","operatorTime"]}
                    controlArr={[{conId:2,conUrl:"modifyAdmini",conClass:"cleflo",callback:this.edit}]}
                    checkkey="id"
                    allcheck={this.allcheck}
                    tocheck={this.tocheck}
                    titlestyle={{
                        "styles3":{minWidth:"70px"},
                        "styles5":{minWidth:"40px"},
                        "styles6":{minWidth:"40px"},
                        "styles9":{minWidth:"70px"},
                        "styles10":{minWidth:"120px"},
                        }}
                />
             
                <div className="mem-footer row"  key="4">
                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                    <div className="col-md-11">
                        <Pagination current={this.state.pageNum} className="antd-page" showQuickJumper total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                    </div>
                </div>
                 {/*修改弹窗*/}
                <Modal title="批量修改成本价" visible={this.state.checkVisible} onOk={this.editOk} onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.editOk}>确定</Button>,
                    ]}
                >
            <div className="form-group form-inline stars">
                <label>成本价2：</label>
                <input   type="text"  className="form-control" ref="costPrice2" data-tpyename="costPrice2" onChange={this.handleChange} />
            </div>
            <div className="form-group form-inline stars">
                <label>成本价3：</label>
                <input   type="text"  className="form-control" ref="costPrice3" data-tpyename="costPrice3" onChange={this.handleChange} />
            </div>
                  
                   
                </Modal>
                
                <Loading loading={this.state.loading} />
            </QueueAnim>
		);
	}
});

var DateRange = React.createClass({
        getInitialState() {
            var sameMonth = sessionStorage.getItem("cost_startTime") ? sessionStorage.getItem("cost_startTime") : initDate(false);
            var planDay = sessionStorage.getItem("cost_endTime") ? sessionStorage.getItem("cost_endTime") : initDate();
            return {
                startValue:sameMonth,   /*前一个星期的日期*/
                endValue:planDay       /*当前日期*/
            };
        },
        onChange(field, value) {
            this.setState({
                [field]: value,
            });
        },
        onStartChange(value) {
            this.onChange('startValue', this.formatDate(value));
            sessionStorage.setItem("cost_startTime", this.formatDate(value));
        },
        onEndChange(value) {
            this.onChange('endValue', this.formatDate(value));
            sessionStorage.setItem("cost_endTime", this.formatDate(value));
        }, /*格式转换*/
        formatDate:function (date) {
            if(date !== null){
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                return year + "-" +(month > 9 ? (month + "") : ("0" + month))  + "-" + (day > 9 ? (day + "") : ("0" + day))+" 00:00:00";
            }else{
                message.warning('请先填写日期范围！');
                return "";
            }
        },
        searchTime:function () {
            var sd = this.state.startValue ;
            var ed = this.state.endValue ;
            this.props.searchTime(sd,ed);
        },
        render() {
            return (
                <div className="inlineBlock">
                    <DatePicker
                        placeholder="开始日期"
                        onChange={this.onStartChange}
                        defaultValue={this.state.startValue}
                    />
                    <span> ~ </span>
                    <DatePicker
                        placeholder="结束日期"
                        onChange={this.onEndChange}
                        defaultValue={this.state.endValue}
                    />
                    <button type="button" className="btn btn-search" onClick={this.searchTime}>搜索</button>
                </div>
            );
        }
    });




    function initDate(choice = true){
        if(choice){
            return CurrentTime();   //当前时间
        }else{
            return getYestoday();   //前一周时间
        }
        function CurrentTime(){
            var myDate = new Date();
            var year = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var dates = myDate.getDate();
            var currentDate = year + "-" + month + "-" + dates+" 00:00:00";
            return currentDate;
        }

        function getYestoday(){
            var d=new Date();
            var yesterday_milliseconds=d.getTime()-7000*60*60*24;
            var yesterday = new Date();
            yesterday.setTime(yesterday_milliseconds);
            var strYear = yesterday.getFullYear();
            var strDay = yesterday.getDate();
            var strMonth = yesterday.getMonth()+1;
            var datastr = strYear+"-"+(strMonth < 10 ? '0' + strMonth : strMonth )+"-"+(strDay < 10 ? '0' + strDay : strDay )+" 00:00:00";
            return datastr;
          }
    }
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

/*  删除数组特定值  */
function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}