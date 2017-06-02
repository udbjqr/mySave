

  //通用ajax
/*
returnData 传递的参数
$this   获取当前this
callback  回调函数
javaUrl  ajax url链接
showbox  显示错误信息的div
backurl  返回上一页的url
*/
function ajaxFn1(returnData, $this, callback, javaUrl, showbox, backurl, other) {
    //$this = this
    $.ajax({
        type: "post",
        url: javaUrl,
        data: { paramMap: JSON.stringify(returnData) },
        dataType: "json",
        //async: false,	//false 表示ajax执行完成之后在执行后面的代码
        success: function (data) {

            //数据为空
            if (isnull(data) == "") { //数据为空
                showbox.innerHTML = "没有数据";
                $this.setState({
                    isload: false,
                    isclick: true  //允许按钮点击
                });
                return false;
            }
            //数据为空结束

            //数据不为空时
            if (isnull(data) != "") { //数据不为空
                if (data.success) {
                    callback.call($this, data);

                    return false;
                }

                if (!data.success) {/*首先判断这个属性，错误在判断原因*/
                    layer.closeAll();
                    switch (data.errorCode) {
                        case (1):
                            layer.open({
                                shade: false,
                                content: '用户未登录或过期，<br>2秒后将自动重新登录',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //3秒后自动关闭
                            });
                            setTimeout(function () {
                                var dodatate = generateMixed(6) //获取随机数
                                window.location.href = wxurl(dodatate); //跳转到微信链接
                            }, 3000)
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (2):
                            layer.open({
                                shade: true,
                                content: "绑定的账号或密码错误！",
                                skin: 'msg',
                                className: 'tip',
                                time: 2//2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (3):
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (4):
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (5):
                            layer.open({
                                shade: true,
                                content: '相关数据未填写完整！请修改重试',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });

                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (6):
                            layer.open({
                                shade: true,
                                content: '未识别的用户操作类型',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });

                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (7):
                            showbox.innerHTML = showmsg({
                                msg: "当前用户没有此操作权限！",
                                classname: "",
                                isbtn: true,
                                url: backurl,
                                btntext: "立即返回",
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (8):
                            showbox.innerHTML = showmsg({
                                msg: "请求参数出现异常！",
                                classname: "",
                                isbtn: true,
                                url: backurl,
                                btntext: "立即返回",
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (9):
                            layer.open({
                                shade: true,
                                content: '相关数据未填写完整！请修改重试',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            //Modal.info({ title: '提示：', content: '相关数据未填写完整，请检查！' });
                            break;
                        case (11):
                            layer.open({
                                shade: true,
                                content: '登录发生异常！请返回重新登录',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                             case (12):
                              showbox.innerHTML = showmsg({
                                msg: "当前账号已停用！",
                                classname: "",
                                isbtn: true,
                                url: backurl,
                                btntext: "立即返回",
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                             break;
                        case (150):
                            layer.open({
                                shade: true,
                                content: '相关信息不存在',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });

                            break;
                        case (151):
                            layer.open({
                                shade: true,
                                content: "此用户已经绑定过其他微信！不能再进行绑定！",
                                skin: 'msg',
                                className: 'tip',
                                time: 2//2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (152):
                            if (isnull(sessionStorage.getItem("OpenID")) == "") {
                                sessionStorage.setItem("OpenID", isnull(data.openId));
                            }
                            layer.open({
                                shade: true,
                                content: '此微信号未绑定！2秒后自动跳转到绑定页面！',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });
                            setTimeout(function () {
                                window.location.href = "login.html";//前往绑定页面
                            }, 2000)
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (163):
                            layer.open({
                                shade: true,
                                content: '"非“驳回”或“未提交”状态不能操作！',
                                skin: 'msg',
                                className: 'tip',
                                time: 2 //2秒后自动关闭
                            });
                            setTimeout(function () {
                                $("#dl_" + other).removeClass('selected');


                            }, 3000)
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (164):
                            layer.open({
                                shade: false,
                                content: '已存在审核通过计划，不能再次新增！',
                                skin: 'msg',
                                className: 'tip',
                                time: 3 //3秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (169):
                            var dodatate = generateMixed(6) //获取随机数
                            var backloginurl = wxurl();
                            showbox.innerHTML = showmsg({
                                msg: "用户已过期，请返回重新登录！",
                                classname: "",
                                isbtn: true,
                                url: backloginurl,
                                btntext: "立即返回",
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (170):
                            layer.open({
                                shade: true,
                                content: "此用户已经与微信号绑定过,请直接登录！",
                                skin: 'msg',
                                className: 'tip',
                                time: 2//2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (171):
                            layer.open({
                                shade: true,
                                content: "内部异常，请重新绑定！",
                                skin: 'msg',
                                className: 'tip',
                                time: 2//2秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                        case (172):  //存在未签出的拜访计划！
                            layer.open({
                                shade: false,
                                content: '存在未签出的拜访计划！',
                                skin: 'msg',
                                className: 'tip',
                                time: 3 //3秒后自动关闭
                            });
                            $this.setState({
                                isload: false,
                                isclick: true,  //允许按钮点击
                            });
                            break;
                        default:
                             showbox.innerHTML = showmsg({
                                msg: "出现系统异常，请联系管理员！",
                                classname: "",
                                isbtn: true,
                                url: backurl,
                                btntext: "立即返回",
                            });
                            $this.setState({
                                isload: false,
                                isclick: true  //允许按钮点击
                            });
                            break;
                    }  //switch结束
                    // return false;
                }
            }
            //数据不为空时结束 

        },
        error: function (jqXHR, textStatus, errorThrown) {
            layer.closeAll();

            var Datafailed = "";
            console.log("textStatus:" + textStatus);
            console.log("errorThrown:" + errorThrown);
            switch (textStatus) {
                case "timeout":
                    showbox.innerHTML = showmsg({
                        msg: "获取信息失败，网络超时，请检查你的网络是否连接正常！",
                        classname: "",
                        isbtn: true,
                        showimg: "../images/mobile/nonetwork.png"
                    });
                    $this.setState({
                        isload: false,
                        isclick: true  //允许按钮点击
                    });
                    break;

                default:
                    showbox.innerHTML = showmsg({
                        msg: "出现系统异常，请检查你的网络是否连接正常！",
                        classname: "",
                        isbtn: true,
                    });
                    $this.setState({
                        isload: false,
                        isclick: true  //允许按钮点击
                    });
                    break;
            }
            // console.log("错误信息：" + textStatus);
        }
    });
    return true;
}