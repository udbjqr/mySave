import React from 'react'
import Loading from '../react-utils/loading'         /*加载中组件*/
import MemberTabel from  '../react-utils/table.js'  /*表格组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';                /*antd 提示组件*/
import QueueAnim from 'rc-queue-anim';              /*antd 进出场动画*/
import Pagination from 'antd/lib/pagination';                  /*分页组件*/

export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/goods.do') {
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
    getInitialState(){
    var getstrDatas=sessionStorage.getItem("TK_strData");//从缓存获取数据
        return {
            dataTab:[],              /*表格数据*/
            showLine: 20,       /*显示行数*/
            pageNum:1,          /*页码默认选中值*/
            dataLen: 0,         /*数据条数*/
            getstrData:getstrDatas  //从缓存获取数据
        }
    },
    componentDidMount:function(){
         console.log("employeeName:"+JSON.parse(this.state.getstrData).employeeName+";getstrData:"+this.state.getstrData)
       
        /*获取列表数据*/
         this.getlist(this.state.pageNum);
        

    },/*获取列表数据ajax*/
    getlist:function(page){
      var getstrData=this.state.getstrData;
        this.ajaxFn({"controlType":"educateKPIScoreDetail","pageSize":this.state.showLine,"pageNumber":page,"time":JSON.parse(getstrData).time,"employee_id":JSON.parse(getstrData).employee_id},function (data) {
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count,
                pageNum:page
            });
        },"/otcdyanmic/appraisalUser.do");
    },/*跳页*/
    pageNumber:function(page){
      this.getlist(page);
    },/*导出*/
    export(){
         var getstrData=this.state.getstrData;
        this.ajaxFn({"controlType":"exportKPIScoreDetail","exportType":"educateKPIScoreDetail","time":JSON.parse(getstrData).time,"employee_id":JSON.parse(getstrData).employee_id},function (data) {
            if(data.map.filePath){
                message.success(data.map.msg);
                window.location.href = data.map.filePath;
            }else{
                message.warning(data.map.msg);
            }
        },"/otcdyanmic/appraisalUser.do");
    },
    render(){
        return (
            <QueueAnim>
                <div className="operation" key="3">
                    <a href="javascript:void(0)" className="btn btn-search" onClick={this.export}>导出</a>
                    { /*<a href="javascript:void(0)" className="btn btn-add" onClick={this.addId}><span className="icon-add"></span>导出</a>*/}
                </div>
                <MemberTabel
                    key="4"
                    tableStyle="checkbox"
                    dataTable={this.state.dataTab}
                    titleName={["checkbox","资料名称","要求播放次数","实际播放次数","要求比值","实际比值"]}
                    dataKey={["document_name","require_play_number","play_number","require_ratio","actual_ratio"]}
                />
                 <div className="mem-footer row" key="5">
                   <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                   <div className="col-md-11">
                       <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine}  onChange={this.pageNumber}  />
                   </div>
                   </div>
            </QueueAnim>
        );
    }
});
