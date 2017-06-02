import React from 'react'
import {Link} from 'react-router'
import message from 'antd/lib/message'              /*antd 提示组件*/
import '../utils/bootstrap/js/dropdown.js'             /*下拉插件*/
import '../../less/index.less'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import Icon from 'antd/lib/icon'                    /*图标样式*/
const confirm = Modal.confirm;


var Sider =  React.createClass({
    /*ajax 封装*/
    ajaxFn:function(returnData,callback,javaUrl = '/otcdyanmic/homePage.do'){
        var $this = this;
        $.ajax({
            type:"post",
            url:javaUrl,
            data:{paramMap:JSON.stringify(returnData)},
            dataType: "json",
            async:false,	//false 表示ajax执行完成之后在执行后面的代码
            success:function(data){
                if(!data.success){/*首先判断这个属性，错误在判断原因*/
                    switch(data.errorCode){
                        case  (1):
                            window.location.href = 'login.html';
                            break;
                        case  (2):
                            Modal.warning({title: '警告提示：',content: '此用户不存在或已禁用，请联系管理员！'});
                            break;
                        case  (3):
                            Modal.error({title: '错误提示：',content: '发生严重错误，请联系管理员！！'});
                            break;
                        case  (4):
                            Modal.error({title: '错误提示：',content: '发生严重错误，请联系管理员！！'});
                            break;
                        case  (5):
                            Modal.warning({title: '警告提示：',content: '当前用户没有此操作权限！'});
                            break;
                        default:
                            Modal.warning({title: '警告提示：',content: data.msg});
                            break;
                    }
                }else{
                    callback.call($this,data);
                }
            },
            error(){
                Modal.error({title: '错误提示：',content: '内部异常，请联系管理员！！'});
            }
        });
    },
	getInitialState:function(){
		return {
            menuObj: [],     /*权限控制*/
            userName:"",     /*用户名*/
            tick:true         /*菜单缩进标记*/
        }
	},//左边菜单下拉，上拉事件
	collapse:function(e){
        var cHeight = $(e.target).parent().next().height();
        var childLen = $(e.target).parent().next().find("li:visible").length;
		$(e.target).parent().next().animate({"height":(cHeight <= 0 ? 40*childLen : 0)});
		cHeight <= 0 ? $(e.target).find(".glyphicon-menu-right").addClass("transformRotate") : $(e.target).find(".glyphicon-menu-right").removeClass("transformRotate");
	},
    componentDidMount:function(){
        if(true){
            message.success('欢迎进入OTC事业部管理平台');
        }
    	//左边菜单点击选中
        $("#sider .panel-list").click(function () {
	    	$("#sider .panel-list").each(function(i){
	    	 	var hideAttr = $(this).find("span").data("yclass");
                $(this).find("span").removeClass(hideAttr);
	    	});
	    	$("#sider .panel-list").removeClass("sider");
            $("#sider .panel-child").find("a").css("color","#666");
        	var hideAttr = $(this).find("span").data("yclass");
        	$(this).find("span").addClass(hideAttr);
            $(this).addClass("sider");
        });

        /*子菜单选中样式*/
        $("#sider .panel-child").click(function () {
            $("#sider .panel-list").each(function(i){
                var classVal = $(this).find("span").data("yclass");
                $(this).find("span").removeClass(classVal);
            });
            $("#sider .panel-child").find("a").css("color","#666");
            $("#sider .panel-list").removeClass("sider");
            var hideAttr =  $(this).parents(".panel-collapse").prev().find("span").data("yclass");
            $(this).parents(".panel-collapse").prev().find("span").addClass(hideAttr);
            $(this).parents(".panel-collapse").prev().addClass("sider");
            $(this).find("a").css("color","#090");
        });

        /*进入时*/
        this.ajaxFn({"controlType":"getMenus"},function(data){
            this.setState({
                menuObj:data.map.menus,
                userName:data.map.userName
            });
        })
        //进入时刷新左边样式
        this.resetting();


        /*缩进按钮高度调整*/
        var winH = $(window).height();
        $(this.refs.indent).css({"top":(winH/2)});

    },//刷新
    resetting:function(){
    	$("#sider .panel-list").each(function(i){
            var classVal = $(this).find("span").data("yclass");
            $(this).find("span").removeClass(classVal);
    	 });
    	$("#sider .panel-list").removeClass("sider");
        $("#sider .panel-list").eq(0).addClass("sider");
        $("#sider .panel-list").eq(0).find("span").addClass("y0");
    },/*退出*/
	signOut(){
        confirm({
            title: '提示',
            content: (<p className="popup-text">您确定要退出吗？</p>),
            onOk() {
                $.ajax({
                    type:"get",
                    url:"/otcdyanmic/systemExit.do?systemExit=0",
                    success:function (data) {
                        var dataObj = eval('('+data+')');
                        if(dataObj.success){
                            message.success('您已退出OTC事业部管理平台');
                            setTimeout(function () {
                                window.location.href = "login.html";
                            },500)
                        }
                    }
                });
            },
            onCancel() {},
        });
	},/*权限判断*/
    hasArray(num){
	    if(this.state.menuObj[0] == "0"){
            return false;
        }else{
            if(this.state.menuObj.indexOf(num) != -1){
                return false;
            }else{
                return true;
            }
        }
    },/*缩进*/
    indent(){
        var mLeft = $("#middle-content").css("marginLeft");
        this.setState({tick:(mLeft == "0px" ? true:false)})
        $("#middle-content").animate({"marginLeft":(mLeft == "0px" ? "250px":"0")});
    },
	render:function(){
        const IconIndent = (this.state.tick ? <Icon type="double-left" /> : <Icon type="double-right" />);
		return (
			<div>
				<header className="row header">
					<div className="col-xs-7 col-sm-7 col-md-7 col-lg-3 h50">
						<a href="#" className="logo" onClick={this.resetting}>
                            <img src="images/logo.png" alt="OTC事业部管理平台" />
                            <span className="logo-text">OTC事业部管理平台</span>
                        </a>
					</div>
					<div className="col-xs-5 col-sm-5 col-md-5 col-lg-9 h50">
						<div className="head-r-d fr">
							<div className="fl h-user">
                                <p className="fr user-text"  data-toggle="dropdown">{this.state.userName}<span className="caret greenColor"></span></p>
								<div className="fl userhede" data-toggle="dropdown">
									<span className="user-icon glyphicon glyphicon-user greenColor"></span>
								</div>
								<ul className="dropdown-menu pull-right" >
									<li>
										<a href="#persInfo">
											<span className="glyphicon glyphicon-user greenColor p-r-5"></span>
											个人信息
										</a>
									</li>
									<li>
										<a href="#modifyPassword">
											<span className="glyphicon glyphicon-cog greenColor p-r-5"></span>
											修改密码
										</a>
									</li>
									<li className="divider"></li>
									<li>
										<a href="javascript:void(0)" onClick={this.signOut}>
											<span className="glyphicon glyphicon-log-out greenColor p-r-5"></span>
											退出
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<nav className="nav-left" id="nav-left">
						<div className="panel" id="sider">
							<div className="list-margin"></div>
							<div className="panel-list">
								<Link to="/home" className="collBtn" >
									<span className="car-icon-home fl" data-yclass="y0"></span>首页
								</Link>
							</div>
                            <ul className="panel-collapse h0"></ul>

                            <div className="panel-list">
                                <a onClick={this.collapse} className="collBtn" >
                                    <span className="car-icon-chart fl" data-yclass="y6"></span>统计报表<span className="glyphicon glyphicon-menu-right fr"></span>
                                </a>
                            </div>
                            <ul className="panel-collapse h0">
                                <li className={"panel-child"+(this.hasArray(73)?" none":"")}><Link to="/salesChart" className="aColor090s">销售统计报表</Link></li>
                            </ul>

                            <div className="panel-list">
                                <a onClick={this.collapse} className="collBtn" >
                                    <span className="car-icon-sale fl" data-yclass="y7"></span>销售管理<span className="glyphicon glyphicon-menu-right fr"></span>
                                </a>
                            </div>
                            <ul className="panel-collapse h0">
                                <li className={"panel-child"+(this.hasArray(74)?" none":"")}><Link to="/salesInquiries" className="aColor090s">南华销售查询</Link></li>
                                <li className={"panel-child"+(this.hasArray(85)?" none":"")}><Link to="/customerSaleQuery" className="aColor090s">客户门店销量查询</Link></li>
                                <li className={"panel-child"+(this.hasArray(88)?" none":"")}><Link to="/idMatchSetUp" className="aColor090s">ID匹配设置</Link></li>
                            </ul>
							<div className="panel-list">
								<a onClick={this.collapse} className="collBtn" >
									<span className="car-icon-user fl" data-yclass="y1"></span>产品管理<span className="glyphicon glyphicon-menu-right fr"></span>
								</a>
							</div>
                            <ul className="panel-collapse h0">
                                <li className={"panel-child"+(this.hasArray(70)?" none":"")}><Link to="/productList" className="aColor090s">产品列表</Link></li>
                                <li className={"panel-child"+(this.hasArray(71)?" none":"")}><Link to="/costControls">成本管理</Link></li>
                                {/*<li className={"panel-child"+(this.hasArray(72)?" none":"")}><Link to="/salesInquiries">销售查询</Link></li>*/}
                            </ul>
                            <div className="panel-list">
								<a onClick={this.collapse} className="collBtn" >
									<span className="car-icon-baodan fl" data-yclass="y8"></span>拜访统计<span className="glyphicon glyphicon-menu-right fr"></span>
								</a>
							</div>
                            <ul className="panel-collapse h0">
                                <li className={"panel-child"+(this.hasArray(81)?" none":"")}><Link to="/store">门店拜访统计</Link></li>
                                <li className={"panel-child"+(this.hasArray(93)?" none":"")}><Link to="/product">产品拜访统计</Link></li>
                                <li className={"panel-child"+(this.hasArray(92)?" none":"")}><Link to="/representativeQuery">代表拜访查询</Link></li>                                
                            </ul>
							<div className="panel-list">
								<a onClick={this.collapse} className="collBtn" >
									<span className="car-icon-car fl" data-yclass="y2"></span>资料管理<span className="glyphicon glyphicon-menu-right fr"></span>
								</a>
							</div>
                            <ul className="panel-collapse h0">
                                <li className="panel-child"><Link to="/dataManage">文件管理</Link></li>
                                <li className="panel-child"><Link to="/imgManage">图片管理</Link></li>
                                <li className="panel-child"><Link to="/videoShare">视频共享</Link></li>
                            </ul>
							<div className="panel-list">
								<a onClick={this.collapse} className="collBtn" >
									<span className="car-icon-baodan fl" data-yclass="y3"></span>客户管理<span className="glyphicon glyphicon-menu-right fr"></span>
								</a>
							</div>
                            <ul className="panel-collapse h0">
                                <li className={"panel-child"+(this.hasArray(76)?" none":"")}><Link to="/chainCustomers">门店客户</Link></li>
                                <li className={"panel-child"+(this.hasArray(77)?" none":"")}><Link to="/businessCustomers">商业客户</Link></li>
                                {/*<li className={"panel-child"+(this.hasArray(77)?" none":"")}><Link to="/vipclientlist">vip客户管理</Link></li>*/}
                            </ul>
							<div className="panel-list">
								<a onClick={this.collapse} className="collBtn" >
									<span className="car-icon-money" data-yclass="y4"></span>考核管理<span className="glyphicon glyphicon-menu-right fr"></span>
								</a>
							</div>
                            <ul className="panel-collapse h0">
                                <li className={"panel-child"+(this.hasArray(50)?" none":"")}><Link to="/examinationSetting">考核设置</Link></li>
                                <li className={"panel-child"+(this.hasArray(80)?" none":"")}><Link to="/workJihua">拜访计划</Link></li>
                                <li className={"panel-child"+(this.hasArray(79)?" none":"")}><Link to="/visitPlan">工作计划审核</Link></li>
                                <li className={"panel-child"+(this.hasArray(78)?" none":"")}><Link to="/assessment">考核查询</Link></li>
                               {/* <li className={"panel-child"+(this.hasArray(81)?" none":"")}><Link to="/visitStatistics">门店拜访统计</Link></li>
                                <li className={"panel-child"+(this.hasArray(92)?" none":"")}><Link to="/representativeQuery">代表拜访查询</Link></li>*/}
                            </ul>

							<div className="panel-list">
								<a onClick={this.collapse} className="collBtn">
									<span className="car-icon-xitong" data-yclass="y5"></span>系统管理<span className="glyphicon glyphicon-menu-right fr"></span>
								</a>
							</div>
							<ul className="panel-collapse h0">
								<li className={"panel-child"+(this.hasArray(82)?" none":"")}><Link to="/userMan">用户管理</Link></li>
								<li className={"panel-child"+(this.hasArray(83)?" none":"")}><Link to="/roleMan">角色管理</Link></li>
                                <li className={"panel-child"+(this.hasArray(84)?" none":"")}><Link to="/userGroup">用户组管理</Link></li>
								{/*<li className="panel-child"><Link to="/systemLog">系统日志</Link></li>*/}
								<li className="panel-child"><Link to="/persInfo">个人信息</Link></li>
								<li className="panel-child"><Link to="/modifyPassword">密码修改</Link></li>
							</ul>
						</div>
					</nav>
				</header>
				<div className="car-content" id="middle-content">
                    <div ref="indent" className="indent" onClick={this.indent}>
                        {IconIndent}
                    </div>
                    {this.props.children}
                </div>
				<Modal prompttext={this.state.prompt}/>
			</div>
		);
	}
});

export {Sider}
