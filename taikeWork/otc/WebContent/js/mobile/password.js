/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	//import React from 'react'
	//import {render} from 'react-dom'

	var url = "../otcdyanmic/userLogin.do";
	var Password = React.createClass({
	  displayName: "Password",

	  getInitialState: function getInitialState() {
	    return {
	      Y_login: true, //是否登录
	      referrer: topreurl("index.html") //上一页
	    };
	  },
	  componentDidMount: function componentDidMount() {},
	  loaginajax: function loaginajax(newpwd) {
	    var object = new Object();
	    object.wxId = OpenID;
	    object.newpwd = newpwd;
	    $.ajax({
	      url: url,
	      data: { paramMap: JSON.stringify(object) },
	      type: "post",
	      dataType: "json",
	      success: function success(data) {

	        if (data != "" && data != null && data != undefined) {

	          //修改密码成功
	          if (data.success == true) {
	            layer.open({
	              shade: false,
	              content: '修改密码成功，请重新登录',
	              skin: 'msg',
	              className: 'tip',
	              time: 2 //2秒后自动关闭
	            });
	            setTimeout(function () {
	              window.location.href = "login.html";
	            }, 2000);
	          }

	          //修改密码失败
	          if (data.success == false) {
	            //未登录
	            if (data.errorCode == "1") {
	              var dodatate = generateMixed(6);
	              window.location.href = wxurl(dodatate);
	            }
	            //未登录结束
	            layer.open({
	              shade: false,
	              content: "修改密码失败,请重新修改",
	              skin: 'msg',
	              className: 'tip',
	              time: 2 //2秒后自动关闭
	            });
	          }
	          //修改密码失败End
	        }
	      },
	      error: function error(data) {
	        layer.open({
	          shade: false,
	          content: '网络错误,请重新修改 ',
	          skin: 'msg',
	          className: 'tip',
	          time: 2 //2秒后自动关闭
	        });
	      }
	    });
	  },

	  check: function check() {
	    var oldpwd = this.refs.oldpwd.value;
	    var newpwd = this.refs.newpwd.value;
	    var confirmpwd = this.refs.confirmpwd.value;

	    if (oldpwd == "" && oldpwd.length <= 0) {
	      layer.open({
	        shade: false,
	        content: '请输入原密码',
	        skin: 'msg',
	        className: 'tip',
	        time: 2 //2秒后自动关闭
	      });
	      return false;
	    }
	    if (newpwd == "" && newpwd.length <= 0) {
	      layer.open({
	        shade: false,
	        content: '请输入新密码',
	        skin: 'msg',
	        className: 'tip',
	        time: 2 //2秒后自动关闭
	      });
	      return false;
	    }
	    if (newpwd.length <= 6) {
	      layer.open({
	        shade: false,
	        content: '密码必须大于6位',
	        skin: 'msg',
	        className: 'tip',
	        time: 2 //2秒后自动关闭
	      });
	      return false;
	    }
	    if (confirmpwd == "" && confirmpwd.length <= 0) {
	      layer.open({
	        shade: false,
	        content: '请输入确认密码',
	        skin: 'msg',
	        className: 'tip',
	        time: 2 //2秒后自动关闭
	      });

	      return false;
	    }
	    if (confirmpwd != newpwd) {
	      layer.open({
	        shade: false,
	        content: '确认密码与新密码不一致',
	        skin: 'msg',
	        className: 'tip',
	        time: 2 //2秒后自动关闭
	      });
	      return false;
	    } else {
	      this.loaginajax(newpwd);
	    }
	  },

	  render: function render() {
	    return React.createElement(
	      "div",
	      null,
	      React.createElement(
	        "div",
	        { className: "profile white", id: "pagenav" },
	        React.createElement(
	          "span",
	          { className: "toleft" },
	          " ",
	          React.createElement("a", { href: this.state.referrer })
	        ),
	        "修改密码"
	      ),
	      React.createElement(
	        "div",
	        { className: "ui-adduser-main profile marginb_2r" },
	        React.createElement(
	          "dl",
	          { className: "white" },
	          React.createElement(
	            "dt",
	            { className: "pwdlab" },
	            "原密码:"
	          ),
	          React.createElement(
	            "dd",
	            null,
	            React.createElement("input", { type: "password", className: "input", ref: "oldpwd", id: "oldpwd", name: "oldpwd", placeholder: "请输入原密码" })
	          )
	        ),
	        React.createElement(
	          "dl",
	          { className: "white" },
	          React.createElement(
	            "dt",
	            { className: "pwdlab" },
	            "新密码:"
	          ),
	          React.createElement(
	            "dd",
	            null,
	            React.createElement("input", { type: "password", className: "input", ref: "newpwd", id: "newpwd", name: "newpwd", placeholder: "请输入新密码" })
	          )
	        ),
	        React.createElement(
	          "dl",
	          { className: "white" },
	          React.createElement(
	            "dt",
	            { className: "pwdlab" },
	            "确认密码:"
	          ),
	          React.createElement(
	            "dd",
	            null,
	            React.createElement("input", { type: "password", className: "input", ref: "confirmpwd", id: "confirmpwd", name: "confirmpwd", placeholder: "再次输入密码" })
	          )
	        )
	      ),
	      React.createElement(
	        "button",
	        { className: "fn-btn", id: "adduserBtn", onTouchStart: this.check },
	        "确认"
	      )
	    );
	  }
	});

	ReactDOM.render(React.createElement(Password, null), document.getElementById('conter'));

/***/ }
/******/ ]);