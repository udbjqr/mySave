/*
import React from 'react'
import {render} from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/zepto/1.0.0/zepto.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
*/
import ImagePicker from 'antd-mobile/lib/image-picker';
import WhiteSpace from 'antd-mobile/lib/white-space';
import cropper from '../../js/mobile/cropper/dist/cropper.js';

var url = "/otcdyanmic/appraisals.do?v=" + generateMixed(5);
var currturl = window.location.href;  //获取当前url
var daydate = geturl('day'); //走访时间
var parenturl1 = "testproducts.html?custom_id=" + geturl('custom_id') + "&plan_id=" + geturl('plan_id') + "&day=" + daydate;

var Saveproducts = React.createClass({
    getInitialState: function () {
        return {
            Y_login: true,  //是否登录
            unStuck: "",
            referrer: topreurl(parenturl1), //上一页
            custom_id: geturl('custom_id'),
            plan_id: geturl('plan_id'),
            goods_id: geturl('goods_id'),
            visits_id: geturl('visits_id'),
            goodsName: geturl('goodsName'),
            detail_id: "",         //产品id
            goods_name: "",       //产品名
            purchase_source: "",  //进货来源
            display_surface: "",  //陈列面
            weighted_price: "",   //加价权
            purchase_number: "",  //进货数量
            tag_price: "",        //标签价
            image_urls: "",       //图片
            display_number: "",   //陈列数
            real_stock: "",       //实际库存 
            remark: "",           //备注
            //shop_point:"",      //铺点数
            //sail_total:"" ,     // 销售额
            batch_number: "",     //批号
            isloding: true,
            isclick: true,
            photoArr:"",
        }
    },

    componentDidMount: function () {
        var $this=this;
       
        $(document).attr("title", this.state.goodsName + "-品牌俱乐部");
        

        $(".Upload_btn").delegate('#filephoto', 'change', function () {
            this.clickpoto();
        }.bind(this));

        //获取数据
        this.pubsub_token = PubSub.subscribe('changprodupub', function (topic, newItem) {
            this.setState({
                unStuck: newItem.unStuck,
                detail_id: isnull(newItem.detail_id),    //产品id
                goods_name: newItem.goods_name,  //产品名
                purchase_source: newItem.purchase_source,  //进货来源
                display_surface: newItem.display_surface,  //陈列面
                weighted_price: newItem.weighted_price,    //加价权
                purchase_number: newItem.purchase_number,   //进货数量
                tag_price: newItem.tag_price,               //标签价
                image_urls: newItem.image_urls,         //图片
                display_number: newItem.display_number,     //陈列数
                real_stock: newItem.real_stock,            //实际库存 
                remark: newItem.remark,
                //shop_point:newItem.shop_point,               //铺点数
                //sail_total:newItem.sail_total ,          // 销售额
                batch_number: newItem.batch_number       //批号
            });
            // if (newItem.detail_id != "" && newItem.detail_id != null && newItem.detail_id != undefined) {


            $("#display_surface").val(newItem.display_surface);   //陈列面
            $("#display_number").val(newItem.display_number);    //陈列数
            $("#real_stock").val(newItem.real_stock);     //实际库存 
            $("#weighted_price").val(newItem.weighted_price);   // 加价权
            $("#tag_price").val(newItem.tag_price);     //标签价

            $("#purchase_number").val(newItem.purchase_number);  //进货数量
            $("#purchase_source").val(newItem.purchase_source);  //进货来源
            $("#batch_number").val(newItem.batch_number);   //批号
            $("#remark_text").val(newItem.remark);   //备注
            var imgsrc = newItem.image_urls;
            if (imgsrc != "" && imgsrc.length > 0) {


                //单个
                if (imgsrc.indexOf(";") == -1) {  //单个
                    var photoname = todourl(imgsrc)
                    $(".Upload_photos").append('<div class="previewimg" id="products1"><div class="imgwarp"> <img data-src="' + imgsrc + '"  data-name="' + photoname + '" src="' + isnullimg(imgsrc) + '"/><span class="imgclose"></span></div></div><p class="imgnum fn-hide1">1</p>');
                    // this.lrzimg("/otc/"+imgsrc);
                }
                //单个结束


                //多个 
                if (imgsrc.indexOf(";") > -1) {  //多个

                    var imgspit = imgsrc.split(";");

                    for (var i = 0; i <= imgspit.length - 1; i++) {

                        $(".Upload_photos").append('<div class="previewimg" id="products' + (i + 1) + '"><div class="imgwarp"> <img data-src="' + imgspit[i] + '"  data-name="' + imgspit[i] + '" src="' + isnullimg(imgspit[i]) + '"/><span class="imgclose"></span></div><p class="imgnum fn-hide1">' + (i + 1) + '</p></div>');
                        //this.lrzimg("/otc/" + imgspit[i], todourl(imgspit[i]));

                    }

                }
                //多个结束
             $(".imgwarp").delegate('.imgclose', 'click', function () {
                
             var $this1=$(this).parent().parent()
             $this.removeimg($this1);
            })
            }

            // }

        }.bind(this));

    },

    componentWillUnmount: function () {
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
    clickpoto: function () {

        var $images = $('#cutoutphoto');
        //获取图片
        var preview, img_txt, file_head = document.getElementById("filephoto"), picture = file_head.value;
        var $inputImage = $('#filephoto');
        file_head.select();



        var preview_src;
        //获取图片url
        if (file_head.files && file_head.files[0]) {
            preview_src = window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1 ? window.webkitURL.createObjectURL(file_head.files[0]) : window.URL.createObjectURL(file_head.files[0]);
        } else {
            img_txt = document.selection.createRange().text;

            preview_src = img_txt;
            document.selection.empty()
        }

        //获取图片url结束

        //获取图片名
        var pos1 = picture.lastIndexOf("\\");

        var pos2 = picture.lastIndexOf(".");

        var pos = picture.substring(pos1 + 1, pos2);
        var photoname = picture.substring(pos1 + 1, picture.length);
        //$("#preview").attr("data-name", photoname);
        //获取图片名结束

        var $images = $('#cutoutphoto');
        //压缩图片
        var $this = this;
        var img = new Image();
        img.src = preview_src;
        var rqi = ".divPhoto";
        if (img.complete) {
            var imgwd = img.width;

            if (imgwd > 640) {
                lrz(preview_src, { width: 640 })
                    .then(function (rst) {
                        // 处理成功会执行
                        $("#cutoutphoto").attr("src", rst.base64);
                        $("#cutoutphoto").attr("data-name", photoname);

                        // $('.cropconter').animate({ "left": "0px" }, 1000);
                        $('#yourElement').css("-webkit-transform", "translateX(0%)");
                        //裁剪图片
                        $images.cropper({
                            aspectRatio: 1 / 1,
                            autoCropArea: 0.9,
                            background: false,
                            guides: false,
                            rotatable: false,
                            movable: true,
                            dragCrop: false,
                            resizable: false
                        });

                        /*
                                layer.open({
                                    shade: true,
                                    content: '头像上传中...',
                                    skin: 'msg',
                                    className: 'tip',
                                });
                                 $this.ajaxphoto(rst.base64, photoname, $this);
                                 */

                        //  $(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
                        //$("#preview").attr("src", rst.base64);

                    })
                    .catch(function (err) {
                        // 处理失败会执行
                    })
                    .always(function () {
                        // 不管是成功失败，都会执行
                    });
            }

            if (imgwd <= 640) {
                lrz(preview_src)
                    .then(function (rst) {
                        // 处理成功会执行
                        $("#cutoutphoto").attr("src", rst.base64);
                        $("#cutoutphoto").attr("data-name", photoname);
                        // $('.cropconter').animate({ "left": "0px" }, 1000);
                        $('#yourElement').css("-webkit-transform", "translateX(0%)");
                        //裁剪图片
                        $images.cropper({
                            aspectRatio: 1 / 1,
                            autoCropArea: 0.9,
                            background: false,
                            guides: false,
                            rotatable: false,
                            movable: true,
                            dragCrop: false,
                            resizable: false
                        });
                        /*
                                 layer.open({
                                    shade: true,
                                    content: '头像上传中...',
                                    skin: 'msg',
                                    className: 'tip',
                                });
                                
                                 $this.ajaxphoto(rst.base64, photoname, $this);
                                 */
                        //$(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
                        //$("#preview").attr("src", rst.base64);
                    })
                    .catch(function (err) {
                        // 处理失败会执行
                    })
                    .always(function () {
                        // 不管是成功失败，都会执行
                    });
            }


        } else {
            img.onload = function () {
                var imgwd1 = img.width;

                if (imgwd1 > 640) {
                    lrz(preview_src, { width: 640 })
                        .then(function (rst) {
                            // 处理成功会执行
                            $("#cutoutphoto").attr("src", rst.base64);
                            $("#cutoutphoto").attr("data-name", photoname);
                            // $('.cropconter').animate({ "left": "0px" }, 1000);
                            $('#yourElement').css("-webkit-transform", "translateX(0%)");
                            //裁剪图片
                            $images.cropper({
                                aspectRatio: 1 / 1,
                                autoCropArea: 0.9,
                                background: false,
                                guides: false,
                                rotatable: false,
                                movable: true,
                                dragCrop: false,
                                resizable: false
                            });
                            /*
                             layer.open({
                            shade: true,
                            content: '头像上传中...',
                            skin: 'msg',
                            className: 'tip',
                        });
                         $this.ajaxphoto(rst.base64, photoname, $this);
                         */
                            //$(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
                            // $("#preview").attr("src", rst.base64);

                        })
                        .catch(function (err) {
                            // 处理失败会执行
                        })
                        .always(function () {
                            // 不管是成功失败，都会执行
                        });
                }
                if (imgwd1 <= 640) {
                    lrz(preview_src)
                        .then(function (rst) {
                            // 处理成功会执行
                            $("#cutoutphoto").attr("src", rst.base64);
                            $("#cutoutphoto").attr("data-name", photoname);
                            // $('.cropconter').animate({ "left": "0px" }, 1000);
                            $('#yourElement').css("-webkit-transform", "translateX(0%)");
                            //裁剪图片
                            $images.cropper({
                                aspectRatio: 1 / 1,
                                autoCropArea: 0.9,
                                background: false,
                                guides: false,
                                rotatable: false,
                                movable: true,
                                dragCrop: false,
                                resizable: false
                            });
                            /*
                             layer.open({
                            shade: true,
                            content: '头像上传中...',
                            skin: 'msg',
                            className: 'tip',
                        });
                        $this.ajaxphoto(rst.base64, photoname, $this);
                        */
                            //$(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
                            //$("#preview").attr("src", rst.base64);
                        })
                        .catch(function (err) {
                            // 处理失败会执行
                        })
                        .always(function () {
                            // 不管是成功失败，都会执行
                        });
                }

                img.onload = null;

            };
        };


    },

    check: function () {
        var display_surface = $("#display_surface").val();   //陈列面
        var display_number = $("#display_number").val();    //陈列数
        var real_stock = $("#real_stock").val();     //实际库存 
        var weighted_price = $("#weighted_price").val();   // 加价权
        var tag_price = $("#tag_price").val();     //标签价
        var sail_number = $("#sail_number").val();  //销售总额
        var purchase_number = $("#purchase_number").val();  //进货数量
        var purchase_source = $("#purchase_source").val();  //进货来源
        var batch_number = $("#batch_number").val();   //批号
        var image_urls = $("#preview").attr("src");  //图片
        var fileName = $("#preview").attr("data-name");  //图片名字
        var remark = $("#remark_text").val();   //备注
        var reg = /^([1-9]\d*|[0]{1,1})$/; //判断正整数:（包括0） 
        var reg1 = /^\d+(\.\d+)?$/;   //判断数字:（包括小数点） 
        var reg2 = /^[A-Za-z0-9]+$/;  //匹配由数字和26个英文字母组成的字符串
        if (display_surface == "" && display_surface.length <= 0) {
            layer.open({
                shade: true,
                content: '陈列面不能为空',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        if (!reg.exec(display_surface)) {
            layer.open({
                shade: true,
                content: '陈列面值必须为数字',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
            return false;
        }
        if (display_number == "" && display_number.length <= 0) {
            layer.open({
                shade: true,
                content: '陈列数不能为空',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        if (!reg.exec(display_number)) {
            layer.open({
                shade: true,
                content: '陈列数值必须为数字',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
            return false;
        }
        if (real_stock == "" && real_stock.length <= 0) {
            layer.open({
                shade: true,
                content: '实际库存不能为空',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        if (!reg.exec(real_stock)) {
            layer.open({
                shade: true,
                content: '实际库存值必须为数字',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
            return false;
        }
        if (weighted_price == "" && weighted_price.length <= 0) {
            layer.open({
                shade: true,
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
                shade: true,
                content: '标签价不能为空',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        if (!reg1.exec(tag_price)) {
            layer.open({
                shade: true,
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
                shade: true,
                content: '进货数量不能为空',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        if (!reg.exec(purchase_number)) {
            layer.open({
                shade: true,
                content: '进货数量值必须为数字',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
            return false;
        }
        /*
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
        */
        /*
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
    */
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
                shade: true,
                content: '图片不能为空',
                skin: 'msg',
                className: 'tip',
                time: 2 //2秒后自动关闭
            });
            return false;
        }

        else {

            if (this.state.isclick) {
                this.saveinfo();
                setTimeout(function () {
                    if (this.state.isloding) {
                        layer.open({
                            shade: true,
                            content: '正在保存信息...',
                            skin: 'msg',
                            className: 'tip',
                        });
                    }
                }.bind(this), 1000)

            }


        }


    },
    //上传图片
    ajaxphoto: function (img, imgname, str) {
        this.setState({  //禁止点击
            isclick: false,
        })
        var $this = str;
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "uploadImg";
        object.base64Img = img;
        object.fileName = imgname;
        var showbox = this.refs.content;
        var referrer = this.state.referrer;
        //上传图片ajax
        ajaxFn(object, $this, function (data) {

            console.log("上传图片成功")
            $(".layermcont").html("上传图片成功");
            $this.cancelcropper();
            setTimeout(function () {
                layer.closeAll();
            }, 1000);
            var j = $(".Upload_photos").find(".imgwarp").length;

            var imgsrc = isnullimg1(data.map.filePath);
            $(".Upload_photos").append('<div class="previewimg" id="products' + (j + 1) + '"><div class="imgwarp"><img  data-src="' + imgsrc + '"  data-name="' + imgname + '" src="' + imgsrc + '"/><span class="imgclose"></span></div><p class="imgnum fn-hide1">' + (j + 1) + '</p></div>');
            $(".imgwarp").delegate('.imgclose', 'click', function () {
            var $this1=$(this).parent().parent()
             $this.removeimg($this1);
            })
            $this.setState({
                isclick: true
            });
        }, url, showbox, referrer)

        //上传图片ajax结束
    },
     removeimg:function(str){
    var imgnums = parseInt($(".Upload_photos").find(".imgwarp").length); //图片数
      var photoId=str.attr("id")
      var id= parseInt(str.find(".imgnum").html());
      str.remove();
       console.log("id:"+id+";imgnums:"+imgnums);
      for(var i=id+1;i<=imgnums; i++){
	 console.log(i)
    $("#products"+i).find(".imgnum").html((i-1));
	$("#products"+i).attr("id","#products"+(i-1));

	
	}

     },

    //保存数据ajax
    saveinfo: function () {
        var $this = this;

        this.setState({  //禁止点击
            isclick: false,
        })
        var unStuck = this.state.unStuck
        var display_surface = $("#display_surface").val();   //陈列面
        var display_number = $("#display_number").val();    //陈列数
        var real_stock = $("#real_stock").val();     //实际库存 
        //var weighted_price = $("#weighted_price").val();   // 加价权
        var tag_price = $("#tag_price").val();     //标签价
        var sail_number = $("#sail_number").val();  //销售总额
        var purchase_number = $("#purchase_number").val();  //进货数量
        var purchase_source = $("#purchase_source").val();  //进货来源
        var batch_number = $("#batch_number").val();   //批号
        var image_urls = "";  //图片
        var fileName = "";  //图片名字
        var imgnums = $(".Upload_photos").find(".imgwarp").length;

        if (imgnums == 1) {
            image_urls = $(".Upload_photos").find(".imgwarp img").attr("data-src");
        }
        if (imgnums > 1) {
            $.each($(".Upload_photos .previewimg"), function (i, n) {
                if (i == imgnums - 1) {
                    image_urls += $(this).find(".imgwarp img").attr("data-src");
                }
                else {
                    image_urls += $(this).find(".imgwarp img").attr("data-src") + ";";
                }
            })
        }

        var remark = $("#remark_text").val();   //备注
      //var shop_point=$("#shop_point").attr("data-name");  //铺点数
      //var sail_total=$("#sail_total").attr("data-name");  //销售额
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "add";
        object.goods_id = this.state.goods_id;
        object.visits_id = this.state.visits_id;
        object.display_surface = display_surface;   //陈列面
        object.display_number = display_number;    //陈列数
        object.real_stock = real_stock;     //实际库存 
     // object.weighted_price = weighted_price;   // 加价权
        object.tag_price = tag_price;     //标签价
        object.sail_number = sail_number;  //销售总额
        object.purchase_number = purchase_number;  //进货数量
        object.purchase_source = purchase_source;  //进货来源
        object.batch_number = batch_number;   //批号
        object.remark = remark;//

        object.fileNames = image_urls;
        var detail_id = this.state.detail_id;

        if (detail_id != "" && detail_id != null && detail_id != undefined) {
            object.detail_id = detail_id;
        }
        var showbox = this.refs.content;
        // 保存信息ajax
        ajaxFn(object, $this, function (data) {

            layer.closeAll();
            layer.open({
                shade: true,
                content: '保存数据成功',
                skin: 'msg',
                className: 'tip',
                time: 2
            });
            setTimeout(function () {
                window.location.href =$this.state.referrer;
                //location.reload();
                $this.setState({
                    isclick: true
                });
            }, 2000);
        }, url, showbox, this.state.referrer)
        // 保存信息ajax结束  
    },

    save: function () {

        this.check();
        // window.location.href = "productarticle.html";
    },
    cancelcropper: function () {
        $('#yourElement').css("-webkit-transform", "translateX(180%)");
        setTimeout(function () {
            var $images = $('#cutoutphoto');
            $(".crophoto").html("<img id='cutoutphoto' data-name='' src='' />");
            $images.cropper('reset').cropper('replace', "");
            $('#yourElement').removeClass('selecteds');
        }, 600);


    },

    confirmcropper: function () {

        var photourl = "";
        var $images = $('#cutoutphoto');
        //$images.cropper("enable");
        var photo_name = $images.attr("data-name");
        var $this = this
        var croppedCanvas = $images.cropper('getCroppedCanvas');
        photourl = croppedCanvas.toDataURL();
        var $this = this;

        if (this.state.isclick) {
            layer.open({
                shade: true,
                content: '图片上传中...',
                skin: 'msg',
                className: 'tip',
            });
            $this.ajaxphoto(photourl, photo_name, $this);
        }

    },
    changes:function(event){
    var id=event.currentTarget.getAttribute("id")
    $("#"+id).removeClass("black")
    
    },
    render: function () {
        return (
            <div>
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    {this.state.goodsName}
                </div>
                <div ref="content">
                    <h1 className="saveprodt_Title ">库存</h1>
                    <div className="profile pro_border ">
                        <dl className="white profile_pading save_input" id="save_input">
                            <dt><label>陈列面：</label><input className="pdt_input  black" id="display_surface" onChange={this.changes} placeholder="请输入" /></dt>

                        </dl>
                        <dl className="white profile_pading save_input" id="save_input">

                            <dt><label>陈列数：</label><input className="pdt_input black" id="display_number" onChange={this.changes} placeholder="请输入" /></dt>
                        </dl>
                        <dl className="white profile_pading save_input" id="save_input">
                            <dt><label>实际库存：</label><input className="pdt_input black" id="real_stock" onChange={this.changes}  placeholder="请输入" /></dt>
                        </dl>
                        <dl className="white save_input profile_pading" id="save_input">
                            <dt><label>标签价：</label><input className="pdt_input  black" id="tag_price" onChange={this.changes}  placeholder="请输入" /></dt>
                            {/*<dd><label>铺点数：</label><input className="pdt_input" id="shop_point"  placeholder="请输入"/></dd>*/}
                        </dl>
                        {/*
                    <dl className="white save_input profile_pading" id="save_input">
                        <dt><span><label>销售总额：</label><input className="pdt_input" id="sail_total"  placeholder="请输入"/></span></dt>
                        <dd></dd>
                    </dl>
                    */}
                    </div>
                    <h1 className="saveprodt_Title  ">进货</h1>
                    <div className="profile pro_border ">
                        <dl className="white save_input profile_pading" id="save_input">
                            <dt><label>进货数量：</label><input className="pdt_input  black" id="purchase_number" onChange={this.changes}  placeholder="请输入" /></dt>

                        </dl>
                        <dl className="white save_input profile_pading" id="save_input">

                            <dt><label>进货来源：</label><input className="pdt_input  black" id="purchase_source" onChange={this.changes}  placeholder="请输入" /></dt>
                        </dl>
                        <dl className="white save_input profile_pading" id="save_input">
                            <dt><label>批号：</label><input className="pdt_input  black" id="batch_number" onChange={this.changes}  placeholder="请输入" /></dt>

                        </dl>

                        <h1 className="saveprodt_Title  ">备注</h1>
                        <textarea name="remark_text" className="remark black" id="remark_text" cols="450" rows="5" onChange={this.changes}  placeholder="请输入你要纪录的内容"></textarea>

                    </div>

                    <h1 className="saveprodt_Title  ">上传图片</h1>
                    <div className="white margint_1r Upload_photo">
                        <div className="Upload_photos">

                        </div>

                        <div className="Upload_btn">
                            <input type="file" capture="camera" accept="image/*" id="filephoto" name="filephoto" />
                        </div>
                    </div>
                  
                    <button className="fn-btn" onTouchEnd={this.save} >保存</button>


                    <div className="yourElements" id="yourElement">
                        <div className="crophoto">
                            <img id="cutoutphoto" data-name="" src="" />
                        </div>

                        <div className="cropbtn">
                            <p><span className="btnN" onTouchStart={this.cancelcropper}>取消</span><span className="btnY" onTouchStart={this.confirmcropper}>确认</span></p>
                        </div>

                    </div>
                </div>
            </div>

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




