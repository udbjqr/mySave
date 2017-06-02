import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import Saveproducts from '../../js/mobile_modules/saveproducts.js';

// unStuck  true: 1 <Saveproducts />   false: 2 <Productarticle />  0:没有签到

var url = "/otcdyanmic/appraisals.do?v="+generateMixed(5); 
var currturl = window.location.href;  //获取当前url
var singintype = geturl('singintype'); //登录状态
var daydate = geturl('day'); //走访时间

var parenturl = "testproducts.html?custom_id=" + geturl('custom_id') + "&plan_id=" + geturl('plan_id') + "&singintype=" + singintype + "&day=" + daydate;
var Product = React.createClass({
  getInitialState: function () {
    return {
      Y_login: true,  //是否登录
      referrer: topreurl(parenturl), //上一页
      files: [],
      goodsName: isnull(geturl('goodsName')), //产品名
      custom_id: isnull(geturl('custom_id')),
      plan_id: isnull(geturl('plan_id')),
      visits_id: isnull(geturl('visits_id')),
      goods_id: isnull(geturl('goods_id')),
      remark: "",
      unStuck: "3",
      isclick:true,
    }
  },

  componentDidMount: function () {
    //获取初始数据

    var visitsId = isnull(this.state.visits_id);

    if (visitsId == "") {

      var backval = "testproducts.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate;
      var tosigninurl="signin.html?custom_id="+ this.state.custom_id + "&plan_id=" + this.state.plan_id +"&day="+daydate+"&backtp=1"; 
      
      this.refs.productart_list.innerHTML =showmsg({
          msg: "你还没有签到，请先签到再考核",  //显示的信息,
          isbtn: true,   //是否显示按钮,
          url:tosigninurl,//点击按钮时的跳转链接 为空时为刷新,
          showimg: "",//错误图片,
          btntext: "前往签到页面",//按钮文字,
          classname: "",//样式名
        });

      //var $this=this;

      return false;
    }

    if (visitsId != "") {

      var object = new Object();
      object.openId = OpenID;
      object.controlType = "stockInit";
      object.goods_id = this.state.goods_id;
      object.visits_id = this.state.visits_id;
      object.custom_id = this.state.custom_id;
      $.ajax({
        url: url,
        data: { paramMap: JSON.stringify(object) },
        type: "post",
        dataType: "json",
        success: function (data) {
          if (this.isMounted()) {
            if (data != "" && data != null && data != undefined) {
              //获取默认信息成功
              if (data.success == true) {
                console.log("获取信息成功")
                this.setState({
                  unStuck: data.map.unStuck,
                });

                if (data.map.info != "" && data.map.info != null && data.map.info != undefined) {
                  var datainfo = data.map.info;
                  var produpub;
                  produpub = {
                    "unStuck": data.map.unStuck,
                    "detail_id": isnull(datainfo.detail_id),  //产品id //产品名
                    "purchase_source": isnull(datainfo.purchase_source),  //进货来源
                    "display_surface": isnull(datainfo.display_surface),  //陈列面
                    "weighted_price": isnull(datainfo.weighted_price),    //加价权
                    "purchase_number": isnull(datainfo.purchase_number),   //进货数量
                    "tag_price": isnull(datainfo.tag_price),               //标签价
                    "image_urls": isnull(datainfo.image_urls),             //图片
                    "display_number": isnull(datainfo.display_number),     //陈列数
                    "real_stock": isnull(datainfo.real_stock),              //实际库存 
                    //"shop_point":isnull(datainfo.shop_point),               //铺点数
                    //"sail_total":isnull(datainfo.sail_total),            // 销售额
                    "remark": isnull(datainfo.remark),
                    "batch_number": isnull(datainfo.batch_number)         //批号

                  }
                  PubSub.publish('changprodupub', produpub);

                }



                else {

                  <p className="nodata">页面没有信息</p>
                }

              }
              //获取信息失败
              if (data.success == false) {
                //未登录
                if (data.errorCode == "1") {
                  var dodatate = generateMixed(6)
                  window.location.href = wxurl(dodatate);
                }
                //未登录结束
                this.refs.productart_list.innerHTML = '<p class="nodata">获取信息失败</p>';

                console.log("获取信息失败:" + data.msg)
              }
            }

          } // this.isMounted() End
        }.bind(this),
        error: function (jqXHR, textStatus, errorThrown) {
          if (this.isMounted()) {
            this.refs.productart_list.innerHTML = '<p class="nodata">获取信息失败,请检查你的网络是否正常</p>'

            console.log("获取信息失败：网络错误")
          }
        }.bind(this)
      });
    }
  },
  back: function () {
    window.location.href = this.state.referrer;
  },


  render: function () {
    var $this=this;
    var unStuck = this.state.unStuck;
    if (unStuck == true) {

      if (singintype == "alreadySign") {
       
        var tips = showmsg({
          msg: "此门店已经签出，不能再修改添加考核产品",  //显示的信息,
          isbtn: true,   //是否显示按钮,
          url: $this.state.referrer,//点击按钮时的跳转链接 为空时为刷新,
          showimg: "",//错误图片,
          btntext: "返回上一页",//按钮文字,
          classname: "",//样式名
        })
        return (
            <div dangerouslySetInnerHTML={createMarkup(tips)}></div>
        )
      }
      //未签出
      else {
  return (
    <div>
      {this.state.unStuck}
      <Saveproducts />

    </div>
  )
}

    }
if (unStuck == false) {
  return (
    <div>
      {this.state.unStuck}
      <Productarticle />
      <div ref="productart_list">

      </div>
    </div>
  )
}
if (unStuck == "3") {
  return (
    <div>
      <div className="profile white" id="pagenav">
        <span className="toleft"><a href={this.state.referrer}></a></span>
        {this.state.goodsName}

      </div>
      <div ref="productart_list">
      </div>
    </div>
  )
}


  }
 

})









