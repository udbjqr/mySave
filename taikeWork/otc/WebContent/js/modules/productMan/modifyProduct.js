import React from 'react'
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Upload from 'antd/lib/upload';
import Icon from 'antd/lib/icon';
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import '../../../less/addInformation.less';
import message from 'antd/lib/message';






var object =new Object();
/*说明组件*/
var DrugInstructions ="<div>"+
    "                <p class='text-tle'>【药品名称】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【药品成分】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【药品性状】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【功能主治】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【药品规格】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【用法用量】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【不良反应】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【药品禁忌】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【注意事项】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【相互作用】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【药品储藏】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【包装】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【有效期】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【批准文号】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "                <p class='text-tle'>【生产企业】</p>"+
    "                <div contentEditable='true' class='text-s-r'></div>"+
    "            </div>";

/*新增会员*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/goods.do') {
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
            isError:{},              /*错误信息*/
            priviewVisible: false,   /*antd 弹窗显示*/
            modalSrc: '',        /*弹窗图片URL*/
            productObj:{},            /*产品详情*/
            suppliers:[],            /*供应商初始数据*/
            imgArr:[],               /*图片集合*/
            productId:''                /*当前的产品ID*/
        }
    },
    componentWillMount:function(){

        var strData = sessionStorage.getItem("TK_strData");
        var productId = JSON.parse(strData).id;
      
        /*进入时请求产品详情*/
        this.ajaxFn({"controlType":"load","id":productId},function (data) {
          
            var defaultImg = [];
            if(data.map.goods.imageURL){
               // alert(JSON.parse(JSON.stringify(data.map.goods)));
                var imageURL=JSON.parse(JSON.stringify(data.map.goods));
                data.map.goods.imageURL.split(";").forEach(function(obj,i){
                    
                    if(obj){
                        //alert("obj3:"+obj)
                        var imgObj = {}
                        imgObj.uid = i;
                        imgObj.thumbUrl = obj.replace("otc","otcdyanmic");
                        imgObj.url = obj.replace("otc","otcdyanmic");
                        imgObj.name = '';
                        imgObj.status = 'done';
                        defaultImg.push(imgObj);
                    }
                });
            };
            this.setState({
                productId:productId,
                productObj:data.map.goods,
                manualObj:data.map.goods.manual,
                imgArr:defaultImg
            });
        });

        /*获取供应商数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({suppliers:data.map.list});
        },'/otcdyanmic/supplier.do');

    },
    componentDidMount(){
        if(this.state.manualObj == ""){
            this.refs.manual.innerHTML = DrugInstructions;
        }else{
            this.refs.manual.innerHTML = this.state.manualObj;
        }
    }, //提交
    submit:function () {
        object.id = this.state.productId;                     /*当前修改数据的ID*/
        object.controlType = "update";      /*操作类型*/
        object.manual = this.refs.manual.innerHTML; /*药品说明书内容*/
        this.ajaxFn(object,function(data){
            object = {};
            message.success("修改产品成功！");
            window.location.href = 'index.html#/productList';
        })
    },/*控制弹窗显示*/
    handleCancel() {
        this.setState({
            priviewVisible: false,
        });
    },/*返回*/
    out(){
        window.location.href = 'index.html#/productList';
    },
    render:function(){

        var $this = this;
        const props = {
            action: '/otcdyanmic/fileUpload.do',
            listType: 'picture-card',
            defaultFileList:$this.state.imgArr,
            beforeUpload(info){ //上传前的事件，返回false 就覆盖onChange
                if(info.size >= 1048576){
                    message.warning("图片过大，请选择小于1MB的图片！");
                    return false;
                }
            },/*文件点击链接*/
            onPreview: (file) => {
                console.log(file);
                $this.setState({
                    modalSrc: file.url,
                    priviewVisible: true,
                });
            },/*上传状态回调*/
            onChange(info){
                var mark = null;
                var deneUrl = "";   /*新增后返回图片的路径*/
                if(info.file.status === 'done'){
                    mark = true;
                    info.file.url = info.file.response.map.data[0].filePath;
                    if($this.state.productObj.imageURL){
                        if($this.state.productObj.imageURL[$this.state.productObj.imageURL.length-1] == ";"){
                            deneUrl =  $this.state.productObj.imageURL + info.file.response.map.data[0].filePath+";";
                        }else{
                            deneUrl =  $this.state.productObj.imageURL+";"+ info.file.response.map.data[0].filePath+";";
                        }
                    }else {
                        deneUrl = info.file.response.map.data[0].filePath+";";
                    }
                }else if (info.file.status === 'removed') {
                    mark = false;
                }
                if(mark != null){
                    $this.ajaxFn({"controlType":(mark ? "update" : "delete"),"fileName": info.file.name,"filePath":(mark ? deneUrl : info.file.url),"id":$this.state.productId}, function (data) {
                        message.success(info.file.name+(mark ? '上传成功。':'删除成功！'));
                        /*成功后重新渲染数据*/
                        this.ajaxFn({"controlType":"load","id":this.state.productId},function (data){
                            var defaultImg = [];
                            if(data.map.goods.imageURL){
                                data.map.goods.imageURL.split(";").forEach(function(obj,i){
                                    if(obj){
                                        var imgObj = {}
                                        imgObj.uid = i;
                                        imgObj.thumbUrl = obj.replace("otc","otcdyanmic");
                                        imgObj.url = obj.replace("otc","otcdyanmic");;
                                        imgObj.name = '';
                                        imgObj.status = 'done';
                                        defaultImg.push(imgObj);
                                    }
                                });
                            };
                            this.setState({
                                productObj:data.map.goods,
                                imgArr:defaultImg
                            });
                        });
                    })
                }
            }
        };

        return (
            <div>
                <div className="mb-title">修改产品</div>
                <div className="row addinformation mt30">
                    <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                                <div className="row">
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <InputBox tle="ID：" content={this.state.productObj.id} />
                                    </div>
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <InputBox tle="规格：" content={this.state.productObj.specification} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="row">
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <InputBox tle="品名：" content={this.state.productObj.goodsName} />
                                    </div>
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <InputBox tle="供应商：" content={this.state.productObj.supplier} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="row">
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <SelectData
                                            tle="是否考核："
                                            options={[{"id":1,"supplierName":"是"},{"id":0,"supplierName":"否"}]}
                                            typeName="isAssess"
                                            content={this.state.productObj.isAssess}
                                        />
                                    </div>
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <SelectData
                                            tle="状态："
                                            options={[{"id":1,"supplierName":"正常"},{"id":0,"supplierName":"停用"}]}
                                            typeName="flag"
                                            content={this.state.productObj.flag}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        <Upload {...props}>
                            <Icon type="plus" />
                            <div className="ant-upload-text">上传照片</div>
                        </Upload>
                        <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel} width={960} >
                            <img alt="" src={this.state.modalSrc} />
                        </Modal>
                    </div>
                </div>


                <Row className="mt30">
                    <Col lg={1}><span>说明书：</span></Col>
                    <Col lg={21}>
                        <div className="sms-content" ref="manual" >

                        </div>
                    </Col>
                </Row>
                <div className="btn-box col-md-offset-1 mt50">
                    <button className="btn btn-w btn-c-o fl" onClick={this.submit}>确定</button>
                    <button className="btn btn-w btn-c-t fl" onClick={this.out}>返回</button>
                </div>
            </div>
        );
    }
});
























/* 展示组件 需传参数：组件标题，显示内容*/
var InputBox = React.createClass({
    render:function () {
        return (
            <div className="row form-group">
                <div className="col-lg-4">
                    <label>{this.props.tle}</label>
                </div>
                <div className="col-lg-8">
                    <p className="show-info">{this.props.content}</p>
                </div>
            </div>
        )
    }
});



/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    handleChange:function (e) {
        if(e.target.value != 'false'){
            object[this.props.typeName] = e.target.value;
        }
    },
    componentDidMount:function () {
    },
    render:function(){
        var {content} = this.props;
        return (
            <div className="row form-group">
                <div className="col-lg-4">
                    <label>{this.props.tle}</label>
                </div>
                <div className="col-lg-8">
                    <select className="form-control xz" onChange={this.handleChange} defaultValue={content} >
                        <option value="false">--请选择--</option>
                        {this.props.options.map(function(data,i){
                            return <option value={data.id} key={i+"po"} >{data.supplierName}</option>
                        })}
                    </select>
                </div>
            </div>
        );
    }
});
