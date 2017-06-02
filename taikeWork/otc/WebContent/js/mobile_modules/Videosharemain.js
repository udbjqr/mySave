import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'

var url = "/otcdyanmic/documents.do";
var Videoshare = React.createClass({
    getInitialState: function () {
        return {
            Y_login: true,  //是否登录
            referrer: topreurl("index.html"), //上一页
            isload: true,
            moreload: false,
            page: "",
            isnextpage: "",
            searchname: "",
            showtype: "1",
            Columns: isnull(geturl('Columns')),
            isclick: true,
            searchpage: "0"
            
        };
    },
    componentDidMount: function () {
        var $this = this;
        if (this.state.Columns != "Videoshare") {  //搜索不显示初始值
            this.getinfo(1, 1, this.state.value);
            setTimeout(function () {
                if ($this.state.isload == true && $this.state.moreload == false) {
                    $this.refs.videolist.innerHTML = loading;
                }
            }, 500);
        }





        $("#videolist").delegate('#loadmore', 'click', function () {

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

        //接收搜索数据
        this.pubsub_token = PubSub.subscribe('changsearch', function (topic, newItem) {
            this.setState({
                value: newItem.searchname,
            });
            this.onSubmit();
        }.bind(this));
        //接收搜索数据
    },
    //清除接收搜索数据
    componentWillUnmount: function () {
        PubSub.unsubscribe(this.pubsub_token);
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
            shade: false,
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



        this.refs.videolist.innerHTML = "";
        setTimeout(function () {
            if ($this.state.isclick) {
                $this.setState({  //禁止点击
                    isclick: false,
                })
                $this.getinfo(2, 1, searchname);
            }
        }, 1000);
    },

    loadmore: function () {
        var currentpage = parseInt(this.state.page) + 1
        console.log("当前页" + currentpage)

        this.getinfo(1, currentpage, this.state.value);
    },

    //获取数据
    getinfo: function (showtype, currentpage, name) {
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "query";
        object.category = "";
        object.documentType = "3";
        object.pageSize = pagesize;
        object.pageNumber = currentpage;
        object.name = name;
        $.ajax({
            url: url,
            data: { paramMap: JSON.stringify(object) },
            type: "post",
            dataType: "json",
            success: function (data) {
                if (this.isMounted()) {
                    if (data != "" && data != null && data != undefined) {
                        //获取用户默认信息成功
                        if (data.success == true) {
                            if (showtype == 2) {
                                layer.closeAll();
                                $("input").blur();
                            }
                            console.log("获取视频成功")
                            var videolist = "";

                            if (data.map.documentsList != "" && data.map.documentsList != null && data.map.documentsList != undefined) {
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
                                var videodata = data.map.documentsList;
                                for (var i = 0; i < videodata.length; i++) {

                                    var url = isnull(videodata[i].url);
                                    var tumbnailsUrl = isnullimg(videodata[i].tumbnailsUrl);
                                    var documentName = isnull(videodata[i].documentName);
                                    var updateTime = dateformdate(videodata[i].updateTime, 2);
                                    var uploadEmployee = isnull(videodata[i].uploadEmployee);
                                    videolist += '<dl class="white infofile">';
                                    videolist += '<a href="' + url + '" class="profile_pading">';
                                    videolist += ' <dt class="infovideoimg">';
                                    videolist += '<img  src="' + tumbnailsUrl + '" />';
                                    videolist += '</dt>';
                                    videolist += '<dd class="infofilert">';
                                    videolist += '<h2>' + documentName + '</h2>';
                                    videolist += '<em>上传时间：' + updateTime + '</em>';
                                    videolist += '<p>来源：' + uploadEmployee + '</p>';
                                    videolist += '</dd>';
                                    videolist += ' </a>';
                                    videolist += '</dl>';
                                }
                                //this.refs.videolist.innerHTML = videolist;
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
                                    $("#videolist").html(videolist + loadmore);   //首次直接覆盖
                                }
                                else {
                                    $(".loadmore").remove();
                                    $("#videolist").append(videolist + loadmore);
                                }
                                //加载内容结束  



                            }
                            else {

                                if (showtype == 1) {
                                    this.refs.videolist.innerHTML = "<P class='nodata'>没有找到数据</p>"
                                    $("#videolist").removeClass("bordert_1r")
                                }
                                if (showtype == 2) {
                                    layer.closeAll();
                                    $("input").blur();
                                    this.refs.videolist.innerHTML = "<P class='nodata'>没有找到你要搜索的记录</p>"
                                }

                                this.setState({
                                    isload: false,
                                    moreload: false,
                                    isclick: true
                                });
                            }

                        }
                        //获取用户默认信息失败
                        if (data.success == false) {
                            //未登录
                            if (data.errorCode == "1") {
                                var dodatate = generateMixed(6)
                                window.location.href = wxurl(dodatate);
                            }
                            //未登录结束
                            console.log("获取视频失败")

                            if (this.state.moreload == true) {

                                $("#loadmore").html("加载失败，点击重新加载");
                            }
                            else {
                                if (data.errorCode == "7") {
                                    this.refs.videolist.innerHTML = Datafaile("当前用户没有此操作权限！");
                                }
                                else {
                                    this.refs.videolist.innerHTML = Datafailed;
                                }
                            }

                            if (showtype == 2) {
                                layer.closeAll();
                                $("input").blur();
                            }
                            $("#videolist").removeClass("bordert_1r")
                            this.setState({
                                isload: false,
                                moreload: false,
                                isclick: true
                            });
                        }
                    }

                } // this.isMounted() End
            }.bind(this),
            error: function () {
                if (this.isMounted()) {
                    if (this.state.moreload == true) {
                        $("#loadmore").html("加载失败，点击重新加载");
                    }
                    else {
                        this.refs.videolist.innerHTML = Datafailed1;
                    }
                    console.log("获取视频失败：网络错误")
                    if (showtype == 2) {
                        layer.closeAll();
                        $("input").blur();
                    }
                    $("#videolist").removeClass("bordert_1r")
                    this.setState({
                        isload: false,
                        moreload: false,
                        isclick: true
                    });
                }
            }.bind(this)
        });
    },
    render: function () {
        var $this = this;
        var topmain_show = function () {
            return (
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={$this.state.referrer}></a></span>
                    视频共享
                    <span className="search_ico"><a href={"search.html?Columns=Videoshare"}></a></span>
                </div>
            )
        }
        var topmain = this.state.Columns == "Videoshare" ? "" : topmain_show();
        return (
            <div>
                {topmain}
                <div ref="videolist" className="profile margint_1r " id="videolist" ref="videolist">

                </div>

            </div>
        );
    }
});
module.exports = Videoshare;







