import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'
//import cropper from 'cropper'


var url = "/otcdyanmic/employee.do";
var currturl = window.location.href;  //获取当前url
var Myinformation = React.createClass({
    render: function () {
        return (
            <div>
                <Information />
            </div>
        )
    }

});


var Information = React.createClass({
    getInitialState: function () {
        return {
            head_portrait: dft_headimg,
            realName: "",
            mobile: "",
            depName: "",
            loginName: "",
            areaName: "",
            position: "",
            group: "",
            groupName: "",
            email: "",
            referrer: topreurl("index.html"), //上一页
            isclick:true,
            pagecount:"",
            currentpage:1,
            vipdata:[] ,//vip数据集
        };
    },

    componentDidMount: function () {
        var $this = this;
         //获取初始数据
          var object = new Object();
      
        object.controlType = "query";
        object.pageSize=pagesize;
         object.pageNumber=1;
        var showbox = this.refs.content;
        var referrer = this.state.referrer;

        //获取门店初始数据ajax
        ajaxFn(object, $this, function (data) {
            console.log("获取门店初始数据成功")
            if (isnull(data) != "") {

                this.setState({
                    pagecount:data.map.count,
                    vipdata:data.map.list,
                });

            }
        }, "/otcdyanmic/vipCustomer.do", showbox, referrer)
    },

    render: function () {
        var state = generateMixed(5);
        var crrentindex = currturl.split("mobile")[0];
        var updatephoto = "";
        if (is_weixin) {
            updatephoto = wxauth = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbfff10e577b27a7&redirect_uri=" + crrentindex + "mobile/getauthcode.html&response_type=code&scope=snsapi_base&state=" + state + "#wechat_redirect";
        }
        else {
            updatephoto = "avatar.html"
        }
        return (
            <div id="vipcustomer">
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                    vip客户管理
                    <div className="addvip"></div>
                </div>
                <div ref="content">
                <Vipclientdata options={this.state.vipdata}/>
               
                    
                



                </div>
            </div>
        );
    }
});

/*列表*/
var Vipclientdata = React.createClass({
    render:function () {
        return (
         <div className="vipclientmain">
         {this.props.options.map(function (data,i) {
                   var birthdayStatus=data.birthdayStatus=="true"?<ico className="birthdayico"><img src="../images/mobile/birthday.png" /></ico>:"";
                     return ( 
                    <div key={i} className="profile margint_1r">
                       
                        <dl className="white ">
                            <a href={"vipclientInfo.html?id="+data.id} className="profile_pading">
                                <dt><span className="customername">{data.principal} {birthdayStatus}</span><span className="customerpost">{data.position}</span></dt>
                                <dd><span>{data.address}</span></dd>
                            </a>
                        </dl>
                        
                    </div>
                    )
                   
                    })}
         </div>           

        );
    }

});



ReactDOM.render(
    <Myinformation />,
    document.getElementById('conter')
);




