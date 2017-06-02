import React from 'react'
import Modal from 'antd/lib/modal'/*antd 弹窗组件*/
import message from 'antd/lib/message'/*antd 提示组件*/
import Upload from 'antd/lib/upload'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Popconfirm from 'antd/lib/popconfirm'/*antd 气泡确认*/
import QueueAnim from 'rc-queue-anim';/*antd 进出场动画*/
import Pagination from 'antd/lib/pagination';/*antd 分页组件*/
import '../../../less/tablePage.less'

var object = new Object();

export default React.createClass({
    /*ajax 封装*/
    ajaxFn: function (returnData, callback, javaUrl = '/otcdyanmic/documents.do') {
        var $this = this;
        $.ajax({
            type: "post",
            url: javaUrl,
            data: {paramMap: JSON.stringify(returnData)},
            dataType: "json",
            async:false,	//false 表示ajax执行完成之后在执行后面的代码
            success: function (data) {
                if (!data.success) {/*首先判断这个属性，错误在判断原因*/
                    switch (data.errorCode) {
                        case  (1):
                            Modal.warning({
                                title: '警告提示：', content: '获取当前登录用户信息失败，请重新登录！', onOk() {
                                    window.location.href = 'login.html';
                                }
                            });
                            break;
                        case  (2):
                            Modal.warning({title: '警告提示：', content: '此用户不存在或已禁用，请联系管理员！'});
                            break;
                        case  (3):
                            Modal.error({title: '错误提示：', content: '发生严重错误，请联系管理员！！'});
                            break;
                        case  (4):
                            Modal.error({title: '错误提示：', content: '发生严重错误，请联系管理员！！'});
                            break;
                        case  (5):
                            Modal.warning({title: '警告提示：', content: '当前用户没有此操作权限！'});
                            break;
                        case  (8):
                            Modal.warning({title: '警告提示：',content: '相关数据格式有误，请检查后重新填写！'});
                            break;
                        case  (9):
                            Modal.info({title: '提示：',content: '相关数据未填写完整，请检查！'});
                            break;
                        default:
                            Modal.warning({title: '警告提示：', content: data.msg});
                            break;
                    }
                }else{
                    callback.call($this, data);
                }
                $this.setState({loading:false});
            },
            error(){
                $this.setState({loading:false});
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    getInitialState: function () {
        return {
            visible: false,     /*上传视频弹窗*/
            dataTab: [],
            showLine: 10,       /*显示行数*/
            dataLen: 0,         /*数据条数*/
            loading:false,      /*等待*/
            pageNum:1,           /*默认页数*/
            isupload:"false",     /*  是否有上传权限   */
        };
    },
    componentDidMount: function () {
        /*进入时初始化*/
        this.ajaxFn({
            "controlType": "query",
            "pageSize": 10,
            "pageNumber": 1,
            "documentType": "1",
            "category": ""
        }, function (data) {
            /*获取资料列表*/
            this.setState({
                dataTab: data.map.documentsList,
                dataLen: data.map.count,
                isupload:data.map.available
            });
        });
         
    }, /*跳页*/
    pageNumber(page){
        this.ajaxFn({"controlType": "query","documentType": "1", "pageSize": 10, "pageNumber": page,"category": "","name":this.refs.memberName.value}, function (data) {
            this.setState({dataTab: data.map.documentsList,pageNum:page});
        });
    }, /*关键字搜索*/
    nameSearch: function (e) {
        var e = e || window.event;
        if((e && e.keyCode==13) || e.type == "click"){ // enter 键
            var memberName = this.refs.memberName.value;
            this.ajaxFn({
                "controlType": "query",
                "documentType": "1",
                "category": "",
                "name": memberName,
                "pageSize": 10,
                "pageNumber": 1
            }, function (data) {
                if (data.map.count == "0"){
                    message.warning('没有相关的文件！');
                    return false;
                }
                this.setState({
                    dataLen: data.map.count,
                    dataTab: data.map.documentsList,
                    pageNum:1
                });
            });
        };
    }, /*打开上传视频弹窗*/
    upload(){
        if(this.state.isupload){
          this.setState({visible: true});
        }else{
         Modal.warning({title: '警告提示：',content: '此用户没有上传权限！'});   
        }
       
    }, /*取消弹框*/
    handleCancel(){
        object = {};
        this.setState({visible: false});
    }, /*点击删除时缓存数据*/
    delete(e){
        var currentData = $(e.target).parents("td").attr("data");
        sessionStorage.setItem("TK_strData", currentData);
    }, /*删除文件*/
    confirm(){
        var strData = sessionStorage.getItem("TK_strData");
        var DataId = JSON.parse(strData).id;
        this.ajaxFn({"controlType": "delete", "id": DataId}, function (data) {
            message.success(`删除成功!`);
            /*重新渲染列表*/
            this.ajaxFn({
                "controlType": "query",
                "pageSize": 10,
                "pageNumber": 1,
                "documentType": "1",
                "category": ""
            }, function (data) {
                /*获取资料列表*/
                this.setState({
                    dataTab: data.map.documentsList,
                    dataLen: data.map.count
                });
            });
        });
    },/*下载*/
    download(e){
        var currentData = $(e.target).parents("td").attr("data");
        this.ajaxFn({"controlType":"load", "id":JSON.parse(currentData).id},function (data) {
            window.location.href = data.map.document.url;
        })
    },/*查看*/
    see(e){
        var currentData = $(e.target).parents("td").attr("data");
        sessionStorage.setItem("TK_dataManage",currentData);
    },/*确定上传*/
    handleOk(){
        if(object.filePath){
            this.setState({loading:true});
            this.ajaxFn({"controlType": "add","documentType": 1,"fileName":object.fileName,"filePath":object.filePath}, function (data) {
                message.success(object.fileName + '上传成功。');
                object = {};
                /*重新渲染列表*/
                this.ajaxFn({"controlType": "query","pageSize": 10,"pageNumber": 1, "documentType": "1", "category": ""}, function (data) {
                    this.setState({
                        dataTab: data.map.documentsList,
                        dataLen: data.map.count,
                        visible: false,
                        loading:false
                    });
                });
            }, '/otcdyanmic/documents.do');
        }else{
            message.warning('请选择上传文件！');
        }
    },
    render: function () {
        var $this = this;
        const props = {
            action: '/otcdyanmic/fileUpload.do',
            listType: 'text',
            beforeUpload(info){ //上传前的事件，返回false 就覆盖onChange
                if(info.size >= 10485760){
                    message.warning("文件过大，请选择小于10MB的文件！");
                    return false;
                }
                 console.log(info.name.indexOf("."))
                 if(info.name.indexOf(".")=="-1"){
                      message.warning("文件格式不支持！");
                    return false;
                 }else{
                  var namesaar=info.name.split(".")
                  var names=namesaar[namesaar.length-1].toLowerCase()
                  console.log(namesaar.length+";"+names);
                  //ppt,pptx,,pdf,doc,xlsx,xls,html,docx
                  if(names!="ppt" && names!="pptx" && names!="pdf" && names!="doc" && names!="xlsx" && names!="xls"  && names!="html" && names!="docx" && names!=""){
                   message.warning("文件格式不支持！");
                    return false;
                  }
                 }
                
                   
                  
            },/*上传状态回调*/
            onChange(info){
                if (info.fileList.length >= 2) {
                    info.fileList = info.fileList.splice(0, 1);
                }
                if(info.file.status == "done"){
                    console.log(info);
                    console.log(info.file.response.map.data[0].filePath);
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
            <span className="chart-title">文件管理</span>
            </div>
            <div className="col-md-6">
            <div className="form-group fr mem-search mt6">
            <input type="text" className="fl pl15" placeholder="搜索文件名" ref="memberName" onKeyUp={this.nameSearch} />
        <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
        </div>
        
       {this.state.isupload=="true"?<a href="javascript:void(0)" onClick={this.upload} className="btn btn-add fr mt10" style={{"margin":"6px 15px 0 0"}} >上传文件</a>:""}
        </div>
        </div>

        <div className="col-md-12">
            <table className="table manageTable">
            <thead>
            <tr>
            <th>文件名</th>
            <th>文件大小</th>
            <th>上传时间</th>
            <th>上传人</th>
            <th>下载次数</th>
            <th>操作</th>
            </tr>
            </thead>
            <tbody>
            {this.state.dataTab.map(function (data, i) {
                var $data = JSON.stringify(data);
                return (
                    <tr key={i + "data"}>
                    <td>
                    <img src={data.tumbnailsUrl} alt="" width="50" height="50" style={{"margin":"0 25px 0 15px","float":"left"}}/>
                <span>{data.documentName}</span>
                </td>
                <td>{data.downloadSize}</td>
                <td>{data.updateTime}</td>
                <td>{data.uploadEmployee}</td>
                <td>{data.downloadNumber}</td>
                <td className="last-td" data={$data}>
                    <Popconfirm title="确定删除该文件吗？" onConfirm={$this.confirm}
                onCancel={$this.cancel}>
                <div key="delete" className="data-icon" title="删除"
                onClick={$this.delete}><a href="javascript:void(0)"><img
                src="images/remove.png" alt="删除"/></a></div>
                    </Popconfirm>
                    <div key="download" className="data-icon" title="下载">
                    <a href="javascript:void(0)" onClick={$this.download}><img src="images/upload.png" alt="下载"/></a>
                    </div>
                    <div key="see" className="data-icon" title="查看">
                    <a href="#propagandaPpt" onClick={$this.see} ><img src="images/see.png" alt="查看"/></a>
                    </div>
                    </td>
                    </tr>
                );
            })}
        </tbody>
        </table>
        </div>
        <div className="mem-footer row mb10 p-l-r">
            <div className="col-sm-12 col-lg-1">共<span>{this.state.dataLen}</span>条</div>
        <div className="col-sm-12 col-lg-11">
            <Pagination className="antd-page" showQuickJumper current={this.state.pageNum}
        total={this.state.dataLen} pageSize={this.state.showLine}
        onChange={this.pageNumber}/>
        </div>
        </div>
        </div>
        <Modal title="上传文件" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}
        footer={[
            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
        <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
        确定
        </Button>
        ]}
        >
        <div className="row">
            <p className="text-center">支持ppt,pptx,,pdf,doc,xlsx,xls,html,docx类型文件</p>
        <div className="col-md-6 col-md-offset-4 mt15">
            <Upload {...props}>
        <Button type="ghost">
            <Icon type="upload"/>选择上传资料
            </Button>
            </Upload>
            </div>
            </div>
            </Modal>
            </QueueAnim>

        );
    }
});
