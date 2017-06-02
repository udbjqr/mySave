import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import SearchBar from 'antd-mobile/lib/search-bar'
import Userfooter from '../../js/mobile_modules/userfooter.js'

var url = "/otcdyanmic/goodsMobile.do?v=" + generateMixed(4);
var currturl = window.location.href;  //获取当前url


var Product = React.createClass({
    getInitialState: function () {
        return {
            Y_login: true,  //是否登录
            value: '',
            isload: true,
            isclick:true,
            moreload: false,
            page: "",
            isnextpage: "",
            showtype: 1
        };
    },

    componentDidMount: function () {
        this.getinfo(1, 1, this.state.value);
        var $this = this;
        setTimeout(function () {
            if ($this.state.isload == true && $this.state.moreload == false) {
                $this.refs.goods_list.innerHTML = loading;
            }
        }, 500);


        $("#goods_list").delegate('#loadmore', 'click', function () {

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
        if (this.state.isclick) {
          this.setState({  //禁止点击
         isclick: false,
        })
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



        this.refs.goods_list.innerHTML = "";
        setTimeout(function () {
            
                $this.getinfo(2, 1, searchname);
           

        }, 1000);
         }
    },

    //showtype  1 显示信息   2 搜索信息
    loadmore: function () {
        var currentpage = parseInt(this.state.page) + 1
        console.log("当前页" + currentpage)

        this.getinfo(1, currentpage, this.state.value);
    },
    //获取初始数据
    getinfo: function (showtype, currentpage, name) {
        var $this = this;
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "query";
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
                        //获取库存信息成功
                        if (data.success == true) {
                            if (showtype == 2) {
                                layer.closeAll();
                                $("input").blur();
                            }
                           

                            console.log("获取获取信息成功")

                            var clientlist = "";
                            if (data.map.data != "" && data.map.data != null && data.map.data != undefined) {
                                var clientdata = data.map.data;
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
                                });
                                for (var i = 0; i < clientdata.length; i++) {
                                    var imgageURL = isnullimg1(todoimg(clientdata[i].imgageURL));
                                    var goodsName = isnull(clientdata[i].goodsName);
                                    var supplier = isnull(clientdata[i].supplier);
                                    var goodsId = isnull(clientdata[i].goodsId);
                                    var time = dateformdate(clientdata[i].updateTime, 3);
                                    var batchNumber = isnull(clientdata[i].batchNumber);
                                    var isAssess = isnull(clientdata[i].isAssess);
                                    var specification = isnull(clientdata[i].specification); //规格
                                    var id = clientdata[i].id;
                                    clientlist += ' <dl class="white infofile  toico margint_1r">';
                                    clientlist += '<a href="productDetail.html?id=' + id + '" class="profile_pading">';
                                    clientlist += '<dt class="productimg fontsize_0r">';
                                    clientlist += '<div class="productimgwrap">';
                                    if (isAssess == 1) {
                                        clientlist += '<img class="assessico" src="../images/mobile/14kh.png">';
                                    }

                                    clientlist += '<img class="productphotos" src="' + imgageURL + '">';
                                    clientlist += '</div>';
                                    clientlist += '</dt>';
                                    clientlist += '<dd class="productinfo">';
                                    clientlist += '<span>';
                                    clientlist += '<h2>' + goodsName + '</h2>';
                                    clientlist += '<em>供应商：' + supplier + '</em>';
                                    clientlist += '<p class="specification">规格：' + specification + '</p>';
                                    clientlist += '</span>';
                                    clientlist += '</dd>';
                                    clientlist += '</a>';
                                    clientlist += '</dl>';
                                }

                                // this.refs.goods_list.append(clientlist);
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
                                    $("#goods_list").html(clientlist + loadmore);   //首次直接覆盖
                                }
                                else {
                                    $(".loadmore").remove();
                                    $("#goods_list").append(clientlist + loadmore);
                                }
                                //加载内容结束  

                              this.setState({
                                    isclick: true
                                });
                            }
                            else {
                                this.setState({
                                    isload: false,
                                    moreload: false,
                                });
                                if (showtype == 1) {
                                    this.refs.goods_list.innerHTML = "<P class='nodata'>没有找到数据</p>"
                                }
                                if (showtype == 2) {
                                    layer.closeAll();
                                    $("input").blur();
                                    this.refs.goods_list.innerHTML = "<P class='nodata'>没有找到你要搜索的记录</p>"
                                }
                             this.setState({
                                    isclick: true
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


                            if (this.state.moreload == true) {
                                $("#loadmore").html("加载失败，点击重新加载");
                            }
                            else {
                                if (data.errorCode == "7") {
                                    this.refs.goods_list.innerHTML = Datafaile("当前用户没有此操作权限！");

                                }
                                else {
                                    this.refs.goods_list.innerHTML = Datafailed;
                                }

                            }


                            console.log("获取信息失败:" + data.msg)
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
            error: function (jqXHR, textStatus, errorThrown) {
                if (this.isMounted()) {
                    if (this.state.moreload == true) {

                        $("#loadmore").html("加载失败，点击重新加载");
                    }
                    else {
                        this.refs.goods_list.innerHTML = Datafailed1;
                    }

                    console.log("获取信息失败：网络错误")
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
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div id="productMain">

                <div className="prctsearch">
                    <SearchBar
                        className="searchipt white"
                        id="prct_search"
                        ref="sear_chname"
                        name="prct_search"
                        value={this.state.value}
                        placeholder="请输入搜索的产品名"
                        onSubmit={this.onSubmit}
                        onClear={(value) => console.log(value, 'onClear')}
                        onFocus={() => console.log('onFocus')}
                        onBlur={() => console.log('onBlur')}
                        showCancelButton={false}
                        onChange={this.onChange}
                        />
                </div >

                <div className="profile margint_1r" ref="goods_list" id="goods_list">


                </div>

                <Userfooter name="product" />
            </div>
        );
    }
});

ReactDOM.render(
    <Product />,
    document.getElementById('conter')
);




