import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import Userfooter from '../../js/mobile_modules/userfooter.js'

var url = "/otcdyanmic/visitPlan.do";
var Stock = React.createClass({
  getInitialState: function () {
    return {
      Y_login: true,  //是否登录
      isload: true,
      thisweek: "",
      thislastday: "",
      visible: false
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
    var currYear = (new Date()).getFullYear();
    var currmonth = addzerro((new Date()).getMonth() + 1);
    var currday = addzerro((new Date()).getDate());
    var currdate = gettoday().currdate;  //当前日期
    
    Mycalendar(currYear, currmonth, currday);

    console.log($(".wd-nav li:eq(1)").find().html());

    var $this = this

    $(".calendarcont").delegate('span', 'click', function () {
      $(".calendarcont span").removeClass('currentday');
      $(this).addClass('currentday');
      var year = $(this).attr("data-year");
      var month = $(this).attr("data-month");
      var day = $(this).html();
      var daytime = year + "-" + addzerro(parseInt(month)) + "-" + addzerro(parseInt(day));
      $("#appDate").val(daytime);
      $this.getinfo(daytime);  //获取默认数据
     
    });


    this.getinfo(currdate);  //获取默认数据
    var opt = {
      preset: 'date', //日期
      theme: 'android-ics light', //皮肤样式
      display: 'bottom', //显示方式
      mode: 'scroller', //日期选择模式
      dateFormat: 'yy-mm-dd', // 日期格式
      setText: '确定', //确认按钮名称
      cancelText: '取消',//取消按钮名籍我
      dateOrder: 'yymmdd', //面板中日期排列格式
      dayText: '日', monthText: '月', yearText: '年', //面板中年月日文字
      startYear: currYear - 10, //开始年份
      endYear: currYear + 20, //结束年份
      onSelect: this.ajaxclient,
    };

    // $("#appDate").mobiscroll(opt);

    var $this = this;
    setTimeout(function () {
      if ($this.state.isload == true) {
        $this.refs.client.innerHTML = loading;
      }
    }, 500);







  },/* 判断是否是三天前 */
  isYestoday:function(Yestoday,thisday){
     if (Date.parse(Yestoday) > Date.parse(thisday)) {
         return "false"
     }
     if (Date.parse(Yestoday) <=Date.parse(thisday)) {
         return "true"
     }
   
  },
  /* 获取图标和判断是否可以跳转和拖动 */
  customerico: function (str, flag, leaveShowtype) {
    var daytime=$("#appDate").val(); //获取选取的日期
    var Yestoday=getYestoday(3);
   var isYestoday=this.isYestoday(Yestoday,daytime) //是否超过3天 true 没有超过 false：超过
    
    var customerico = "";
    var isdoit="";
    var islink="";
    switch (str) {
      case ("正常"):
         
        if (leaveShowtype == "正常") {
         
          if (flag == "0") {
             islink="true"
             isdoit=isYestoday=="true"?"true":"false"
            customerico = "flag0"
          }
          if (flag == "1") {
             islink="true"
             isdoit="false"
            customerico = "flag1"
          }
          if (flag == "2") {
             islink="true"
             isdoit=isYestoday=="true"?"true":"false"
            customerico = "flag2"
          }
        }
        
       if (leaveShowtype == "年假") {
          islink="false"
          isdoit="false"
          customerico = "mark5"
       }
       if (leaveShowtype == "事假") {
          islink="false"
          isdoit="false"
          customerico = "mark6"
       }
       if (leaveShowtype == "病假") {
          islink="false"
          isdoit="false"
          customerico = "mark2"
       }
       if (leaveShowtype == "年假") {
          islink="false"
          isdoit="false"
          customerico = "mark5"
       }
       if (leaveShowtype == "退休") {
          islink="false"
          isdoit="false"
          customerico = "mark7"
       }
        if (leaveShowtype == "南华大药房") {
          islink="false"
          isdoit="false"
          customerico = "mark4"
       }
     
      

        break;
      case ("门店关门"):
        islink="false"
        isdoit="false"
        customerico = 'mark3';
        break;
      case ("门店搬迁"):
         islink="false"
        isdoit="false"
        customerico = 'mark1';
        break;
       case ("开会"):
         islink="false"
        isdoit="false"
        customerico = 'mark4';
        break;
      default:
       
        break;
    }
    var customericos={
       customerico:customerico,
       isdoit:isdoit,
       islink:islink
    }
    return customericos;
  },
  data: function (url, customer_type, hours, name, plan_id, mark_type, flag, leaveShowtype) {
    var typeicos = this.customerico(mark_type, flag, leaveShowtype);
    var typeico = this.customerico(mark_type, flag, leaveShowtype).customerico;
   var movecss = typeicos.isdoit == "true" ? " totouchmove" : ""; //判断是否可以拖动 值为正常才可以拖动
   var istolink = typeicos.islink == "true" ? " tolink" : "";  //判断是否可以点击 值为正常才可以点击
    var datalist = ""
    datalist += '<div class="white client_list ">';
    datalist += '<dl class="white infofile ' + movecss + '" >';
    datalist += '<dt class="infovideoimg ' + istolink + '" data-link="' + url + '">';
    datalist += '<div class="plantype">' + customer_type + '</div>';
    datalist += '<h2 data-hours="' + hours + '">' + name  + '</h2>';
    datalist += '</dt>';
    datalist += '<dd ref="pharmacy1" data-check="false" class=" isselect ' + istolink + '" data-link="' + url + '">';
    datalist += '<div class="typeico ' + typeico + '" data-marktype="'+mark_type+'" data-leaveShowtype="'+leaveShowtype+'"></div>';
    datalist += '</dd>';
    datalist += '<dd class="tomarkmain" >';
    datalist += '<div class="tomarkwarp">';
    datalist += ' <em class="tomark" id="client_mark" data-palnId="' + plan_id + '">标记</em><em class="tomark" id="client_Leave" data-palnId="' + plan_id + '">请假</em></div>';
    datalist += '</div>';
    datalist += '</dd>';
    datalist += '</dl>';
    datalist += '</div>';
    return datalist
  },
  //获取初始数据
  getinfo: function (currdate) {
    var $this = this;

    var object = new Object();
    object.openId = OpenID;
    object.controlType = "queryMyPlan";
    object.planDay = currdate;
    object.pageSize = "999";
    object.pageNumber = "1";
    object.myPlan = "1";
    object.byMonthOrDay = "day"
    $.ajax({
      url: url,
      data: { paramMap: JSON.stringify(object) },
      type: "post",
      dataType: "json",
      success: function (data) {

        if (this.isMounted()) {
          if (data != "" && data != null && data != undefined) {
            //获取走访客户默认信息成功
            if (data.success == true) {
              console.log("获取走访客户信息成功")
              this.setState({
                isload: false,
              });


              var amlist = "";
              var amlisty = "";
              var amlisty1 = "";
              var amlistn = "";
              var pmlist = "";
              var pmlisty = "";
              var pmlisty1 = "";
              var pmlistn = "";
              var dateday = $("#appDate").val();
              var j = 1;
              var j1 = 1;
              var k = 1;
              var k1 = 0;
              if (data.map.list != "" && data.map.list != null && data.map.list != undefined) {
                var clientdata = data.map.list;
                for (var i = 0; i < clientdata.length; i++) {
                  var businessType = data.map.list[i].customer_type;
                  var flag = isnull(clientdata[i].flag);
                  var name = isnull(clientdata[i].coustom);
                  var custom_id = isnull(clientdata[i].custom_id);
                  var plan_id = isnull(clientdata[i].id);
                  var hours = isnull(clientdata[i].hours);
                 
                  var leaveShowtype = isnull(clientdata[i].leaveShow); //请假状态
                  var mark_type = isnull(clientdata[i].mark_type); //门店状态  
                  

                  //上午
                  var businessTypes = (businessType == 1 ? "CustomerDetails.html" : "BusinessCustomers.html");
                  
                  var id = (businessType == 1 ? "custom_id" : "chain_id");
                  var customer_type = (clientdata[i].customer_type == "1" ? "" : "<img src='../images/mobile/16ls.png'>")
                  var linkurl = businessTypes + '?' + id + '=' + custom_id + '&plan_id=' + plan_id + '&day=' + dateday; //点击跳转的页面
                  //console.log(customer_type)
                  console.log(id);
                  if (hours == "上午") {
                    if (flag == "1") {
                      amlisty += $this.data(linkurl, customer_type, hours, name, plan_id, mark_type, flag, leaveShowtype);
                    }
                    if (flag == "2") {
                      amlisty1 += $this.data(linkurl, customer_type, hours, name, plan_id, mark_type, flag, leaveShowtype);
                    }
                    if (flag == "0") {

                      amlistn += $this.data(linkurl, customer_type, hours, name, plan_id, mark_type, flag, leaveShowtype);
                    }




                  }
                  //上午结束

                  //下午
                  if (hours == "下午") {
                    if (flag == "1") {
                      pmlisty += $this.data(linkurl, customer_type, hours, name, plan_id, mark_type, flag, leaveShowtype);

                    }
                    if (flag == "2") {
                      pmlisty1 += $this.data(linkurl, customer_type, hours, name, plan_id, mark_type, flag, leaveShowtype);

                    }
                    if (flag == "0") {
                      pmlistn += $this.data(linkurl, customer_type, hours, name, plan_id, mark_type, flag, leaveShowtype);

                    }
                  }


                  //下结束午
                }

                var currdate = gettoday().currdate; //当前日期

                var listdate = $("#appDate").val();//获取列表日期
                amlist = amlisty + amlisty1 + amlistn;
                pmlist = pmlisty + pmlisty1 + pmlistn;
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

                //大于等于当前日期
                if (Date.parse(currdate) <= Date.parse(listdate)) {
                  this.refs.client.innerHTML = clientlist + "<div class='addStore white margint_1r' id='addpalns'><i class='addico fa fa-plus'></i>定制计划</div>"
                }
                //小于当前日期
                if (Date.parse(currdate) > Date.parse(listdate)) {
                  this.refs.client.innerHTML = clientlist
                }


                //点击弹出定制框
                $(".client_main").delegate('#addpalns', 'click', function () {
                  var selectday = $("#appDate").val();
                  window.location.href = "addclient.html?selectday=" + selectday;
                });
                //点击弹出定制框结束


                $(".tolink").on("click", function () {
                  var url = $(this).attr("data-link")
                  window.location.href = $(this).attr("data-link");
                })


                $(".totouchmove").on("swipeLeft", function () {
                  $(this).addClass('selected').parents("#addclient").siblings().find(".infofile").removeClass('selected');

                }).on("swipeRight", function () {
                 

                  $(this).removeClass('selected');

                })

                /*  点击标注 */
                $(".tomarkmain").delegate('#client_mark', 'click', function () {
                  var planid = $(this).attr("data-palnId");

                  window.location.href = "mark.html?totype=mark&planId=" + planid;
                });
                /*  点击请假 */
                $(".tomarkmain").delegate('#client_Leave', 'click', function () {
                  var planid = $(this).attr("data-palnId");
                  window.location.href = "mark.html?totype=Leave&planId=" + planid;
                });

              }
              else {
                var text = "您当日没有制定拜访计划<br>请在pc端制定拜访计划"
                var mydate = new Date();

                //获取当天日期
                var currYear = parseInt(mydate.getFullYear());
                var currmonth = parseInt(mydate.getMonth() + 1);
                var currday = parseInt(mydate.getDate());
                var currdatetime = currYear + "-" + addzerro(parseInt(currmonth)) + "-" + addzerro(parseInt(currday));

                //获取列表日期
                var listdate = $("#appDate").val();



                //未定制计划
                var noplan = "";
                noplan += "<div class='nonetwork'>";
                noplan += "<div class='nonetworkwarp'>";
                noplan += "<img src='../images/mobile/nodata.png'>";


                //大于等于当前日期
                if (Date.parse(currdatetime) <= Date.parse(listdate)) {
                  noplan += "<p>你尚未定制计划!</p>";
                  noplan += "<button class='nonetwork_btn' id='addpaln' ref='addpaln'>开始定制</button>";
                }
                //小于当前日期
                if (Date.parse(currdatetime) > Date.parse(listdate)) {
                  noplan += "<p>没有走访客户安排! </p>";
                }

                noplan += "</div>";
                noplan += "</div>";

                this.refs.client.innerHTML = noplan;
                //点击弹出定制框
                $(".nonetworkwarp").delegate('#addpaln', 'click', function () {
                  var selectday = $("#appDate").val();
                  window.location.href = "addclient.html?selectday=" + selectday;
                });
                //点击弹出定制框结束
              }


            }
            //获取走访客户信息失败
            if (data.success == false) {
              this.setState({
                isload: false,
              });
              //未登录
              if (data.errorCode == "1") {
                var dodatate = generateMixed(6)
                window.location.href = wxurl(dodatate);
              }
              //未登录结束
              if (data.errorCode == "7") {
                var text = "您拜访计划没有审核<br>请在找上级主管审核"
                var img = "../images/mobile/nodata.png"
                this.refs.client.innerHTML = Datafaile(text, topreurl("index.html"), "", img, "0")

              }
              else {
                this.refs.client.innerHTML = Datafaile("加载走访信息失败请刷新重试", "", "", "", "0");
              }
              console.log("获取走访客户信息失败:" + data.msg)
            }
          }

        } // this.isMounted() End
      }.bind(this),
      error: function (jqXHR, textStatus, errorThrown) {
        if (this.isMounted()) {
          this.setState({
            isload: false,
          });
          this.refs.client.innerHTML = Datafaile("加载走访信息失败请刷新重试", "", "", "", "0");
          console.log("获取走访客户信息失败：网络错误")
        }
      }.bind(this)
    });
  },

  ajaxclient: function () {

    var datetime = this.refs.appDate.value;
    this.getinfo(datetime);  //获取默认数据

  },

  render: function () {




    return (

      <div className="client_main">
        <div className="profile white" id="pagenav">
          {/*<span className="toleft"> <a href={this.state.referrer}></a></span>*/}
          走访客户安排
        
        </div>
        <div className="calendar">

        </div>

        <div className="profile" id="client" ref="client" >





        </div>
        <Userfooter name="client" />
      </div>




    );
  }
});


ReactDOM.render(
  <Stock />,
  document.getElementById('conter')
);
