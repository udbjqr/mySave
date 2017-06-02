"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
//import React from  'build/react'
//import PubSub from 'build/PubSub'

exports.default = React.createClass({
	displayName: "userlogin",

	getInitialState: function getInitialState() {
		return {
			loginY: false, //是否登录
			message: "0.0", //错误信息
			username: "", //登录名字
			money: 0.0, //余额
			error_Code: "0", //错误代码 
			loding: true
		};
	},

	componentDidMount: function componentDidMount() {},

	render: function render() {

		return React.createElement(
			"div",
			null,
			"调用的组件 sssssssssss"
		);
	}

});