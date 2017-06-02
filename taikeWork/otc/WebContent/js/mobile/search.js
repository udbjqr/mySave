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

	var _searchBar = __webpack_require__(97);

	var _searchBar2 = _interopRequireDefault(_searchBar);

	var _Videosharemain = __webpack_require__(95);

	var _Videosharemain2 = _interopRequireDefault(_Videosharemain);

	var _informationfilemain = __webpack_require__(145);

	var _informationfilemain2 = _interopRequireDefault(_informationfilemain);

	var _Photosharemain = __webpack_require__(94);

	var _Photosharemain2 = _interopRequireDefault(_Photosharemain);

	var _testproductsmain = __webpack_require__(189);

	var _testproductsmain2 = _interopRequireDefault(_testproductsmain);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var OpenID = "ojpX_jig-gyi3_Q9fHXQ4rdHniQs";
	var currturl = window.location.href; //获取当前url

	//获取上一页


	//获取上一页结束
	var Search = _react2.default.createClass({
	  displayName: 'Search',

	  getInitialState: function getInitialState() {
	    return {
	      Y_login: true, //是否登录
	      value: '',
	      referrer: document.referrer, //上一页
	      Columns: geturl('Columns'),
	      imgtype: geturl('imgtype'),
	      custom_id: geturl('custom_id'),
	      plan_id: geturl('plan_id'),
	      searchval: "请输入搜索内容1"
	    };
	  },

	  componentWillMount: function componentWillMount() {},
	  componentDidMount: function componentDidMount() {
	    var Columns = this.state.Columns;
	    if (Columns == "Videoshare") {

	      this.setState({
	        referrer: topreurl("Videoshare.html"), //上一页 
	        searchval: "请输入搜索的视频名"

	      });
	    }
	    if (Columns == "informationfile") {
	      this.setState({
	        referrer: topreurl("informationfile.html"), //上一页
	        searchval: "请输入搜索的文件名"
	      });
	    }
	    if (Columns == "Photoshare") {

	      this.setState({
	        referrer: topreurl("Photoshare.html"), //上一页
	        searchval: "请输入搜索的图片名"
	      });
	    }

	    if (Columns == "testproducts") {
	      var parenturl = "testproducts.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id;
	      this.setState({
	        referrer: topreurl(parenturl), //上一页
	        searchval: "请输入搜索的考核产品名"
	      });
	    }
	  },

	  onChange: function onChange(value) {
	    this.setState({ value: value });
	  },
	  clear: function clear() {
	    this.setState({ value: '' });
	  },
	  onSubmit: function onSubmit() {
	    var searchinfo;
	    var searchname = this.state.value;
	    var imgtype = this.state.imgtype;
	    searchinfo = {
	      "searchname": searchname,
	      "imgtype": imgtype
	    };

	    PubSub.publish('changsearch', searchinfo);
	  },
	  render: function render() {
	    var showinfo;
	    var Columns = this.state.Columns;
	    if (Columns == "Videoshare") {

	      showinfo = _react2.default.createElement(_Videosharemain2.default, null);
	    }
	    if (Columns == "informationfile") {
	      showinfo = _react2.default.createElement(_informationfilemain2.default, null);
	    }
	    if (Columns == "Photoshare") {
	      showinfo = _react2.default.createElement(_Photosharemain2.default, null);
	    }

	    if (Columns == "testproducts") {
	      showinfo = _react2.default.createElement(_testproductsmain2.default, null);
	    }

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
	        _react2.default.createElement(
	          'div',
	          { className: 'searchipt_cont' },
	          _react2.default.createElement(_searchBar2.default, {
	            className: 'searchipt white',
	            id: 'prct_search',
	            name: 'prct_search',
	            value: this.state.value,
	            placeholder: this.state.searchval,
	            onSubmit: this.onSubmit,
	            onClear: function onClear(value) {
	              return console.log(value, 'onClear');
	            },
	            onFocus: function onFocus() {
	              return console.log('onFocus');
	            },
	            onBlur: function onBlur() {
	              return console.log('onBlur');
	            },
	            showCancelButton: false,
	            onChange: this.onChange
	          })
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'profile margint_1r', id: '' },
	        showinfo
	      )
	    );
	  }
	});

	ReactDOM.render(_react2.default.createElement(Search, null), document.getElementById('conter'));

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = React;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ReactDOM;

/***/ },
/* 3 */,
/* 4 */
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
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(7);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(8), __esModule: true };

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9);
	var $Object = __webpack_require__(12).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(10);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(20), 'Object', {defineProperty: __webpack_require__(16).f});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(11)
	  , core      = __webpack_require__(12)
	  , ctx       = __webpack_require__(13)
	  , hide      = __webpack_require__(15)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 11 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 12 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(14);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(16)
	  , createDesc = __webpack_require__(24);
	module.exports = __webpack_require__(20) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(17)
	  , IE8_DOM_DEFINE = __webpack_require__(19)
	  , toPrimitive    = __webpack_require__(23)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(20) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(20) && !__webpack_require__(21)(function(){
	  return Object.defineProperty(__webpack_require__(22)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(21)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 21 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18)
	  , document = __webpack_require__(11).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(18);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 25 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(27);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(28);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(64);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(29), __esModule: true };

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(30);
	__webpack_require__(59);
	module.exports = __webpack_require__(63).f('iterator');

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(31)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(34)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(32)
	  , defined   = __webpack_require__(33);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 33 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(35)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(36)
	  , hide           = __webpack_require__(15)
	  , has            = __webpack_require__(37)
	  , Iterators      = __webpack_require__(38)
	  , $iterCreate    = __webpack_require__(39)
	  , setToStringTag = __webpack_require__(55)
	  , getPrototypeOf = __webpack_require__(57)
	  , ITERATOR       = __webpack_require__(56)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(15);

/***/ },
/* 37 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(40)
	  , descriptor     = __webpack_require__(24)
	  , setToStringTag = __webpack_require__(55)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(15)(IteratorPrototype, __webpack_require__(56)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(17)
	  , dPs         = __webpack_require__(41)
	  , enumBugKeys = __webpack_require__(53)
	  , IE_PROTO    = __webpack_require__(50)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(22)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(54).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(16)
	  , anObject = __webpack_require__(17)
	  , getKeys  = __webpack_require__(42);

	module.exports = __webpack_require__(20) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(43)
	  , enumBugKeys = __webpack_require__(53);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(37)
	  , toIObject    = __webpack_require__(44)
	  , arrayIndexOf = __webpack_require__(47)(false)
	  , IE_PROTO     = __webpack_require__(50)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(45)
	  , defined = __webpack_require__(33);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(46);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(44)
	  , toLength  = __webpack_require__(48)
	  , toIndex   = __webpack_require__(49);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(32)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(32)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(51)('keys')
	  , uid    = __webpack_require__(52);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(11)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 52 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11).document && document.documentElement;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(16).f
	  , has = __webpack_require__(37)
	  , TAG = __webpack_require__(56)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(51)('wks')
	  , uid        = __webpack_require__(52)
	  , Symbol     = __webpack_require__(11).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(37)
	  , toObject    = __webpack_require__(58)
	  , IE_PROTO    = __webpack_require__(50)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(33);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(60);
	var global        = __webpack_require__(11)
	  , hide          = __webpack_require__(15)
	  , Iterators     = __webpack_require__(38)
	  , TO_STRING_TAG = __webpack_require__(56)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(61)
	  , step             = __webpack_require__(62)
	  , Iterators        = __webpack_require__(38)
	  , toIObject        = __webpack_require__(44);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(34)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 61 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 62 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(56);

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(65), __esModule: true };

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(66);
	__webpack_require__(77);
	__webpack_require__(78);
	__webpack_require__(79);
	module.exports = __webpack_require__(12).Symbol;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(11)
	  , has            = __webpack_require__(37)
	  , DESCRIPTORS    = __webpack_require__(20)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(36)
	  , META           = __webpack_require__(67).KEY
	  , $fails         = __webpack_require__(21)
	  , shared         = __webpack_require__(51)
	  , setToStringTag = __webpack_require__(55)
	  , uid            = __webpack_require__(52)
	  , wks            = __webpack_require__(56)
	  , wksExt         = __webpack_require__(63)
	  , wksDefine      = __webpack_require__(68)
	  , keyOf          = __webpack_require__(69)
	  , enumKeys       = __webpack_require__(70)
	  , isArray        = __webpack_require__(73)
	  , anObject       = __webpack_require__(17)
	  , toIObject      = __webpack_require__(44)
	  , toPrimitive    = __webpack_require__(23)
	  , createDesc     = __webpack_require__(24)
	  , _create        = __webpack_require__(40)
	  , gOPNExt        = __webpack_require__(74)
	  , $GOPD          = __webpack_require__(76)
	  , $DP            = __webpack_require__(16)
	  , $keys          = __webpack_require__(42)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(75).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(72).f  = $propertyIsEnumerable;
	  __webpack_require__(71).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(35)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(15)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(52)('meta')
	  , isObject = __webpack_require__(18)
	  , has      = __webpack_require__(37)
	  , setDesc  = __webpack_require__(16).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(21)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(11)
	  , core           = __webpack_require__(12)
	  , LIBRARY        = __webpack_require__(35)
	  , wksExt         = __webpack_require__(63)
	  , defineProperty = __webpack_require__(16).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(42)
	  , toIObject = __webpack_require__(44);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(42)
	  , gOPS    = __webpack_require__(71)
	  , pIE     = __webpack_require__(72);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 71 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 72 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(46);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(44)
	  , gOPN      = __webpack_require__(75).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(43)
	  , hiddenKeys = __webpack_require__(53).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(72)
	  , createDesc     = __webpack_require__(24)
	  , toIObject      = __webpack_require__(44)
	  , toPrimitive    = __webpack_require__(23)
	  , has            = __webpack_require__(37)
	  , IE8_DOM_DEFINE = __webpack_require__(19)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(20) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 77 */
