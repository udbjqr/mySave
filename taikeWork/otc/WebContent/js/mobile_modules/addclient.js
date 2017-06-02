import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'





//import { Modal, Button, WhiteSpace, WingBlank } from 'antd-mobile/lib/';
var url = "/otcdyanmic/customer.do";



var Addstock = React.createClass({
  getInitialState: function () {
    return {
      value: '',
      isload: true,
      moreload: false,
      page: "",
      isnextpage: "",
      showtype: 1,
      thisweek: "",
      thislastday: "",
      visible: false,
      selectday: geturl('selectday'),
      referrer: topreurl("client.html"), //上一页
      isbefore: false,
      isclick: true,
      canControl: "0"
    };
  },
  showModal() {
    this.setState({
      visible: true,
    });
  },
  onClose() {
    this.setState({
      visible: false,
    });
  },
  componentDidMount: function () {
    var $this = this




    //获取当天日期
    var mydate = new Date();
    var currYear = parseInt(mydate.getFullYear());
    var currmonth = parseInt(mydate.getMonth() + 1);
    var currday = parseInt(mydate.getDate());
    var currdatetime = currYear + "-" + addzerro(currmonth) + "-" + addzerro(currday);


    //获取列表日期
    var day = geturl('selectday').split("-");
    var selectYear = day[0];
    var selectmonth = day[1];
    var selectday = day[2];

    Mycalendar(selectYear, selectmonth, selectday);
    var listdate = geturl('selectday');

    //大于当前日期
    if (Date.parse(currdatetime) <= Date.parse(listdate)) {
      this.setState({
        isbefore: false
      });
      console.log("大于当前日期");

    }
    //小于等于当前日期
    if (Date.parse(currdatetime) > Date.parse(listdate)) {
      this.setState({
        isbefore: true
      });

      console.log("小于等于当前日期");

    }

    //小于等于当前日期结束





    $(".calendarcont").delegate('span', 'click', function () {
      $(".calendarcont span").removeClass('currentday');
      $(this).addClass('currentday');
      var year = $(this).attr("data-year");
      var month = addzerro($(this).attr("data-month"));
      var day = addzerro($(this).html());
      var daytime = year + "-" + month + "-" + day;
      $("#appDate").val(daytime);
      // alert(1+";"+daytime);
      //大于当前日期
      if (Date.parse(currdatetime) <= Date.parse(daytime)) {
        $this.setState({
          isbefore: false
        });


      }
      //小于等于当前日期
      if (Date.parse(currdatetime) > Date.parse(daytime)) {
        $this.setState({
          isbefore: true
        });
      }

      //小于等于当前日期结束
      $this.showinfo(1, 1);

    });


    this.showinfo(1, 1, this.state.value);
    var $this = this;
    setTimeout(function () {
      if ($this.state.isload == true && $this.state.moreload == false) {
        // $this.refs.client.innerHTML = loading;
        $("#loading").html(loading);
      }
    }, 500);


    $("#goods_list").delegate('#loadmore', 'click', function () {

      $this.setState({
        moreload: true,
      });


      setTimeout(function () {

        if ($this.state.moreload == true && $this.state.isload == false) {
          $("#addclentmain").html(loadingmore);
          //$this.refs.loadmore.innerHTML = loadingmore;
        }
      }, 500);

      $this.loadmore();
    });

  },




  addstore: function () {
    setTimeout(function () {
      window.location.href = "addcustomer.html";
      sessionStorage.setItem("addcustomerday", $("#appDate").val());
    }, 320)

  },

  //showtype  1 显示信息   2 搜索信息
  loadmore: function () {
    var currentpage = parseInt(this.state.page) + 1
    console.log("当前页" + currentpage)

    this.showinfo(1, currentpage, this.state.value);
  },

  showinfo: function (showtype, currentpage) {
    var $this = this;
    var plandate = $("#appDate").val();
    var plandate1 = $("#appDate").val().split("-");
    var object = new Object();
    object.controlType = "query";
    object.planMonth = plandate1[0] + "-" + plandate1[1];
    object.planDay = plandate;
    object.customerName = "";
    object.pageSize = 9999;
    object.pageNumber = currentpage;
    $.ajax({
      url: "/otcdyanmic/visitMobilePlan.do",  //visitMobilePlan.do
      data: { paramMap: JSON.stringify(object) },
      type: "post",
      dataType: "json",
      success: function (data) {
        if (this.isMounted()) {
          $("#loading").html("");
          if (data != "" && data != null && data != undefined) {
            //获取库存信息成功
            if (data.success == true) {

              if (showtype == 2) {
                layer.closeAll();
                $("input").blur();
              }


              console.log("获取获取信息成功")


              var amlist = "";
              var pmlist = "";
              if (data.map.list != "" && data.map.list != null && data.map.list != undefined) {
                var clientdata = data.map.list;
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
                var canControl = data.map.canControl;//上午下午
                this.setState({
                  canControl: canControl
                });
                var customerlistname = [];

                for (var i = 0; i < clientdata.length; i++) {
                  var name = isnull(clientdata[i].coustom);
                  var id = isnull(clientdata[i].id);
                  var custom_id = isnull(clientdata[i].custom_id);
                  var customer_type = (clientdata[i].customer_type == "1" ? "" : "<img src='../images/mobile/16ls.png'>")
                  customerlistname.push(custom_id)

                  var statusShow = isnull(clientdata[i].statusShow);//是否提交

                  if (statusShow == "通过") {
                    statusShow = "<font style='color:#0CB33D'>已审核</font>"
                  }
                  if (statusShow == "已提交") {
                    statusShow = "<font style='color:#2E85B8'>已提交</font>"
                  }
                  if (statusShow == "未提交") {
                    statusShow = "<font>未提交</font>"
                  }
                  if (statusShow == "驳回") {
                    statusShow = "<font style='color:#FDAC31'>驳回</font>"
                  }
                  if (statusShow == "已修改") {
                    statusShow = "<font style='color:#FF675E'>已修改</font>"
                  }




                  var hours = isnull(clientdata[i].hours);//上午下午
                  var plantime = "";
                  if (hours == "上午") {
                    amlist += '<dl class="white infofile bordert_1r" id="dl_' + id + '">';
                    amlist += '<dt class="productimg fontsize_0r plan_names">';
                    amlist += '<div class="plantype">' + customer_type + '</div>';
                    amlist += '<h2 class="addplanNames">' + name + '</h2>';
                    amlist += '</dt>';
                    amlist += '<dd class="productimg fontsize_0r plantype">';
                    amlist += statusShow;
                    amlist += '</dd>';
                    amlist += '<dd class="productimg fontsize_0r remove" id="del_' + id + '" data-id="' + id + '" >';
                    amlist += "删除";
                    amlist += '</dd>';
                    amlist += '</dl>';

                  }
                  if (hours == "下午") {
                    pmlist += '<dl class="white infofile bordert_1r" id="dl_' + id + '">';
                    pmlist += '<dt class="productimg fontsize_0r plan_names">';
                    pmlist += '<div class="plantype">' + customer_type + '</div>';
                    pmlist += '<h2 class="addplanNames">' + name + '</h2>';
                    pmlist += '</dt>';
                    pmlist += '<dd class="productimg fontsize_0r plantype">';
                    pmlist += statusShow;
                    pmlist += '</dd>';
                    pmlist += '<dd class="productimg fontsize_0r remove" id="del_' + id + '" data-id="' + id + '" >';
                    pmlist += "删除";
                    pmlist += '</dd>';
                    pmlist += '</dl>';
                  }





                }

                // this.refs.goods_list.append(clientlist);
                //判断加载更多内容
                var loadmore = ''
                var amlist1 = "";
                var pmlist1 = "";

                if (amlist != "" && amlist.length > 0) {

                  amlist1 = "<h2 class='plantimes'>上午</h2>" + amlist
                }
                else {

                  amlist1 = amlist;
                }
                if (pmlist != "" && pmlist.length > 0) {
                  pmlist1 = "<h2 class='plantimes'>下午</h2>" + pmlist;
                }
                else {
                  pmlist1 = pmlist;
                }

                var clientlist = amlist1 + pmlist1;
                sessionStorage.setItem("customerlistname", customerlistname);
                console.log(sessionStorage.getItem("customerlistname"))
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
                  $("#addclient").html(clientlist);   //首次直接覆盖
                }
                else {
                  $(".loadmore").remove();
                  $("#addclient").append(clientlist);
                }
                //加载内容结束  
                var $this = this
                $(".infofile").on("swipeLeft", function () {
                  $(this).addClass('selected').parents("#addclient").siblings().find(".infofile").removeClass('selected');

                }).on("swipeRight", function () {
                  $(this).removeClass('selected');
                })
                $(".infofile").delegate('.remove', 'click', function () {
                  var delid = $(this).attr("data-id");
                  if ($this.state.isclick) {
                    $this.delplan(delid);
                  }



                });


                //点击门店跳转选择时间
                $("#addclient").delegate('.customerlist', 'click', function () {
                  var typeinfo = {
                    showtype: "selectday",
                  }
                  PubSub.publish('changshow', typeinfo);

                  var name = $(this).html();
                  var id = $(this).attr("data-id");

                  customername = $(this).find("dt").html();
                  customerid = $(this).attr("data-id");
                });




              }
              else {
                this.setState({
                  isload: false,
                  moreload: false,
                });
                if (showtype == 1) {
                  /*
                  layer.open({
                    shade: false,
                    content: '没有找到数据！',
                    skin: 'msg',
                    className: 'tip',
                    time: 3 //3秒后自动关闭
                  });
                  */
                  this.refs.client.innerHTML = ""
                  this.setState({
                    canControl: "0"
                  });

                }
                if (showtype == 2) {
                  layer.closeAll();
                  $("input").blur();
                  layer.open({
                    shade: false,
                    content: '没有找到你要搜索的记录！',
                    skin: 'msg',
                    className: 'tip',
                    time: 3 //3秒后自动关闭
                  });
                  this.refs.client.innerHTML = ""
                  this.setState({
                    canControl: "0"
                  });
                }

              }


            }
            //获取获取信息失败
            if (data.success == false) {
              $("#loading").html("");
              //未登录
              if (data.errorCode == "1") {
                var dodatate = generateMixed(6)
                window.location.href = wxurl(dodatate);
              }
              //未登录结束


              if (this.state.moreload == true) {
                $("#loadmore").html("加载失败，点击重新加载");
                $(".addStore").hide();
              }
              else {
                if (data.errorCode == "7") {
                  this.refs.client.innerHTML = Datafaile("当前用户没有此操作权限！");
                  $(".addStore").hide();
                }
                else {
                  this.refs.client.innerHTML = Datafailed;
                  $(".addStore").hide();
                }

              }


              console.log("获取获取信息失败:" + data.msg)
              this.setState({
                isload: false,
                moreload: false,
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
          $("#loading").html("");
          if (this.state.moreload == true) {

            $("#loadmore").html("加载失败，点击重新加载");
            $(".addStore").hide();
          }
          else {
            this.refs.client.innerHTML = Datafailed1;
          }

          console.log("获取获取信息失败：网络错误")
          $(".addStore").hide();
          this.setState({
            isload: false,
            moreload: false,
          });

          if (showtype == 2) {
            layer.closeAll();
            $("input").blur();
          }
        }
      }.bind(this)
    });





  },


  //提交审核
  check: function () {
    var $this = this;
    if (this.state.isclick) {
      this.setState({  //禁止点击
        isclick: false,
      })

      var checkdate = $("#appDate").val().split("-");
      var object = new Object();
      object.controlType = "submit";
      object.planDay = checkdate[0] + "-" + checkdate[1]; //计划月份
      var showbox = this.refs.content;
      var referrer = this.state.referrer;

      //提交审核ajax
      ajaxFn(object, $this, function (data) {
        console.log("提交审核计划成功")
        layer.open({
          shade: false,
          content: '提交审核计划成功',
          skin: 'msg',
          className: 'tip',
          time: 3 //3秒后自动关闭
        });
        setTimeout(function () {
          var typeinfo = {
            showtype: "show",
          }
          $this.setState({
            isclick: true
          });
          window.location.href = "addclient.html?selectday=" + $("#appDate").val();
        }, 3000)

      }, "/otcdyanmic/visitMobilePlan.do", showbox, referrer)

      //提交审核ajax结束

    }



    /*
     var checkdate = $("#appDate").val().split("-");
     var object = new Object();
     object.controlType = "submit";
     object.planDay = checkdate[0] + "-" + checkdate[1]; //计划月份
     $.ajax({
       url: "/otcdyanmic/visitMobilePlan.do",
       data: { paramMap: JSON.stringify(object) },
       type: "post",
       dataType: "json",
       success: function (data) {
         if (data != "" && data != null && data != undefined) {
           //提交审核成功
           if (data.success == true) {
             console.log("提交审核计划成功")
             layer.open({
               shade: false,
               content: '提交审核计划成功',
               skin: 'msg',
               className: 'tip',
               time: 3 //3秒后自动关闭
             });
             setTimeout(function () {
               var typeinfo = {
                 showtype: "show",
               }
               // PubSub.publish('changshow', typeinfo);
               window.location.href = "addclient.html?selectday=" + $("#appDate").val();
             }, 3000)
           }
 
           //提交审核计划失败
           if (data.success == false) {
             //未登录
             if (data.errorCode == "1") {
               var dodatate = generateMixed(6)
               window.location.href = wxurl(dodatate);
             }
             //未登录结束
             if (data.errorCode == "7") {
               layer.open({
                 shade: false,
                 content: '当前用户没有此操作权限！',
                 skin: 'msg',
                 className: 'tip',
                 time: 3 //3秒后自动关闭
               });
               setTimeout(function () {
                 window.location.href = "client.html"
               }, 3000)
 
             }
             else {
               layer.open({
                 shade: false,
                 content: '提交审核计划信息失败，请重新再试！',
                 skin: 'msg',
                 className: 'tip',
                 time: 3 //3秒后自动关闭
               });
             }
 
 
             console.log("提交审核计划信息失败:" + data.msg)
 
           }
         }
 
 
       }.bind(this),
 
       error: function (jqXHR, textStatus, errorThrown) {
         if (this.isMounted()) {
 
           layer.open({
             shade: false,
             content: '提交审核计划失败：网络错误！',
             skin: 'msg',
             className: 'tip',
             time: 3 //3秒后自动关闭
           });
 
 
           console.log("提交审核计划失败：网络错误")
 
 
         }
       }.bind(this)
 
     });
    */
  },
  /*
   *
提交审核结束
  *
  */



  //删除计划
  delplan: function (id) {
    var $this = this;
    this.setState({  //禁止点击
      isclick: false,
    })
    var object = new Object();
    object.controlType = "delete";
    object.planId = id; //id
    var showbox = this.refs.content;
    var referrer = this.state.referrer;
    //删除计划ajax
    ajaxFn(object, $this, function (data) {
      console.log("删除计划计划成功")
      layer.open({
        shade: false,
        content: '删除计划计划成功',
        skin: 'msg',
        className: 'tip',
        time: 3 //3秒后自动关闭
      });
      setTimeout(function () {
        $("#dl_" + id).css({
          "-webkit-transform": "translate(-108%,0)",
          "-webkit-transition": "all 0.3s linear"
        })
        setTimeout(function () {
          $("#dl_" + id).remove();
          $this.showinfo(1, 1);
          $this.setState({
            isclick: true
          });
        }, 300)

      }, 3000)

    }, "/otcdyanmic/visitMobilePlan.do",showbox, referrer,id)

    //删除计划ajax结束
  },
  /*
   *
删除计划结束
  *
  */
  referrer: function () {
    var $this = this
    setTimeout(function () {
      window.location.href = "client.html"
    },320)


  },
  render: function () {
    var text = "您选择的日期已经过期，不能制定拜访计划，<br>如需定制，请前往当天之后的日期"
    var img = "../images/mobile/nodata.png"
    //this.refs.client.innerHTML = Datafaile(text, "", "", img, "0")

    //var Datafailed1 = <div className="nonetwork"><div className="nonetworkwarp"><img src="../images/mobile/Datafailed.png" /><p> 您选择的日期已经过期，不能制定拜访计划，<br />如需定制，请前往当天之后的日期</p></div></div>;

    var add_text = this.state.isbefore ? "" : <div className="addStore white margint_1r" onTouchEnd={this.addstore}><i className="addico fa fa-plus"></i>新增拜访计划</div>;
    var canControl = this.state.canControl;
    var canControlbtn = "";
    if (canControl == "0") {

      canControlbtn = ""
    }
    if (canControl == "1") {

      canControlbtn = <button className="fn-btn" id="addpalnBtn" onTouchStart={this.check}>提交审核</button>
    }
    return (
      <div className="client_main">
        <div className="profile white" id="pagenav">

          <span className="toleft"> <a href={this.state.referrer}></a></span>
          新增拜访计划
        </div>
      <div ref="content">
        <div className="calendar">

        </div>



        <div className="profile" id="addclient" ref="client" >
        </div>
        {add_text}
        {canControlbtn}







        <div id="addclentmain">


        </div>
      </div>
      </div>



    );

  }
});



ReactDOM.render(
  <Addstock />,
  document.getElementById('conter')
);




