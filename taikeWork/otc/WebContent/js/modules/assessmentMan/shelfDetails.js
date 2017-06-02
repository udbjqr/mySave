import React from 'react'
import message from 'antd/lib/message'              /*antd 提示组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import Alert from 'antd/lib/alert'                  /*antd  警告组件*/
import Loading from '../react-utils/loading'         /*加载中组件*/



export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/visitStat.do') {
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
                $("#loading").addClass("none");
            },
            error(){
                $("#loading").addClass("none");
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    getInitialState(){
        var backpage=sessionStorage.getItem("back_page");
        var loadChainStock=backpage=="代表"?"loadChainStockByEmployee":"loadChainStock";
        var loadStockInfo=backpage=="代表"?"loadStockInfoByEmployee":"loadStockInfo";
        return {
            imgArr:[],       /*图片集合*/
            isImg:true,    /*显示没有图片提示*/
            visitInfo:{},  /*数据对象*/
            backtype:sessionStorage.getItem("back_page"), //判断从哪里进入 门店 or 代表 or 产品
            loadStockInfo:backpage=="代表"?"loadStockInfoByEmployee":"loadStockInfo", //判断接口  
        }
    },
    componentWillMount(){
         var backpage=sessionStorage.getItem("back_page");
        var strData = backpage=="产品"?sessionStorage.getItem("TK_strData1"):sessionStorage.getItem("TK_strData");
        var goods_id = JSON.parse(strData).goods_id;
        var visits_id = JSON.parse(strData).visits_id;
        this.ajaxFn({"controlType":this.state.loadStockInfo,"visits_id":visits_id,"goods_id":goods_id},function(data){
            if(data.map.info.image_urls){
                this.setState({imgArr:data.map.info.image_urls.split(";")});
            }else{
                this.setState({isImg:false});
            }
            this.setState({visitInfo:data.map.info});
        });
    },
    out(){
        var tourl=this.state.backtype=="产品"?"productinfo":"inventoryDetail"
        window.location.href = "index.html#/"+tourl;
        
    },
    render(){
        return (
            <div>
                <div className="mb-title">货架详情</div>
                <div className="row mt30">
                    {this.state.imgArr.map(function(obj,i){
                        if(obj && obj != "undefined"){
                            return <div key={i} className="col-xs-12 col-sm-6 col-md-4 col-lg-3"><ShowImg urlSrc={obj}/></div>
                        }
                    })}
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt15" style={{display:(this.state.isImg ? "none":"block")}}>
                        <Alert
                            message="提示："
                            description="暂无图片"
                            type="warning"
                            showIcon
                          />
                    </div>
                </div>
                <div className="goods-name border0 mt20">{this.state.visitInfo.goodName} <span className="goods-sm-tle">（{this.state.visitInfo.specification}）</span></div>
                <div className="row">
                    <div className="col-xs-12 col-ms-6 col-md-4 col-lg-4">
                        <DrugInfo tle="进货数量" content={this.state.visitInfo.purchaseNumber} />
                    </div>
                    <div className="col-xs-12 col-ms-6 col-md-4 col-lg-4">
                        <DrugInfo tle="产品批号" content={this.state.visitInfo.batchNumber} />
                    </div>
                    <div className="col-xs-12 col-ms-6 col-md-4 col-lg-4">
                        <DrugInfo tle="进货来源" content={this.state.visitInfo.purchaseSource} />
                    </div>
                    <div className="col-xs-12 col-ms-6 col-md-4 col-lg-4">
                        <DrugInfo tle="陈列面" content={this.state.visitInfo.displaySurface} />
                    </div>
                    <div className="col-xs-12 col-ms-6 col-md-4 col-lg-4">
                        <DrugInfo tle="陈列数" content={this.state.visitInfo.displayNumber} />
                    </div>
                    <div className="col-xs-12 col-ms-6 col-md-4 col-lg-4">
                        <DrugInfo tle="标签价" content={this.state.visitInfo.tagPrice} />
                    </div>
                    <div className="col-xs-12 col-ms-6 col-md-4 col-lg-4">
                        <DrugInfo tle="实际库存" content={this.state.visitInfo.realStock} />
                    </div>
                </div>
                <div className="row mt20">
                    <button className="btn btn-c-t col-lg-offset-1" onClick={this.out}>返回</button>
                </div>
            </div>
        );
    }
});

var ShowImg = React.createClass({
    render(){
        return <img className="showimg" src={this.props.urlSrc} alt="" width="100%" height="100%"/>
    }
});


var DrugInfo = React.createClass({
    render(){
        return (
            <div className="drug-info">
                <label>{this.props.tle}：</label>
                <span>{this.props.content}</span>
            </div>
        );
    }
});
