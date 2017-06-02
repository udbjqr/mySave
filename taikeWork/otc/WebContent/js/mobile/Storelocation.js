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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _islogin = __webpack_require__(89);

	var _islogin2 = _interopRequireDefault(_islogin);

	var _zeptoMin = __webpack_require__(4);

	var _zeptoMin2 = _interopRequireDefault(_zeptoMin);

	var _fontsize = __webpack_require__(90);

	var _fontsize2 = _interopRequireDefault(_fontsize);

	var _layer = __webpack_require__(91);

	var _layer2 = _interopRequireDefault(_layer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//import '../../node_modules/antd-mobile/lib/icon/style/index.less';

	var issigninurl = "/otcdyanmic/appraisals.do";
	var url = "/otcdyanmic/customer.do";
	var currturl = window.location.href; //获取当前url
	var daydate = geturl('day'); //走访时间
	var parenturl = "CustomerDetails.html?custom_id=" + geturl('custom_id') + "&plan_id=" + geturl('plan_id') + "&day=" + daydate; //上一页
	var Signin = _react2.default.createClass({
	    displayName: 'Signin',

	    getInitialState: function getInitialState() {
	        return {
	            isgetmap: false, //是否获取到坐标
	            Y_signin: false, //是否已签到
	            referrer: topreurl(parenturl), //上一页
	            address: geturl('address'), //custom_id
	            name: geturl('name'), //plan_id
	            custom_id: geturl('custom_id'),
	            plan_id: geturl('plan_id'),
	            signType: ""
	        };
	    },
	    componentDidMount: function componentDidMount() {
	        //this.showposition();   

	        var phoneH = window.innerHeight;
	        $("#allmap").css("height", phoneH - 130 + "px");

	        var map = new BMap.Map("allmap");
	        var localSearch = new BMap.LocalSearch(map);
	        localSearch.enableAutoViewport(); //允许自动调节窗体大小

	        var keyword1 = this.state.address;
	        var keyword;

	        if (keyword1.indexOf("(") == "-1" && keyword1.indexOf("（") == "-1") {

	            keyword = keyword1;
	        } else {

	            if (keyword1.indexOf("(") > "-1") {
	                var currturl2 = keyword1.split("(");

	                keyword = currturl2[0];
	            }
	            if (keyword1.indexOf("（") > "-1") {

	                var currturl2 = keyword1.split("（");
	                keyword = currturl2[0];
	            }
	        }
	        //"南昌红谷滩万达B3写字楼";

	        localSearch.setSearchCompleteCallback(function (searchResult) {
	            if (searchResult.getPoi(0) != "" && searchResult.getPoi(0) != undefined && searchResult.getPoi(0) != null) {

	                var poi = searchResult.getPoi(0);
	                var gpsPoint = new BMap.Point(poi.point.lng, poi.point.lat);
	                map.centerAndZoom(gpsPoint, 15);
	                map.addControl(new BMap.NavigationControl());
	                var marker = new BMap.Marker(gpsPoint);
	                map.addOverlay(marker);
	                map.setCenter(gpsPoint);
	                // map.centerAndZoom(poi.point, 13);
	                //var marker = new BMap.Marker(new BMap.Point(poi.point.lng, poi.point.lat));  // 创建标注，为要查询的地方对应的经纬度
	                //map.addOverlay(marker);

	                // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
	            } else {
	                _layer2.default.open({
	                    shade: false,
	                    content: '获取门店位置失败，请确认您填写的地址是否正确(地址必须加上城市名)',
	                    skin: 'msg',
	                    className: 'tip',
	                    time: 4 //4秒后自动关闭
	                });
	            }
	        });
	        localSearch.search(keyword);
	    },

	    render: function render() {
	        return _react2.default.createElement(
	            'div',
	            null,
	            _react2.default.createElement(
	                'div',
	                { className: 'profile white', id: 'pagenav' },
	                _react2.default.createElement(
	                    'span',
	                    { className: 'toleft' },
	                    ' ',
	                    _react2.default.createElement('a', { href: this.state.referrer })
	                ),
	                this.state.name
	            ),
	            _react2.default.createElement('div', { className: 'signin_map', id: 'allmap' }),
	            _react2.default.createElement(
	                'div',
	                { className: 'to_signin' },
	                _react2.default.createElement(
	                    'span',
	                    { className: 'signin_address', ref: 'signin_Y' },
	                    this.state.address
	                )
	            )
	        );
	    }
	});

	ReactDOM.render(_react2.default.createElement(Signin, null), document.getElementById('conter'));

/***/ },

/***/ 1:
/***/ function(module, exports) {

	module.exports = React;

/***/ },

/***/ 2:
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },

