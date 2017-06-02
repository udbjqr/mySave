import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'

var url = "/otcdyanmic/documents.do";

var currturl = window.location.href;  //获取当前url
var Photoshare = React.createClass({
    getInitialState: function () {
        return {
            Y_login: true,  //是否登录
            referrer: topreurl("index.html"), //上一页
            Columns: isnull(geturl('Columns')),
            imgtype: "证书图片",  //切换栏目
            value: '',
            isload: false,
            moreload: false,
            isclick: true,
            page: "",
            isnextpage: "",
            showtype: 1
        };
    },
    componentDidMount: function () {

        if (this.state.Columns != "Photoshare") {  //搜索不显示初始值
            var imgtype = this.state.imgtype;
            var value = this.state.value;
            this.getinfo(1, 1, imgtype, value);
            var $this = this;
            setTimeout(function () {
                if ($this.state.isload == true && $this.state.moreload == false) {
                    $this.refs.photoshar.innerHTML = loading;
                }
            }, 500);
        }

        $("#photoshar").delegate('#loadmore', 'click', function () {

            $this.setState({
                moreload: true,
            });


            setTimeout(function () {

                if ($this.state.moreload == true && $this.state.isload == false) {
                    $("#loadmore").html(loadingmore);
                    //$this.refs.loadmore.innerHTML = loadingmore;
                }
            }, 500);

            $this.loadmore();
        });
        var width = document.body.scrollWidth;

        $(".fancybox-thumbs").fancybox({
            width: "300",
            height: "600",
            overlayOpacity: "0.9",
            overlayColor: "#333",
            overlayShow: true,
            showCloseButton: true,
            transitionIn: 'elastic', //窗口显示的方式 
            transitionOut: 'elastic',
            autoScale: true,
            showNavArrows: true,
            titlePosition: 'inside',
            centerOnScroll: true
        });
        //接收搜索数据
        this.pubsub_token = PubSub.subscribe('changsearch', function (topic, newItem) {
            this.setState({
                value: newItem.searchname,
                imgtype: newItem.imgtype,
            });
            this.onSubmit();
        }.bind(this));
        //接收搜索数据
    },
    //清除接收搜索数据
    componentWillUnmount: function () {
        PubSub.unsubscribe(this.pubsub_token);
    },
    switnav: function (event) {
        if (this.state.isclick) {


            var nav_id = event.target.getAttribute("id");
            $("#" + nav_id).attr("class", "switnav_current").siblings(".switnav span").removeAttr("class", "switnav_current");
            var navcolumns = $("#" + nav_id).attr("data-name");
            this.setState({
                imgtype: navcolumns,  //切换栏目
                value: '',
                isclick: false,
                isload: true
            });
            ajaxdong("正在加载信息...", this);
            var value = this.state.value;
            this.getinfo(1, 1, navcolumns, value);

        }
    },

    onChange: function (value) {
        this.setState({ value });
    },
    clear: function () {
        this.setState({ value: '' });
    },
    //搜索
    onSubmit: function () {
        var $this = this;
        var searchname = this.state.value;
        layer.open({
            content: "搜索中",
            shade: true,
            skin: 'msg',
            className: 'tip',
        });

        //设置是搜索还是查询
        if (searchname == "") {
            this.setState({
                showtype: 1,
            });
        }
        else {
            this.setState({
                showtype: 2,
            });
        }
        //设置是搜索还是查询结束


        var imgtype = this.state.imgtype;
        //this.refs.photoshar.innerHTML = "";
        setTimeout(function () {
            if ($this.state.isclick) {
                $this.setState({  //禁止点击
                    isclick: false,
                })
                $this.getinfo(2, 1, imgtype, searchname);
            }
        }, 1000);
    },

    //showtype  1 显示信息   2 搜索信息
    loadmore: function () {
        var currentpage = parseInt(this.state.page) + 1
        console.log("当前页" + currentpage)
        var imgtype = this.state.imgtype;
        this.getinfo(1, currentpage, imgtype, this.state.value);
    },

    getinfo: function (showtype, currentpage, imgtype, name) {
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "query";
        object.category = "";
        object.documentType = "2";
        object.pageSize = pagesize;
        object.pageNumber = currentpage;
        object.category = imgtype;
        object.name = name;
        $.ajax({
            url: url,
            data: { paramMap: JSON.stringify(object) },
            type: "post",
            dataType: "json",
            success: function (data) {
                if (this.isMounted()) {
                    if (data != "" && data != null && data != undefined) {
                        //获取图片信息成功
                        if (data.success == true) {
                            if (showtype == 2) {
                                layer.closeAll();
                                $("input").blur();
                            }
                            console.log("获取图片成功")
                            var flielist = "";

                            if (data.map.documentsList != "" && data.map.documentsList != null && data.map.documentsList != undefined) {
                                var filedata = data.map.documentsList;
                                var count = data.map.count //总数
                                //判断是否分页
                                var pageinfo = pagey(pagesize, count, currentpage);
                                var pagecont = pageinfo["pagecont"]; //页数
                                var ispage = pageinfo["ispage"]; //是否有下一页
                                //判断是否分页结束
                                this.setState({
                                    isload: false,
                                    moreload: false,
                                    page: currentpage,
                                     isclick: true
                                });
                                for (var i = 0; i < filedata.length; i++) {
                                    var tumbnailsUrl = isnullimg(filedata[i].tumbnailsUrl);
                                    var documentName = isnull(filedata[i].documentName);
                                    var updateTime = dateformdate(filedata[i].updateTime, 2);
                                    var url = filedata[i].url;
                                    flielist += '<dl class="white infofile profile_pading  photolistwrap">';

                                    flielist += ' <dt class="infovideoimg">';
                                    flielist += '<a href="' + url + '" class="fancybox-thumbs" data-fancybox-group="thumb"><img  src="' + tumbnailsUrl + '" /></a>';
                                    flielist += '</dt>';
                                    flielist += '<dd class="infofilert">';
                                    flielist += '<h2>';
                                    flielist += '<a href="' + url + '" class="fancybox-thumbs" data-fancybox-group="thumb">';
                                    flielist += documentName;
                                    flielist += '</a>'
                                    flielist += '</h2>'
                                    flielist += '<p class="photoinfom">';
                                    flielist += '<em>';
                                    flielist += '<a href="' + url + '" class="fancybox-thumbs" data-fancybox-group="thumb">';
                                    flielist += '更新时间：' + updateTime;
                                    flielist += '</a>';
                                    flielist += '</em>';
                                    flielist += '<span class="downphoto"><a href="' + url + '" >下载到手机</a><span>';
                                    flielist += '</p>';
                                    flielist += '</dd>';
                                    flielist += '</dl>';
                                }
                                //this.refs.photoshar.innerHTML=flielist;
                                //判断加载更多内容
                                var loadmore = ''

                                if (ispage == "true") {

                                    loadmore = '<p ref="loadmore" class="loadmore" id="loadmore">加载更多</p>';
                                }
                                else {
                                    if (currentpage == 1) {
                                        loadmore = '';
                                    }
                                    else {
                                        loadmore = '<p ref="loadmore" class="loadmore" id="nomore">没有更多了</p>';
                                    }

                                }
                                //判断加载更多内容结束

                                //加载内容

                                if (currentpage == 1) {
                                    $("#photoshar").html(flielist + loadmore);   //首次直接覆盖
                                }
                                else {
                                    $(".loadmore").remove();
                                    $("#photoshar").append(flielist + loadmore);
                                }
                                //加载内容结束  
                                layer.closeAll();
                                this.setState({
                                    isclick: true
                                });
                            }
                            else {
                                this.setState({
                                    isload: false,
                                    moreload: false,
                                    isclick: true
                                });
                                if (showtype == 1) {
                                    this.refs.photoshar.innerHTML = "<P class='nodata'>没有找到数据</p>"
                                    $("#photoshar").removeClass("pro_border")
                                }
                                if (showtype == 2) {
                                    layer.closeAll();
                                    $("input").blur();
                                    this.refs.photoshar.innerHTML = "<P class='nodata'>没有找到你要搜索的记录</p>"
                                    $("#photoshar").removeClass("pro_border")
                                }
                            }

                        }
                        //获取图片失败
                        if (data.success == false) {
                            layer.closeAll();
                            //未登录
                            if (data.errorCode == "1") {
                                var dodatate = generateMixed(6)
                                window.location.href = wxurl(dodatate);
                            }
                            //未登录结束
                            if (this.state.moreload == true) {

                                $("#loadmore").html("加载失败，点击重新加载");
                            }
                            else {
                                if (data.errorCode == "7") {
                                    this.refs.photoshar.innerHTML = Datafaile("当前用户没有此操作权限！");
                                }
                                else {
                                    this.refs.photoshar.innerHTML = Datafailed;
                                    $("#photoshar").removeClass("pro_border")
                                }

                            }

                            console.log("获取图片失败")
                            this.setState({
                                isload: false,
                                moreload: false,
                                isclick: true
                            });
                            if (showtype == 2) {
                                layer.closeAll();
                                $("input").blur();
                            }
                        }
                    }

                } // this.isMounted() End
            }.bind(this),
            error: function () {
                if (this.isMounted()) {
                    layer.closeAll();
                    if (this.state.moreload == true) {
                        this.setState({
                            isclick: true
                        });
                        $("#loadmore").html("加载失败，点击重新加载");
                    }
                    else {
                        this.refs.photoshar.innerHTML = Datafailed1;
                        $("#photoshar").removeClass("pro_border")
                        this.setState({
                            isclick: true
                        });
                    }
                    this.refs.showmore.innerHTML = "";
                    console.log("获取图片失败：网络错误")
                    this.setState({
                        isload: false,
                        moreload: false,
                        isclick: true
                    });
                    if (showtype == 2) {
                        $("input").blur();
                    }
                }
            }.bind(this)
        });
    },
    render: function () {
        var imgtype = this.state.imgtype;
        var $this = this;
        var topmain_show = function () {
            return (
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={$this.state.referrer}></a></span>
                    图片共享
                    <span className="search_ico"><a href={"search.html?Columns=Photoshare&imgtype=" + imgtype}></a></span>
                </div>
            )
        }

        var switnav_show = function () {
            return (
                <div className="switnav">
                    <span className="switnav_current" data-name="证书图片" id="switnav1" onTouchStart={$this.switnav}>证书图片</span>
                    <span data-name="宣传活动" id="switnav2" onTouchStart={$this.switnav}>宣传图片</span>
                    <span data-name="员工风采" id="switnav3" onTouchStart={$this.switnav}>员工风采</span>
                </div>
            )
        }
        var topmain = this.state.Columns == "Photoshare" ? "" : topmain_show();
        var switnavmain = this.state.Columns == "Photoshare" ? "" : switnav_show();

        return (
            <div>
                {topmain}
                <div ref="content">
                    {switnavmain}
                    <div className="profile marginb_1r " id="photoshar" ref="photoshar">

                    </div>
                </div>
            </div>

        );
    }
});

module.exports = Photoshare;