/***/ function(module, exports) {

	

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(68)('asyncIterator');

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(68)('observable');

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(81);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(85);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(27);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(82), __esModule: true };

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(83);
	module.exports = __webpack_require__(12).Object.setPrototypeOf;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(10);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(84).set});

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(18)
	  , anObject = __webpack_require__(17);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(13)(Function.call, __webpack_require__(76).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(86), __esModule: true };

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(87);
	var $Object = __webpack_require__(12).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(10)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(40)});

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  Copyright (c) 2016 Jed Watson.
	  Licensed under the MIT License (MIT), see
	  http://jedwatson.github.io/classnames
	*/
	/* global define */

	(function () {
		'use strict';

		var hasOwn = {}.hasOwnProperty;

		function classNames () {
			var classes = [];

			for (var i = 0; i < arguments.length; i++) {
				var arg = arguments[i];
				if (!arg) continue;

				var argType = typeof arg;

				if (argType === 'string' || argType === 'number') {
					classes.push(arg);
				} else if (Array.isArray(arg)) {
					classes.push(classNames.apply(null, arg));
				} else if (argType === 'object') {
					for (var key in arg) {
						if (hasOwn.call(arg, key) && arg[key]) {
							classes.push(key);
						}
					}
				}
			}

			return classes.join(' ');
		}

		if (typeof module !== 'undefined' && module.exports) {
			module.exports = classNames;
		} else if (true) {
			// register as 'classnames', consistent with npm package name
			!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
				return classNames;
			}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else {
			window.classNames = classNames;
		}
	}());


/***/ },
/* 89 */
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
/* 90 */
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
/* 91 */
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

