//import React from 'react'
//import {render} from 'react-dom'
//import Userloginy from 'userlogin.js'


var url = "/otcdyanmic/goodsMobile.do";
var currturl = window.location.href;  //获取当前url
var ProductDetail = React.createClass({
    getInitialState: function () {
        return {
            Y_login: true, //是否登录
            referrer: topreurl("product.html"), //上一页
            id: geturl('id'),
            sellingPrice: "",//价格
            imageURL: "",
            goodsName: "", //产品名
            supplier: "", //供应商
            goodsqty: "", //库存
            specification: "",//规格
            isAssess: "",
        };
    },
    componentDidMount: function () {

        this.getinfo();
    },
    //获取初始数据
    getinfo: function () {
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "getGoodsInFo";
        object.id = this.state.id;
        $.ajax({
            url: url,
            data: { paramMap: JSON.stringify(object) },
            type: "post",
            dataType: "json",
            success: function (data) {
                if (this.isMounted()) {
                    if (data != "" && data != null && data != undefined) {
                        //获取库存信息成功
                        if (data.success == true) {

                            console.log("获取获取信息成功")
                            var clientlist = "";
                            
                            if (data.map.goods != "" && data.map.goods != null && data.map.goods != undefined) {
                                var clientdata = data.map.goods;
                                var imgageURL=clientdata.imageURL;
                                  var imgageURL1
                                       if (imgageURL != ""&& imgageURL !=null && imgageURL != undefined && imgageURL.length > 0) {
                                               if (imgageURL.indexOf(";") == -1) {  //单个
                                                imgageURL1=isnullimg1(imgageURL);
                                               }
                                                 if (imgageURL.indexOf(";") > -1) {  //多个

                                                
                                                  imgageURL1=isnullimg1(imgageURL.split(";")[0]);
                                                 }
                                       }
                                       else{
                                        imgageURL1=isnullimg1(imgageURL);
                                       }
                                this.setState({
                                    sellingPrice: isnull(clientdata.sellingPrice),//价格
                                    imageURL: imgageURL1,
                                    goodsName: isnull(clientdata.goodsName), //产品名
                                    supplier: isnull(clientdata.supplier), //供应商
                                    goodsqty: isnull(clientdata.goodsqty), //库存
                                    specification: isnull(clientdata.specification),//规格
                                    isAssess: isnull(clientdata.isAssess),//是否考核
                                });

                                this.refs.pdl_synopsis.innerHTML = isnull(clientdata.manual);
                            }
                            else {
                                layer.open({
                                    shade: false,
                                    content: '没有找到数据',
                                    skin: 'msg',
                                    className: 'tip',
                                    time: 2 //2秒后自动关闭
                                });
                            }

                        }
                        //获取获取信息失败
                        if (data.success == false) {
                            //未登录
                            if (data.errorCode == "1") {
                                var dodatate = generateMixed(6)
                                window.location.href = wxurl(dodatate);
                            }
                            //未登录结束
                            
                            if (data.errorCode == "7") {
                               this.refs.conter.innerHTML = Datafaile("当前用户没有此操作权限！");
                            }
                            if (data.errorCode == "173") {
                               this.refs.conter.innerHTML = Datafaile("此产品已经停用！");
                            }
                            
                            else{
                               layer.open({
                                shade: false,
                                content: '获取获取信息失败',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });
                            }
                          
                            console.log("获取获取信息失败:" + data.msg)
                        }
                    }

                } // this.isMounted() End
            }.bind(this),
            error: function (jqXHR, textStatus, errorThrown) {
                if (this.isMounted()) {
                    layer.open({
                        shade: false,
                        content: '获取获取信息失败',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    console.log("获取获取信息失败：网络错误")
                }
            }.bind(this)
        });
    },
    render: function () {
        let userty = "60000";
        var isAssess = this.state.isAssess == 0 ? "未考核" : "考核";
        return (
            <div>
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    产品详情
                </div>
                <div class="conter" ref="conter">
                <div className="pdl_photo white borderb_1r">
                    <span className="isassess">{isAssess}</span>
                    <img src={this.state.imageURL} />
                </div>

                <div className="pdl_summary white borderb_1r profile ">
                    <h2 className="pdl_name">{this.state.goodsName}</h2>
                     <p className="pdl_other"><span className="pdl_supplier">供应商: {this.state.supplier}</span></p>
                    <dl>

                        <dt className="pdl_info">


                            <p className="pdl_format"> 规格：<em> {this.state.specification}</em></p>
                            <p className="pdl_stock">库存：{this.state.goodsqty}件</p>
                        </dt>
                        <dd className="Price">
                            <div className="Price_cont">￥<em>{this.state.sellingPrice}</em><span>批发价</span></div>
                        </dd>
                    </dl>


                </div>
                <div className="synopsis white margint_2r">
                    <h2 className="borderb_1r">说明书</h2>
                    <div className="pdl_synopsis" ref="pdl_synopsis">


                    </div>
                </div>
                 </div>
            </div>

        );
    }
});



ReactDOM.render(
    <ProductDetail />,
    document.getElementById('conter')
);




