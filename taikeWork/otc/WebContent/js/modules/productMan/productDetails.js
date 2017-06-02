import React from 'react'
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Upload from 'antd/lib/upload'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import '../../../less/addInformation.less'
const Dragger = Upload.Dragger;






var object =new Object();
var objError = new Object();

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
    getDefaultProps:function () {
        return {
            moduleOne:[]
        }
    },
    getInitialState:function(){
        return {
            productObj:{},          /*产品详情数据对象*/
            priviewVisible: false,   /*antd 弹窗显示*/
            imgArr:[],              /*图片集合*/
            modalSrc:'',             /*点击图片的路径*/
            manual:null             /*说明书*/
        }
    },//之前
    componentDidMount:function(){
        var strData = sessionStorage.getItem("TK_strData");
        var productId = JSON.parse(strData).id;
        /*进入时获取产品详情*/
        this.ajaxFn({"controlType":"load","id":productId},function (data) {
            this.refs.manual.innerHTML = data.map.goods.manual;
            $("#manual .text-s-r").attr("contenteditable",false);
            this.setState({
                productObj:data.map.goods,
                imgArr:data.map.goods.imageURL ? data.map.goods.imageURL.split(";") : []
            });
        });

    },//返回
    out:function () {
        window.location.href = 'index.html#/productList';
    },/*antd 弹窗事件*/
    handleCancel:function () {
        this.setState({
            priviewVisible: false
        });
    },
    onPreview:function (e) {
        var src =  e.target.src
        this.setState({
            priviewVisible: true,
            modalSrc:src
        });
    },
    render:function(){
        var $this = this;
        return (
            <div>
                <div className="mb-title">产品详情</div>
                <div className="row addinformation mt30">
                    <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8">
                        <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 ">
                                <div className="row">
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <InputBox tle="ID：" content={this.state.productObj.id}  />
                                    </div>
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <InputBox tle="规格：" content={this.state.productObj.specification} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="row">
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <InputBox tle="品名：" content={this.state.productObj.goodsName}  />
                                    </div>
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <InputBox tle="供应商：" content={this.state.productObj.supplier} />
                                    </div>
                                </div>
                            </div>

                            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div className="row">
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <InputBox tle="是否考核：" content={this.state.productObj.isAssess ? '是':'否'}/>
                                    </div>
                                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                        <InputBox tle="状态：" content={this.state.productObj.flag  ? '正常':'停用'}/>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                        {this.state.imgArr.map(function (data,i) {
                            if(data){
                                return (
                                    <div key={i} className="product-img" onClick={$this.onPreview}>
                                        <img src={data} width="100%" height="100%"  />
                                    </div>
                                );
                            }
                        })}

                        <Modal visible={this.state.priviewVisible} footer={null} onCancel={this.handleCancel} width={960}>
                            <img alt="" src={this.state.modalSrc} />
                        </Modal>
                    </div>
                </div>




{/*
    <div className="row addinformation mt30">
        <div className="col-md-4 ">

            <InputBox tle="规格：" content={this.state.productObj.specification} />
            <InputBox tle="是否考核：" content={this.state.productObj.isAssess ? '是':'否'}/>
        </div>
        <div className="col-md-4">

            <InputBox tle="供应商：" content={this.state.productObj.supplier}  />
            <InputBox tle="状态：" content={this.state.productObj.flag  ? '正常':'停用'}/>
        </div>
        <div className="col-md-4">

        </div>
    </div>*/}























                <Row className="mt30">
                    <Col lg={2}><span className="pl15">说明书：</span></Col>
                    <Col lg={22}>
                        <div className="sms-content" ref="manual" id="manual">

                        </div>
                    </Col>
                </Row>
                <div className="btn-box col-md-offset-1 mt50">
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
