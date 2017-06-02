
import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import Upload from 'antd/lib/upload'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import message from 'antd/lib/message'
import Card from 'antd/lib/card'
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
const confirm = Modal.confirm;
import '../../../less/tablePage.less'

var object = new Object();

/*通用表格页面*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/documents.do') {
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
                $this.setState({btnLoading:false});
            },
            error(){
                $this.setState({btnLoading:false});
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    getInitialState:function(){
        return {
            btnLoading:false,            /*按钮等待状态*/
            showLine: 12,   /*显示行数*/
            dataLen: 0,     /*总数据条数*/
            videos : [],     /*视频数据*/
            visible:false,    /*上传视频弹窗*/
            fileName:"",        /*文件名*/
            pageNum:1 ,          /*默认选中页数*/
            isupload:"false",     /*  是否有上传权限   */
         };
    },
    componentWillMount:function(){

        this.ajaxFn({"controlType":"query","documentType":3,"pageSize":12,"pageNumber":1,"category":""},function (data) {
            this.setState({
                videos:data.map.documentsList,
                dataLen:data.map.count,
               isupload:data.map.available
            });
        });

    },/*跳页*/
    pageNumber(page){
        this.setState({pageNum:page});
        this.ajaxFn({"controlType":"query","documentType":3,"pageSize":this.state.showLine,"pageNumber":page,"name":this.refs.memberName.value},function (data) {
            this.setState({videos:data.map.documentsList});
        });
    },//关键字搜索
    nameSearch:function (e) {
        var e = e || window.event;
        if((e && e.keyCode==13) || e.type == "click"){ // enter 键
            var memberName = this.refs.memberName.value;
            this.ajaxFn({"controlType":"query","documentType":3,"name":memberName,"pageSize":12,"pageNumber":1},function (data) {
                if(data.map.count == 0){
                    message.warning('没有相关视频!');
                }
                this.setState({
                    dataLen:data.map.count,
                    videos:data.map.documentsList,
                    pageNum:1
                });
            })
        }
    },/*打开上传视频弹窗*/
    upload(){
        this.setState({visible:true});
    },/*确定上传*/
    handleOk(){
        if(object.url && object.documentName && object.filePath){
            if(object.url.search(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/) == -1 ){
                object.url = "http://"+object.url;
            };
            this.setState({btnLoading:true});
            this.ajaxFn({"controlType":"add","documentType":3,"category":"","documentName":object.documentName,"url":object.url,"fileName":object.fileName,"filePath":object.filePath},function (data) {
                object = {};
                message.success(this.state.fileName+'上传成功。');
                this.setState({fileName:"",visible:false});
                /*重新渲染*/
                this.ajaxFn({"controlType":"query","documentType":3,"pageSize":12,"pageNumber":this.state.pageNum,"category":""},function (data) {
                    this.setState({
                        videos:data.map.documentsList,
                        dataLen:data.map.count
                    });
                });
            },'/otcdyanmic/documents.do');
        }else{
            message.warning('请填写内容或者上传封面！');
        }

    },/*取消弹框*/
    handleCancel(){
        this.setState({visible:false,fileName:""});
    },/*删除视频*/
    videoDelete(e){
        var $this = this;
        var keepVal = $(e.target).attr("value");
        confirm({
            title: '您是否确认要删除这项内容?',
            content: '',
            onOk() {
                $this.ajaxFn({"controlType":"delete","id":JSON.parse(keepVal).id},function(data){
                    message.success("删除视频成功！");
                    this.ajaxFn({"controlType":"query","documentType":3,"pageSize":12,"pageNumber":this.state.pageNum,"category":""},function (data) {
                        this.setState({
                            videos:data.map.documentsList,
                            dataLen:data.map.count
                        });
                    });
                })
            },
            onCancel() {},
        });
    },
    render:function(){
        var $this = this;
        const props = {
            action: '/otcdyanmic/fileUpload.do',
            listType: 'text',
            beforeUpload(info){ //上传前的事件，返回false 就覆盖onChange
                if(info.size >= 5242880){
                    message.warning("图片过大，请选择小于5MB的图片！");
                    return false;
                }
                console.log(info.type);
                if(info.type.split("/")[0]!="image"){
                  message.warning("不支持的上传格式！");
                  return false;
                }
            },/*上传状态回调*/
            onChange(info){
                if (info.fileList.length >= 2) {
                    info.fileList = info.fileList.splice(0, 1);
                }
                if(info.file.status == "done"){
                    object.fileName = info.file.name;
                    object.filePath = info.file.response.map.data[0].filePath;
                }
            }
        };

        return (
            <QueueAnim className="home-body">

                <div className="chart-body" key="1">
                    <div className="row chart-head p-l-r">
                        <div className="col-md-6">
                            <span className="chart-title">视频共享</span>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group fr mem-search mt6">
                                <input type="text" className="fl pl15" placeholder="搜索视频名称" ref="memberName" onKeyUp={this.nameSearch} />
                                <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                            </div>
                            {this.state.isupload=="true"? <a href="javascript:void(0)" className="btn btn-add fr" onClick={this.upload} style={{"margin":"6px 15px 0 0"}}>上传视频</a>:""}
                           
                        </div>
                    </div>
                    <div className="row mt15 p-l-r">
                        {this.state.videos.map(function (data,i) {
                            return (
                                <div key={i} className="col-md-3 mt10">
                                    <Card title={data.documentName} style={{"height":"325px"}} extra={<Icon value={JSON.stringify(data)} onClick={$this.videoDelete} style={{"fontSize": "16px","cursor":"pointer"}} title="删除" type="delete" />} >
                                        <a target="_blank" href={data.url}>
                                            <img src={data.tumbnailsUrl} alt={data.documentName} width="100%" height="227px"/>
                                        </a>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mem-footer col-md-12 mt20 mb10">
                        <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                        <div className="col-md-11">
                            <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                        </div>
                    </div>

                </div>
                <Modal title="上传视频" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.handleOk}>确定</Button>,
                    ]}
                >
                    <div className="row">
                        <div className="col-md-12"><AddIdInput tle="视频名称" typeName="documentName" /></div>
                        <div className="col-md-12"><AddIdInput tle="视频链接地址" typeName="url" /></div>
                        <div className="col-md-6 col-md-offset-4 mt15">
                            <Upload {...props}>
                                <Button type="ghost">
                                    <Icon type="upload"/>选择上传封面图片
                                </Button>
                            </Upload>
                        </div>
                    </div>
                </Modal>
            </QueueAnim>
        );
    }
});







/*弹窗新增input*/
var AddIdInput = React.createClass({
    changeVal(e){
        object[this.props.typeName] = e.target.value;
    },
    render(){
        return (
            <div className="AddIdInput mt15">
                <label>{this.props.tle}</label>
                <input type="text" className="form-control" onChange={this.changeVal} />
            </div>
        );
    }
});
