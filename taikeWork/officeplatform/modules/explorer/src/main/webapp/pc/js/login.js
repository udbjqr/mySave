import React from 'react'
import { render } from 'react-dom'
import message from 'antd/lib/message'
import 'antd/dist/antd.css'
import '../less/login.less'



//用户名输入
var Login = React.createClass({
	getInitialState:function(){
		return {
			url:"0"
		}
	},
	//进入时判断是否保存过用户名,
	componentDidMount:function(){
		var $this = this;
		if (localStorage.getItem("OA_username")) {
			this.refs.check.checked = true;
			this.refs.username.value = localStorage.getItem("OA_username");
		} else {
			this.refs.check.checked = false;
		}
		/*回车快捷键*/
        document.onkeydown=function(event){
            var e = event || window.event;
             if(e && e.keyCode==13){ // enter 键
                 $this.submit();
            }
        };
	},/*提交*/
	submit:function(){
		var $this = this;
        $(this.refs.loginbtn).attr("disabled","true");
        if (this.refs.username.value == "" || this.refs.password.value == ""){
			message.warning("用户名或密码不能为空!");
            $($this.refs.loginbtn).removeAttr("disabled");
			return false;
		} else {
			if(this.refs.validateInput.value){
				$.ajax({
					type: "post",
					data: {"paramMap":JSON.stringify({controlType:"mangerLogin", "loginName": this.refs.username.value, "passWord": this.refs.password.value,"validateCode":this.refs.validateInput.value})},
					url: "/officedyanmic/userLogin.do",
					dataType: "json",
					success: function success(data) {
	                    $($this.refs.loginbtn).removeAttr("disabled");
						if (data.success) {
							window.location.href = 'index.html';
						} else {
							message.warning(data.msg);
							return false;
						}
					},
					error:function (XMLHttpRequest, textStatus, errorThrown) {
	                    message.warning("内部错误，请联系管理员！");
	                    $($this.refs.loginbtn).removeAttr("disabled");
					}
				});
			}else{
				$($this.refs.loginbtn).removeAttr("disabled");
				message.warning("请填写验证码！");
			}
		};
	},//checkbox改变时保存或删除用户名
	keep:function(){
		if (this.refs.check.checked) {
			localStorage.setItem("OA_username", this.refs.username.value);
		} else {
			localStorage.removeItem("OA_username");
		};
	},/*键盘事件缓存*/
	keyCache:function(e){
        if (this.refs.check.checked) {
            localStorage.setItem("OA_username", e.target.value);
        };
	},
	changeImg:function(){
		this.setState({url:Math.random()});
	},
	render:function(){
		return (
			<div className="login-box">
                <input ref="username" type="text" className="login-form" placeholder="用户名"/>
                <input ref="password" type="password" className="login-form" placeholder="密码"/>
                <div className="input-group">
                    <input ref="validateInput" type="text" className="validateInput" placeholder="验证码"/>
                    <img onClick={this.changeImg} src={"/officedyanmic/validate.do?m="+this.state.url} width={110} height={34} style={{marginLeft:"15px"}} />
                    <span className="updateImg" onClick={this.changeImg}>换一张</span>
                </div>
                <div className="form-inline mt15 mb5">
                    <div className="login-checkbox">
                        <label htmlFor="remember"><input ref="check" id="remember" type="checkbox" onChange={this.keep}/>记住我</label>
                    </div>
                </div>
                <button ref="loginbtn" onClick={this.submit} className="btn login-btn">登录</button>
			</div>
		);
	}
});

render(<Login />,document.getElementById("login"));