/***/ 4:
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/*! Zepto 1.2.0 (generated with Zepto Builder) - zepto event form ie selector ajax fx_methods data assets touch - zeptojs.com/license */
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	var Zepto = function () {
	  var undefined,
	      key,
	      $,
	      classList,
	      emptyArray = [],
	      _concat = emptyArray.concat,
	      _filter = emptyArray.filter,
	      _slice = emptyArray.slice,
	      document = window.document,
	      elementDisplay = {},
	      classCache = {},
	      cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1, 'opacity': 1, 'z-index': 1, 'zoom': 1 },
	      fragmentRE = /^\s*<(\w+|!)[^>]*>/,
	      singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
	      tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	      rootNodeRE = /^(?:body|html)$/i,
	      capitalRE = /([A-Z])/g,


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
	      simpleSelectorRE = /^[\w-]*$/,
	      class2type = {},
	      toString = class2type.toString,
	      zepto = {},
	      camelize,
	      uniq,
	      tempParent = document.createElement('div'),
	      propMap = {
	    'tabindex': 'tabIndex',
	    'readonly': 'readOnly',
	    'for': 'htmlFor',
	    'class': 'className',
	    'maxlength': 'maxLength',
	    'cellspacing': 'cellSpacing',
	    'cellpadding': 'cellPadding',
	    'rowspan': 'rowSpan',
	    'colspan': 'colSpan',
	    'usemap': 'useMap',
	    'frameborder': 'frameBorder',
	    'contenteditable': 'contentEditable'
	  },
	      isArray = Array.isArray || function (object) {
	    return object instanceof Array;
	  };

	  zepto.matches = function (element, selector) {
	    if (!selector || !element || element.nodeType !== 1) return false;
	    var matchesSelector = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
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
	    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
	  }

	  function likeArray(obj) {
	    var length = !!obj && 'length' in obj && obj.length,
	        type = $.type(obj);

	    return 'function' != type && !isWindow(obj) && ('array' == type || length === 0 || typeof length == 'number' && length > 0 && length - 1 in obj);
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

	  function Z(dom, selector) {
	    var i,
	        len = dom ? dom.length : 0;
	    for (i = 0; i < len; i++) {
	      this[i] = dom[i];
	    }this.length = len;
	    this.selector = selector || '';
	  }

	  // `$.zepto.fragment` takes a html string and an optional tag name
	  // to generate DOM nodes from the given html string.
	  // The generated DOM nodes are returned as an array.
	  // This function can be overridden in plugins for example to make
	  // it compatible with browsers that don't support the DOM fully.
	  zepto.fragment = function (html, name, properties) {
	    var dom, nodes, container;

	    // A special case optimization for a single tag
	    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1));

	    if (!dom) {
	      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>");
	      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1;
	      if (!(name in containers)) name = '*';

	      container = containers[name];
	      container.innerHTML = '' + html;
	      dom = $.each(_slice.call(container.childNodes), function () {
	        container.removeChild(this);
	      });
	    }

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
	  // to the array. This method can be overridden in plugins.
	  zepto.Z = function (dom, selector) {
	    return new Z(dom, selector);
	  };

	  // `$.zepto.isZ` should return `true` if the given object is a Zepto
	  // collection. This method can be overridden in plugins.
	  zepto.isZ = function (object) {
	    return object instanceof zepto.Z;
	  };

	  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
	  // takes a CSS selector and an optional context (and handles various
	  // special cases).
	  // This method can be overridden in plugins.
	  zepto.init = function (selector, context) {
	    var dom;
	    // If nothing given, return an empty Zepto collection
	    if (!selector) return zepto.Z();
	    // Optimize for string selectors
	    else if (typeof selector == 'string') {
	        selector = selector.trim();
	        // If it's a html fragment, create nodes from it
	        // Note: In both Chrome 21 and Firefox 15, DOM error 12
	        // is thrown if the fragment doesn't begin with <
	        if (selector[0] == '<' && fragmentRE.test(selector)) dom = zepto.fragment(selector, RegExp.$1, context), selector = null;
	        // If there's a context, create a collection on that context first, and select
	        // nodes from there
	        else if (context !== undefined) return $(context).find(selector);
	          // If it's a CSS selector, use it to select nodes.
	          else dom = zepto.qsa(document, selector);
	      }
	      // If a function is given, call it when the DOM is ready
	      else if (isFunction(selector)) return $(document).ready(selector);
	        // If a Zepto collection is given, just return it
	        else if (zepto.isZ(selector)) return selector;else {
	            // normalize array if an array of nodes is given
	            if (isArray(selector)) dom = compact(selector);
	            // Wrap DOM nodes.
	            else if (isObject(selector)) dom = [selector], selector = null;
	              // If it's a html fragment, create nodes from it
	              else if (fragmentRE.test(selector)) dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null;
	                // If there's a context, create a collection on that context first, and select
	                // nodes from there
	                else if (context !== undefined) return $(context).find(selector);
	                  // And last but no least, if it's a CSS selector, use it to select nodes.
	                  else dom = zepto.qsa(document, selector);
	          }
	    // create a new Zepto collection from the nodes found
	    return zepto.Z(dom, selector);
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
	  // This method can be overridden in plugins.
	  zepto.qsa = function (element, selector) {
	    var found,
	        maybeID = selector[0] == '#',
	        maybeClass = !maybeID && selector[0] == '.',
	        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector,
	        // Ensure that a 1 char tag name still gets checked
	    isSimple = simpleSelectorRE.test(nameOnly);
	    return element.getElementById && isSimple && maybeID ? // Safari DocumentFragment doesn't have getElementById
	    (found = element.getElementById(nameOnly)) ? [found] : [] : element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11 ? [] : _slice.call(isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
	    maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
	    element.getElementsByTagName(selector) : // Or a tag
	    element.querySelectorAll(selector) // Or it's not simple, and we need to query all
	    );
	  };

	  function filtered(nodes, selector) {
	    return selector == null ? $(nodes) : $(nodes).filter(selector);
	  }

	  $.contains = document.documentElement.contains ? function (parent, node) {
	    return parent !== node && parent.contains(node);
	  } : function (parent, node) {
	    while (node && (node = node.parentNode)) {
	      if (node === parent) return true;
	    }return false;
	  };

	  function funcArg(context, arg, idx, payload) {
	    return isFunction(arg) ? arg.call(context, idx, payload) : arg;
	  }

	  function setAttribute(node, name, value) {
	    value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
	  }

	  // access className property while respecting SVGAnimatedString
	  function className(node, value) {
	    var klass = node.className || '',
	        svg = klass && klass.baseVal !== undefined;

	    if (value === undefined) return svg ? klass.baseVal : klass;
	    svg ? klass.baseVal = value : node.className = value;
	  }

	  // "true"  => true
	  // "false" => false
	  // "null"  => null
	  // "42"    => 42
	  // "42.5"  => 42.5
	  // "08"    => "08"
	  // JSON    => parse if valid
	  // String  => self
	  function deserializeValue(value) {
	    try {
	      return value ? value == "true" || (value == "false" ? false : value == "null" ? null : +value + "" == value ? +value : /^[\[\{]/.test(value) ? $.parseJSON(value) : value) : value;
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

	  $.isNumeric = function (val) {
	    var num = Number(val),
	        type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
	    return val != null && type != 'boolean' && (type != 'string' || val.length) && !isNaN(num) && isFinite(num) || false;
	  };

	  $.inArray = function (elem, array, i) {
	    return emptyArray.indexOf.call(array, elem, i);
	  };

	  $.camelCase = camelize;
	  $.trim = function (str) {
	    return str == null ? "" : String.prototype.trim.call(str);
	  };

	  // plugin compatibility
	  $.uuid = 0;
	  $.support = {};
	  $.expr = {};
	  $.noop = function () {};

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
	    constructor: zepto.Z,
	    length: 0,

	    // Because a collection acts like an array
	    // copy over these useful array functions.
	    forEach: emptyArray.forEach,
	    reduce: emptyArray.reduce,
	    push: emptyArray.push,
	    sort: emptyArray.sort,
	    splice: emptyArray.splice,
	    indexOf: emptyArray.indexOf,
	    concat: function concat() {
	      var i,
	          value,
	          args = [];
	      for (i = 0; i < arguments.length; i++) {
	        value = arguments[i];
	        args[i] = zepto.isZ(value) ? value.toArray() : value;
	      }
	      return _concat.apply(zepto.isZ(this) ? this.toArray() : this, args);
	    },

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
	      // don't use "interactive" on IE <= 10 (it can fired premature)
	      if (document.readyState === "complete" || document.readyState !== "loading" && !document.documentElement.doScroll) setTimeout(function () {
	        callback($);
	      }, 0);else document.addEventListener("DOMContentLoaded", function () {
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
	      if (!selector) result = $();else if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) == 'object') result = $(selector).filter(function () {
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
	      var nodes = [],
	          collection = (typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) == 'object' && $(selector);
	      this.each(function (_, node) {
	        while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector))) {
	          node = node !== context && !isDocument(node) && node.parentNode;
	        }if (node && nodes.indexOf(node) < 0) nodes.push(node);
	      });
	      return $(nodes);
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
	        return this.contentDocument || _slice.call(this.childNodes);
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
	        this.style.display == "none" && (this.style.display = '');
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
	        var el = $(this);(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide();
	      });
	    },
	    prev: function prev(selector) {
	      return $(this.pluck('previousElementSibling')).filter(selector || '*');
	    },
	    next: function next(selector) {
	      return $(this.pluck('nextElementSibling')).filter(selector || '*');
	    },
	    html: function html(_html) {
	      return 0 in arguments ? this.each(function (idx) {
	        var originHtml = this.innerHTML;
	        $(this).empty().append(funcArg(this, _html, idx, originHtml));
	      }) : 0 in this ? this[0].innerHTML : null;
	    },
	    text: function text(_text) {
	      return 0 in arguments ? this.each(function (idx) {
	        var newText = funcArg(this, _text, idx, this.textContent);
	        this.textContent = newText == null ? '' : '' + newText;
	      }) : 0 in this ? this.pluck('textContent').join("") : null;
	    },
	    attr: function attr(name, value) {
	      var result;
	      return typeof name == 'string' && !(1 in arguments) ? 0 in this && this[0].nodeType == 1 && (result = this[0].getAttribute(name)) != null ? result : undefined : this.each(function (idx) {
	        if (this.nodeType !== 1) return;
	        if (isObject(name)) for (key in name) {
	          setAttribute(this, key, name[key]);
	        } else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)));
	      });
	    },
	    removeAttr: function removeAttr(name) {
	      return this.each(function () {
	        this.nodeType === 1 && name.split(' ').forEach(function (attribute) {
	          setAttribute(this, attribute);
	        }, this);
	      });
	    },
	    prop: function prop(name, value) {
	      name = propMap[name] || name;
	      return 1 in arguments ? this.each(function (idx) {
	        this[name] = funcArg(this, value, idx, this[name]);
	      }) : this[0] && this[0][name];
	    },
	    removeProp: function removeProp(name) {
	      name = propMap[name] || name;
	      return this.each(function () {
	        delete this[name];
	      });
	    },
	    data: function data(name, value) {
	      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase();

	      var data = 1 in arguments ? this.attr(attrName, value) : this.attr(attrName);

	      return data !== null ? deserializeValue(data) : undefined;
	    },
	    val: function val(value) {
	      if (0 in arguments) {
	        if (value == null) value = "";
	        return this.each(function (idx) {
	          this.value = funcArg(this, value, idx, this.value);
	        });
	      } else {
	        return this[0] && (this[0].multiple ? $(this[0]).find('option').filter(function () {
	          return this.selected;
	        }).pluck('value') : this[0].value);
	      }
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
	      if (!this.length) return null;
	      if (document.documentElement !== this[0] && !$.contains(document.documentElement, this[0])) return { top: 0, left: 0 };
	      var obj = this[0].getBoundingClientRect();
	      return {
	        left: obj.left + window.pageXOffset,
	        top: obj.top + window.pageYOffset,
	        width: Math.round(obj.width),
	        height: Math.round(obj.height)
	      };
	    },
	    css: function css(property, value) {
	      if (arguments.length < 2) {
	        var element = this[0];
	        if (typeof property == 'string') {
	          if (!element) return;
	          return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property);
	        } else if (isArray(property)) {
	          if (!element) return;
	          var props = {};
	          var computedStyle = getComputedStyle(element, '');
	          $.each(property, function (_, prop) {
	            props[prop] = element.style[camelize(prop)] || computedStyle.getPropertyValue(prop);
	          });
	          return props;
	        }
	      }

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
	      if (!name) return false;
	      return emptyArray.some.call(this, function (el) {
	        return this.test(className(el));
	      }, classRE(name));
	    },
	    addClass: function addClass(name) {
	      if (!name) return this;
	      return this.each(function (idx) {
	        if (!('className' in this)) return;
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
	        if (!('className' in this)) return;
	        if (name === undefined) return className(this, '');
	        classList = className(this);
	        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
	          classList = classList.replace(classRE(klass), " ");
	        });
	        className(this, classList.trim());
	      });
	    },
	    toggleClass: function toggleClass(name, when) {
	      if (!name) return this;
	      return this.each(function (idx) {
	        var $this = $(this),
	            names = funcArg(this, name, idx, className(this));
	        names.split(/\s+/g).forEach(function (klass) {
	          (when === undefined ? !$this.hasClass(klass) : when) ? $this.addClass(klass) : $this.removeClass(klass);
	        });
	      });
	    },
	    scrollTop: function scrollTop(value) {
	      if (!this.length) return;
	      var hasScrollTop = 'scrollTop' in this[0];
	      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
	      return this.each(hasScrollTop ? function () {
	        this.scrollTop = value;
	      } : function () {
	        this.scrollTo(this.scrollX, value);
	      });
	    },
	    scrollLeft: function scrollLeft(value) {
	      if (!this.length) return;
	      var hasScrollLeft = 'scrollLeft' in this[0];
	      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
	      return this.each(hasScrollLeft ? function () {
	        this.scrollLeft = value;
	      } : function () {
	        this.scrollTo(value, this.scrollY);
	      });
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
	  ;['width', 'height'].forEach(function (dimension) {
	    var dimensionProperty = dimension.replace(/./, function (m) {
	      return m[0].toUpperCase();
	    });

	    $.fn[dimension] = function (value) {
	      var offset,
	          el = this[0];
	      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] : isDocument(el) ? el.documentElement['scroll' + dimensionProperty] : (offset = this.offset()) && offset[dimension];else return this.each(function (idx) {
	        el = $(this);
	        el.css(dimension, funcArg(this, value, idx, el[dimension]()));
	      });
	    };
	  });

	  function traverseNode(node, fun) {
	    fun(node);
	    for (var i = 0, len = node.childNodes.length; i < len; i++) {
	      traverseNode(node.childNodes[i], fun);
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
	        var arr = [];
	        argType = type(arg);
	        if (argType == "array") {
	          arg.forEach(function (el) {
	            if (el.nodeType !== undefined) return arr.push(el);else if ($.zepto.isZ(el)) return arr = arr.concat(el.get());
	            arr = arr.concat(zepto.fragment(el));
	          });
	          return arr;
	        }
	        return argType == "object" || arg == null ? arg : zepto.fragment(arg);
	      }),
	          parent,
	          copyByClone = this.length > 1;
	      if (nodes.length < 1) return this;

	      return this.each(function (_, target) {
	        parent = inside ? target : target.parentNode;

	        // convert all methods to a "before" operation
	        target = operatorIndex == 0 ? target.nextSibling : operatorIndex == 1 ? target.firstChild : operatorIndex == 2 ? target : null;

	        var parentInDocument = $.contains(document.documentElement, parent);

	        nodes.forEach(function (node) {
	          if (copyByClone) node = node.cloneNode(true);else if (!parent) return $(node).remove();

	          parent.insertBefore(node, target);
	          if (parentInDocument) traverseNode(node, function (el) {
	            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src) {
	              var target = el.ownerDocument ? el.ownerDocument.defaultView : window;
	              target['eval'].call(target, el.innerHTML);
	            }
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

	  zepto.Z.prototype = Z.prototype = $.fn;

	  // Export internal API functions in the `$.zepto` namespace
	  zepto.uniq = uniq;
	  zepto.deserializeValue = deserializeValue;
	  $.zepto = zepto;

	  return $;
	}();

	// If `$` is not yet defined, point it to `Zepto`
	window.Zepto = Zepto;
	window.$ === undefined && (window.$ = Zepto)
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function ($) {
	  var jsonpID = +new Date(),
	      document = window.document,
	      key,
	      name,
	      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	      scriptTypeRE = /^(?:text|application)\/javascript/i,
	      xmlTypeRE = /^(?:text|application)\/xml/i,
	      jsonType = 'application/json',
	      htmlType = 'text/html',
	      blankRE = /^\s*$/,
	      originAnchor = document.createElement('a');

	  originAnchor.href = window.location.href;

	  // trigger a custom event and return false if it was cancelled
	  function triggerAndReturn(context, eventName, data) {
	    var event = $.Event(eventName);
	    $(context).trigger(event, data);
	    return !event.isDefaultPrevented();
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
	  function ajaxSuccess(data, xhr, settings, deferred) {
	    var context = settings.context,
	        status = 'success';
	    settings.success.call(context, data, status, xhr);
	    if (deferred) deferred.resolveWith(context, [data, status, xhr]);
	    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);
	    ajaxComplete(status, xhr, settings);
	  }
	  // type: "timeout", "error", "abort", "parsererror"
	  function ajaxError(error, type, xhr, settings, deferred) {
	    var context = settings.context;
	    settings.error.call(context, xhr, type, error);
	    if (deferred) deferred.rejectWith(context, [xhr, type, error]);
	    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type]);
	    ajaxComplete(type, xhr, settings);
	  }
	  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
	  function ajaxComplete(status, xhr, settings) {
	    var context = settings.context;
	    settings.complete.call(context, xhr, status);
	    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);
	    ajaxStop(settings);
	  }

	  function ajaxDataFilter(data, type, settings) {
	    if (settings.dataFilter == empty) return data;
	    var context = settings.context;
	    return settings.dataFilter.call(context, data, type);
	  }

	  // Empty function, used as default callback
	  function empty() {}

	  $.ajaxJSONP = function (options, deferred) {
	    if (!('type' in options)) return $.ajax(options);

	    var _callbackName = options.jsonpCallback,
	        callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || 'Zepto' + jsonpID++,
	        script = document.createElement('script'),
	        originalCallback = window[callbackName],
	        responseData,
	        abort = function abort(errorType) {
	      $(script).triggerHandler('error', errorType || 'abort');
	    },
	        xhr = { abort: abort },
	        abortTimeout;

	    if (deferred) deferred.promise(xhr);

	    $(script).on('load error', function (e, errorType) {
	      clearTimeout(abortTimeout);
	      $(script).off().remove();

	      if (e.type == 'error' || !responseData) {
	        ajaxError(null, errorType || 'error', xhr, options, deferred);
	      } else {
	        ajaxSuccess(responseData[0], xhr, options, deferred);
	      }

	      window[callbackName] = originalCallback;
	      if (responseData && $.isFunction(originalCallback)) originalCallback(responseData[0]);

	      originalCallback = responseData = undefined;
	    });

	    if (ajaxBeforeSend(xhr, options) === false) {
	      abort('abort');
	      return xhr;
	    }

	    window[callbackName] = function () {
	      responseData = arguments;
	    };

	    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);
	    document.head.appendChild(script);

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
	    // IIS returns Javascript as "application/x-javascript"
	    accepts: {
	      script: 'text/javascript, application/javascript, application/x-javascript',
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
	    cache: true,
	    //Used to handle the raw response data of XMLHttpRequest.
	    //This is a pre-filtering function to sanitize the response.
	    //The sanitized response should be returned
	    dataFilter: empty
	  };

	  function mimeToDataType(mime) {
	    if (mime) mime = mime.split(';', 2)[0];
	    return mime && (mime == htmlType ? 'html' : mime == jsonType ? 'json' : scriptTypeRE.test(mime) ? 'script' : xmlTypeRE.test(mime) && 'xml') || 'text';
	  }

	  function appendQuery(url, query) {
	    if (query == '') return url;
	    return (url + '&' + query).replace(/[&?]{1,2}/, '?');
	  }

	  // serialize payload and append it to the URL for GET requests
	  function serializeData(options) {
	    if (options.processData && options.data && $.type(options.data) != "string") options.data = $.param(options.data, options.traditional);
	    if (options.data && (!options.type || options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType)) options.url = appendQuery(options.url, options.data), options.data = undefined;
	  }

	  $.ajax = function (options) {
	    var settings = $.extend({}, options || {}),
	        deferred = $.Deferred && $.Deferred(),
	        urlAnchor,
	        hashIndex;
	    for (key in $.ajaxSettings) {
	      if (settings[key] === undefined) settings[key] = $.ajaxSettings[key];
	    }ajaxStart(settings);

	    if (!settings.crossDomain) {
	      urlAnchor = document.createElement('a');
	      urlAnchor.href = settings.url;
	      // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049
	      urlAnchor.href = urlAnchor.href;
	      settings.crossDomain = originAnchor.protocol + '//' + originAnchor.host !== urlAnchor.protocol + '//' + urlAnchor.host;
	    }

	    if (!settings.url) settings.url = window.location.toString();
	    if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex);
	    serializeData(settings);

	    var dataType = settings.dataType,
	        hasPlaceholder = /\?.+=\?/.test(settings.url);
	    if (hasPlaceholder) dataType = 'jsonp';

	    if (settings.cache === false || (!options || options.cache !== true) && ('script' == dataType || 'jsonp' == dataType)) settings.url = appendQuery(settings.url, '_=' + Date.now());

	    if ('jsonp' == dataType) {
	      if (!hasPlaceholder) settings.url = appendQuery(settings.url, settings.jsonp ? settings.jsonp + '=?' : settings.jsonp === false ? '' : 'callback=?');
	      return $.ajaxJSONP(settings, deferred);
	    }

	    var mime = settings.accepts[dataType],
	        headers = {},
	        setHeader = function setHeader(name, value) {
	      headers[name.toLowerCase()] = [name, value];
	    },
	        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
	        xhr = settings.xhr(),
	        nativeSetHeader = xhr.setRequestHeader,
	        abortTimeout;

	    if (deferred) deferred.promise(xhr);

	    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest');
	    setHeader('Accept', mime || '*/*');
	    if (mime = settings.mimeType || mime) {
	      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0];
	      xhr.overrideMimeType && xhr.overrideMimeType(mime);
	    }
	    if (settings.contentType || settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET') setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');

	    if (settings.headers) for (name in settings.headers) {
	      setHeader(name, settings.headers[name]);
	    }xhr.setRequestHeader = setHeader;

	    xhr.onreadystatechange = function () {
	      if (xhr.readyState == 4) {
	        xhr.onreadystatechange = empty;
	        clearTimeout(abortTimeout);
	        var result,
	            error = false;
	        if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304 || xhr.status == 0 && protocol == 'file:') {
	          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));

	          if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob') result = xhr.response;else {
	            result = xhr.responseText;

	            try {
	              // http://perfectionkills.com/global-eval-what-are-the-options/
	              // sanitize response accordingly if data filter callback provided
	              result = ajaxDataFilter(result, dataType, settings);
	              if (dataType == 'script') (1, eval)(result);else if (dataType == 'xml') result = xhr.responseXML;else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result);
	            } catch (e) {
	              error = e;
	            }

	            if (error) return ajaxError(error, 'parsererror', xhr, settings, deferred);
	          }

	          ajaxSuccess(result, xhr, settings, deferred);
	        } else {
	          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred);
	        }
	      }
	    };

	    if (ajaxBeforeSend(xhr, settings) === false) {
	      xhr.abort();
	      ajaxError(null, 'abort', xhr, settings, deferred);
	      return xhr;
	    }

	    var async = 'async' in settings ? settings.async : true;
	    xhr.open(settings.type, settings.url, async, settings.username, settings.password);

	    if (settings.xhrFields) for (name in settings.xhrFields) {
	      xhr[name] = settings.xhrFields[name];
	    }for (name in headers) {
	      nativeSetHeader.apply(xhr, headers[name]);
	    }if (settings.timeout > 0) abortTimeout = setTimeout(function () {
	      xhr.onreadystatechange = empty;
	      xhr.abort();
	      ajaxError(null, 'timeout', xhr, settings, deferred);
	    }, settings.timeout);

	    // avoid sending empty string (#319)
	    xhr.send(settings.data ? settings.data : null);
	    return xhr;
	  };

	  // handle optional data/success arguments
	  function parseArguments(url, data, success, dataType) {
	    if ($.isFunction(data)) dataType = success, success = data, data = undefined;
	    if (!$.isFunction(success)) dataType = success, success = undefined;
	    return {
	      url: url,
	      data: data,
	      success: success,
	      dataType: dataType
	    };
	  }

	  $.get = function () /* url, data, success, dataType */{
	    return $.ajax(parseArguments.apply(null, arguments));
	  };

	  $.post = function () /* url, data, success, dataType */{
	    var options = parseArguments.apply(null, arguments);
	    options.type = 'POST';
	    return $.ajax(options);
	  };

	  $.getJSON = function () /* url, data, success */{
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
	        array = $.isArray(obj),
	        hash = $.isPlainObject(obj);
	    $.each(obj, function (key, value) {
	      type = $.type(value);
	      if (scope) key = traditional ? scope : scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']';
	      // handle data in serializeArray() format
	      if (!scope && array) params.add(value.name, value.value);
	      // recurse into nested objects
	      else if (type == "array" || !traditional && type == "object") serialize(params, value, traditional, key);else params.add(key, value);
	    });
	  }

	  $.param = function (obj, traditional) {
	    var params = [];
	    params.add = function (key, value) {
	      if ($.isFunction(value)) value = value();
	      if (value == null) value = "";
	      this.push(escape(key) + '=' + escape(value));
	    };
	    serialize(params, obj, traditional);
	    return params.join('&').replace(/%20/g, '+');
	  };
	})(Zepto)
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function ($) {
	  var cache = [],
	      timeout;

	  $.fn.remove = function () {
	    return this.each(function () {
	      if (this.parentNode) {
	        if (this.tagName === 'IMG') {
	          cache.push(this);
	          this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
	          if (timeout) clearTimeout(timeout);
	          timeout = setTimeout(function () {
	            cache = [];
	          }, 60000);
	        }
	        this.parentNode.removeChild(this);
	      }
	    });
	  };
	})(Zepto)
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	// The following code is heavily inspired by jQuery's $.fn.data()

	;(function ($) {
	  var data = {},
	      dataAttr = $.fn.data,
	      camelize = $.camelCase,
	      exp = $.expando = 'Zepto' + +new Date(),
	      emptyArray = [];

	  // Get value from node:
	  // 1. first try key as given,
	  // 2. then try camelized key,
	  // 3. fall back to reading "data-*" attribute.
	  function getData(node, name) {
	    var id = node[exp],
	        store = id && data[id];
	    if (name === undefined) return store || setData(node);else {
	      if (store) {
	        if (name in store) return store[name];
	        var camelName = camelize(name);
	        if (camelName in store) return store[camelName];
	      }
	      return dataAttr.call($(node), name);
	    }
	  }

	  // Store value under camelized key on node
	  function setData(node, name, value) {
	    var id = node[exp] || (node[exp] = ++$.uuid),
	        store = data[id] || (data[id] = attributeData(node));
	    if (name !== undefined) store[camelize(name)] = value;
	    return store;
	  }

	  // Read all "data-*" attributes from a node
	  function attributeData(node) {
	    var store = {};
	    $.each(node.attributes || emptyArray, function (i, attr) {
	      if (attr.name.indexOf('data-') == 0) store[camelize(attr.name.replace('data-', ''))] = $.zepto.deserializeValue(attr.value);
	    });
	    return store;
	  }

	  $.fn.data = function (name, value) {
	    return value === undefined ?
	    // set multiple values via object
	    $.isPlainObject(name) ? this.each(function (i, node) {
	      $.each(name, function (key, value) {
	        setData(node, key, value);
	      });
	    }) :
	    // get value from first element
	    0 in this ? getData(this[0], name) : undefined :
	    // set value on all elements
	    this.each(function () {
	      setData(this, name, value);
	    });
	  };

	  $.data = function (elem, name, value) {
	    return $(elem).data(name, value);
	  };

	  $.hasData = function (elem) {
	    var id = elem[exp],
	        store = id && data[id];
	    return store ? !$.isEmptyObject(store) : false;
	  };

	  $.fn.removeData = function (names) {
	    if (typeof names == 'string') names = names.split(/\s+/);
	    return this.each(function () {
	      var id = this[exp],
	          store = id && data[id];
	      if (store) $.each(names || store, function (key) {
	        delete store[names ? camelize(this) : key];
	      });
	    });
	  }

	  // Generate extended `remove` and `empty` functions
	  ;['remove', 'empty'].forEach(function (methodName) {
	    var origFn = $.fn[methodName];
	    $.fn[methodName] = function () {
	      var elements = this.find('*');
	      if (methodName === 'remove') elements = elements.add(this);
	      elements.removeData();
	      return origFn.call(this);
	    };
	  });
	})(Zepto)
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function ($) {
	  var _zid = 1,
	      undefined,
	      slice = Array.prototype.slice,
	      isFunction = $.isFunction,
	      isString = function isString(obj) {
	    return typeof obj == 'string';
	  },
	      handlers = {},
	      specialEvents = {},
	      focusinSupported = 'onfocusin' in window,
	      focus = { focus: 'focusin', blur: 'focusout' },
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

	  function eventCapture(handler, captureSetting) {
	    return handler.del && !focusinSupported && handler.e in focus || !!captureSetting;
	  }

	  function realEvent(type) {
	    return hover[type] || focusinSupported && focus[type] || type;
	  }

	  function add(element, events, fn, data, selector, delegator, capture) {
	    var id = zid(element),
	        set = handlers[id] || (handlers[id] = []);
	    events.split(/\s/).forEach(function (event) {
	      if (event == 'ready') return $(document).ready(fn);
	      var handler = parse(event);
	      handler.fn = fn;
	      handler.sel = selector;
	      // emulate mouseenter, mouseleave
	      if (handler.e in hover) fn = function fn(e) {
	        var related = e.relatedTarget;
	        if (!related || related !== this && !$.contains(this, related)) return handler.fn.apply(this, arguments);
	      };
	      handler.del = delegator;
	      var callback = delegator || fn;
	      handler.proxy = function (e) {
	        e = compatible(e);
	        if (e.isImmediatePropagationStopped()) return;
	        e.data = data;
	        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));
	        if (result === false) e.preventDefault(), e.stopPropagation();
	        return result;
	      };
	      handler.i = set.length;
	      set.push(handler);
	      if ('addEventListener' in element) element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
	    });
	  }
	  function remove(element, events, fn, selector, capture) {
	    var id = zid(element);(events || '').split(/\s/).forEach(function (event) {
	      findHandlers(element, event, fn, selector).forEach(function (handler) {
	        delete handlers[id][handler.i];
	        if ('removeEventListener' in element) element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
	      });
	    });
	  }

	  $.event = { add: add, remove: remove };

	  $.proxy = function (fn, context) {
	    var args = 2 in arguments && slice.call(arguments, 2);
	    if (isFunction(fn)) {
	      var proxyFn = function proxyFn() {
	        return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
	      };
	      proxyFn._zid = zid(fn);
	      return proxyFn;
	    } else if (isString(context)) {
	      if (args) {
	        args.unshift(fn[context], fn);
	        return $.proxy.apply(null, args);
	      } else {
	        return $.proxy(fn[context], fn);
	      }
	    } else {
	      throw new TypeError("expected function");
	    }
	  };

	  $.fn.bind = function (event, data, callback) {
	    return this.on(event, data, callback);
	  };
	  $.fn.unbind = function (event, callback) {
	    return this.off(event, callback);
	  };
	  $.fn.one = function (event, selector, data, callback) {
	    return this.on(event, selector, data, callback, 1);
	  };

	  var returnTrue = function returnTrue() {
	    return true;
	  },
	      returnFalse = function returnFalse() {
	    return false;
	  },
	      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
	      eventMethods = {
	    preventDefault: 'isDefaultPrevented',
	    stopImmediatePropagation: 'isImmediatePropagationStopped',
	    stopPropagation: 'isPropagationStopped'
	  };

	  function compatible(event, source) {
	    if (source || !event.isDefaultPrevented) {
	      source || (source = event);

	      $.each(eventMethods, function (name, predicate) {
	        var sourceMethod = source[name];
	        event[name] = function () {
	          this[predicate] = returnTrue;
	          return sourceMethod && sourceMethod.apply(source, arguments);
	        };
	        event[predicate] = returnFalse;
	      });

	      try {
	        event.timeStamp || (event.timeStamp = Date.now());
	      } catch (ignored) {}

	      if (source.defaultPrevented !== undefined ? source.defaultPrevented : 'returnValue' in source ? source.returnValue === false : source.getPreventDefault && source.getPreventDefault()) event.isDefaultPrevented = returnTrue;
	    }
	    return event;
	  }

	  function createProxy(event) {
	    var key,
	        proxy = { originalEvent: event };
	    for (key in event) {
	      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key];
	    }return compatible(proxy, event);
	  }

	  $.fn.delegate = function (selector, event, callback) {
	    return this.on(event, selector, callback);
	  };
	  $.fn.undelegate = function (selector, event, callback) {
	    return this.off(event, selector, callback);
	  };

	  $.fn.live = function (event, callback) {
	    $(document.body).delegate(this.selector, event, callback);
	    return this;
	  };
	  $.fn.die = function (event, callback) {
	    $(document.body).undelegate(this.selector, event, callback);
	    return this;
	  };

	  $.fn.on = function (event, selector, data, callback, one) {
	    var autoRemove,
	        delegator,
	        $this = this;
	    if (event && !isString(event)) {
	      $.each(event, function (type, fn) {
	        $this.on(type, selector, data, fn, one);
	      });
	      return $this;
	    }

	    if (!isString(selector) && !isFunction(callback) && callback !== false) callback = data, data = selector, selector = undefined;
	    if (callback === undefined || data === false) callback = data, data = undefined;

	    if (callback === false) callback = returnFalse;

	    return $this.each(function (_, element) {
	      if (one) autoRemove = function autoRemove(e) {
	        remove(element, e.type, callback);
	        return callback.apply(this, arguments);
	      };

	      if (selector) delegator = function delegator(e) {
	        var evt,
	            match = $(e.target).closest(selector, element).get(0);
	        if (match && match !== element) {
	          evt = $.extend(createProxy(e), { currentTarget: match, liveFired: element });
	          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
	        }
	      };

	      add(element, event, callback, data, selector, delegator || autoRemove);
	    });
	  };
	  $.fn.off = function (event, selector, callback) {
	    var $this = this;
	    if (event && !isString(event)) {
	      $.each(event, function (type, fn) {
	        $this.off(type, selector, fn);
	      });
	      return $this;
	    }

	    if (!isString(selector) && !isFunction(callback) && callback !== false) callback = selector, selector = undefined;

	    if (callback === false) callback = returnFalse;

	    return $this.each(function () {
	      remove(this, event, callback, selector);
	    });
	  };

	  $.fn.trigger = function (event, args) {
	    event = isString(event) || $.isPlainObject(event) ? $.Event(event) : compatible(event);
	    event._args = args;
	    return this.each(function () {
	      // handle focus(), blur() by calling them directly
	      if (event.type in focus && typeof this[event.type] == "function") this[event.type]();
	      // items in the collection might not be DOM elements
	      else if ('dispatchEvent' in this) this.dispatchEvent(event);else $(this).triggerHandler(event, args);
	    });
	  };

	  // triggers event handlers on current element just as if an event occurred,
	  // doesn't trigger an actual event, doesn't bubble
	  $.fn.triggerHandler = function (event, args) {
	    var e, result;
	    this.each(function (i, element) {
	      e = createProxy(isString(event) ? $.Event(event) : event);
	      e._args = args;
	      e.target = element;
	      $.each(findHandlers(element, event.type || event), function (i, handler) {
	        result = handler.proxy(e);
	        if (e.isImmediatePropagationStopped()) return false;
	      });
	    });
	    return result;
	  }

	  // shortcut methods for `.bind(event, fn)` for each event type
	  ;('focusin focusout focus blur load resize scroll unload click dblclick ' + 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' + 'change select keydown keypress keyup error').split(' ').forEach(function (event) {
	    $.fn[event] = function (callback) {
	      return 0 in arguments ? this.bind(event, callback) : this.trigger(event);
	    };
	  });

	  $.Event = function (type, props) {
	    if (!isString(type)) props = type, type = props.type;
	    var event = document.createEvent(specialEvents[type] || 'Events'),
	        bubbles = true;
	    if (props) for (var name in props) {
	      name == 'bubbles' ? bubbles = !!props[name] : event[name] = props[name];
	    }event.initEvent(type, bubbles, true);
	    return compatible(event);
	  };
	})(Zepto)
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function ($) {
	  $.fn.serializeArray = function () {
	    var name,
	        type,
	        result = [],
	        add = function add(value) {
	      if (value.forEach) return value.forEach(add);
	      result.push({ name: name, value: value });
	    };
	    if (this[0]) $.each(this[0].elements, function (_, field) {
	      type = field.type, name = field.name;
	      if (name && field.nodeName.toLowerCase() != 'fieldset' && !field.disabled && type != 'submit' && type != 'reset' && type != 'button' && type != 'file' && (type != 'radio' && type != 'checkbox' || field.checked)) add($(field).val());
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
	    if (0 in arguments) this.bind('submit', callback);else if (this.length) {
	      var event = $.Event('submit');
	      this.eq(0).trigger(event);
	      if (!event.isDefaultPrevented()) this.get(0).submit();
	    }
	    return this;
	  };
	})(Zepto)
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function ($, undefined) {
	  var document = window.document,
	      docElem = document.documentElement,
	      origShow = $.fn.show,
	      origHide = $.fn.hide,
	      origToggle = $.fn.toggle;

	  function anim(el, speed, opacity, scale, callback) {
	    if (typeof speed == 'function' && !callback) callback = speed, speed = undefined;
	    var props = { opacity: opacity };
	    if (scale) {
	      props.scale = scale;
	      el.css($.fx.cssPrefix + 'transform-origin', '0 0');
	    }
	    return el.animate(props, speed, null, callback);
	  }

	  function hide(el, speed, scale, callback) {
	    return anim(el, speed, 0, scale, function () {
	      origHide.call($(this));
	      callback && callback.call(this);
	    });
	  }

	  $.fn.show = function (speed, callback) {
	    origShow.call(this);
	    if (speed === undefined) speed = 0;else this.css('opacity', 0);
	    return anim(this, speed, 1, '1,1', callback);
	  };

	  $.fn.hide = function (speed, callback) {
	    if (speed === undefined) return origHide.call(this);else return hide(this, speed, '0,0', callback);
	  };

	  $.fn.toggle = function (speed, callback) {
	    if (speed === undefined || typeof speed == 'boolean') return origToggle.call(this, speed);else return this.each(function () {
	      var el = $(this);
	      el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback);
	    });
	  };

	  $.fn.fadeTo = function (speed, opacity, callback) {
	    return anim(this, speed, opacity, null, callback);
	  };

	  $.fn.fadeIn = function (speed, callback) {
	    var target = this.css('opacity');
	    if (target > 0) this.css('opacity', 0);else target = 1;
	    return origShow.call(this).fadeTo(speed, target, callback);
	  };

	  $.fn.fadeOut = function (speed, callback) {
	    return hide(this, speed, null, callback);
	  };

	  $.fn.fadeToggle = function (speed, callback) {
	    return this.each(function () {
	      var el = $(this);
	      el[el.css('opacity') == 0 || el.css('display') == 'none' ? 'fadeIn' : 'fadeOut'](speed, callback);
	    });
	  };
	})(Zepto)
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function () {
	  // getComputedStyle shouldn't freak out when called
	  // without a valid element as argument
	  try {
	    getComputedStyle(undefined);
	  } catch (e) {
	    var nativeGetComputedStyle = getComputedStyle;
	    window.getComputedStyle = function (element, pseudoElement) {
	      try {
	        return nativeGetComputedStyle(element, pseudoElement);
	      } catch (e) {
	        return null;
	      }
	    };
	  }
	})()
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function ($) {
	  var zepto = $.zepto,
	      oldQsa = zepto.qsa,
	      oldMatches = zepto.matches;

	  function _visible(elem) {
	    elem = $(elem);
	    return !!(elem.width() || elem.height()) && elem.css("display") !== "none";
	  }

	  // Implements a subset from:
	  // http://api.jquery.com/category/selectors/jquery-selector-extensions/
	  //
	  // Each filter function receives the current index, all nodes in the
	  // considered set, and a value if there were parentheses. The value
	  // of `this` is the node currently being considered. The function returns the
	  // resulting node(s), null, or undefined.
	  //
	  // Complex selectors are not supported:
	  //   li:has(label:contains("foo")) + li:has(label:contains("bar"))
	  //   ul.inner:first > li
	  var filters = $.expr[':'] = {
	    visible: function visible() {
	      if (_visible(this)) return this;
	    },
	    hidden: function hidden() {
	      if (!_visible(this)) return this;
	    },
	    selected: function selected() {
	      if (this.selected) return this;
	    },
	    checked: function checked() {
	      if (this.checked) return this;
	    },
	    parent: function parent() {
	      return this.parentNode;
	    },
	    first: function first(idx) {
	      if (idx === 0) return this;
	    },
	    last: function last(idx, nodes) {
	      if (idx === nodes.length - 1) return this;
	    },
	    eq: function eq(idx, _, value) {
	      if (idx === value) return this;
	    },
	    contains: function contains(idx, _, text) {
	      if ($(this).text().indexOf(text) > -1) return this;
	    },
	    has: function has(idx, _, sel) {
	      if (zepto.qsa(this, sel).length) return this;
	    }
	  };

	  var filterRe = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),
	      childRe = /^\s*>/,
	      classTag = 'Zepto' + +new Date();

	  function process(sel, fn) {
	    // quote the hash in `a[href^=#]` expression
	    sel = sel.replace(/=#\]/g, '="#"]');
	    var filter,
	        arg,
	        match = filterRe.exec(sel);
	    if (match && match[2] in filters) {
	      filter = filters[match[2]], arg = match[3];
	      sel = match[1];
	      if (arg) {
	        var num = Number(arg);
	        if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '');else arg = num;
	      }
	    }
	    return fn(sel, filter, arg);
	  }

	  zepto.qsa = function (node, selector) {
	    return process(selector, function (sel, filter, arg) {
	      try {
	        var taggedParent;
	        if (!sel && filter) sel = '*';else if (childRe.test(sel))
	          // support "> *" child queries by tagging the parent node with a
	          // unique class and prepending that classname onto the selector
	          taggedParent = $(node).addClass(classTag), sel = '.' + classTag + ' ' + sel;

	        var nodes = oldQsa(node, sel);
	      } catch (e) {
	        console.error('error performing selector: %o', selector);
	        throw e;
	      } finally {
	        if (taggedParent) taggedParent.removeClass(classTag);
	      }
	      return !filter ? nodes : zepto.uniq($.map(nodes, function (n, i) {
	        return filter.call(n, i, nodes, arg);
	      }));
	    });
	  };

	  zepto.matches = function (node, selector) {
	    return process(selector, function (sel, filter, arg) {
	      return (!sel || oldMatches(node, sel)) && (!filter || filter.call(node, null, arg) === node);
	    });
	  };
	})(Zepto)
	//     Zepto.js
	//     (c) 2010-2016 Thomas Fuchs
	//     Zepto.js may be freely distributed under the MIT license.

	;(function ($) {
	  var touch = {},
	      touchTimeout,
	      tapTimeout,
	      swipeTimeout,
	      longTapTimeout,
	      longTapDelay = 750,
	      gesture;

	  function swipeDirection(x1, x2, y1, y2) {
	    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? x1 - x2 > 0 ? 'Left' : 'Right' : y1 - y2 > 0 ? 'Up' : 'Down';
	  }

	  function longTap() {
	    longTapTimeout = null;
	    if (touch.last) {
	      touch.el.trigger('longTap');
	      touch = {};
	    }
	  }

	  function cancelLongTap() {
	    if (longTapTimeout) clearTimeout(longTapTimeout);
	    longTapTimeout = null;
	  }

	  function cancelAll() {
	    if (touchTimeout) clearTimeout(touchTimeout);
	    if (tapTimeout) clearTimeout(tapTimeout);
	    if (swipeTimeout) clearTimeout(swipeTimeout);
	    if (longTapTimeout) clearTimeout(longTapTimeout);
	    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
	    touch = {};
	  }

	  function isPrimaryTouch(event) {
	    return (event.pointerType == 'touch' || event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary;
	  }

	  function isPointerEventType(e, type) {
	    return e.type == 'pointer' + type || e.type.toLowerCase() == 'mspointer' + type;
	  }

	  $(document).ready(function () {
	    var now,
	        delta,
	        deltaX = 0,
	        deltaY = 0,
	        firstTouch,
	        _isPointerType;

	    if ('MSGesture' in window) {
	      gesture = new MSGesture();
	      gesture.target = document.body;
	    }

	    $(document).bind('MSGestureEnd', function (e) {
	      var swipeDirectionFromVelocity = e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
	      if (swipeDirectionFromVelocity) {
	        touch.el.trigger('swipe');
	        touch.el.trigger('swipe' + swipeDirectionFromVelocity);
	      }
	    }).on('touchstart MSPointerDown pointerdown', function (e) {
	      if ((_isPointerType = isPointerEventType(e, 'down')) && !isPrimaryTouch(e)) return;
	      firstTouch = _isPointerType ? e : e.touches[0];
	      if (e.touches && e.touches.length === 1 && touch.x2) {
	        // Clear out touch movement data if we have it sticking around
	        // This can occur if touchcancel doesn't fire due to preventDefault, etc.
	        touch.x2 = undefined;
	        touch.y2 = undefined;
	      }
	      now = Date.now();
	      delta = now - (touch.last || now);
	      touch.el = $('tagName' in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);
	      touchTimeout && clearTimeout(touchTimeout);
	      touch.x1 = firstTouch.pageX;
	      touch.y1 = firstTouch.pageY;
	      if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
	      touch.last = now;
	      longTapTimeout = setTimeout(longTap, longTapDelay);
	      // adds the current touch contact for IE gesture recognition
	      if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
	    }).on('touchmove MSPointerMove pointermove', function (e) {
	      if ((_isPointerType = isPointerEventType(e, 'move')) && !isPrimaryTouch(e)) return;
	      firstTouch = _isPointerType ? e : e.touches[0];
	      cancelLongTap();
	      touch.x2 = firstTouch.pageX;
	      touch.y2 = firstTouch.pageY;

	      deltaX += Math.abs(touch.x1 - touch.x2);
	      deltaY += Math.abs(touch.y1 - touch.y2);
	    }).on('touchend MSPointerUp pointerup', function (e) {
	      if ((_isPointerType = isPointerEventType(e, 'up')) && !isPrimaryTouch(e)) return;
	      cancelLongTap();

	      // swipe
	      if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 30 || touch.y2 && Math.abs(touch.y1 - touch.y2) > 30) swipeTimeout = setTimeout(function () {
	        if (touch.el) {
	          touch.el.trigger('swipe');
	          touch.el.trigger('swipe' + swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2));
	        }
	        touch = {};
	      }, 0);

	      // normal tap
	      else if ('last' in touch)
	          // don't fire tap when delta position changed by more than 30 pixels,
	          // for instance when moving to a point and back to origin
	          if (deltaX < 30 && deltaY < 30) {
	            // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
	            // ('tap' fires before 'scroll')
	            tapTimeout = setTimeout(function () {

	              // trigger universal 'tap' with the option to cancelTouch()
	              // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
	              var event = $.Event('tap');
	              event.cancelTouch = cancelAll;
	              // [by paper] fix -> "TypeError: 'undefined' is not an object (evaluating 'touch.el.trigger'), when double tap
	              if (touch.el) touch.el.trigger(event);

	              // trigger double tap immediately
	              if (touch.isDoubleTap) {
	                if (touch.el) touch.el.trigger('doubleTap');
	                touch = {};
	              }

	              // trigger single tap after 250ms of inactivity
	              else {
	                  touchTimeout = setTimeout(function () {
	                    touchTimeout = null;
	                    if (touch.el) touch.el.trigger('singleTap');
	                    touch = {};
	                  }, 250);
	                }
	            }, 0);
	          } else {
	            touch = {};
	          }
	      deltaX = deltaY = 0;
	    })
	    // when the browser window loses focus,
	    // for example when a modal dialog is shown,
	    // cancel all ongoing events
	    .on('touchcancel MSPointerCancel pointercancel', cancelAll);

	    // scrolling the window indicates intention of the user
	    // to scroll, not tap or swipe, so cancel all ongoing events
	    $(window).on('scroll', cancelAll);
	  });['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function (eventName) {
	    $.fn[eventName] = function (callback) {
	      return this.on(eventName, callback);
	    };
	  });
	})(Zepto);