/***/ },
/* 92 */,
/* 93 */,
/* 94 */
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

	var url = "/otcdyanmic/documents.do";

	var currturl = window.location.href; //获取当前url
	var Photoshare = _react2.default.createClass({
	    displayName: 'Photoshare',

	    getInitialState: function getInitialState() {
	        return {
	            Y_login: true, //是否登录
	            referrer: topreurl("index.html"), //上一页
	            Columns: isnull(geturl('Columns')),
	            imgtype: "证书图片", //切换栏目
	            value: '',
	            isload: false,
	            moreload: false,
	            isclick: true,
	            page: "",
	            isnextpage: "",
	            showtype: 1
	        };
	    },
	    componentDidMount: function componentDidMount() {

	        if (this.state.Columns != "Photoshare") {
	            //搜索不显示初始值
	            var imgtype = this.state.imgtype;
	            var value = this.state.value;
	            this.getinfo(1, 1, imgtype, value);
	            var $this = this;
	            setTimeout(function () {
	                if ($this.state.isload == true && $this.state.moreload == false) {
	                    $this.refs.photoshar.innerHTML = loading;
	                }
	            }, 500);
	        }

	        $("#photoshar").delegate('#loadmore', 'click', function () {

	            $this.setState({
	                moreload: true
	            });

	            setTimeout(function () {

	                if ($this.state.moreload == true && $this.state.isload == false) {
	                    $("#loadmore").html(loadingmore);
	                    //$this.refs.loadmore.innerHTML = loadingmore;
	                }
	            }, 500);

	            $this.loadmore();
	        });
	        var width = document.body.scrollWidth;

	        $(".fancybox-thumbs").fancybox({
	            width: "300",
	            height: "600",
	            overlayOpacity: "0.9",
	            overlayColor: "#333",
	            overlayShow: true,
	            showCloseButton: true,
	            transitionIn: 'elastic', //窗口显示的方式 
	            transitionOut: 'elastic',
	            autoScale: true,
	            showNavArrows: true,
	            titlePosition: 'inside',
	            centerOnScroll: true
	        });
	        //接收搜索数据
	        this.pubsub_token = PubSub.subscribe('changsearch', function (topic, newItem) {
	            this.setState({
	                value: newItem.searchname,
	                imgtype: newItem.imgtype
	            });
	            this.onSubmit();
	        }.bind(this));
	        //接收搜索数据
	    },
	    //清除接收搜索数据
	    componentWillUnmount: function componentWillUnmount() {
	        PubSub.unsubscribe(this.pubsub_token);
	    },
	    switnav: function switnav(event) {
	        if (this.state.isclick) {

	            var nav_id = event.target.getAttribute("id");
	            $("#" + nav_id).attr("class", "switnav_current").siblings(".switnav span").removeAttr("class", "switnav_current");
	            var navcolumns = $("#" + nav_id).attr("data-name");
	            this.setState({
	                imgtype: navcolumns, //切换栏目
	                value: '',
	                isclick: false,
	                isload: true
	            });
	            ajaxdong("正在加载信息...", this);
	            var value = this.state.value;
	            this.getinfo(1, 1, navcolumns, value);
	        }
	    },

	    onChange: function onChange(value) {
	        this.setState({ value: value });
	    },
	    clear: function clear() {
	        this.setState({ value: '' });
	    },
	    //搜索
	    onSubmit: function onSubmit() {
	        var $this = this;
	        var searchname = this.state.value;
	        _layer2.default.open({
	            content: "搜索中",
	            shade: true,
	            skin: 'msg',
	            className: 'tip'
	        });

	        //设置是搜索还是查询
	        if (searchname == "") {
	            this.setState({
	                showtype: 1
	            });
	        } else {
	            this.setState({
	                showtype: 2
	            });
	        }
	        //设置是搜索还是查询结束


	        var imgtype = this.state.imgtype;
	        //this.refs.photoshar.innerHTML = "";
	        setTimeout(function () {
	            if ($this.state.isclick) {
	                $this.setState({ //禁止点击
	                    isclick: false
	                });
	                $this.getinfo(2, 1, imgtype, searchname);
	            }
	        }, 1000);
	    },

	    //showtype  1 显示信息   2 搜索信息
	    loadmore: function loadmore() {
	        var currentpage = parseInt(this.state.page) + 1;
	        console.log("当前页" + currentpage);
	        var imgtype = this.state.imgtype;
	        this.getinfo(1, currentpage, imgtype, this.state.value);
	    },

	    getinfo: function getinfo(showtype, currentpage, imgtype, name) {
	        var object = new Object();
	        object.openId = OpenID;
	        object.controlType = "query";
	        object.category = "";
	        object.documentType = "2";
	        object.pageSize = pagesize;
	        object.pageNumber = currentpage;
	        object.category = imgtype;
	        object.name = name;
	        $.ajax({
	            url: url,
	            data: { paramMap: JSON.stringify(object) },
	            type: "post",
	            dataType: "json",
	            success: function (data) {
	                if (this.isMounted()) {
	                    if (data != "" && data != null && data != undefined) {
	                        //获取图片信息成功
	                        if (data.success == true) {
	                            if (showtype == 2) {
	                                _layer2.default.closeAll();
	                                $("input").blur();
	                            }
	                            console.log("获取图片成功");
	                            var flielist = "";

	                            if (data.map.documentsList != "" && data.map.documentsList != null && data.map.documentsList != undefined) {
	                                var filedata = data.map.documentsList;
	                                var count = data.map.count; //总数
	                                //判断是否分页
	                                var pageinfo = pagey(pagesize, count, currentpage);
	                                var pagecont = pageinfo["pagecont"]; //页数
	                                var ispage = pageinfo["ispage"]; //是否有下一页
	                                //判断是否分页结束
	                                this.setState({
	                                    isload: false,
	                                    moreload: false,
	                                    page: currentpage,
	                                    isclick: true
	                                });
	                                for (var i = 0; i < filedata.length; i++) {
	                                    var tumbnailsUrl = isnullimg(filedata[i].tumbnailsUrl);
	                                    var documentName = isnull(filedata[i].documentName);
	                                    var updateTime = dateformdate(filedata[i].updateTime, 2);
	                                    var url = filedata[i].url;
	                                    flielist += '<dl class="white infofile profile_pading  photolistwrap">';

	                                    flielist += ' <dt class="infovideoimg">';
	                                    flielist += '<a href="' + url + '" class="fancybox-thumbs" data-fancybox-group="thumb"><img  src="' + tumbnailsUrl + '" /></a>';
	                                    flielist += '</dt>';
	                                    flielist += '<dd class="infofilert">';
	                                    flielist += '<h2>';
	                                    flielist += '<a href="' + url + '" class="fancybox-thumbs" data-fancybox-group="thumb">';
	                                    flielist += documentName;
	                                    flielist += '</a>';
	                                    flielist += '</h2>';
	                                    flielist += '<p class="photoinfom">';
	                                    flielist += '<em>';
	                                    flielist += '<a href="' + url + '" class="fancybox-thumbs" data-fancybox-group="thumb">';
	                                    flielist += '更新时间：' + updateTime;
	                                    flielist += '</a>';
	                                    flielist += '</em>';
	                                    flielist += '<span class="downphoto"><a href="' + url + '" >下载到手机</a><span>';
	                                    flielist += '</p>';
	                                    flielist += '</dd>';
	                                    flielist += '</dl>';
	                                }
	                                //this.refs.photoshar.innerHTML=flielist;
	                                //判断加载更多内容
	                                var loadmore = '';

	                                if (ispage == "true") {

	                                    loadmore = '<p ref="loadmore" class="loadmore" id="loadmore">加载更多</p>';
	                                } else {
	                                    if (currentpage == 1) {
	                                        loadmore = '';
	                                    } else {
	                                        loadmore = '<p ref="loadmore" class="loadmore" id="nomore">没有更多了</p>';
	                                    }
	                                }
	                                //判断加载更多内容结束

	                                //加载内容

	                                if (currentpage == 1) {
	                                    $("#photoshar").html(flielist + loadmore); //首次直接覆盖
	                                } else {
	                                    $(".loadmore").remove();
	                                    $("#photoshar").append(flielist + loadmore);
	                                }
	                                //加载内容结束  
	                                _layer2.default.closeAll();
	                                this.setState({
	                                    isclick: true
	                                });
	                            } else {
	                                this.setState({
	                                    isload: false,
	                                    moreload: false,
	                                    isclick: true
	                                });
	                                if (showtype == 1) {
	                                    this.refs.photoshar.innerHTML = "<P class='nodata'>没有找到数据</p>";
	                                    $("#photoshar").removeClass("pro_border");
	                                }
	                                if (showtype == 2) {
	                                    _layer2.default.closeAll();
	                                    $("input").blur();
	                                    this.refs.photoshar.innerHTML = "<P class='nodata'>没有找到你要搜索的记录</p>";
	                                    $("#photoshar").removeClass("pro_border");
	                                }
	                            }
	                        }
	                        //获取图片失败
	                        if (data.success == false) {
	                            _layer2.default.closeAll();
	                            //未登录
	                            if (data.errorCode == "1") {
	                                var dodatate = generateMixed(6);
	                                window.location.href = wxurl(dodatate);
	                            }
	                            //未登录结束
	                            if (this.state.moreload == true) {

	                                $("#loadmore").html("加载失败，点击重新加载");
	                            } else {
	                                if (data.errorCode == "7") {
	                                    this.refs.photoshar.innerHTML = Datafaile("当前用户没有此操作权限！");
	                                } else {
	                                    this.refs.photoshar.innerHTML = Datafailed;
	                                    $("#photoshar").removeClass("pro_border");
	                                }
	                            }

	                            console.log("获取图片失败");
	                            this.setState({
	                                isload: false,
	                                moreload: false,
	                                isclick: true
	                            });
	                            if (showtype == 2) {
	                                _layer2.default.closeAll();
	                                $("input").blur();
	                            }
	                        }
	                    }
	                } // this.isMounted() End
	            }.bind(this),
	            error: function () {
	                if (this.isMounted()) {
	                    _layer2.default.closeAll();
	                    if (this.state.moreload == true) {
	                        this.setState({
	                            isclick: true
	                        });
	                        $("#loadmore").html("加载失败，点击重新加载");
	                    } else {
	                        this.refs.photoshar.innerHTML = Datafailed1;
	                        $("#photoshar").removeClass("pro_border");
	                        this.setState({
	                            isclick: true
	                        });
	                    }
	                    this.refs.showmore.innerHTML = "";
	                    console.log("获取图片失败：网络错误");
	                    this.setState({
	                        isload: false,
	                        moreload: false,
	                        isclick: true
	                    });
	                    if (showtype == 2) {
	                        $("input").blur();
	                    }
	                }
	            }.bind(this)
	        });
	    },
	    render: function render() {
	        var imgtype = this.state.imgtype;
	        var $this = this;
	        var topmain_show = function topmain_show() {
	            return _react2.default.createElement(
	                'div',
	                { className: 'profile white', id: 'pagenav' },
	                _react2.default.createElement(
	                    'span',
	                    { className: 'toleft' },
	                    ' ',
	                    _react2.default.createElement('a', { href: $this.state.referrer })
	                ),
	                '\u56FE\u7247\u5171\u4EAB',
	                _react2.default.createElement(
	                    'span',
	                    { className: 'search_ico' },
	                    _react2.default.createElement('a', { href: "search.html?Columns=Photoshare&imgtype=" + imgtype })
	                )
	            );
	        };

	        var switnav_show = function switnav_show() {
	            return _react2.default.createElement(
	                'div',
	                { className: 'switnav' },
	                _react2.default.createElement(
	                    'span',
	                    { className: 'switnav_current', 'data-name': '\u8BC1\u4E66\u56FE\u7247', id: 'switnav1', onTouchStart: $this.switnav },
	                    '\u8BC1\u4E66\u56FE\u7247'
	                ),
	                _react2.default.createElement(
	                    'span',
	                    { 'data-name': '\u5BA3\u4F20\u6D3B\u52A8', id: 'switnav2', onTouchStart: $this.switnav },
	                    '\u5BA3\u4F20\u56FE\u7247'
	                ),
	                _react2.default.createElement(
	                    'span',
	                    { 'data-name': '\u5458\u5DE5\u98CE\u91C7', id: 'switnav3', onTouchStart: $this.switnav },
	                    '\u5458\u5DE5\u98CE\u91C7'
	                )
	            );
	        };
	        var topmain = this.state.Columns == "Photoshare" ? "" : topmain_show();
	        var switnavmain = this.state.Columns == "Photoshare" ? "" : switnav_show();

	        return _react2.default.createElement(
	            'div',
	            null,
	            topmain,
	            _react2.default.createElement(
	                'div',
	                { ref: 'content' },
	                switnavmain,
	                _react2.default.createElement('div', { className: 'profile marginb_1r ', id: 'photoshar', ref: 'photoshar' })
	            )
	        );
	    }
	});

	module.exports = Photoshare;

