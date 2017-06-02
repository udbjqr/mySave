import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import Userfooter from '../../js/mobile_modules/userfooter.js'
import Kpicheck from '../../js/mobile_modules/Kpicheck.js'

var url = "/otcdyanmic/employee.do";
//var Kpishowtype = isnull(sessionStorage.getItem("Kpishowtype")); //缓存中OpenID

var Kpicheckmain = React.createClass({
  getInitialState: function () {
    return {
      Y_login: true,  //是否登录

      Kpishowtype: "Kpiinquire"
    };
  },

  componentDidMount: function () {
    var $this = this
    this.pubsub_token = PubSub.subscribe('changtype', function (topic, newItem) {
      $this.setState({
        Kpishowtype: newItem.Kpishowtype  //显示方式

      });
    });
  },
  componentWillUnmount: function () {
    PubSub.unsubscribe(this.pubsub_token);
  },
  torefs: function () {
  setTimeout(function () {
        location.reload();
    }, 320)
  },
  render: function () {

    if (this.state.Kpishowtype == "Kpiinquire" || this.state.Kpishowtype == "") {

      return (
        <div>
          <Kpiinquire />
        </div>
      )

    }
    if (this.state.Kpishowtype == "Kpicheck") {

      return (
        <div>
          <Kpicheck />
        </div>
      )

    }

    else {
      var errotext = showmsg({
        msg: "手机端暂时未开放kpi考核数据",  //显示的信息,
        isbtn: true,   //是否显示按钮,
        url: "",//点击按钮时的跳转链接 为空时为刷新,
        showimg: "",//错误图片,
        btntext: "立即返回",//按钮文字,
        classname: "",//样式名
      })
      return (
        <div className="userprofile">

          <div className="profile white" id="pagenav">
            <span className="toleft" onTouchEnd={this.torefs}> <a href={"javascript:void(0)"}></a></span>
            KPI考核
                    {/*<span className="toregulate">校正</span>*/}
          </div>
         
          <div dangerouslySetInnerHTML={createMarkup(errotext)}></div>
          
        </div>
      )
    }


  }

});




//显示kpi考核列表
var Kpiinquire = React.createClass({
  getInitialState: function () {
    return {
      openId: "",
      referrer: topreurl("index.html"), //上一页
      Kpishowtype:"Kpicheck1"   //显示状态 "Kpicheck"：kpi考核页面   "erroKpi"或其他 ：不显示时显示
    };
  },

  componentDidMount: function () {


  },
  tokpi: function () {

    var searchinfo = {
      'Kpishowtype': this.state.Kpishowtype,
    }

    PubSub.publish('changtype', searchinfo);
    //sessionStorage.setItem("Kpishowtype", "Kpicheck");
  },


  toreferrers: function () {
    var $this = this
    setTimeout(function () {
      window.location.href = $this.state.referrer
    }, 320)

  },

  render: function () {

    return (
      <div className="userprofile">

        <div className="profile white" id="pagenav">
          <span className="toleft" onTouchEnd={this.toreferrers}> <a href={"javascript:void(0)"}></a></span>
          KPI考核
                    {/*<span className="toregulate">校正</span>*/}
        </div>
        <div id="kpimain">
          <div className="profile margint_1r">

            <dl className="white toico">
              <a href={"javascript:void(0)"} className="profile_pading" onTouchEnd={this.tokpi}>
                <dt><img src={"../images/mobile/7KPI.png"} />KPI考核</dt>
              </a>
            </dl>

          </div>


          <Userfooter name="index" />
        </div>
      </div>
    );
  }
});


ReactDOM.render(
  <Kpicheckmain />,
  document.getElementById('conter')
);




