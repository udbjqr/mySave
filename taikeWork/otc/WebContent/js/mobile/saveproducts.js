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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _imagePicker = __webpack_require__(137);

	var _imagePicker2 = _interopRequireDefault(_imagePicker);

	var _whiteSpace = __webpack_require__(134);

	var _whiteSpace2 = _interopRequireDefault(_whiteSpace);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	import React from 'react'
	import {render} from 'react-dom'
	import Userlist from '../../js/mobile_modules/islogin.js'
	import zepto from '../../js/mobile/zepto/1.0.0/zepto.js'
	import fontsize from '../../js/mobile/fontsize.js'
	import layer from '../../js/mobile/layer/layer.js'
	*/
	var url = "/otcdyanmic/appraisals.do";
	var currturl = window.location.href; //获取当前url
	var daydate = geturl('day'); //走访时间
	var parenturl1 = "testproducts.html?custom_id=" + geturl('custom_id') + "&plan_id=" + geturl('plan_id') + "&day=" + daydate;

	var Saveproducts = React.createClass({
	    displayName: 'Saveproducts',

	    getInitialState: function getInitialState() {
	        return {
	            Y_login: true, //是否登录
	            referrer: topreurl(parenturl1), //上一页
	            custom_id: geturl('custom_id'),
	            plan_id: geturl('plan_id'),
	            goods_id: geturl('goods_id'),
	            visits_id: geturl('visits_id'),
	            goodsName: geturl('goodsName'),
	            detail_id: "", //产品id
	            goods_name: "", //产品名
	            purchase_source: "", //进货来源
	            display_surface: "", //陈列面
	            weighted_price: "", //加价权
	            purchase_number: "", //进货数量
	            tag_price: "", //标签价
	            image_urls: "", //图片
	            display_number: "", //陈列数
	            real_stock: "", //实际库存 
	            remark: "",
	            //shop_point:"",               //铺点数
	            //sail_total:"" ,          // 销售额
	            batch_number: "", //批号
	            isloding: true
	        };
	    },

	    componentDidMount: function componentDidMount() {
	        $(document).attr("title", this.state.goodsName + "-品牌俱乐部");

	        $(".Upload_btn").delegate('#filephoto', 'change', function () {

	            this.clickpoto();
	        }.bind(this));

	        //获取数据
	        this.pubsub_token = PubSub.subscribe('changprodupub', function (topic, newItem) {
	            this.setState({
	                detail_id: newItem.detail_id, //产品id
	                goods_name: newItem.goods_name, //产品名
	                purchase_source: newItem.purchase_source, //进货来源
	                display_surface: newItem.display_surface, //陈列面
	                weighted_price: newItem.weighted_price, //加价权
	                purchase_number: newItem.purchase_number, //进货数量
	                tag_price: newItem.tag_price, //标签价
	                image_urls: newItem.image_urls, //图片
	                display_number: newItem.display_number, //陈列数
	                real_stock: newItem.real_stock, //实际库存 
	                remark: newItem.remark,
	                //shop_point:newItem.shop_point,               //铺点数
	                //sail_total:newItem.sail_total ,          // 销售额
	                batch_number: newItem.batch_number //批号
	            });
	            if (newItem.detail_id != "" && newItem.detail_id != null && newItem.detail_id != undefined) {

	                $("#display_surface").val(newItem.display_surface); //陈列面
	                $("#display_number").val(newItem.display_number); //陈列数
	                $("#real_stock").val(newItem.real_stock); //实际库存 
	                $("#weighted_price").val(newItem.weighted_price); // 加价权
	                $("#tag_price").val(newItem.tag_price); //标签价

	                $("#purchase_number").val(newItem.purchase_number); //进货数量
	                $("#purchase_source").val(newItem.purchase_source); //进货来源
	                $("#batch_number").val(newItem.batch_number); //批号
	                $("#remark_text").val(newItem.remark); //备注

	                var imgsrc = newItem.image_urls;
	                if (imgsrc != "" && imgsrc.length > 0) {

	                    //单个
	                    if (imgsrc.indexOf(";") == -1) {
	                        //单个
	                        var photoname = todourl(imgsrc);
	                        $(".Upload_photos").append('<div class="previewimg" id="products1"><div class="imgwarp"> <img data-src="' + imgsrc + '"  data-name="' + photoname + '" src="' + isnullimg(imgsrc) + '"/><span class="imgclose" onClick=remove(this) ></span></div></div>');
	                        // this.lrzimg("/otc/"+imgsrc);
	                    }
	                    //单个结束


	                    //多个 
	                    if (imgsrc.indexOf(";") > -1) {
	                        //多个

	                        var imgspit = imgsrc.split(";");

	                        for (var i = 0; i <= imgspit.length - 1; i++) {

	                            $(".Upload_photos").append('<div class="previewimg" id="products' + (i + 1) + '"><div class="imgwarp"> <img data-src="' + imgspit[i] + '"  data-name="' + imgspit[i] + '" src="' + isnullimg(imgspit[i]) + '"/><span class="imgclose"  onClick=remove(this) ></span></div><p class="imgnum">' + (i + 1) + '</p></div>');
	                            //this.lrzimg("/otc/" + imgspit[i], todourl(imgspit[i]));
	                        }
	                    }
	                    //多个结束
	                }
	            }
	        }.bind(this));
	    },

	    componentWillUnmount: function componentWillUnmount() {
	        PubSub.unsubscribe(this.pubsub_token);
	    },

	    /*
	    //获取后台图片时压缩图片
	    lrzimg: function (imgurl, photoname) {
	        //压缩图片
	     
	        lrz(imgurl)
	            .then(function (rst) {
	                // 处理成功会执行
	                  //proimg = rst.base64;
	                $(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
	                //$("#preview").attr("src", proimg);//图片
	            })
	            .catch(function (err) {
	                // proimg = "1";
	                  // 处理失败会执行
	            })
	            .always(function () {
	            // 不管是成功失败，都会执行
	            });
	        //压缩图片结束
	      },
	      //获取后台图片时压缩图片结束
	    */
	    //点击上传图片
	    clickpoto: function clickpoto() {

	        var $images = $('#cutoutphoto');
	        //获取图片
	        var preview,
	            img_txt,
	            file_head = document.getElementById("filephoto"),
	            picture = file_head.value;
	        var $inputImage = $('#filephoto');
	        file_head.select();

	        var preview_src;
	        //获取图片url
	        if (file_head.files && file_head.files[0]) {
	            preview_src = window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1 ? window.webkitURL.createObjectURL(file_head.files[0]) : window.URL.createObjectURL(file_head.files[0]);
	        } else {
	            img_txt = document.selection.createRange().text;

	            preview_src = img_txt;
	            document.selection.empty();
	        }

	        //获取图片url结束

	        //获取图片名
	        var pos1 = picture.lastIndexOf("\\");

	        var pos2 = picture.lastIndexOf(".");

	        var pos = picture.substring(pos1 + 1, pos2);
	        var photoname = picture.substring(pos1 + 1, picture.length);
	        //$("#preview").attr("data-name", photoname);
	        //获取图片名结束


	        //压缩图片
	        var $this = this;
	        var img = new Image();
	        img.src = preview_src;
	        var rqi = ".divPhoto";
	        if (img.complete) {
	            var imgwd = img.width;

	            if (imgwd > 640) {
	                lrz(preview_src, { width: 640 }).then(function (rst) {
	                    // 处理成功会执行
	                    layer.open({
	                        shade: true,
	                        content: '头像上传中...',
	                        skin: 'msg',
	                        className: 'tip'
	                    });
	                    $this.ajaxphoto(rst.base64, photoname);
	                    //  $(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
	                    //$("#preview").attr("src", rst.base64);
	                }).catch(function (err) {
	                    // 处理失败会执行
	                }).always(function () {
	                    // 不管是成功失败，都会执行
	                });
	            }

	            if (imgwd <= 640) {
	                lrz(preview_src).then(function (rst) {
	                    // 处理成功会执行
	                    layer.open({
	                        shade: true,
	                        content: '头像上传中...',
	                        skin: 'msg',
	                        className: 'tip'
	                    });
	                    $this.ajaxphoto(rst.base64, photoname);
	                    //$(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
	                    //$("#preview").attr("src", rst.base64);
	                }).catch(function (err) {
	                    // 处理失败会执行
	                }).always(function () {
	                    // 不管是成功失败，都会执行
	                });
	            }
	        } else {
	            img.onload = function () {
	                var imgwd1 = img.width;

	                if (imgwd1 > 640) {
	                    lrz(preview_src, { width: 640 }).then(function (rst) {
	                        // 处理成功会执行
	                        layer.open({
	                            shade: true,
	                            content: '头像上传中...',
	                            skin: 'msg',
	                            className: 'tip'
	                        });
	                        $this.ajaxphoto(rst.base64, photoname);
	                        //$(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
	                        // $("#preview").attr("src", rst.base64);
	                    }).catch(function (err) {
	                        // 处理失败会执行
	                    }).always(function () {
	                        // 不管是成功失败，都会执行
	                    });
	                }
	                if (imgwd1 <= 640) {
	                    lrz(preview_src).then(function (rst) {
	                        // 处理成功会执行
	                        layer.open({
	                            shade: true,
	                            content: '头像上传中...',
	                            skin: 'msg',
	                            className: 'tip'
	                        });
	                        $this.ajaxphoto(rst.base64, photoname);
	                        //$(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
	                        //$("#preview").attr("src", rst.base64);
	                    }).catch(function (err) {
	                        // 处理失败会执行
	                    }).always(function () {
	                        // 不管是成功失败，都会执行
	                    });
	                }

	                img.onload = null;
	            };
	        };
	    },

	    check: function check() {
	        var display_surface = $("#display_surface").val(); //陈列面
	        var display_number = $("#display_number").val(); //陈列数
	        var real_stock = $("#real_stock").val(); //实际库存 
	        var weighted_price = $("#weighted_price").val(); // 加价权
	        var tag_price = $("#tag_price").val(); //标签价
	        var sail_number = $("#sail_number").val(); //销售总额
	        var purchase_number = $("#purchase_number").val(); //进货数量
	        var purchase_source = $("#purchase_source").val(); //进货来源
	        var batch_number = $("#batch_number").val(); //批号
	        var image_urls = $("#preview").attr("src"); //图片
	        var fileName = $("#preview").attr("data-name"); //图片名字
	        var remark = $("#remark_text").val(); //备注
	        var reg = /^([1-9]\d*|[0]{1,1})$/; //判断正整数:（包括0） 
	        var reg1 = /^\d+(\.\d+)?$/; //判断数字:（包括小数点） 
	        var reg2 = /^[A-Za-z0-9]+$/; //匹配由数字和26个英文字母组成的字符串
	        if (display_surface == "" && display_surface.length <= 0) {
	            layer.open({
	                shade: false,
	                content: '陈列面不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }

	        if (!reg.exec(display_surface)) {
	            layer.open({
	                shade: false,
	                content: '陈列面值必须为数字',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        if (display_number == "" && display_number.length <= 0) {
	            layer.open({
	                shade: false,
	                content: '陈列数不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }

	        if (!reg.exec(display_number)) {
	            layer.open({
	                shade: false,
	                content: '陈列数值必须为数字',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        if (real_stock == "" && real_stock.length <= 0) {
	            layer.open({
	                shade: false,
	                content: '实际库存不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }

	        if (!reg.exec(real_stock)) {
	            layer.open({
	                shade: false,
	                content: '实际库存值必须为数字',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        if (weighted_price == "" && weighted_price.length <= 0) {
	            layer.open({
	                shade: false,
	                content: '加价权不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        /*
	        if (!reg1.exec(weighted_price)) {
	          layer.open({
	              shade: false,
	              content: '加价权值必须为数字',
	              skin: 'msg',
	              className: 'tip',
	              time: 2 //2秒后自动关闭
	          });
	          return false;
	        }
	        /*
	        if (weighted_price > 100) {
	          layer.open({
	              shade: false,
	              content: '加价权值必须为100以内的数字',
	              skin: 'msg',
	              className: 'tip',
	              time: 2 //2秒后自动关闭
	          });
	          return false;
	        }
	        */
	        if (tag_price == "" && tag_price.length <= 0) {
	            layer.open({
	                shade: false,
	                content: '标签价不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }

	        if (!reg1.exec(tag_price)) {
	            layer.open({
	                shade: false,
	                content: '标签价值必须为数字',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        /*
	           if (sail_number==""&& sail_number.length <= 0) {
	               layer.open({
	                   shade: false,
	                   content: '销售总额不能为空',
	                   skin: 'msg',
	                   className: 'tip',
	                   time: 2 //2秒后自动关闭
	               });
	               return false;
	           }
	           
	            if (!reg.exec(sail_number)) {
	                 layer.open({
	                   shade: false,
	                   content: '销售总额值必须为数字',
	                   skin: 'msg',
	                   className: 'tip',
	                   time: 2 //2秒后自动关闭
	               });
	            return false;
	            }
	           */
	        if (purchase_number == "" && purchase_number.length <= 0) {
	            layer.open({
	                shade: false,
	                content: '进货数量不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }

	        if (!reg.exec(purchase_number)) {
	            layer.open({
	                shade: false,
	                content: '进货数量值必须为数字',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        if (purchase_source == "" && purchase_source.length <= 0) {
	            layer.open({
	                shade: false,
	                content: '进货来源不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }

	        if (batch_number == "" && batch_number.length <= 0) {
	            layer.open({
	                shade: false,
	                content: '批号不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }

	        /*
	          if (!reg2.exec(batch_number)) {
	              layer.open({
	                  shade: false,
	                  content: '批号值必须为数字和26个英文字母组成的字符串',
	                  skin: 'msg',
	                  className: 'tip',
	                  time: 2 //2秒后自动关闭
	              });
	              return false;
	          }
	          */
	        /*
	        if (remark == "" && remark.length <= 0) {
	            layer.open({
	                shade: false,
	                content: '备注内容不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	         */
	        var imgnum = $(".Upload_photos").find(".imgwarp").length;

	        if (imgnum <= 0) {
	            layer.open({
	                shade: false,
	                content: '图片不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        } else {
	            this.saveinfo();

	            setTimeout(function () {
	                if (this.state.isloding) {
	                    layer.open({
	                        shade: true,
	                        content: '正在保存信息...',
	                        skin: 'msg',
	                        className: 'tip'
	                    });
	                }
	            }.bind(this), 1000);
	        }
	    },
	    //上传图片
	    ajaxphoto: function ajaxphoto(img, imgname) {

	        var object = new Object();
	        object.openId = OpenID;
	        object.controlType = "uploadImg";
	        object.base64Img = img;
	        object.fileName = imgname;
	        $.ajax({
	            url: url,
	            data: { paramMap: JSON.stringify(object) },
	            type: "post",
	            dataType: "json",
	            success: function (data) {
	                if (this.isMounted()) {
	                    if (data != "" && data != null && data != undefined) {
	                        //上传图片成功

	                        layer.closeAll();
	                        if (data.success == true) {
	                            console.log("上传图片成功");
	                            $(".layermcont").html("上传头像成功");

	                            setTimeout(function () {
	                                layer.closeAll();
	                            }, 1000);
	                            var j = $(".Upload_photos").find(".imgwarp").length;

	                            var imgsrc = isnullimg1(data.map.filePath);
	                            $(".Upload_photos").append('<div class="previewimg" id="products' + (j + 1) + '"><div class="imgwarp"> <img  data-src="' + imgsrc + '"  data-name="' + imgname + '" src="' + imgsrc + '"/><span class="imgclose"  onClick=remove(this)></span></div><p class="imgnum">' + (j + 1) + '</p></div>');
	                            var $this = this;
	                        }
	                        //上传图片失败
	                        if (data.success == false) {
	                            //未登录
	                            if (data.errorCode == "1") {
	                                var dodatate = generateMixed(6);
	                                window.location.href = wxurl(dodatate);
	                            }
	                            //未登录结束
	                            $(".layermcont").html("上传图片失败");
	                            setTimeout(function () {
	                                layer.closeAll();
	                            }, 2000);

	                            console.log("上传图片失败:" + data.msg);
	                        }
	                    }
	                } // this.isMounted() End
	            }.bind(this),
	            error: function (jqXHR, textStatus, errorThrown) {
	                if (this.isMounted()) {

	                    $(".layermcont").html("上传图片失败,请检查你的网络是否正常");
	                    setTimeout(function () {
	                        layer.closeAll();
	                    }, 2000);

	                    console.log("上传图片失败：网络错误");
	                }
	            }.bind(this)
	        });
	    },

	    //保存数据ajax
	    saveinfo: function saveinfo() {

	        var display_surface = $("#display_surface").val(); //陈列面
	        var display_number = $("#display_number").val(); //陈列数
	        var real_stock = $("#real_stock").val(); //实际库存 
	        //var weighted_price = $("#weighted_price").val();   // 加价权
	        var tag_price = $("#tag_price").val(); //标签价
	        var sail_number = $("#sail_number").val(); //销售总额
	        var purchase_number = $("#purchase_number").val(); //进货数量
	        var purchase_source = $("#purchase_source").val(); //进货来源
	        var batch_number = $("#batch_number").val(); //批号
	        var image_urls = ""; //图片
	        var fileName = ""; //图片名字
	        var imgnums = $(".Upload_photos").find(".imgwarp").length;

	        if (imgnums == 1) {
	            image_urls = $(".Upload_photos").find(".imgwarp img").attr("data-src");
	        }
	        if (imgnums > 1) {
	            $.each($(".Upload_photos .previewimg"), function (i, n) {
	                if (i == imgnums - 1) {
	                    image_urls += $(this).find(".imgwarp img").attr("data-src");
	                } else {
	                    image_urls += $(this).find(".imgwarp img").attr("data-src") + ";";
	                }
	            });
	        }

	        var remark = $("#remark_text").val(); //备注
	        //var shop_point=$("#shop_point").attr("data-name");  //铺点数
	        //var sail_total=$("#sail_total").attr("data-name");  //销售额
	        var object = new Object();
	        object.openId = OpenID;
	        object.controlType = "add";
	        object.goods_id = this.state.goods_id;
	        object.visits_id = this.state.visits_id;
	        object.display_surface = display_surface; //陈列面
	        object.display_number = display_number; //陈列数
	        object.real_stock = real_stock; //实际库存 
	        //   object.weighted_price = weighted_price;   // 加价权
	        object.tag_price = tag_price; //标签价
	        object.sail_number = sail_number; //销售总额
	        object.purchase_number = purchase_number; //进货数量
	        object.purchase_source = purchase_source; //进货来源
	        object.batch_number = batch_number; //批号
	        object.remark = remark; //

	        object.fileNames = image_urls;
	        var detail_id = this.state.detail_id;
	        if (detail_id != "" && detail_id != null && detail_id != undefined) {
	            object.detail_id = detail_id;
	        }
	        $.ajax({
	            url: url,
	            data: { paramMap: JSON.stringify(object) },
	            type: "post",
	            dataType: "json",
	            success: function (data) {
	                this.setState({
	                    isloding: false
	                });
	                if (this.isMounted()) {
	                    if (data != "" && data != null && data != undefined) {
	                        //保存数据成功
	                        layer.closeAll();
	                        if (data.success == true) {
	                            console.log("保存数据成功");

	                            layer.open({
	                                shade: true,
	                                content: '保存数据成功',
	                                skin: 'msg',
	                                className: 'tip'
	                            });
	                            var $this = this;
	                            setTimeout(function () {

	                                var goodsName = $this.state.goodsName; //产品名
	                                var goods_id = $this.state.goods_id;
	                                var visits_id = $this.state.visits_id;
	                                var plan_id = $this.state.plan_id;
	                                var custom_id = $this.state.custom_id;
	                                //window.location.href ="productarticle.html?goodsName="+goodsName+"&goods_id="+goods_id+"&visits_id="+visits_id+"&plan_id="+plan_id+"&custom_id="+custom_id;
	                                location.reload();
	                            }, 2000);
	                        }
	                        //保存数据失败
	                        if (data.success == false) {
	                            //未登录
	                            if (data.errorCode == "1") {
	                                var dodatate = generateMixed(6);
	                                window.location.href = wxurl(dodatate);
	                            }
	                            //未登录结束
	                            $(".layermcont").html("保存数据失败");
	                            setTimeout(function () {
	                                layer.closeAll();
	                            }, 2000);

	                            console.log("保存数据失败:" + data.msg);
	                        }
	                    }
	                } // this.isMounted() End
	            }.bind(this),
	            error: function (jqXHR, textStatus, errorThrown) {
	                if (this.isMounted()) {
	                    this.setState({
	                        isloding: false
	                    });
	                    $(".layermcont").html("保存数据失败,请检查你的网络是否正常");
	                    setTimeout(function () {
	                        layer.closeAll();
	                    }, 2000);

	                    console.log("保存数据失败：网络错误");
	                }
	            }.bind(this)
	        });
	    },

	    save: function save() {
	        this.check();
	        // window.location.href = "productarticle.html";
	    },
	    render: function render() {
	        return React.createElement(
	            'div',
	            null,
	            React.createElement(
	                'div',
	                { className: 'profile white', id: 'pagenav' },
	                React.createElement(
	                    'span',
	                    { className: 'toleft' },
	                    ' ',
	                    React.createElement('a', { href: this.state.referrer })
	                ),
	                this.state.goodsName
	            ),
	            React.createElement(
	                'h1',
	                { className: 'saveprodt_Title ' },
	                '\u5E93\u5B58'
	            ),
	            React.createElement(
	                'div',
	                { className: 'profile pro_border ' },
	                React.createElement(
	                    'dl',
	                    { className: 'white profile_pading save_input', id: 'save_input' },
	                    React.createElement(
	                        'dt',
	                        null,
	                        React.createElement(
	                            'label',
	                            null,
	                            '\u9648\u5217\u9762\uFF1A'
	                        ),
	                        React.createElement('input', { className: 'pdt_input', id: 'display_surface', placeholder: '\u8BF7\u8F93\u5165' })
	                    )
	                ),
	                React.createElement(
	                    'dl',
	                    { className: 'white profile_pading save_input', id: 'save_input' },
	                    React.createElement(
	                        'dt',
	                        null,
	                        React.createElement(
	                            'label',
	                            null,
	                            '\u9648\u5217\u6570\uFF1A'
	                        ),
	                        React.createElement('input', { className: 'pdt_input', id: 'display_number', placeholder: '\u8BF7\u8F93\u5165' })
	                    )
	                ),
	                React.createElement(
	                    'dl',
	                    { className: 'white profile_pading save_input', id: 'save_input' },
	                    React.createElement(
	                        'dt',
	                        null,
	                        React.createElement(
	                            'label',
	                            null,
	                            '\u5B9E\u9645\u5E93\u5B58\uFF1A'
	                        ),
	                        React.createElement('input', { className: 'pdt_input', id: 'real_stock', placeholder: '\u8BF7\u8F93\u5165' })
	                    )
	                ),
	                React.createElement(
	                    'dl',
	                    { className: 'white save_input profile_pading', id: 'save_input' },
	                    React.createElement(
	                        'dt',
	                        null,
	                        React.createElement(
	                            'label',
	                            null,
	                            '\u6807\u7B7E\u4EF7\uFF1A'
	                        ),
	                        React.createElement('input', { className: 'pdt_input', id: 'tag_price', placeholder: '\u8BF7\u8F93\u5165' })
	                    )
	                )
	            ),
	            React.createElement(
	                'h1',
	                { className: 'saveprodt_Title  ' },
	                '\u8FDB\u8D27'
	            ),
	            React.createElement(
	                'div',
	                { className: 'profile pro_border ' },
	                React.createElement(
	                    'dl',
	                    { className: 'white save_input profile_pading', id: 'save_input' },
	                    React.createElement(
	                        'dt',
	                        null,
	                        React.createElement(
	                            'label',
	                            null,
	                            '\u8FDB\u8D27\u6570\u91CF\uFF1A'
	                        ),
	                        React.createElement('input', { className: 'pdt_input', id: 'purchase_number', placeholder: '\u8BF7\u8F93\u5165' })
	                    )
	                ),
	                React.createElement(
	                    'dl',
	                    { className: 'white save_input profile_pading', id: 'save_input' },
	                    React.createElement(
	                        'dt',
	                        null,
	                        React.createElement(
	                            'label',
	                            null,
	                            '\u8FDB\u8D27\u6765\u6E90\uFF1A'
	                        ),
	                        React.createElement('input', { className: 'pdt_input', id: 'purchase_source', placeholder: '\u8BF7\u8F93\u5165' })
	                    )
	                ),
	                React.createElement(
	                    'dl',
	                    { className: 'white save_input profile_pading', id: 'save_input' },
	                    React.createElement(
	                        'dt',
	                        null,
	                        React.createElement(
	                            'label',
	                            null,
	                            '\u6279\u53F7\uFF1A'
	                        ),
	                        React.createElement('input', { className: 'pdt_input', id: 'batch_number', placeholder: '\u8BF7\u8F93\u5165' })
	                    )
	                ),
	                React.createElement(
	                    'h1',
	                    { className: 'saveprodt_Title  ' },
	                    '\u5907\u6CE8'
	                ),
	                React.createElement('textarea', { name: 'remark_text', id: 'remark_text', cols: '450', rows: '5', placeholder: '\u8BF7\u8F93\u5165\u4F60\u8981\u7EAA\u5F55\u7684\u5185\u5BB9' })
	            ),
	            React.createElement(
	                'h1',
	                { className: 'saveprodt_Title  ' },
	                '\u4E0A\u4F20\u56FE\u72471'
	            ),
	            React.createElement(
	                'div',
	                { className: 'white margint_1r Upload_photo' },
	                React.createElement('div', { className: 'Upload_photos' }),
	                React.createElement(
	                    'div',
	                    { className: 'Upload_btn' },
	                    React.createElement('input', { type: 'file', capture: 'camera', accept: 'image/*', id: 'filephoto', name: 'filephoto' })
	                )
	            ),
	            React.createElement(
	                'button',
	                { className: 'fn-btn', onTouchStart: this.save },
	                '\u4FDD\u5B58'
	            )
	        );
	    }
	});

	module.exports = Saveproducts;

	/*
	ReactDOM.render(
	    <Saveproducts />,
	    document.getElementById('conter')
	);
	*/

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(6);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(7), __esModule: true };

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(8);
	var $Object = __webpack_require__(11).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(9);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(19), 'Object', {defineProperty: __webpack_require__(15).f});

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(10)
	  , core      = __webpack_require__(11)
	  , ctx       = __webpack_require__(12)
	  , hide      = __webpack_require__(14)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 10 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 11 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(13);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(15)
	  , createDesc = __webpack_require__(23);
	module.exports = __webpack_require__(19) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(16)
	  , IE8_DOM_DEFINE = __webpack_require__(18)
	  , toPrimitive    = __webpack_require__(22)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(19) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(17);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(19) && !__webpack_require__(20)(function(){
	  return Object.defineProperty(__webpack_require__(21)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(20)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(17)
	  , document = __webpack_require__(10).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(17);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(26);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(27);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(63);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(28), __esModule: true };

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(29);
	__webpack_require__(58);
	module.exports = __webpack_require__(62).f('iterator');

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(30)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(33)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(31)
	  , defined   = __webpack_require__(32);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(34)
	  , $export        = __webpack_require__(9)
	  , redefine       = __webpack_require__(35)
	  , hide           = __webpack_require__(14)
	  , has            = __webpack_require__(36)
	  , Iterators      = __webpack_require__(37)
	  , $iterCreate    = __webpack_require__(38)
	  , setToStringTag = __webpack_require__(54)
	  , getPrototypeOf = __webpack_require__(56)
	  , ITERATOR       = __webpack_require__(55)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 34 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(14);

/***/ },
/* 36 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(39)
	  , descriptor     = __webpack_require__(23)
	  , setToStringTag = __webpack_require__(54)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(14)(IteratorPrototype, __webpack_require__(55)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(16)
	  , dPs         = __webpack_require__(40)
	  , enumBugKeys = __webpack_require__(52)
	  , IE_PROTO    = __webpack_require__(49)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(21)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(53).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(15)
	  , anObject = __webpack_require__(16)
	  , getKeys  = __webpack_require__(41);

	module.exports = __webpack_require__(19) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(42)
	  , enumBugKeys = __webpack_require__(52);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(36)
	  , toIObject    = __webpack_require__(43)
	  , arrayIndexOf = __webpack_require__(46)(false)
	  , IE_PROTO     = __webpack_require__(49)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(44)
	  , defined = __webpack_require__(32);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(45);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 45 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(43)
	  , toLength  = __webpack_require__(47)
	  , toIndex   = __webpack_require__(48);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(31)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(31)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(50)('keys')
	  , uid    = __webpack_require__(51);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(10)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 51 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(10).document && document.documentElement;

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(15).f
	  , has = __webpack_require__(36)
	  , TAG = __webpack_require__(55)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(50)('wks')
	  , uid        = __webpack_require__(51)
	  , Symbol     = __webpack_require__(10).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(36)
	  , toObject    = __webpack_require__(57)
	  , IE_PROTO    = __webpack_require__(49)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(32);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(59);
	var global        = __webpack_require__(10)
	  , hide          = __webpack_require__(14)
	  , Iterators     = __webpack_require__(37)
	  , TO_STRING_TAG = __webpack_require__(55)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(60)
	  , step             = __webpack_require__(61)
	  , Iterators        = __webpack_require__(37)
	  , toIObject        = __webpack_require__(43);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(33)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 60 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(55);

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(64), __esModule: true };

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(65);
	__webpack_require__(76);
	__webpack_require__(77);
	__webpack_require__(78);
	module.exports = __webpack_require__(11).Symbol;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(10)
	  , has            = __webpack_require__(36)
	  , DESCRIPTORS    = __webpack_require__(19)
	  , $export        = __webpack_require__(9)
	  , redefine       = __webpack_require__(35)
	  , META           = __webpack_require__(66).KEY
	  , $fails         = __webpack_require__(20)
	  , shared         = __webpack_require__(50)
	  , setToStringTag = __webpack_require__(54)
	  , uid            = __webpack_require__(51)
	  , wks            = __webpack_require__(55)
	  , wksExt         = __webpack_require__(62)
	  , wksDefine      = __webpack_require__(67)
	  , keyOf          = __webpack_require__(68)
	  , enumKeys       = __webpack_require__(69)
	  , isArray        = __webpack_require__(72)
	  , anObject       = __webpack_require__(16)
	  , toIObject      = __webpack_require__(43)
	  , toPrimitive    = __webpack_require__(22)
	  , createDesc     = __webpack_require__(23)
	  , _create        = __webpack_require__(39)
	  , gOPNExt        = __webpack_require__(73)
	  , $GOPD          = __webpack_require__(75)
	  , $DP            = __webpack_require__(15)
	  , $keys          = __webpack_require__(41)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(74).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(71).f  = $propertyIsEnumerable;
	  __webpack_require__(70).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(34)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(14)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(51)('meta')
	  , isObject = __webpack_require__(17)
	  , has      = __webpack_require__(36)
	  , setDesc  = __webpack_require__(15).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(20)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(10)
	  , core           = __webpack_require__(11)
	  , LIBRARY        = __webpack_require__(34)
	  , wksExt         = __webpack_require__(62)
	  , defineProperty = __webpack_require__(15).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(41)
	  , toIObject = __webpack_require__(43);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(41)
	  , gOPS    = __webpack_require__(70)
	  , pIE     = __webpack_require__(71);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 70 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 71 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(45);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(43)
	  , gOPN      = __webpack_require__(74).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(42)
	  , hiddenKeys = __webpack_require__(52).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(71)
	  , createDesc     = __webpack_require__(23)
	  , toIObject      = __webpack_require__(43)
	  , toPrimitive    = __webpack_require__(22)
	  , has            = __webpack_require__(36)
	  , IE8_DOM_DEFINE = __webpack_require__(18)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(19) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 76 */
/***/ function(module, exports) {

	

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(67)('asyncIterator');

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(67)('observable');

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(80);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(84);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(26);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(81), __esModule: true };

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(82);
	module.exports = __webpack_require__(11).Object.setPrototypeOf;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(9);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(83).set});

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(17)
	  , anObject = __webpack_require__(16);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(12)(Function.call, __webpack_require__(75).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(85), __esModule: true };

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(86);
	var $Object = __webpack_require__(11).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(9)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(39)});

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */,
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__(99);

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(100), __esModule: true };

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(101);
	module.exports = __webpack_require__(11).Object.assign;

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(9);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(102)});

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(41)
	  , gOPS     = __webpack_require__(70)
	  , pIE      = __webpack_require__(71)
	  , toObject = __webpack_require__(57)
	  , IObject  = __webpack_require__(44)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(20)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends2 = __webpack_require__(98);

	var _extends3 = _interopRequireDefault(_extends2);

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	exports["default"] = function (props) {
	    var type = props.type;
	    var _props$className = props.className;
	    var className = _props$className === undefined ? '' : _props$className;

	    return React.createElement('i', (0, _extends3["default"])({}, props, { className: (className + ' anticon anticon-' + type).trim() }));
	};

	module.exports = exports['default'];

/***/ },
/* 132 */,
/* 133 */,
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = undefined;

	var _defineProperty2 = __webpack_require__(5);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _classCallCheck2 = __webpack_require__(24);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(79);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _classnames = __webpack_require__(87);

	var _classnames2 = _interopRequireDefault(_classnames);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var WhiteSpace = function (_React$Component) {
	    (0, _inherits3["default"])(WhiteSpace, _React$Component);

	    function WhiteSpace() {
	        (0, _classCallCheck3["default"])(this, WhiteSpace);
	        return (0, _possibleConstructorReturn3["default"])(this, _React$Component.apply(this, arguments));
	    }

	    WhiteSpace.prototype.render = function render() {
	        var _classNames;

	        var _props = this.props;
	        var prefixCls = _props.prefixCls;
	        var size = _props.size;
	        var className = _props.className;
	        var style = _props.style;
	        var onClick = _props.onClick;

	        var wrapCls = (0, _classnames2["default"])((_classNames = {}, (0, _defineProperty3["default"])(_classNames, '' + prefixCls, true), (0, _defineProperty3["default"])(_classNames, prefixCls + '-' + size, true), (0, _defineProperty3["default"])(_classNames, className, !!className), _classNames));
	        return React.createElement('div', { className: wrapCls, style: style, onClick: onClick });
	    };

	    return WhiteSpace;
	}(React.Component);

	exports["default"] = WhiteSpace;

	WhiteSpace.defaultProps = {
	    prefixCls: 'am-whitespace',
	    size: 'md'
	};
	module.exports = exports['default'];

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = undefined;

	var _defineProperty2 = __webpack_require__(5);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _classCallCheck2 = __webpack_require__(24);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(79);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _classnames = __webpack_require__(87);

	var _classnames2 = _interopRequireDefault(_classnames);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var WingBlank = function (_React$Component) {
	    (0, _inherits3["default"])(WingBlank, _React$Component);

	    function WingBlank() {
	        (0, _classCallCheck3["default"])(this, WingBlank);
	        return (0, _possibleConstructorReturn3["default"])(this, _React$Component.apply(this, arguments));
	    }

	    WingBlank.prototype.render = function render() {
	        var _classNames;

	        var _props = this.props;
	        var prefixCls = _props.prefixCls;
	        var size = _props.size;
	        var className = _props.className;
	        var children = _props.children;
	        var style = _props.style;

	        var wrapCls = (0, _classnames2["default"])((_classNames = {}, (0, _defineProperty3["default"])(_classNames, '' + prefixCls, true), (0, _defineProperty3["default"])(_classNames, prefixCls + '-' + size, true), (0, _defineProperty3["default"])(_classNames, className, !!className), _classNames));
	        return React.createElement(
	            'div',
	            { className: wrapCls, style: style },
	            children
	        );
	    };

	    return WingBlank;
	}(React.Component);

	exports["default"] = WingBlank;

	WingBlank.defaultProps = {
	    prefixCls: 'am-wingblank',
	    size: 'lg'
	};
	module.exports = exports['default'];

/***/ },
/* 136 */,
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = undefined;

	var _defineProperty2 = __webpack_require__(5);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _classCallCheck2 = __webpack_require__(24);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(79);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _classnames = __webpack_require__(87);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _wingBlank = __webpack_require__(135);

	var _wingBlank2 = _interopRequireDefault(_wingBlank);

	var _flex = __webpack_require__(138);

	var _flex2 = _interopRequireDefault(_flex);

	var _toast = __webpack_require__(141);

	var _toast2 = _interopRequireDefault(_toast);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function noop() {}

	var ImagePicker = function (_React$Component) {
	    (0, _inherits3["default"])(ImagePicker, _React$Component);

	    function ImagePicker() {
	        (0, _classCallCheck3["default"])(this, ImagePicker);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        // http://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side
	        var _this = (0, _possibleConstructorReturn3["default"])(this, _React$Component.call.apply(_React$Component, [this].concat(args)));

	        _this.getOrientation = function (file, callback) {
	            if (!/iphone|ipad/i.test(navigator.userAgent)) {
	                callback('-1');
	            } else {
	                var reader = new FileReader();
	                reader.onload = function (e) {
	                    var view = new DataView(e.target.result);
	                    if (view.getUint16(0, false) !== 0xFFD8) {
	                        return callback(-2);
	                    }
	                    var length = view.byteLength;
	                    var offset = 2;
	                    while (offset < length) {
	                        var marker = view.getUint16(offset, false);
	                        offset += 2;
	                        if (marker === 0xFFE1) {
	                            var tmp = view.getUint32(offset += 2, false);
	                            if (tmp !== 0x45786966) {
	                                return callback(-1);
	                            }
	                            var little = view.getUint16(offset += 6, false) === 0x4949;
	                            offset += view.getUint32(offset + 4, little);
	                            var tags = view.getUint16(offset, little);
	                            offset += 2;
	                            for (var i = 0; i < tags; i++) {
	                                if (view.getUint16(offset + i * 12, little) === 0x0112) {
	                                    return callback(view.getUint16(offset + i * 12 + 8, little));
	                                }
	                            }
	                        } else if ((marker & 0xFF00) !== 0xFF00) {
	                            break;
	                        } else {
	                            offset += view.getUint16(offset, false);
	                        }
	                    }
	                    return callback(-1);
	                };
	                reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
	            }
	        };
	        _this.removeImage = function (index) {
	            var newImages = [];
	            _this.props.files.forEach(function (image, idx) {
	                if (index !== idx) {
	                    newImages.push(image);
	                }
	            });
	            _this.props.onChange(newImages, 'remove', index);
	        };
	        _this.addImage = function (imgItem) {
	            var newImages = _this.props.files.concat(imgItem);
	            _this.props.onChange(newImages, 'add');
	        };
	        _this.onFileChange = function () {
	            var fileSelectorEl = _this.refs.fileSelectorInput;
	            if (fileSelectorEl.files && fileSelectorEl.files.length) {
	                (function () {
	                    var file = fileSelectorEl.files[0];
	                    var reader = new FileReader();
	                    reader.onload = function (e) {
	                        var dataURL = e.target.result;
	                        if (!dataURL) {
	                            _toast2["default"].fail('图片获取失败');
	                            return;
	                        }
	                        var orientation = 1;
	                        _this.getOrientation(file, function (res) {
	                            // -2: not jpeg , -1: not defined
	                            if (res > 0) {
	                                orientation = res;
	                            }
	                            _this.addImage({
	                                url: dataURL,
	                                orientation: orientation
	                            });
	                            fileSelectorEl.value = '';
	                        });
	                    };
	                    reader.readAsDataURL(file);
	                })();
	            }
	        };
	        return _this;
	    }

	    ImagePicker.prototype.render = function render() {
	        var _classNames,
	            _this2 = this;

	        var _props = this.props;
	        var prefixCls = _props.prefixCls;
	        var style = _props.style;
	        var className = _props.className;
	        var files = _props.files;

	        var dpr = window.devicePixelRatio || 1;
	        var imgItemList = [];
	        var customWidth = (document.documentElement.clientWidth - 18 * dpr - 6 * dpr * 3) / 4;
	        var wrapCls = (0, _classnames2["default"])((_classNames = {}, (0, _defineProperty3["default"])(_classNames, '' + prefixCls, true), (0, _defineProperty3["default"])(_classNames, className, className), _classNames));
	        var itemStyle = {
	            width: customWidth + 'px',
	            height: customWidth + 'px'
	        };
	        files.forEach(function (image, index) {
	            imgItemList.push(React.createElement(
	                'div',
	                { key: index, className: prefixCls + '-item', style: itemStyle },
	                React.createElement('div', { className: prefixCls + '-item-remove', onClick: _this2.removeImage.bind(_this2, index) }),
	                React.createElement('div', { className: prefixCls + '-item-content', style: { backgroundImage: 'url(' + image.url + ')' } })
	            ));
	        });
	        return React.createElement(
	            'div',
	            { className: wrapCls, style: style },
	            React.createElement(
	                'div',
	                { className: prefixCls + '-list' },
	                React.createElement(
	                    _wingBlank2["default"],
	                    { size: 'md' },
	                    React.createElement(
	                        _flex2["default"],
	                        { wrap: 'wrap' },
	                        imgItemList,
	                        React.createElement(
	                            'div',
	                            { className: prefixCls + '-item ' + prefixCls + '-upload-btn', style: itemStyle },
	                            React.createElement('input', { style: itemStyle, ref: 'fileSelectorInput', type: 'file', accept: 'image/jpg,image/jpeg,image/png,image/gif', onChange: this.onFileChange })
	                        )
	                    )
	                )
	            )
	        );
	    };

	    return ImagePicker;
	}(React.Component);

	exports["default"] = ImagePicker;

	ImagePicker.defaultProps = {
	    prefixCls: 'am-image-picker',
	    files: [],
	    onChange: noop
	};
	module.exports = exports['default'];

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Flex = __webpack_require__(139);

	var _Flex2 = _interopRequireDefault(_Flex);

	var _FlexItem = __webpack_require__(140);

	var _FlexItem2 = _interopRequireDefault(_FlexItem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	_Flex2["default"].Item = _FlexItem2["default"];
	exports["default"] = _Flex2["default"];
	module.exports = exports['default'];

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = undefined;

	var _defineProperty2 = __webpack_require__(5);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _classCallCheck2 = __webpack_require__(24);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(79);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _classnames = __webpack_require__(87);

	var _classnames2 = _interopRequireDefault(_classnames);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var Flex = function (_React$Component) {
	    (0, _inherits3["default"])(Flex, _React$Component);

	    function Flex() {
	        (0, _classCallCheck3["default"])(this, Flex);
	        return (0, _possibleConstructorReturn3["default"])(this, _React$Component.apply(this, arguments));
	    }

	    Flex.prototype.render = function render() {
	        var _classNames;

	        var _props = this.props;
	        var direction = _props.direction;
	        var wrap = _props.wrap;
	        var justify = _props.justify;
	        var align = _props.align;
	        var alignContent = _props.alignContent;
	        var className = _props.className;
	        var children = _props.children;
	        var prefixCls = _props.prefixCls;
	        var style = _props.style;
	        var onClick = _props.onClick;

	        var wrapCls = (0, _classnames2["default"])((_classNames = {}, (0, _defineProperty3["default"])(_classNames, prefixCls, true), (0, _defineProperty3["default"])(_classNames, prefixCls + '-dir-row', direction === 'row'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-dir-row-reverse', direction === 'row-reverse'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-dir-column', direction === 'column'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-dir-column-reverse', direction === 'column-reverse'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-nowrap', wrap === 'nowrap'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-wrap', wrap === 'wrap'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-wrap-reverse', wrap === 'wrap-reverse'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-justify-start', justify === 'start'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-justify-end', justify === 'end'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-justify-center', justify === 'center'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-justify-between', justify === 'between'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-justify-around', justify === 'around'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-top', align === 'top' || align === 'start'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-middle', align === 'middle' || align === 'center'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-bottom', align === 'bottom' || align === 'end'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-baseline', align === 'baseline'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-stretch', align === 'stretch'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-content-start', alignContent === 'start'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-content-end', alignContent === 'end'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-content-center', alignContent === 'center'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-content-between', alignContent === 'between'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-content-around', alignContent === 'around'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-content-stretch', alignContent === 'stretch'), (0, _defineProperty3["default"])(_classNames, className, className), _classNames));
	        return React.createElement(
	            'div',
	            { className: wrapCls, style: style, onClick: onClick },
	            children
	        );
	    };

	    return Flex;
	}(React.Component);

	exports["default"] = Flex;

	Flex.propTypes = {
	    direction: _react.PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),
	    wrap: _react.PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),
	    justify: _react.PropTypes.oneOf(['start', 'end', 'center', 'between', 'around']),
	    align: _react.PropTypes.oneOf(['start', 'end', 'center', 'top', 'middle', 'bottom', 'baseline', 'stretch']),
	    alignContent: _react.PropTypes.oneOf(['start', 'end', 'center', 'between', 'around', 'stretch'])
	};
	Flex.defaultProps = {
	    prefixCls: 'am-flexbox',
	    align: 'center',
	    onClick: function onClick() {}
	};
	module.exports = exports['default'];

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = undefined;

	var _defineProperty2 = __webpack_require__(5);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _classCallCheck2 = __webpack_require__(24);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(25);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(79);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _classnames = __webpack_require__(87);

	var _classnames2 = _interopRequireDefault(_classnames);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var FlexItem = function (_React$Component) {
	    (0, _inherits3["default"])(FlexItem, _React$Component);

	    function FlexItem() {
	        (0, _classCallCheck3["default"])(this, FlexItem);
	        return (0, _possibleConstructorReturn3["default"])(this, _React$Component.apply(this, arguments));
	    }

	    FlexItem.prototype.render = function render() {
	        var _classNames;

	        var _props = this.props;
	        var children = _props.children;
	        var className = _props.className;
	        var prefixCls = _props.prefixCls;
	        var style = _props.style;
	        var onClick = _props.onClick;

	        var wrapCls = (0, _classnames2["default"])((_classNames = {}, (0, _defineProperty3["default"])(_classNames, prefixCls + '-item', true), (0, _defineProperty3["default"])(_classNames, className, className), _classNames));
	        return React.createElement(
	            'div',
	            { className: wrapCls, style: style, onClick: onClick },
	            children
	        );
	    };

	    return FlexItem;
	}(React.Component);

	exports["default"] = FlexItem;

	FlexItem.defaultProps = {
	    prefixCls: 'am-flexbox'
	};
	module.exports = exports['default'];

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _rcNotification = __webpack_require__(142);

	var _rcNotification2 = _interopRequireDefault(_rcNotification);

	var _icon = __webpack_require__(131);

	var _icon2 = _interopRequireDefault(_icon);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	var messageInstance = void 0;
	var prefixCls = 'am-toast';
	function getMessageInstance() {
	    messageInstance = _rcNotification2["default"].newInstance({
	        prefixCls: prefixCls,
	        style: { top: 0 },
	        transitionName: 'am-fade'
	    });
	    return messageInstance;
	}
	function notice(content, type) {
	    var duration = arguments.length <= 2 || arguments[2] === undefined ? 3 : arguments[2];
	    var _onClose = arguments[3];

	    var iconType = {
	        info: '',
	        success: 'check-circle-o',
	        fail: 'cross-circle-o',
	        offline: 'frown',
	        loading: 'loading'
	    }[type];
	    if (typeof duration === 'function') {
	        _onClose = duration;
	        duration = 3;
	    }
	    var instance = getMessageInstance();
	    instance.notice({
	        duration: duration,
	        style: {},
	        content: !!iconType ? React.createElement(
	            'div',
	            { className: prefixCls + '-text ' + prefixCls + '-text-icon' },
	            React.createElement(_icon2["default"], { type: iconType }),
	            React.createElement(
	                'div',
	                null,
	                content
	            )
	        ) : React.createElement(
	            'div',
	            { className: prefixCls + '-text' },
	            React.createElement(
	                'div',
	                null,
	                content
	            )
	        ),
	        onClose: function onClose() {
	            if (_onClose) {
	                _onClose();
	            }
	            instance.destroy();
	            instance = null;
	            messageInstance = null;
	        }
	    });
	}
	exports["default"] = {
	    SHORT: 3,
	    LONG: 8,
	    show: function show(content, duration) {
	        return notice(content, 'info', duration, function () {});
	    },
	    info: function info(content, duration, onClose) {
	        return notice(content, 'info', duration, onClose);
	    },
	    success: function success(content, duration, onClose) {
	        return notice(content, 'success', duration, onClose);
	    },
	    fail: function fail(content, duration, onClose) {
	        return notice(content, 'fail', duration, onClose);
	    },
	    offline: function offline(content, duration, onClose) {
	        return notice(content, 'offline', duration, onClose);
	    },
	    loading: function loading(content, duration, onClose) {
	        return notice(content, 'loading', duration, onClose);
	    },
	    hide: function hide() {
	        if (messageInstance) {
	            messageInstance.destroy();
	            messageInstance = null;
	        }
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Notification = __webpack_require__(143);

	var _Notification2 = _interopRequireDefault(_Notification);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	exports["default"] = _Notification2["default"];
	module.exports = exports['default'];

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _rcAnimate = __webpack_require__(144);

	var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

	var _createChainedFunction = __webpack_require__(153);

	var _createChainedFunction2 = _interopRequireDefault(_createChainedFunction);

	var _classnames = __webpack_require__(87);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _Notice = __webpack_require__(154);

	var _Notice2 = _interopRequireDefault(_Notice);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var seed = 0;
	var now = Date.now();

	function getUuid() {
	  return 'rcNotification_' + now + '_' + seed++;
	}

	var Notification = _react2["default"].createClass({
	  displayName: 'Notification',

	  propTypes: {
	    prefixCls: _react.PropTypes.string,
	    transitionName: _react.PropTypes.string,
	    animation: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]),
	    style: _react.PropTypes.object
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      prefixCls: 'rc-notification',
	      animation: 'fade',
	      style: {
	        top: 65,
	        left: '50%'
	      }
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      notices: []
	    };
	  },
	  getTransitionName: function getTransitionName() {
	    var props = this.props;
	    var transitionName = props.transitionName;
	    if (!transitionName && props.animation) {
	      transitionName = props.prefixCls + '-' + props.animation;
	    }
	    return transitionName;
	  },
	  add: function add(notice) {
	    var key = notice.key = notice.key || getUuid();
	    this.setState(function (previousState) {
	      var notices = previousState.notices;
	      if (!notices.filter(function (v) {
	        return v.key === key;
	      }).length) {
	        return {
	          notices: notices.concat(notice)
	        };
	      }
	    });
	  },
	  remove: function remove(key) {
	    this.setState(function (previousState) {
	      return {
	        notices: previousState.notices.filter(function (notice) {
	          return notice.key !== key;
	        })
	      };
	    });
	  },
	  render: function render() {
	    var _this = this,
	        _className;

	    var props = this.props;
	    var noticeNodes = this.state.notices.map(function (notice) {
	      var onClose = (0, _createChainedFunction2["default"])(_this.remove.bind(_this, notice.key), notice.onClose);
	      return _react2["default"].createElement(
	        _Notice2["default"],
	        _extends({
	          prefixCls: props.prefixCls
	        }, notice, {
	          onClose: onClose
	        }),
	        notice.content
	      );
	    });
	    var className = (_className = {}, _defineProperty(_className, props.prefixCls, 1), _defineProperty(_className, props.className, !!props.className), _className);
	    return _react2["default"].createElement(
	      'div',
	      { className: (0, _classnames2["default"])(className), style: props.style },
	      _react2["default"].createElement(
	        _rcAnimate2["default"],
	        { transitionName: this.getTransitionName() },
	        noticeNodes
	      )
	    );
	  }
	});

	Notification.newInstance = function newNotificationInstance(properties) {
	  var props = properties || {};
	  var div = document.createElement('div');
	  document.body.appendChild(div);
	  var notification = _reactDom2["default"].render(_react2["default"].createElement(Notification, props), div);
	  return {
	    notice: function notice(noticeProps) {
	      notification.add(noticeProps);
	    },
	    removeNotice: function removeNotice(key) {
	      notification.remove(key);
	    },

	    component: notification,
	    destroy: function destroy() {
	      _reactDom2["default"].unmountComponentAtNode(div);
	      document.body.removeChild(div);
	    }
	  };
	};

	exports["default"] = Notification;
	module.exports = exports['default'];

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// export this package's api
	module.exports = __webpack_require__(145);

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _ChildrenUtils = __webpack_require__(146);

	var _AnimateChild = __webpack_require__(147);

	var _AnimateChild2 = _interopRequireDefault(_AnimateChild);

	var _util = __webpack_require__(152);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var defaultKey = 'rc_animate_' + Date.now();


	function getChildrenFromProps(props) {
	  var children = props.children;
	  if (_react2["default"].isValidElement(children)) {
	    if (!children.key) {
	      return _react2["default"].cloneElement(children, {
	        key: defaultKey
	      });
	    }
	  }
	  return children;
	}

	function noop() {}

	var Animate = _react2["default"].createClass({
	  displayName: 'Animate',

	  propTypes: {
	    component: _react2["default"].PropTypes.any,
	    animation: _react2["default"].PropTypes.object,
	    transitionName: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.object]),
	    transitionEnter: _react2["default"].PropTypes.bool,
	    transitionAppear: _react2["default"].PropTypes.bool,
	    exclusive: _react2["default"].PropTypes.bool,
	    transitionLeave: _react2["default"].PropTypes.bool,
	    onEnd: _react2["default"].PropTypes.func,
	    onEnter: _react2["default"].PropTypes.func,
	    onLeave: _react2["default"].PropTypes.func,
	    onAppear: _react2["default"].PropTypes.func,
	    showProp: _react2["default"].PropTypes.string
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      animation: {},
	      component: 'span',
	      transitionEnter: true,
	      transitionLeave: true,
	      transitionAppear: false,
	      onEnd: noop,
	      onEnter: noop,
	      onLeave: noop,
	      onAppear: noop
	    };
	  },
	  getInitialState: function getInitialState() {
	    this.currentlyAnimatingKeys = {};
	    this.keysToEnter = [];
	    this.keysToLeave = [];
	    return {
	      children: (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(this.props))
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    var showProp = this.props.showProp;
	    var children = this.state.children;
	    if (showProp) {
	      children = children.filter(function (child) {
	        return !!child.props[showProp];
	      });
	    }
	    children.forEach(function (child) {
	      if (child) {
	        _this.performAppear(child.key);
	      }
	    });
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    var _this2 = this;

	    this.nextProps = nextProps;
	    var nextChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(nextProps));
	    var props = this.props;
	    // exclusive needs immediate response
	    if (props.exclusive) {
	      Object.keys(this.currentlyAnimatingKeys).forEach(function (key) {
	        _this2.stop(key);
	      });
	    }
	    var showProp = props.showProp;
	    var currentlyAnimatingKeys = this.currentlyAnimatingKeys;
	    // last props children if exclusive
	    var currentChildren = props.exclusive ? (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props)) : this.state.children;
	    // in case destroy in showProp mode
	    var newChildren = [];
	    if (showProp) {
	      currentChildren.forEach(function (currentChild) {
	        var nextChild = currentChild && (0, _ChildrenUtils.findChildInChildrenByKey)(nextChildren, currentChild.key);
	        var newChild = void 0;
	        if ((!nextChild || !nextChild.props[showProp]) && currentChild.props[showProp]) {
	          newChild = _react2["default"].cloneElement(nextChild || currentChild, _defineProperty({}, showProp, true));
	        } else {
	          newChild = nextChild;
	        }
	        if (newChild) {
	          newChildren.push(newChild);
	        }
	      });
	      nextChildren.forEach(function (nextChild) {
	        if (!nextChild || !(0, _ChildrenUtils.findChildInChildrenByKey)(currentChildren, nextChild.key)) {
	          newChildren.push(nextChild);
	        }
	      });
	    } else {
	      newChildren = (0, _ChildrenUtils.mergeChildren)(currentChildren, nextChildren);
	    }

	    // need render to avoid update
	    this.setState({
	      children: newChildren
	    });

	    nextChildren.forEach(function (child) {
	      var key = child && child.key;
	      if (child && currentlyAnimatingKeys[key]) {
	        return;
	      }
	      var hasPrev = child && (0, _ChildrenUtils.findChildInChildrenByKey)(currentChildren, key);
	      if (showProp) {
	        var showInNext = child.props[showProp];
	        if (hasPrev) {
	          var showInNow = (0, _ChildrenUtils.findShownChildInChildrenByKey)(currentChildren, key, showProp);
	          if (!showInNow && showInNext) {
	            _this2.keysToEnter.push(key);
	          }
	        } else if (showInNext) {
	          _this2.keysToEnter.push(key);
	        }
	      } else if (!hasPrev) {
	        _this2.keysToEnter.push(key);
	      }
	    });

	    currentChildren.forEach(function (child) {
	      var key = child && child.key;
	      if (child && currentlyAnimatingKeys[key]) {
	        return;
	      }
	      var hasNext = child && (0, _ChildrenUtils.findChildInChildrenByKey)(nextChildren, key);
	      if (showProp) {
	        var showInNow = child.props[showProp];
	        if (hasNext) {
	          var showInNext = (0, _ChildrenUtils.findShownChildInChildrenByKey)(nextChildren, key, showProp);
	          if (!showInNext && showInNow) {
	            _this2.keysToLeave.push(key);
	          }
	        } else if (showInNow) {
	          _this2.keysToLeave.push(key);
	        }
	      } else if (!hasNext) {
	        _this2.keysToLeave.push(key);
	      }
	    });
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    var keysToEnter = this.keysToEnter;
	    this.keysToEnter = [];
	    keysToEnter.forEach(this.performEnter);
	    var keysToLeave = this.keysToLeave;
	    this.keysToLeave = [];
	    keysToLeave.forEach(this.performLeave);
	  },
	  performEnter: function performEnter(key) {
	    // may already remove by exclusive
	    if (this.refs[key]) {
	      this.currentlyAnimatingKeys[key] = true;
	      this.refs[key].componentWillEnter(this.handleDoneAdding.bind(this, key, 'enter'));
	    }
	  },
	  performAppear: function performAppear(key) {
	    if (this.refs[key]) {
	      this.currentlyAnimatingKeys[key] = true;
	      this.refs[key].componentWillAppear(this.handleDoneAdding.bind(this, key, 'appear'));
	    }
	  },
	  handleDoneAdding: function handleDoneAdding(key, type) {
	    var props = this.props;
	    delete this.currentlyAnimatingKeys[key];
	    // if update on exclusive mode, skip check
	    if (props.exclusive && props !== this.nextProps) {
	      return;
	    }
	    var currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props));
	    if (!this.isValidChildByKey(currentChildren, key)) {
	      // exclusive will not need this
	      this.performLeave(key);
	    } else {
	      if (type === 'appear') {
	        if (_util2["default"].allowAppearCallback(props)) {
	          props.onAppear(key);
	          props.onEnd(key, true);
	        }
	      } else {
	        if (_util2["default"].allowEnterCallback(props)) {
	          props.onEnter(key);
	          props.onEnd(key, true);
	        }
	      }
	    }
	  },
	  performLeave: function performLeave(key) {
	    // may already remove by exclusive
	    if (this.refs[key]) {
	      this.currentlyAnimatingKeys[key] = true;
	      this.refs[key].componentWillLeave(this.handleDoneLeaving.bind(this, key));
	    }
	  },
	  handleDoneLeaving: function handleDoneLeaving(key) {
	    var props = this.props;
	    delete this.currentlyAnimatingKeys[key];
	    // if update on exclusive mode, skip check
	    if (props.exclusive && props !== this.nextProps) {
	      return;
	    }
	    var currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props));
	    // in case state change is too fast
	    if (this.isValidChildByKey(currentChildren, key)) {
	      this.performEnter(key);
	    } else {
	      var end = function end() {
	        if (_util2["default"].allowLeaveCallback(props)) {
	          props.onLeave(key);
	          props.onEnd(key, false);
	        }
	      };
	      /* eslint react/no-is-mounted:0 */
	      if (this.isMounted() && !(0, _ChildrenUtils.isSameChildren)(this.state.children, currentChildren, props.showProp)) {
	        this.setState({
	          children: currentChildren
	        }, end);
	      } else {
	        end();
	      }
	    }
	  },
	  isValidChildByKey: function isValidChildByKey(currentChildren, key) {
	    var showProp = this.props.showProp;
	    if (showProp) {
	      return (0, _ChildrenUtils.findShownChildInChildrenByKey)(currentChildren, key, showProp);
	    }
	    return (0, _ChildrenUtils.findChildInChildrenByKey)(currentChildren, key);
	  },
	  stop: function stop(key) {
	    delete this.currentlyAnimatingKeys[key];
	    var component = this.refs[key];
	    if (component) {
	      component.stop();
	    }
	  },
	  render: function render() {
	    var props = this.props;
	    this.nextProps = props;
	    var stateChildren = this.state.children;
	    var children = null;
	    if (stateChildren) {
	      children = stateChildren.map(function (child) {
	        if (child === null || child === undefined) {
	          return child;
	        }
	        if (!child.key) {
	          throw new Error('must set key for <rc-animate> children');
	        }
	        return _react2["default"].createElement(
	          _AnimateChild2["default"],
	          {
	            key: child.key,
	            ref: child.key,
	            animation: props.animation,
	            transitionName: props.transitionName,
	            transitionEnter: props.transitionEnter,
	            transitionAppear: props.transitionAppear,
	            transitionLeave: props.transitionLeave
	          },
	          child
	        );
	      });
	    }
	    var Component = props.component;
	    if (Component) {
	      var passedProps = props;
	      if (typeof Component === 'string') {
	        passedProps = {
	          className: props.className,
	          style: props.style
	        };
	      }
	      return _react2["default"].createElement(
	        Component,
	        passedProps,
	        children
	      );
	    }
	    return children[0] || null;
	  }
	});

	exports["default"] = Animate;
	module.exports = exports['default'];

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.toArrayChildren = toArrayChildren;
	exports.findChildInChildrenByKey = findChildInChildrenByKey;
	exports.findShownChildInChildrenByKey = findShownChildInChildrenByKey;
	exports.findHiddenChildInChildrenByKey = findHiddenChildInChildrenByKey;
	exports.isSameChildren = isSameChildren;
	exports.mergeChildren = mergeChildren;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function toArrayChildren(children) {
	  var ret = [];
	  _react2["default"].Children.forEach(children, function (child) {
	    ret.push(child);
	  });
	  return ret;
	}

	function findChildInChildrenByKey(children, key) {
	  var ret = null;
	  if (children) {
	    children.forEach(function (child) {
	      if (ret) {
	        return;
	      }
	      if (child && child.key === key) {
	        ret = child;
	      }
	    });
	  }
	  return ret;
	}

	function findShownChildInChildrenByKey(children, key, showProp) {
	  var ret = null;
	  if (children) {
	    children.forEach(function (child) {
	      if (child && child.key === key && child.props[showProp]) {
	        if (ret) {
	          throw new Error('two child with same key for <rc-animate> children');
	        }
	        ret = child;
	      }
	    });
	  }
	  return ret;
	}

	function findHiddenChildInChildrenByKey(children, key, showProp) {
	  var found = 0;
	  if (children) {
	    children.forEach(function (child) {
	      if (found) {
	        return;
	      }
	      found = child && child.key === key && !child.props[showProp];
	    });
	  }
	  return found;
	}

	function isSameChildren(c1, c2, showProp) {
	  var same = c1.length === c2.length;
	  if (same) {
	    c1.forEach(function (child, index) {
	      var child2 = c2[index];
	      if (child && child2) {
	        if (child && !child2 || !child && child2) {
	          same = false;
	        } else if (child.key !== child2.key) {
	          same = false;
	        } else if (showProp && child.props[showProp] !== child2.props[showProp]) {
	          same = false;
	        }
	      }
	    });
	  }
	  return same;
	}

	function mergeChildren(prev, next) {
	  var ret = [];

	  // For each key of `next`, the list of keys to insert before that key in
	  // the combined list
	  var nextChildrenPending = {};
	  var pendingChildren = [];
	  prev.forEach(function (child) {
	    if (child && findChildInChildrenByKey(next, child.key)) {
	      if (pendingChildren.length) {
	        nextChildrenPending[child.key] = pendingChildren;
	        pendingChildren = [];
	      }
	    } else {
	      pendingChildren.push(child);
	    }
	  });

	  next.forEach(function (child) {
	    if (child && nextChildrenPending.hasOwnProperty(child.key)) {
	      ret = ret.concat(nextChildrenPending[child.key]);
	    }
	    ret.push(child);
	  });

	  ret = ret.concat(pendingChildren);

	  return ret;
	}

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _cssAnimation = __webpack_require__(148);

	var _cssAnimation2 = _interopRequireDefault(_cssAnimation);

	var _util = __webpack_require__(152);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var transitionMap = {
	  enter: 'transitionEnter',
	  appear: 'transitionAppear',
	  leave: 'transitionLeave'
	};

	var AnimateChild = _react2["default"].createClass({
	  displayName: 'AnimateChild',

	  propTypes: {
	    children: _react2["default"].PropTypes.any
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    this.stop();
	  },
	  componentWillEnter: function componentWillEnter(done) {
	    if (_util2["default"].isEnterSupported(this.props)) {
	      this.transition('enter', done);
	    } else {
	      done();
	    }
	  },
	  componentWillAppear: function componentWillAppear(done) {
	    if (_util2["default"].isAppearSupported(this.props)) {
	      this.transition('appear', done);
	    } else {
	      done();
	    }
	  },
	  componentWillLeave: function componentWillLeave(done) {
	    if (_util2["default"].isLeaveSupported(this.props)) {
	      this.transition('leave', done);
	    } else {
	      // always sync, do not interupt with react component life cycle
	      // update hidden -> animate hidden ->
	      // didUpdate -> animate leave -> unmount (if animate is none)
	      done();
	    }
	  },
	  transition: function transition(animationType, finishCallback) {
	    var _this = this;

	    var node = _reactDom2["default"].findDOMNode(this);
	    var props = this.props;
	    var transitionName = props.transitionName;
	    var nameIsObj = (typeof transitionName === 'undefined' ? 'undefined' : _typeof(transitionName)) === 'object';
	    this.stop();
	    var end = function end() {
	      _this.stopper = null;
	      finishCallback();
	    };
	    if ((_cssAnimation.isCssAnimationSupported || !props.animation[animationType]) && transitionName && props[transitionMap[animationType]]) {
	      var name = nameIsObj ? transitionName[animationType] : transitionName + '-' + animationType;
	      var activeName = name + '-active';
	      if (nameIsObj && transitionName[animationType + 'Active']) {
	        activeName = transitionName[animationType + 'Active'];
	      }
	      this.stopper = (0, _cssAnimation2["default"])(node, {
	        name: name,
	        active: activeName
	      }, end);
	    } else {
	      this.stopper = props.animation[animationType](node, end);
	    }
	  },
	  stop: function stop() {
	    var stopper = this.stopper;
	    if (stopper) {
	      this.stopper = null;
	      stopper.stop();
	    }
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	exports["default"] = AnimateChild;
	module.exports = exports['default'];

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _Event = __webpack_require__(149);

	var _Event2 = _interopRequireDefault(_Event);

	var _componentClasses = __webpack_require__(150);

	var _componentClasses2 = _interopRequireDefault(_componentClasses);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var isCssAnimationSupported = _Event2["default"].endEvents.length !== 0;


	var capitalPrefixes = ['Webkit', 'Moz', 'O',
	// ms is special .... !
	'ms'];
	var prefixes = ['-webkit-', '-moz-', '-o-', 'ms-', ''];

	function getStyleProperty(node, name) {
	  var style = window.getComputedStyle(node);

	  var ret = '';
	  for (var i = 0; i < prefixes.length; i++) {
	    ret = style.getPropertyValue(prefixes[i] + name);
	    if (ret) {
	      break;
	    }
	  }
	  return ret;
	}

	function fixBrowserByTimeout(node) {
	  if (isCssAnimationSupported) {
	    var transitionDelay = parseFloat(getStyleProperty(node, 'transition-delay')) || 0;
	    var transitionDuration = parseFloat(getStyleProperty(node, 'transition-duration')) || 0;
	    var animationDelay = parseFloat(getStyleProperty(node, 'animation-delay')) || 0;
	    var animationDuration = parseFloat(getStyleProperty(node, 'animation-duration')) || 0;
	    var time = Math.max(transitionDuration + transitionDelay, animationDuration + animationDelay);
	    // sometimes, browser bug
	    node.rcEndAnimTimeout = setTimeout(function () {
	      node.rcEndAnimTimeout = null;
	      if (node.rcEndListener) {
	        node.rcEndListener();
	      }
	    }, time * 1000 + 200);
	  }
	}

	function clearBrowserBugTimeout(node) {
	  if (node.rcEndAnimTimeout) {
	    clearTimeout(node.rcEndAnimTimeout);
	    node.rcEndAnimTimeout = null;
	  }
	}

	var cssAnimation = function cssAnimation(node, transitionName, endCallback) {
	  var nameIsObj = (typeof transitionName === 'undefined' ? 'undefined' : _typeof(transitionName)) === 'object';
	  var className = nameIsObj ? transitionName.name : transitionName;
	  var activeClassName = nameIsObj ? transitionName.active : transitionName + '-active';
	  var end = endCallback;
	  var start = void 0;
	  var active = void 0;
	  var nodeClasses = (0, _componentClasses2["default"])(node);

	  if (endCallback && Object.prototype.toString.call(endCallback) === '[object Object]') {
	    end = endCallback.end;
	    start = endCallback.start;
	    active = endCallback.active;
	  }

	  if (node.rcEndListener) {
	    node.rcEndListener();
	  }

	  node.rcEndListener = function (e) {
	    if (e && e.target !== node) {
	      return;
	    }

	    if (node.rcAnimTimeout) {
	      clearTimeout(node.rcAnimTimeout);
	      node.rcAnimTimeout = null;
	    }

	    clearBrowserBugTimeout(node);

	    nodeClasses.remove(className);
	    nodeClasses.remove(activeClassName);

	    _Event2["default"].removeEndEventListener(node, node.rcEndListener);
	    node.rcEndListener = null;

	    // Usually this optional end is used for informing an owner of
	    // a leave animation and telling it to remove the child.
	    if (end) {
	      end();
	    }
	  };

	  _Event2["default"].addEndEventListener(node, node.rcEndListener);

	  if (start) {
	    start();
	  }
	  nodeClasses.add(className);

	  node.rcAnimTimeout = setTimeout(function () {
	    node.rcAnimTimeout = null;
	    nodeClasses.add(activeClassName);
	    if (active) {
	      setTimeout(active, 0);
	    }
	    fixBrowserByTimeout(node);
	    // 30ms for firefox
	  }, 30);

	  return {
	    stop: function stop() {
	      if (node.rcEndListener) {
	        node.rcEndListener();
	      }
	    }
	  };
	};

	cssAnimation.style = function (node, style, callback) {
	  if (node.rcEndListener) {
	    node.rcEndListener();
	  }

	  node.rcEndListener = function (e) {
	    if (e && e.target !== node) {
	      return;
	    }

	    if (node.rcAnimTimeout) {
	      clearTimeout(node.rcAnimTimeout);
	      node.rcAnimTimeout = null;
	    }

	    clearBrowserBugTimeout(node);

	    _Event2["default"].removeEndEventListener(node, node.rcEndListener);
	    node.rcEndListener = null;

	    // Usually this optional callback is used for informing an owner of
	    // a leave animation and telling it to remove the child.
	    if (callback) {
	      callback();
	    }
	  };

	  _Event2["default"].addEndEventListener(node, node.rcEndListener);

	  node.rcAnimTimeout = setTimeout(function () {
	    for (var s in style) {
	      if (style.hasOwnProperty(s)) {
	        node.style[s] = style[s];
	      }
	    }
	    node.rcAnimTimeout = null;
	    fixBrowserByTimeout(node);
	  }, 0);
	};

	cssAnimation.setTransition = function (node, p, value) {
	  var property = p;
	  var v = value;
	  if (value === undefined) {
	    v = property;
	    property = '';
	  }
	  property = property || '';
	  capitalPrefixes.forEach(function (prefix) {
	    node.style[prefix + 'Transition' + property] = v;
	  });
	};

	cssAnimation.isCssAnimationSupported = isCssAnimationSupported;

	exports["default"] = cssAnimation;
	module.exports = exports['default'];

/***/ },
/* 149 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var EVENT_NAME_MAP = {
	  transitionend: {
	    transition: 'transitionend',
	    WebkitTransition: 'webkitTransitionEnd',
	    MozTransition: 'mozTransitionEnd',
	    OTransition: 'oTransitionEnd',
	    msTransition: 'MSTransitionEnd'
	  },

	  animationend: {
	    animation: 'animationend',
	    WebkitAnimation: 'webkitAnimationEnd',
	    MozAnimation: 'mozAnimationEnd',
	    OAnimation: 'oAnimationEnd',
	    msAnimation: 'MSAnimationEnd'
	  }
	};

	var endEvents = [];

	function detectEvents() {
	  var testEl = document.createElement('div');
	  var style = testEl.style;

	  if (!('AnimationEvent' in window)) {
	    delete EVENT_NAME_MAP.animationend.animation;
	  }

	  if (!('TransitionEvent' in window)) {
	    delete EVENT_NAME_MAP.transitionend.transition;
	  }

	  for (var baseEventName in EVENT_NAME_MAP) {
	    if (EVENT_NAME_MAP.hasOwnProperty(baseEventName)) {
	      var baseEvents = EVENT_NAME_MAP[baseEventName];
	      for (var styleName in baseEvents) {
	        if (styleName in style) {
	          endEvents.push(baseEvents[styleName]);
	          break;
	        }
	      }
	    }
	  }
	}

	if (typeof window !== 'undefined' && typeof document !== 'undefined') {
	  detectEvents();
	}

	function addEventListener(node, eventName, eventListener) {
	  node.addEventListener(eventName, eventListener, false);
	}

	function removeEventListener(node, eventName, eventListener) {
	  node.removeEventListener(eventName, eventListener, false);
	}

	var TransitionEvents = {
	  addEndEventListener: function addEndEventListener(node, eventListener) {
	    if (endEvents.length === 0) {
	      window.setTimeout(eventListener, 0);
	      return;
	    }
	    endEvents.forEach(function (endEvent) {
	      addEventListener(node, endEvent, eventListener);
	    });
	  },


	  endEvents: endEvents,

	  removeEndEventListener: function removeEndEventListener(node, eventListener) {
	    if (endEvents.length === 0) {
	      return;
	    }
	    endEvents.forEach(function (endEvent) {
	      removeEventListener(node, endEvent, eventListener);
	    });
	  }
	};

	exports["default"] = TransitionEvents;
	module.exports = exports['default'];

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	try {
	  var index = __webpack_require__(151);
	} catch (err) {
	  var index = __webpack_require__(151);
	}

	/**
	 * Whitespace regexp.
	 */

	var re = /\s+/;

	/**
	 * toString reference.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Wrap `el` in a `ClassList`.
	 *
	 * @param {Element} el
	 * @return {ClassList}
	 * @api public
	 */

	module.exports = function(el){
	  return new ClassList(el);
	};

	/**
	 * Initialize a new ClassList for `el`.
	 *
	 * @param {Element} el
	 * @api private
	 */

	function ClassList(el) {
	  if (!el || !el.nodeType) {
	    throw new Error('A DOM element reference is required');
	  }
	  this.el = el;
	  this.list = el.classList;
	}

	/**
	 * Add class `name` if not already present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.add = function(name){
	  // classList
	  if (this.list) {
	    this.list.add(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (!~i) arr.push(name);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove class `name` when present, or
	 * pass a regular expression to remove
	 * any which match.
	 *
	 * @param {String|RegExp} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.remove = function(name){
	  if ('[object RegExp]' == toString.call(name)) {
	    return this.removeMatching(name);
	  }

	  // classList
	  if (this.list) {
	    this.list.remove(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (~i) arr.splice(i, 1);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove all classes matching `re`.
	 *
	 * @param {RegExp} re
	 * @return {ClassList}
	 * @api private
	 */

	ClassList.prototype.removeMatching = function(re){
	  var arr = this.array();
	  for (var i = 0; i < arr.length; i++) {
	    if (re.test(arr[i])) {
	      this.remove(arr[i]);
	    }
	  }
	  return this;
	};

	/**
	 * Toggle class `name`, can force state via `force`.
	 *
	 * For browsers that support classList, but do not support `force` yet,
	 * the mistake will be detected and corrected.
	 *
	 * @param {String} name
	 * @param {Boolean} force
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.toggle = function(name, force){
	  // classList
	  if (this.list) {
	    if ("undefined" !== typeof force) {
	      if (force !== this.list.toggle(name, force)) {
	        this.list.toggle(name); // toggle again to correct
	      }
	    } else {
	      this.list.toggle(name);
	    }
	    return this;
	  }

	  // fallback
	  if ("undefined" !== typeof force) {
	    if (!force) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  } else {
	    if (this.has(name)) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  }

	  return this;
	};

	/**
	 * Return an array of classes.
	 *
	 * @return {Array}
	 * @api public
	 */

	ClassList.prototype.array = function(){
	  var className = this.el.getAttribute('class') || '';
	  var str = className.replace(/^\s+|\s+$/g, '');
	  var arr = str.split(re);
	  if ('' === arr[0]) arr.shift();
	  return arr;
	};

	/**
	 * Check if class `name` is present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.has =
	ClassList.prototype.contains = function(name){
	  return this.list
	    ? this.list.contains(name)
	    : !! ~index(this.array(), name);
	};


/***/ },
/* 151 */
/***/ function(module, exports) {

	module.exports = function(arr, obj){
	  if (arr.indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 152 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var util = {
	  isAppearSupported: function isAppearSupported(props) {
	    return props.transitionName && props.transitionAppear || props.animation.appear;
	  },
	  isEnterSupported: function isEnterSupported(props) {
	    return props.transitionName && props.transitionEnter || props.animation.enter;
	  },
	  isLeaveSupported: function isLeaveSupported(props) {
	    return props.transitionName && props.transitionLeave || props.animation.leave;
	  },
	  allowAppearCallback: function allowAppearCallback(props) {
	    return props.transitionAppear || props.animation.appear;
	  },
	  allowEnterCallback: function allowEnterCallback(props) {
	    return props.transitionEnter || props.animation.enter;
	  },
	  allowLeaveCallback: function allowLeaveCallback(props) {
	    return props.transitionLeave || props.animation.leave;
	  }
	};
	exports["default"] = util;
	module.exports = exports['default'];

/***/ },
/* 153 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Safe chained function
	 *
	 * Will only create a new function if needed,
	 * otherwise will pass back existing functions or null.
	 *
	 * @returns {function|null}
	 */
	function createChainedFunction() {
	  var args = arguments;
	  return function chainedFunction() {
	    for (var i = 0; i < args.length; i++) {
	      if (args[i] && args[i].apply) {
	        args[i].apply(this, arguments);
	      }
	    }
	  };
	}

	module.exports = createChainedFunction;

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(87);

	var _classnames2 = _interopRequireDefault(_classnames);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var Notice = _react2["default"].createClass({
	  displayName: 'Notice',

	  propTypes: {
	    duration: _react.PropTypes.number,
	    onClose: _react.PropTypes.func,
	    children: _react.PropTypes.any
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      onEnd: function onEnd() {},
	      onClose: function onClose() {},

	      duration: 1.5,
	      style: {
	        right: '50%'
	      }
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    if (this.props.duration) {
	      this.closeTimer = setTimeout(function () {
	        _this.close();
	      }, this.props.duration * 1000);
	    }
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    this.clearCloseTimer();
	  },
	  clearCloseTimer: function clearCloseTimer() {
	    if (this.closeTimer) {
	      clearTimeout(this.closeTimer);
	      this.closeTimer = null;
	    }
	  },
	  close: function close() {
	    this.clearCloseTimer();
	    this.props.onClose();
	  },
	  render: function render() {
	    var _className;

	    var props = this.props;
	    var componentClass = props.prefixCls + '-notice';
	    var className = (_className = {}, _defineProperty(_className, '' + componentClass, 1), _defineProperty(_className, componentClass + '-closable', props.closable), _defineProperty(_className, props.className, !!props.className), _className);
	    return _react2["default"].createElement(
	      'div',
	      { className: (0, _classnames2["default"])(className), style: props.style },
	      _react2["default"].createElement(
	        'div',
	        { className: componentClass + '-content' },
	        props.children
	      ),
	      props.closable ? _react2["default"].createElement(
	        'a',
	        { tabIndex: '0', onClick: this.close, className: componentClass + '-close' },
	        _react2["default"].createElement('span', { className: componentClass + '-close-x' })
	      ) : null
	    );
	  }
	});

	exports["default"] = Notice;
	module.exports = exports['default'];

/***/ }
/******/ ]);