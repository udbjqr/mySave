import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import cropper from '../../js/mobile/cropper/dist/cropper.js'
//antd-mobile/lib/search-bar'
var url = "/otcdyanmic/employee.do";
var avatarurl = "/otcdyanmic/wechatGetImg.do";
var currturl = window.location.href;  //获取当前url
var MyAvatar = React.createClass({
    render: function () {
        return (
            <div>
            <Avatar />
            </div>
        )
    }

});


var Avatar = React.createClass({
    getInitialState: function () {
        return {
            referrer: topreurl("myinformation.html"),//上一页
            head_portrait:""
            //update: geturl('update'),
        };
    },

    componentDidMount: function () {
        this.getinfo();
        var avaUrl = sessionStorage.getItem("avatar");
        console.log(avaUrl);
        $("#preview").attr("src", avaUrl);
        
        //this.getwxavatar("");
        $(".Head_portrait").delegate('#filephoto', 'change', function () {
            console.log("上传");
            this.clickpoto();
        }.bind(this));
        $(".cropbtn").delegate('.btnY', 'click', function () {

            $('.cropconter').animate({ "left": "10000px" }, 1000);
            var photourl = "";
            var $images = $('#cutoutphoto');
            //$images.cropper("enable");
            var photo_name = $images.attr("data-name");
            var $this = this

            setTimeout(function () {
                layer.open({
                    shade: true,
                    content: '头像上传中...',
                    skin: 'msg',
                    className: 'tip',
                });
                var croppedCanvas = $images.cropper('getCroppedCanvas');
                photourl = croppedCanvas.toDataURL();
                this.iscrop(photourl, photo_name);
            }.bind(this), 500)
        }.bind(this));

        $(".cropbtn").delegate('.btnN', 'click', function () {
            var $images = $('#cutoutphoto');
            $(".crophoto").html("<img id='cutoutphoto' data-name='' src='' />");
            $images.cropper('reset').cropper('replace', "");
            $('.cropconter').animate({ "left": "10000px" }, 1000);
        }.bind(this));
        $(".Head_portrait").delegate('.refresh_avatar', 'click', function () {
            console.log("微信");
            this.getavatar();
        }.bind(this));
    },
    getinfo: function () {
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "load";
        $.ajax({
            url: url,
            data: { paramMap: JSON.stringify(object) },
            type: "post",
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (this.isMounted()) {
                    if (data != "" && data != null && data != undefined) {
                        //获取用户默认信息成功
                        if (data.success == true) {
                            console.log("获取成功")
                            //设置属性
                            this.setState({
                                head_portrait: isnullheadimg(data.map.employee.headPortrait)
                            });


                        }
                        //获取信息失败
                        if (data.success == false) {
                            //未登录
                            if (data.errorCode == "1") {
                                var dodatate = generateMixed(6)
                                //window.location.href = wxurl(dodatate);
                            }
                            //未登录结束
                            //设置属性
                            console.log("获取信息失败")
                        }
                    }

                } // this.isMounted() End
            }.bind(this),
            error: function () {
                if (this.isMounted()) {
                    layer.open({
                        shade: false,
                        content: '获取用户默认信息失败',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    console.log("获取用户默认信息失败：网络错误")
                }
            }.bind(this)
        });
    },
    //点击上传图片
    clickpoto: function () {
        var $images = $('#cutoutphoto');
        //获取图片
        var preview, img_txt, file_head = document.getElementById("filephoto"), picture = file_head.value;
        var $inputImage = $('#filephoto');
        file_head.select();

        var pos1 = picture.lastIndexOf("\\");

        var pos2 = picture.lastIndexOf(".");

        var pos = picture.substring(pos1 + 1, pos2);
        var photoname = picture.substring(pos1 + 1, picture.length);
        $("#cutoutphoto").attr("data-name", photoname);

        var preview_src;
        //获取图片url
        if (preview = document.getElementById("cutoutphoto"), file_head.files && file_head.files[0]) {
            preview_src = window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1 ? window.URL.createObjectURL(file_head.files[0]) : window.URL.createObjectURL(file_head.files[0]);
        } else {
            img_txt = document.selection.createRange().text;

            preview_src = img_txt;
            document.selection.empty()
        }
        console.log(preview_src);
        //获取图片url结束

        //压缩图片
        lrz(preview_src, { width: 640 })
            .then(function (rst) {
                // 处理成功会执行
                $("#cutoutphoto").attr("src", rst.base64);
                $('.cropconter').animate({ "left": "0px" }, 1000);
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

            })
            .catch(function (err) {
                // 处理失败会执行
            })
            .always(function () {
                // 不管是成功失败，都会执行
            });
    },

    ajaxphoto: function (photourl, photoname) {
        var $images = $('#cutoutphoto');
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "update";
        object.headPortrait = photourl;
        object.fileName = photoname;
        $.ajax({
            url: url,
            data: { paramMap: JSON.stringify(object) },
            type: "post",
            dataType: "json",
            success: function (data) {
                if (this.isMounted()) {
                    if (data != "" && data != null && data != undefined) {
                        //用户上传头像成功
                        if (data.success == true) {
                            console.log("上传头像成功")
                            $(".layermcont").html("上传头像成功");

                            setTimeout(function () {
                                layer.closeAll();
                            }, 1000);

                            $("#preview").attr("src", photourl);
                            $(".crophoto").html("<img id='cutoutphoto' data-name='' src='' />");
                            $images.cropper('reset').cropper('replace', "");
                        }
                        //用户上传头像失败
                        if (data.success == false) {
                            //未登录
                            if (data.errorCode == "1") {
                                var dodatate = generateMixed(6)
                                window.location.href = wxurl(dodatate);
                            }
                            //未登录结束
                            layer.open({
                                shade: false,
                                content: '上传头像失败，请重新上传' + data.msg,
                                skin: 'msg',
                                className: 'tip',
                                time: 5 //2秒后自动关闭
                            });
                            console.log("上传个人头像失败")
                            $(".crophoto").html("<img id='cutoutphoto' data-name='' src='' />");
                            $images.cropper('reset').cropper('replace', "");
                        }
                    }

                } // this.isMounted() End
            }.bind(this),
            complete: function (XMLHttpRequest, status) { //请求完成后最终执行参数
                if (status == 'timeout') {//超时,status还有success,error等值的情况
                    layer.open({
                        shade: false,
                        content: '上传头像失败，上传超时，请重新上传',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    console.log("上传个人头像失败，上传超时")
                    $(".crophoto").html("<img id='cutoutphoto' data-name='' src='' />");
                    $images.cropper('reset').cropper('replace', "");
                }
            },
            error: function () {
                if (this.isMounted()) {
                    layer.open({
                        shade: false,
                        content: '上传头像失败，网络出现错误,请重新上传',
                        skin: 'msg',
                        className: 'tip',
                        time: 2 //2秒后自动关闭
                    });
                    console.log("上传个人头像失败：网络出现错误")
                    $(".crophoto").html("<img id='cutoutphoto' data-name='' src='' />");
                    $images.cropper('reset').cropper('replace', "");
                }
            }.bind(this)
        });
    },
    iscrop: function (y, n) {
        if (y != "" || y != null || y != undefined) {
            this.ajaxphoto(y, n);
        }

        if (y == "") {

            setimeOut(function () {
                this.iscrop(y);
            }, 1000)
        }
    },
    getavatar: function(){
        setTimeout(function () {
            var dodatate=generateMixed(6);
            console.log(dodatate);
            window.location.href =wxauth(dodatate);
        }, 320);
        //sessionStorage.getItem("avatar", isnull(data.map.avatar));
        //$("#preview").attr("src", "avatar");
    },
    //根据code获取头像
    getwxavatar: function (code){
      var object = new Object();
      object.code =code;
      console.log(code);
      $.ajax({
        url: avatarurl,
        data: { paramMap: JSON.stringify(object) },
        type: "post",
        dataType: "json",
        success: function (data) {
          console.log(data);
            if (data != "" && data != null && data != undefined) {
              //用户获取信息成功
              if (data.success == true) {
                console.log("获取头像成功")
                //设置属性
                    if (data.map.imgUrl != "" && data.map.imgUrl != null && data.map.imgUrl != undefined) {
                    console.log("获取头像成功")
                    $("#preview").attr("src", data.map.imgUrl)
                    }else{
                    console.log("code已过期，获取头像为空")
                    }
                //sessionStorage.setItem("avatar", isnull(data.map.imgUrl));
                //window.location.href=backtourl;
              }
              //用户获取信息失败
              if (data.success == false) {

                console.log("获取信息失败;" + isnull(data.map.imgUrl));
              }
            }
            else {
               var failetext="内部异常！请返回重新登录"
               //$("#conter").html(Datafaile(failetext,backtourl));   
              
            }

         
        }.bind(this),
        error: function () {
          console.log("2");
          var failetext="获取登录信息失败：网络错误！请返回重新登录"
          $("#conter").html(Datafaile(failetext,backtourl));   
            console.log("获取登录信息失败：网络错误")
          
        }.bind(this)
      });
    },
    render: function () {
        return (
            <div id="myAvatar">
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    <span className="updateTitle" >修改头像</span>
                </div>
                <div className="profile Head_portrait" id="Head_portraitimg">
                    <img id="preview" src={this.state.head_portrait}/>
                </div>
                <div className="profile Head_portrait" id="operatePanel">
                    <div className="upload_block">
                        <span className="upload_btn">本地上传</span>
                        <input type="file" capture="camera" accept="image/*" id="filephoto" name="filephoto" />
                    </div>
                    <div className="refresh_avatar">使用微信头像</div>
                    
                </div>

                <div className="cropconter">
                    <div className="crophoto">
                        <img id="cutoutphoto" data-name="" src="" />
                    </div>

                    <div className="cropbtn">
                        <p><span className="btnN" >取消</span><span className="btnY">确认</span></p>
                    </div>
                </div>

            </div>
        );


    }
});





ReactDOM.render(
    <MyAvatar />,
    document.getElementById('conter')
);