/***/ },
/* 95 */
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

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var url = "/otcdyanmic/documents.do";
	var Videoshare = _react2.default.createClass({
	    displayName: 'Videoshare',

	    getInitialState: function getInitialState() {
	        return {
	            Y_login: true, //是否登录
	            referrer: topreurl("index.html"), //上一页
	            isload: true,
	            moreload: false,
	            page: "",
	            isnextpage: "",
	            searchname: "",
	            showtype: "1",
	            Columns: isnull(geturl('Columns')),
	            isclick: true,
	            searchpage: "0"

	        };
	    },
	    componentDidMount: function componentDidMount() {
	        var $this = this;
	        if (this.state.Columns != "Videoshare") {
	            //搜索不显示初始值
	            this.getinfo(1, 1, this.state.value);
	            setTimeout(function () {
	                if ($this.state.isload == true && $this.state.moreload == false) {
	                    $this.refs.videolist.innerHTML = loading;
	                }
	            }, 500);
	        }

	        $("#videolist").delegate('#loadmore', 'click', function () {

	            $this.setState({
	                moreload: true
	            });

	            setTimeout(function () {

	                if ($this.state.moreload == true && $this.state.isload == false) {
	                    $("#loadmore").html(loadingmore);
	                    //$this.refs.loadmore.innerHTML = loadingmore;
	                }
	            }, 500);

	            $this.loadmore();
	        });

	        //接收搜索数据
	        this.pubsub_token = PubSub.subscribe('changsearch', function (topic, newItem) {
	            this.setState({
	                value: newItem.searchname
	            });
	            this.onSubmit();
	        }.bind(this));
	        //接收搜索数据
	    },
	    //清除接收搜索数据
	    componentWillUnmount: function componentWillUnmount() {
	        PubSub.unsubscribe(this.pubsub_token);
	    },
	    onChange: function onChange(value) {
	        this.setState({ value: value });
	    },
	    clear: function clear() {
	        this.setState({ value: '' });
	    },
	    //搜索
	    onSubmit: function onSubmit() {
	        var $this = this;
	        var searchname = this.state.value;
	        _layer2.default.open({
	            content: "搜索中",
	            shade: false,
	            skin: 'msg',
	            className: 'tip'
	        });

	        //设置是搜索还是查询
	        if (searchname == "") {
	            this.setState({
	                showtype: 1
	            });
	        } else {
	            this.setState({
	                showtype: 2
	            });
	        }
	        //设置是搜索还是查询结束


	        this.refs.videolist.innerHTML = "";
	        setTimeout(function () {
	            if ($this.state.isclick) {
	                $this.setState({ //禁止点击
	                    isclick: false
	                });
	                $this.getinfo(2, 1, searchname);
	            }
	        }, 1000);
	    },

	    loadmore: function loadmore() {
	        var currentpage = parseInt(this.state.page) + 1;
	        console.log("当前页" + currentpage);

	        this.getinfo(1, currentpage, this.state.value);
	    },

	    //获取数据
	    getinfo: function getinfo(showtype, currentpage, name) {
	        var object = new Object();
	        object.openId = OpenID;
	        object.controlType = "query";
	        object.category = "";
	        object.documentType = "3";
	        object.pageSize = pagesize;
	        object.pageNumber = currentpage;
	        object.name = name;
	        $.ajax({
	            url: url,
	            data: { paramMap: JSON.stringify(object) },
	            type: "post",
	            dataType: "json",
	            success: function (data) {
	                if (this.isMounted()) {
	                    if (data != "" && data != null && data != undefined) {
	                        //获取用户默认信息成功
	                        if (data.success == true) {
	                            if (showtype == 2) {
	                                _layer2.default.closeAll();
	                                $("input").blur();
	                            }
	                            console.log("获取视频成功");
	                            var videolist = "";

	                            if (data.map.documentsList != "" && data.map.documentsList != null && data.map.documentsList != undefined) {
	                                var count = data.map.count; //总数
	                                //判断是否分页
	                                var pageinfo = pagey(pagesize, count, currentpage);
	                                var pagecont = pageinfo["pagecont"]; //页数
	                                var ispage = pageinfo["ispage"]; //是否有下一页
	                                //判断是否分页结束
	                                this.setState({
	                                    isload: false,
	                                    moreload: false,
	                                    page: currentpage,
	                                    isclick: true

	                                });
	                                var videodata = data.map.documentsList;
	                                for (var i = 0; i < videodata.length; i++) {

	                                    var url = isnull(videodata[i].url);
	                                    var tumbnailsUrl = isnullimg(videodata[i].tumbnailsUrl);
	                                    var documentName = isnull(videodata[i].documentName);
	                                    var updateTime = dateformdate(videodata[i].updateTime, 2);
	                                    var uploadEmployee = isnull(videodata[i].uploadEmployee);
	                                    videolist += '<dl class="white infofile">';
	                                    videolist += '<a href="' + url + '" class="profile_pading">';
	                                    videolist += ' <dt class="infovideoimg">';
	                                    videolist += '<img  src="' + tumbnailsUrl + '" />';
	                                    videolist += '</dt>';
	                                    videolist += '<dd class="infofilert">';
	                                    videolist += '<h2>' + documentName + '</h2>';
	                                    videolist += '<em>上传时间：' + updateTime + '</em>';
	                                    videolist += '<p>来源：' + uploadEmployee + '</p>';
	                                    videolist += '</dd>';
	                                    videolist += ' </a>';
	                                    videolist += '</dl>';
	                                }
	                                //this.refs.videolist.innerHTML = videolist;
	                                //判断加载更多内容
	                                var loadmore = '';

	                                if (ispage == "true") {

	                                    loadmore = '<p ref="loadmore" class="loadmore" id="loadmore">加载更多</p>';
	                                } else {
	                                    if (currentpage == 1) {
	                                        loadmore = '';
	                                    } else {
	                                        loadmore = '<p ref="loadmore" class="loadmore" id="nomore">没有更多了</p>';
	                                    }
	                                }
	                                //判断加载更多内容结束

	                                //加载内容

	                                if (currentpage == 1) {
	                                    $("#videolist").html(videolist + loadmore); //首次直接覆盖
	                                } else {
	                                    $(".loadmore").remove();
	                                    $("#videolist").append(videolist + loadmore);
	                                }
	                                //加载内容结束  

	                            } else {

	                                if (showtype == 1) {
	                                    this.refs.videolist.innerHTML = "<P class='nodata'>没有找到数据</p>";
	                                    $("#videolist").removeClass("bordert_1r");
	                                }
	                                if (showtype == 2) {
	                                    _layer2.default.closeAll();
	                                    $("input").blur();
	                                    this.refs.videolist.innerHTML = "<P class='nodata'>没有找到你要搜索的记录</p>";
	                                }

	                                this.setState({
	                                    isload: false,
	                                    moreload: false,
	                                    isclick: true
	                                });
	                            }
	                        }
	                        //获取用户默认信息失败
	                        if (data.success == false) {
	                            //未登录
	                            if (data.errorCode == "1") {
	                                var dodatate = generateMixed(6);
	                                window.location.href = wxurl(dodatate);
	                            }
	                            //未登录结束
	                            console.log("获取视频失败");

	                            if (this.state.moreload == true) {

	                                $("#loadmore").html("加载失败，点击重新加载");
	                            } else {
	                                if (data.errorCode == "7") {
	                                    this.refs.videolist.innerHTML = Datafaile("当前用户没有此操作权限！");
	                                } else {
	                                    this.refs.videolist.innerHTML = Datafailed;
	                                }
	                            }

	                            if (showtype == 2) {
	                                _layer2.default.closeAll();
	                                $("input").blur();
	                            }
	                            $("#videolist").removeClass("bordert_1r");
	                            this.setState({
	                                isload: false,
	                                moreload: false,
	                                isclick: true
	                            });
	                        }
	                    }
	                } // this.isMounted() End
	            }.bind(this),
	            error: function () {
	                if (this.isMounted()) {
	                    if (this.state.moreload == true) {
	                        $("#loadmore").html("加载失败，点击重新加载");
	                    } else {
	                        this.refs.videolist.innerHTML = Datafailed1;
	                    }
	                    console.log("获取视频失败：网络错误");
	                    if (showtype == 2) {
	                        _layer2.default.closeAll();
	                        $("input").blur();
	                    }
	                    $("#videolist").removeClass("bordert_1r");
	                    this.setState({
	                        isload: false,
	                        moreload: false,
	                        isclick: true
	                    });
	                }
	            }.bind(this)
	        });
	    },
	    render: function render() {
	        var $this = this;
	        var topmain_show = function topmain_show() {
	            return _react2.default.createElement(
	                'div',
	                { className: 'profile white', id: 'pagenav' },
	                _react2.default.createElement(
	                    'span',
	                    { className: 'toleft' },
	                    ' ',
	                    _react2.default.createElement('a', { href: $this.state.referrer })
	                ),
	                '\u89C6\u9891\u5171\u4EAB',
	                _react2.default.createElement(
	                    'span',
	                    { className: 'search_ico' },
	                    _react2.default.createElement('a', { href: "search.html?Columns=Videoshare" })
	                )
	            );
	        };
	        var topmain = this.state.Columns == "Videoshare" ? "" : topmain_show();
	        return _react2.default.createElement(
	            'div',
	            null,
	            topmain,
	            _react2.default.createElement('div', _defineProperty({ ref: 'videolist', className: 'profile margint_1r ', id: 'videolist' }, 'ref', 'videolist'))
	        );
	    }
	});
	module.exports = Videoshare;

