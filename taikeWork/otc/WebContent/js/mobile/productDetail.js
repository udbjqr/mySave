/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	//import React from 'react'
	//import {render} from 'react-dom'
	//import Userloginy from 'userlogin.js'


	var url = "/otcdyanmic/goodsMobile.do";
	var currturl = window.location.href; //获取当前url
	var ProductDetail = React.createClass({
	    displayName: "ProductDetail",

	    getInitialState: function getInitialState() {
	        return {
	            Y_login: true, //是否登录
	            referrer: topreurl("product.html"), //上一页
	            id: geturl('id'),
	            sellingPrice: "", //价格
	            imageURL: "",
	            goodsName: "", //产品名
	            supplier: "", //供应商
	            goodsqty: "", //库存
	            specification: "", //规格
	            isAssess: ""
	        };
	    },
	    componentDidMount: function componentDidMount() {

	        this.getinfo();
	    },
	    //获取初始数据
	    getinfo: function getinfo() {
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

	                            console.log("获取获取信息成功");
	                            var clientlist = "";

	                            if (data.map.goods != "" && data.map.goods != null && data.map.goods != undefined) {
	                                var clientdata = data.map.goods;
	                                var imgageURL = clientdata.imageURL;
	                                var imgageURL1;
	                                if (imgageURL != "" && imgageURL != null && imgageURL != undefined && imgageURL.length > 0) {
	                                    if (imgageURL.indexOf(";") == -1) {
	                                        //单个
	                                        imgageURL1 = isnullimg1(imgageURL);
	                                    }
	                                    if (imgageURL.indexOf(";") > -1) {
	                                        //多个


	                                        imgageURL1 = isnullimg1(imgageURL.split(";")[0]);
	                                    }
	                                } else {
	                                    imgageURL1 = isnullimg1(imgageURL);
	                                }
	                                this.setState({
	                                    sellingPrice: isnull(clientdata.sellingPrice), //价格
	                                    imageURL: imgageURL1,
	                                    goodsName: isnull(clientdata.goodsName), //产品名
	                                    supplier: isnull(clientdata.supplier), //供应商
	                                    goodsqty: isnull(clientdata.goodsqty), //库存
	                                    specification: isnull(clientdata.specification), //规格
	                                    isAssess: isnull(clientdata.isAssess) });

	                                this.refs.pdl_synopsis.innerHTML = isnull(clientdata.manual);
	                            } else {
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
	                                var dodatate = generateMixed(6);
	                                window.location.href = wxurl(dodatate);
	                            }
	                            //未登录结束

	                            if (data.errorCode == "7") {
	                                this.refs.conter.innerHTML = Datafaile("当前用户没有此操作权限！");
	                            }
	                            if (data.errorCode == "173") {
	                                this.refs.conter.innerHTML = Datafaile("此产品已经停用！");
	                            } else {
	                                layer.open({
	                                    shade: false,
	                                    content: '获取获取信息失败',
	                                    skin: 'msg',
	                                    className: 'tip',
	                                    time: 2 //2秒后自动关闭
	                                });
	                            }

	                            console.log("获取获取信息失败:" + data.msg);
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
	                    console.log("获取获取信息失败：网络错误");
	                }
	            }.bind(this)
	        });
	    },
	    render: function render() {
	        var userty = "60000";
	        var isAssess = this.state.isAssess == 0 ? "未考核" : "考核";
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(
	                "div",
	                { className: "profile white", id: "pagenav" },
	                React.createElement(
	                    "span",
	                    { className: "toleft" },
	                    " ",
	                    React.createElement("a", { href: this.state.referrer })
	                ),
	                "\u4EA7\u54C1\u8BE6\u60C5"
	            ),
	            React.createElement(
	                "div",
	                { "class": "conter", ref: "conter" },
	                React.createElement(
	                    "div",
	                    { className: "pdl_photo white borderb_1r" },
	                    React.createElement(
	                        "span",
	                        { className: "isassess" },
	                        isAssess
	                    ),
	                    React.createElement("img", { src: this.state.imageURL })
	                ),
	                React.createElement(
	                    "div",
	                    { className: "pdl_summary white borderb_1r profile " },
	                    React.createElement(
	                        "h2",
	                        { className: "pdl_name" },
	                        this.state.goodsName
	                    ),
	                    React.createElement(
	                        "p",
	                        { className: "pdl_other" },
	                        React.createElement(
	                            "span",
	                            { className: "pdl_supplier" },
	                            "\u4F9B\u5E94\u5546: ",
	                            this.state.supplier
	                        )
	                    ),
	                    React.createElement(
	                        "dl",
	                        null,
	                        React.createElement(
	                            "dt",
	                            { className: "pdl_info" },
	                            React.createElement(
	                                "p",
	                                { className: "pdl_format" },
	                                " \u89C4\u683C\uFF1A",
	                                React.createElement(
	                                    "em",
	                                    null,
	                                    " ",
	                                    this.state.specification
	                                )
	                            ),
	                            React.createElement(
	                                "p",
	                                { className: "pdl_stock" },
	                                "\u5E93\u5B58\uFF1A",
	                                this.state.goodsqty,
	                                "\u4EF6"
	                            )
	                        ),
	                        React.createElement(
	                            "dd",
	                            { className: "Price" },
	                            React.createElement(
	                                "div",
	                                { className: "Price_cont" },
	                                "\uFFE5",
	                                React.createElement(
	                                    "em",
	                                    null,
	                                    this.state.sellingPrice
	                                ),
	                                React.createElement(
	                                    "span",
	                                    null,
	                                    "\u6279\u53D1\u4EF7"
	                                )
	                            )
	                        )
	                    )
	                ),
	                React.createElement(
	                    "div",
	                    { className: "synopsis white margint_2r" },
	                    React.createElement(
	                        "h2",
	                        { className: "borderb_1r" },
	                        "\u8BF4\u660E\u4E66"
	                    ),
	                    React.createElement("div", { className: "pdl_synopsis", ref: "pdl_synopsis" })
	                )
	            )
	        );
	    }
	});

	ReactDOM.render(React.createElement(ProductDetail, null), document.getElementById('conter'));

/***/ }
/******/ ]);