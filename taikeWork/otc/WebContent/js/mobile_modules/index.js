import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
import Userfooter from '../../js/mobile_modules/userfooter.js'
import '../../js/mobile_modules/ajaxFn.js'
var url = "/otcdyanmic/employee.do";
var Usercenterlist = React.createClass({
  getInitialState: function () {
    return {
      isclick: true,  //设置按钮是否可以点击 防止提交时多次点击按钮
      head_portrait: dft_headimg,  //用户头像
      realName: "",   //用户真实姓名
      mobile: "",     //用户手机号
      depName: "",    //部门名称
      loginName: "",  //登录名
      areaName: "",
      groupName: "",  //职位
      mname: "",      //显示名称
      isAudit: "false",     //是否有审核权限
      openId: isnull(sessionStorage.getItem("OpenID"))
    };
  },

  componentDidMount: function () {
    var $this = this;
    OpenID = isnull(sessionStorage.getItem("OpenID")); //缓存中OpenID
    console.log("openid:" + this.state.openId)
    this.test();
    //获取基本信息
    var object = new Object();
    object.controlType = "load";
    var showbox = this.refs.content;
    ajaxFn(object, $this, function (data) {
      sessionStorage.setItem("OpenID", isnull(data.map.employee.userId)); //缓存获取的OpenID
      $this.setState({
        head_portrait: isnullheadimg(data.map.employee.headPortrait), //后台获取的头像
        realName: isnull(data.map.employee.realName),  //真实姓名
        mobile: isnull(data.map.employee.mobile),  //用户手机
        depName: isnull(data.map.employee.depName), //部门名称
        loginName: isnull(data.map.employee.loginName), //登录名
        areaName: isnull(data.map.employee.areaName),  //
        groupName: isnull(data.map.employee.groupName),//职位
        openId:this.state.openId
      });
    }, url, showbox)
    //获取基本信息结束
    this.isAudit(); //获取审核权限
  },

  /*获取审核权限，通过权限显示审核菜单*/
  isAudit: function () {
    var $this = this
    var showbox = this.refs.content;
    var referrer = this.state.referrer;
    var object = new Object();
    object.controlType = "isShowVisitPlanAuditMenu";
    ajaxFn(object, $this, function (data) {
      console.log("获取权限状态成功");
      $this.setState({
        isAudit: data.map.isShowMenu,
      })
    }, "/otcdyanmic/visitPlan.do", showbox, referrer)
  },
  /*用来测试的，只有特定的用户才显示 */
  test: function () {
    if (this.state.openId == "gaogao" || this.state.openId =="jxhuihui" ) {
      return (
        <div>
          <dl className="white toico">
            <a href={"signin1.html"} className="profile_pading">
              <dt><img src={"../images/mobile/11data.png"} />定位测试</dt>
            </a>
          </dl>
          <dl className="white toico">
            <a href={"getpoint.html"} className="profile_pading">
              <dt><img src={"../images/mobile/11data.png"} />测试页面</dt>
            </a>
          </dl>


        </div>
      )
    }
    else {
      return "";
    }
  },
  /*工作计划审核显示 (有权限的用户显示，没权限的用户不显示)*/
  isshowAudit() {
    if (this.state.isAudit == "true") {
      return (
        <div className="profile marginb_1r">
          <dl className="white toico">
            <a href={"Planreview.html"} className="profile_pading">
              <dt><img src={"../images/mobile/11data.png"} />工作计划审核</dt>
            </a>
          </dl>
        </div>
      );
    }
    if (this.state.isAudit == "false") {
      return "";
    }
  },
  render: function () {
    return (
      <div className="userprofile" ref="content">
        <div className="user_header">
          <div className="user_headimg">
            <a href={"myinformation.html"} className="profile_pading">
              <img src={this.state.head_portrait} />
            </a>
          </div>
          <div className="user_headinfo">
            <span>{this.state.realName}</span>
            {this.state.depName}
          </div>
        </div>

        <div className="profile marginb_1r">

          <dl className="white toico">
            <a href={"Kpicheck.html"} className="profile_pading">
              <dt><img src={"../images/mobile/7KPI.png"} />信息查询</dt>
            </a>
          </dl>
          <dl className="white toico">
            <a href={"vipclienList.html"} className="profile_pading">
              <dt><img src={"../images/mobile/7KPI.png"} />vip客户管理</dt>
            </a>
          </dl>
        </div>

        <div className="profile marginb_1r">
          <dl className="white toico">
            <a href={"Videoshare.html"} className="profile_pading">
              <dt><img src={"../images/mobile/8photo.png"} />视频共享</dt>
            </a>
          </dl>
          <dl className="white toico">
            <a href={"Photoshare.html"} className="profile_pading">
              <dt><img src={"../images/mobile/9video.png"} />共享图片</dt>
            </a>
          </dl>
          <dl className="white toico">
            <a href={"informationfile.html"} className="profile_pading">
              <dt><img src={"../images/mobile/10zl.png"} />资料文件</dt>
            </a>
          </dl>
        </div>
        <div className="profile marginb_1r">
          <dl className="white toico">
            <a href={"myinformation.html"} className="profile_pading">
              <dt><img src={"../images/mobile/11data.png"} />个人资料</dt>
            </a>
          </dl>
        </div>
        {this.isshowAudit()}
        <div className="profile marginb_1r">
          {this.test()}
        </div>
        <Userfooter name="index" />
      </div>
    );
  }
});


ReactDOM.render(
  <Usercenterlist />,
  document.getElementById('conter')
);
