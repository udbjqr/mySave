import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import SearchBar from 'antd-mobile/lib/search-bar'
import Userfooter from '../../js/mobile_modules/userfooter.js'
import Modal from 'antd-mobile/lib/Modal'
import Button from 'antd-mobile/lib/Button'
import WhiteSpace from 'antd-mobile/lib/white-space'
import WingBlank from 'antd-mobile/lib/wing-blank'


//import { Modal, Button, WhiteSpace, WingBlank } from 'antd-mobile/lib/';
var url = "/otcdyanmic/customerMobile.do";
var cutomerinfo = {};
var plandate = isnull(sessionStorage.getItem("addcustomerday")); //缓存中的state;
var customerlistname = String(sessionStorage.getItem("customerlistname"));



//添加门店
var Addcutomer = React.createClass({
  getInitialState: function () {
    return {
      referrer: "",
      value: '',
      isload: true,
      moreload: false,
      page: "",
      isnextpage: "",
      dateday: "",
      showtype: 1,
      selectday: "AM",
      slectcustomer: "",
      isclick: true,
      json: []
    };
  },


  componentDidMount: function () {

    console.log(sessionStorage.getItem("customerlistname"))
    this.referrer();


    this.getinfo(1, 1, this.state.value);
    var $this = this;
    setTimeout(function () {
      if ($this.state.isload == true) {
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
    var searchname = this.state.value;
    cutomerinfo = {};
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
        slectcustomer: "",
        json: []
      });
    }
    else {
      this.setState({
        showtype: 2,
        slectcustomer: "",
        json: []
      });
    }
    //设置是搜索还是查询结束

    //customerlist
    $(".customerlist").each(function () {
      $(this).find(".isselectcustom").removeClass("isselectcurrent");
    })


    //this.refs.goods_list.innerHTML = "";
    setTimeout(function () {
      $this.getinfo(2, 1, searchname);
    }, 1000);
  },

  //showtype  1 显示信息   2 搜索信息
  loadmore: function () {
    var currentpage = parseInt(this.state.page) + 1
    console.log("当前页" + currentpage)

    this.getinfo(1, currentpage, this.state.value);
  },

  //获取上一页
  referrer: function () {

    var addcustomerday = isnull(sessionStorage.getItem("addcustomerday")); //缓存中的state
    if (addcustomerday == "") {
      addcustomerday = gettoday().currdate;
    }
    //return topreurl("addclient.html?selectday="+addcustomerday);
    this.setState({
      referrer: topreurl("addclient.html?selectday=" + addcustomerday),
    })


  },
  //获取初始数据
  getinfo: function (showtype, currentpage, name) {
    var $this = this;
    this.setState({
      slectcustomer: "",
    });
    cutomerinfo = {};
    var object = new Object();
    object.controlType = "queryPlanStore";
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
                  slectcustomer: "",
                  json: data.map.list,
                });
                console.log(this.state.json[0])


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
                  // $("#goods_list").html(clientlist + loadmore);   //首次直接覆盖
                }
                else {
                  //  $(".loadmore").remove();
                  // $("#goods_list").append(clientlist + loadmore);
                }

                $this.setState({
                  list: clientlist + loadmore,
                });
                //加载内容结束  

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
          if (this.state.moreload == true) {

            $("#loadmore").html("加载失败，点击重新加载");
          }
          else {
            this.refs.goods_list.innerHTML = Datafailed1;
          }

          console.log("获取获取信息失败：网络错误")
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


  // 点击门店
  clickcustomer: function (event) {
    var customerlistnames = customerlistname.split(",");
    var $this = this;
    var id = event.currentTarget.getAttribute("id");
    var dataid = parseInt(event.currentTarget.getAttribute("data-id"));
    var type = event.currentTarget.getAttribute("data-type");
    var isselect = event.currentTarget.getAttribute("data-select");

    var isexist = "0"
    for (var i = 0; i < customerlistnames.length; i++) {
      if (dataid == customerlistnames[i]) {  //已存在拜访门店
        isexist = "1"
        break;
      }
    }

    if (isexist == "1" && isselect == "0") {
      layer.open({
        shade: false,
        content: '当日已存在此门店拜访计划，是否继续添加',
        skin: 'msg',
        className: 'plantip',
        btn: ['确认', '取消'],
        yes: function () {
          layer.closeAll()
          $this.clickcustomerget(id, dataid, type, isselect, $this)

        }
      });
    }
    else {
      $this.clickcustomerget(id, dataid, type, isselect, $this)
    }









  },




  //点击门店列表后处理
  clickcustomerget: function (id, dataid, type, isselect, $this) {

    console.log(id + ";" + type + ";" + isselect)
    if (isselect == "0") {


      $("#" + id).find(".isselectcustom").addClass("isselectcurrent");

      cutomerinfo["info" + dataid] = dataid + ":" + type;
      $this.getcustomer();
      $("#" + id).attr("data-select", "1");
      return false;
    }
    if (isselect == "1") {

      $("#" + id).find(".isselectcustom").removeClass("isselectcurrent");
      //delete cutomerinfo.id
      delete cutomerinfo["info" + dataid];
      $this.getcustomer();
      $("#" + id).attr("data-select", "0");
      return false;
    }



    console.log(cutomerinfo)

  },/* 提交计划*/
  tosaveplan: function () {

  },
  //提交计划ajax
  saveplan: function (id, date, month, time) {
    var $this = this;
    this.setState({  //禁止点击
      isclick: false,
    })
    var object = new Object();
    object.controlType = "add";
    object.planDay = month; //计划月份
    object.customerAndTypeStr = id //客户Id
    object.planDate = date //计划日期
    object.planTime = time //计划时间段（AM：上午，PM:下午）
    var showbox = this.state.content;
    var referrer = this.state.referrer;

    //提交计划ajax
    ajaxFn(object, $this, function (data) {
      console.log("保存拜访计划成功")
      layer.open({
        shade: false,
        content: '保存拜访计划成功',
        skin: 'msg',
        className: 'tip',
        time: 3 //3秒后自动关闭
      });
      setTimeout(function () {
        $this.setState({
          isclick: true
        });
        window.location.href = referrer;
        console.log(plandate)
      }, 3000)

    }, "/otcdyanmic/visitMobilePlan.do", showbox, referrer)

    //提交计划ajax结束
  },
  //选择时间
  setday: function (event) {
    var id = event.target.getAttribute("id");
    var selectday = event.target.getAttribute("id") == "day_am" ? "AM" : "PM";
    this.setState({
      selectday: selectday,
    });
    $("#" + id).addClass("setdaycurrent").siblings(".toselectday span").removeClass("setdaycurrent");
    console.log(selectday);
  },

  //获取选择的门店列表
  getcustomer: function () {
    //slectcustomer

    var $this = this;
    var Objectnum = Object.getOwnPropertyNames(cutomerinfo).length //对象长度

    if (Objectnum <= 0) {
      this.setState({
        slectcustomer: "",
      });
    }
    if (Objectnum > 0) {
      var cusinfo = "";
      for (var v in cutomerinfo) {
        cusinfo += cutomerinfo[v] + ",";
      }
      //console.log(cusinfo.lastIndexOf(","))
      // console.log(cusinfo.substring(0,cusinfo.lastIndexOf(",")));
      var cusinfo1 = cusinfo.substring(0, cusinfo.lastIndexOf(","));
      $this.setState({
        slectcustomer: cusinfo1,
      });
    }




  },

  //点击提交
  customercheck: function () {
    var $this=this;
    if (this.state.slectcustomer == "") {
      layer.open({
        shade: false,
        content: '请选择要拜访的门店',
        skin: 'msg',
        className: 'tip',
        time: 3 //3秒后自动关闭
      });
    }
    else {
      if (this.state.isclick) {
        layer.open({
          shade: false,
          content: '确认提交计划？',
          skin: 'msg',
          className: 'plantip',
          btn: ['确认', '取消'],
          yes: function () {
            var plantime = $this.state.selectday;
            var plandate = isnull(sessionStorage.getItem("addcustomerday")); //缓存中的state;
            var plandate1 = plandate.split("-");
            var customerid = $this.state.slectcustomer;
            $this.saveplan(customerid, plandate, plandate1[0] + "-" + plandate1[1], plantime);

          }
        });

      }

    }
  },

  render: function () {
    var $this = this;
    return (

      <div className="client_main" ref="content">

        <div className="client_head">
          <div className="profile white" id="pagenav">
            <span className="toleft"> <a href={this.state.referrer}></a></span>

            <div className="toselectday"> <span className="daytime setdaycurrent" id="day_am" onTouchEnd={this.setday}>上午门店</span><span className="daytime" id="day_pm" onTouchEnd={this.setday}>下午门店</span></div>
          </div>

          <div className="prctsearch">
            <SearchBar
              className="searchipt white"
              id="prct_search"
              ref="sear_chname"
              name="prct_search"
              value={this.state.value}
              placeholder="请输入搜索的门店名"
              onSubmit={this.onSubmit}
              onClear={(value) => console.log(value, 'onClear')}
              onFocus={() => console.log('onFocus')}
              onBlur={() => console.log('onBlur')}
              showCancelButton={false}
              onChange={this.onChange}
              />
          </div >
        </div>


        <div className="profile" ref="goods_list" id="goods_list" >
          {this.state.json.map(function (obj, i) {

            return (

              <dl key={i} className="white infofile  customerlist" id={"customerlist" + (i + 1)} data-id={obj.id} data-type={obj.type} data-select="0" onClick={$this.clickcustomer} >

                <dt className="productimg fontsize_0r addplan_customer profile_pading">
                  <div className="plantype">{obj.type == "1" ? "" : <img src="../images/mobile/16ls.png" />}</div>
                  <h2 className="addplanNames">{obj.name}</h2>
                  <span className="isselectcustom"></span>
                </dt>
              </dl>
            )
          })
          }

        </div>
        {this.state.slectcustomer == "" ? "" : <button className="fn-btn" id="addcusbtn" onTouchStart={this.customercheck}>确认</button>}


      </div>




    );
  }

});
ReactDOM.render(
  <Addcutomer />,
  document.getElementById('conter')
);




