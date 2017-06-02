import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import Icon from 'antd/lib/icon'                    /*antd 图标*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import message from 'antd/lib/message'              /*antd 提示组件*/
import Upload from 'antd/lib/upload'
import Button from 'antd/lib/button'
import Select from 'antd/lib/select';                                           /*antd select*/
const Option = Select.Option;
import Tabs from 'antd/lib/tabs';                   /*tabs 组件*/
const TabPane = Tabs.TabPane;
import Popconfirm from 'antd/lib/popconfirm'            /*antd 气泡确认*/
import Popover from 'antd/lib/popover';                 /*气泡卡片*/
import Input from 'antd/lib/Input'      /*antd input*/
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import QueueAnim from 'rc-queue-anim';         /*antd 进出场动画*/
import '../../../less/tablePage.less'

var object = new Object();
var editObj = new Object();
/*通用表格页面*/
export default React.createClass({
    /*ajax 封装*/
    ajaxFn:function(returnData,callback,javaUrl = '/otcdyanmic/documents.do'){
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
            certificatesData : [],      /*证件图片*/
            activityData:[],            /*活动图片*/
            staffData:[],               /*员工图片*/
            showLine:20,	            /*显示行数*/
            dataLen:0,		            /*数据条数*/
            visible:false,              /*控制弹窗显示*/
            isShowLgImg:false,          /*是否显示大图*/
            dataImgSrc:'',              /*查看大图的图片路径*/
            editImgType:"0",            /*修改气泡卡片里面的select框默认值*/
            imgType:true,               /*上传里面的图片类目状态更新*/
            fileNmae:"",                /*文件名*/
            pageNum:1 ,                  /*页数选中*/
            isupload:"false",     /*  是否有上传权限   */

        };
    },
    componentDidMount:function(){
        /*获取证件图片数据*/
        this.ajaxFn({"controlType":"query","documentType":"2","category":"证书图片","pageSize":20,"pageNumber":1},function (data) {
            object.category = "证书图片";
            /*获取资料列表*/
            this.setState({
                certificatesData:data.map.documentsList,
                dataLen:data.map.count,
                isupload:data.map.available
            });
        });
    },/*跳页*/
    pageNumber(page){
        this.ajaxFn({"controlType":"query","documentType":"2","category":object.category,"pageSize":this.state.showLine,"pageNumber":page,"name":this.refs.memberName.value},function (data) {
            switch(object.category){
                case  ("证书图片"):
                    this.setState({
                        certificatesData:data.map.documentsList,
                        dataLen:data.map.count,
                        visible:false,
                        pageNum:page
                    });
                    break;
                case  ("宣传活动"):
                    this.setState({
                        activityData:data.map.documentsList,
                        dataLen:data.map.count,
                        visible:false,
                        pageNum:page
                    });
                    break;
                case ("员工风采"):
                    this.setState({
                        staffData:data.map.documentsList,
                        dataLen:data.map.count,
                        visible:false,
                        pageNum:page
                    });
                    break;
            }
        });
    },/*关键字搜索*/
    nameSearch:function (e) {
        var e = e || window.event;
        if((e && e.keyCode==13) || e.type == "click"){ // enter 键
            var memberName = this.refs.memberName.value;
            this.ajaxFn({"controlType":"query","documentType":"2","category":object.category,"name":memberName,"pageSize":20,"pageNumber":1},function (data) {
                if(data.map.count == 0){
                    message.warning('没有相关图片！');
                }
                switch(object.category){
                    case  ("证书图片"):
                        this.setState({
                            certificatesData:data.map.documentsList,
                            dataLen:data.map.count,
                            visible:false,
                            pageNum:1
                        });
                        break;
                    case  ("宣传活动"):
                        this.setState({
                            activityData:data.map.documentsList,
                            dataLen:data.map.count,
                            visible:false,
                            pageNum:1
                        });
                        break;
                    case ("员工风采"):
                        this.setState({
                            staffData:data.map.documentsList,
                            dataLen:data.map.count,
                            visible:false,
                            pageNum:1
                        });
                        break;
                }
            })
        }
    },/*打开弹窗*/
    onUpload(){
        var mark = !this.state.imgType;
        this.setState({
            visible:true,
            imgType:mark,
            fileNmae:""
        });
    },/*取消关闭*/
    handleCancel(){
        this.setState({
            visible:false,
            isShowLgImg:false
        });
    },/*点击删除缓存数据*/
    delete(e){
        var currentData = $(e.target).parents("div").attr("data");
        sessionStorage.setItem("TK_strData",currentData);
    },/*确定删除*/
    confirm(){
        var strData = sessionStorage.getItem("TK_strData");
        var DataId = JSON.parse(strData).id;
        this.ajaxFn({"controlType":"delete","id":DataId},function (data) {
            message.success(`删除成功!`);
            /*重新渲染列表*/
            this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":this.state.pageNum,"documentType":"2","category":JSON.parse(strData).category},function (data) {
                switch(JSON.parse(strData).category){
                    case  ("证书图片"):
                        this.setState({
                            certificatesData:data.map.documentsList,
                            dataLen:data.map.count
                        });
                        break;
                    case  ("宣传活动"):
                        this.setState({
                            activityData:data.map.documentsList,
                            dataLen:data.map.count
                        });
                        break;
                    case ("员工风采"):
                        this.setState({
                            staffData:data.map.documentsList,
                            dataLen:data.map.count
                        });
                        break;
                }
            });
        });
    },/*选中tabs*/
    tabsOn(value){
        object.category = value;
        this.ajaxFn({"controlType":"query","documentType":"2","category":value,"pageSize":20,"pageNumber":1},function (data) {
            switch(value){
                case  ("证书图片"):
                    this.setState({
                        certificatesData:data.map.documentsList,
                        dataLen:data.map.count,
                        pageNum:1
                    });
                    break;
                case  ("宣传活动"):
                    this.setState({
                        activityData:data.map.documentsList,
                        dataLen:data.map.count,
                        pageNum:1
                    });
                    break;
                case ("员工风采"):
                    this.setState({
                        staffData:data.map.documentsList,
                        dataLen:data.map.count,
                        pageNum:1
                    });
                    break;
            }
        });
    },/*点击修改图片缓存数据*/
    edit(e){
        var currentData = $(e.target).parents("div").attr("data");
        sessionStorage.setItem("TK_strData",currentData);
    }, /*关闭气泡后修改图片信息*/
    offEdit(status){
        var $this = this;
        /*气泡关闭才能进*/
        if(!status){
            /*需要延迟一会执行，因为选择框数据没有赋上去*/
            setTimeout(function () {
                /*判断修改对象里面有值才能进*/
                if((editObj.documentName != "" && editObj.documentName != undefined) || (editObj.category != "" && editObj.category != undefined )){
                    var strData = sessionStorage.getItem("TK_strData");
                    var DataId = JSON.parse(strData).id;
                    $this.ajaxFn({"controlType":"update","id":DataId,"documentName":editObj.documentName,"category":editObj.category},function (data) {
                        editObj = {};
                        $("#editInput").val("");
                        this.setState({editImgType:"0"});
                        message.success(`编辑成功!`);
                        /*重新渲染列表*/
                        this.ajaxFn({"controlType":"query","pageSize":20,"pageNumber":this.state.pageNum,"documentType":"2","category":JSON.parse(strData).category},function (data) {
                            switch(JSON.parse(strData).category){
                                case  ("证书图片"):
                                    this.setState({
                                        certificatesData:data.map.documentsList,
                                        dataLen:data.map.count
                                    });
                                    break;
                                case  ("宣传活动"):
                                    this.setState({
                                        activityData:data.map.documentsList,
                                        dataLen:data.map.count
                                    });
                                    break;
                                case ("员工风采"):
                                    this.setState({
                                        staffData:data.map.documentsList,
                                        dataLen:data.map.count
                                    });
                                    break;
                            }
                        });
                    });
                }
            },500);
        }
    },/*修改图片名称*/
    editInput(e){
        editObj.documentName = e.target.value;
    },/*修改图片类型*/
    editType(value){
        if(value == "0"){
            return false
        }else{
            editObj.category = value;
            this.setState({editImgType:value});
        }
        console.log(editObj.category);
    },/*显示大图*/
    showLgImg(e){
        var imgData = e.currentTarget.nextElementSibling.getAttribute("data");
        var imgUrl = JSON.parse(imgData).url;
        this.setState({
            dataImgSrc:imgUrl,
            isShowLgImg:true
        });
    },/*确定上传*/
    handleOk(){
        if(object.typeImg){
            this.setState({btnLoading:true});
            this.ajaxFn({"controlType":"add","documentType":2,"fileName":object.fileName,"filePath":object.filePath ,"category":object.typeImg},function (data) {
                message.success(object.fileName+'上传成功。');
                var mark = !this.state.imgType;
                this.setState({imgType:mark,fileNmae:""});
                /*重新渲染*/
                this.ajaxFn({"controlType":"query","documentType":"2","category":object.typeImg,"pageSize":20,"pageNumber":this.state.pageNum},function (data) {
                    switch(object.typeImg){
                        case  ("证书图片"):
                            this.setState({
                                certificatesData:data.map.documentsList,
                                dataLen:data.map.count,
                                visible:false
                            });
                            break;
                        case  ("宣传活动"):
                            this.setState({
                                activityData:data.map.documentsList,
                                dataLen:data.map.count,
                                visible:false
                            });
                            break;
                        case ("员工风采"):
                            this.setState({
                                staffData:data.map.documentsList,
                                dataLen:data.map.count,
                                visible:false
                            });
                            break;
                    }
                    object = {};
                });
            },'/otcdyanmic/documents.do');
        }else{
            message.warning("请先选择图片类目！",2.5);
            return false;
        }
    },
    render:function(){
        var $this = this;
        const props = {
            action: '/otcdyanmic/fileUpload.do',
            listType: 'text',
            multiple:true,
            supportServerRender:true,
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
               
            },
            
            /*上传状态回调*/
            onChange(info){
                $this.setState({ fileList:info.fileList});
                if (info.fileList.length >= 2) {
                   // info.fileList = info.fileList.splice(0, 1);
                }
                

                
                if(info.file.status !== 'uploading'){
                    var fileList=info.fileList

                    var fileName="";
                    var filePath="";
                    
                    fileList.map(function (data, i) {
                       

                        
                        if(i==fileList.length-1){
                          fileName+=data.name
                           if(data.response!="" && data.response!=undefined && data.response!=null ){
                           filePath+=data.response.map.data[0].filePath;
                           
                           }
                        }
                        else{
                        fileName+=data.name+","
                        if(data.response!="" && data.response!=undefined && data.response!=null ){
                        filePath+=data.response.map.data[0].filePath+","
                        }
                        }
                        
                        
                    })
                     console.log("fileName:"+fileName);
                     console.log("filePath:"+filePath);
                     
                    object.fileName = fileName;
                    object.filePath = filePath;
                }
            },
           
            
        };


        /*图片修改*/
        const editContent = (
            <div>
                <Row>
                    <Col span={6}>
                        <label>图片名：</label>
                    </Col>
                    <Col span={18}>
                        <Input id="editInput" placeholder="修改图片名"  style={{ width:216}} onChange={this.editInput} />
                    </Col>
                </Row>
                <Row className="mt10">
                    <Col span={6}>
                        <label>图片类目：</label>
                    </Col>
                    <Col span={18}>
                        <Select value={this.state.editImgType} style={{ width:216}} onChange={this.editType} >
                            <Option value="0" >请选择修改图片类目</Option>
                            <Option value="证书图片" >证书图片</Option>
                            <Option value="宣传活动" >宣传活动</Option>
                            <Option value="员工风采" >员工风采</Option>
                        </Select>
                    </Col>
                </Row>
            </div>
        );

        return (
            <QueueAnim className="home-body">
                <div className="row chart-body" key="1">
                    <div className="col-md-12 chart-head">
                        <div className="col-md-6">
                            <span className="chart-title">图片管理</span>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group fr mem-search mt6">
                                <input type="text" className="fl pl15" placeholder="搜索图片名称" ref="memberName" onKeyUp={this.nameSearch} />
                                <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                            </div>
                             {this.state.isupload=="true"? <a href="javascript:void(0)" className="btn btn-add fr" onClick={this.onUpload} style={{"margin":"6px 15px 0 0"}}>上传图片</a>:""}
                           
                        </div>
                    </div>
                    <div className="col-md-12">
                        <Tabs defaultActiveKey="证书图片" onChange={this.tabsOn}>
                            <TabPane tab="证书图片" key="证书图片">
                                <div className="row">
                                    {this.state.certificatesData.map(function (data,i) {
                                        var $data = JSON.stringify(data);
                                        return (
                                            <div key={"img"+i} className="col-md-3 mt10">
                                                <div className="data-i-box">
                                                    <p className="data-i-name"  >{data.documentName}</p>
                                                    <div className="data-i-img" onClick={$this.showLgImg}><img src={data.tumbnailsUrl} alt="" width={"100%"} height={"100%"}/></div>
                                                    <div className="data-i-operation" data={$data}>
                                                        <Popover content={editContent} title="编辑图片" trigger="click" onVisibleChange={$this.offEdit}>
                                                            <span className="oper-edit" onClick={$this.edit}><i></i>编辑</span>
                                                        </Popover>
                                                        <Popconfirm title="确定删除该图片吗？" onConfirm={$this.confirm} onCancel={$this.cancel} >
                                                            <span className="oper-remove" onClick={$this.delete}><i></i>删除</span>
                                                        </Popconfirm>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mem-footer row mt20 mb10">
                                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                                    <div className="col-md-11">
                                        <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="宣传活动" key="宣传活动">
                                <div className="row">
                                    {this.state.activityData.map(function (data,i) {
                                        var $data = JSON.stringify(data);
                                        return (
                                            <div key={"img"+i} className="col-md-3 mt10">
                                                <div className="data-i-box">
                                                    <p className="data-i-name"  >{data.documentName}</p>
                                                    <div className="data-i-img" onClick={$this.showLgImg}><img src={data.tumbnailsUrl} alt="" width={"100%"} height={"100%"}/></div>
                                                    <div className="data-i-operation" data={$data}>
                                                        <Popover content={editContent} title="编辑图片" trigger="click" onVisibleChange={$this.offEdit}>
                                                            <span className="oper-edit" onClick={$this.edit}><i></i>编辑</span>
                                                        </Popover>
                                                        <Popconfirm title="确定删除该图片吗？" onConfirm={$this.confirm} onCancel={$this.cancel} >
                                                            <span className="oper-remove" onClick={$this.delete}><i></i>删除</span>
                                                        </Popconfirm>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mem-footer row mt20 mb10">
                                    <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
                                    <div className="col-md-11">
                                        <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
                                    </div>
                                </div>
                            </TabPane>
                            <TabPane tab="员工风采" key="员工风采">
                                <div className="row">
                                    {this.state.staffData.map(function (data,i) {
                                        var $data = JSON.stringify(data);
                                        return (
                                            <div key={"img"+i} className="col-md-3 mt10">
                                                <div className="data-i-box">
                                                    <p className="data-i-name" >{data.documentName}</p>
                                                    <div className="data-i-img" onClick={$this.showLgImg}><img src={data.tumbnailsUrl} alt="" width={"100%"} height={"100%"}/></div>
                                                    <div className="data-i-operation" data={$data}>
                                                        <Popover content={editContent} title="编辑图片" trigger="click" onVisibleChange={$this.offEdit}>
                                                            <span className="oper-edit" onClick={$this.edit}><i></i>编辑</span>
                                                        </Popover>
                                                        <Popconfirm title="确定删除该图片吗？" onConfirm={$this.confirm} onCancel={$this.cancel} >
                                                            <span className="oper-remove" onClick={$this.delete}><i></i>删除</span>
                                                        </Popconfirm>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mem-footer row mb10 p-l-r">
                                    <div className="col-sm-12 col-lg-1">共<span>{this.state.dataLen}</span>条</div>
                                    <div className="col-sm-12 col-lg-11">
                                        <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}/>
                                    </div>
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>

                    <Modal title="上传图片" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
                            <Button key="submit" type="primary" size="large" loading={this.state.btnLoading} onClick={this.handleOk}>确定</Button>,
                        ]}
                    >
                        <div className="row">
                            <div className="col-md-12"><AddSelect tle="图片类目"  typeName="typeImg" key={this.state.imgType} /></div>
                            <p className="text-center">支持png,jpg,gif图片格式</p>
                            <div className="col-md-6 col-md-offset-4 mt15">
                                <Upload {...props}>
                                    <Button type="ghost">
                                        <Icon type="upload"/>选择上传图片
                                    </Button>
                                </Upload>
                            </div>
                        </div>
                    </Modal>

                    <Modal visible={this.state.isShowLgImg} footer={null} onCancel={this.handleCancel} width={960}>
                        <img alt="" src={this.state.dataImgSrc} />
                    </Modal>
                </div>
            </QueueAnim>

        );
    }
});


/*弹窗新增上的select*/
var AddSelect = React.createClass({
    handleChange:function (value) {
        object[this.props.typeName] = value;
    },
    render:function(){
        return (
            <div className="entrySelect">
                <label>{this.props.tle}</label>
                <Select
                    showSearch
                    size="large"
                    style={{ width: 419 }}
                    optionFilterProp="children"
                    placeholder="请选择图片类目"
                    onChange={this.handleChange}
                >
                    <Option value="证书图片" >证书图片</Option>
                    <Option value="宣传活动" >宣传活动</Option>
                    <Option value="员工风采" >员工风采</Option>
                </Select>
            </div>
        );
    }
});


/*检测对象是否是空对象(不包含任何可读属性)*/
function isEmpty(obj){
    for (var name in obj){
        return false;
    }
    return true;
};