/***/ },
/* 96 */,
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports["default"] = undefined;

	var _defineProperty2 = __webpack_require__(6);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _classCallCheck2 = __webpack_require__(25);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(26);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(80);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _classnames = __webpack_require__(88);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _SearchBarPropTypes = __webpack_require__(98);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var SearchBar = function (_React$Component) {
	    (0, _inherits3["default"])(SearchBar, _React$Component);

	    function SearchBar(props) {
	        (0, _classCallCheck3["default"])(this, SearchBar);

	        var _this = (0, _possibleConstructorReturn3["default"])(this, _React$Component.call(this, props));

	        _this.onSubmit = function (e) {
	            e.preventDefault();
	            _this.props.onSubmit(_this.state.value);
	        };
	        _this.onChange = function (e) {
	            var value = e.target.value;
	            if (!('value' in _this.props)) {
	                _this.setState({ value: value });
	            }
	            _this.props.onChange(value);
	        };
	        _this.onFocus = function (e) {
	            _this.setState({
	                focus: true
	            });
	            _this.props.onFocus(e);
	        };
	        _this.onBlur = function (e) {
	            _this.setState({
	                focus: false
	            });
	            _this.props.onBlur(e);
	        };
	        _this.onClear = function () {
	            if (!('value' in _this.props)) {
	                _this.setState({ value: '' });
	            }
	            _this.refs.searchInput.focus();
	            _this.props.onClear('');
	            _this.props.onChange('');
	        };
	        _this.onCancel = function () {
	            if (_this.props.onCancel) {
	                _this.props.onCancel(_this.state.value);
	            } else {
	                _this.onClear();
	            }
	            _this.refs.searchInput.blur();
	        };
	        var value = void 0;
	        if ('value' in props) {
	            value = props.value;
	        } else if ('defaultValue' in props) {
	            value = props.defaultValue;
	        } else {
	            value = '';
	        }
	        _this.state = {
	            value: value,
	            focus: false
	        };
	        return _this;
	    }

	    SearchBar.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	        if ('value' in nextProps) {
	            this.setState({
	                value: nextProps.value
	            });
	        }
	    };

	    SearchBar.prototype.componentDidMount = function componentDidMount() {
	        if (/U3/i.test(navigator.userAgent)) {
	            this.initialInputContainerWidth = this.refs.searchInputContainer.offsetWidth;
	            if (this.props.showCancelButton) {
	                this.refs.searchInputContainer.style.width = this.refs.searchInputContainer.offsetWidth - 41 * (window.devicePixelRatio || 1) + 'px';
	            }
	        }
	    };

	    SearchBar.prototype.render = function render() {
	        var _classNames, _classNames2, _classNames3;

	        var _props = this.props;
	        var prefixCls = _props.prefixCls;
	        var showCancelButton = _props.showCancelButton;
	        var disabled = _props.disabled;
	        var placeholder = _props.placeholder;
	        var cancelText = _props.cancelText;
	        var className = _props.className;
	        var _state = this.state;
	        var value = _state.value;
	        var focus = _state.focus;

	        var wrapCls = (0, _classnames2["default"])((_classNames = {}, (0, _defineProperty3["default"])(_classNames, '' + prefixCls, true), (0, _defineProperty3["default"])(_classNames, prefixCls + '-start', showCancelButton || focus), (0, _defineProperty3["default"])(_classNames, className, className), _classNames));
	        var containerStyle = {};
	        if (/U3/i.test(navigator.userAgent)) {
	            if (this.initialInputContainerWidth) {
	                if (showCancelButton || focus) {
	                    containerStyle = {
	                        width: this.initialInputContainerWidth - 41 * (window.devicePixelRatio || 1) + 'px'
	                    };
	                } else {
	                    containerStyle = {
	                        width: this.initialInputContainerWidth + 'px'
	                    };
	                }
	            }
	        }
	        var clearCls = (0, _classnames2["default"])((_classNames2 = {}, (0, _defineProperty3["default"])(_classNames2, prefixCls + '-clear', true), (0, _defineProperty3["default"])(_classNames2, prefixCls + '-clear-show', focus && value.length > 0), _classNames2));
	        var cancelCls = (0, _classnames2["default"])((_classNames3 = {}, (0, _defineProperty3["default"])(_classNames3, prefixCls + '-cancel', true), (0, _defineProperty3["default"])(_classNames3, prefixCls + '-all-cancel', showCancelButton), _classNames3));
	        return React.createElement(
	            'form',
	            { onSubmit: this.onSubmit, className: wrapCls },
	            React.createElement(
	                'div',
	                { ref: 'searchInputContainer', className: prefixCls + '-input', style: containerStyle },
	                React.createElement('input', { type: 'search', className: prefixCls + '-value', value: value, disabled: disabled, placeholder: placeholder, onChange: this.onChange, onFocus: this.onFocus, onBlur: this.onBlur, ref: 'searchInput' }),
	                React.createElement('a', { onClick: this.onClear, className: clearCls })
	            ),
	            React.createElement(
	                'div',
	                { className: cancelCls, onClick: this.onCancel },
	                cancelText
	            )
	        );
	    };

	    return SearchBar;
	}(React.Component);

	exports["default"] = SearchBar;

	SearchBar.propTypes = _SearchBarPropTypes.propTypes;
	SearchBar.defaultProps = _SearchBarPropTypes.defaultProps;
	module.exports = exports['default'];

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.defaultProps = exports.propTypes = undefined;

	var _react = __webpack_require__(1);

	function noop() {}
	var propTypes = exports.propTypes = {
	    prefixCls: _react.PropTypes.string,
	    style: _react.PropTypes.object,
	    defaultValue: _react.PropTypes.string,
	    value: _react.PropTypes.string,
	    placeholder: _react.PropTypes.string,
	    onSubmit: _react.PropTypes.func,
	    onChange: _react.PropTypes.func,
	    onFocus: _react.PropTypes.func,
	    onBlur: _react.PropTypes.func,
	    onCancel: _react.PropTypes.func,
	    onClear: _react.PropTypes.func,
	    showCancelButton: _react.PropTypes.bool,
	    cancelText: _react.PropTypes.string,
	    disabled: _react.PropTypes.bool
	};
	var defaultProps = exports.defaultProps = {
	    prefixCls: 'am-search',
	    placeholder: '',
	    onSubmit: noop,
	    onChange: noop,
	    onFocus: noop,
	    onBlur: noop,
	    onClear: noop,
	    showCancelButton: false,
	    cancelText: '取消',
	    disabled: false
	};

