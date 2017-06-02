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

	'use strict';

	var Userfooter = React.createClass({
	    displayName: 'Userfooter',


	    getInitialState: function getInitialState() {
	        return {
	            custom_id: geturl('custom_id'), //custom_id
	            plan_id: geturl('plan_id') };
	    },
	    componentDidMount: function componentDidMount() {},

	    render: function render() {
	        var visitsNumber = this.state.visitsNumber == 0 ? "" : "<em>" + this.state.visitsNumber + "</em>";
	        return React.createElement(
	            'footer',
	            { className: 'white index-nav' },
	            React.createElement(
	                'ul',
	                { className: 'wd-nav' },
	                React.createElement(
	                    'li',
	                    { className: 'client for_gaq' },
	                    React.createElement(
	                        'a',
	                        { href: "signin.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id },
	                        React.createElement('p', { className: 'footer-action-icon icon-dynamic4' }),
	                        React.createElement(
	                            'h2',
	                            null,
	                            '签到',
	                            this.props.name
	                        )
	                    )
	                ),
	                React.createElement(
	                    'li',
	                    { className: 'product for_gaq' },
	                    React.createElement(
	                        'a',
	                        { href: "testproducts.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id },
	                        React.createElement('p', { className: 'footer-action-icon icon-dynamic5' }),
	                        React.createElement(
	                            'h2',
	                            null,
	                            '考核盘点'
	                        )
	                    )
	                ),
	                React.createElement(
	                    'li',
	                    { className: 'myprofild for_gaq' },
	                    React.createElement(
	                        'a',
	                        { href: "historyrecord.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id },
	                        React.createElement('p', { className: 'footer-action-icon icon-dynamic6' }),
	                        React.createElement(
	                            'h2',
	                            null,
	                            '来访纪录'
	                        ),
	                        visitsNumber
	                    )
	                )
	            )
	        );
	    }
	});

	module.exports = Userfooter;

/***/ }
/******/ ]);