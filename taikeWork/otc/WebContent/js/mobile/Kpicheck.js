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
/***/ function(module, exports) {

	"use strict";

	var url = "/otcdyanmic/goods.do";
	var currturl = window.location.href; //获取当前url


	var Kpicheck = React.createClass({
	    displayName: "Kpicheck",

	    getInitialState: function getInitialState() {
	        return {
	            Y_login: true, //是否登录
	            referrer: topreurl("index.html"), //上一页
	            Totalscore: "90" //总得分呢
	        };
	    },
	    componentDidMount: function componentDidMount() {

	        // var failetext="手机端暂时未开放考核数据"
	        // $(".KpicheckCont").html(Datafaile(failetext,this.state.referrer));
	        /*
	        var totalscore=$('.totalscore').html();
	        var totalscoreR=$('.totalscoreR').html();
	        
	        $('#myStat4').circliful();
	        $('#myStat1').circliful();
	        
	           
	        $(window).resize(function () {
	              $('.totalscore').html(totalscore);
	            $('.totalscoreR').html(totalscoreR);
	            $('#myStat4').circliful();
	            $('#myStat1').circliful();
	        });
	        */
	    },
	    toreferrer: function toreferrer() {
	        setTimeout(function () {
	            var searchinfo = {
	                'Kpishowtype': "Kpiinquire"
	            };

	            PubSub.publish('changtype', searchinfo);
	            sessionStorage.setItem("Kpishowtype", "Kpiinquire");
	        }, 320);
	    },
	    render: function render() {
	        var htmlval = "<div class='talscoretext'><h2>总得分</h2><font>" + this.state.Totalscore + "</font><em>分</em></div>";
	        var htmlval1 = "<div class='talscoretext1'><font>75</font><em>分</em></div>";
	        return React.createElement(
	            "div",
	            null,
	            React.createElement(
	                "div",
	                { className: "profile white", id: "pagenav" },
	                React.createElement(
	                    "span",
	                    { className: "toleft", onTouchEnd: this.toreferrer },
	                    " ",
	                    React.createElement("a", { href: "javascript:void(0)" })
	                ),
	                "KPI\u8003\u6838"
	            ),
	            React.createElement(
	                "div",
	                { className: "nonetwork" },
	                React.createElement(
	                    "div",
	                    { className: "nonetworkwarp" },
	                    React.createElement("img", { src: "../images/mobile/Datafailed.png" }),
	                    React.createElement(
	                        "p",
	                        null,
	                        " \u624B\u673A\u7AEF\u6682\u65F6\u672A\u5F00\u653E\u8003\u6838\u6570\u636E"
	                    ),
	                    React.createElement(
	                        "button",
	                        { className: "nonetwork_btn", onTouchEnd: this.toreferrer },
	                        "\u7ACB\u5373\u8FD4\u56DE"
	                    )
	                )
	            )
	        );
	    }
	});
	module.exports = Kpicheck;

/***/ }
/******/ ]);