/***/ },

/***/ 89:
/***/ function(module, exports) {

	"use strict";

	var pagesize = 10; //每页条数
	var OpenID = isnull(sessionStorage.getItem("OpenID")); //缓存中的OpenID;
	var currturl = window.location.href; //获取当前url
	var mname = "";
	var code = "2e77e836fe07868acf005b603c7459e2";
	var code1 = "cb33b9db8e150e8b2db1b1b6a627b740";
	var dft_img = "../images/mobile/default.png"; //默认图片 
	var dft_headimg = "../images/mobile/17.png"; //默认头像图片 

	var crrentindex = currturl.split("mobile")[0];

	/*  判断是本地测试还是正式服务器  */
	var istest = function () {
	    var firsturl = currturl.split(".")[0];
	    if (firsturl == "http://192" || firsturl == "192") {
	        return true;
	    } else {
	        return false;
	    }
	}();

	//微信登录code
	function wxurl(statenum) {
	    statenum = isnull(statenum) == "" ? generateMixed(6) : statenum;

	    var xurl = "";
	    if (is_weixin) {
	        wxurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbfff10e577b27a7&redirect_uri=" + crrentindex + "mobile/getcode.html&response_type=code&scope=snsapi_base&state=" + statenum + "#wechat_redirect";
	    } else {
	        wxurl = "getcode.html?code=" + code + "&state=" + statenum;
	    }
	    return wxurl;
	}

	//绑定账号页面获取微信头像code
	function wxheadurl(statenum) {
	    if (isnull(statenum) == "") {
	        statenum = generateMixed(6);
	    }
	    var xurl = "";
	    if (is_weixin) {
	        //https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbfff10e577b27a7&redirect_uri=http://demo.itaike.cn:8088/otc/mobile/login.html&response_type=code&scope=snsapi_base&state=ak2017&connect_redirect=1#wechat_redirect
	        wxurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbfff10e577b27a7&redirect_uri=" + crrentindex + "mobile/login.html&response_type=code&scope=snsapi_base&state=" + statenum + "#wechat_redirect";
	    } else {
	        wxurl = "login.html?code=" + code1 + "&state=" + statenum;
	    }
	    return wxurl;
	}

	//上传头像页面获取微信头像code
	function wxauth(state) {
	    if (isnull(state) == "") {
	        state = generateMixed(6);
	    }
	    var wxauth = "";
	    if (is_weixin) {
	        wxauth = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbbfff10e577b27a7&redirect_uri=" + crrentindex + "mobile/getauthcode.html&response_type=code&scope=snsapi_base&state=" + state + "#wechat_redirect";
	    } else {
	        wxauth = "getauthcode.html?code=" + code1 + "&state=" + generateMixed(6);
	    }
	    return wxauth;
	}

	/*
	页面div中显示信息
	*
	显示方式
	showmsg({
	msg:"",  //显示的信息,
	isbtn:"",   //是否显示按钮,
	url:"",//点击按钮时的跳转链接 为空时为刷新,
	showimg:"",//错误图片,
	btntext:"",//按钮文字,
	classname:"",//样式名
	})
	*/

	function showmsg(str) {
	    var msg = isnull(str.msg) == "" ? "系统错误，请联系管理员" : str.msg;
	    var url = isnull(str.url);
	    var btntext = isnull(str.btntext) == "" ? "立即刷新" : str.btntext;
	    var showimg = isnull(str.showimg) == "" ? "../images/mobile/Datafailed.png" : str.showimg;
	    var isbtn = isnull(str.isbtn);
	    var classname = isnull(str.classname);
	    var backurl = url == "" ? "1" : "2";

	    if (isbtn == "") {
	        isbtn = false;
	    } else if (isbtn != true && isbtn != false) {
	        isbtn = false;
	    }
	    var showmsg = "";
	    var btns = backurl == "1" ? "<button class='nonetwork_btn' onTouchEnd=reload()>" + btntext + "</button>" : "<button class='nonetwork_btn' onTouchEnd=linkto('" + url + "')>" + btntext + "</button>";
	    var isshowbtn = isbtn ? btns : "";
	    showmsg += "<div class='nonetwork " + classname + "'>";
	    showmsg += "<div class='nonetworkwarp'>";
	    showmsg += "<img src='" + showimg + "'>";
	    showmsg += "<p> " + msg + "</p>";
	    showmsg += isshowbtn;
	    showmsg += "</div>";
	    showmsg += "</div>";
	    return showmsg;
	}

	//ajax处理中提示
	function ajaxdong(text, $this, time) {

	    if (isnull(text) == "") {
	        text = "正在处理中";
	    }
	    if (isnull(time) == "") {
	        time = 2000;
	    }
	    setTimeout(function () {

	        if ($this.state.isload) {
	            layer.open({
	                shade: true,
	                content: text,
	                skin: 'msg',
	                className: 'tip'
	            });
	        }
	    }, 2000);
	}

	//加载
	var loading = "";
	loading += "<div class='loading'>";
	loading += "<div class='spinner'>";
	loading += "<div class='bounce1'></div>";
	loading += "<div class='bounce2'></div>";
	loading += "<div class='bounce3'></div>";
	loading += "</div>";
	loading += "<P>正在加载数据..</p>";
	loading += "</div>";

	//加载更多
	var loadingmore = "";
	loadingmore += "<div class='loading1'>";
	loadingmore += "<i class='fa fa-spinner fa-pulse'></i>";
	loadingmore += "</div>";

	//无网络
	var nonetwork = "";
	nonetwork += "<div class='nonetwork'>";
	nonetwork += "<div class='nonetworkwarp'>";
	nonetwork += "<img src='../images/mobile/nonetwork.png'>";
	nonetwork += "<p> 无法连接网络，请检查网络并刷新重试</p>";
	nonetwork += "<button class='nonetwork_btn' onTouchEnd='reload()'>重试</button>";
	nonetwork += "</div>";
	nonetwork += "</div>";

	//获取数据失败
	var Datafailed = "";
	Datafailed += "<div class='nonetwork'>";
	Datafailed += "<div class='nonetworkwarp'>";
	Datafailed += "<img src='../images/mobile/Datafailed.png'>";
	Datafailed += "<p> 加载失败</p>";
	Datafailed += "<button class='nonetwork_btn' onTouchEnd='reload()'>重试</button>";
	Datafailed += "</div>";
	Datafailed += "</div>";

	var Datafailed1 = "";
	Datafailed1 += "<div class='nonetwork'>";
	Datafailed1 += "<div class='nonetworkwarp'>";
	Datafailed1 += "<img src='../images/mobile/Datafailed.png'>";
	Datafailed1 += "<p> 加载失败，数据超时</p>";
	Datafailed1 += "<button class='nonetwork_btn' onTouchEnd='reload()'>重试</button>";
	Datafailed1 += "</div>";
	Datafailed1 += "</div>";

	function Datafaile(str, url, btntext, imgurl, isbtn) {

	    if (isnull(url) == "") {
	        url = "index.html";
	    }
	    if (btntext == "" || btntext == undefined || btntext == null) {
	        btntext = "立即返回";
	    }

	    if (imgurl == "" || imgurl == undefined || imgurl == null) {
	        imgurl = "../images/mobile/Datafailed.png";
	    }

	    var Datafaile = "";
	    Datafaile += "<div class='nonetwork'>";
	    Datafaile += "<div class='nonetworkwarp'>";
	    Datafaile += "<img src='" + imgurl + "'>";
	    Datafaile += "<p> " + str + "</p>";
	    if (isbtn == "0") {} else {
	        Datafaile += "<button class='nonetwork_btn' onTouchEnd=back('" + url + "')>" + btntext + "</button>";
	    }

	    Datafaile += "</div>";
	    Datafaile += "</div>";
	    return Datafaile;
	}

	function success(str, url, btntext) {

	    if (url == "" || url == undefined || url == null) {
	        url = "index.html";
	    }
	    if (btntext == "" || btntext == undefined || btntext == null) {
	        btntext = "立即返回";
	    }

	    var Datafaile = "";
	    Datafaile += "<div class='nonetwork'>";
	    Datafaile += "<div class='nonetworkwarp'>";
	    Datafaile += "<img src='../images/mobile/29.png' class='successimg'>";
	    Datafaile += "<p> " + str + "</p>";
	    Datafaile += "<button class='nonetwork_btn' onTouchEnd=back('" + url + "')>立即返回</button>";
	    Datafaile += "</div>";
	    Datafaile += "</div>";
	    return Datafaile;
	}

	// 刷新页面
	function reload() {
	    setTimeout(function () {
	        location.reload();
	    }, 320);
	}

	function back(str) {
	    setTimeout(function () {
	        window.location.href = topreurl(str);
	    }, 320);
	};

	function linkto(str) {
	    setTimeout(function () {
	        window.location.href = str;
	    }, 320);
	};

	//根据code获取头像
	function getwxavatar(code, backtourl) {
	    var object = new Object();
	    object.code = code;
	    console.log(code);
	    $.ajax({
	        url: "/otcdyanmic/wechatGetImg.do",
	        data: { paramMap: JSON.stringify(object) },
	        type: "post",
	        dataType: "json",
	        success: function (data) {
	            console.log(data);
	            if (data != "" && data != null && data != undefined) {
	                //用户获取信息成功
	                if (data.success == true) {
	                    console.log("获取头像成功");
	                    //设置属性
	                    sessionStorage.setItem("avatar", isnull(data.map.imgUrl));

	                    setTimeout(function () {
	                        window.location.href = backtourl;
	                    }, 2000);
	                }
	                //用户获取信息失败
	                if (data.success == false) {

	                    //sessionStorage.setItem("avatar", isnull(data.avatar));
	                    console.log("获取信息失败;");
	                    layer.open({
	                        shade: false,
	                        content: '获取头像失败！',
	                        skin: 'msg',
	                        className: 'tip',
	                        time: 3 //3秒后自动关闭
	                    });
	                }
	            } else {
	                var failetext = "内部异常！请返回重新登录";
	                $("#conter").html(Datafaile(failetext, backtourl));
	            }
	        }.bind(this),
	        error: function () {
	            console.log("2");
	            var failetext = "获取登录信息失败：网络错误！请返回重新登录";
	            $("#conter").html(Datafaile(failetext, backtourl));
	            console.log("获取登录信息失败：网络错误");
	        }.bind(this)
	    });
	}

	//通用日期转换
	/*
	**
	str    要转换的日期
	type   1:yy-MM
	type   2:yy-MM-dd
	type   3:yy-MM-dd HH:mm
	type   4:yy-MM-dd HH:mm:ss
	type   5: HH:mm:ss
	ico  修改中间横杆
	*/
	function dateformdate(str, type, ico) {
	    var datetime = "";
	    var dico = dateico(ico);
	    if (str == null || str == undefined) {
	        return "";
	    } else {
	        var date = str.replace(" ", "_").replace(/([^\u0000-\u00FF])/g, "_").replace(/\-/g, "_").replace(/\//g, "_").split("_");

	        if (type == 1 && date.length >= 2) {
	            var year = date[0];
	            var money = date[1];
	            datetime = year + dico + money;

	            return datetime;
	        }
	        if (type == 2 && date.length >= 3) {
	            var year = date[0];
	            var money = date[1];
	            var day = date[2];
	            datetime = year + dico + money + dico + day;

	            return datetime;
	        }
	        if (type == 3 && date.length >= 4) {
	            var year = date[0];
	            var money = date[1];
	            var day = date[2];
	            var time = dotime(date[3], 3);
	            datetime = year + dico + money + dico + day + " " + time;

	            return datetime;
	        }
	        if (type == 4 && date.length >= 4) {
	            var year = date[0];
	            var money = date[1];
	            var day = date[2];
	            var time = removet(date[3]);
	            datetime = year + dico + money + dico + day + " " + time;

	            return datetime;
	        }
	        if (type == 5 && date.length >= 4) {
	            var year = date[0];
	            var money = date[1];
	            var day = date[2];
	            var time = removet(date[3], 3);
	            datetime = time;

	            return datetime;
	        } else {
	            return str;
	        }
	    }
	}
	//处理图标
	function dateico(t) {

	    if (t == "" || t == null || t == undefined) {
	        return "-";
	    } else {
	        return t;
	    }
	}

	function dotime(str, tp) {
	    var time = removet(str);
	    var timearr = time.split(":");
	    if (tp == "3" && timearr.length >= 2) {
	        return timearr[0] + ":" + timearr[1];
	    } else {
	        return time;
	    }
	}

	//去除时间多余部分
	function removet(s) {
	    var time = "";

	    if (s.indexOf(".") != "-1") {
	        //存在
	        time = s.split(".")[0];
	        return time;
	    } else {
	        time = s;
	        return time;
	    }
	}

	/*
	通用日期转换结束

	*/

	/*
	去除""或undefind null
	*
	*
	*/

	function isnull(str) {
	    if (str == null || str == undefined || str == "undefined") {
	        return "";
	    } else {
	        return str;
	    }
	}

	//判断图片是否存在
	function IsExist(imgurl) {

	    var ImgObj = new Image(); //判断图片是否存在  
	    ImgObj.src = imgurl;
	    //没有图片，则返回-1  
	    if (ImgObj.fileSize > 0 || ImgObj.width > 0 && ImgObj.height > 0) {
	        return true;
	    } else {
	        return false;
	    }
	}

	//判断图片是否为空
	function isnullimg(str) {

	    if (isnull(str) == null) {
	        return dft_img;
	    } else {
	        var firsturl = currturl.split(".")[0];

	        if (istest) {
	            //测试环境
	            return crrentindex.replace("otc", "otcdyanmic") + str.replace("otc", "");
	        } else {
	            return str;
	        }
	    }
	}

	//判断图片是否为空
	function isnullimg1(str) {

	    if (str == null || str == undefined || str == "") {
	        return dft_img;
	    } else {
	        var firsturl = currturl.split(".")[0];

	        if (istest) {
	            //测试环境
	            return crrentindex.replace("otc", "otcdyanmic") + str.replace("otc", "otcdyanmic");
	        } else {
	            return "/otc/" + str;
	        }
	    }
	}

	//判断头像是否为空
	function isnullheadimg(str) {
	    var firsturl = currturl.split(".")[0];
	    if (str == null || str == undefined || str == "") {
	        return dft_headimg;
	    } else {
	        var headimg = istest ? str.replace("otc", "otcdyanmic") : str; //istest为true时为测试环境
	        return headimg;
	    }
	}

	//加零
	function addzerro(str) {
	    if (parseInt(str) < 10) {
	        return "0" + parseInt(str);
	    } else {
	        return parseInt(str);
	    }
	}

	//获取url参数
	function geturl(name) {
	    var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
	    if (reg.test(location.href)) return decodeURI(RegExp.$2.replace(/\+/g, " "));return "";
	};

	//下载
	/*
	function downloadFile() {
	    alert(6);
	    var imgURL = "otcdyanmic/images/u45.png";

	    if (document.all.a1 == null) {
	        objIframe = document.createElement("IFRAME");
	        document.body.insertBefore(objIframe);
	        objIframe.outerHTML = "<iframe name=a1 style='width:400px;hieght:300px' src=" + imageName.href + "></iframe>";
	        re = setTimeout("savepic()", 1)
	    }
	    else {
	        clearTimeout(re)
	        pic = window.open(imageName.href, "a1")
	        pic.document.execCommand("SaveAs")
	        document.all.a1.removeNode(true)
	    }

	}
	*/

	//判断是否可以分页及总共多少页
	function pagey(pagesize, cont, currentpage) {
	    var pageinfo;
	    pagesize = parseInt(pagesize);
	    cont = parseInt(cont);
	    currentpage = parseInt(currentpage);
	    if (cont > pagesize) {
	        //总数大于每页数  分页

	        var z = cont / pagesize;
	        var z1 = cont % pagesize;

	        var pagecont;
	        if (z1 == 0) {
	            pagecont = parseInt(z);
	        }
	        if (z1 > 0) {
	            pagecont = parseInt(z) + 1;
	        }
	        var ispage;

	        if (currentpage < pagecont) {
	            ispage = "true";
	        }
	        if (currentpage >= pagecont) {
	            ispage = "false";
	        }

	        pageinfo = { "pagecont": pagecont, "ispage": ispage };
	        return pageinfo;
	    } else {
	        //一页，不分页

	        $(".showmore").html("");
	        pageinfo = { "pagecont": "1", "ispage": "false" };

	        return pageinfo;
	    }
	}

	//获取当前时间
	function getNowFormatDate() {
	    var date = new Date();
	    var seperator1 = "-";
	    var seperator2 = ":";
	    var month = date.getMonth() + 1;
	    var strDate = date.getDate();
	    if (month >= 1 && month <= 9) {
	        month = "0" + month;
	    }
	    if (strDate >= 0 && strDate <= 9) {
	        strDate = "0" + strDate;
	    }
	    var currentdate = date.getFullYear() + seperator1 + addzerro(month) + seperator1 + addzerro(strDate) + " " + addzerro(date.getHours()) + seperator2 + addzerro(date.getMinutes()) + seperator2 + addzerro(date.getSeconds());
	    return currentdate;
	}

	//获取星期

	//type 1或空时为大写 如星期一，2时为数字
	function getweek(day, type) {
	    //获取星期
	    var arys1 = new Array();
	    arys1 = day.split('-'); //日期为输入日期，格式为 2013-3-10
	    var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);

	    var week1 = String(ssdate.getDay()); //就是你要的星期几
	    var week = week1.replace("0", "星期日").replace("1", "星期一").replace("2", "星期二").replace("3", "星期三").replace("4", "星期四").replace("5", "星期五").replace("6", "星期六");

	    if (type == "2") {
	        return week1;
	    } else {
	        return week;
	    }
	}

	//获取当月最后一天
	function getLastDay(year, month) {
	    var new_year = year; //取当前的年份   
	    var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）   
	    if (month > 12) //如果当前大于12月，则年份转到下一年   
	        {
	            new_month -= 12; //月份减   
	            new_year++; //年份增   
	        }
	    var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天   
	    return new Date(new_date.getTime() - 1000 * 60 * 60 * 24).getDate(); //获取当月最后一天日期   
	}

	//月份小写转大写

	function changecapital(str) {
	    var str2 = String(str);

	    var str1 = str2.replace("10", "十").replace("11", "十一").replace("12", "十二").replace("0", "零").replace("1", "一").replace("2", "二").replace("3", "三").replace("4", "四").replace("5", "五").replace("6", "六").replace("7", "七").replace("8", "八").replace("9", "九");
	    return str1;
	}

	//返回上一页
	function topreurl(str) {

	    var referrerurl = document.referrer; //获取的上一页
	    var currenturl = window.location.href; //获取当前url
	    var prevUrl = sessionStorage.getItem("prevUrl"); //缓存中的上一页


	    if (referrerurl == "") {
	        // alert("0");
	        sessionStorage.setItem("prevUrl", str);
	        return str;
	    }
	    if (referrerurl != "") {

	        if (prevUrl == "undefined" || prevUrl == undefined || prevUrl == "" || prevUrl == null || prevUrl == "null") {
	            sessionStorage.setItem("prevUrl", referrerurl);
	            return referrerurl;
	        } else {
	            var currenturldo = todourl(currenturl); //处理后的当前url
	            var referrerurldo = todourl(referrerurl); //处理后的上一页
	            var prevUrldo = todourl(prevUrl); //处理后的缓存中的上一页

	            if (prevUrldo == currenturldo) {
	                //循环了
	                // alert("1");
	                sessionStorage.setItem("prevUrl", str);
	                return str;
	            }
	            if (prevUrldo != currenturldo) {
	                // alert("2");
	                sessionStorage.setItem("prevUrl", referrerurl);
	                return referrerurl;
	            }
	        }
	    }
	}

	//处理当前url
	function todourl(currturl) {
	    if (currturl.indexOf("?") == "-1") {
	        //不存在
	        if (currturl.indexOf("/") == "-1") {
	            return currturl;
	        } else {
	            var currturl2 = currturl.split("/");
	            return currturl2[currturl2.length - 1];
	        }
	    } else {
	        var currturl1 = currturl.split("?");

	        if (currturl1[0].indexOf("/") == "-1") {
	            return currturl1[0];
	        } else {
	            var currturl3 = currturl1[0].split("/");
	            return currturl3[currturl3.length - 1];
	        }
	    }
	}

	//生成随机数
	/*
	type:1 时生成数字  其他值为数字加字母
	*/
	var chars = [];
	function generateMixed(n, type) {
	    var num = 0;
	    if (isnull(type) == 1) {
	        // 数字
	        chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	        num = 9;
	    } else {
	        //数字加字母  
	        chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	        num = 35;
	    }
	    var res = "";
	    for (var i = 0; i < n; i++) {
	        var id = Math.ceil(Math.random() * num);
	        res += chars[id];
	    }
	    return res;
	}

	//生成时间戳
	function Timestamp() {
	    var datetime = Date.parse(new Date());
	    return datetime / 1000;
	}

	//判断是否是微信
	var is_weixin = function () {
	    //判断微信UA
	    var ua = navigator.userAgent.toLowerCase();
	    if (ua.match(/MicroMessenger/i) == "micromessenger") {
	        return true;
	    } else {
	        return false;
	    }
	}();

	//判断移动端还是电脑端
	var gopage = function () {
	    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
	        return "mobile"; //手机端";
	    } else {
	            return "pc"; //pc端
	        }
	}();

	//获取当天日期
	var gettoday = function gettoday() {

	    var mydate = new Date();
	    var currYear = parseInt(mydate.getFullYear());
	    var currmonth = addzerro(mydate.getMonth() + 1);
	    var currday = addzerro(mydate.getDate());
	    var currdate = currYear + "-" + currmonth + "-" + currday;
	    var gettoday = {
	        "currYear": currYear,
	        "currmonth": currmonth,
	        "currday": currday,
	        "currdate": currdate
	    };

	    return gettoday;
	};

	//删除图片
	function remove(str) {
	    alert(1 + str);
	    var photonums = $(".Upload_photos").find(".imgwarp").length;
	    var dataid = parseInt($(str).parent().parent().find(".imgnum").html());
	    var id = $(str).parent().parent().attr("id");
	    //$("#"+str).find(".imgclose").attr("data-id");
	    console.log(id);
	    if (photonums == 1) {

	        $(str).parent().parent().remove();
	    }
	    if (photonums > 1) {
	        if (dataid == photonums) {
	            //删除最后一个，不用循环

	            $(str).parent().parent().remove();
	        } else {
	            for (i = dataid + 1; i <= photonums; i++) {

	                $(str).parent().parent().remove();
	                $("#products" + i).find("p.imgnum").html(i - 1);
	                $("#products" + i).attr("id", "products" + (i - 1));
	            }
	        }
	    }
	}

	//调用state时显示html
	function createMarkup(str) {
	    return { __html: str };
	}

	//处理图片 判断单张还是多张 多张获取第一张
	function todoimg(str) {
	    //处理图片

	    if (str == "" || str == undefined || str == null) {
	        return "";
	    } else {
	        var imgs = str;
	        //单个
	        if (imgs.indexOf(";") == -1) {
	            //单个

	            return imgs;
	        }
	        //单个结束

	        //多个
	        if (imgs.indexOf(";") > -1) {
	            //多个

	            var imgspits = imgs.split(";");

	            return imgspits[0];
	        }
	        //多个结束
	    }
	    //producephoto

	    //处理图片结束
	}

	/*
	判断字符串长度 (汉字为两个字符)
	*/
	function strlen(str) {
	    var len = 0;
	    for (var i = 0; i < str.length; i++) {
	        var c = str.charCodeAt(i);
	        //单字节加1
	        if (c >= 0x0001 && c <= 0x007e || 0xff60 <= c && c <= 0xff9f) {
	            len++;
	        } else {
	            len += 2;
	        }
	    }
	    return len;
	}

	/* 获取n天以后 */

	function getYestoday(str) {
	    var d = new Date();
	    var beforday = isnull(str) == "" ? "7000" : str * 1000;
	    var yesterday_milliseconds = d.getTime() - beforday * 60 * 60 * 24;
	    var yesterday = new Date();
	    yesterday.setTime(yesterday_milliseconds);
	    var strYear = yesterday.getFullYear();
	    var strDay = yesterday.getDate();
	    var strMonth = yesterday.getMonth() + 1;
	    var datastr = strYear + "-" + (strMonth < 10 ? '0' + strMonth : strMonth) + "-" + (strDay < 10 ? '0' + strDay : strDay);
	    return datastr;
	}

	//通用ajax
	/*
	returnData 传递的参数
	$this   获取当前this
	callback  回调函数
	javaUrl  ajax url链接
	showbox  显示错误信息的div
	backurl  返回上一页的url
	*/
	function ajaxFn(returnData, $this, callback, javaUrl, showbox, backurl, other) {
	    //$this = this
	    $.ajax({
	        type: "post",
	        url: javaUrl,
	        data: { paramMap: JSON.stringify(returnData) },
	        dataType: "json",
	        //async: false,	//false 表示ajax执行完成之后在执行后面的代码
	        success: function success(data) {

	            //数据为空
	            if (isnull(data) == "") {
	                //数据为空
	                showbox.innerHTML = "没有数据";
	                $this.setState({
	                    isload: false,
	                    isclick: true //允许按钮点击
	                });
	                return false;
	            }
	            //数据为空结束

	            //数据不为空时
	            if (isnull(data) != "") {
	                //数据不为空
	                if (data.success) {
	                    callback.call($this, data);

	                    return false;
	                }

	                if (!data.success) {
	                    /*首先判断这个属性，错误在判断原因*/
	                    layer.closeAll();
	                    switch (data.errorCode) {
	                        case 1:
	                            layer.open({
	                                shade: false,
	                                content: '用户未登录或过期，<br>2秒后将自动重新登录',
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 2 //3秒后自动关闭
	                            });
	                            setTimeout(function () {
	                                var dodatate = generateMixed(6); //获取随机数
	                                window.location.href = wxurl(dodatate); //跳转到微信链接
	                            }, 3000);
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 2:
	                            layer.open({
	                                shade: true,
	                                content: "绑定的账号或密码错误！",
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 2 //2秒后自动关闭
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 3:
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 4:
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 5:
	                            layer.open({
	                                shade: true,
	                                content: '相关数据未填写完整！请修改重试',
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 2 //2秒后自动关闭
	                            });

	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 6:
	                            layer.open({
	                                shade: true,
	                                content: '未识别的用户操作类型',
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 2 //2秒后自动关闭
	                            });

	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 7:
	                            showbox.innerHTML = showmsg({
	                                msg: "当前用户没有此操作权限！",
	                                classname: "",
	                                isbtn: true,
	                                url: backurl,
	                                btntext: "立即返回"
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 8:
	                            showbox.innerHTML = showmsg({
	                                msg: "请求参数出现异常！",
	                                classname: "",
	                                isbtn: true,
	                                url: backurl,
	                                btntext: "立即返回"
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 9:
	                            layer.open({
	                                shade: true,
	                                content: '相关数据未填写完整！请修改重试',
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 2 //2秒后自动关闭
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            //Modal.info({ title: '提示：', content: '相关数据未填写完整，请检查！' });
	                            break;
	                        case 11:
	                            layer.open({
	                                shade: true,
	                                content: '登录发生异常！请返回重新登录',
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 2 //2秒后自动关闭
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 12:
	                            showbox.innerHTML = showmsg({
	                                msg: "当前账号已停用！",
	                                classname: "",
	                                isbtn: true,
	                                url: backurl,
	                                btntext: "立即返回"
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 150:
	                            layer.open({
	                                shade: true,
	                                content: '相关信息不存在',
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 2 //2秒后自动关闭
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });

	                            break;
	                        case 151:
	                            layer.open({
	                                shade: true,
	                                content: "此用户已经绑定过其他微信！不能再进行绑定！",
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 2 //2秒后自动关闭
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 152:
	                            if (isnull(sessionStorage.getItem("OpenID")) == "") {
	                                sessionStorage.setItem("OpenID", isnull(data.openId));
	                            }
	                            layer.open({
	                                shade: true,
	                                content: '此微信号未绑定！2秒后自动跳转到绑定页面！',
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 2 //2秒后自动关闭
	                            });
	                            setTimeout(function () {
	                                window.location.href = "login.html"; //前往绑定页面
	                            }, 2000);
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 163:
	                            layer.open({
	                                shade: true,
	                                content: '"非“驳回”或“未提交”状态不能操作！',
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 2 //2秒后自动关闭
	                            });
	                            setTimeout(function () {
	                                $("#dl_" + other).removeClass('selected');
	                            }, 3000);
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 164:
	                            layer.open({
	                                shade: false,
	                                content: '已存在审核通过计划，不能再次新增！',
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 3 //3秒后自动关闭
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 169:
	                            var dodatate = generateMixed(6); //获取随机数
	                            var backloginurl = wxurl();
	                            showbox.innerHTML = showmsg({
	                                msg: "用户已过期，请返回重新登录！",
	                                classname: "",
	                                isbtn: true,
	                                url: backloginurl,
	                                btntext: "立即返回"
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 170:
	                            layer.open({
	                                shade: true,
	                                content: "此用户已经与微信号绑定过,请直接登录！",
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 2 //2秒后自动关闭
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 171:
	                            layer.open({
	                                shade: true,
	                                content: "内部异常，请重新绑定！",
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 2 //2秒后自动关闭
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                        case 172:
	                            //存在未签出的拜访计划！
	                            layer.open({
	                                shade: false,
	                                content: '存在未签出的拜访计划！',
	                                skin: 'msg',
	                                className: 'tip',
	                                time: 3 //3秒后自动关闭
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true });
	                            break;
	                        default:
	                            showbox.innerHTML = showmsg({
	                                msg: "出现系统异常，请联系管理员！",
	                                classname: "",
	                                isbtn: true,
	                                url: backurl,
	                                btntext: "立即返回"
	                            });
	                            $this.setState({
	                                isload: false,
	                                isclick: true //允许按钮点击
	                            });
	                            break;
	                    } //switch结束
	                    // return false;
	                }
	            }
	            //数据不为空时结束 
	        },
	        error: function error(jqXHR, textStatus, errorThrown) {
	            layer.closeAll();

	            var Datafailed = "";
	            console.log("textStatus:" + textStatus);
	            console.log("errorThrown:" + errorThrown);
	            switch (textStatus) {
	                case "timeout":
	                    showbox.innerHTML = showmsg({
	                        msg: "获取信息失败，网络超时，请检查你的网络是否连接正常！",
	                        classname: "",
	                        isbtn: true,
	                        showimg: "../images/mobile/nonetwork.png"
	                    });
	                    $this.setState({
	                        isload: false,
	                        isclick: true //允许按钮点击
	                    });
	                    break;

	                default:
	                    showbox.innerHTML = showmsg({
	                        msg: "出现系统异常，请检查你的网络是否连接正常！",
	                        classname: "",
	                        isbtn: true
	                    });
	                    $this.setState({
	                        isload: false,
	                        isclick: true //允许按钮点击
	                    });
	                    break;
	            }
	            // console.log("错误信息：" + textStatus);
	        }
	    });
	    return true;
	}

/***/ },

/***/ 90:
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

/***/ 91:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

/******/ });