/***/ },
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */,
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */,
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */
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

	var url = "/otcdyanmic/documents.do";
	var isplayNum = 0;
	var Informationfile = _react2.default.createClass({
	    displayName: 'Informationfile',

	    getInitialState: function getInitialState() {
	        return {
	            Y_login: true, //是否登录
	            isclick: true,
	            referrer: topreurl("index.html"), //上一页
	            value: isnull(this.props.value),
	            isload: false,
	            moreload: false,
	            page: "",
	            isnextpage: "",
	            json: [],
	            showtype: 1,
	            playbegintime: "",
	            playendtime: "",
	            Columns: isnull(geturl('Columns'))
	        };
	    },
	    componentDidMount: function componentDidMount() {
	        var $this = this;
	        if (this.state.Columns != "informationfile") {
	            //搜索不显示初始值
	            this.getinfo(1, 1, this.state.value);
	            setTimeout(function () {
	                if ($this.state.isload == true && $this.state.moreload == false) {
	                    $this.refs.flielist.innerHTML = loading;
	                }
	            }, 500);
	        }

	        $("#flielist").delegate('#loadmore', 'click', function () {

	            $this.setState({
	                moreload: true
	            });

	            setTimeout(function () {

	                if ($this.state.moreload == true && $this.state.isload == false) {
	                    $("#loadmore").html(loadingmore);
	                    //$this.refs.loadmore.innerHTML = loadingmore;
	                }
	            }, 500);

	            $this.loadmore();
	        });

	        //接收搜索数据
	        this.pubsub_token = PubSub.subscribe('changsearch', function (topic, newItem) {
	            this.setState({
	                value: newItem.searchname
	            });
	            this.onSubmit();
	        }.bind(this));
	        //接收搜索数据   
	    },
	    //清除接收搜索数据
	    componentWillUnmount: function componentWillUnmount() {
	        PubSub.unsubscribe(this.pubsub_token);
	    },

	    //搜索
	    onSubmit: function onSubmit() {
	        var $this = this;
	        var searchname = this.state.value;

	        _layer2.default.open({
	            content: "搜索中",
	            shade: false,
	            skin: 'msg',
	            className: 'tip'
	        });

	        //设置是搜索还是查询
	        if (searchname == "") {
	            this.setState({
	                showtype: 1,
	                json: []
	            });
	        } else {
	            this.setState({
	                showtype: 2,
	                json: []
	            });
	        }
	        //设置是搜索还是查询结束


	        setTimeout(function () {
	            if ($this.state.isclick) {
	                $this.setState({ //禁止点击
	                    isclick: false
	                });
	                $this.getinfo(2, 1, searchname);
	            }
	        }, 1000);
	    },
	    //showtype  1 显示信息   2 搜索信息
	    loadmore: function loadmore() {
	        var currentpage = parseInt(this.state.page) + 1;
	        console.log("当前页" + currentpage);

	        this.getinfo(1, currentpage, this.state.value);
	    },

	    getinfo: function getinfo(showtype, currentpage, name) {
	        var object = new Object();
	        object.openId = OpenID;
	        object.controlType = "query";
	        object.category = "";
	        object.documentType = "1";
	        object.pageSize = pagesize;
	        object.pageNumber = currentpage;
	        object.name = name;
	        $.ajax({
	            url: url,
	            data: { paramMap: JSON.stringify(object) },
	            type: "post",
	            dataType: "json",
	            success: function (data) {
	                if (this.isMounted()) {
	                    if (data != "" && data != null && data != undefined) {

	                        //获取文件信息成功
	                        if (data.success == true) {
	                            if (showtype == 2) {
	                                _layer2.default.closeAll();
	                                $("input").blur();
	                            }
	                            console.log("获取文件成功");
	                            isplayNum = 0;

	                            var flielist = "";
	                            var flieCount = data.count; //文件数
	                            if (data.map.documentsList != "" && data.map.documentsList != null && data.map.documentsList != undefined) {
	                                var count = data.map.count; //总数
	                                //判断是否分页
	                                var pageinfo = pagey(pagesize, count, currentpage);
	                                var pagecont = pageinfo["pagecont"]; //页数
	                                var ispage = pageinfo["ispage"]; //是否有下一页
	                                //判断是否分页结束
	                                this.setState({
	                                    isload: false,
	                                    moreload: false,
	                                    page: currentpage,
	                                    json: data.map.documentsList,
	                                    isclick: true
	                                });

	                                var filedata = data.map.documentsList;

	                                //this.refs.flielist.innerHTML = flielist;
	                                //判断加载更多内容
	                                var loadmore = '';

	                                if (ispage == "true") {

	                                    loadmore = '<p ref="loadmore" class="loadmore" id="loadmore">加载更多</p>';
	                                } else {
	                                    if (currentpage == 1) {
	                                        loadmore = '';
	                                    } else {
	                                        loadmore = '<p ref="loadmore" class="loadmore" id="nomore">没有更多了</p>';
	                                    }
	                                }
	                                //判断加载更多内容结束

	                                //加载内容

	                                if (currentpage == 1) {
	                                    // $("#flielist").html(flielist + loadmore);   //首次直接覆盖
	                                } else {
	                                    $(".loadmore").remove();
	                                    // $("#flielist").append(flielist + loadmore);
	                                }
	                                //加载内容结束  
	                            } else {
	                                this.setState({
	                                    isload: false,
	                                    moreload: false,
	                                    isclick: true
	                                });
	                                if (showtype == 1) {

	                                    this.refs.flielist.innerHTML = "<P class='nodata'>没有找到数据</p>";
	                                }
	                                if (showtype == 2) {

	                                    $("input").blur();
	                                    this.refs.flielist.innerHTML = "<P class='nodata'>没有找到你要搜索的记录</p>";
	                                }
	                                _layer2.default.closeAll();
	                                $("#filelist").removeClass("bordert_1r");
	                            }
	                        }
	                        //获取文件失败
	                        if (data.success == false) {
	                            //未登录
	                            _layer2.default.closeAll();
	                            if (data.errorCode == "1") {
	                                var dodatate = generateMixed(6);
	                                window.location.href = wxurl(dodatate);
	                            }
	                            //未登录结束
	                            if (this.state.moreload == true) {

	                                $("#loadmore").html("加载失败，点击重新加载");
	                            } else {
	                                if (data.errorCode == "7") {
	                                    this.refs.flielist.innerHTML = Datafaile("当前用户没有此操作权限！");
	                                } else {
	                                    this.refs.flielist.innerHTML = Datafailed;
	                                }
	                            }
	                            $("#filelist").removeClass("bordert_1r");
	                            console.log("获取文件失败");
	                            this.setState({
	                                isload: false,
	                                moreload: false,
	                                isclick: true
	                            });
	                        }
	                    }
	                } // this.isMounted() End
	            }.bind(this),
	            error: function () {

	                if (this.isMounted()) {
	                    _layer2.default.closeAll();
	                    if (this.state.moreload == true) {

	                        $("#loadmore").html("加载失败，点击重新加载");
	                    } else {
	                        this.refs.flielist.innerHTML = Datafailed1;
	                    }
	                    $("#filelist").removeClass("bordert_1r");
	                    console.log("获取文件失败：网络错误");
	                    this.setState({
	                        isload: false,
	                        moreload: false,
	                        isclick: true
	                    });
	                }
	            }.bind(this)
	        });
	    },

	    //点击播放停止
	    isplay: function isplay(event) {
	        var $this = this;
	        event.preventDefault();
	        var playtype = event.currentTarget.dataset.playtype;
	        var id = event.currentTarget.dataset.id;
	        var planflies = event.currentTarget.dataset.link;
	        var fileid = event.currentTarget.dataset.id;
	        var educateId = event.currentTarget.dataset.educateid;
	        console.log("educateid:" + educateId + "--isplayNum:" + isplayNum);
	        if (playtype == "toplay") {
	            if (isplayNum == 0) {
	                _layer2.default.open({
	                    content: "是否确认开始演示",
	                    btn: ['确认', '取消'],
	                    yes: function (index) {
	                        _layer2.default.close(index);
	                        console.log(fileid);
	                        $this.playajax(1, $this, fileid, planflies, educateId); //点击播放信息
	                    }.bind(this)
	                });
	            } else {
	                _layer2.default.open({
	                    shade: true,
	                    content: "你还有文件正在播放，请先停止再播放",
	                    skin: 'msg',
	                    className: 'tip',
	                    time: 2 //3秒后自动关闭
	                });
	            }
	        }
	        if (playtype == "tostop") {
	            _layer2.default.open({
	                content: "是否确认停止演示",
	                btn: ['确认', '取消'],
	                yes: function (index) {
	                    _layer2.default.close(index);
	                    console.log(fileid);
	                    $this.playajax(2, $this, fileid, planflies, educateId); //点击停止播放
	                }.bind(this)
	            });
	        }
	    }, /* 播放停止ajax   str  1:播放  0：停止*/
	    playajax: function playajax(str, This, fileid, planflies, educateId) {
	        str = isnull(str) == "" ? 1 : str;
	        if (This.state.isclick) {
	            This.setState({ //禁止点击
	                isload: true,
	                isclick: false
	            });
	            var controlType = str == 1 ? "addEducate" : "updateEducate";
	            var timeStype = str == 1 ? "play_start_time" : "play_end_time";
	            var tipText = str == 1 ? "播放成功正在为你跳转文件" : "停止播放成功";

	            str == 0 ? ajaxdong("正在停止播放...", This) : "";

	            var object = new Object();
	            object.controlType = controlType;
	            str == 1 ? object.document_id = fileid : object.educate_id = educateId;
	            object[timeStype] = getNowFormatDate(); //播放结束时间
	            var referrer = This.state.referrer;
	            var showbox = This.refs.content;
	            ajaxFn(object, This, function (data) {
	                _layer2.default.open({
	                    shade: true,
	                    content: tipText,
	                    skin: 'msg',
	                    className: 'tip',
	                    time: 2 //3秒后自动关闭
	                });
	                setTimeout(function () {
	                    isplayNum = str == 1 ? 0 : isplayNum;
	                    str == 1 ? window.location.href = planflies : This.getinfo(This.state.showtype, 1, This.state.value);
	                    This.setState({
	                        isload: false,
	                        isclick: true
	                    });
	                }, 2000);
	            }, "/otcdyanmic/documents.do", showbox, referrer);
	        }
	    },
	    render: function render() {
	        var $this = this;
	        var topmain_show = function topmain_show() {
	            return _react2.default.createElement(
	                'div',
	                { className: 'profile white', id: 'pagenav' },
	                _react2.default.createElement(
	                    'span',
	                    { className: 'toleft' },
	                    ' ',
	                    _react2.default.createElement('a', { href: $this.state.referrer })
	                ),
	                '\u8D44\u6599\u6587\u4EF6',
	                _react2.default.createElement(
	                    'span',
	                    { className: 'search_ico' },
	                    _react2.default.createElement('a', { href: "search.html?Columns=informationfile" })
	                )
	            );
	        };
	        var topmain = this.state.Columns == "informationfile" ? "" : topmain_show();

	        return _react2.default.createElement(
	            'div',
	            null,
	            topmain,
	            _react2.default.createElement(
	                'div',
	                { ref: 'content' },
	                _react2.default.createElement(
	                    'div',
	                    { className: 'profile margint_1r ', id: 'flielist', ref: 'flielist' },
	                    this.state.json.map(function (obj, i) {
	                        isplayNum = isnull(obj.educate_id) == "" ? isplayNum : isplayNum + 1;
	                        var isPlaying = isnull(obj.educate_id) == "" ? false : true;
	                        var playtypeText = isPlaying ? "停止播放" : "开始播放";
	                        var playtypeState = isPlaying ? "tostop" : "toplay";
	                        var playClass = isPlaying ? "tostop" : "toplay";
	                        return _react2.default.createElement(
	                            'dl',
	                            { className: 'white infofile filelists', key: i },
	                            _react2.default.createElement(
	                                'div',
	                                { className: "isplay " + playClass, id: "files" + obj.id, 'data-link': isnull(obj.url), 'data-id': obj.id, 'data-educateId': isnull(obj.educate_id), 'data-playtype': playtypeState, ref: 'isplay', onTouchEnd: $this.isplay },
	                                playtypeText
	                            ),
	                            _react2.default.createElement(
	                                'a',
	                                { href: 'javascript:void(0)', download: isnull(obj.url), className: 'profile_pading' },
	                                _react2.default.createElement(
	                                    'dt',
	                                    { className: 'infovideoimg' },
	                                    _react2.default.createElement('img', { src: isnullimg(obj.tumbnailsUrl) })
	                                ),
	                                _react2.default.createElement(
	                                    'dd',
	                                    { className: 'infofilert' },
	                                    _react2.default.createElement(
	                                        'h2',
	                                        null,
	                                        isnull(obj.documentName)
	                                    ),
	                                    _react2.default.createElement(
	                                        'em',
	                                        { className: 'fileTime' },
	                                        '\u4E0A\u4F20\u65F6\u95F4\uFF1A',
	                                        dateformdate(obj.updateTime, 2)
	                                    )
	                                )
	                            )
	                        );
	                    })
	                )
	            )
	        );
	    }
	});

	module.exports = Informationfile;

