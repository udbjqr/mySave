import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'

var url = "/otcdyanmic/goodsMobile.do";
var currturl = window.location.href;  //获取当前url
var singintype = geturl('singintype');
var daydate = geturl('day'); //走访时间
var parenturl = "CustomerDetails.html?custom_id=" + geturl('custom_id') + "&plan_id=" + geturl('plan_id')+ "&day=" + daydate; //上一页
var Testproducts = React.createClass({
    getInitialState: function () {
        return {
            Y_login: true,  //是否登录
            referrer: topreurl(parenturl), //上一页
            custom_id: geturl('custom_id'),
            plan_id: geturl('plan_id'),
            isload: false,
            isclick: true,
             Columns: isnull(geturl('Columns'))
        };
    },
    componentDidMount: function () {

        var $this = this;
         if (this.state.Columns != "testproducts") {  //搜索不显示初始值
        setTimeout(function () {
            if ($this.state.isload == true) {
                $this.refs.testpt_list.innerHTML = loading;
            }
        }, 500);
        this.getinfo();
         }


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


        
        this.refs.testpt_list.innerHTML = "";
        setTimeout(function () {
             if ($this.state.isclick) {
                $this.setState({  //禁止点击
                    isclick: false,
                })
            $this.getinfo(searchname);
             }
        }, 1000);


    },
    //获取初始数据
    getinfo: function (name) {
        var a = [a];
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "queryAll";
        object.customer_id = this.state.custom_id;
        object.plan_id = this.state.plan_id;
        object.goodName = name;
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
                            this.setState({
                                isclick: true,
                                isload: false
                            });
                              layer.closeAll();
                            $("input").blur();
                            $(".loading").remove();

                            if (data.map.list != "" && data.map.list != null && data.map.list != undefined) {
                                var clientdata = data.map.list;

                                for (var i = 0; i < clientdata.length; i++) {
                                    var id = clientdata[i].id;
                                    var visits_id = data.map.visits_id;
                                    var imgUrl =isnullimg1(todoimg(isnull(clientdata[i].imgUrl)));  //图片地址
                                    var goodsName = isnull(clientdata[i].goodsName); //产品名
                                    var supplierName = isnull(clientdata[i].supplierName); //供应商
                                    var goodsId = isnull(clientdata[i].goodsId); //供应商
                                    var supplierId = isnull(clientdata[i].supplierId); //供应商
                                    var specification=isnull(clientdata[i].specification); //规格
                                   var isStock=clientdata[i].isStock //是否盘点
                                   var checktext="";
                                     if(isStock=="0"){
                                      checktext=""
                                     }
                                     else{
                                         checktext='<img  src="../images/mobile/15kh.png" class="ischeck">'
                                     }
                                      
                                    if (a.toString().indexOf(supplierId) > -1) {
                                        var clientlist = "";
                                        clientlist += '<dl class="white infofile toico">';
                     clientlist += '<a href="productarticle.html?goodsName=' + goodsName + '&goods_id=' + id + '&visits_id=' + visits_id + '&plan_id=' + this.state.plan_id + '&custom_id=' + this.state.custom_id + '&singintype=' + singintype +'&day='+daydate+'" class="profile_pading">'
                                        clientlist += '<dt class="testp_img">';
                                         clientlist += '<div class="productimgwrap">';
                                         clientlist += '<img  src="' + imgUrl + '" class="testphoto" />'+checktext;
                                         clientlist += '</div>';
                                        clientlist += '</dt>';
                                        clientlist += '<dd>';
                                        clientlist +='<h2 class="testp_name">'+ goodsName+'</h2>';
                                       // clientlist += '<em class="supplier">供应商：' + supplierName + '</em>';
                                        clientlist += '<p class="specification">规格：' + specification +'</p>';
                                        clientlist += '</dd>';
                                        clientlist += '</a>';
                                        clientlist += '</dl>';

                                        $("#pro_" + supplierId).append(clientlist);
                                        
                                        //存在
                                    }

                                    if (a.toString().indexOf(supplierId) == -1) {
                                        //不存在
                                        a.push(supplierId);
                                        var clientlist1 = "";
                                        clientlist1 += ' <h1 class="testptTitle white borderb_1r  ">' + supplierName + '</h1>';
                                        clientlist1 += '<div class="profile " id="pro_' + supplierId + '">'
                                        clientlist1 += '<dl class="white infofile toico">';
                                        clientlist1 += '<a href="productarticle.html?goodsName=' + goodsName + '&goods_id=' + id + '&visits_id=' + visits_id + '&plan_id=' + this.state.plan_id + '&custom_id=' + this.state.custom_id + '&singintype=' + singintype + '&day='+ daydate+ '" class="profile_pading">';
                                        clientlist1 += '<dt class="testp_img">';
                                         clientlist1 += '<div class="productimgwrap">';
                                        clientlist1 += '<img  src="' + imgUrl + '" class="testphoto" />'+checktext;
                                        clientlist1 += '</div>';
                                        clientlist1 += '</dt>';
                                        clientlist1 += '<dd>';
                                         clientlist1 +='<h2 class="testp_name">'+ goodsName+'</h2>';
                                       // clientlist1 += '<em class="supplier">供应商：' + supplierName + '</em>';
                                        clientlist1 += '<p class="specification">规格：' + specification +'</p>';
                                        clientlist1 += '</dd>';
                                        clientlist1 += '</a>';
                                        clientlist1 += '</dl>';
                                        clientlist1 += '</div>';
                                        $(".testpt_list").append(clientlist1);

                                        //this.refs.testpt_list.appendchild(clientlist)

                                    }






                                }



                            }
                            else {
                                this.setState({
                                    isclick: true,
                                    isload: false
                                });

                                this.refs.testpt_list.innerHTML = Datafaile("暂时没有数据", "", "", "", "0")
                            }

                       layer.closeAll();
                        }
                        //获取获取信息失败
                        if (data.success == false) {
                            //未登录
                            layer.closeAll();
                            if (data.errorCode == "1") {
                                var dodatate = generateMixed(6)
                                window.location.href = wxurl(dodatate);
                            }
                            //未登录结束
                            this.setState({
                                isclick: true,
                                isload: false
                            });

                            this.refs.testpt_list.innerHTML = Datafailed;
                            console.log("获取获取信息失败:" + data.msg)
                        }
                    }

                } // this.isMounted() End
            }.bind(this),
            error: function (jqXHR, textStatus, errorThrown) {
                if (this.isMounted()) {
                    layer.closeAll();
                    this.setState({
                        isclick: true,
                        isload: false
                    });
                    this.refs.testpt_list.innerHTML = Datafailed1;
                    console.log("获取获取信息失败：网络错误")
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
                    考核产品
                <span className="search_ico"><a href={"search.html?Columns=testproducts&custom_id=" + $this.state.custom_id + "&plan_id=" + $this.state.plan_id+ "&day=" +daydate+"&singintype="+singintype}></a></span>
                </div>
            )
        }
        var topmain = this.state.Columns == "testproducts" ? "" : topmain_show();

        return (
            <div>
               {topmain}
                <div className="profile" className="testpt_list marginb_1r" id="testpt_list" ref="testpt_list">
                </div>



            </div>

        );
    }
});

module.exports =Testproducts;





