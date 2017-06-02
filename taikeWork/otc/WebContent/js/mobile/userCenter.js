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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _islogin = __webpack_require__(4);

	var _islogin2 = _interopRequireDefault(_islogin);

	var _zepto = __webpack_require__(5);

	var _zepto2 = _interopRequireDefault(_zepto);

	var _fontsize = __webpack_require__(6);

	var _fontsize2 = _interopRequireDefault(_fontsize);

	var _layer = __webpack_require__(7);

	var _layer2 = _interopRequireDefault(_layer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var OpenID = "ojpX_jig-gyi3_Q9fHXQ4rdHniQs";
	var Usercenter = _react2.default.createClass({
	  displayName: 'Usercenter',

	  render: function render() {
	    return _react2.default.createElement(
	      'div',
	      null,
	      _react2.default.createElement(Usercenterlist, null)
	    );
	  }
	});

	var Usercenterlist = _react2.default.createClass({
	  displayName: 'Usercenterlist',

	  getInitialState: function getInitialState() {
	    return {
	      is_login: false,
	      Y_lose: true, //是否过期
	      y_phone: false, //是否接到电话
	      tmessage: "0"
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this.pubsub_token = PubSub.subscribe('changUser', function (topic, newItem) {
	      this.setState({
	        is_login: newItem.loginY,
	        tmessage: newItem.message
	      });
	    }.bind(this));
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    PubSub.unsubscribe(this.pubsub_token);
	  },
	  render: function render() {

	    return _react2.default.createElement(
	      'div',
	      { className: 'userprofile' },
	      _react2.default.createElement(
	        'div',
	        { className: 'user_header' },
	        _react2.default.createElement(
	          'div',
	          { className: 'user_headimg' },
	          _react2.default.createElement('img', { src: "../../images/mobile/17.png" })
	        ),
	        _react2.default.createElement(
	          'div',
	          { className: 'user_headinfo' },
	          _react2.default.createElement(
	            'h2',
	            null,
	            '刘鹏'
	          ),
	          _react2.default.createElement(
	            'p',
	            null,
	            'OTC事业部'
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'profile marginb_1r' },
	        _react2.default.createElement(
	          'dl',
	          { className: 'white toico' },
	          _react2.default.createElement(
	            'a',
	            { href: "login.html", className: 'profile_pading' },
	            _react2.default.createElement(
	              'dt',
	              null,
	              _react2.default.createElement('img', { src: "../../images/mobile/userico1.png" }),
	              'KPI考核'
	            )
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'profile marginb_1r' },
	        _react2.default.createElement(
	          'dl',
	          { className: 'white toico' },
	          _react2.default.createElement(
	            'a',
	            { href: "Videoshare.html", className: 'profile_pading' },
	            _react2.default.createElement(
	              'dt',
	              null,
	              _react2.default.createElement('img', { src: "../../images/mobile/userico2.png" }),
	              '视频共享'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'dl',
	          { className: 'white toico' },
	          _react2.default.createElement(
	            'a',
	            { href: "Photoshare.html", className: 'profile_pading' },
	            _react2.default.createElement(
	              'dt',
	              null,
	              _react2.default.createElement('img', { src: "../../images/mobile/userico3.png" }),
	              '共享图片'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'dl',
	          { className: 'white toico' },
	          _react2.default.createElement(
	            'a',
	            { href: "informationfile.html", className: 'profile_pading' },
	            _react2.default.createElement(
	              'dt',
	              null,
	              _react2.default.createElement('img', { src: "../../images/mobile/userico4.png" }),
	              '资料文件'
	            )
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'profile marginb_1r' },
	        _react2.default.createElement(
	          'dl',
	          { className: 'white toico' },
	          _react2.default.createElement(
	            'a',
	            { href: "myinformation.html", className: 'profile_pading' },
	            _react2.default.createElement(
	              'dt',
	              null,
	              _react2.default.createElement('img', { src: "../../images/mobile/userico5.png" }),
	              '个人资料'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'dl',
	          { className: 'white toico' },
	          _react2.default.createElement(
	            'a',
	            { href: "password.html", className: 'profile_pading' },
	            _react2.default.createElement(
	              'dt',
	              { className: 'listico6' },
	              _react2.default.createElement('img', { src: "../../images/mobile/userico6.png" }),
	              '修改密码'
	            )
	          )
	        )
	      ),
	      _react2.default.createElement(Userfooter, null)
	    );
	  }
	});

	var Userfooter = _react2.default.createClass({
	  displayName: 'Userfooter',


	  render: function render() {

	    return _react2.default.createElement(
	      'footer',
	      { className: 'white index-nav' },
	      _react2.default.createElement(
	        'ul',
	        { className: 'wd-nav' },
	        _react2.default.createElement(
	          'li',
	          { className: 'client for_gaq' },
	          _react2.default.createElement(
	            'a',
	            { href: "CustomerDetails.html" },
	            _react2.default.createElement('p', { className: 'footer-action-icon icon-dynamic1' }),
	            _react2.default.createElement(
	              'h2',
	              null,
	              '客户'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'li',
	          { className: 'product for_gaq' },
	          _react2.default.createElement(
	            'a',
	            { href: "product.html" },
	            _react2.default.createElement('p', { className: 'footer-action-icon icon-dynamic2' }),
	            _react2.default.createElement(
	              'h2',
	              null,
	              '产品'
	            )
	          )
	        ),
	        _react2.default.createElement(
	          'li',
	          { className: 'myprofild for_gaq' },
	          _react2.default.createElement(
	            'a',
	            { href: "userCenter.html" },
	            _react2.default.createElement('p', { className: 'footer-action-icon icon-dynamic3' }),
	            _react2.default.createElement(
	              'h2',
	              null,
	              '我的'
	            )
	          )
	        )
	      )
	    );
	  }
	});

	ReactDOM.render(_react2.default.createElement(Usercenter, null), document.getElementById('conter'));

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	var Userlist = React.createClass({
		displayName: "Userlist",

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

		componentDidMount: function componentDidMount() {
			var OpenID = "ojpX_jig-gyi3_Q9fHXQ4rdHniQs";
			var userinfo = "../otcdyanmic/userLogin.do";
			$.ajax({
				url: userinfo,
				data: { "wxId": OpenID },
				type: "post",
				dataType: "json",
				success: function (data) {
					if (this.isMounted()) {
						if (data != "" && data != null && data != undefined) {
							//用户登录成功
							if (data.success == true) {
								//设置属性
								this.setState({
									loginY: true, //是否登录
									message: "登录成功", //登录提示信息
									username: data.map.name, //登录名字
									Money: data.map.money, //余额
									error_Code: "0", //错误代码
									loding: false
								});
								userinfo = { "loginY": this.state.loginY, "message": this.state.message, "username": this.state.username, "Money": this.state.Money, "seterror_Code": this.state.seterror_Code };
								PubSub.publish('changUser', userinfo);
							}
							//用户登录失败
							if (data.success == false) {
								//设置属性

								//设置属性
								this.setState({
									loginY: false, //是否登录
									message: "登录失败;" + data.msg, //登录提示信息
									username: "", //登录名字
									Money: 0.0, //余额
									error_Code: data.errorCode, //错误代码 
									loding: false
								});
								userinfo = { "loginY": this.state.loginY, "message": this.state.message, "username": this.state.username, "Money": this.state.Money, "seterror_Code": this.state.seterror_Code };
								PubSub.publish('changUser', userinfo);
							}
						}
					} // this.isMounted() End
				}.bind(this),
				error: function () {

					if (this.isMounted()) {
						//设置属性
						this.setState({
							loginY: false, //是否登录
							message: "网络错误", //登录提示信息
							username: "", //登录名字
							Money: 0.0, //余额
							error_Code: "0", //错误代码 
							loding: false
						});
						userinfo = { "loginY": this.state.loginY, "message": this.state.message, "username": this.state.username, "Money": this.state.Money, "seterror_Code": this.state.seterror_Code };
						PubSub.publish('changUser', userinfo);
					}
				}.bind(this)
			});
		},

		render: function render() {}

	});

	module.exports = Userlist;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/* Zepto v1.0-1-ga3cab6c - polyfill zepto detect event ajax form fx - zeptojs.com/license */

	;
	(function (undefined) {
	    if (String.prototype.trim === undefined) // fix for iOS 3.2
	        String.prototype.trim = function () {
	            return this.replace(/^\s+|\s+$/g, '');
	        };

	    // For iOS 3.x
	    // from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
	    if (Array.prototype.reduce === undefined) Array.prototype.reduce = function (fun) {
	        if (this === void 0 || this === null) throw new TypeError();
	        var t = Object(this),
	            len = t.length >>> 0,
	            k = 0,
	            accumulator;
	        if (typeof fun != 'function') throw new TypeError();
	        if (len == 0 && arguments.length == 1) throw new TypeError();

	        if (arguments.length >= 2) accumulator = arguments[1];else do {
	            if (k in t) {
	                accumulator = t[k++];
	                break;
	            }
	            if (++k >= len) throw new TypeError();
	        } while (true);

	        while (k < len) {
	            if (k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t);
	            k++;
	        }
	        return accumulator;
	    };
	})();

	var Zepto = function () {
	    var undefined,
	        key,
	        $,
	        classList,
	        emptyArray = [],
	        _slice = emptyArray.slice,
	        _filter = emptyArray.filter,
	        document = window.document,
	        elementDisplay = {},
	        classCache = {},
	        getComputedStyle = document.defaultView.getComputedStyle,
	        cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1, 'opacity': 1, 'z-index': 1, 'zoom': 1 },
	        fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	        tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	        rootNodeRE = /^(?:body|html)$/i,


	    // special attributes that should be get/set via method calls
	    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],
	        adjacencyOperators = ['after', 'prepend', 'before', 'append'],
	        table = document.createElement('table'),
	        tableRow = document.createElement('tr'),
	        containers = {
	        'tr': document.createElement('tbody'),
	        'tbody': table, 'thead': table, 'tfoot': table,
	        'td': tableRow, 'th': tableRow,
	        '*': document.createElement('div')
	    },
	        readyRE = /complete|loaded|interactive/,
	        classSelectorRE = /^\.([\w-]+)$/,
	        idSelectorRE = /^#([\w-]*)$/,
	        tagSelectorRE = /^[\w-]+$/,
	        class2type = {},
	        toString = class2type.toString,
	        zepto = {},
	        camelize,
	        uniq,
	        tempParent = document.createElement('div');

	    zepto.matches = function (element, selector) {
	        if (!element || element.nodeType !== 1) return false;
	        var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
	        if (matchesSelector) return matchesSelector.call(element, selector);
	        // fall back to performing a selector:
	        var match,
	            parent = element.parentNode,
	            temp = !parent;
	        if (temp) (parent = tempParent).appendChild(element);
	        match = ~zepto.qsa(parent, selector).indexOf(element);
	        temp && tempParent.removeChild(element);
	        return match;
	    };

	    function type(obj) {
	        return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
	    }

	    function isFunction(value) {
	        return type(value) == "function";
	    }

	    function isWindow(obj) {
	        return obj != null && obj == obj.window;
	    }

	    function isDocument(obj) {
	        return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
	    }

	    function isObject(obj) {
	        return type(obj) == "object";
	    }

	    function isPlainObject(obj) {
	        return isObject(obj) && !isWindow(obj) && obj.__proto__ == Object.prototype;
	    }

	    function isArray(value) {
	        return value instanceof Array;
	    }

	    function likeArray(obj) {
	        return typeof obj.length == 'number';
	    }

	    function compact(array) {
	        return _filter.call(array, function (item) {
	            return item != null;
	        });
	    }

	    function flatten(array) {
	        return array.length > 0 ? $.fn.concat.apply([], array) : array;
	    }

	    camelize = function camelize(str) {
	        return str.replace(/-+(.)?/g, function (match, chr) {
	            return chr ? chr.toUpperCase() : '';
	        });
	    };
	    function dasherize(str) {
	        return str.replace(/::/g, '/').replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2').replace(/([a-z\d])([A-Z])/g, '$1_$2').replace(/_/g, '-').toLowerCase();
	    }

	    uniq = function uniq(array) {
	        return _filter.call(array, function (item, idx) {
	            return array.indexOf(item) == idx;
	        });
	    };

	    function classRE(name) {
	        return name in classCache ? classCache[name] : classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)');
	    }

	    function maybeAddPx(name, value) {
	        return typeof value == "number" && !cssNumber[dasherize(name)] ? value + "px" : value;
	    }

	    function defaultDisplay(nodeName) {
	        var element, display;
	        if (!elementDisplay[nodeName]) {
	            element = document.createElement(nodeName);
	            document.body.appendChild(element);
	            display = getComputedStyle(element, '').getPropertyValue("display");
	            element.parentNode.removeChild(element);
	            display == "none" && (display = "block");
	            elementDisplay[nodeName] = display;
	        }
	        return elementDisplay[nodeName];
	    }

	    function _children(element) {
	        return 'children' in element ? _slice.call(element.children) : $.map(element.childNodes, function (node) {
	            if (node.nodeType == 1) return node;
	        });
	    }

	    // `$.zepto.fragment` takes a html string and an optional tag name
	    // to generate DOM nodes nodes from the given html string.
	    // The generated DOM nodes are returned as an array.
	    // This function can be overriden in plugins for example to make
	    // it compatible with browsers that don't support the DOM fully.
	    zepto.fragment = function (html, name, properties) {
	        if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
	        if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
	        if (!(name in containers)) name = '*';

	        var nodes,
	            dom,
	            container = containers[name];
	        container.innerHTML = '' + html;
	        dom = $.each(_slice.call(container.childNodes), function () {
	            container.removeChild(this);
	        });
	        if (isPlainObject(properties)) {
	            nodes = $(dom);
	            $.each(properties, function (key, value) {
	                if (methodAttributes.indexOf(key) > -1) nodes[key](value);else nodes.attr(key, value);
	            });
	        }
	        return dom;
	    };

	    // `$.zepto.Z` swaps out the prototype of the given `dom` array
	    // of nodes with `$.fn` and thus supplying all the Zepto functions
	    // to the array. Note that `__proto__` is not supported on Internet
	    // Explorer. This method can be overriden in plugins.
	    zepto.Z = function (dom, selector) {
	        dom = dom || [];
	        dom.__proto__ = $.fn;
	        dom.selector = selector || '';
	        return dom;
	    };

	    // `$.zepto.isZ` should return `true` if the given object is a Zepto
	    // collection. This method can be overriden in plugins.
	    zepto.isZ = function (object) {
	        return object instanceof zepto.Z;
	    };

	    // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
	    // takes a CSS selector and an optional context (and handles various
	    // special cases).
	    // This method can be overriden in plugins.
	    zepto.init = function (selector, context) {
	        // If nothing given, return an empty Zepto collection
	        if (!selector) return zepto.Z();
	        // If a function is given, call it when the DOM is ready
	        else if (isFunction(selector)) return $(document).ready(selector);
	            // If a Zepto collection is given, juts return it
	            else if (zepto.isZ(selector)) return selector;else {
	                    var dom;
	                    // normalize array if an array of nodes is given
	                    if (isArray(selector)) dom = compact(selector);
	                    // Wrap DOM nodes. If a plain object is given, duplicate it.
	                    else if (isObject(selector)) dom = [isPlainObject(selector) ? $.extend({}, selector) : selector], selector = null;
	                        // If it's a html fragment, create nodes from it
	                        else if (fragmentRE.test(selector)) dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
	                            // If there's a context, create a collection on that context first, and select
	                            // nodes from there
	                            else if (context !== undefined) return $(context).find(selector);
	                                // And last but no least, if it's a CSS selector, use it to select nodes.
	                                else dom = zepto.qsa(document, selector);
	                    // create a new Zepto collection from the nodes found
	                    return zepto.Z(dom, selector);
	                }
	    };

	    // `$` will be the base `Zepto` object. When calling this
	    // function just call `$.zepto.init, which makes the implementation
	    // details of selecting nodes and creating Zepto collections
	    // patchable in plugins.
	    $ = function $(selector, context) {
	        return zepto.init(selector, context);
	    };

	    function extend(target, source, deep) {
	        for (key in source) {
	            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
	                if (isPlainObject(source[key]) && !isPlainObject(target[key])) target[key] = {};
	                if (isArray(source[key]) && !isArray(target[key])) target[key] = [];
	                extend(target[key], source[key], deep);
	            } else if (source[key] !== undefined) target[key] = source[key];
	        }
	    }

	    // Copy all but undefined properties from one or more
	    // objects to the `target` object.
	    $.extend = function (target) {
	        var deep,
	            args = _slice.call(arguments, 1);
	        if (typeof target == 'boolean') {
	            deep = target;
	            target = args.shift();
	        }
	        args.forEach(function (arg) {
	            extend(target, arg, deep);
	        });
	        return target;
	    };

	    // `$.zepto.qsa` is Zepto's CSS selector implementation which
	    // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
	    // This method can be overriden in plugins.
	    zepto.qsa = function (element, selector) {
	        var found;
	        return isDocument(element) && idSelectorRE.test(selector) ? (found = element.getElementById(RegExp.$1)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 ? [] : _slice.call(classSelectorRE.test(selector) ? element.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? element.getElementsByTagName(selector) : element.querySelectorAll(selector));
	    };

	    function filtered(nodes, selector) {
	        return selector === undefined ? $(nodes) : $(nodes).filter(selector);
	    }

	    $.contains = function (parent, node) {
	        return parent !== node && parent.contains(node);
	    };

	    function funcArg(context, arg, idx, payload) {
	        return isFunction(arg) ? arg.call(context, idx, payload) : arg;
	    }

	    function setAttribute(node, name, value) {
	        value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
	    }

	    // access className property while respecting SVGAnimatedString
	    function className(node, value) {
	        var klass = node.className,
	            svg = klass && klass.baseVal !== undefined;

	        if (value === undefined) return svg ? klass.baseVal : klass;
	        svg ? klass.baseVal = value : node.className = value;
	    }

	    // "true"  => true
	    // "false" => false
	    // "null"  => null
	    // "42"    => 42
	    // "42.5"  => 42.5
	    // JSON    => parse if valid
	    // String  => self
	    function deserializeValue(value) {
	        var num;
	        try {
	            return value ? value == "true" || (value == "false" ? false : value == "null" ? null : !isNaN(num = Number(value)) ? num : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
	        } catch (e) {
	            return value;
	        }
	    }

	    $.type = type;
	    $.isFunction = isFunction;
	    $.isWindow = isWindow;
	    $.isArray = isArray;
	    $.isPlainObject = isPlainObject;

	    $.isEmptyObject = function (obj) {
	        var name;
	        for (name in obj) {
	            return false;
	        }return true;
	    };

	    $.inArray = function (elem, array, i) {
	        return emptyArray.indexOf.call(array, elem, i);
	    };

	    $.camelCase = camelize;
	    $.trim = function (str) {
	        return str.trim();
	    };

	    // plugin compatibility
	    $.uuid = 0;
	    $.support = {};
	    $.expr = {};

	    $.map = function (elements, callback) {
	        var value,
	            values = [],
	            i,
	            key;
	        if (likeArray(elements)) for (i = 0; i < elements.length; i++) {
	            value = callback(elements[i], i);
	            if (value != null) values.push(value);
	        } else for (key in elements) {
	            value = callback(elements[key], key);
	            if (value != null) values.push(value);
	        }
	        return flatten(values);
	    };

	    $.each = function (elements, callback) {
	        var i, key;
	        if (likeArray(elements)) {
	            for (i = 0; i < elements.length; i++) {
	                if (callback.call(elements[i], i, elements[i]) === false) return elements;
	            }
	        } else {
	            for (key in elements) {
	                if (callback.call(elements[key], key, elements[key]) === false) return elements;
	            }
	        }

	        return elements;
	    };

	    $.grep = function (elements, callback) {
	        return _filter.call(elements, callback);
	    };

	    if (window.JSON) $.parseJSON = JSON.parse;

	    // Populate the class2type map
	    $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (i, name) {
	        class2type["[object " + name + "]"] = name.toLowerCase();
	    });

	    // Define methods that will be available on all
	    // Zepto collections
	    $.fn = {
	        // Because a collection acts like an array
	        // copy over these useful array functions.
	        forEach: emptyArray.forEach,
	        reduce: emptyArray.reduce,
	        push: emptyArray.push,
	        sort: emptyArray.sort,
	        indexOf: emptyArray.indexOf,
	        concat: emptyArray.concat,

	        // `map` and `slice` in the jQuery API work differently
	        // from their array counterparts
	        map: function map(fn) {
	            return $($.map(this, function (el, i) {
	                return fn.call(el, i, el);
	            }));
	        },
	        slice: function slice() {
	            return $(_slice.apply(this, arguments));
	        },

	        ready: function ready(callback) {
	            if (readyRE.test(document.readyState)) callback($);else document.addEventListener('DOMContentLoaded', function () {
	                callback($);
	            }, false);
	            return this;
	        },
	        get: function get(idx) {
	            return idx === undefined ? _slice.call(this) : this[idx >= 0 ? idx : idx + this.length];
	        },
	        toArray: function toArray() {
	            return this.get();
	        },
	        size: function size() {
	            return this.length;
	        },
	        remove: function remove() {
	            return this.each(function () {
	                if (this.parentNode != null) this.parentNode.removeChild(this);
	            });
	        },
	        each: function each(callback) {
	            emptyArray.every.call(this, function (el, idx) {
	                return callback.call(el, idx, el) !== false;
	            });
	            return this;
	        },
	        filter: function filter(selector) {
	            if (isFunction(selector)) return this.not(this.not(selector));
	            return $(_filter.call(this, function (element) {
	                return zepto.matches(element, selector);
	            }));
	        },
	        add: function add(selector, context) {
	            return $(uniq(this.concat($(selector, context))));
	        },
	        is: function is(selector) {
	            return this.length > 0 && zepto.matches(this[0], selector);
	        },
	        not: function not(selector) {
	            var nodes = [];
	            if (isFunction(selector) && selector.call !== undefined) this.each(function (idx) {
	                if (!selector.call(this, idx)) nodes.push(this);
	            });else {
	                var excludes = typeof selector == 'string' ? this.filter(selector) : likeArray(selector) && isFunction(selector.item) ? _slice.call(selector) : $(selector);
	                this.forEach(function (el) {
	                    if (excludes.indexOf(el) < 0) nodes.push(el);
	                });
	            }
	            return $(nodes);
	        },
	        has: function has(selector) {
	            return this.filter(function () {
	                return isObject(selector) ? $.contains(this, selector) : $(this).find(selector).size();
	            });
	        },
	        eq: function eq(idx) {
	            return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
	        },
	        first: function first() {
	            var el = this[0];
	            return el && !isObject(el) ? el : $(el);
	        },
	        last: function last() {
	            var el = this[this.length - 1];
	            return el && !isObject(el) ? el : $(el);
	        },
	        find: function find(selector) {
	            var result,
	                $this = this;
	            if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) == 'object') result = $(selector).filter(function () {
	                var node = this;
	                return emptyArray.some.call($this, function (parent) {
	                    return $.contains(parent, node);
	                });
	            });else if (this.length == 1) result = $(zepto.qsa(this[0], selector));else result = this.map(function () {
	                return zepto.qsa(this, selector);
	            });
	            return result;
	        },
	        closest: function closest(selector, context) {
	            var node = this[0],
	                collection = false;
	            if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) == 'object') collection = $(selector);
	            while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector))) {
	                node = node !== context && !isDocument(node) && node.parentNode;
	            }return $(node);
	        },
	        parents: function parents(selector) {
	            var ancestors = [],
	                nodes = this;
	            while (nodes.length > 0) {
	                nodes = $.map(nodes, function (node) {
	                    if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
	                        ancestors.push(node);
	                        return node;
	                    }
	                });
	            }return filtered(ancestors, selector);
	        },
	        parent: function parent(selector) {
	            return filtered(uniq(this.pluck('parentNode')), selector);
	        },
	        children: function children(selector) {
	            return filtered(this.map(function () {
	                return _children(this);
	            }), selector);
	        },
	        contents: function contents() {
	            return this.map(function () {
	                return _slice.call(this.childNodes);
	            });
	        },
	        siblings: function siblings(selector) {
	            return filtered(this.map(function (i, el) {
	                return _filter.call(_children(el.parentNode), function (child) {
	                    return child !== el;
	                });
	            }), selector);
	        },
	        empty: function empty() {
	            return this.each(function () {
	                this.innerHTML = '';
	            });
	        },
	        // `pluck` is borrowed from Prototype.js
	        pluck: function pluck(property) {
	            return $.map(this, function (el) {
	                return el[property];
	            });
	        },
	        show: function show() {
	            return this.each(function () {
	                this.style.display == "none" && (this.style.display = null);
	                if (getComputedStyle(this, '').getPropertyValue("display") == "none") this.style.display = defaultDisplay(this.nodeName);
	            });
	        },
	        replaceWith: function replaceWith(newContent) {
	            return this.before(newContent).remove();
	        },
	        wrap: function wrap(structure) {
	            var func = isFunction(structure);
	            if (this[0] && !func) var dom = $(structure).get(0),
	                clone = dom.parentNode || this.length > 1;

	            return this.each(function (index) {
	                $(this).wrapAll(func ? structure.call(this, index) : clone ? dom.cloneNode(true) : dom);
	            });
	        },
	        wrapAll: function wrapAll(structure) {
	            if (this[0]) {
	                $(this[0]).before(structure = $(structure));
	                var children;
	                // drill down to the inmost element
	                while ((children = structure.children()).length) {
	                    structure = children.first();
	                }$(structure).append(this);
	            }
	            return this;
	        },
	        wrapInner: function wrapInner(structure) {
	            var func = isFunction(structure);
	            return this.each(function (index) {
	                var self = $(this),
	                    contents = self.contents(),
	                    dom = func ? structure.call(this, index) : structure;
	                contents.length ? contents.wrapAll(dom) : self.append(dom);
	            });
	        },
	        unwrap: function unwrap() {
	            this.parent().each(function () {
	                $(this).replaceWith($(this).children());
	            });
	            return this;
	        },
	        clone: function clone() {
	            return this.map(function () {
	                return this.cloneNode(true);
	            });
	        },
	        hide: function hide() {
	            return this.css("display", "none");
	        },
	        toggle: function toggle(setting) {
	            return this.each(function () {
	                var el = $(this);
	                (setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide();
	            });
	        },
	        prev: function prev(selector) {
	            return $(this.pluck('previousElementSibling')).filter(selector || '*');
	        },
	        next: function next(selector) {
	            return $(this.pluck('nextElementSibling')).filter(selector || '*');
	        },
	        html: function html(_html) {
	            return _html === undefined ? this.length > 0 ? this[0].innerHTML : null : this.each(function (idx) {
	                var originHtml = this.innerHTML;
	                $(this).empty().append(funcArg(this, _html, idx, originHtml));
	            });
	        },
	        text: function text(_text) {
	            return _text === undefined ? this.length > 0 ? this[0].textContent : null : this.each(function () {
	                this.textContent = _text;
	            });
	        },
	        attr: function attr(name, value) {
	            var result;
	            return typeof name == 'string' && value === undefined ? this.length == 0 || this[0].nodeType !== 1 ? undefined : name == 'value' && this[0].nodeName == 'INPUT' ? this.val() : !(result = this[0].getAttribute(name)) && name in this[0] ? this[0][name] : result : this.each(function (idx) {
	                if (this.nodeType !== 1) return;
	                if (isObject(name)) for (key in name) {
	                    setAttribute(this, key, name[key]);
	                } else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
	            });
	        },
	        removeAttr: function removeAttr(name) {
	            return this.each(function () {
	                this.nodeType === 1 && setAttribute(this, name);
	            });
	        },
	        prop: function prop(name, value) {
	            return value === undefined ? this[0] && this[0][name] : this.each(function (idx) {
	                this[name] = funcArg(this, value, idx, this[name]);
	            });
	        },
	        data: function data(name, value) {
	            var data = this.attr('data-' + dasherize(name), value);
	            return data !== null ? deserializeValue(data) : undefined;
	        },
	        val: function val(value) {
	            return value === undefined ? this[0] && (this[0].multiple ? $(this[0]).find('option').filter(function (o) {
	                return this.selected;
	            }).pluck('value') : this[0].value) : this.each(function (idx) {
	                this.value = funcArg(this, value, idx, this.value);
	            });
	        },
	        offset: function offset(coordinates) {
	            if (coordinates) return this.each(function (index) {
	                var $this = $(this),
	                    coords = funcArg(this, coordinates, index, $this.offset()),
	                    parentOffset = $this.offsetParent().offset(),
	                    props = {
	                    top: coords.top - parentOffset.top,
	                    left: coords.left - parentOffset.left
	                };

	                if ($this.css('position') == 'static') props['position'] = 'relative';
	                $this.css(props);
	            });
	            if (this.length == 0) return null;
	            var obj = this[0].getBoundingClientRect();
	            return {
	                left: obj.left + window.pageXOffset,
	                top: obj.top + window.pageYOffset,
	                width: Math.round(obj.width),
	                height: Math.round(obj.height)
	            };
	        },
	        css: function css(property, value) {
	            if (arguments.length < 2 && typeof property == 'string') return this[0] && (this[0].style[camelize(property)] || getComputedStyle(this[0], '').getPropertyValue(property));

	            var css = '';
	            if (type(property) == 'string') {
	                if (!value && value !== 0) this.each(function () {
	                    this.style.removeProperty(dasherize(property));
	                });else css = dasherize(property) + ":" + maybeAddPx(property, value);
	            } else {
	                for (key in property) {
	                    if (!property[key] && property[key] !== 0) this.each(function () {
	                        this.style.removeProperty(dasherize(key));
	                    });else css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';';
	                }
	            }

	            return this.each(function () {
	                this.style.cssText += ';' + css;
	            });
	        },
	        index: function index(element) {
	            return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0]);
	        },
	        hasClass: function hasClass(name) {
	            return emptyArray.some.call(this, function (el) {
	                return this.test(className(el));
	            }, classRE(name));
	        },
	        addClass: function addClass(name) {
	            return this.each(function (idx) {
	                classList = [];
	                var cls = className(this),
	                    newName = funcArg(this, name, idx, cls);
	                newName.split(/\s+/g).forEach(function (klass) {
	                    if (!$(this).hasClass(klass)) classList.push(klass);
	                }, this);
	                classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "));
	            });
	        },
	        removeClass: function removeClass(name) {
	            return this.each(function (idx) {
	                if (name === undefined) return className(this, '');
	                classList = className(this);
	                funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
	                    classList = classList.replace(classRE(klass), " ");
	                });
	                className(this, classList.trim());
	            });
	        },
	        toggleClass: function toggleClass(name, when) {
	            return this.each(function (idx) {
	                var $this = $(this),
	                    names = funcArg(this, name, idx, className(this));
	                names.split(/\s+/g).forEach(function (klass) {
	                    (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
	                });
	            });
	        },
	        scrollTop: function scrollTop() {
	            if (!this.length) return;
	            return 'scrollTop' in this[0] ? this[0].scrollTop : this[0].scrollY;
	        },
	        position: function position() {
	            if (!this.length) return;

	            var elem = this[0],

	            // Get *real* offsetParent
	            offsetParent = this.offsetParent(),

	            // Get correct offsets
	            offset = this.offset(),
	                parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

	            // Subtract element margins
	            // note: when an element has margin: auto the offsetLeft and marginLeft
	            // are the same in Safari causing offset.left to incorrectly be 0
	            offset.top -= parseFloat($(elem).css('margin-top')) || 0;
	            offset.left -= parseFloat($(elem).css('margin-left')) || 0;

	            // Add offsetParent borders
	            parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0;
	            parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0;

	            // Subtract the two offsets
	            return {
	                top: offset.top - parentOffset.top,
	                left: offset.left - parentOffset.left
	            };
	        },
	        offsetParent: function offsetParent() {
	            return this.map(function () {
	                var parent = this.offsetParent || document.body;
	                while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static") {
	                    parent = parent.offsetParent;
	                }return parent;
	            });
	        }
	    };

	    // for now
	    $.fn.detach = $.fn.remove

	    // Generate the `width` and `height` functions
	    ;
	    ['width', 'height'].forEach(function (dimension) {
	        $.fn[dimension] = function (value) {
	            var offset,
	                el = this[0],
	                Dimension = dimension.replace(/./, function (m) {
	                return m[0].toUpperCase();
	            });
	            if (value === undefined) return isWindow(el) ? el['inner' + Dimension] : isDocument(el) ? el.documentElement['offset' + Dimension] : (offset = this.offset()) && offset[dimension];else return this.each(function (idx) {
	                el = $(this);
	                el.css(dimension, funcArg(this, value, idx, el[dimension]()));
	            });
	        };
	    });

	    function traverseNode(node, fun) {
	        fun(node);
	        for (var key in node.childNodes) {
	            traverseNode(node.childNodes[key], fun);
	        }
	    }

	    // Generate the `after`, `prepend`, `before`, `append`,
	    // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	    adjacencyOperators.forEach(function (operator, operatorIndex) {
	        var inside = operatorIndex % 2; //=> prepend, append

	        $.fn[operator] = function () {
	            // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
	            var argType,
	                nodes = $.map(arguments, function (arg) {
	                argType = type(arg);
	                return argType == "object" || argType == "array" || arg == null ? arg : zepto.fragment(arg);
	            }),
	                parent,
	                copyByClone = this.length > 1;
	            if (nodes.length < 1) return this;

	            return this.each(function (_, target) {
	                parent = inside ? target : target.parentNode;

	                // convert all methods to a "before" operation
	                target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;

	                nodes.forEach(function (node) {
	                    if (copyByClone) node = node.cloneNode(true);else if (!parent) return $(node).remove();

	                    traverseNode(parent.insertBefore(node, target), function (el) {
	                        if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src) window['eval'].call(window, el.innerHTML);
	                    });
	                });
	            });
	        };

	        // after    => insertAfter
	        // prepend  => prependTo
	        // before   => insertBefore
	        // append   => appendTo
	        $.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
	            $(html)[operator](this);
	            return this;
	        };
	    });

	    zepto.Z.prototype = $.fn;

	    // Export internal API functions in the `$.zepto` namespace
	    zepto.uniq = uniq;
	    zepto.deserializeValue = deserializeValue;
	    $.zepto = zepto;

	    return $;
	}();

	window.Zepto = Zepto;
	'$' in window || (window.$ = Zepto);
	(function ($) {
	    function detect(ua) {
	        var os = this.os = {},
	            browser = this.browser = {},
	            webkit = ua.match(/WebKit\/([\d.]+)/),
	            android = ua.match(/(Android)\s+([\d.]+)/),
	            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
	            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
	            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
	            touchpad = webos && ua.match(/TouchPad/),
	            kindle = ua.match(/Kindle\/([\d.]+)/),
	            silk = ua.match(/Silk\/([\d._]+)/),
	            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
	            bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
	            rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
	            playbook = ua.match(/PlayBook/),
	            chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
	            firefox = ua.match(/Firefox\/([\d.]+)/);

	        // Todo: clean this up with a better OS/browser seperation:
	        // - discern (more) between multiple browsers on android
	        // - decide if kindle fire in silk mode is android or not
	        // - Firefox on Android doesn't specify the Android version
	        // - possibly devide in os, device and browser hashes

	        if (browser.webkit = !!webkit) browser.version = webkit[1];

	        if (android) os.android = true, os.version = android[2];
	        if (iphone) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
	        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
	        if (webos) os.webos = true, os.version = webos[2];
	        if (touchpad) os.touchpad = true;
	        if (blackberry) os.blackberry = true, os.version = blackberry[2];
	        if (bb10) os.bb10 = true, os.version = bb10[2];
	        if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
	        if (playbook) browser.playbook = true;
	        if (kindle) os.kindle = true, os.version = kindle[1];
	        if (silk) browser.silk = true, browser.version = silk[1];
	        if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
	        if (chrome) browser.chrome = true, browser.version = chrome[1];
	        if (firefox) browser.firefox = true, browser.version = firefox[1];

	        os.tablet = !!(ipad || playbook || android && !ua.match(/Mobile/) || firefox && ua.match(/Tablet/));
	        os.phone = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 || chrome && ua.match(/Android/) || chrome && ua.match(/CriOS\/([\d.]+)/) || firefox && ua.match(/Mobile/)));
	    }

	    detect.call($, navigator.userAgent);
	    // make available to unit tests
	    $.__detect = detect;
	})(Zepto);
	(function ($) {
	    var $$ = $.zepto.qsa,
	        handlers = {},
	        _zid = 1,
	        specialEvents = {},
	        hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' };

	    specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

	    function zid(element) {
	        return element._zid || (element._zid = _zid++);
	    }

	    function findHandlers(element, event, fn, selector) {
	        event = parse(event);
	        if (event.ns) var matcher = matcherFor(event.ns);
	        return (handlers[zid(element)] || []).filter(function (handler) {
	            return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || zid(handler.fn) === zid(fn)) && (!selector || handler.sel == selector);
	        });
	    }

	    function parse(event) {
	        var parts = ('' + event).split('.');
	        return { e: parts[0], ns: parts.slice(1).sort().join(' ') };
	    }

	    function matcherFor(ns) {
	        return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
	    }

	    function eachEvent(events, fn, iterator) {
	        if ($.type(events) != "string") $.each(events, iterator);else events.split(/\s/).forEach(function (type) {
	            iterator(type, fn);
	        });
	    }

	    function eventCapture(handler, captureSetting) {
	        return handler.del && (handler.e == 'focus' || handler.e == 'blur') || !!captureSetting;
	    }

	    function realEvent(type) {
	        return hover[type] || type;
	    }

	    function add(element, events, fn, selector, getDelegate, capture) {
	        var id = zid(element),
	            set = handlers[id] || (handlers[id] = []);
	        eachEvent(events, fn, function (event, fn) {
	            var handler = parse(event);
	            handler.fn = fn;
	            handler.sel = selector;
	            // emulate mouseenter, mouseleave
	            if (handler.e in hover) fn = function fn(e) {
	                var related = e.relatedTarget;
	                if (!related || related !== this && !$.contains(this, related)) return handler.fn.apply(this, arguments);
	            };
	            handler.del = getDelegate && getDelegate(fn, event);
	            var callback = handler.del || fn;
	            handler.proxy = function (e) {
	                var result = callback.apply(element, [e].concat(e.data));
	                if (result === false) e.preventDefault(), e.stopPropagation();
	                return result;
	            };
	            handler.i = set.length;
	            set.push(handler);
	            element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
	        });
	    }

	    function remove(element, events, fn, selector, capture) {
	        var id = zid(element);
	        eachEvent(events || '', fn, function (event, fn) {
	            findHandlers(element, event, fn, selector).forEach(function (handler) {
	                delete handlers[id][handler.i];
	                element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
	            });
	        });
	    }

	    $.event = { add: add, remove: remove };

	    $.proxy = function (fn, context) {
	        if ($.isFunction(fn)) {
	            var proxyFn = function proxyFn() {
	                return fn.apply(context, arguments);
	            };
	            proxyFn._zid = zid(fn);
	            return proxyFn;
	        } else if (typeof context == 'string') {
	            return $.proxy(fn[context], fn);
	        } else {
	            throw new TypeError("expected function");
	        }
	    };

	    $.fn.bind = function (event, callback) {
	        return this.each(function () {
	            add(this, event, callback);
	        });
	    };
	    $.fn.unbind = function (event, callback) {
	        return this.each(function () {
	            remove(this, event, callback);
	        });
	    };
	    $.fn.one = function (event, callback) {
	        return this.each(function (i, element) {
	            add(this, event, callback, null, function (fn, type) {
	                return function () {
	                    var result = fn.apply(element, arguments);
	                    remove(element, type, fn);
	                    return result;
	                };
	            });
	        });
	    };

	    var returnTrue = function returnTrue() {
	        return true;
	    },
	        returnFalse = function returnFalse() {
	        return false;
	    },
	        ignoreProperties = /^([A-Z]|layer[XY]$)/,
	        eventMethods = {
	        preventDefault: 'isDefaultPrevented',
	        stopImmediatePropagation: 'isImmediatePropagationStopped',
	        stopPropagation: 'isPropagationStopped'
	    };

	    function createProxy(event) {
	        var key,
	            proxy = { originalEvent: event };
	        for (key in event) {
	            if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key];
	        }$.each(eventMethods, function (name, predicate) {
	            proxy[name] = function () {
	                this[predicate] = returnTrue;
	                return event[name].apply(event, arguments);
	            };
	            proxy[predicate] = returnFalse;
	        });
	        return proxy;
	    }

	    // emulates the 'defaultPrevented' property for browsers that have none
	    function fix(event) {
	        if (!('defaultPrevented' in event)) {
	            event.defaultPrevented = false;
	            var prevent = event.preventDefault;
	            event.preventDefault = function () {
	                this.defaultPrevented = true;
	                prevent.call(this);
	            };
	        }
	    }

	    $.fn.delegate = function (selector, event, callback) {
	        return this.each(function (i, element) {
	            add(element, event, callback, selector, function (fn) {
	                return function (e) {
	                    var evt,
	                        match = $(e.target).closest(selector, element).get(0);
	                    if (match) {
	                        evt = $.extend(createProxy(e), { currentTarget: match, liveFired: element });
	                        return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
	                    }
	                };
	            });
	        });
	    };
	    $.fn.undelegate = function (selector, event, callback) {
	        return this.each(function () {
	            remove(this, event, callback, selector);
	        });
	    };

	    $.fn.live = function (event, callback) {
	        $(document.body).delegate(this.selector, event, callback);
	        return this;
	    };
	    $.fn.die = function (event, callback) {
	        $(document.body).undelegate(this.selector, event, callback);
	        return this;
	    };

	    $.fn.on = function (event, selector, callback) {
	        return !selector || $.isFunction(selector) ? this.bind(event, selector || callback) : this.delegate(selector, event, callback);
	    };
	    $.fn.off = function (event, selector, callback) {
	        return !selector || $.isFunction(selector) ? this.unbind(event, selector || callback) : this.undelegate(selector, event, callback);
	    };

	    $.fn.trigger = function (event, data) {
	        if (typeof event == 'string' || $.isPlainObject(event)) event = $.Event(event);
	        fix(event);
	        event.data = data;
	        return this.each(function () {
	            // items in the collection might not be DOM elements
	            // (todo: possibly support events on plain old objects)
	            if ('dispatchEvent' in this) this.dispatchEvent(event);
	        });
	    };

	    // triggers event handlers on current element just as if an event occurred,
	    // doesn't trigger an actual event, doesn't bubble
	    $.fn.triggerHandler = function (event, data) {
	        var e, result;
	        this.each(function (i, element) {
	            e = createProxy(typeof event == 'string' ? $.Event(event) : event);
	            e.data = data;
	            e.target = element;
	            $.each(findHandlers(element, event.type || event), function (i, handler) {
	                result = handler.proxy(e);
	                if (e.isImmediatePropagationStopped()) return false;
	            });
	        });
	        return result;
	    }

	    // shortcut methods for `.bind(event, fn)` for each event type
	    ;
	    ('focusin focusout load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select keydown keypress keyup error').split(' ').forEach(function (event) {
	        $.fn[event] = function (callback) {
	            return callback ? this.bind(event, callback) : this.trigger(event);
	        };
	    });
	    ['focus', 'blur'].forEach(function (name) {
	        $.fn[name] = function (callback) {
	            if (callback) this.bind(name, callback);else this.each(function () {
	                try {
	                    this[name]();
	                } catch (e) {}
	            });
	            return this;
	        };
	    });

	    $.Event = function (type, props) {
	        if (typeof type != 'string') props = type, type = props.type;
	        var event = document.createEvent(specialEvents[type] || 'Events'),
	            bubbles = true;
	        if (props) for (var name in props) {
	            name == 'bubbles' ? bubbles = !!props[name] : event[name] = props[name];
	        }event.initEvent(type, bubbles, true, null, null, null, null, null, null, null, null, null, null, null, null);
	        event.isDefaultPrevented = function () {
	            return this.defaultPrevented;
	        };
	        return event;
	    };
	})(Zepto);
	(function ($) {
	    var jsonpID = 0,
	        document = window.document,
	        key,
	        name,
	        rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	        scriptTypeRE = /^(?:text|application)\/javascript/i,
	        xmlTypeRE = /^(?:text|application)\/xml/i,
	        jsonType = 'application/json',
	        htmlType = 'text/html',
	        blankRE = /^\s*$/;

	    // trigger a custom event and return false if it was cancelled
	    function triggerAndReturn(context, eventName, data) {
	        var event = $.Event(eventName);
	        $(context).trigger(event, data);
	        return !event.defaultPrevented;
	    }

	    // trigger an Ajax "global" event
	    function triggerGlobal(settings, context, eventName, data) {
	        if (settings.global) return triggerAndReturn(context || document, eventName, data);
	    }

	    // Number of active Ajax requests
	    $.active = 0;

	    function ajaxStart(settings) {
	        if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart');
	    }

	    function ajaxStop(settings) {
	        if (settings.global && ! --$.active) triggerGlobal(settings, null, 'ajaxStop');
	    }

	    // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
	    function ajaxBeforeSend(xhr, settings) {
	        var context = settings.context;
	        if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false) return false;

	        triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
	    }

	    function ajaxSuccess(data, xhr, settings) {
	        var context = settings.context,
	            status = 'success';
	        settings.success.call(context, data, status, xhr);
	        triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);
	        ajaxComplete(status, xhr, settings);
	    }

	    // type: "timeout", "error", "abort", "parsererror"
	    function ajaxError(error, type, xhr, settings) {
	        var context = settings.context;
	        settings.error.call(context, xhr, type, error);
	        triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);
	        ajaxComplete(type, xhr, settings);
	    }

	    // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	    function ajaxComplete(status, xhr, settings) {
	        var context = settings.context;
	        settings.complete.call(context, xhr, status);
	        triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
	        ajaxStop(settings);
	    }

	    // Empty function, used as default callback
	    function empty() {}

	    $.ajaxJSONP = function (options) {
	        if (!('type' in options)) return $.ajax(options);

	        var callbackName = 'jsonp' + ++jsonpID,
	            script = document.createElement('script'),
	            cleanup = function cleanup() {
	            clearTimeout(abortTimeout);
	            $(script).remove();
	            delete window[callbackName];
	        },
	            abort = function abort(type) {
	            cleanup();
	            // In case of manual abort or timeout, keep an empty function as callback
	            // so that the SCRIPT tag that eventually loads won't result in an error.
	            if (!type || type == 'timeout') window[callbackName] = empty;
	            ajaxError(null, type || 'abort', xhr, options);
	        },
	            xhr = { abort: abort },
	            abortTimeout;

	        if (ajaxBeforeSend(xhr, options) === false) {
	            abort('abort');
	            return false;
	        }

	        window[callbackName] = function (data) {
	            cleanup();
	            ajaxSuccess(data, xhr, options);
	        };

	        script.onerror = function () {
	            abort('error');
	        };

	        script.src = options.url.replace(/=\?/, '=' + callbackName);
	        $('head').append(script);

	        if (options.timeout > 0) abortTimeout = setTimeout(function () {
	            abort('timeout');
	        }, options.timeout);

	        return xhr;
	    };

	    $.ajaxSettings = {
	        // Default type of request
	        type: 'GET',
	        // Callback that is executed before request
	        beforeSend: empty,
	        // Callback that is executed if the request succeeds
	        success: empty,
	        // Callback that is executed the the server drops error
	        error: empty,
	        // Callback that is executed on request complete (both: error and success)
	        complete: empty,
	        // The context for the callbacks
	        context: null,
	        // Whether to trigger "global" Ajax events
	        global: true,
	        // Transport
	        xhr: function xhr() {
	            return new window.XMLHttpRequest();
	        },
	        // MIME types mapping
	        accepts: {
	            script: 'text/javascript, application/javascript',
	            json: jsonType,
	            xml: 'application/xml, text/xml',
	            html: htmlType,
	            text: 'text/plain'
	        },
	        // Whether the request is to another domain
	        crossDomain: false,
	        // Default timeout
	        timeout: 0,
	        // Whether data should be serialized to string
	        processData: true,
	        // Whether the browser should be allowed to cache GET responses
	        cache: true
	    };

	    function mimeToDataType(mime) {
	        if (mime) mime = mime.split(';', 2)[0];
	        return mime && (mime == htmlType ? 'html' : mime == jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text';
	    }

	    function appendQuery(url, query) {
	        return (url + '&' + query).replace(/[&?]{1,2}/, '?');
	    }

	    // serialize payload and append it to the URL for GET requests
	    function serializeData(options) {
	        if (options.processData && options.data && $.type(options.data) != "string") options.data = $.param(options.data, options.traditional);
	        if (options.data && (!options.type || options.type.toUpperCase() == 'GET')) options.url = appendQuery(options.url, options.data);
	    }

	    $.ajax = function (options) {
	        var settings = $.extend({}, options || {});
	        for (key in $.ajaxSettings) {
	            if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
	        }ajaxStart(settings);

	        if (!settings.crossDomain) settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 != window.location.host;

	        if (!settings.url) settings.url = window.location.toString();
	        serializeData(settings);
	        if (settings.cache === false) settings.url = appendQuery(settings.url, '_=' + Date.now());

	        var dataType = settings.dataType,
	            hasPlaceholder = /=\?/.test(settings.url);
	        if (dataType == 'jsonp' || hasPlaceholder) {
	            if (!hasPlaceholder) settings.url = appendQuery(settings.url, 'callback=?');
	            return $.ajaxJSONP(settings);
	        }

	        var mime = settings.accepts[dataType],
	            baseHeaders = {},
	            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
	            xhr = settings.xhr(),
	            abortTimeout;

	        if (!settings.crossDomain) baseHeaders['X-Requested-With'] = 'XMLHttpRequest';
	        if (mime) {
	            baseHeaders['Accept'] = mime;
	            if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
	            xhr.overrideMimeType && xhr.overrideMimeType(mime);
	        }
	        if (settings.contentType || settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET') baseHeaders['Content-Type'] = settings.contentType || 'application/x-www-form-urlencoded';
	        settings.headers = $.extend(baseHeaders, settings.headers || {});

	        xhr.onreadystatechange = function () {
	            if (xhr.readyState == 4) {
	                xhr.onreadystatechange = empty;
	                clearTimeout(abortTimeout);
	                var result,
	                    error = false;
	                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == 'file:') {
	                    dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'));
	                    result = xhr.responseText;

	                    try {
	                        // http://perfectionkills.com/global-eval-what-are-the-options/
	                        if (dataType == 'script') (1, eval)(result);else if (dataType == 'xml') result = xhr.responseXML;else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result);
	                    } catch (e) {
	                        error = e;
	                    }

	                    if (error) ajaxError(error, 'parsererror', xhr, settings);else ajaxSuccess(result, xhr, settings);
	                } else {
	                    ajaxError(null, xhr.status ? 'error' : 'abort', xhr, settings);
	                }
	            }
	        };

	        var async = 'async' in settings ? settings.async : true;
	        xhr.open(settings.type, settings.url, async);

	        for (name in settings.headers) {
	            xhr.setRequestHeader(name, settings.headers[name]);
	        }if (ajaxBeforeSend(xhr, settings) === false) {
	            xhr.abort();
	            return false;
	        }

	        if (settings.timeout > 0) abortTimeout = setTimeout(function () {
	            xhr.onreadystatechange = empty;
	            xhr.abort();
	            ajaxError(null, 'timeout', xhr, settings);
	        }, settings.timeout);

	        // avoid sending empty string (#319)
	        xhr.send(settings.data ? settings.data : null);
	        return xhr;
	    };

	    // handle optional data/success arguments
	    function parseArguments(url, data, success, dataType) {
	        var hasData = !$.isFunction(data);
	        return {
	            url: url,
	            data: hasData ? data : undefined,
	            success: !hasData ? data : $.isFunction(success) ? success : undefined,
	            dataType: hasData ? dataType || success : success
	        };
	    }

	    $.get = function (url, data, success, dataType) {
	        return $.ajax(parseArguments.apply(null, arguments));
	    };

	    $.post = function (url, data, success, dataType) {
	        var options = parseArguments.apply(null, arguments);
	        options.type = 'POST';
	        return $.ajax(options);
	    };

	    $.getJSON = function (url, data, success) {
	        var options = parseArguments.apply(null, arguments);
	        options.dataType = 'json';
	        return $.ajax(options);
	    };

	    $.fn.load = function (url, data, success) {
	        if (!this.length) return this;
	        var self = this,
	            parts = url.split(/\s/),
	            selector,
	            options = parseArguments(url, data, success),
	            callback = options.success;
	        if (parts.length > 1) options.url = parts[0], selector = parts[1];
	        options.success = function (response) {
	            self.html(selector ? $('<div>').html(response.replace(rscript, "")).find(selector) : response);
	            callback && callback.apply(self, arguments);
	        };
	        $.ajax(options);
	        return this;
	    };

	    var escape = encodeURIComponent;

	    function serialize(params, obj, traditional, scope) {
	        var type,
	            array = $.isArray(obj);
	        $.each(obj, function (key, value) {
	            type = $.type(value);
	            if (scope) key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
	            // handle data in serializeArray() format
	            if (!scope && array) params.add(value.name, value.value);
	            // recurse into nested objects
	            else if (type == "array" || !traditional && type == "object") serialize(params, value, traditional, key);else params.add(key, value);
	        });
	    }

	    $.param = function (obj, traditional) {
	        var params = [];
	        params.add = function (k, v) {
	            this.push(escape(k) + '=' + escape(v));
	        };
	        serialize(params, obj, traditional);
	        return params.join('&').replace(/%20/g, '+');
	    };
	})(Zepto);
	(function ($) {
	    $.fn.serializeArray = function () {
	        var result = [],
	            el;
	        $(Array.prototype.slice.call(this.get(0).elements)).each(function () {
	            el = $(this);
	            var type = el.attr('type');
	            if (this.nodeName.toLowerCase() != 'fieldset' && !this.disabled && type != 'submit' && type != 'reset' && type != 'button' && (type != 'radio' && type != 'checkbox' || this.checked)) result.push({
	                name: el.attr('name'),
	                value: el.val()
	            });
	        });
	        return result;
	    };

	    $.fn.serialize = function () {
	        var result = [];
	        this.serializeArray().forEach(function (elm) {
	            result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
	        });
	        return result.join('&');
	    };

	    $.fn.submit = function (callback) {
	        if (callback) this.bind('submit', callback);else if (this.length) {
	            var event = $.Event('submit');
	            this.eq(0).trigger(event);
	            if (!event.defaultPrevented) this.get(0).submit();
	        }
	        return this;
	    };
	})(Zepto);
	(function ($, undefined) {
	    var prefix = '',
	        eventPrefix,
	        endEventName,
	        endAnimationName,
	        vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' },
	        document = window.document,
	        testEl = document.createElement('div'),
	        supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
	        transform,
	        transitionProperty,
	        transitionDuration,
	        transitionTiming,
	        animationName,
	        animationDuration,
	        animationTiming,
	        cssReset = {};

	    function dasherize(str) {
	        return downcase(str.replace(/([a-z])([A-Z])/, '$1-$2'));
	    }

	    function downcase(str) {
	        return str.toLowerCase();
	    }

	    function normalizeEvent(name) {
	        return eventPrefix ? eventPrefix + name : downcase(name);
	    }

	    $.each(vendors, function (vendor, event) {
	        if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
	            prefix = '-' + downcase(vendor) + '-';
	            eventPrefix = event;
	            return false;
	        }
	    });

	    transform = prefix + 'transform';
	    cssReset[transitionProperty = prefix + 'transition-property'] = cssReset[transitionDuration = prefix + 'transition-duration'] = cssReset[transitionTiming = prefix + 'transition-timing-function'] = cssReset[animationName = prefix + 'animation-name'] = cssReset[animationDuration = prefix + 'animation-duration'] = cssReset[animationTiming = prefix + 'animation-timing-function'] = '';

	    $.fx = {
	        off: eventPrefix === undefined && testEl.style.transitionProperty === undefined,
	        speeds: { _default: 400, fast: 200, slow: 600 },
	        cssPrefix: prefix,
	        transitionEnd: normalizeEvent('TransitionEnd'),
	        animationEnd: normalizeEvent('AnimationEnd')
	    };

	    $.fn.animate = function (properties, duration, ease, callback) {
	        if ($.isPlainObject(duration)) ease = duration.easing, callback = duration.complete, duration = duration.duration;
	        if (duration) duration = (typeof duration == 'number' ? duration : $.fx.speeds[duration] || $.fx.speeds._default) / 1000;
	        return this.anim(properties, duration, ease, callback);
	    };

	    $.fn.anim = function (properties, duration, ease, callback) {
	        var key,
	            cssValues = {},
	            cssProperties,
	            transforms = '',
	            that = this,
	            _wrappedCallback,
	            endEvent = $.fx.transitionEnd;

	        if (duration === undefined) duration = 0.4;
	        if ($.fx.off) duration = 0;

	        if (typeof properties == 'string') {
	            // keyframe animation
	            cssValues[animationName] = properties;
	            cssValues[animationDuration] = duration + 's';
	            cssValues[animationTiming] = ease || 'linear';
	            endEvent = $.fx.animationEnd;
	        } else {
	            cssProperties = [];
	            // CSS transitions
	            for (key in properties) {
	                if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') ';else cssValues[key] = properties[key], cssProperties.push(dasherize(key));
	            }if (transforms) cssValues[transform] = transforms, cssProperties.push(transform);
	            if (duration > 0 && (typeof properties === 'undefined' ? 'undefined' : _typeof(properties)) === 'object') {
	                cssValues[transitionProperty] = cssProperties.join(', ');
	                cssValues[transitionDuration] = duration + 's';
	                cssValues[transitionTiming] = ease || 'linear';
	            }
	        }

	        _wrappedCallback = function wrappedCallback(event) {
	            if (typeof event !== 'undefined') {
	                if (event.target !== event.currentTarget) return; // makes sure the event didn't bubble from "below"
	                $(event.target).unbind(endEvent, _wrappedCallback);
	            }
	            $(this).css(cssReset);
	            callback && callback.call(this);
	        };
	        if (duration > 0) this.bind(endEvent, _wrappedCallback);

	        // trigger page reflow so new elements can animate
	        this.size() && this.get(0).clientLeft;

	        this.css(cssValues);

	        if (duration <= 0) setTimeout(function () {
	            that.each(function () {
	                _wrappedCallback.call(this);
	            });
	        }, 0);

	        return this;
	    };

	    testEl = null;
	})(Zepto);

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	// JavaScript Documentmobile

	(function (doc, win) {
	  var docEl = doc.documentElement,
	      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	      recalc = function recalc() {

	    var clitWidth = "";

	    var clientWidth = docEl.clientWidth;

	    if (!clientWidth) return;

	    if (clientWidth > 640) {

	      clitWidth = 640;
	    }
	    if (clientWidth < 320) {

	      clitWidth = 320;
	    }

	    if (clientWidth <= 640 && clientWidth >= 320) {

	      clitWidth = clientWidth;
	    }

	    docEl.style.fontSize = 10 * (clitWidth / 320) + 'px';
	  };

	  if (!doc.addEventListener) return;
	  win.addEventListener(resizeEvt, recalc, false);
	  doc.addEventListener('DOMContentLoaded', recalc, false);
	})(document, window);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/*! layer mobile-v1.7 弹层组件移动版 License LGPL http://layer.layui.com/mobile By 贤心 */
	;!function (a) {
	    "use strict";

	    var b = document,
	        c = "querySelectorAll",
	        d = "getElementsByClassName",
	        e = function e(a) {
	        return b[c](a);
	    },
	        f = {
	        type: 0,
	        shade: !0,
	        shadeClose: 0,
	        fixed: !0,
	        anim: !0
	    },
	        g = {
	        extend: function extend(a) {
	            var b = JSON.parse(JSON.stringify(f));
	            for (var c in a) {
	                b[c] = a[c];
	            }return b;
	        },
	        timer: {},
	        end: {}
	    };
	    g.touch = function (a, b) {
	        var c;
	        return (/Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/.test(navigator.userAgent) ? (a.addEventListener("touchmove", function () {
	                c = !0;
	            }, !1), void a.addEventListener("touchend", function (a) {
	                a.preventDefault(), c || b.call(this, a), c = !1;
	            }, !1)) : a.addEventListener("click", function (a) {
	                b.call(this, a);
	            }, !1)
	        );
	    };
	    var h = 0,
	        i = ["layermbox"],
	        j = function j(a) {
	        var b = this;
	        b.config = g.extend(a), b.view();
	    };
	    j.prototype.view = function () {
	        var a = this,
	            c = a.config,
	            f = b.createElement("div");
	        a.id = f.id = i[0] + h, f.setAttribute("class", i[0] + " " + i[0] + (c.type || 0)), f.setAttribute("index", h);
	        var g = function () {
	            var a = "object" == _typeof(c.title);
	            return c.title ? '<h3 style="' + (a ? c.title[1] : "") + '">' + (a ? c.title[0] : c.title) + '</h3><button class="layermend"></button>' : "";
	        }(),
	            j = function () {
	            var a,
	                b = (c.btn || []).length;
	            return 0 !== b && c.btn ? (a = '<span type="1">' + c.btn[0] + "</span>", 2 === b && (a = '<span type="0">' + c.btn[1] + "</span>" + a), '<div class="layermbtn">' + a + "</div>") : "";
	        }();
	        if (c.fixed || (c.top = c.hasOwnProperty("top") ? c.top : 100, c.style = c.style || "", c.style += " top:" + (b.body.scrollTop + c.top) + "px"), 2 === c.type && (c.content = '<i></i><i class="laymloadtwo"></i><i></i>'), f.innerHTML = (c.shade ? "<div " + ("string" == typeof c.shade ? 'style="' + c.shade + '"' : "") + ' class="laymshade"></div>' : "") + '<div class="layermmain" ' + (c.fixed ? "" : 'style="position:static;"') + '><div class="section"><div class="layermchild ' + (c.className ? c.className : "") + " " + (c.type || c.shade ? "" : "layermborder ") + (c.anim ? "layermanim" : "") + '" ' + (c.style ? 'style="' + c.style + '"' : "") + ">" + g + '<div class="layermcont">' + c.content + "</div>" + j + "</div></div></div>", !c.type || 2 === c.type) {
	            var k = b[d](i[0] + c.type),
	                l = k.length;
	            l >= 1 && layer.close(k[0].getAttribute("index"));
	        }
	        document.body.appendChild(f);
	        var m = a.elem = e("#" + a.id)[0];
	        c.success && c.success(m), a.index = h++, a.action(c, m);
	    }, j.prototype.action = function (a, b) {
	        var c = this;
	        if (a.time && (g.timer[c.index] = setTimeout(function () {
	            layer.close(c.index);
	        }, 1e3 * a.time)), a.title) {
	            var e = b[d]("layermend")[0],
	                f = function f() {
	                a.cancel && a.cancel(), layer.close(c.index);
	            };
	            g.touch(e, f);
	        }
	        var h = function h() {
	            var b = this.getAttribute("type");
	            0 == b ? (a.no && a.no(), layer.close(c.index)) : a.yes ? a.yes(c.index) : layer.close(c.index);
	        };
	        if (a.btn) for (var i = b[d]("layermbtn")[0].children, j = i.length, k = 0; j > k; k++) {
	            g.touch(i[k], h);
	        }if (a.shade && a.shadeClose) {
	            var l = b[d]("laymshade")[0];
	            g.touch(l, function () {
	                layer.close(c.index, a.end);
	            });
	        }
	        a.end && (g.end[c.index] = a.end);
	    }, a.layer = {
	        v: "1.7",
	        index: h,
	        open: function open(a) {
	            var b = new j(a || {});
	            return b.index;
	        },
	        close: function close(a) {
	            var c = e("#" + i[0] + a)[0];
	            c && (c.innerHTML = "", b.body.removeChild(c), clearTimeout(g.timer[a]), delete g.timer[a], "function" == typeof g.end[a] && g.end[a](), delete g.end[a]);
	        },
	        closeAll: function closeAll() {
	            for (var a = b[d](i[0]), c = 0, e = a.length; e > c; c++) {
	                layer.close(0 | a[0].getAttribute("index"));
	            }
	        }
	    },  true ? !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
	        return layer;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : function () {
	        var a = document.scripts,
	            c = a[a.length - 1],
	            d = c.src,
	            e = d.substring(0, d.lastIndexOf("/") + 1);
	        c.getAttribute("merge") || document.head.appendChild(function () {
	            var a = b.createElement("link");
	            return a.href = e + "need/layer.css", a.type = "text/css", a.rel = "styleSheet", a.id = "layermcss", a;
	        }());
	    }();
	}(window);

/***/ }
/******/ ]);