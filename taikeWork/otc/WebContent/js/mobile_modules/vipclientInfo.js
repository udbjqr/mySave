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
            referrer: topreurl("index.html"), //上一页
            isclick:true,
            vipid:geturl('id'),
            vipdatalist:[],
            principal:"",
            customer_name:"",
            phone_number:"",
            birthday:"",
        };
    },

    componentDidMount: function () {
        var $this = this;
         //获取初始数据
          var object = new Object();
      
        object.controlType = "load";
        object.pageSize=pagesize;
         object.pageNumber=1;
         object.id=this.state.vipid;
        var showbox = this.refs.content;
        var referrer = this.state.referrer;

        //获取门店初始数据ajax
        ajaxFn(object, $this, function (data) {
            console.log("获取门店初始数据成功")
            if (isnull(data) != "") {
             
                this.setState({
                    principal:data.map.data.principal,
                    customer_name:data.map.data.customer_name,
                    phone_number:data.map.data.phone_number,
                    birthday:dateformdate(data.map.data.birthday, "2"),
                    vipdatalist:data.map.list,
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
            <div id="vipcustomerinfo">
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                   {this.state.principal}
                </div>
                <div ref="content">
                    <div className="vipcustomermain">
                       <h2>{this.state.customer_name}</h2>
                       <div className="vipcustomerinfo">
                       <span>手机：{this.state.phone_number}</span>
                       <span className="old">生日：{this.state.birthday}</span>
                       </div>
                       <div className="vipcustomerinfo">
                       <span>员工职位：经理</span>
                       <span className="old">员工地区：南昌</span>
                       </div>
                       <div className="vipcustomerinfo"><span className="email">邮箱：rttyy@163.com</span></div>
                    </div>
                
                    <div className="profile schedulemain">
                     <dl className="">
                            <dt className="white">2017-01-07</dt>
                            <dd className="white"><span>see魏飞飞飞的激怒IE北风微风纷纷为if及文件费哦呜if今晚iofwfsee魏飞飞飞的激怒IE北风微风纷纷为if及文件费哦呜if今晚iofwf</span></dd>
                        </dl>
                    </div>


                </div>
            </div>
        );
    }
});





ReactDOM.render(
    <Myinformation />,
    document.getElementById('conter')
);