/***/ },
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */
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

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var url = "/otcdyanmic/goodsMobile.do";
	var currturl = window.location.href; //获取当前url
	var singintype = geturl('singintype');
	var daydate = geturl('day'); //走访时间
	var parenturl = "CustomerDetails.html?custom_id=" + geturl('custom_id') + "&plan_id=" + geturl('plan_id') + "&day=" + daydate; //上一页
	var Testproducts = _react2.default.createClass({
	    displayName: 'Testproducts',

	    getInitialState: function getInitialState() {
	        return {
	            Y_login: true, //是否登录
	            referrer: topreurl(parenturl), //上一页
	            custom_id: geturl('custom_id'),
	            plan_id: geturl('plan_id'),
	            isload: false,
	            isclick: true,
	            Columns: isnull(geturl('Columns'))
	        };
	    },
	    componentDidMount: function componentDidMount() {

	        var $this = this;
	        if (this.state.Columns != "testproducts") {
	            //搜索不显示初始值
	            setTimeout(function () {
	                if ($this.state.isload == true) {
	                    $this.refs.testpt_list.innerHTML = loading;
	                }
	            }, 500);
	            this.getinfo();
	        }

	        //接收搜索数据
	        this.pubsub_token = PubSub.subscribe('changsearch', function (topic, newItem) {
	            this.setState({
	                value: newItem.searchname
	            });
	            this.onSubmit();
	        }.bind(this));
	        //接收搜索数据   
	    },

	    //清除接收搜索数据
	    componentWillUnmount: function componentWillUnmount() {
	        PubSub.unsubscribe(this.pubsub_token);
	    },
	    //搜索
	    onSubmit: function onSubmit() {
	        var $this = this;
	        var searchname = this.state.value;
	        _layer2.default.open({
	            content: "搜索中",
	            shade: false,
	            skin: 'msg',
	            className: 'tip'
	        });

	        //设置是搜索还是查询
	        if (searchname == "") {
	            this.setState({
	                showtype: 1
	            });
	        } else {
	            this.setState({
	                showtype: 2
	            });
	        }
	        //设置是搜索还是查询结束


	        this.refs.testpt_list.innerHTML = "";
	        setTimeout(function () {
	            if ($this.state.isclick) {
	                $this.setState({ //禁止点击
	                    isclick: false
	                });
	                $this.getinfo(searchname);
	            }
	        }, 1000);
	    },
	    //获取初始数据
	    getinfo: function getinfo(name) {
	        var a = [a];
	        var object = new Object();
	        object.openId = OpenID;
	        object.controlType = "queryAll";
	        object.customer_id = this.state.custom_id;
	        object.plan_id = this.state.plan_id;
	        object.goodName = name;
	        $.ajax({
	            url: url,
	            data: { paramMap: JSON.stringify(object) },
	            type: "post",
	            dataType: "json",
	            success: function (data) {
	                if (this.isMounted()) {
	                    if (data != "" && data != null && data != undefined) {
	                        //获取库存信息成功 
	                        if (data.success == true) {
	                            console.log("获取获取信息成功");
	                            this.setState({
	                                isclick: true,
	                                isload: false
	                            });
	                            _layer2.default.closeAll();
	                            $("input").blur();
	                            $(".loading").remove();

	                            if (data.map.list != "" && data.map.list != null && data.map.list != undefined) {
	                                var clientdata = data.map.list;

	                                for (var i = 0; i < clientdata.length; i++) {
	                                    var id = clientdata[i].id;
	                                    var visits_id = data.map.visits_id;
	                                    var imgUrl = isnullimg1(todoimg(isnull(clientdata[i].imgUrl))); //图片地址
	                                    var goodsName = isnull(clientdata[i].goodsName); //产品名
	                                    var supplierName = isnull(clientdata[i].supplierName); //供应商
	                                    var goodsId = isnull(clientdata[i].goodsId); //供应商
	                                    var supplierId = isnull(clientdata[i].supplierId); //供应商
	                                    var specification = isnull(clientdata[i].specification); //规格
	                                    var isStock = clientdata[i].isStock; //是否盘点
	                                    var checktext = "";
	                                    if (isStock == "0") {
	                                        checktext = "";
	                                    } else {
	                                        checktext = '<img  src="../images/mobile/15kh.png" class="ischeck">';
	                                    }

	                                    if (a.toString().indexOf(supplierId) > -1) {
	                                        var clientlist = "";
	                                        clientlist += '<dl class="white infofile toico">';
	                                        clientlist += '<a href="productarticle.html?goodsName=' + goodsName + '&goods_id=' + id + '&visits_id=' + visits_id + '&plan_id=' + this.state.plan_id + '&custom_id=' + this.state.custom_id + '&singintype=' + singintype + '&day=' + daydate + '" class="profile_pading">';
	                                        clientlist += '<dt class="testp_img">';
	                                        clientlist += '<div class="productimgwrap">';
	                                        clientlist += '<img  src="' + imgUrl + '" class="testphoto" />' + checktext;
	                                        clientlist += '</div>';
	                                        clientlist += '</dt>';
	                                        clientlist += '<dd>';
	                                        clientlist += '<h2 class="testp_name">' + goodsName + '</h2>';
	                                        // clientlist += '<em class="supplier">供应商：' + supplierName + '</em>';
	                                        clientlist += '<p class="specification">规格：' + specification + '</p>';
	                                        clientlist += '</dd>';
	                                        clientlist += '</a>';
	                                        clientlist += '</dl>';

	                                        $("#pro_" + supplierId).append(clientlist);

	                                        //存在
	                                    }

	                                    if (a.toString().indexOf(supplierId) == -1) {
	                                        //不存在
	                                        a.push(supplierId);
	                                        var clientlist1 = "";
	                                        clientlist1 += ' <h1 class="testptTitle white borderb_1r  ">' + supplierName + '</h1>';
	                                        clientlist1 += '<div class="profile " id="pro_' + supplierId + '">';
	                                        clientlist1 += '<dl class="white infofile toico">';
	                                        clientlist1 += '<a href="productarticle.html?goodsName=' + goodsName + '&goods_id=' + id + '&visits_id=' + visits_id + '&plan_id=' + this.state.plan_id + '&custom_id=' + this.state.custom_id + '&singintype=' + singintype + '&day=' + daydate + '" class="profile_pading">';
	                                        clientlist1 += '<dt class="testp_img">';
	                                        clientlist1 += '<div class="productimgwrap">';
	                                        clientlist1 += '<img  src="' + imgUrl + '" class="testphoto" />' + checktext;
	                                        clientlist1 += '</div>';
	                                        clientlist1 += '</dt>';
	                                        clientlist1 += '<dd>';
	                                        clientlist1 += '<h2 class="testp_name">' + goodsName + '</h2>';
	                                        // clientlist1 += '<em class="supplier">供应商：' + supplierName + '</em>';
	                                        clientlist1 += '<p class="specification">规格：' + specification + '</p>';
	                                        clientlist1 += '</dd>';
	                                        clientlist1 += '</a>';
	                                        clientlist1 += '</dl>';
	                                        clientlist1 += '</div>';
	                                        $(".testpt_list").append(clientlist1);

	                                        //this.refs.testpt_list.appendchild(clientlist)
	                                    }
	                                }
	                            } else {
	                                this.setState({
	                                    isclick: true,
	                                    isload: false
	                                });

	                                this.refs.testpt_list.innerHTML = Datafaile("暂时没有数据", "", "", "", "0");
	                            }

	                            _layer2.default.closeAll();
	                        }
	                        //获取获取信息失败
	                        if (data.success == false) {
	                            //未登录
	                            _layer2.default.closeAll();
	                            if (data.errorCode == "1") {
	                                var dodatate = generateMixed(6);
	                                window.location.href = wxurl(dodatate);
	                            }
	                            //未登录结束
	                            this.setState({
	                                isclick: true,
	                                isload: false
	                            });

	                            this.refs.testpt_list.innerHTML = Datafailed;
	                            console.log("获取获取信息失败:" + data.msg);
	                        }
	                    }
	                } // this.isMounted() End
	            }.bind(this),
	            error: function (jqXHR, textStatus, errorThrown) {
	                if (this.isMounted()) {
	                    _layer2.default.closeAll();
	                    this.setState({
	                        isclick: true,
	                        isload: false
	                    });
	                    this.refs.testpt_list.innerHTML = Datafailed1;
	                    console.log("获取获取信息失败：网络错误");
	                }
	            }.bind(this)
	        });
	    },
	    render: function render() {
	        var _React$createElement;

	        var $this = this;
	        var topmain_show = function topmain_show() {
	            return _react2.default.createElement(
	                'div',
	                { className: 'profile white', id: 'pagenav' },
	                _react2.default.createElement(
	                    'span',
	                    { className: 'toleft' },
	                    ' ',
	                    _react2.default.createElement('a', { href: $this.state.referrer })
	                ),
	                '\u8003\u6838\u4EA7\u54C1',
	                _react2.default.createElement(
	                    'span',
	                    { className: 'search_ico' },
	                    _react2.default.createElement('a', { href: "search.html?Columns=testproducts&custom_id=" + $this.state.custom_id + "&plan_id=" + $this.state.plan_id + "&day=" + daydate + "&singintype=" + singintype })
	                )
	            );
	        };
	        var topmain = this.state.Columns == "testproducts" ? "" : topmain_show();

	        return _react2.default.createElement(
	            'div',
	            null,
	            topmain,
	            _react2.default.createElement('div', (_React$createElement = { className: 'profile' }, _defineProperty(_React$createElement, 'className', 'testpt_list marginb_1r'), _defineProperty(_React$createElement, 'id', 'testpt_list'), _defineProperty(_React$createElement, 'ref', 'testpt_list'), _React$createElement))
	        );
	    }
	});

	module.exports = Testproducts;

/***/ }
/******/ ]);