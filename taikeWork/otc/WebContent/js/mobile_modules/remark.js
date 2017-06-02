
import React from 'react'
import {render} from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'


var Remark= React.createClass({
    getInitialState: function () {
        return {
            Y_login: true,  //是否登录
            referrer: topreurl("CustomerDetails.html") //上一页
        };
    },
componentDidMount: function () {

},
 check: function () {
    var remark_text = $("#remark_text").val();
    if (remark_text == "" && remark_text.length <= 0) {
      layer.open({
        shade: false,
        content: '请输入你要纪录的内容',
        skin: 'msg',
        className: 'tip',
        time: 2//2秒后自动关闭
      });
      return false;
    }
    else {
     layer.open({
        shade: false,
        content: '提交成功',
        skin: 'msg',
        className: 'tip',
        time: 2//2秒后自动关闭
      });
         return false;
    }
  },
render: function () {
        return (
            <div>
                 <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={this.state.referrer}></a></span>
                  备注
                </div>
                <div className="margint_1r white remark_box">
                 <textarea name="remark_text" id="remark_text" cols="450" rows="5" placeholder="请输入你要纪录的内容"></textarea>
                </div>
                <button className="fn-btn" onTouchStart={this.check}>确认</button>
            </div>
        );
    }
});

ReactDOM.render(
    <Remark />,
    document.getElementById('conter')
);




