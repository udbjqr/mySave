import React from 'react'
import { render } from 'react-dom'
import Icon from 'antd/lib/Icon'
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
		if (localStorage.getItem("Car_username")) {
			this.refs.check.checked = true;
			this.refs.username.value = localStorage.getItem("Car_username");
		} else {
			this.refs.check.checked = false;
		}
		/*快捷键*/
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
        if (this.refs.username.value == "" || this.refs.password.value == "") {
			this.refs.prompt.innerHTML = "用户名或密码不能为空!";
            $($this.refs.loginbtn).removeAttr("disabled");
			return false;
		} else {
			this.refs.prompt.innerHTML = "";
			if(this.refs.validateInput.value){
				$.ajax({
					type: "post",
					data: {"paramMap":JSON.stringify({ "loginName": this.refs.username.value, "passWord": this.refs.password.value,"validateCode":this.refs.validateInput.value})},
					url: "/otcdyanmic/mangerLogin.do",
					dataType: "json",
					success: function success(data) {
	                    $($this.refs.loginbtn).removeAttr("disabled");
						if (data.success) {
							window.location.href = 'index.html';
						} else {
							$this.refs.prompt.innerHTML = data.msg;
							return false;
						}
					},
					error:function (XMLHttpRequest, textStatus, errorThrown) {
	                    $this.refs.prompt.innerHTML = "内部错误，请联系管理员！";
	                    $($this.refs.loginbtn).removeAttr("disabled");
					}
				});
			}else{
				$($this.refs.loginbtn).removeAttr("disabled");
				this.refs.prompt.innerHTML = "请填写验证码！";
			}
		};
	},//checkbox改变时保存或删除用户名
	keep:function(){
		if (this.refs.check.checked) {
			localStorage.setItem("Car_username", this.refs.username.value);
		} else {
			localStorage.removeItem("Car_username");
		};
	},/*键盘事件缓存*/
	keyCache:function(e){
        if (this.refs.check.checked) {
            localStorage.setItem("Car_username", e.target.value);
        };
	},
	changeImg:function(){
		this.setState({url:Math.random()});
	},
	render:function(){
		return (
			<div className="panel">
				<div className="panel-heading">登录</div>
				<div className="panel-body">
					<div className="input-group">
						<span className="input-group-addon">
							<span className="glyphicon glyphicon-user"></span>
						</span>
						<input ref="username" type="text" className="form-control" placeholder="用户名"/>
					</div>
					<div className="input-group mt15">
						<span className="input-group-addon">
							<span className="glyphicon glyphicon-lock"></span>
						</span>
						<input ref="password" type="password" className="form-control" placeholder="密码"/>
					</div>
					<div className="input-group mt15">
						<span className="input-group-addon" style={{height:"34px"}}>
							<Icon type="check-circle" />
						</span>
						<input ref="validateInput" type="text" className="form-control validateInput" placeholder="验证码"/>
						<img onClick={this.changeImg} src={"/otcdyanmic/validate.do?m="+this.state.url} width={110} height={34} style={{marginLeft:"15px"}} />
						<span className="updateImg" onClick={this.changeImg}>换一张</span>
					</div>
					<div className="form-inline mt15">
						<div className="checkbox">
							<label htmlFor="remember"><input ref="check" id="remember" type="checkbox" onChange={this.keep}/>记住我</label>
						</div>
						<p className="prompt" ref="prompt"></p>
					</div>
					<button ref="loginbtn" onClick={this.submit} className="btn btn-block">登录</button>
				</div>
			</div>
		);
	}
});
render(<Login />,document.getElementById("login"));