var Productarticle = React.createClass({
  getInitialState: function () {
    return {
      Y_login: true,  //是否登录
      referrer: topreurl(parenturl), //上一页
      files: [],
      goodsName: geturl('goodsName'), //产品名
      custom_id: geturl('custom_id'),
      plan_id: geturl('plan_id'),
      visits_id: geturl('visits_id'),
      goods_id: geturl('goods_id'),
      purchase_source: "",  //进货来源
      display_surface: "",  //陈列面
      weighted_price: "",    //加价权
      purchase_number: "",   //进货数量
      tag_price: "",               //标签价
      image_urls: "",         //图片
      display_number: "",     //陈列数
      real_stock: "",           //实际库存 
      // shop_point:"",               //铺点数
      //sail_total:"" ,          // 销售额
      remark: "",
      batch_number: ""        //批号
    }
  },




  componentDidMount: function () {
    //$(document).attr("title", this.state.goodsName + "-南华药业");
    this.pubsub_token = PubSub.subscribe('changprodupub', function (topic, newItem) {
      this.setState({
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

      //处理图片
      var imgs = newItem.image_urls

      if (imgs != "" && imgs.length > 0) {

        //单个
        if (imgs.indexOf(";") == -1) {  //单个

          $(".producephoto").append("<img src=" + isnullimg(imgs) + " />");
        }
        //单个结束 

        //多个
        if (imgs.indexOf(";") > -1) {  //多个

          var imgspits = imgs.split(";");

          for (var i = 0; i <= imgspits.length - 1; i++) {

            $(".producephoto").append("<div class='pruductimgs'><img src='" + isnullimg(imgspits[i]) + "' /><br><h2>产品图片" + (i + 1) + "</h2></div>");
          }

        }
        //多个结束
      }
      //producephoto

      //处理图片结束

    }.bind(this));



    // this.getinfo();
  },

  componentWillUnmount: function () {
    PubSub.unsubscribe(this.pubsub_token);
  },


  render: function () {
    return (
      <div>
        <div className="profile white" id="pagenav">
          <span className="toleft"> <a href={this.state.referrer}></a></span>
          {this.state.goodsName}

        </div>
        <div className="producephoto" ref="producephoto">

        </div>
        <h1 className="saveprodt_Title ">库存</h1>
        <div className="profile pro_border ">
          <dl className="white profile_pading save_input" id="save_input">
            <dt><label>陈列面：</label>{this.state.display_surface}个</dt>
            <dd><label>陈列数：</label>{this.state.display_number}个</dd>
          </dl>
          <dl className="white profile_pading save_input" id="save_input">
            <dt><label>实际库存：</label>{this.state.real_stock}</dt>
            <dd><label>标签价：</label>{this.state.tag_price}元</dd>
          </dl>
          {/*
          <dl className="white save_input profile_pading" id="save_input">
            <dt></dt>
            <dd></dd>
          </dl>
          
          <dl className="white save_input profile_pading" id="save_input">
          <dt><span><label>销售总额：：</label>{this.state.sail_total}元</span></dt>
            <dd><label>加价权：</label>{this.state.weighted_price}%</dd>
            <dd></dd>
          </dl>
          */}
        </div>
        <h1 className="saveprodt_Title  ">进货</h1>
        <div className="profile pro_border ">
          <dl className="white save_input profile_pading" id="save_input">
            <dt><label>进货数量：</label>{this.state.purchase_number}</dt>
            <dd> <label>批号：</label>{this.state.batch_number}</dd>
          </dl>
          <dl className="white save_input profile_pading" id="save_input">
            <dt><label>进货来源：</label>{this.state.purchase_source} </dt>

          </dl>
        </div>
        <h1 className="saveprodt_Title  ">备注</h1>
        <div className="stockrpb borderb_1r">{this.state.remark}</div>

      </div>

    );
  }
});

ReactDOM.render(
  <Product />,
  document.getElementById('conter')
);




