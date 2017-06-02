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

	var _saveproducts = __webpack_require__(179);

	var _saveproducts2 = _interopRequireDefault(_saveproducts);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// unStuck  true: 1 <Saveproducts />   false: 2 <Productarticle />  0:没有签到

	var url = "/otcdyanmic/appraisals.do?v=" + generateMixed(5);
	var currturl = window.location.href; //获取当前url
	var singintype = geturl('singintype'); //登录状态
	var daydate = geturl('day'); //走访时间

	var parenturl = "testproducts.html?custom_id=" + geturl('custom_id') + "&plan_id=" + geturl('plan_id') + "&singintype=" + singintype + "&day=" + daydate;
	var Product = _react2.default.createClass({
	  displayName: 'Product',

	  getInitialState: function getInitialState() {
	    return {
	      Y_login: true, //是否登录
	      referrer: topreurl(parenturl), //上一页
	      files: [],
	      goodsName: isnull(geturl('goodsName')), //产品名
	      custom_id: isnull(geturl('custom_id')),
	      plan_id: isnull(geturl('plan_id')),
	      visits_id: isnull(geturl('visits_id')),
	      goods_id: isnull(geturl('goods_id')),
	      remark: "",
	      unStuck: "3",
	      isclick: true
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    //获取初始数据

	    var visitsId = isnull(this.state.visits_id);

	    if (visitsId == "") {

	      var backval = "testproducts.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate;
	      var tosigninurl = "signin.html?custom_id=" + this.state.custom_id + "&plan_id=" + this.state.plan_id + "&day=" + daydate + "&backtp=1";

	      this.refs.productart_list.innerHTML = showmsg({
	        msg: "你还没有签到，请先签到再考核", //显示的信息,
	        isbtn: true, //是否显示按钮,
	        url: tosigninurl, //点击按钮时的跳转链接 为空时为刷新,
	        showimg: "", //错误图片,
	        btntext: "前往签到页面", //按钮文字,
	        classname: "" });

	      //var $this=this;

	      return false;
	    }

	    if (visitsId != "") {

	      var object = new Object();
	      object.openId = OpenID;
	      object.controlType = "stockInit";
	      object.goods_id = this.state.goods_id;
	      object.visits_id = this.state.visits_id;
	      object.custom_id = this.state.custom_id;
	      $.ajax({
	        url: url,
	        data: { paramMap: JSON.stringify(object) },
	        type: "post",
	        dataType: "json",
	        success: function (data) {
	          if (this.isMounted()) {
	            if (data != "" && data != null && data != undefined) {
	              //获取默认信息成功
	              if (data.success == true) {
	                console.log("获取信息成功");
	                this.setState({
	                  unStuck: data.map.unStuck
	                });

	                if (data.map.info != "" && data.map.info != null && data.map.info != undefined) {
	                  var datainfo = data.map.info;
	                  var produpub;
	                  produpub = {
	                    "unStuck": data.map.unStuck,
	                    "detail_id": isnull(datainfo.detail_id), //产品id //产品名
	                    "purchase_source": isnull(datainfo.purchase_source), //进货来源
	                    "display_surface": isnull(datainfo.display_surface), //陈列面
	                    "weighted_price": isnull(datainfo.weighted_price), //加价权
	                    "purchase_number": isnull(datainfo.purchase_number), //进货数量
	                    "tag_price": isnull(datainfo.tag_price), //标签价
	                    "image_urls": isnull(datainfo.image_urls), //图片
	                    "display_number": isnull(datainfo.display_number), //陈列数
	                    "real_stock": isnull(datainfo.real_stock), //实际库存 
	                    //"shop_point":isnull(datainfo.shop_point),               //铺点数
	                    //"sail_total":isnull(datainfo.sail_total),            // 销售额
	                    "remark": isnull(datainfo.remark),
	                    "batch_number": isnull(datainfo.batch_number) //批号

	                  };
	                  PubSub.publish('changprodupub', produpub);
	                } else {

	                  _react2.default.createElement(
	                    'p',
	                    { className: 'nodata' },
	                    '\u9875\u9762\u6CA1\u6709\u4FE1\u606F'
	                  );
	                }
	              }
	              //获取信息失败
	              if (data.success == false) {
	                //未登录
	                if (data.errorCode == "1") {
	                  var dodatate = generateMixed(6);
	                  window.location.href = wxurl(dodatate);
	                }
	                //未登录结束
	                this.refs.productart_list.innerHTML = '<p class="nodata">获取信息失败</p>';

	                console.log("获取信息失败:" + data.msg);
	              }
	            }
	          } // this.isMounted() End
	        }.bind(this),
	        error: function (jqXHR, textStatus, errorThrown) {
	          if (this.isMounted()) {
	            this.refs.productart_list.innerHTML = '<p class="nodata">获取信息失败,请检查你的网络是否正常</p>';

	            console.log("获取信息失败：网络错误");
	          }
	        }.bind(this)
	      });
	    }
	  },
	  back: function back() {
	    window.location.href = this.state.referrer;
	  },

	  render: function render() {
	    var $this = this;
	    var unStuck = this.state.unStuck;
	    if (unStuck == true) {

	      if (singintype == "alreadySign") {

	        var tips = showmsg({
	          msg: "此门店已经签出，不能再修改添加考核产品", //显示的信息,
	          isbtn: true, //是否显示按钮,
	          url: $this.state.referrer, //点击按钮时的跳转链接 为空时为刷新,
	          showimg: "", //错误图片,
	          btntext: "返回上一页", //按钮文字,
	          classname: "" });
	        return _react2.default.createElement('div', { dangerouslySetInnerHTML: createMarkup(tips) });
	      }
	      //未签出
	      else {
	          return _react2.default.createElement(
	            'div',
	            null,
	            this.state.unStuck,
	            _react2.default.createElement(_saveproducts2.default, null)
	          );
	        }
	    }
	    if (unStuck == false) {
	      return _react2.default.createElement(
	        'div',
	        null,
	        this.state.unStuck,
	        _react2.default.createElement(Productarticle, null),
	        _react2.default.createElement('div', { ref: 'productart_list' })
	      );
	    }
	    if (unStuck == "3") {
	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'profile white', id: 'pagenav' },
	          _react2.default.createElement(
	            'span',
	            { className: 'toleft' },
	            _react2.default.createElement('a', { href: this.state.referrer })
	          ),
	          this.state.goodsName
	        ),
	        _react2.default.createElement('div', { ref: 'productart_list' })
	      );
	    }
	  }

	});

	var Productarticle = _react2.default.createClass({
	  displayName: 'Productarticle',

	  getInitialState: function getInitialState() {
	    return {
	      Y_login: true, //是否登录
	      referrer: topreurl(parenturl), //上一页
	      files: [],
	      goodsName: geturl('goodsName'), //产品名
	      custom_id: geturl('custom_id'),
	      plan_id: geturl('plan_id'),
	      visits_id: geturl('visits_id'),
	      goods_id: geturl('goods_id'),
	      purchase_source: "", //进货来源
	      display_surface: "", //陈列面
	      weighted_price: "", //加价权
	      purchase_number: "", //进货数量
	      tag_price: "", //标签价
	      image_urls: "", //图片
	      display_number: "", //陈列数
	      real_stock: "", //实际库存 
	      // shop_point:"",               //铺点数
	      //sail_total:"" ,          // 销售额
	      remark: "",
	      batch_number: "" //批号
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    //$(document).attr("title", this.state.goodsName + "-南华药业");
	    this.pubsub_token = PubSub.subscribe('changprodupub', function (topic, newItem) {
	      this.setState({
	        goods_name: newItem.goods_name, //产品名
	        purchase_source: newItem.purchase_source, //进货来源
	        display_surface: newItem.display_surface, //陈列面
	        weighted_price: newItem.weighted_price, //加价权
	        purchase_number: newItem.purchase_number, //进货数量
	        tag_price: newItem.tag_price, //标签价
	        image_urls: newItem.image_urls, //图片
	        display_number: newItem.display_number, //陈列数
	        real_stock: newItem.real_stock, //实际库存 
	        remark: newItem.remark,
	        //shop_point:newItem.shop_point,               //铺点数
	        //sail_total:newItem.sail_total ,          // 销售额
	        batch_number: newItem.batch_number //批号
	      });

	      //处理图片
	      var imgs = newItem.image_urls;

	      if (imgs != "" && imgs.length > 0) {

	        //单个
	        if (imgs.indexOf(";") == -1) {
	          //单个

	          $(".producephoto").append("<img src=" + isnullimg(imgs) + " />");
	        }
	        //单个结束 

	        //多个
	        if (imgs.indexOf(";") > -1) {
	          //多个

	          var imgspits = imgs.split(";");

	          for (var i = 0; i <= imgspits.length - 1; i++) {

	            $(".producephoto").append("<div class='pruductimgs'><img src='" + isnullimg(imgspits[i]) + "' /><br><h2>产品图片" + (i + 1) + "</h2></div>");
	          }
	        }
	        //多个结束
	      }
	      //producephoto

	      //处理图片结束
	    }.bind(this));

	    // this.getinfo();
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    PubSub.unsubscribe(this.pubsub_token);
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
	        this.state.goodsName
	      ),
	      _react2.default.createElement('div', { className: 'producephoto', ref: 'producephoto' }),
	      _react2.default.createElement(
	        'h1',
	        { className: 'saveprodt_Title ' },
	        '\u5E93\u5B58'
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'profile pro_border ' },
	        _react2.default.createElement(
	          'dl',
	          { className: 'white profile_pading save_input', id: 'save_input' },
	          _react2.default.createElement(
	            'dt',
	            null,
	            _react2.default.createElement(
	              'label',
	              null,
	              '\u9648\u5217\u9762\uFF1A'
	            ),
	            this.state.display_surface,
	            '\u4E2A'
	          ),
	          _react2.default.createElement(
	            'dd',
	            null,
	            _react2.default.createElement(
	              'label',
	              null,
	              '\u9648\u5217\u6570\uFF1A'
	            ),
	            this.state.display_number,
	            '\u4E2A'
	          )
	        ),
	        _react2.default.createElement(
	          'dl',
	          { className: 'white profile_pading save_input', id: 'save_input' },
	          _react2.default.createElement(
	            'dt',
	            null,
	            _react2.default.createElement(
	              'label',
	              null,
	              '\u5B9E\u9645\u5E93\u5B58\uFF1A'
	            ),
	            this.state.real_stock
	          ),
	          _react2.default.createElement(
	            'dd',
	            null,
	            _react2.default.createElement(
	              'label',
	              null,
	              '\u6807\u7B7E\u4EF7\uFF1A'
	            ),
	            this.state.tag_price,
	            '\u5143'
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'h1',
	        { className: 'saveprodt_Title  ' },
	        '\u8FDB\u8D27'
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'profile pro_border ' },
	        _react2.default.createElement(
	          'dl',
	          { className: 'white save_input profile_pading', id: 'save_input' },
	          _react2.default.createElement(
	            'dt',
	            null,
	            _react2.default.createElement(
	              'label',
	              null,
	              '\u8FDB\u8D27\u6570\u91CF\uFF1A'
	            ),
	            this.state.purchase_number
	          ),
	          _react2.default.createElement(
	            'dd',
	            null,
	            ' ',
	            _react2.default.createElement(
	              'label',
	              null,
	              '\u6279\u53F7\uFF1A'
	            ),
	            this.state.batch_number
	          )
	        ),
	        _react2.default.createElement(
	          'dl',
	          { className: 'white save_input profile_pading', id: 'save_input' },
	          _react2.default.createElement(
	            'dt',
	            null,
	            _react2.default.createElement(
	              'label',
	              null,
	              '\u8FDB\u8D27\u6765\u6E90\uFF1A'
	            ),
	            this.state.purchase_source,
	            ' '
	          )
	        )
	      ),
	      _react2.default.createElement(
	        'h1',
	        { className: 'saveprodt_Title  ' },
	        '\u5907\u6CE8'
	      ),
	      _react2.default.createElement(
	        'div',
	        { className: 'stockrpb borderb_1r' },
	        this.state.remark
	      )
	    );
	  }
	});

	ReactDOM.render(_react2.default.createElement(Product, null), document.getElementById('conter'));

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
/* 94 */,
/* 95 */,
/* 96 */,
/* 97 */,
/* 98 */,
/* 99 */,
/* 100 */,
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__(102);

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(103), __esModule: true };

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(104);
	module.exports = __webpack_require__(12).Object.assign;

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(10);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(105)});

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(42)
	  , gOPS     = __webpack_require__(71)
	  , pIE      = __webpack_require__(72)
	  , toObject = __webpack_require__(58)
	  , IObject  = __webpack_require__(45)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(21)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ },
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// export this package's api
	module.exports = __webpack_require__(110);

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _ChildrenUtils = __webpack_require__(111);

	var _AnimateChild = __webpack_require__(112);

	var _AnimateChild2 = _interopRequireDefault(_AnimateChild);

	var _util = __webpack_require__(117);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var defaultKey = 'rc_animate_' + Date.now();


	function getChildrenFromProps(props) {
	  var children = props.children;
	  if (_react2["default"].isValidElement(children)) {
	    if (!children.key) {
	      return _react2["default"].cloneElement(children, {
	        key: defaultKey
	      });
	    }
	  }
	  return children;
	}

	function noop() {}

	var Animate = _react2["default"].createClass({
	  displayName: 'Animate',

	  propTypes: {
	    component: _react2["default"].PropTypes.any,
	    animation: _react2["default"].PropTypes.object,
	    transitionName: _react2["default"].PropTypes.oneOfType([_react2["default"].PropTypes.string, _react2["default"].PropTypes.object]),
	    transitionEnter: _react2["default"].PropTypes.bool,
	    transitionAppear: _react2["default"].PropTypes.bool,
	    exclusive: _react2["default"].PropTypes.bool,
	    transitionLeave: _react2["default"].PropTypes.bool,
	    onEnd: _react2["default"].PropTypes.func,
	    onEnter: _react2["default"].PropTypes.func,
	    onLeave: _react2["default"].PropTypes.func,
	    onAppear: _react2["default"].PropTypes.func,
	    showProp: _react2["default"].PropTypes.string
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      animation: {},
	      component: 'span',
	      transitionEnter: true,
	      transitionLeave: true,
	      transitionAppear: false,
	      onEnd: noop,
	      onEnter: noop,
	      onLeave: noop,
	      onAppear: noop
	    };
	  },
	  getInitialState: function getInitialState() {
	    this.currentlyAnimatingKeys = {};
	    this.keysToEnter = [];
	    this.keysToLeave = [];
	    return {
	      children: (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(this.props))
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    var showProp = this.props.showProp;
	    var children = this.state.children;
	    if (showProp) {
	      children = children.filter(function (child) {
	        return !!child.props[showProp];
	      });
	    }
	    children.forEach(function (child) {
	      if (child) {
	        _this.performAppear(child.key);
	      }
	    });
	  },
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
	    var _this2 = this;

	    this.nextProps = nextProps;
	    var nextChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(nextProps));
	    var props = this.props;
	    // exclusive needs immediate response
	    if (props.exclusive) {
	      Object.keys(this.currentlyAnimatingKeys).forEach(function (key) {
	        _this2.stop(key);
	      });
	    }
	    var showProp = props.showProp;
	    var currentlyAnimatingKeys = this.currentlyAnimatingKeys;
	    // last props children if exclusive
	    var currentChildren = props.exclusive ? (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props)) : this.state.children;
	    // in case destroy in showProp mode
	    var newChildren = [];
	    if (showProp) {
	      currentChildren.forEach(function (currentChild) {
	        var nextChild = currentChild && (0, _ChildrenUtils.findChildInChildrenByKey)(nextChildren, currentChild.key);
	        var newChild = void 0;
	        if ((!nextChild || !nextChild.props[showProp]) && currentChild.props[showProp]) {
	          newChild = _react2["default"].cloneElement(nextChild || currentChild, _defineProperty({}, showProp, true));
	        } else {
	          newChild = nextChild;
	        }
	        if (newChild) {
	          newChildren.push(newChild);
	        }
	      });
	      nextChildren.forEach(function (nextChild) {
	        if (!nextChild || !(0, _ChildrenUtils.findChildInChildrenByKey)(currentChildren, nextChild.key)) {
	          newChildren.push(nextChild);
	        }
	      });
	    } else {
	      newChildren = (0, _ChildrenUtils.mergeChildren)(currentChildren, nextChildren);
	    }

	    // need render to avoid update
	    this.setState({
	      children: newChildren
	    });

	    nextChildren.forEach(function (child) {
	      var key = child && child.key;
	      if (child && currentlyAnimatingKeys[key]) {
	        return;
	      }
	      var hasPrev = child && (0, _ChildrenUtils.findChildInChildrenByKey)(currentChildren, key);
	      if (showProp) {
	        var showInNext = child.props[showProp];
	        if (hasPrev) {
	          var showInNow = (0, _ChildrenUtils.findShownChildInChildrenByKey)(currentChildren, key, showProp);
	          if (!showInNow && showInNext) {
	            _this2.keysToEnter.push(key);
	          }
	        } else if (showInNext) {
	          _this2.keysToEnter.push(key);
	        }
	      } else if (!hasPrev) {
	        _this2.keysToEnter.push(key);
	      }
	    });

	    currentChildren.forEach(function (child) {
	      var key = child && child.key;
	      if (child && currentlyAnimatingKeys[key]) {
	        return;
	      }
	      var hasNext = child && (0, _ChildrenUtils.findChildInChildrenByKey)(nextChildren, key);
	      if (showProp) {
	        var showInNow = child.props[showProp];
	        if (hasNext) {
	          var showInNext = (0, _ChildrenUtils.findShownChildInChildrenByKey)(nextChildren, key, showProp);
	          if (!showInNext && showInNow) {
	            _this2.keysToLeave.push(key);
	          }
	        } else if (showInNow) {
	          _this2.keysToLeave.push(key);
	        }
	      } else if (!hasNext) {
	        _this2.keysToLeave.push(key);
	      }
	    });
	  },
	  componentDidUpdate: function componentDidUpdate() {
	    var keysToEnter = this.keysToEnter;
	    this.keysToEnter = [];
	    keysToEnter.forEach(this.performEnter);
	    var keysToLeave = this.keysToLeave;
	    this.keysToLeave = [];
	    keysToLeave.forEach(this.performLeave);
	  },
	  performEnter: function performEnter(key) {
	    // may already remove by exclusive
	    if (this.refs[key]) {
	      this.currentlyAnimatingKeys[key] = true;
	      this.refs[key].componentWillEnter(this.handleDoneAdding.bind(this, key, 'enter'));
	    }
	  },
	  performAppear: function performAppear(key) {
	    if (this.refs[key]) {
	      this.currentlyAnimatingKeys[key] = true;
	      this.refs[key].componentWillAppear(this.handleDoneAdding.bind(this, key, 'appear'));
	    }
	  },
	  handleDoneAdding: function handleDoneAdding(key, type) {
	    var props = this.props;
	    delete this.currentlyAnimatingKeys[key];
	    // if update on exclusive mode, skip check
	    if (props.exclusive && props !== this.nextProps) {
	      return;
	    }
	    var currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props));
	    if (!this.isValidChildByKey(currentChildren, key)) {
	      // exclusive will not need this
	      this.performLeave(key);
	    } else {
	      if (type === 'appear') {
	        if (_util2["default"].allowAppearCallback(props)) {
	          props.onAppear(key);
	          props.onEnd(key, true);
	        }
	      } else {
	        if (_util2["default"].allowEnterCallback(props)) {
	          props.onEnter(key);
	          props.onEnd(key, true);
	        }
	      }
	    }
	  },
	  performLeave: function performLeave(key) {
	    // may already remove by exclusive
	    if (this.refs[key]) {
	      this.currentlyAnimatingKeys[key] = true;
	      this.refs[key].componentWillLeave(this.handleDoneLeaving.bind(this, key));
	    }
	  },
	  handleDoneLeaving: function handleDoneLeaving(key) {
	    var props = this.props;
	    delete this.currentlyAnimatingKeys[key];
	    // if update on exclusive mode, skip check
	    if (props.exclusive && props !== this.nextProps) {
	      return;
	    }
	    var currentChildren = (0, _ChildrenUtils.toArrayChildren)(getChildrenFromProps(props));
	    // in case state change is too fast
	    if (this.isValidChildByKey(currentChildren, key)) {
	      this.performEnter(key);
	    } else {
	      var end = function end() {
	        if (_util2["default"].allowLeaveCallback(props)) {
	          props.onLeave(key);
	          props.onEnd(key, false);
	        }
	      };
	      /* eslint react/no-is-mounted:0 */
	      if (this.isMounted() && !(0, _ChildrenUtils.isSameChildren)(this.state.children, currentChildren, props.showProp)) {
	        this.setState({
	          children: currentChildren
	        }, end);
	      } else {
	        end();
	      }
	    }
	  },
	  isValidChildByKey: function isValidChildByKey(currentChildren, key) {
	    var showProp = this.props.showProp;
	    if (showProp) {
	      return (0, _ChildrenUtils.findShownChildInChildrenByKey)(currentChildren, key, showProp);
	    }
	    return (0, _ChildrenUtils.findChildInChildrenByKey)(currentChildren, key);
	  },
	  stop: function stop(key) {
	    delete this.currentlyAnimatingKeys[key];
	    var component = this.refs[key];
	    if (component) {
	      component.stop();
	    }
	  },
	  render: function render() {
	    var props = this.props;
	    this.nextProps = props;
	    var stateChildren = this.state.children;
	    var children = null;
	    if (stateChildren) {
	      children = stateChildren.map(function (child) {
	        if (child === null || child === undefined) {
	          return child;
	        }
	        if (!child.key) {
	          throw new Error('must set key for <rc-animate> children');
	        }
	        return _react2["default"].createElement(
	          _AnimateChild2["default"],
	          {
	            key: child.key,
	            ref: child.key,
	            animation: props.animation,
	            transitionName: props.transitionName,
	            transitionEnter: props.transitionEnter,
	            transitionAppear: props.transitionAppear,
	            transitionLeave: props.transitionLeave
	          },
	          child
	        );
	      });
	    }
	    var Component = props.component;
	    if (Component) {
	      var passedProps = props;
	      if (typeof Component === 'string') {
	        passedProps = {
	          className: props.className,
	          style: props.style
	        };
	      }
	      return _react2["default"].createElement(
	        Component,
	        passedProps,
	        children
	      );
	    }
	    return children[0] || null;
	  }
	});

	exports["default"] = Animate;
	module.exports = exports['default'];

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.toArrayChildren = toArrayChildren;
	exports.findChildInChildrenByKey = findChildInChildrenByKey;
	exports.findShownChildInChildrenByKey = findShownChildInChildrenByKey;
	exports.findHiddenChildInChildrenByKey = findHiddenChildInChildrenByKey;
	exports.isSameChildren = isSameChildren;
	exports.mergeChildren = mergeChildren;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function toArrayChildren(children) {
	  var ret = [];
	  _react2["default"].Children.forEach(children, function (child) {
	    ret.push(child);
	  });
	  return ret;
	}

	function findChildInChildrenByKey(children, key) {
	  var ret = null;
	  if (children) {
	    children.forEach(function (child) {
	      if (ret) {
	        return;
	      }
	      if (child && child.key === key) {
	        ret = child;
	      }
	    });
	  }
	  return ret;
	}

	function findShownChildInChildrenByKey(children, key, showProp) {
	  var ret = null;
	  if (children) {
	    children.forEach(function (child) {
	      if (child && child.key === key && child.props[showProp]) {
	        if (ret) {
	          throw new Error('two child with same key for <rc-animate> children');
	        }
	        ret = child;
	      }
	    });
	  }
	  return ret;
	}

	function findHiddenChildInChildrenByKey(children, key, showProp) {
	  var found = 0;
	  if (children) {
	    children.forEach(function (child) {
	      if (found) {
	        return;
	      }
	      found = child && child.key === key && !child.props[showProp];
	    });
	  }
	  return found;
	}

	function isSameChildren(c1, c2, showProp) {
	  var same = c1.length === c2.length;
	  if (same) {
	    c1.forEach(function (child, index) {
	      var child2 = c2[index];
	      if (child && child2) {
	        if (child && !child2 || !child && child2) {
	          same = false;
	        } else if (child.key !== child2.key) {
	          same = false;
	        } else if (showProp && child.props[showProp] !== child2.props[showProp]) {
	          same = false;
	        }
	      }
	    });
	  }
	  return same;
	}

	function mergeChildren(prev, next) {
	  var ret = [];

	  // For each key of `next`, the list of keys to insert before that key in
	  // the combined list
	  var nextChildrenPending = {};
	  var pendingChildren = [];
	  prev.forEach(function (child) {
	    if (child && findChildInChildrenByKey(next, child.key)) {
	      if (pendingChildren.length) {
	        nextChildrenPending[child.key] = pendingChildren;
	        pendingChildren = [];
	      }
	    } else {
	      pendingChildren.push(child);
	    }
	  });

	  next.forEach(function (child) {
	    if (child && nextChildrenPending.hasOwnProperty(child.key)) {
	      ret = ret.concat(nextChildrenPending[child.key]);
	    }
	    ret.push(child);
	  });

	  ret = ret.concat(pendingChildren);

	  return ret;
	}

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _cssAnimation = __webpack_require__(113);

	var _cssAnimation2 = _interopRequireDefault(_cssAnimation);

	var _util = __webpack_require__(117);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var transitionMap = {
	  enter: 'transitionEnter',
	  appear: 'transitionAppear',
	  leave: 'transitionLeave'
	};

	var AnimateChild = _react2["default"].createClass({
	  displayName: 'AnimateChild',

	  propTypes: {
	    children: _react2["default"].PropTypes.any
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    this.stop();
	  },
	  componentWillEnter: function componentWillEnter(done) {
	    if (_util2["default"].isEnterSupported(this.props)) {
	      this.transition('enter', done);
	    } else {
	      done();
	    }
	  },
	  componentWillAppear: function componentWillAppear(done) {
	    if (_util2["default"].isAppearSupported(this.props)) {
	      this.transition('appear', done);
	    } else {
	      done();
	    }
	  },
	  componentWillLeave: function componentWillLeave(done) {
	    if (_util2["default"].isLeaveSupported(this.props)) {
	      this.transition('leave', done);
	    } else {
	      // always sync, do not interupt with react component life cycle
	      // update hidden -> animate hidden ->
	      // didUpdate -> animate leave -> unmount (if animate is none)
	      done();
	    }
	  },
	  transition: function transition(animationType, finishCallback) {
	    var _this = this;

	    var node = _reactDom2["default"].findDOMNode(this);
	    var props = this.props;
	    var transitionName = props.transitionName;
	    var nameIsObj = (typeof transitionName === 'undefined' ? 'undefined' : _typeof(transitionName)) === 'object';
	    this.stop();
	    var end = function end() {
	      _this.stopper = null;
	      finishCallback();
	    };
	    if ((_cssAnimation.isCssAnimationSupported || !props.animation[animationType]) && transitionName && props[transitionMap[animationType]]) {
	      var name = nameIsObj ? transitionName[animationType] : transitionName + '-' + animationType;
	      var activeName = name + '-active';
	      if (nameIsObj && transitionName[animationType + 'Active']) {
	        activeName = transitionName[animationType + 'Active'];
	      }
	      this.stopper = (0, _cssAnimation2["default"])(node, {
	        name: name,
	        active: activeName
	      }, end);
	    } else {
	      this.stopper = props.animation[animationType](node, end);
	    }
	  },
	  stop: function stop() {
	    var stopper = this.stopper;
	    if (stopper) {
	      this.stopper = null;
	      stopper.stop();
	    }
	  },
	  render: function render() {
	    return this.props.children;
	  }
	});

	exports["default"] = AnimateChild;
	module.exports = exports['default'];

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _Event = __webpack_require__(114);

	var _Event2 = _interopRequireDefault(_Event);

	var _componentClasses = __webpack_require__(115);

	var _componentClasses2 = _interopRequireDefault(_componentClasses);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var isCssAnimationSupported = _Event2["default"].endEvents.length !== 0;


	var capitalPrefixes = ['Webkit', 'Moz', 'O',
	// ms is special .... !
	'ms'];
	var prefixes = ['-webkit-', '-moz-', '-o-', 'ms-', ''];

	function getStyleProperty(node, name) {
	  var style = window.getComputedStyle(node);

	  var ret = '';
	  for (var i = 0; i < prefixes.length; i++) {
	    ret = style.getPropertyValue(prefixes[i] + name);
	    if (ret) {
	      break;
	    }
	  }
	  return ret;
	}

	function fixBrowserByTimeout(node) {
	  if (isCssAnimationSupported) {
	    var transitionDelay = parseFloat(getStyleProperty(node, 'transition-delay')) || 0;
	    var transitionDuration = parseFloat(getStyleProperty(node, 'transition-duration')) || 0;
	    var animationDelay = parseFloat(getStyleProperty(node, 'animation-delay')) || 0;
	    var animationDuration = parseFloat(getStyleProperty(node, 'animation-duration')) || 0;
	    var time = Math.max(transitionDuration + transitionDelay, animationDuration + animationDelay);
	    // sometimes, browser bug
	    node.rcEndAnimTimeout = setTimeout(function () {
	      node.rcEndAnimTimeout = null;
	      if (node.rcEndListener) {
	        node.rcEndListener();
	      }
	    }, time * 1000 + 200);
	  }
	}

	function clearBrowserBugTimeout(node) {
	  if (node.rcEndAnimTimeout) {
	    clearTimeout(node.rcEndAnimTimeout);
	    node.rcEndAnimTimeout = null;
	  }
	}

	var cssAnimation = function cssAnimation(node, transitionName, endCallback) {
	  var nameIsObj = (typeof transitionName === 'undefined' ? 'undefined' : _typeof(transitionName)) === 'object';
	  var className = nameIsObj ? transitionName.name : transitionName;
	  var activeClassName = nameIsObj ? transitionName.active : transitionName + '-active';
	  var end = endCallback;
	  var start = void 0;
	  var active = void 0;
	  var nodeClasses = (0, _componentClasses2["default"])(node);

	  if (endCallback && Object.prototype.toString.call(endCallback) === '[object Object]') {
	    end = endCallback.end;
	    start = endCallback.start;
	    active = endCallback.active;
	  }

	  if (node.rcEndListener) {
	    node.rcEndListener();
	  }

	  node.rcEndListener = function (e) {
	    if (e && e.target !== node) {
	      return;
	    }

	    if (node.rcAnimTimeout) {
	      clearTimeout(node.rcAnimTimeout);
	      node.rcAnimTimeout = null;
	    }

	    clearBrowserBugTimeout(node);

	    nodeClasses.remove(className);
	    nodeClasses.remove(activeClassName);

	    _Event2["default"].removeEndEventListener(node, node.rcEndListener);
	    node.rcEndListener = null;

	    // Usually this optional end is used for informing an owner of
	    // a leave animation and telling it to remove the child.
	    if (end) {
	      end();
	    }
	  };

	  _Event2["default"].addEndEventListener(node, node.rcEndListener);

	  if (start) {
	    start();
	  }
	  nodeClasses.add(className);

	  node.rcAnimTimeout = setTimeout(function () {
	    node.rcAnimTimeout = null;
	    nodeClasses.add(activeClassName);
	    if (active) {
	      setTimeout(active, 0);
	    }
	    fixBrowserByTimeout(node);
	    // 30ms for firefox
	  }, 30);

	  return {
	    stop: function stop() {
	      if (node.rcEndListener) {
	        node.rcEndListener();
	      }
	    }
	  };
	};

	cssAnimation.style = function (node, style, callback) {
	  if (node.rcEndListener) {
	    node.rcEndListener();
	  }

	  node.rcEndListener = function (e) {
	    if (e && e.target !== node) {
	      return;
	    }

	    if (node.rcAnimTimeout) {
	      clearTimeout(node.rcAnimTimeout);
	      node.rcAnimTimeout = null;
	    }

	    clearBrowserBugTimeout(node);

	    _Event2["default"].removeEndEventListener(node, node.rcEndListener);
	    node.rcEndListener = null;

	    // Usually this optional callback is used for informing an owner of
	    // a leave animation and telling it to remove the child.
	    if (callback) {
	      callback();
	    }
	  };

	  _Event2["default"].addEndEventListener(node, node.rcEndListener);

	  node.rcAnimTimeout = setTimeout(function () {
	    for (var s in style) {
	      if (style.hasOwnProperty(s)) {
	        node.style[s] = style[s];
	      }
	    }
	    node.rcAnimTimeout = null;
	    fixBrowserByTimeout(node);
	  }, 0);
	};

	cssAnimation.setTransition = function (node, p, value) {
	  var property = p;
	  var v = value;
	  if (value === undefined) {
	    v = property;
	    property = '';
	  }
	  property = property || '';
	  capitalPrefixes.forEach(function (prefix) {
	    node.style[prefix + 'Transition' + property] = v;
	  });
	};

	cssAnimation.isCssAnimationSupported = isCssAnimationSupported;

	exports["default"] = cssAnimation;
	module.exports = exports['default'];

/***/ },
/* 114 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var EVENT_NAME_MAP = {
	  transitionend: {
	    transition: 'transitionend',
	    WebkitTransition: 'webkitTransitionEnd',
	    MozTransition: 'mozTransitionEnd',
	    OTransition: 'oTransitionEnd',
	    msTransition: 'MSTransitionEnd'
	  },

	  animationend: {
	    animation: 'animationend',
	    WebkitAnimation: 'webkitAnimationEnd',
	    MozAnimation: 'mozAnimationEnd',
	    OAnimation: 'oAnimationEnd',
	    msAnimation: 'MSAnimationEnd'
	  }
	};

	var endEvents = [];

	function detectEvents() {
	  var testEl = document.createElement('div');
	  var style = testEl.style;

	  if (!('AnimationEvent' in window)) {
	    delete EVENT_NAME_MAP.animationend.animation;
	  }

	  if (!('TransitionEvent' in window)) {
	    delete EVENT_NAME_MAP.transitionend.transition;
	  }

	  for (var baseEventName in EVENT_NAME_MAP) {
	    if (EVENT_NAME_MAP.hasOwnProperty(baseEventName)) {
	      var baseEvents = EVENT_NAME_MAP[baseEventName];
	      for (var styleName in baseEvents) {
	        if (styleName in style) {
	          endEvents.push(baseEvents[styleName]);
	          break;
	        }
	      }
	    }
	  }
	}

	if (typeof window !== 'undefined' && typeof document !== 'undefined') {
	  detectEvents();
	}

	function addEventListener(node, eventName, eventListener) {
	  node.addEventListener(eventName, eventListener, false);
	}

	function removeEventListener(node, eventName, eventListener) {
	  node.removeEventListener(eventName, eventListener, false);
	}

	var TransitionEvents = {
	  addEndEventListener: function addEndEventListener(node, eventListener) {
	    if (endEvents.length === 0) {
	      window.setTimeout(eventListener, 0);
	      return;
	    }
	    endEvents.forEach(function (endEvent) {
	      addEventListener(node, endEvent, eventListener);
	    });
	  },


	  endEvents: endEvents,

	  removeEndEventListener: function removeEndEventListener(node, eventListener) {
	    if (endEvents.length === 0) {
	      return;
	    }
	    endEvents.forEach(function (endEvent) {
	      removeEventListener(node, endEvent, eventListener);
	    });
	  }
	};

	exports["default"] = TransitionEvents;
	module.exports = exports['default'];

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	try {
	  var index = __webpack_require__(116);
	} catch (err) {
	  var index = __webpack_require__(116);
	}

	/**
	 * Whitespace regexp.
	 */

	var re = /\s+/;

	/**
	 * toString reference.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Wrap `el` in a `ClassList`.
	 *
	 * @param {Element} el
	 * @return {ClassList}
	 * @api public
	 */

	module.exports = function(el){
	  return new ClassList(el);
	};

	/**
	 * Initialize a new ClassList for `el`.
	 *
	 * @param {Element} el
	 * @api private
	 */

	function ClassList(el) {
	  if (!el || !el.nodeType) {
	    throw new Error('A DOM element reference is required');
	  }
	  this.el = el;
	  this.list = el.classList;
	}

	/**
	 * Add class `name` if not already present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.add = function(name){
	  // classList
	  if (this.list) {
	    this.list.add(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (!~i) arr.push(name);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove class `name` when present, or
	 * pass a regular expression to remove
	 * any which match.
	 *
	 * @param {String|RegExp} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.remove = function(name){
	  if ('[object RegExp]' == toString.call(name)) {
	    return this.removeMatching(name);
	  }

	  // classList
	  if (this.list) {
	    this.list.remove(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (~i) arr.splice(i, 1);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove all classes matching `re`.
	 *
	 * @param {RegExp} re
	 * @return {ClassList}
	 * @api private
	 */

	ClassList.prototype.removeMatching = function(re){
	  var arr = this.array();
	  for (var i = 0; i < arr.length; i++) {
	    if (re.test(arr[i])) {
	      this.remove(arr[i]);
	    }
	  }
	  return this;
	};

	/**
	 * Toggle class `name`, can force state via `force`.
	 *
	 * For browsers that support classList, but do not support `force` yet,
	 * the mistake will be detected and corrected.
	 *
	 * @param {String} name
	 * @param {Boolean} force
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.toggle = function(name, force){
	  // classList
	  if (this.list) {
	    if ("undefined" !== typeof force) {
	      if (force !== this.list.toggle(name, force)) {
	        this.list.toggle(name); // toggle again to correct
	      }
	    } else {
	      this.list.toggle(name);
	    }
	    return this;
	  }

	  // fallback
	  if ("undefined" !== typeof force) {
	    if (!force) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  } else {
	    if (this.has(name)) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  }

	  return this;
	};

	/**
	 * Return an array of classes.
	 *
	 * @return {Array}
	 * @api public
	 */

	ClassList.prototype.array = function(){
	  var className = this.el.getAttribute('class') || '';
	  var str = className.replace(/^\s+|\s+$/g, '');
	  var arr = str.split(re);
	  if ('' === arr[0]) arr.shift();
	  return arr;
	};

	/**
	 * Check if class `name` is present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.has =
	ClassList.prototype.contains = function(name){
	  return this.list
	    ? this.list.contains(name)
	    : !! ~index(this.array(), name);
	};


/***/ },
/* 116 */
/***/ function(module, exports) {

	module.exports = function(arr, obj){
	  if (arr.indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ },
/* 117 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var util = {
	  isAppearSupported: function isAppearSupported(props) {
	    return props.transitionName && props.transitionAppear || props.animation.appear;
	  },
	  isEnterSupported: function isEnterSupported(props) {
	    return props.transitionName && props.transitionEnter || props.animation.enter;
	  },
	  isLeaveSupported: function isLeaveSupported(props) {
	    return props.transitionName && props.transitionLeave || props.animation.leave;
	  },
	  allowAppearCallback: function allowAppearCallback(props) {
	    return props.transitionAppear || props.animation.appear;
	  },
	  allowEnterCallback: function allowEnterCallback(props) {
	    return props.transitionEnter || props.animation.enter;
	  },
	  allowLeaveCallback: function allowLeaveCallback(props) {
	    return props.transitionLeave || props.animation.leave;
	  }
	};
	exports["default"] = util;
	module.exports = exports['default'];

/***/ },
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
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends2 = __webpack_require__(101);

	var _extends3 = _interopRequireDefault(_extends2);

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	exports["default"] = function (props) {
	    var type = props.type;
	    var _props$className = props.className;
	    var className = _props$className === undefined ? '' : _props$className;

	    return React.createElement('i', (0, _extends3["default"])({}, props, { className: (className + ' anticon anticon-' + type).trim() }));
	};

	module.exports = exports['default'];

/***/ },
/* 135 */,
/* 136 */,
/* 137 */
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

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var WhiteSpace = function (_React$Component) {
	    (0, _inherits3["default"])(WhiteSpace, _React$Component);

	    function WhiteSpace() {
	        (0, _classCallCheck3["default"])(this, WhiteSpace);
	        return (0, _possibleConstructorReturn3["default"])(this, _React$Component.apply(this, arguments));
	    }

	    WhiteSpace.prototype.render = function render() {
	        var _classNames;

	        var _props = this.props;
	        var prefixCls = _props.prefixCls;
	        var size = _props.size;
	        var className = _props.className;
	        var style = _props.style;
	        var onClick = _props.onClick;

	        var wrapCls = (0, _classnames2["default"])((_classNames = {}, (0, _defineProperty3["default"])(_classNames, '' + prefixCls, true), (0, _defineProperty3["default"])(_classNames, prefixCls + '-' + size, true), (0, _defineProperty3["default"])(_classNames, className, !!className), _classNames));
	        return React.createElement('div', { className: wrapCls, style: style, onClick: onClick });
	    };

	    return WhiteSpace;
	}(React.Component);

	exports["default"] = WhiteSpace;

	WhiteSpace.defaultProps = {
	    prefixCls: 'am-whitespace',
	    size: 'md'
	};
	module.exports = exports['default'];

/***/ },
/* 138 */
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

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var WingBlank = function (_React$Component) {
	    (0, _inherits3["default"])(WingBlank, _React$Component);

	    function WingBlank() {
	        (0, _classCallCheck3["default"])(this, WingBlank);
	        return (0, _possibleConstructorReturn3["default"])(this, _React$Component.apply(this, arguments));
	    }

	    WingBlank.prototype.render = function render() {
	        var _classNames;

	        var _props = this.props;
	        var prefixCls = _props.prefixCls;
	        var size = _props.size;
	        var className = _props.className;
	        var children = _props.children;
	        var style = _props.style;

	        var wrapCls = (0, _classnames2["default"])((_classNames = {}, (0, _defineProperty3["default"])(_classNames, '' + prefixCls, true), (0, _defineProperty3["default"])(_classNames, prefixCls + '-' + size, true), (0, _defineProperty3["default"])(_classNames, className, !!className), _classNames));
	        return React.createElement(
	            'div',
	            { className: wrapCls, style: style },
	            children
	        );
	    };

	    return WingBlank;
	}(React.Component);

	exports["default"] = WingBlank;

	WingBlank.defaultProps = {
	    prefixCls: 'am-wingblank',
	    size: 'lg'
	};
	module.exports = exports['default'];

/***/ },
/* 139 */,
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/*!
	 * Cropper v0.9.2
	 * https://github.com/fengyuanchen/cropper
	 *
	 * Copyright (c) 2014-2015 Fengyuan Chen and contributors
	 * Released under the MIT license
	 *
	 * Date: 2015-04-18T04:35:01.500Z
	 */

	(function (factory) {
	  if (true) {
	    // AMD. Register as anonymous module.
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(141)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
	    // Node / CommonJS
	    factory(require('jquery'));
	  } else {
	    // Browser globals.
	    factory(jQuery);
	  }
	})(function ($) {

	  'use strict';

	  var $window = $(window),
	      $document = $(document),
	      location = window.location,


	  // Constants
	  CROPPER_NAMESPACE = '.cropper',
	      CROPPER_PREVIEW = 'preview' + CROPPER_NAMESPACE,


	  // RegExps
	  REGEXP_DRAG_TYPES = /^(e|n|w|s|ne|nw|sw|se|all|crop|move|zoom)$/,


	  // Classes
	  CLASS_MODAL = 'cropper-modal',
	      CLASS_HIDE = 'cropper-hide',
	      CLASS_HIDDEN = 'cropper-hidden',
	      CLASS_INVISIBLE = 'cropper-invisible',
	      CLASS_MOVE = 'cropper-move',
	      CLASS_CROP = 'cropper-crop',
	      CLASS_DISABLED = 'cropper-disabled',
	      CLASS_BG = 'cropper-bg',


	  // Events
	  EVENT_MOUSE_DOWN = 'mousedown touchstart',
	      EVENT_MOUSE_MOVE = 'mousemove touchmove',
	      EVENT_MOUSE_UP = 'mouseup mouseleave touchend touchleave touchcancel',
	      EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll',
	      EVENT_DBLCLICK = 'dblclick',
	      EVENT_RESIZE = 'resize' + CROPPER_NAMESPACE,
	      // Bind to window with namespace
	  EVENT_BUILD = 'build' + CROPPER_NAMESPACE,
	      EVENT_BUILT = 'built' + CROPPER_NAMESPACE,
	      EVENT_DRAG_START = 'dragstart' + CROPPER_NAMESPACE,
	      EVENT_DRAG_MOVE = 'dragmove' + CROPPER_NAMESPACE,
	      EVENT_DRAG_END = 'dragend' + CROPPER_NAMESPACE,
	      EVENT_ZOOM_IN = 'zoomin' + CROPPER_NAMESPACE,
	      EVENT_ZOOM_OUT = 'zoomout' + CROPPER_NAMESPACE,


	  // Supports
	  SUPPORT_CANVAS = $.isFunction($('<canvas>')[0].getContext),


	  // Others
	  sqrt = Math.sqrt,
	      min = Math.min,
	      max = Math.max,
	      abs = Math.abs,
	      sin = Math.sin,
	      cos = Math.cos,
	      num = parseFloat,


	  // Prototype
	  prototype = {};

	  function isNumber(n) {
	    return typeof n === 'number';
	  }

	  function isUndefined(n) {
	    return typeof n === 'undefined';
	  }

	  function toArray(obj, offset) {
	    var args = [];

	    if (isNumber(offset)) {
	      // It's necessary for IE8
	      args.push(offset);
	    }

	    return args.slice.apply(obj, args);
	  }

	  // Custom proxy to avoid jQuery's guid
	  function proxy(fn, context) {
	    var args = toArray(arguments, 2);

	    return function () {
	      return fn.apply(context, args.concat(toArray(arguments)));
	    };
	  }

	  function isCrossOriginURL(url) {
	    var parts = url.match(/^(https?:)\/\/([^\:\/\?#]+):?(\d*)/i);

	    return parts && (parts[1] !== location.protocol || parts[2] !== location.hostname || parts[3] !== location.port);
	  }

	  function addTimestamp(url) {
	    var timestamp = 'timestamp=' + new Date().getTime();

	    return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
	  }

	  function inRange(source, target) {
	    return target.left < 0 && source.width < target.left + target.width && target.top < 0 && source.height < target.top + target.height;
	  }

	  function getRotateValue(degree) {
	    return degree ? 'rotate(' + degree + 'deg)' : 'none';
	  }

	  function getRotatedSizes(data, reverse) {
	    var deg = abs(data.degree) % 180,
	        arc = (deg > 90 ? 180 - deg : deg) * Math.PI / 180,
	        sinArc = sin(arc),
	        cosArc = cos(arc),
	        width = data.width,
	        height = data.height,
	        aspectRatio = data.aspectRatio,
	        newWidth,
	        newHeight;

	    if (!reverse) {
	      newWidth = width * cosArc + height * sinArc;
	      newHeight = width * sinArc + height * cosArc;
	    } else {
	      newWidth = width / (cosArc + sinArc / aspectRatio);
	      newHeight = newWidth / aspectRatio;
	    }

	    return {
	      width: newWidth,
	      height: newHeight
	    };
	  }

	  function getSourceCanvas(image, data) {
	    var canvas = $('<canvas>')[0],
	        context = canvas.getContext('2d'),
	        width = data.naturalWidth,
	        height = data.naturalHeight,
	        rotate = data.rotate,
	        rotated = getRotatedSizes({
	      width: width,
	      height: height,
	      degree: rotate
	    });

	    if (rotate) {
	      canvas.width = rotated.width;
	      canvas.height = rotated.height;
	      context.save();
	      context.translate(rotated.width / 2, rotated.height / 2);
	      context.rotate(rotate * Math.PI / 180);
	      context.drawImage(image, -width / 2, -height / 2, width, height);
	      context.restore();
	    } else {
	      canvas.width = width;
	      canvas.height = height;
	      context.drawImage(image, 0, 0, width, height);
	    }

	    return canvas;
	  }

	  function Cropper(element, options) {
	    this.$element = $(element);
	    this.options = $.extend({}, Cropper.DEFAULTS, $.isPlainObject(options) && options);

	    this.ready = false;
	    this.built = false;
	    this.rotated = false;
	    this.cropped = false;
	    this.disabled = false;
	    this.canvas = null;
	    this.cropBox = null;

	    this.load();
	  }

	  prototype.load = function (url) {
	    var options = this.options,
	        $this = this.$element,
	        crossOrigin,
	        bustCacheUrl,
	        buildEvent,
	        $clone;

	    if (!url) {
	      if ($this.is('img')) {
	        if (!$this.attr('src')) {
	          return;
	        }

	        url = $this.prop('src');
	      } else if ($this.is('canvas') && SUPPORT_CANVAS) {
	        url = $this[0].toDataURL();
	      }
	    }

	    if (!url) {
	      return;
	    }

	    buildEvent = $.Event(EVENT_BUILD);
	    $this.one(EVENT_BUILD, options.build).trigger(buildEvent); // Only trigger once

	    if (buildEvent.isDefaultPrevented()) {
	      return;
	    }

	    if (options.checkImageOrigin && isCrossOriginURL(url)) {
	      crossOrigin = 'anonymous';

	      if (!$this.prop('crossOrigin')) {
	        // Only when there was not a "crossOrigin" property
	        bustCacheUrl = addTimestamp(url); // Bust cache (#148)
	      }
	    }

	    this.$clone = $clone = $('<img>');

	    $clone.one('load', $.proxy(function () {
	      var naturalWidth = $clone.prop('naturalWidth') || $clone.width(),
	          naturalHeight = $clone.prop('naturalHeight') || $clone.height();

	      this.image = {
	        naturalWidth: naturalWidth,
	        naturalHeight: naturalHeight,
	        aspectRatio: naturalWidth / naturalHeight,
	        rotate: 0
	      };

	      this.url = url;
	      this.ready = true;
	      this.build();
	    }, this)).one('error', function () {
	      $clone.remove();
	    }).attr({
	      src: bustCacheUrl || url,
	      crossOrigin: crossOrigin
	    });

	    // Hide and insert into the document
	    $clone.addClass(CLASS_HIDE).insertAfter($this);
	  };

	  prototype.build = function () {
	    var $this = this.$element,
	        $clone = this.$clone,
	        options = this.options,
	        $cropper,
	        $cropBox;

	    if (!this.ready) {
	      return;
	    }

	    if (this.built) {
	      this.unbuild();
	    }

	    // Create cropper elements
	    this.$cropper = $cropper = $(Cropper.TEMPLATE);

	    // Hide the original image
	    $this.addClass(CLASS_HIDDEN);

	    // Show the clone iamge
	    $clone.removeClass(CLASS_HIDE);

	    this.$container = $this.parent().append($cropper);
	    this.$canvas = $cropper.find('.cropper-canvas').append($clone);
	    this.$dragBox = $cropper.find('.cropper-drag-box');
	    this.$cropBox = $cropBox = $cropper.find('.cropper-crop-box');
	    this.$viewBox = $cropper.find('.cropper-view-box');

	    this.addListeners();
	    this.initPreview();

	    // Format aspect ratio
	    options.aspectRatio = num(options.aspectRatio) || NaN; // 0 -> NaN

	    if (options.autoCrop) {
	      this.cropped = true;

	      if (options.modal) {
	        this.$dragBox.addClass(CLASS_MODAL);
	      }
	    } else {
	      $cropBox.addClass(CLASS_HIDDEN);
	    }

	    if (options.background) {
	      $cropper.addClass(CLASS_BG);
	    }

	    if (!options.highlight) {
	      $cropBox.find('.cropper-face').addClass(CLASS_INVISIBLE);
	    }

	    if (!options.guides) {
	      $cropBox.find('.cropper-dashed').addClass(CLASS_HIDDEN);
	    }

	    if (!options.movable) {
	      $cropBox.find('.cropper-face').data('drag', 'move');
	    }

	    if (!options.resizable) {
	      $cropBox.find('.cropper-line, .cropper-point').addClass(CLASS_HIDDEN);
	    }

	    this.setDragMode(options.dragCrop ? 'crop' : 'move');

	    this.built = true;
	    this.render();
	    $this.one(EVENT_BUILT, options.built).trigger(EVENT_BUILT); // Only trigger once
	  };

	  prototype.unbuild = function () {
	    if (!this.built) {
	      return;
	    }

	    this.built = false;
	    this.container = null;
	    this.canvas = null;
	    this.cropBox = null; // This is necessary when replace
	    this.removeListeners();

	    this.resetPreview();
	    this.$preview = null;

	    this.$viewBox = null;
	    this.$cropBox = null;
	    this.$dragBox = null;
	    this.$canvas = null;
	    this.$container = null;

	    this.$cropper.remove();
	    this.$cropper = null;
	  };

	  $.extend(prototype, {
	    render: function render() {
	      this.initContainer();
	      this.initCanvas();
	      this.initCropBox();

	      this.renderCanvas();

	      if (this.cropped) {
	        this.renderCropBox();
	      }
	    },

	    initContainer: function initContainer() {
	      var $this = this.$element,
	          $container = this.$container,
	          $cropper = this.$cropper,
	          options = this.options;

	      $cropper.addClass(CLASS_HIDDEN);
	      $this.removeClass(CLASS_HIDDEN);

	      $cropper.css(this.container = {
	        width: max($container.width(), num(options.minContainerWidth) || 200),
	        height: max($container.height(), num(options.minContainerHeight) || 100)
	      });

	      $this.addClass(CLASS_HIDDEN);
	      $cropper.removeClass(CLASS_HIDDEN);
	    },

	    // image box (wrapper)
	    initCanvas: function initCanvas() {
	      var container = this.container,
	          containerWidth = container.width,
	          containerHeight = container.height,
	          image = this.image,
	          aspectRatio = image.aspectRatio,
	          canvas = {
	        aspectRatio: aspectRatio,
	        width: containerWidth,
	        height: containerHeight
	      };

	      if (containerHeight * aspectRatio > containerWidth) {
	        canvas.height = containerWidth / aspectRatio;
	      } else {
	        canvas.width = containerHeight * aspectRatio;
	      }

	      canvas.oldLeft = canvas.left = (containerWidth - canvas.width) / 2;
	      canvas.oldTop = canvas.top = (containerHeight - canvas.height) / 2;

	      this.canvas = canvas;
	      this.limitCanvas(true, true);
	      this.initialImage = $.extend({}, image);
	      this.initialCanvas = $.extend({}, canvas);
	    },

	    limitCanvas: function limitCanvas(size, position) {
	      var options = this.options,
	          strict = options.strict,
	          container = this.container,
	          containerWidth = container.width,
	          containerHeight = container.height,
	          canvas = this.canvas,
	          aspectRatio = canvas.aspectRatio,
	          cropBox = this.cropBox,
	          cropped = this.cropped && cropBox,
	          minCanvasWidth,
	          minCanvasHeight;

	      if (size) {
	        minCanvasWidth = num(options.minCanvasWidth) || 0;
	        minCanvasHeight = num(options.minCanvasHeight) || 0;

	        if (minCanvasWidth) {
	          if (strict) {
	            minCanvasWidth = max(cropped ? cropBox.width : containerWidth, minCanvasWidth);
	          }

	          minCanvasHeight = minCanvasWidth / aspectRatio;
	        } else if (minCanvasHeight) {

	          if (strict) {
	            minCanvasHeight = max(cropped ? cropBox.height : containerHeight, minCanvasHeight);
	          }

	          minCanvasWidth = minCanvasHeight * aspectRatio;
	        } else if (strict) {
	          if (cropped) {
	            minCanvasWidth = cropBox.width;
	            minCanvasHeight = cropBox.height;

	            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	              minCanvasWidth = minCanvasHeight * aspectRatio;
	            } else {
	              minCanvasHeight = minCanvasWidth / aspectRatio;
	            }
	          } else {
	            minCanvasWidth = containerWidth;
	            minCanvasHeight = containerHeight;

	            if (minCanvasHeight * aspectRatio > minCanvasWidth) {
	              minCanvasHeight = minCanvasWidth / aspectRatio;
	            } else {
	              minCanvasWidth = minCanvasHeight * aspectRatio;
	            }
	          }
	        }

	        $.extend(canvas, {
	          minWidth: minCanvasWidth,
	          minHeight: minCanvasHeight,
	          maxWidth: Infinity,
	          maxHeight: Infinity
	        });
	      }

	      if (position) {
	        if (strict) {
	          if (cropped) {
	            canvas.minLeft = min(cropBox.left, cropBox.left + cropBox.width - canvas.width);
	            canvas.minTop = min(cropBox.top, cropBox.top + cropBox.height - canvas.height);
	            canvas.maxLeft = cropBox.left;
	            canvas.maxTop = cropBox.top;
	          } else {
	            canvas.minLeft = min(0, containerWidth - canvas.width);
	            canvas.minTop = min(0, containerHeight - canvas.height);
	            canvas.maxLeft = max(0, containerWidth - canvas.width);
	            canvas.maxTop = max(0, containerHeight - canvas.height);
	          }
	        } else {
	          canvas.minLeft = -canvas.width;
	          canvas.minTop = -canvas.height;
	          canvas.maxLeft = containerWidth;
	          canvas.maxTop = containerHeight;
	        }
	      }
	    },

	    renderCanvas: function renderCanvas(changed) {
	      var options = this.options,
	          canvas = this.canvas,
	          image = this.image,
	          aspectRatio,
	          rotated;

	      if (this.rotated) {
	        this.rotated = false;

	        // Computes rotatation sizes with image sizes
	        rotated = getRotatedSizes({
	          width: image.width,
	          height: image.height,
	          degree: image.rotate
	        });

	        aspectRatio = rotated.width / rotated.height;

	        if (aspectRatio !== canvas.aspectRatio) {
	          canvas.left -= (rotated.width - canvas.width) / 2;
	          canvas.top -= (rotated.height - canvas.height) / 2;
	          canvas.width = rotated.width;
	          canvas.height = rotated.height;
	          canvas.aspectRatio = aspectRatio;
	          this.limitCanvas(true, false);
	        }
	      }

	      if (canvas.width > canvas.maxWidth || canvas.width < canvas.minWidth) {
	        canvas.left = canvas.oldLeft;
	      }

	      if (canvas.height > canvas.maxHeight || canvas.height < canvas.minHeight) {
	        canvas.top = canvas.oldTop;
	      }

	      canvas.width = min(max(canvas.width, canvas.minWidth), canvas.maxWidth);
	      canvas.height = min(max(canvas.height, canvas.minHeight), canvas.maxHeight);

	      this.limitCanvas(false, true);

	      canvas.oldLeft = canvas.left = min(max(canvas.left, canvas.minLeft), canvas.maxLeft);
	      canvas.oldTop = canvas.top = min(max(canvas.top, canvas.minTop), canvas.maxTop);

	      this.$canvas.css({
	        width: canvas.width,
	        height: canvas.height,
	        left: canvas.left,
	        top: canvas.top
	      });

	      this.renderImage();

	      if (this.cropped && options.strict && !inRange(this.container, canvas)) {
	        this.limitCropBox(true, true);
	      }

	      if (changed) {
	        this.output();
	      }
	    },

	    renderImage: function renderImage() {
	      var canvas = this.canvas,
	          image = this.image,
	          reversed;

	      if (image.rotate) {
	        reversed = getRotatedSizes({
	          width: canvas.width,
	          height: canvas.height,
	          degree: image.rotate,
	          aspectRatio: image.aspectRatio
	        }, true);
	      }

	      $.extend(image, reversed ? {
	        width: reversed.width,
	        height: reversed.height,
	        left: (canvas.width - reversed.width) / 2,
	        top: (canvas.height - reversed.height) / 2
	      } : {
	        width: canvas.width,
	        height: canvas.height,
	        left: 0,
	        top: 0
	      });

	      this.$clone.css({
	        width: image.width,
	        height: image.height,
	        marginLeft: image.left,
	        marginTop: image.top,
	        transform: getRotateValue(image.rotate)
	      });
	    },

	    initCropBox: function initCropBox() {
	      var options = this.options,
	          canvas = this.canvas,
	          aspectRatio = options.aspectRatio,
	          autoCropArea = num(options.autoCropArea) || 0.8,
	          cropBox = {
	        width: canvas.width,
	        height: canvas.height
	      };

	      if (aspectRatio) {
	        if (canvas.height * aspectRatio > canvas.width) {
	          cropBox.height = cropBox.width / aspectRatio;
	        } else {
	          cropBox.width = cropBox.height * aspectRatio;
	        }
	      }

	      this.cropBox = cropBox;
	      this.limitCropBox(true, true);

	      // Initialize auto crop area
	      cropBox.width = min(max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
	      cropBox.height = min(max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

	      // The width of auto crop area must large than "minWidth", and the height too. (#164)
	      cropBox.width = max(cropBox.minWidth, cropBox.width * autoCropArea);
	      cropBox.height = max(cropBox.minHeight, cropBox.height * autoCropArea);
	      cropBox.oldLeft = cropBox.left = canvas.left + (canvas.width - cropBox.width) / 2;
	      cropBox.oldTop = cropBox.top = canvas.top + (canvas.height - cropBox.height) / 2;

	      this.initialCropBox = $.extend({}, cropBox);
	    },

	    limitCropBox: function limitCropBox(size, position) {
	      var options = this.options,
	          strict = options.strict,
	          container = this.container,
	          containerWidth = container.width,
	          containerHeight = container.height,
	          canvas = this.canvas,
	          cropBox = this.cropBox,
	          aspectRatio = options.aspectRatio,
	          minCropBoxWidth,
	          minCropBoxHeight;

	      if (size) {
	        minCropBoxWidth = num(options.minCropBoxWidth) || 0;
	        minCropBoxHeight = num(options.minCropBoxHeight) || 0;

	        // min/maxCropBoxWidth/Height must less than conatiner width/height
	        cropBox.minWidth = min(containerWidth, minCropBoxWidth);
	        cropBox.minHeight = min(containerHeight, minCropBoxHeight);
	        cropBox.maxWidth = min(containerWidth, strict ? canvas.width : containerWidth);
	        cropBox.maxHeight = min(containerHeight, strict ? canvas.height : containerHeight);

	        if (aspectRatio) {
	          // compare crop box size with container first
	          if (cropBox.maxHeight * aspectRatio > cropBox.maxWidth) {
	            cropBox.minHeight = cropBox.minWidth / aspectRatio;
	            cropBox.maxHeight = cropBox.maxWidth / aspectRatio;
	          } else {
	            cropBox.minWidth = cropBox.minHeight * aspectRatio;
	            cropBox.maxWidth = cropBox.maxHeight * aspectRatio;
	          }
	        }

	        // The "minWidth" must be less than "maxWidth", and the "minHeight" too.
	        cropBox.minWidth = min(cropBox.maxWidth, cropBox.minWidth);
	        cropBox.minHeight = min(cropBox.maxHeight, cropBox.minHeight);
	      }

	      if (position) {
	        if (strict) {
	          cropBox.minLeft = max(0, canvas.left);
	          cropBox.minTop = max(0, canvas.top);
	          cropBox.maxLeft = min(containerWidth, canvas.left + canvas.width) - cropBox.width;
	          cropBox.maxTop = min(containerHeight, canvas.top + canvas.height) - cropBox.height;
	        } else {
	          cropBox.minLeft = 0;
	          cropBox.minTop = 0;
	          cropBox.maxLeft = containerWidth - cropBox.width;
	          cropBox.maxTop = containerHeight - cropBox.height;
	        }
	      }
	    },

	    renderCropBox: function renderCropBox() {
	      var options = this.options,
	          container = this.container,
	          containerWidth = container.width,
	          containerHeight = container.height,
	          $cropBox = this.$cropBox,
	          cropBox = this.cropBox;

	      if (cropBox.width > cropBox.maxWidth || cropBox.width < cropBox.minWidth) {
	        cropBox.left = cropBox.oldLeft;
	      }

	      if (cropBox.height > cropBox.maxHeight || cropBox.height < cropBox.minHeight) {
	        cropBox.top = cropBox.oldTop;
	      }

	      cropBox.width = min(max(cropBox.width, cropBox.minWidth), cropBox.maxWidth);
	      cropBox.height = min(max(cropBox.height, cropBox.minHeight), cropBox.maxHeight);

	      this.limitCropBox(false, true);

	      cropBox.oldLeft = cropBox.left = min(max(cropBox.left, cropBox.minLeft), cropBox.maxLeft);
	      cropBox.oldTop = cropBox.top = min(max(cropBox.top, cropBox.minTop), cropBox.maxTop);

	      if (options.movable) {
	        $cropBox.find('.cropper-face').data('drag', cropBox.width === containerWidth && cropBox.height === containerHeight ? 'move' : 'all');
	      }

	      $cropBox.css({
	        width: cropBox.width,
	        height: cropBox.height,
	        left: cropBox.left,
	        top: cropBox.top
	      });

	      if (this.cropped && options.strict && !inRange(container, this.canvas)) {
	        this.limitCanvas(true, true);
	      }

	      if (!this.disabled) {
	        this.output();
	      }
	    },

	    output: function output() {
	      var options = this.options;

	      this.preview();

	      if (options.crop) {
	        options.crop.call(this.$element, this.getData());
	      }
	    }
	  });

	  prototype.initPreview = function () {
	    var url = this.url;

	    this.$preview = $(this.options.preview);
	    this.$viewBox.html('<img src="' + url + '">');

	    // Override img element styles
	    // Add `display:block` to avoid margin top issue (Occur only when margin-top <= -height)
	    this.$preview.each(function () {
	      var $this = $(this);

	      $this.data(CROPPER_PREVIEW, {
	        width: $this.width(),
	        height: $this.height(),
	        original: $this.html()
	      }).html('<img src="' + url + '" style="display:block;width:100%;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation: 0deg!important">');
	    });
	  };

	  prototype.resetPreview = function () {
	    this.$preview.each(function () {
	      var $this = $(this);

	      $this.html($this.data(CROPPER_PREVIEW).original).removeData(CROPPER_PREVIEW);
	    });
	  };

	  prototype.preview = function () {
	    var image = this.image,
	        canvas = this.canvas,
	        cropBox = this.cropBox,
	        width = image.width,
	        height = image.height,
	        left = cropBox.left - canvas.left - image.left,
	        top = cropBox.top - canvas.top - image.top,
	        rotate = image.rotate;

	    if (!this.cropped || this.disabled) {
	      return;
	    }

	    this.$viewBox.find('img').css({
	      width: width,
	      height: height,
	      marginLeft: -left,
	      marginTop: -top,
	      transform: getRotateValue(rotate)
	    });

	    this.$preview.each(function () {
	      var $this = $(this),
	          data = $this.data(CROPPER_PREVIEW),
	          ratio = data.width / cropBox.width,
	          newWidth = data.width,
	          newHeight = cropBox.height * ratio;

	      if (newHeight > data.height) {
	        ratio = data.height / cropBox.height;
	        newWidth = cropBox.width * ratio;
	        newHeight = data.height;
	      }

	      $this.width(newWidth).height(newHeight).find('img').css({
	        width: width * ratio,
	        height: height * ratio,
	        marginLeft: -left * ratio,
	        marginTop: -top * ratio,
	        transform: getRotateValue(rotate)
	      });
	    });
	  };

	  prototype.addListeners = function () {
	    var options = this.options;

	    this.$element.on(EVENT_DRAG_START, options.dragstart).on(EVENT_DRAG_MOVE, options.dragmove).on(EVENT_DRAG_END, options.dragend).on(EVENT_ZOOM_IN, options.zoomin).on(EVENT_ZOOM_OUT, options.zoomout);
	    this.$cropper.on(EVENT_MOUSE_DOWN, $.proxy(this.dragstart, this)).on(EVENT_DBLCLICK, $.proxy(this.dblclick, this));

	    if (options.zoomable && options.mouseWheelZoom) {
	      this.$cropper.on(EVENT_WHEEL, $.proxy(this.wheel, this));
	    }

	    $document.on(EVENT_MOUSE_MOVE, this._dragmove = proxy(this.dragmove, this)).on(EVENT_MOUSE_UP, this._dragend = proxy(this.dragend, this));

	    if (options.responsive) {
	      $window.on(EVENT_RESIZE, this._resize = proxy(this.resize, this));
	    }
	  };

	  prototype.removeListeners = function () {
	    var options = this.options;

	    this.$element.off(EVENT_DRAG_START, options.dragstart).off(EVENT_DRAG_MOVE, options.dragmove).off(EVENT_DRAG_END, options.dragend).off(EVENT_ZOOM_IN, options.zoomin).off(EVENT_ZOOM_OUT, options.zoomout);
	    this.$cropper.off(EVENT_MOUSE_DOWN, this.dragstart).off(EVENT_DBLCLICK, this.dblclick);

	    if (options.zoomable && options.mouseWheelZoom) {
	      this.$cropper.off(EVENT_WHEEL, this.wheel);
	    }

	    $document.off(EVENT_MOUSE_MOVE, this._dragmove).off(EVENT_MOUSE_UP, this._dragend);

	    if (options.responsive) {
	      $window.off(EVENT_RESIZE, this._resize);
	    }
	  };

	  $.extend(prototype, {
	    resize: function resize() {
	      var $container = this.$container,
	          container = this.container,
	          canvasData,
	          cropBoxData,
	          ratio;

	      if (this.disabled) {
	        return;
	      }

	      ratio = $container.width() / container.width;

	      if (ratio !== 1 || $container.height() !== container.height) {
	        canvasData = this.getCanvasData();
	        cropBoxData = this.getCropBoxData();

	        this.render();
	        this.setCanvasData($.each(canvasData, function (i, n) {
	          canvasData[i] = n * ratio;
	        }));
	        this.setCropBoxData($.each(cropBoxData, function (i, n) {
	          cropBoxData[i] = n * ratio;
	        }));
	      }
	    },

	    dblclick: function dblclick() {
	      if (this.disabled) {
	        return;
	      }

	      if (this.$dragBox.hasClass(CLASS_CROP)) {
	        this.setDragMode('move');
	      } else {
	        this.setDragMode('crop');
	      }
	    },

	    wheel: function wheel(event) {
	      var e = event.originalEvent,
	          delta = 1;

	      if (this.disabled) {
	        return;
	      }

	      event.preventDefault();

	      if (e.deltaY) {
	        delta = e.deltaY > 0 ? 1 : -1;
	      } else if (e.wheelDelta) {
	        delta = -e.wheelDelta / 120;
	      } else if (e.detail) {
	        delta = e.detail > 0 ? 1 : -1;
	      }

	      this.zoom(-delta * 0.1);
	    },

	    dragstart: function dragstart(event) {
	      var options = this.options,
	          originalEvent = event.originalEvent,
	          touches = originalEvent && originalEvent.touches,
	          e = event,
	          dragType,
	          dragStartEvent,
	          touchesLength;

	      if (this.disabled) {
	        return;
	      }

	      if (touches) {
	        touchesLength = touches.length;

	        if (touchesLength > 1) {
	          if (options.zoomable && options.touchDragZoom && touchesLength === 2) {
	            e = touches[1];
	            this.startX2 = e.pageX;
	            this.startY2 = e.pageY;
	            dragType = 'zoom';
	          } else {
	            return;
	          }
	        }

	        e = touches[0];
	      }

	      dragType = dragType || $(e.target).data('drag');

	      if (REGEXP_DRAG_TYPES.test(dragType)) {
	        event.preventDefault();

	        dragStartEvent = $.Event(EVENT_DRAG_START, {
	          originalEvent: originalEvent,
	          dragType: dragType
	        });

	        this.$element.trigger(dragStartEvent);

	        if (dragStartEvent.isDefaultPrevented()) {
	          return;
	        }

	        this.dragType = dragType;
	        this.cropping = false;
	        this.startX = e.pageX;
	        this.startY = e.pageY;

	        if (dragType === 'crop') {
	          this.cropping = true;
	          this.$dragBox.addClass(CLASS_MODAL);
	        }
	      }
	    },

	    dragmove: function dragmove(event) {
	      var options = this.options,
	          originalEvent = event.originalEvent,
	          touches = originalEvent && originalEvent.touches,
	          e = event,
	          dragType = this.dragType,
	          dragMoveEvent,
	          touchesLength;

	      if (this.disabled) {
	        return;
	      }

	      if (touches) {
	        touchesLength = touches.length;

	        if (touchesLength > 1) {
	          if (options.zoomable && options.touchDragZoom && touchesLength === 2) {
	            e = touches[1];
	            this.endX2 = e.pageX;
	            this.endY2 = e.pageY;
	          } else {
	            return;
	          }
	        }

	        e = touches[0];
	      }

	      if (dragType) {
	        event.preventDefault();

	        dragMoveEvent = $.Event(EVENT_DRAG_MOVE, {
	          originalEvent: originalEvent,
	          dragType: dragType
	        });

	        this.$element.trigger(dragMoveEvent);

	        if (dragMoveEvent.isDefaultPrevented()) {
	          return;
	        }

	        this.endX = e.pageX;
	        this.endY = e.pageY;

	        this.change();
	      }
	    },

	    dragend: function dragend(event) {
	      var dragType = this.dragType,
	          dragEndEvent;

	      if (this.disabled) {
	        return;
	      }

	      if (dragType) {
	        event.preventDefault();

	        dragEndEvent = $.Event(EVENT_DRAG_END, {
	          originalEvent: event.originalEvent,
	          dragType: dragType
	        });

	        this.$element.trigger(dragEndEvent);

	        if (dragEndEvent.isDefaultPrevented()) {
	          return;
	        }

	        if (this.cropping) {
	          this.cropping = false;
	          this.$dragBox.toggleClass(CLASS_MODAL, this.cropped && this.options.modal);
	        }

	        this.dragType = '';
	      }
	    }
	  });

	  $.extend(prototype, {
	    reset: function reset() {
	      if (!this.built || this.disabled) {
	        return;
	      }

	      this.image = $.extend({}, this.initialImage);
	      this.canvas = $.extend({}, this.initialCanvas);
	      this.renderCanvas();

	      if (this.cropped) {
	        this.cropBox = $.extend({}, this.initialCropBox);
	        this.renderCropBox();
	      }
	    },

	    clear: function clear() {
	      if (!this.cropped || this.disabled) {
	        return;
	      }

	      $.extend(this.cropBox, {
	        left: 0,
	        top: 0,
	        width: 0,
	        height: 0
	      });

	      this.cropped = false;
	      this.renderCropBox();

	      this.limitCanvas();
	      this.renderCanvas(); // Render canvas after render crop box

	      this.$dragBox.removeClass(CLASS_MODAL);
	      this.$cropBox.addClass(CLASS_HIDDEN);
	    },

	    destroy: function destroy() {
	      var $this = this.$element;

	      if (this.ready) {
	        this.unbuild();
	        $this.removeClass(CLASS_HIDDEN);
	      } else {
	        this.$clone.off('load').remove();
	      }

	      $this.removeData('cropper');
	    },

	    replace: function replace(url) {
	      if (!this.disabled && url) {
	        this.load(url);
	      }
	    },

	    enable: function enable() {
	      if (this.built) {
	        this.disabled = false;
	        this.$cropper.removeClass(CLASS_DISABLED);
	      }
	    },

	    disable: function disable() {
	      if (this.built) {
	        this.disabled = true;
	        this.$cropper.addClass(CLASS_DISABLED);
	      }
	    },

	    move: function move(offsetX, offsetY) {
	      var canvas = this.canvas;

	      if (this.built && !this.disabled && isNumber(offsetX) && isNumber(offsetY)) {
	        canvas.left += offsetX;
	        canvas.top += offsetY;
	        this.renderCanvas(true);
	      }
	    },

	    zoom: function zoom(delta) {
	      var canvas = this.canvas,
	          zoomEvent,
	          width,
	          height;

	      delta = num(delta);

	      if (delta && this.built && !this.disabled && this.options.zoomable) {
	        zoomEvent = delta > 0 ? $.Event(EVENT_ZOOM_IN) : $.Event(EVENT_ZOOM_OUT);
	        this.$element.trigger(zoomEvent);

	        if (zoomEvent.isDefaultPrevented()) {
	          return;
	        }

	        delta = delta <= -1 ? 1 / (1 - delta) : delta <= 1 ? 1 + delta : delta;
	        width = canvas.width * delta;
	        height = canvas.height * delta;
	        canvas.left -= (width - canvas.width) / 2;
	        canvas.top -= (height - canvas.height) / 2;
	        canvas.width = width;
	        canvas.height = height;
	        this.renderCanvas(true);
	        this.setDragMode('move');
	      }
	    },

	    rotate: function rotate(degree) {
	      var image = this.image;

	      degree = num(degree);

	      if (degree && this.built && !this.disabled && this.options.rotatable) {
	        image.rotate = (image.rotate + degree) % 360;
	        this.rotated = true;
	        this.renderCanvas(true);
	      }
	    },

	    getData: function getData() {
	      var cropBox = this.cropBox,
	          canvas = this.canvas,
	          image = this.image,
	          ratio,
	          data;

	      if (this.built && this.cropped) {
	        data = {
	          x: cropBox.left - canvas.left,
	          y: cropBox.top - canvas.top,
	          width: cropBox.width,
	          height: cropBox.height
	        };

	        ratio = image.width / image.naturalWidth;

	        $.each(data, function (i, n) {
	          n = n / ratio;
	          data[i] = n;
	        });
	      } else {
	        data = {
	          x: 0,
	          y: 0,
	          width: 0,
	          height: 0
	        };
	      }

	      data.rotate = image.rotate;

	      return data;
	    },

	    getContainerData: function getContainerData() {
	      return this.built ? this.container : {};
	    },

	    getImageData: function getImageData() {
	      return this.ready ? this.image : {};
	    },

	    getCanvasData: function getCanvasData() {
	      var canvas = this.canvas,
	          data;

	      if (this.built) {
	        data = {
	          left: canvas.left,
	          top: canvas.top,
	          width: canvas.width,
	          height: canvas.height
	        };
	      }

	      return data || {};
	    },

	    setCanvasData: function setCanvasData(data) {
	      var canvas = this.canvas,
	          aspectRatio = canvas.aspectRatio;

	      if (this.built && !this.disabled && $.isPlainObject(data)) {
	        if (isNumber(data.left)) {
	          canvas.left = data.left;
	        }

	        if (isNumber(data.top)) {
	          canvas.top = data.top;
	        }

	        if (isNumber(data.width)) {
	          canvas.width = data.width;
	          canvas.height = data.width / aspectRatio;
	        } else if (isNumber(data.height)) {
	          canvas.height = data.height;
	          canvas.width = data.height * aspectRatio;
	        }

	        this.renderCanvas(true);
	      }
	    },

	    getCropBoxData: function getCropBoxData() {
	      var cropBox = this.cropBox,
	          data;

	      if (this.built && this.cropped) {
	        data = {
	          left: cropBox.left,
	          top: cropBox.top,
	          width: cropBox.width,
	          height: cropBox.height
	        };
	      }

	      return data || {};
	    },

	    setCropBoxData: function setCropBoxData(data) {
	      var cropBox = this.cropBox,
	          aspectRatio = this.options.aspectRatio;

	      if (this.built && this.cropped && !this.disabled && $.isPlainObject(data)) {

	        if (isNumber(data.left)) {
	          cropBox.left = data.left;
	        }

	        if (isNumber(data.top)) {
	          cropBox.top = data.top;
	        }

	        if (aspectRatio) {
	          if (isNumber(data.width)) {
	            cropBox.width = data.width;
	            cropBox.height = cropBox.width / aspectRatio;
	          } else if (isNumber(data.height)) {
	            cropBox.height = data.height;
	            cropBox.width = cropBox.height * aspectRatio;
	          }
	        } else {
	          if (isNumber(data.width)) {
	            cropBox.width = data.width;
	          }

	          if (isNumber(data.height)) {
	            cropBox.height = data.height;
	          }
	        }

	        this.renderCropBox();
	      }
	    },

	    getCroppedCanvas: function getCroppedCanvas(options) {
	      var originalWidth, originalHeight, canvasWidth, canvasHeight, scaledWidth, scaledHeight, scaledRatio, aspectRatio, canvas, context, data;

	      if (!this.built || !this.cropped || !SUPPORT_CANVAS) {
	        return;
	      }

	      if (!$.isPlainObject(options)) {
	        options = {};
	      }

	      data = this.getData();
	      originalWidth = data.width;
	      originalHeight = data.height;
	      aspectRatio = originalWidth / originalHeight;

	      if ($.isPlainObject(options)) {
	        scaledWidth = options.width;
	        scaledHeight = options.height;

	        if (scaledWidth) {
	          scaledHeight = scaledWidth / aspectRatio;
	          scaledRatio = scaledWidth / originalWidth;
	        } else if (scaledHeight) {
	          scaledWidth = scaledHeight * aspectRatio;
	          scaledRatio = scaledHeight / originalHeight;
	        }
	      }

	      canvasWidth = scaledWidth || originalWidth;
	      canvasHeight = scaledHeight || originalHeight;

	      canvas = $('<canvas>')[0];
	      canvas.width = canvasWidth;
	      canvas.height = canvasHeight;
	      context = canvas.getContext('2d');

	      if (options.fillColor) {
	        context.fillStyle = options.fillColor;
	        context.fillRect(0, 0, canvasWidth, canvasHeight);
	      }

	      // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
	      context.drawImage.apply(context, function () {
	        var source = getSourceCanvas(this.$clone[0], this.image),
	            sourceWidth = source.width,
	            sourceHeight = source.height,
	            args = [source],
	            srcX = data.x,
	            // source canvas
	        srcY = data.y,
	            srcWidth,
	            srcHeight,
	            dstX,
	            // destination canvas
	        dstY,
	            dstWidth,
	            dstHeight;

	        if (srcX <= -originalWidth || srcX > sourceWidth) {
	          srcX = srcWidth = dstX = dstWidth = 0;
	        } else if (srcX <= 0) {
	          dstX = -srcX;
	          srcX = 0;
	          srcWidth = dstWidth = min(sourceWidth, originalWidth + srcX);
	        } else if (srcX <= sourceWidth) {
	          dstX = 0;
	          srcWidth = dstWidth = min(originalWidth, sourceWidth - srcX);
	        }

	        if (srcWidth <= 0 || srcY <= -originalHeight || srcY > sourceHeight) {
	          srcY = srcHeight = dstY = dstHeight = 0;
	        } else if (srcY <= 0) {
	          dstY = -srcY;
	          srcY = 0;
	          srcHeight = dstHeight = min(sourceHeight, originalHeight + srcY);
	        } else if (srcY <= sourceHeight) {
	          dstY = 0;
	          srcHeight = dstHeight = min(originalHeight, sourceHeight - srcY);
	        }

	        args.push(srcX, srcY, srcWidth, srcHeight);

	        // Scale destination sizes
	        if (scaledRatio) {
	          dstX *= scaledRatio;
	          dstY *= scaledRatio;
	          dstWidth *= scaledRatio;
	          dstHeight *= scaledRatio;
	        }

	        // Avoid "IndexSizeError" in IE and Firefox
	        if (dstWidth > 0 && dstHeight > 0) {
	          args.push(dstX, dstY, dstWidth, dstHeight);
	        }

	        return args;
	      }.call(this));

	      return canvas;
	    },

	    setAspectRatio: function setAspectRatio(aspectRatio) {
	      var options = this.options;

	      if (!this.disabled && !isUndefined(aspectRatio)) {
	        options.aspectRatio = num(aspectRatio) || NaN; // 0 -> NaN

	        if (this.built) {
	          this.initCropBox();

	          if (this.cropped) {
	            this.renderCropBox();
	          }
	        }
	      }
	    },

	    setDragMode: function setDragMode(mode) {
	      var $dragBox = this.$dragBox,
	          cropable = false,
	          movable = false;

	      if (!this.ready || this.disabled) {
	        return;
	      }

	      switch (mode) {
	        case 'crop':
	          if (this.options.dragCrop) {
	            cropable = true;
	            $dragBox.data('drag', mode);
	          } else {
	            movable = true;
	          }

	          break;

	        case 'move':
	          movable = true;
	          $dragBox.data('drag', mode);

	          break;

	        default:
	          $dragBox.removeData('drag');
	      }

	      $dragBox.toggleClass(CLASS_CROP, cropable).toggleClass(CLASS_MOVE, movable);
	    }
	  });

	  prototype.change = function () {
	    var dragType = this.dragType,
	        options = this.options,
	        canvas = this.canvas,
	        container = this.container,
	        cropBox = this.cropBox,
	        width = cropBox.width,
	        height = cropBox.height,
	        left = cropBox.left,
	        top = cropBox.top,
	        right = left + width,
	        bottom = top + height,
	        minLeft = 0,
	        minTop = 0,
	        maxWidth = container.width,
	        maxHeight = container.height,
	        renderable = true,
	        aspectRatio = options.aspectRatio,
	        range = {
	      x: this.endX - this.startX,
	      y: this.endY - this.startY
	    },
	        offset;

	    if (options.strict) {
	      minLeft = cropBox.minLeft;
	      minTop = cropBox.minTop;
	      maxWidth = minLeft + min(container.width, canvas.width);
	      maxHeight = minTop + min(container.height, canvas.height);
	    }

	    if (aspectRatio) {
	      range.X = range.y * aspectRatio;
	      range.Y = range.x / aspectRatio;
	    }

	    switch (dragType) {
	      // Move cropBox
	      case 'all':
	        left += range.x;
	        top += range.y;
	        break;

	      // Resize cropBox
	      case 'e':
	        if (range.x >= 0 && (right >= maxWidth || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
	          renderable = false;
	          break;
	        }

	        width += range.x;

	        if (aspectRatio) {
	          height = width / aspectRatio;
	          top -= range.Y / 2;
	        }

	        if (width < 0) {
	          dragType = 'w';
	          width = 0;
	        }

	        break;

	      case 'n':
	        if (range.y <= 0 && (top <= minTop || aspectRatio && (left <= minLeft || right >= maxWidth))) {
	          renderable = false;
	          break;
	        }

	        height -= range.y;
	        top += range.y;

	        if (aspectRatio) {
	          width = height * aspectRatio;
	          left += range.X / 2;
	        }

	        if (height < 0) {
	          dragType = 's';
	          height = 0;
	        }

	        break;

	      case 'w':
	        if (range.x <= 0 && (left <= minLeft || aspectRatio && (top <= minTop || bottom >= maxHeight))) {
	          renderable = false;
	          break;
	        }

	        width -= range.x;
	        left += range.x;

	        if (aspectRatio) {
	          height = width / aspectRatio;
	          top += range.Y / 2;
	        }

	        if (width < 0) {
	          dragType = 'e';
	          width = 0;
	        }

	        break;

	      case 's':
	        if (range.y >= 0 && (bottom >= maxHeight || aspectRatio && (left <= minLeft || right >= maxWidth))) {
	          renderable = false;
	          break;
	        }

	        height += range.y;

	        if (aspectRatio) {
	          width = height * aspectRatio;
	          left -= range.X / 2;
	        }

	        if (height < 0) {
	          dragType = 'n';
	          height = 0;
	        }

	        break;

	      case 'ne':
	        if (aspectRatio) {
	          if (range.y <= 0 && (top <= minTop || right >= maxWidth)) {
	            renderable = false;
	            break;
	          }

	          height -= range.y;
	          top += range.y;
	          width = height * aspectRatio;
	        } else {
	          if (range.x >= 0) {
	            if (right < maxWidth) {
	              width += range.x;
	            } else if (range.y <= 0 && top <= minTop) {
	              renderable = false;
	            }
	          } else {
	            width += range.x;
	          }

	          if (range.y <= 0) {
	            if (top > 0) {
	              height -= range.y;
	              top += range.y;
	            }
	          } else {
	            height -= range.y;
	            top += range.y;
	          }
	        }

	        if (width < 0 && height < 0) {
	          dragType = 'sw';
	          height = 0;
	          width = 0;
	        } else if (width < 0) {
	          dragType = 'nw';
	          width = 0;
	        } else if (height < 0) {
	          dragType = 'se';
	          height = 0;
	        }

	        break;

	      case 'nw':
	        if (aspectRatio) {
	          if (range.y <= 0 && (top <= minTop || left <= minLeft)) {
	            renderable = false;
	            break;
	          }

	          height -= range.y;
	          top += range.y;
	          width = height * aspectRatio;
	          left += range.X;
	        } else {
	          if (range.x <= 0) {
	            if (left > 0) {
	              width -= range.x;
	              left += range.x;
	            } else if (range.y <= 0 && top <= minTop) {
	              renderable = false;
	            }
	          } else {
	            width -= range.x;
	            left += range.x;
	          }

	          if (range.y <= 0) {
	            if (top > 0) {
	              height -= range.y;
	              top += range.y;
	            }
	          } else {
	            height -= range.y;
	            top += range.y;
	          }
	        }

	        if (width < 0 && height < 0) {
	          dragType = 'se';
	          height = 0;
	          width = 0;
	        } else if (width < 0) {
	          dragType = 'ne';
	          width = 0;
	        } else if (height < 0) {
	          dragType = 'sw';
	          height = 0;
	        }

	        break;

	      case 'sw':
	        if (aspectRatio) {
	          if (range.x <= 0 && (left <= minLeft || bottom >= maxHeight)) {
	            renderable = false;
	            break;
	          }

	          width -= range.x;
	          left += range.x;
	          height = width / aspectRatio;
	        } else {
	          if (range.x <= 0) {
	            if (left > 0) {
	              width -= range.x;
	              left += range.x;
	            } else if (range.y >= 0 && bottom >= maxHeight) {
	              renderable = false;
	            }
	          } else {
	            width -= range.x;
	            left += range.x;
	          }

	          if (range.y >= 0) {
	            if (bottom < maxHeight) {
	              height += range.y;
	            }
	          } else {
	            height += range.y;
	          }
	        }

	        if (width < 0 && height < 0) {
	          dragType = 'ne';
	          height = 0;
	          width = 0;
	        } else if (width < 0) {
	          dragType = 'se';
	          width = 0;
	        } else if (height < 0) {
	          dragType = 'nw';
	          height = 0;
	        }

	        break;

	      case 'se':
	        if (aspectRatio) {
	          if (range.x >= 0 && (right >= maxWidth || bottom >= maxHeight)) {
	            renderable = false;
	            break;
	          }

	          width += range.x;
	          height = width / aspectRatio;
	        } else {
	          if (range.x >= 0) {
	            if (right < maxWidth) {
	              width += range.x;
	            } else if (range.y >= 0 && bottom >= maxHeight) {
	              renderable = false;
	            }
	          } else {
	            width += range.x;
	          }

	          if (range.y >= 0) {
	            if (bottom < maxHeight) {
	              height += range.y;
	            }
	          } else {
	            height += range.y;
	          }
	        }

	        if (width < 0 && height < 0) {
	          dragType = 'nw';
	          height = 0;
	          width = 0;
	        } else if (width < 0) {
	          dragType = 'sw';
	          width = 0;
	        } else if (height < 0) {
	          dragType = 'ne';
	          height = 0;
	        }

	        break;

	      // Move image
	      case 'move':
	        canvas.left += range.x;
	        canvas.top += range.y;
	        this.renderCanvas(true);
	        renderable = false;
	        break;

	      // Scale image
	      case 'zoom':
	        this.zoom(function (x1, y1, x2, y2) {
	          var z1 = sqrt(x1 * x1 + y1 * y1),
	              z2 = sqrt(x2 * x2 + y2 * y2);

	          return (z2 - z1) / z1;
	        }(abs(this.startX - this.startX2), abs(this.startY - this.startY2), abs(this.endX - this.endX2), abs(this.endY - this.endY2)));

	        this.startX2 = this.endX2;
	        this.startY2 = this.endY2;
	        renderable = false;
	        break;

	      // Crop image
	      case 'crop':
	        if (range.x && range.y) {
	          offset = this.$cropper.offset();
	          left = this.startX - offset.left;
	          top = this.startY - offset.top;
	          width = cropBox.minWidth;
	          height = cropBox.minHeight;

	          if (range.x > 0) {
	            if (range.y > 0) {
	              dragType = 'se';
	            } else {
	              dragType = 'ne';
	              top -= height;
	            }
	          } else {
	            if (range.y > 0) {
	              dragType = 'sw';
	              left -= width;
	            } else {
	              dragType = 'nw';
	              left -= width;
	              top -= height;
	            }
	          }

	          // Show the cropBox if is hidden
	          if (!this.cropped) {
	            this.cropped = true;
	            this.$cropBox.removeClass(CLASS_HIDDEN);
	          }
	        }

	        break;

	      // No default
	    }

	    if (renderable) {
	      cropBox.width = width;
	      cropBox.height = height;
	      cropBox.left = left;
	      cropBox.top = top;
	      this.dragType = dragType;

	      this.renderCropBox();
	    }

	    // Override
	    this.startX = this.endX;
	    this.startY = this.endY;
	  };

	  $.extend(Cropper.prototype, prototype);

	  Cropper.DEFAULTS = {
	    // Defines the aspect ratio of the crop box
	    // Type: Number
	    aspectRatio: NaN,

	    // Defines the percentage of automatic cropping area when initializes
	    // Type: Number (Must large than 0 and less than 1)
	    autoCropArea: 0.8, // 80%

	    // Outputs the cropping results.
	    // Type: Function
	    crop: null,

	    // Add extra containers for previewing
	    // Type: String (jQuery selector)
	    preview: '',

	    // Toggles
	    strict: true, // strict mode, the image cannot zoom out less than the container
	    responsive: true, // Rebuild when resize the window
	    checkImageOrigin: true, // Check if the target image is cross origin

	    modal: true, // Show the black modal
	    guides: true, // Show the dashed lines for guiding
	    highlight: true, // Show the white modal to highlight the crop box
	    background: true, // Show the grid background

	    autoCrop: true, // Enable to crop the image automatically when initialize
	    dragCrop: true, // Enable to create new crop box by dragging over the image
	    movable: true, // Enable to move the crop box
	    resizable: true, // Enable to resize the crop box
	    rotatable: true, // Enable to rotate the image
	    zoomable: true, // Enable to zoom the image
	    touchDragZoom: true, // Enable to zoom the image by wheeling mouse
	    mouseWheelZoom: true, // Enable to zoom the image by dragging touch

	    // Dimensions
	    minCanvasWidth: 0,
	    minCanvasHeight: 0,
	    minCropBoxWidth: 0,
	    minCropBoxHeight: 0,
	    minContainerWidth: 200,
	    minContainerHeight: 100,

	    // Events
	    build: null, // Function
	    built: null, // Function
	    dragstart: null, // Function
	    dragmove: null, // Function
	    dragend: null, // Function
	    zoomin: null, // Function
	    zoomout: null // Function
	  };

	  Cropper.setDefaults = function (options) {
	    $.extend(Cropper.DEFAULTS, options);
	  };

	  // Use the string compressor: Strmin (https://github.com/fengyuanchen/strmin)
	  Cropper.TEMPLATE = function (source, words) {
	    words = words.split(',');
	    return source.replace(/\d+/g, function (i) {
	      return words[i];
	    });
	  }('<0 6="5-container"><0 6="5-canvas"></0><0 6="5-2-9" 3-2="move"></0><0 6="5-crop-9"><1 6="5-view-9"></1><1 6="5-8 8-h"></1><1 6="5-8 8-v"></1><1 6="5-face" 3-2="all"></1><1 6="5-7 7-e" 3-2="e"></1><1 6="5-7 7-n" 3-2="n"></1><1 6="5-7 7-w" 3-2="w"></1><1 6="5-7 7-s" 3-2="s"></1><1 6="5-4 4-e" 3-2="e"></1><1 6="5-4 4-n" 3-2="n"></1><1 6="5-4 4-w" 3-2="w"></1><1 6="5-4 4-s" 3-2="s"></1><1 6="5-4 4-ne" 3-2="ne"></1><1 6="5-4 4-nw" 3-2="nw"></1><1 6="5-4 4-sw" 3-2="sw"></1><1 6="5-4 4-se" 3-2="se"></1></0></0>', 'div,span,drag,data,point,cropper,class,line,dashed,box');

	  /* Template source:
	  <div class="cropper-container">
	    <div class="cropper-canvas"></div>
	    <div class="cropper-drag-box" data-drag="move"></div>
	    <div class="cropper-crop-box">
	      <span class="cropper-view-box"></span>
	      <span class="cropper-dashed dashed-h"></span>
	      <span class="cropper-dashed dashed-v"></span>
	      <span class="cropper-face" data-drag="all"></span>
	      <span class="cropper-line line-e" data-drag="e"></span>
	      <span class="cropper-line line-n" data-drag="n"></span>
	      <span class="cropper-line line-w" data-drag="w"></span>
	      <span class="cropper-line line-s" data-drag="s"></span>
	      <span class="cropper-point point-e" data-drag="e"></span>
	      <span class="cropper-point point-n" data-drag="n"></span>
	      <span class="cropper-point point-w" data-drag="w"></span>
	      <span class="cropper-point point-s" data-drag="s"></span>
	      <span class="cropper-point point-ne" data-drag="ne"></span>
	      <span class="cropper-point point-nw" data-drag="nw"></span>
	      <span class="cropper-point point-sw" data-drag="sw"></span>
	      <span class="cropper-point point-se" data-drag="se"></span>
	    </div>
	  </div>
	  */

	  // Save the other cropper
	  Cropper.other = $.fn.cropper;

	  // Register as jQuery plugin
	  $.fn.cropper = function (options) {
	    var args = toArray(arguments, 1),
	        result;

	    this.each(function () {
	      var $this = $(this),
	          data = $this.data('cropper'),
	          fn;

	      if (!data) {
	        $this.data('cropper', data = new Cropper(this, options));
	      }

	      if (typeof options === 'string' && $.isFunction(fn = data[options])) {
	        result = fn.apply(data, args);
	      }
	    });

	    return isUndefined(result) ? this : result;
	  };

	  $.fn.cropper.Constructor = Cropper;
	  $.fn.cropper.setDefaults = Cropper.setDefaults;

	  // No conflict
	  $.fn.cropper.noConflict = function () {
	    $.fn.cropper = Cropper.other;
	    return this;
	  };
	});

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v3.1.1
	 * https://jquery.com/
	 *
	 * Includes Sizzle.js
	 * https://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * https://jquery.org/license
	 *
	 * Date: 2016-09-22T22:30Z
	 */
	( function( global, factory ) {

		"use strict";

		if ( typeof module === "object" && typeof module.exports === "object" ) {

			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}

	// Pass this if window is not defined yet
	} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

	// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
	// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
	// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
	// enough that all such attempts are guarded in a try block.
	"use strict";

	var arr = [];

	var document = window.document;

	var getProto = Object.getPrototypeOf;

	var slice = arr.slice;

	var concat = arr.concat;

	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var fnToString = hasOwn.toString;

	var ObjectFunctionString = fnToString.call( Object );

	var support = {};



		function DOMEval( code, doc ) {
			doc = doc || document;

			var script = doc.createElement( "script" );

			script.text = code;
			doc.head.appendChild( script ).parentNode.removeChild( script );
		}
	/* global Symbol */
	// Defining this global in .eslintrc.json would create a danger of using the global
	// unguarded in another place, it seems safer to define global only for this module



	var
		version = "3.1.1",

		// Define a local copy of jQuery
		jQuery = function( selector, context ) {

			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},

		// Support: Android <=4.0 only
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([a-z])/g,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};

	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function() {
			return slice.call( this );
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {

			// Return all the elements in a clean array
			if ( num == null ) {
				return slice.call( this );
			}

			// Return just the one element from the set
			return num < 0 ? this[ num + this.length ] : this[ num ];
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each: function( callback ) {
			return jQuery.each( this, callback );
		},

		map: function( callback ) {
			return this.pushStack( jQuery.map( this, function( elem, i ) {
				return callback.call( elem, i, elem );
			} ) );
		},

		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},

		first: function() {
			return this.eq( 0 );
		},

		last: function() {
			return this.eq( -1 );
		},

		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
		},

		end: function() {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[ 0 ] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;

			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {

			// Only deal with non-null/undefined values
			if ( ( options = arguments[ i ] ) != null ) {

				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];

					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
						( copyIsArray = jQuery.isArray( copy ) ) ) ) {

						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray( src ) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject( src ) ? src : {};
						}

						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );

					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend( {

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function( msg ) {
			throw new Error( msg );
		},

		noop: function() {},

		isFunction: function( obj ) {
			return jQuery.type( obj ) === "function";
		},

		isArray: Array.isArray,

		isWindow: function( obj ) {
			return obj != null && obj === obj.window;
		},

		isNumeric: function( obj ) {

			// As of jQuery 3.0, isNumeric is limited to
			// strings and numbers (primitives or objects)
			// that can be coerced to finite numbers (gh-2662)
			var type = jQuery.type( obj );
			return ( type === "number" || type === "string" ) &&

				// parseFloat NaNs numeric-cast false positives ("")
				// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
				// subtraction forces infinities to NaN
				!isNaN( obj - parseFloat( obj ) );
		},

		isPlainObject: function( obj ) {
			var proto, Ctor;

			// Detect obvious negatives
			// Use toString instead of jQuery.type to catch host objects
			if ( !obj || toString.call( obj ) !== "[object Object]" ) {
				return false;
			}

			proto = getProto( obj );

			// Objects with no prototype (e.g., `Object.create( null )`) are plain
			if ( !proto ) {
				return true;
			}

			// Objects with prototype are plain iff they were constructed by a global Object function
			Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
			return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
		},

		isEmptyObject: function( obj ) {

			/* eslint-disable no-unused-vars */
			// See https://github.com/eslint/eslint/issues/6125
			var name;

			for ( name in obj ) {
				return false;
			}
			return true;
		},

		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}

			// Support: Android <=2.3 only (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call( obj ) ] || "object" :
				typeof obj;
		},

		// Evaluates a script in a global context
		globalEval: function( code ) {
			DOMEval( code );
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE <=9 - 11, Edge 12 - 13
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},

		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		each: function( obj, callback ) {
			var length, i = 0;

			if ( isArrayLike( obj ) ) {
				length = obj.length;
				for ( ; i < length; i++ ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
						break;
					}
				}
			}

			return obj;
		},

		// Support: Android <=4.0 only
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];

			if ( arr != null ) {
				if ( isArrayLike( Object( arr ) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}

			return ret;
		},

		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},

		// Support: Android <=4.0 only, PhantomJS 1 only
		// push.apply(_, arraylike) throws on ancient WebKit
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;

			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}

			first.length = i;

			return first;
		},

		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var length, value,
				i = 0,
				ret = [];

			// Go through the array, translating each of the items to their new values
			if ( isArrayLike( elems ) ) {
				length = elems.length;
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}

			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );

					if ( value != null ) {
						ret.push( value );
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply( [], ret );
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var tmp, args, proxy;

			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}

			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	} );

	if ( typeof Symbol === "function" ) {
		jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
	}

	// Populate the class2type map
	jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

	function isArrayLike( obj ) {

		// Support: real iOS 8.2 only (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type( obj );

		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.3.3
	 * https://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2016-08-08
	 */
	(function( window ) {

	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,

		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,

		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},

		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// https://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},

		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

		// Regular expressions

		// http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",

		// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",

		pseudos = ":(" + identifier + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",

		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),

		matchExpr = {
			"ID": new RegExp( "^#(" + identifier + ")" ),
			"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
			"TAG": new RegExp( "^(" + identifier + "|[*])" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},

		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,

		rnative = /^[^{]+\{\s*\[native \w/,

		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

		rsibling = /[+~]/,

		// CSS escapes
		// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},

		// CSS string/identifier serialization
		// https://drafts.csswg.org/cssom/#common-serializing-idioms
		rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
		fcssescape = function( ch, asCodePoint ) {
			if ( asCodePoint ) {

				// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
				if ( ch === "\0" ) {
					return "\uFFFD";
				}

				// Control characters and (dependent upon position) numbers get escaped as code points
				return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
			}

			// Other potentially-special ASCII characters get backslash-escaped
			return "\\" + ch;
		},

		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		},

		disabledAncestor = addCombinator(
			function( elem ) {
				return elem.disabled === true && ("form" in elem || "label" in elem);
			},
			{ dir: "parentNode", next: "legend" }
		);

	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?

			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :

			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}

	function Sizzle( selector, context, results, seed ) {
		var m, i, elem, nid, match, groups, newSelector,
			newContext = context && context.ownerDocument,

			// nodeType defaults to 9, since context defaults to document
			nodeType = context ? context.nodeType : 9;

		results = results || [];

		// Return early from calls with invalid selector or context
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

			return results;
		}

		// Try to shortcut find operations (as opposed to filters) in HTML documents
		if ( !seed ) {

			if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
				setDocument( context );
			}
			context = context || document;

			if ( documentIsHTML ) {

				// If the selector is sufficiently simple, try using a "get*By*" DOM method
				// (excepting DocumentFragment context, where the methods don't exist)
				if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

					// ID selector
					if ( (m = match[1]) ) {

						// Document context
						if ( nodeType === 9 ) {
							if ( (elem = context.getElementById( m )) ) {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if ( elem.id === m ) {
									results.push( elem );
									return results;
								}
							} else {
								return results;
							}

						// Element context
						} else {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( newContext && (elem = newContext.getElementById( m )) &&
								contains( context, elem ) &&
								elem.id === m ) {

								results.push( elem );
								return results;
							}
						}

					// Type selector
					} else if ( match[2] ) {
						push.apply( results, context.getElementsByTagName( selector ) );
						return results;

					// Class selector
					} else if ( (m = match[3]) && support.getElementsByClassName &&
						context.getElementsByClassName ) {

						push.apply( results, context.getElementsByClassName( m ) );
						return results;
					}
				}

				// Take advantage of querySelectorAll
				if ( support.qsa &&
					!compilerCache[ selector + " " ] &&
					(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

					if ( nodeType !== 1 ) {
						newContext = context;
						newSelector = selector;

					// qSA looks outside Element context, which is not what we want
					// Thanks to Andrew Dupont for this workaround technique
					// Support: IE <=8
					// Exclude object elements
					} else if ( context.nodeName.toLowerCase() !== "object" ) {

						// Capture the context ID, setting it first if necessary
						if ( (nid = context.getAttribute( "id" )) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", (nid = expando) );
						}

						// Prefix every selector in the list
						groups = tokenize( selector );
						i = groups.length;
						while ( i-- ) {
							groups[i] = "#" + nid + " " + toSelector( groups[i] );
						}
						newSelector = groups.join( "," );

						// Expand context for sibling selectors
						newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
							context;
					}

					if ( newSelector ) {
						try {
							push.apply( results,
								newContext.querySelectorAll( newSelector )
							);
							return results;
						} catch ( qsaError ) {
						} finally {
							if ( nid === expando ) {
								context.removeAttribute( "id" );
							}
						}
					}
				}
			}
		}

		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}

	/**
	 * Create key-value caches of limited size
	 * @returns {function(string, object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];

		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}

	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}

	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created element and returns a boolean result
	 */
	function assert( fn ) {
		var el = document.createElement("fieldset");

		try {
			return !!fn( el );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( el.parentNode ) {
				el.parentNode.removeChild( el );
			}
			// release memory in IE
			el = null;
		}
	}

	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = arr.length;

		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}

	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				a.sourceIndex - b.sourceIndex;

		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}

		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}

		return a ? 1 : -1;
	}

	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}

	/**
	 * Returns a function to use in pseudos for :enabled/:disabled
	 * @param {Boolean} disabled true for :disabled; false for :enabled
	 */
	function createDisabledPseudo( disabled ) {

		// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
		return function( elem ) {

			// Only certain elements can match :enabled or :disabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
			// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
			if ( "form" in elem ) {

				// Check for inherited disabledness on relevant non-disabled elements:
				// * listed form-associated elements in a disabled fieldset
				//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
				// * option elements in a disabled optgroup
				//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
				// All such elements have a "form" property.
				if ( elem.parentNode && elem.disabled === false ) {

					// Option elements defer to a parent optgroup if present
					if ( "label" in elem ) {
						if ( "label" in elem.parentNode ) {
							return elem.parentNode.disabled === disabled;
						} else {
							return elem.disabled === disabled;
						}
					}

					// Support: IE 6 - 11
					// Use the isDisabled shortcut property to check for disabled fieldset ancestors
					return elem.isDisabled === disabled ||

						// Where there is no isDisabled, check manually
						/* jshint -W018 */
						elem.isDisabled !== !disabled &&
							disabledAncestor( elem ) === disabled;
				}

				return elem.disabled === disabled;

			// Try to winnow out elements that can't be disabled before trusting the disabled property.
			// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
			// even exist on them, let alone have a boolean value.
			} else if ( "label" in elem ) {
				return elem.disabled === disabled;
			}

			// Remaining elements are neither :enabled nor :disabled
			return false;
		};
	}

	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;

				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}

	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}

	// Expose support vars for convenience
	support = Sizzle.support = {};

	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};

	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, subWindow,
			doc = node ? node.ownerDocument || node : preferredDoc;

		// Return early if doc is invalid or already selected
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}

		// Update global variables
		document = doc;
		docElem = document.documentElement;
		documentIsHTML = !isXML( document );

		// Support: IE 9-11, Edge
		// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
		if ( preferredDoc !== document &&
			(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

			// Support: IE 11, Edge
			if ( subWindow.addEventListener ) {
				subWindow.addEventListener( "unload", unloadHandler, false );

			// Support: IE 9 - 10 only
			} else if ( subWindow.attachEvent ) {
				subWindow.attachEvent( "onunload", unloadHandler );
			}
		}

		/* Attributes
		---------------------------------------------------------------------- */

		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( el ) {
			el.className = "i";
			return !el.getAttribute("className");
		});

		/* getElement(s)By*
		---------------------------------------------------------------------- */

		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( el ) {
			el.appendChild( document.createComment("") );
			return !el.getElementsByTagName("*").length;
		});

		// Support: IE<9
		support.getElementsByClassName = rnative.test( document.getElementsByClassName );

		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programmatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( el ) {
			docElem.appendChild( el ).id = expando;
			return !document.getElementsByName || !document.getElementsByName( expando ).length;
		});

		// ID filter and find
		if ( support.getById ) {
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var elem = context.getElementById( id );
					return elem ? [ elem ] : [];
				}
			};
		} else {
			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" &&
						elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};

			// Support: IE 6 - 7 only
			// getElementById is not reliable as a find shortcut
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var node, i, elems,
						elem = context.getElementById( id );

					if ( elem ) {

						// Verify the id attribute
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}

						// Fall back on getElementsByName
						elems = context.getElementsByName( id );
						i = 0;
						while ( (elem = elems[i++]) ) {
							node = elem.getAttributeNode("id");
							if ( node && node.value === id ) {
								return [ elem ];
							}
						}
					}

					return [];
				}
			};
		}

		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );

				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :

			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			};

		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};

		/* QSA/matchesSelector
		---------------------------------------------------------------------- */

		// QSA and matchesSelector support

		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];

		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See https://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];

		if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( el ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// https://bugs.jquery.com/ticket/12359
				docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\r\\' msallowcapture=''>" +
					"<option selected=''></option></select>";

				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( el.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}

				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !el.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}

				// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
				if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}

				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !el.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}

				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibling-combinator selector` fails
				if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});

			assert(function( el ) {
				el.innerHTML = "<a href='' disabled='disabled'></a>" +
					"<select disabled='disabled'><option/></select>";

				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = document.createElement("input");
				input.setAttribute( "type", "hidden" );
				el.appendChild( input ).setAttribute( "name", "D" );

				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( el.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}

				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( el.querySelectorAll(":enabled").length !== 2 ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Support: IE9-11+
				// IE's :disabled selector does not pick up the children of disabled fieldsets
				docElem.appendChild( el ).disabled = true;
				if ( el.querySelectorAll(":disabled").length !== 2 ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}

				// Opera 10-11 does not throw on post-comma invalid pseudos
				el.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}

		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {

			assert(function( el ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( el, "*" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( el, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );

		// Element contains another
		// Purposefully self-exclusive
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};

		/* Sorting
		---------------------------------------------------------------------- */

		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {

			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}

			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :

				// Otherwise we know they are disconnected
				1;

			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}

			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];

			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === document ? -1 :
					b === document ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;

			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}

			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}

			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}

			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :

				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};

		return document;
	};

	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};

	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );

		if ( support.matchesSelector && documentIsHTML &&
			!compilerCache[ expr + " " ] &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

			try {
				var ret = matches.call( elem, expr );

				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}

		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};

	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};

	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}

		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;

		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};

	Sizzle.escape = function( sel ) {
		return (sel + "").replace( rcssescape, fcssescape );
	};

	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};

	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;

		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}

		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;

		return results;
	};

	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;

		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes

		return ret;
	};

	Expr = Sizzle.selectors = {

		// Can be adjusted by the user
		cacheLength: 50,

		createPseudo: markFunction,

		match: matchExpr,

		attrHandle: {},

		find: {},

		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},

		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );

				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}

				return match.slice( 0, 4 );
			},

			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();

				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}

					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}

				return match;
			},

			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];

				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}

				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";

				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}

				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},

		filter: {

			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},

			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];

				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},

			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );

					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}

					result += "";

					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},

			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";

				return first === 1 && last === 0 ?

					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :

					function( elem, context, xml ) {
						var cache, uniqueCache, outerCache, node, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType,
							diff = false;

						if ( parent ) {

							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) {

											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}

							start = [ forward ? parent.firstChild : parent.lastChild ];

							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {

								// Seek `elem` from a previously-cached index

								// ...in a gzip-friendly way
								node = parent;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex && cache[ 2 ];
								node = nodeIndex && parent.childNodes[ nodeIndex ];

								while ( (node = ++nodeIndex && node && node[ dir ] ||

									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {

									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}

							} else {
								// Use previously-cached element index if available
								if ( useCache ) {
									// ...in a gzip-friendly way
									node = elem;
									outerCache = node[ expando ] || (node[ expando ] = {});

									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[ node.uniqueID ] ||
										(outerCache[ node.uniqueID ] = {});

									cache = uniqueCache[ type ] || [];
									nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
									diff = nodeIndex;
								}

								// xml :nth-child(...)
								// or :nth-last-child(...) or :nth(-last)?-of-type(...)
								if ( diff === false ) {
									// Use the same loop as above to seek `elem` from the start
									while ( (node = ++nodeIndex && node && node[ dir ] ||
										(diff = nodeIndex = 0) || start.pop()) ) {

										if ( ( ofType ?
											node.nodeName.toLowerCase() === name :
											node.nodeType === 1 ) &&
											++diff ) {

											// Cache the index of each encountered element
											if ( useCache ) {
												outerCache = node[ expando ] || (node[ expando ] = {});

												// Support: IE <9 only
												// Defend against cloned attroperties (jQuery gh-1709)
												uniqueCache = outerCache[ node.uniqueID ] ||
													(outerCache[ node.uniqueID ] = {});

												uniqueCache[ type ] = [ dirruns, diff ];
											}

											if ( node === elem ) {
												break;
											}
										}
									}
								}
							}

							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},

			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );

				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}

				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}

				return fn;
			}
		},

		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );

				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;

						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),

			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),

			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),

			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),

			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},

			"root": function( elem ) {
				return elem === docElem;
			},

			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},

			// Boolean properties
			"enabled": createDisabledPseudo( false ),
			"disabled": createDisabledPseudo( true ),

			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},

			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}

				return elem.selected === true;
			},

			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},

			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},

			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},

			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},

			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},

			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&

					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},

			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),

			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),

			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),

			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),

			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};

	Expr.pseudos["nth"] = Expr.pseudos["eq"];

	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}

	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();

	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];

		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}

		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;

		while ( soFar ) {

			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}

			matched = false;

			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}

			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}

			if ( !matched ) {
				break;
			}
		}

		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};

	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}

	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			skip = combinator.next,
			key = skip || dir,
			checkNonElements = base && key === "parentNode",
			doneName = done++;

		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
				return false;
			} :

			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, uniqueCache, outerCache,
					newCache = [ dirruns, doneName ];

				// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

							if ( skip && skip === elem.nodeName.toLowerCase() ) {
								elem = elem[ dir ] || elem;
							} else if ( (oldCache = uniqueCache[ key ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								uniqueCache[ key ] = newCache;

								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
				return false;
			};
	}

	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}

	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}

	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;

		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}

		return newUnmatched;
	}

	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,

				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,

				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

						// ...intermediate processing is necessary
						[] :

						// ...otherwise use results directly
						results :
					matcherIn;

			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}

			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );

				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}

			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}

					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

							seed[temp] = !(results[temp] = elem);
						}
					}
				}

			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}

	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,

			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];

		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}

		return elementMatcher( matchers );
	}

	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;

				if ( outermost ) {
					outermostContext = context === document || context || outermost;
				}

				// Add elements passing elementMatchers directly to results
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						if ( !context && elem.ownerDocument !== document ) {
							setDocument( elem );
							xml = !documentIsHTML;
						}
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context || document, xml) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}

					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}

						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}

				// `i` is now the count of elements visited above, and adding it to `matchedCount`
				// makes the latter nonnegative.
				matchedCount += i;

				// Apply set filters to unmatched elements
				// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
				// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
				// no element matchers and no seed.
				// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
				// case, which will result in a "00" `matchedCount` that differs from `i` but is also
				// numerically zero.
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}

					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}

						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}

					// Add matches to results
					push.apply( results, setMatched );

					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {

						Sizzle.uniqueSort( results );
					}
				}

				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}

				return unmatched;
			};

		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}

	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];

		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}

			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};

	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );

		results = results || [];

		// Try to minimize operations if there is only one selector in the list and no seed
		// (the latter of which guarantees us context)
		if ( match.length === 1 ) {

			// Reduce context if the leading compound selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;

				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}

		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};

	// One-time assignments

	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;

	// Initialize against the default document
	setDocument();

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( el ) {
		// Should return 1, but returns 4 (following)
		return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
	});

	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( el ) {
		el.innerHTML = "<a href='#'></a>";
		return el.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}

	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( el ) {
		el.innerHTML = "<input/>";
		el.firstChild.setAttribute( "value", "" );
		return el.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}

	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( el ) {
		return el.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}

	return Sizzle;

	})( window );



	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;

	// Deprecated
	jQuery.expr[ ":" ] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	jQuery.escapeSelector = Sizzle.escape;




	var dir = function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	};


	var siblings = function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	};


	var rneedsContext = jQuery.expr.match.needsContext;

	var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



	var risSimple = /^.[^:#\[\.,]*$/;

	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				return !!qualifier.call( elem, i, elem ) !== not;
			} );
		}

		// Single element
		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			} );
		}

		// Arraylike of elements (jQuery, arguments, Array)
		if ( typeof qualifier !== "string" ) {
			return jQuery.grep( elements, function( elem ) {
				return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
			} );
		}

		// Simple selector that can be filtered directly, removing non-Elements
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		// Complex selector, compare the two sets, removing non-Elements
		qualifier = jQuery.filter( qualifier, elements );
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not && elem.nodeType === 1;
		} );
	}

	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		if ( elems.length === 1 && elem.nodeType === 1 ) {
			return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
		}

		return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		} ) );
	};

	jQuery.fn.extend( {
		find: function( selector ) {
			var i, ret,
				len = this.length,
				self = this;

			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter( function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				} ) );
			}

			ret = this.pushStack( [] );

			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}

			return len > 1 ? jQuery.uniqueSort( ret ) : ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow( this, selector || [], false ) );
		},
		not: function( selector ) {
			return this.pushStack( winnow( this, selector || [], true ) );
		},
		is: function( selector ) {
			return !!winnow(
				this,

				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	} );


	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,

		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		// Shortcut simple #id case for speed
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

		init = jQuery.fn.init = function( selector, context, root ) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}

			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;

			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[ 0 ] === "<" &&
					selector[ selector.length - 1 ] === ">" &&
					selector.length >= 3 ) {

					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];

				} else {
					match = rquickExpr.exec( selector );
				}

				// Match html or make sure no context is specified for #id
				if ( match && ( match[ 1 ] || !context ) ) {

					// HANDLE: $(html) -> $(array)
					if ( match[ 1 ] ) {
						context = context instanceof jQuery ? context[ 0 ] : context;

						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[ 1 ],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );

						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {

								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );

								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}

						return this;

					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[ 2 ] );

						if ( elem ) {

							// Inject the element directly into the jQuery object
							this[ 0 ] = elem;
							this.length = 1;
						}
						return this;
					}

				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || root ).find( selector );

				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}

			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this[ 0 ] = selector;
				this.length = 1;
				return this;

			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return root.ready !== undefined ?
					root.ready( selector ) :

					// Execute immediately if ready is not present
					selector( jQuery );
			}

			return jQuery.makeArray( selector, this );
		};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery( document );


	var rparentsprev = /^(?:parents|prev(?:Until|All))/,

		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.fn.extend( {
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;

			return this.filter( function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[ i ] ) ) {
						return true;
					}
				}
			} );
		},

		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				targets = typeof selectors !== "string" && jQuery( selectors );

			// Positional selectors never match, since there's no _selection_ context
			if ( !rneedsContext.test( selectors ) ) {
				for ( ; i < l; i++ ) {
					for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

						// Always skip document fragments
						if ( cur.nodeType < 11 && ( targets ?
							targets.index( cur ) > -1 :

							// Don't pass non-elements to Sizzle
							cur.nodeType === 1 &&
								jQuery.find.matchesSelector( cur, selectors ) ) ) {

							matched.push( cur );
							break;
						}
					}
				}
			}

			return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
		},

		// Determine the position of an element within the set
		index: function( elem ) {

			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}

			// Locate the position of the desired element
			return indexOf.call( this,

				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},

		add: function( selector, context ) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},

		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter( selector )
			);
		}
	} );

	function sibling( cur, dir ) {
		while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
		return cur;
	}

	jQuery.each( {
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return siblings( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return siblings( elem.firstChild );
		},
		contents: function( elem ) {
			return elem.contentDocument || jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );

			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}

			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}

			if ( this.length > 1 ) {

				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.uniqueSort( matched );
				}

				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}

			return this.pushStack( matched );
		};
	} );
	var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



	// Convert String-formatted options into Object-formatted ones
	function createOptions( options ) {
		var object = {};
		jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		} );
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions( options ) :
			jQuery.extend( {}, options );

		var // Flag to know if list is currently firing
			firing,

			// Last fire value for non-forgettable lists
			memory,

			// Flag to know if list was already fired
			fired,

			// Flag to prevent firing
			locked,

			// Actual callback list
			list = [],

			// Queue of execution data for repeatable lists
			queue = [],

			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,

			// Fire callbacks
			fire = function() {

				// Enforce single-firing
				locked = options.once;

				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for ( ; queue.length; firingIndex = -1 ) {
					memory = queue.shift();
					while ( ++firingIndex < list.length ) {

						// Run callback and check for early termination
						if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
							options.stopOnFalse ) {

							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
						}
					}
				}

				// Forget the data if we're done with it
				if ( !options.memory ) {
					memory = false;
				}

				firing = false;

				// Clean up if we're done firing for good
				if ( locked ) {

					// Keep an empty list if we have data for future add calls
					if ( memory ) {
						list = [];

					// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},

			// Actual Callbacks object
			self = {

				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {

						// If we have memory from a past run, we should fire after adding
						if ( memory && !firing ) {
							firingIndex = list.length - 1;
							queue.push( memory );
						}

						( function add( args ) {
							jQuery.each( args, function( _, arg ) {
								if ( jQuery.isFunction( arg ) ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

									// Inspect recursively
									add( arg );
								}
							} );
						} )( arguments );

						if ( memory && !firing ) {
							fire();
						}
					}
					return this;
				},

				// Remove a callback from the list
				remove: function() {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );

							// Handle firing indexes
							if ( index <= firingIndex ) {
								firingIndex--;
							}
						}
					} );
					return this;
				},

				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ?
						jQuery.inArray( fn, list ) > -1 :
						list.length > 0;
				},

				// Remove all callbacks from the list
				empty: function() {
					if ( list ) {
						list = [];
					}
					return this;
				},

				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function() {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function() {
					return !list;
				},

				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function() {
					locked = queue = [];
					if ( !memory && !firing ) {
						list = memory = "";
					}
					return this;
				},
				locked: function() {
					return !!locked;
				},

				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( !locked ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						queue.push( args );
						if ( !firing ) {
							fire();
						}
					}
					return this;
				},

				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},

				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};

		return self;
	};


	function Identity( v ) {
		return v;
	}
	function Thrower( ex ) {
		throw ex;
	}

	function adoptValue( value, resolve, reject ) {
		var method;

		try {

			// Check for promise aspect first to privilege synchronous behavior
			if ( value && jQuery.isFunction( ( method = value.promise ) ) ) {
				method.call( value ).done( resolve ).fail( reject );

			// Other thenables
			} else if ( value && jQuery.isFunction( ( method = value.then ) ) ) {
				method.call( value, resolve, reject );

			// Other non-thenables
			} else {

				// Support: Android 4.0 only
				// Strict mode functions invoked without .call/.apply get global-object context
				resolve.call( undefined, value );
			}

		// For Promises/A+, convert exceptions into rejections
		// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
		// Deferred#then to conditionally suppress rejection.
		} catch ( value ) {

			// Support: Android 4.0 only
			// Strict mode functions invoked without .call/.apply get global-object context
			reject.call( undefined, value );
		}
	}

	jQuery.extend( {

		Deferred: function( func ) {
			var tuples = [

					// action, add listener, callbacks,
					// ... .then handlers, argument index, [final state]
					[ "notify", "progress", jQuery.Callbacks( "memory" ),
						jQuery.Callbacks( "memory" ), 2 ],
					[ "resolve", "done", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 0, "resolved" ],
					[ "reject", "fail", jQuery.Callbacks( "once memory" ),
						jQuery.Callbacks( "once memory" ), 1, "rejected" ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					"catch": function( fn ) {
						return promise.then( null, fn );
					},

					// Keep pipe for back-compat
					pipe: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;

						return jQuery.Deferred( function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {

								// Map tuples (progress, done, fail) to arguments (done, fail, progress)
								var fn = jQuery.isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

								// deferred.progress(function() { bind to newDefer or newDefer.notify })
								// deferred.done(function() { bind to newDefer or newDefer.resolve })
								// deferred.fail(function() { bind to newDefer or newDefer.reject })
								deferred[ tuple[ 1 ] ]( function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.progress( newDefer.notify )
											.done( newDefer.resolve )
											.fail( newDefer.reject );
									} else {
										newDefer[ tuple[ 0 ] + "With" ](
											this,
											fn ? [ returned ] : arguments
										);
									}
								} );
							} );
							fns = null;
						} ).promise();
					},
					then: function( onFulfilled, onRejected, onProgress ) {
						var maxDepth = 0;
						function resolve( depth, deferred, handler, special ) {
							return function() {
								var that = this,
									args = arguments,
									mightThrow = function() {
										var returned, then;

										// Support: Promises/A+ section 2.3.3.3.3
										// https://promisesaplus.com/#point-59
										// Ignore double-resolution attempts
										if ( depth < maxDepth ) {
											return;
										}

										returned = handler.apply( that, args );

										// Support: Promises/A+ section 2.3.1
										// https://promisesaplus.com/#point-48
										if ( returned === deferred.promise() ) {
											throw new TypeError( "Thenable self-resolution" );
										}

										// Support: Promises/A+ sections 2.3.3.1, 3.5
										// https://promisesaplus.com/#point-54
										// https://promisesaplus.com/#point-75
										// Retrieve `then` only once
										then = returned &&

											// Support: Promises/A+ section 2.3.4
											// https://promisesaplus.com/#point-64
											// Only check objects and functions for thenability
											( typeof returned === "object" ||
												typeof returned === "function" ) &&
											returned.then;

										// Handle a returned thenable
										if ( jQuery.isFunction( then ) ) {

											// Special processors (notify) just wait for resolution
											if ( special ) {
												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special )
												);

											// Normal processors (resolve) also hook into progress
											} else {

												// ...and disregard older resolution values
												maxDepth++;

												then.call(
													returned,
													resolve( maxDepth, deferred, Identity, special ),
													resolve( maxDepth, deferred, Thrower, special ),
													resolve( maxDepth, deferred, Identity,
														deferred.notifyWith )
												);
											}

										// Handle all other returned values
										} else {

											// Only substitute handlers pass on context
											// and multiple values (non-spec behavior)
											if ( handler !== Identity ) {
												that = undefined;
												args = [ returned ];
											}

											// Process the value(s)
											// Default process is resolve
											( special || deferred.resolveWith )( that, args );
										}
									},

									// Only normal processors (resolve) catch and reject exceptions
									process = special ?
										mightThrow :
										function() {
											try {
												mightThrow();
											} catch ( e ) {

												if ( jQuery.Deferred.exceptionHook ) {
													jQuery.Deferred.exceptionHook( e,
														process.stackTrace );
												}

												// Support: Promises/A+ section 2.3.3.3.4.1
												// https://promisesaplus.com/#point-61
												// Ignore post-resolution exceptions
												if ( depth + 1 >= maxDepth ) {

													// Only substitute handlers pass on context
													// and multiple values (non-spec behavior)
													if ( handler !== Thrower ) {
														that = undefined;
														args = [ e ];
													}

													deferred.rejectWith( that, args );
												}
											}
										};

								// Support: Promises/A+ section 2.3.3.3.1
								// https://promisesaplus.com/#point-57
								// Re-resolve promises immediately to dodge false rejection from
								// subsequent errors
								if ( depth ) {
									process();
								} else {

									// Call an optional hook to record the stack, in case of exception
									// since it's otherwise lost when execution goes async
									if ( jQuery.Deferred.getStackHook ) {
										process.stackTrace = jQuery.Deferred.getStackHook();
									}
									window.setTimeout( process );
								}
							};
						}

						return jQuery.Deferred( function( newDefer ) {

							// progress_handlers.add( ... )
							tuples[ 0 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction( onProgress ) ?
										onProgress :
										Identity,
									newDefer.notifyWith
								)
							);

							// fulfilled_handlers.add( ... )
							tuples[ 1 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction( onFulfilled ) ?
										onFulfilled :
										Identity
								)
							);

							// rejected_handlers.add( ... )
							tuples[ 2 ][ 3 ].add(
								resolve(
									0,
									newDefer,
									jQuery.isFunction( onRejected ) ?
										onRejected :
										Thrower
								)
							);
						} ).promise();
					},

					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};

			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 5 ];

				// promise.progress = list.add
				// promise.done = list.add
				// promise.fail = list.add
				promise[ tuple[ 1 ] ] = list.add;

				// Handle state
				if ( stateString ) {
					list.add(
						function() {

							// state = "resolved" (i.e., fulfilled)
							// state = "rejected"
							state = stateString;
						},

						// rejected_callbacks.disable
						// fulfilled_callbacks.disable
						tuples[ 3 - i ][ 2 ].disable,

						// progress_callbacks.lock
						tuples[ 0 ][ 2 ].lock
					);
				}

				// progress_handlers.fire
				// fulfilled_handlers.fire
				// rejected_handlers.fire
				list.add( tuple[ 3 ].fire );

				// deferred.notify = function() { deferred.notifyWith(...) }
				// deferred.resolve = function() { deferred.resolveWith(...) }
				// deferred.reject = function() { deferred.rejectWith(...) }
				deferred[ tuple[ 0 ] ] = function() {
					deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
					return this;
				};

				// deferred.notifyWith = list.fireWith
				// deferred.resolveWith = list.fireWith
				// deferred.rejectWith = list.fireWith
				deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
			} );

			// Make the deferred a promise
			promise.promise( deferred );

			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function( singleValue ) {
			var

				// count of uncompleted subordinates
				remaining = arguments.length,

				// count of unprocessed arguments
				i = remaining,

				// subordinate fulfillment data
				resolveContexts = Array( i ),
				resolveValues = slice.call( arguments ),

				// the master Deferred
				master = jQuery.Deferred(),

				// subordinate callback factory
				updateFunc = function( i ) {
					return function( value ) {
						resolveContexts[ i ] = this;
						resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( !( --remaining ) ) {
							master.resolveWith( resolveContexts, resolveValues );
						}
					};
				};

			// Single- and empty arguments are adopted like Promise.resolve
			if ( remaining <= 1 ) {
				adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject );

				// Use .then() to unwrap secondary thenables (cf. gh-3000)
				if ( master.state() === "pending" ||
					jQuery.isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

					return master.then();
				}
			}

			// Multiple arguments are aggregated like Promise.all array elements
			while ( i-- ) {
				adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
			}

			return master.promise();
		}
	} );


	// These usually indicate a programmer mistake during development,
	// warn about them ASAP rather than swallowing them by default.
	var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

	jQuery.Deferred.exceptionHook = function( error, stack ) {

		// Support: IE 8 - 9 only
		// Console exists when dev tools are open, which can happen at any time
		if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
			window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
		}
	};




	jQuery.readyException = function( error ) {
		window.setTimeout( function() {
			throw error;
		} );
	};




	// The deferred used on DOM ready
	var readyList = jQuery.Deferred();

	jQuery.fn.ready = function( fn ) {

		readyList
			.then( fn )

			// Wrap jQuery.readyException in a function so that the lookup
			// happens at the time of error handling instead of callback
			// registration.
			.catch( function( error ) {
				jQuery.readyException( error );
			} );

		return this;
	};

	jQuery.extend( {

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},

		// Handle when the DOM is ready
		ready: function( wait ) {

			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );
		}
	} );

	jQuery.ready.then = readyList.then;

	// The ready event handler and self cleanup method
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed );
		window.removeEventListener( "load", completed );
		jQuery.ready();
	}

	// Catch cases where $(document).ready() is called
	// after the browser event has already occurred.
	// Support: IE <=9 - 10 only
	// Older IE sometimes signals "interactive" too soon
	if ( document.readyState === "complete" ||
		( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

		// Handle it asynchronously to allow scripts the opportunity to delay ready
		window.setTimeout( jQuery.ready );

	} else {

		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", completed );

		// A fallback to window.onload, that will always work
		window.addEventListener( "load", completed );
	}




	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				access( elems, fn, i, key[ i ], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {

				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn(
						elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
					);
				}
			}
		}

		if ( chainable ) {
			return elems;
		}

		// Gets
		if ( bulk ) {
			return fn.call( elems );
		}

		return len ? fn( elems[ 0 ], key ) : emptyGet;
	};
	var acceptData = function( owner ) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};




	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.prototype = {

		cache: function( owner ) {

			// Check if the owner object already has a cache
			var value = owner[ this.expando ];

			// If not, create one
			if ( !value ) {
				value = {};

				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if ( acceptData( owner ) ) {

					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if ( owner.nodeType ) {
						owner[ this.expando ] = value;

					// Otherwise secure it in a non-enumerable property
					// configurable must be true to allow the property to be
					// deleted when data is removed
					} else {
						Object.defineProperty( owner, this.expando, {
							value: value,
							configurable: true
						} );
					}
				}
			}

			return value;
		},
		set: function( owner, data, value ) {
			var prop,
				cache = this.cache( owner );

			// Handle: [ owner, key, value ] args
			// Always use camelCase key (gh-2257)
			if ( typeof data === "string" ) {
				cache[ jQuery.camelCase( data ) ] = value;

			// Handle: [ owner, { properties } ] args
			} else {

				// Copy the properties one-by-one to the cache object
				for ( prop in data ) {
					cache[ jQuery.camelCase( prop ) ] = data[ prop ];
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			return key === undefined ?
				this.cache( owner ) :

				// Always use camelCase key (gh-2257)
				owner[ this.expando ] && owner[ this.expando ][ jQuery.camelCase( key ) ];
		},
		access: function( owner, key, value ) {

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					( ( key && typeof key === "string" ) && value === undefined ) ) {

				return this.get( owner, key );
			}

			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i,
				cache = owner[ this.expando ];

			if ( cache === undefined ) {
				return;
			}

			if ( key !== undefined ) {

				// Support array or space separated string of keys
				if ( jQuery.isArray( key ) ) {

					// If key is an array of keys...
					// We always set camelCase keys, so remove that.
					key = key.map( jQuery.camelCase );
				} else {
					key = jQuery.camelCase( key );

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					key = key in cache ?
						[ key ] :
						( key.match( rnothtmlwhite ) || [] );
				}

				i = key.length;

				while ( i-- ) {
					delete cache[ key[ i ] ];
				}
			}

			// Remove the expando if there's no more data
			if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

				// Support: Chrome <=35 - 45
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
				if ( owner.nodeType ) {
					owner[ this.expando ] = undefined;
				} else {
					delete owner[ this.expando ];
				}
			}
		},
		hasData: function( owner ) {
			var cache = owner[ this.expando ];
			return cache !== undefined && !jQuery.isEmptyObject( cache );
		}
	};
	var dataPriv = new Data();

	var dataUser = new Data();



	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;

	function getData( data ) {
		if ( data === "true" ) {
			return true;
		}

		if ( data === "false" ) {
			return false;
		}

		if ( data === "null" ) {
			return null;
		}

		// Only convert to a number if it doesn't change the string
		if ( data === +data + "" ) {
			return +data;
		}

		if ( rbrace.test( data ) ) {
			return JSON.parse( data );
		}

		return data;
	}

	function dataAttr( elem, key, data ) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
			data = elem.getAttribute( name );

			if ( typeof data === "string" ) {
				try {
					data = getData( data );
				} catch ( e ) {}

				// Make sure we set the data so it isn't changed later
				dataUser.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend( {
		hasData: function( elem ) {
			return dataUser.hasData( elem ) || dataPriv.hasData( elem );
		},

		data: function( elem, name, data ) {
			return dataUser.access( elem, name, data );
		},

		removeData: function( elem, name ) {
			dataUser.remove( elem, name );
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return dataPriv.access( elem, name, data );
		},

		_removeData: function( elem, name ) {
			dataPriv.remove( elem, name );
		}
	} );

	jQuery.fn.extend( {
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;

			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = dataUser.get( elem );

					if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {

							// Support: IE 11 only
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice( 5 ) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						dataPriv.set( elem, "hasDataAttrs", true );
					}
				}

				return data;
			}

			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each( function() {
					dataUser.set( this, key );
				} );
			}

			return access( this, function( value ) {
				var data;

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {

					// Attempt to get data from the cache
					// The key will always be camelCased in Data
					data = dataUser.get( elem, key );
					if ( data !== undefined ) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, key );
					if ( data !== undefined ) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				this.each( function() {

					// We always store the camelCased key
					dataUser.set( this, key, value );
				} );
			}, null, value, arguments.length > 1, null, true );
		},

		removeData: function( key ) {
			return this.each( function() {
				dataUser.remove( this, key );
			} );
		}
	} );


	jQuery.extend( {
		queue: function( elem, type, data ) {
			var queue;

			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = dataPriv.get( elem, type );

				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},

		dequeue: function( elem, type ) {
			type = type || "fx";

			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}

			if ( fn ) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}

			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
				empty: jQuery.Callbacks( "once memory" ).add( function() {
					dataPriv.remove( elem, [ type + "queue", key ] );
				} )
			} );
		}
	} );

	jQuery.fn.extend( {
		queue: function( type, data ) {
			var setter = 2;

			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}

			if ( arguments.length < setter ) {
				return jQuery.queue( this[ 0 ], type );
			}

			return data === undefined ?
				this :
				this.each( function() {
					var queue = jQuery.queue( this, type, data );

					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );

					if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				} );
		},
		dequeue: function( type ) {
			return this.each( function() {
				jQuery.dequeue( this, type );
			} );
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};

			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while ( i-- ) {
				tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	} );
	var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

	var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

	var isHiddenWithinTree = function( elem, el ) {

			// isHiddenWithinTree might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;

			// Inline style trumps all
			return elem.style.display === "none" ||
				elem.style.display === "" &&

				// Otherwise, check computed style
				// Support: Firefox <=43 - 45
				// Disconnected elements can have computed display: none, so first confirm that elem is
				// in the document.
				jQuery.contains( elem.ownerDocument, elem ) &&

				jQuery.css( elem, "display" ) === "none";
		};

	var swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	};




	function adjustCSS( elem, prop, valueParts, tween ) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function() {
					return tween.cur();
				} :
				function() {
					return jQuery.css( elem, prop, "" );
				},
			initial = currentValue(),
			unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

			// Starting value computation is required for potential unit mismatches
			initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
				rcssNum.exec( jQuery.css( elem, prop ) );

		if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[ 3 ];

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			do {

				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";

				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style( elem, prop, initialInUnit + unit );

			// Update scale, tolerating zero or NaN from tween.cur()
			// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
			);
		}

		if ( valueParts ) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[ 1 ] ?
				initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
				+valueParts[ 2 ];
			if ( tween ) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}


	var defaultDisplayMap = {};

	function getDefaultDisplay( elem ) {
		var temp,
			doc = elem.ownerDocument,
			nodeName = elem.nodeName,
			display = defaultDisplayMap[ nodeName ];

		if ( display ) {
			return display;
		}

		temp = doc.body.appendChild( doc.createElement( nodeName ) );
		display = jQuery.css( temp, "display" );

		temp.parentNode.removeChild( temp );

		if ( display === "none" ) {
			display = "block";
		}
		defaultDisplayMap[ nodeName ] = display;

		return display;
	}

	function showHide( elements, show ) {
		var display, elem,
			values = [],
			index = 0,
			length = elements.length;

		// Determine new display value for elements that need to change
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}

			display = elem.style.display;
			if ( show ) {

				// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
				// check is required in this first loop unless we have a nonempty display value (either
				// inline or about-to-be-restored)
				if ( display === "none" ) {
					values[ index ] = dataPriv.get( elem, "display" ) || null;
					if ( !values[ index ] ) {
						elem.style.display = "";
					}
				}
				if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
					values[ index ] = getDefaultDisplay( elem );
				}
			} else {
				if ( display !== "none" ) {
					values[ index ] = "none";

					// Remember what we're overwriting
					dataPriv.set( elem, "display", display );
				}
			}
		}

		// Set the display of the elements in a second loop to avoid constant reflow
		for ( index = 0; index < length; index++ ) {
			if ( values[ index ] != null ) {
				elements[ index ].style.display = values[ index ];
			}
		}

		return elements;
	}

	jQuery.fn.extend( {
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}

			return this.each( function() {
				if ( isHiddenWithinTree( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			} );
		}
	} );
	var rcheckableType = ( /^(?:checkbox|radio)$/i );

	var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

	var rscriptType = ( /^$|\/(?:java|ecma)script/i );



	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {

		// Support: IE <=9 only
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

	// Support: IE <=9 only
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;


	function getAll( context, tag ) {

		// Support: IE <=9 - 11 only
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret;

		if ( typeof context.getElementsByTagName !== "undefined" ) {
			ret = context.getElementsByTagName( tag || "*" );

		} else if ( typeof context.querySelectorAll !== "undefined" ) {
			ret = context.querySelectorAll( tag || "*" );

		} else {
			ret = [];
		}

		if ( tag === undefined || tag && jQuery.nodeName( context, tag ) ) {
			return jQuery.merge( [ context ], ret );
		}

		return ret;
	}


	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			dataPriv.set(
				elems[ i ],
				"globalEval",
				!refElements || dataPriv.get( refElements[ i ], "globalEval" )
			);
		}
	}


	var rhtml = /<|&#?\w+;/;

	function buildFragment( elems, context, scripts, selection, ignored ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: Android <=4.0 only, PhantomJS 1 only
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( ( elem = nodes[ i++ ] ) ) {

			// Skip elements already in the context collection (trac-4087)
			if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
				if ( ignored ) {
					ignored.push( elem );
				}
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( ( elem = tmp[ j++ ] ) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	}


	( function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );

		// Support: Android 4.0 - 4.3 only
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );

		div.appendChild( input );

		// Support: Android <=4.1 only
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

		// Support: IE <=11 only
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	} )();
	var documentElement = document.documentElement;



	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// Support: IE <=9 only
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}

	function on( elem, types, selector, data, fn, one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {

			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				on( elem, type, selector, data, types[ type ], one );
			}
			return elem;
		}

		if ( data == null && fn == null ) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return elem;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {

				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return elem.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		} );
	}

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		global: {},

		add: function( elem, types, handler, data, selector ) {

			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get( elem );

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Ensure that invalid selectors throw exceptions at attach time
			// Evaluate against documentElement in case elem is a non-element node (e.g., document)
			if ( selector ) {
				jQuery.find.matchesSelector( documentElement, selector );
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if ( !( events = elemData.events ) ) {
				events = elemData.events = {};
			}
			if ( !( eventHandle = elemData.handle ) ) {
				eventHandle = elemData.handle = function( e ) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend( {
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join( "." )
				}, handleObjIn );

				// Init the event handler queue if we're the first
				if ( !( handlers = events[ type ] ) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if ( !special.setup ||
						special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle );
						}
					}
				}

				if ( special.add ) {
					special.add.call( elem, handleObj );

					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}

		},

		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {

			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

			if ( !elemData || !( events = elemData.events ) ) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[ t ] ) || [];
				type = origType = tmp[ 1 ];
				namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}

				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[ 2 ] &&
					new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];

					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );

						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown ||
						special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

						jQuery.removeEvent( elem, type, elemData.handle );
					}

					delete events[ type ];
				}
			}

			// Remove data and the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				dataPriv.remove( elem, "handle events" );
			}
		},

		dispatch: function( nativeEvent ) {

			// Make a writable jQuery.Event from the native event object
			var event = jQuery.event.fix( nativeEvent );

			var i, j, ret, matched, handleObj, handlerQueue,
				args = new Array( arguments.length ),
				handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[ 0 ] = event;

			for ( i = 1; i < arguments.length; i++ ) {
				args[ i ] = arguments[ i ];
			}

			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;

				j = 0;
				while ( ( handleObj = matched.handlers[ j++ ] ) &&
					!event.isImmediatePropagationStopped() ) {

					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
							handleObj.handler ).apply( matched.elem, args );

						if ( ret !== undefined ) {
							if ( ( event.result = ret ) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}

			return event.result;
		},

		handlers: function( event, handlers ) {
			var i, handleObj, sel, matchedHandlers, matchedSelectors,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Find delegate handlers
			if ( delegateCount &&

				// Support: IE <=9
				// Black-hole SVG <use> instance trees (trac-13180)
				cur.nodeType &&

				// Support: Firefox <=42
				// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
				// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
				// Support: IE 11 only
				// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
				!( event.type === "click" && event.button >= 1 ) ) {

				for ( ; cur !== this; cur = cur.parentNode || this ) {

					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
						matchedHandlers = [];
						matchedSelectors = {};
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if ( matchedSelectors[ sel ] === undefined ) {
								matchedSelectors[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) > -1 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matchedSelectors[ sel ] ) {
								matchedHandlers.push( handleObj );
							}
						}
						if ( matchedHandlers.length ) {
							handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			cur = this;
			if ( delegateCount < handlers.length ) {
				handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
			}

			return handlerQueue;
		},

		addProp: function( name, hook ) {
			Object.defineProperty( jQuery.Event.prototype, name, {
				enumerable: true,
				configurable: true,

				get: jQuery.isFunction( hook ) ?
					function() {
						if ( this.originalEvent ) {
								return hook( this.originalEvent );
						}
					} :
					function() {
						if ( this.originalEvent ) {
								return this.originalEvent[ name ];
						}
					},

				set: function( value ) {
					Object.defineProperty( this, name, {
						enumerable: true,
						configurable: true,
						writable: true,
						value: value
					} );
				}
			} );
		},

		fix: function( originalEvent ) {
			return originalEvent[ jQuery.expando ] ?
				originalEvent :
				new jQuery.Event( originalEvent );
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {

				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {

				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},

			beforeunload: {
				postDispatch: function( event ) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		}
	};

	jQuery.removeEvent = function( elem, type, handle ) {

		// This "if" is needed for plain objects
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle );
		}
	};

	jQuery.Event = function( src, props ) {

		// Allow instantiation without the 'new' keyword
		if ( !( this instanceof jQuery.Event ) ) {
			return new jQuery.Event( src, props );
		}

		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&

					// Support: Android <=2.3 only
					src.returnValue === false ?
				returnTrue :
				returnFalse;

			// Create target properties
			// Support: Safari <=6 - 7 only
			// Target should not be a text node (#504, #13143)
			this.target = ( src.target && src.target.nodeType === 3 ) ?
				src.target.parentNode :
				src.target;

			this.currentTarget = src.currentTarget;
			this.relatedTarget = src.relatedTarget;

		// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
		isSimulated: false,

		preventDefault: function() {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if ( e && !this.isSimulated ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if ( e && !this.isSimulated ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if ( e && !this.isSimulated ) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Includes all common event props including KeyEvent and MouseEvent specific props
	jQuery.each( {
		altKey: true,
		bubbles: true,
		cancelable: true,
		changedTouches: true,
		ctrlKey: true,
		detail: true,
		eventPhase: true,
		metaKey: true,
		pageX: true,
		pageY: true,
		shiftKey: true,
		view: true,
		"char": true,
		charCode: true,
		key: true,
		keyCode: true,
		button: true,
		buttons: true,
		clientX: true,
		clientY: true,
		offsetX: true,
		offsetY: true,
		pointerId: true,
		pointerType: true,
		screenX: true,
		screenY: true,
		targetTouches: true,
		toElement: true,
		touches: true,

		which: function( event ) {
			var button = event.button;

			// Add which for key events
			if ( event.which == null && rkeyEvent.test( event.type ) ) {
				return event.charCode != null ? event.charCode : event.keyCode;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
				if ( button & 1 ) {
					return 1;
				}

				if ( button & 2 ) {
					return 3;
				}

				if ( button & 4 ) {
					return 2;
				}

				return 0;
			}

			return event.which;
		}
	}, jQuery.event.addProp );

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each( {
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,

			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	} );

	jQuery.fn.extend( {

		on: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn );
		},
		one: function( types, selector, data, fn ) {
			return on( this, types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {

				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each( function() {
				jQuery.event.remove( this, types, fn, selector );
			} );
		}
	} );


	var

		/* eslint-disable max-len */

		// See https://github.com/eslint/eslint/issues/3229
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

		/* eslint-enable */

		// Support: IE <=10 - 11, Edge 12 - 13
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,

		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

	function manipulationTarget( elem, content ) {
		if ( jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

			return elem.getElementsByTagName( "tbody" )[ 0 ] || elem;
		}

		return elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );

		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute( "type" );
		}

		return elem;
	}

	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if ( dest.nodeType !== 1 ) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if ( dataPriv.hasData( src ) ) {
			pdataOld = dataPriv.access( src );
			pdataCur = dataPriv.set( dest, pdataOld );
			events = pdataOld.events;

			if ( events ) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}

		// 2. Copy user data
		if ( dataUser.hasData( src ) ) {
			udataOld = dataUser.access( src );
			udataCur = jQuery.extend( {}, udataOld );

			dataUser.set( dest, udataCur );
		}
	}

	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;

		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip( collection, args, callback, ignored ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return collection.each( function( index ) {
				var self = collection.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				domManip( self, args, callback, ignored );
			} );
		}

		if ( l ) {
			fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if ( first || ignored ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {

							// Support: Android <=4.0 only, PhantomJS 1 only
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( collection[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!dataPriv.access( node, "globalEval" ) &&
							jQuery.contains( doc, node ) ) {

							if ( node.src ) {

								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								DOMEval( node.textContent.replace( rcleanScript, "" ), doc );
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function remove( elem, selector, keepData ) {
		var node,
			nodes = selector ? jQuery.filter( selector, elem ) : elem,
			i = 0;

		for ( ; ( node = nodes[ i ] ) != null; i++ ) {
			if ( !keepData && node.nodeType === 1 ) {
				jQuery.cleanData( getAll( node ) );
			}

			if ( node.parentNode ) {
				if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
					setGlobalEval( getAll( node, "script" ) );
				}
				node.parentNode.removeChild( node );
			}
		}

		return elem;
	}

	jQuery.extend( {
		htmlPrefilter: function( html ) {
			return html.replace( rxhtmlTag, "<$1></$2>" );
		},

		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = jQuery.contains( elem.ownerDocument, elem );

			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {

				// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}

			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );

					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}

			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}

			// Return the cloned set
			return clone;
		},

		cleanData: function( elems ) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;

			for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
				if ( acceptData( elem ) ) {
					if ( ( data = elem[ dataPriv.expando ] ) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );

								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataPriv.expando ] = undefined;
					}
					if ( elem[ dataUser.expando ] ) {

						// Support: Chrome <=35 - 45+
						// Assign undefined instead of using delete, see Data#remove
						elem[ dataUser.expando ] = undefined;
					}
				}
			}
		}
	} );

	jQuery.fn.extend( {
		detach: function( selector ) {
			return remove( this, selector, true );
		},

		remove: function( selector ) {
			return remove( this, selector );
		},

		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each( function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					} );
			}, null, value, arguments.length );
		},

		append: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			} );
		},

		prepend: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			} );
		},

		before: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			} );
		},

		after: function() {
			return domManip( this, arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			} );
		},

		empty: function() {
			var elem,
				i = 0;

			for ( ; ( elem = this[ i ] ) != null; i++ ) {
				if ( elem.nodeType === 1 ) {

					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map( function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			} );
		},

		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;

				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

					value = jQuery.htmlPrefilter( value );

					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};

							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}

						elem = 0;

					// If using innerHTML throws an exception, use the fallback method
					} catch ( e ) {}
				}

				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},

		replaceWith: function() {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip( this, arguments, function( elem ) {
				var parent = this.parentNode;

				if ( jQuery.inArray( this, ignored ) < 0 ) {
					jQuery.cleanData( getAll( this ) );
					if ( parent ) {
						parent.replaceChild( elem, this );
					}
				}

			// Force callback invocation
			}, ignored );
		}
	} );

	jQuery.each( {
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;

			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );

				// Support: Android <=4.0 only, PhantomJS 1 only
				// .get() because push.apply(_, arraylike) throws on ancient WebKit
				push.apply( ret, elems.get() );
			}

			return this.pushStack( ret );
		};
	} );
	var rmargin = ( /^margin/ );

	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

	var getStyles = function( elem ) {

			// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			var view = elem.ownerDocument.defaultView;

			if ( !view || !view.opener ) {
				view = window;
			}

			return view.getComputedStyle( elem );
		};



	( function() {

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {

			// This is a singleton, we need to execute it only once
			if ( !div ) {
				return;
			}

			div.style.cssText =
				"box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild( container );

			var divStyle = window.getComputedStyle( div );
			pixelPositionVal = divStyle.top !== "1%";

			// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";

			documentElement.removeChild( container );

			// Nullify the div so it wouldn't be stored in the memory and
			// it will also be a sign that checks already performed
			div = null;
		}

		var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );

		// Finish early in limited (non-browser) environments
		if ( !div.style ) {
			return;
		}

		// Support: IE <=9 - 11 only
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		container.appendChild( div );

		jQuery.extend( support, {
			pixelPosition: function() {
				computeStyleTests();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				computeStyleTests();
				return boxSizingReliableVal;
			},
			pixelMarginRight: function() {
				computeStyleTests();
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function() {
				computeStyleTests();
				return reliableMarginLeftVal;
			}
		} );
	} )();


	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles( elem );

		// Support: IE <=9 only
		// getPropertyValue is only needed for .css('filter') (#12537)
		if ( computed ) {
			ret = computed.getPropertyValue( name ) || computed[ name ];

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// https://drafts.csswg.org/cssom/#resolved-values
			if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret !== undefined ?

			// Support: IE <=9 - 11 only
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}


	function addGetHookIf( conditionFn, hookFn ) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return ( this.get = hookFn ).apply( this, arguments );
			}
		};
	}


	var

		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},

		cssPrefixes = [ "Webkit", "Moz", "ms" ],
		emptyStyle = document.createElement( "div" ).style;

	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( name ) {

		// Shortcut for names that are not vendor prefixed
		if ( name in emptyStyle ) {
			return name;
		}

		// Check for vendor prefixed names
		var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
			i = cssPrefixes.length;

		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in emptyStyle ) {
				return name;
			}
		}
	}

	function setPositiveNumber( elem, value, subtract ) {

		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec( value );
		return matches ?

			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
			value;
	}

	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i,
			val = 0;

		// If we already have the right measurement, avoid augmentation
		if ( extra === ( isBorderBox ? "border" : "content" ) ) {
			i = 4;

		// Otherwise initialize for horizontal or vertical properties
		} else {
			i = name === "width" ? 1 : 0;
		}

		for ( ; i < 4; i += 2 ) {

			// Both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}

			if ( isBorderBox ) {

				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}

				// At this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {

				// At this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

				// At this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}

		return val;
	}

	function getWidthOrHeight( elem, name, extra ) {

		// Start with offset property, which is equivalent to the border-box value
		var val,
			valueIsBorderBox = true,
			styles = getStyles( elem ),
			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Support: IE <=11 only
		// Running getBoundingClientRect on a disconnected node
		// in IE throws an error.
		if ( elem.getClientRects().length ) {
			val = elem.getBoundingClientRect()[ name ];
		}

		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {

			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}

			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test( val ) ) {
				return val;
			}

			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );

			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}

		// Use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}

	jQuery.extend( {

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {

						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},

		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {

			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;

			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;

				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
					value = adjustCSS( elem, name, ret );

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				if ( type === "number" ) {
					value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
				}

				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !( "set" in hooks ) ||
					( value = hooks.set( elem, value, extra ) ) !== undefined ) {

					style[ name ] = value;
				}

			} else {

				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks &&
					( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},

		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = jQuery.camelCase( name );

			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] ||
				( jQuery.cssProps[ origName ] = vendorPropName( origName ) || origName );

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}

			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}

			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || isFinite( num ) ? num || 0 : val;
			}
			return val;
		}
	} );

	jQuery.each( [ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

						// Support: Safari 8+
						// Table columns in Safari have non-zero offsetWidth & zero
						// getBoundingClientRect().width unless display is changed.
						// Support: IE <=11 only
						// Running getBoundingClientRect on a disconnected node
						// in IE throws an error.
						( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
							swap( elem, cssShow, function() {
								return getWidthOrHeight( elem, name, extra );
							} ) :
							getWidthOrHeight( elem, name, extra );
				}
			},

			set: function( elem, value, extra ) {
				var matches,
					styles = extra && getStyles( elem ),
					subtract = extra && augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					);

				// Convert to pixels if value adjustment is needed
				if ( subtract && ( matches = rcssNum.exec( value ) ) &&
					( matches[ 3 ] || "px" ) !== "px" ) {

					elem.style[ name ] = value;
					value = jQuery.css( elem, name );
				}

				return setPositiveNumber( elem, value, subtract );
			}
		};
	} );

	jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
		function( elem, computed ) {
			if ( computed ) {
				return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
					elem.getBoundingClientRect().left -
						swap( elem, { marginLeft: 0 }, function() {
							return elem.getBoundingClientRect().left;
						} )
					) + "px";
			}
		}
	);

	// These hooks are used by animate to expand properties
	jQuery.each( {
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},

					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split( " " ) : [ value ];

				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}

				return expanded;
			}
		};

		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	} );

	jQuery.fn.extend( {
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;

				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;

					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}

					return map;
				}

				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		}
	} );


	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];

			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];

			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;

			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}

			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;

				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if ( tween.elem.nodeType !== 1 ||
					tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
					return tween.elem[ tween.prop ];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );

				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {

				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.nodeType === 1 &&
					( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
						jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};

	// Support: IE <=9 only
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	// Back compat <1.8 extension point
	jQuery.fx.step = {};




	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;

	function raf() {
		if ( timerId ) {
			window.requestAnimationFrame( raf );
			jQuery.fx.tick();
		}
	}

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout( function() {
			fxNow = undefined;
		} );
		return ( fxNow = jQuery.now() );
	}

	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}

		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween( value, prop, animation ) {
		var tween,
			collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter( elem, props, opts ) {
		var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
			isBox = "width" in props || "height" in props,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHiddenWithinTree( elem ),
			dataShow = dataPriv.get( elem, "fxshow" );

		// Queue-skipping animations hijack the fx hooks
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always( function() {

				// Ensure the complete handler is called before this completes
				anim.always( function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				} );
			} );
		}

		// Detect show/hide animations
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.test( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {

					// Pretend to be hidden if this is a "show" and
					// there is still data from a stopped show/hide
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;

					// Ignore all other no-op show/hide data
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
			}
		}

		// Bail out if this is a no-op like .hide().hide()
		propTween = !jQuery.isEmptyObject( props );
		if ( !propTween && jQuery.isEmptyObject( orig ) ) {
			return;
		}

		// Restrict "overflow" and "display" styles during box animations
		if ( isBox && elem.nodeType === 1 ) {

			// Support: IE <=9 - 11, Edge 12 - 13
			// Record all 3 overflow attributes because IE does not infer the shorthand
			// from identically-valued overflowX and overflowY
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

			// Identify a display type, preferring old show/hide data over the CSS cascade
			restoreDisplay = dataShow && dataShow.display;
			if ( restoreDisplay == null ) {
				restoreDisplay = dataPriv.get( elem, "display" );
			}
			display = jQuery.css( elem, "display" );
			if ( display === "none" ) {
				if ( restoreDisplay ) {
					display = restoreDisplay;
				} else {

					// Get nonempty value(s) by temporarily forcing visibility
					showHide( [ elem ], true );
					restoreDisplay = elem.style.display || restoreDisplay;
					display = jQuery.css( elem, "display" );
					showHide( [ elem ] );
				}
			}

			// Animate inline elements as inline-block
			if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
				if ( jQuery.css( elem, "float" ) === "none" ) {

					// Restore the original display value at the end of pure show/hide animations
					if ( !propTween ) {
						anim.done( function() {
							style.display = restoreDisplay;
						} );
						if ( restoreDisplay == null ) {
							display = style.display;
							restoreDisplay = display === "none" ? "" : display;
						}
					}
					style.display = "inline-block";
				}
			}
		}

		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always( function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			} );
		}

		// Implement show/hide animations
		propTween = false;
		for ( prop in orig ) {

			// General show/hide setup for this element animation
			if ( !propTween ) {
				if ( dataShow ) {
					if ( "hidden" in dataShow ) {
						hidden = dataShow.hidden;
					}
				} else {
					dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
				}

				// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
				if ( toggle ) {
					dataShow.hidden = !hidden;
				}

				// Show elements before animating them
				if ( hidden ) {
					showHide( [ elem ], true );
				}

				/* eslint-disable no-loop-func */

				anim.done( function() {

				/* eslint-enable no-loop-func */

					// The final step of a "hide" animation is actually hiding the element
					if ( !hidden ) {
						showHide( [ elem ] );
					}
					dataPriv.remove( elem, "fxshow" );
					for ( prop in orig ) {
						jQuery.style( elem, prop, orig[ prop ] );
					}
				} );
			}

			// Per-property setup
			propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = propTween.start;
				if ( hidden ) {
					propTween.end = propTween.start;
					propTween.start = 0;
				}
			}
		}
	}

	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}

			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}

			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}

	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always( function() {

				// Don't match elem in the :animated selector
				delete tick.elem;
			} ),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

					// Support: Android 2.3 only
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;

				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( percent );
				}

				deferred.notifyWith( elem, [ animation, percent, remaining ] );

				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise( {
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,

						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length; index++ ) {
						animation.tweens[ index ].run( 1 );
					}

					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.notifyWith( elem, [ animation, 1, 0 ] );
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			} ),
			props = animation.props;

		propFilter( props, animation.opts.specialEasing );

		for ( ; index < length; index++ ) {
			result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				if ( jQuery.isFunction( result.stop ) ) {
					jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
						jQuery.proxy( result.stop, result );
				}
				return result;
			}
		}

		jQuery.map( props, createTween, animation );

		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}

		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			} )
		);

		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}

	jQuery.Animation = jQuery.extend( Animation, {

		tweeners: {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value );
				adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
				return tween;
			} ]
		},

		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.match( rnothtmlwhite );
			}

			var prop,
				index = 0,
				length = props.length;

			for ( ; index < length; index++ ) {
				prop = props[ index ];
				Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
				Animation.tweeners[ prop ].unshift( callback );
			}
		},

		prefilters: [ defaultPrefilter ],

		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				Animation.prefilters.unshift( callback );
			} else {
				Animation.prefilters.push( callback );
			}
		}
	} );

	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		// Go to the end state if fx are off or if document is hidden
		if ( jQuery.fx.off || document.hidden ) {
			opt.duration = 0;

		} else {
			if ( typeof opt.duration !== "number" ) {
				if ( opt.duration in jQuery.fx.speeds ) {
					opt.duration = jQuery.fx.speeds[ opt.duration ];

				} else {
					opt.duration = jQuery.fx.speeds._default;
				}
			}
		}

		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};

		return opt;
	};

	jQuery.fn.extend( {
		fadeTo: function( speed, to, easing, callback ) {

			// Show any hidden elements after setting opacity to 0
			return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

				// Animate to the value specified
				.end().animate( { opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {

					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );

					// Empty animations, or finishing resolves immediately
					if ( empty || dataPriv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;

			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};

			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}

			return this.each( function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get( this );

				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}

				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this &&
						( type == null || timers[ index ].queue === type ) ) {

						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			} );
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each( function() {
				var index,
					data = dataPriv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue( this, type, [] );

				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}

				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}

				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}

				// Turn off finishing flag
				delete data.finish;
			} );
		}
	} );

	jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	} );

	// Generate shortcuts for custom animations
	jQuery.each( {
		slideDown: genFx( "show" ),
		slideUp: genFx( "hide" ),
		slideToggle: genFx( "toggle" ),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	} );

	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;

		fxNow = jQuery.now();

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];

			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};

	jQuery.fx.interval = 13;
	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = window.requestAnimationFrame ?
				window.requestAnimationFrame( raf ) :
				window.setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};

	jQuery.fx.stop = function() {
		if ( window.cancelAnimationFrame ) {
			window.cancelAnimationFrame( timerId );
		} else {
			window.clearInterval( timerId );
		}

		timerId = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};


	// Based off of the plugin by Clint Helfers, with permission.
	// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = window.setTimeout( next, time );
			hooks.stop = function() {
				window.clearTimeout( timeout );
			};
		} );
	};


	( function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );

		input.type = "checkbox";

		// Support: Android <=4.3 only
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE <=11 only
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: IE <=11 only
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	} )();


	var boolHook,
		attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend( {
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},

		removeAttr: function( name ) {
			return this.each( function() {
				jQuery.removeAttr( this, name );
			} );
		}
	} );

	jQuery.extend( {
		attr: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set attributes on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined" ) {
				return jQuery.prop( elem, name, value );
			}

			// Attribute hooks are determined by the lowercase version
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
			}

			if ( value !== undefined ) {
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
					return;
				}

				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				elem.setAttribute( name, value + "" );
				return value;
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		},

		removeAttr: function( elem, value ) {
			var name,
				i = 0,

				// Attribute names can contain non-HTML whitespace characters
				// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
				attrNames = value && value.match( rnothtmlwhite );

			if ( attrNames && elem.nodeType === 1 ) {
				while ( ( name = attrNames[ i++ ] ) ) {
					elem.removeAttribute( name );
				}
			}
		}
	} );

	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};

	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;

		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle,
				lowercaseName = name.toLowerCase();

			if ( !isXML ) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ lowercaseName ];
				attrHandle[ lowercaseName ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					lowercaseName :
					null;
				attrHandle[ lowercaseName ] = handle;
			}
			return ret;
		};
	} );




	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend( {
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},

		removeProp: function( name ) {
			return this.each( function() {
				delete this[ jQuery.propFix[ name ] || name ];
			} );
		}
	} );

	jQuery.extend( {
		prop: function( elem, name, value ) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if ( nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}

			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}

			if ( value !== undefined ) {
				if ( hooks && "set" in hooks &&
					( ret = hooks.set( elem, value, name ) ) !== undefined ) {
					return ret;
				}

				return ( elem[ name ] = value );
			}

			if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
				return ret;
			}

			return elem[ name ];
		},

		propHooks: {
			tabIndex: {
				get: function( elem ) {

					// Support: IE <=9 - 11 only
					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr( elem, "tabindex" );

					if ( tabindex ) {
						return parseInt( tabindex, 10 );
					}

					if (
						rfocusable.test( elem.nodeName ) ||
						rclickable.test( elem.nodeName ) &&
						elem.href
					) {
						return 0;
					}

					return -1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	} );

	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	// eslint rule "no-unused-expressions" is disabled for this code
	// since it considers such accessions noop
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function( elem ) {

				/* eslint no-unused-expressions: "off" */

				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;

					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each( [
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	} );




		// Strip and collapse whitespace according to HTML spec
		// https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
		function stripAndCollapse( value ) {
			var tokens = value.match( rnothtmlwhite ) || [];
			return tokens.join( " " );
		}


	function getClass( elem ) {
		return elem.getAttribute && elem.getAttribute( "class" ) || "";
	}

	jQuery.fn.extend( {
		addClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			if ( typeof value === "string" && value ) {
				classes = value.match( rnothtmlwhite ) || [];

				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );
					cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}

			return this;
		},

		removeClass: function( value ) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( j ) {
					jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
				} );
			}

			if ( !arguments.length ) {
				return this.attr( "class", "" );
			}

			if ( typeof value === "string" && value ) {
				classes = value.match( rnothtmlwhite ) || [];

				while ( ( elem = this[ i++ ] ) ) {
					curValue = getClass( elem );

					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

					if ( cur ) {
						j = 0;
						while ( ( clazz = classes[ j++ ] ) ) {

							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = stripAndCollapse( cur );
						if ( curValue !== finalValue ) {
							elem.setAttribute( "class", finalValue );
						}
					}
				}
			}

			return this;
		},

		toggleClass: function( value, stateVal ) {
			var type = typeof value;

			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}

			if ( jQuery.isFunction( value ) ) {
				return this.each( function( i ) {
					jQuery( this ).toggleClass(
						value.call( this, i, getClass( this ), stateVal ),
						stateVal
					);
				} );
			}

			return this.each( function() {
				var className, i, self, classNames;

				if ( type === "string" ) {

					// Toggle individual class names
					i = 0;
					self = jQuery( this );
					classNames = value.match( rnothtmlwhite ) || [];

					while ( ( className = classNames[ i++ ] ) ) {

						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}

				// Toggle whole class name
				} else if ( value === undefined || type === "boolean" ) {
					className = getClass( this );
					if ( className ) {

						// Store className if set
						dataPriv.set( this, "__className__", className );
					}

					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if ( this.setAttribute ) {
						this.setAttribute( "class",
							className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
						);
					}
				}
			} );
		},

		hasClass: function( selector ) {
			var className, elem,
				i = 0;

			className = " " + selector + " ";
			while ( ( elem = this[ i++ ] ) ) {
				if ( elem.nodeType === 1 &&
					( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
						return true;
				}
			}

			return false;
		}
	} );




	var rreturn = /\r/g;

	jQuery.fn.extend( {
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[ 0 ];

			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] ||
						jQuery.valHooks[ elem.nodeName.toLowerCase() ];

					if ( hooks &&
						"get" in hooks &&
						( ret = hooks.get( elem, "value" ) ) !== undefined
					) {
						return ret;
					}

					ret = elem.value;

					// Handle most common string cases
					if ( typeof ret === "string" ) {
						return ret.replace( rreturn, "" );
					}

					// Handle cases where value is null/undef or number
					return ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction( value );

			return this.each( function( i ) {
				var val;

				if ( this.nodeType !== 1 ) {
					return;
				}

				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";

				} else if ( typeof val === "number" ) {
					val += "";

				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					} );
				}

				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

				// If set returns undefined, fall back to normal setting
				if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			} );
		}
	} );

	jQuery.extend( {
		valHooks: {
			option: {
				get: function( elem ) {

					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :

						// Support: IE <=10 - 11 only
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						stripAndCollapse( jQuery.text( elem ) );
				}
			},
			select: {
				get: function( elem ) {
					var value, option, i,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one",
						values = one ? null : [],
						max = one ? index + 1 : options.length;

					if ( index < 0 ) {
						i = max;

					} else {
						i = one ? index : 0;
					}

					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];

						// Support: IE <=9 only
						// IE8-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&

								// Don't return options that are disabled or in a disabled optgroup
								!option.disabled &&
								( !option.parentNode.disabled ||
									!jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

							// Get the specific value for the option
							value = jQuery( option ).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				},

				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;

					while ( i-- ) {
						option = options[ i ];

						/* eslint-disable no-cond-assign */

						if ( option.selected =
							jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
						) {
							optionSet = true;
						}

						/* eslint-enable no-cond-assign */
					}

					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	} );

	// Radios and checkboxes getter/setter
	jQuery.each( [ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute( "value" ) === null ? "on" : elem.value;
			};
		}
	} );




	// Return jQuery for attributes-only inclusion


	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

	jQuery.extend( jQuery.event, {

		trigger: function( event, data, elem, onlyHandlers ) {

			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}

			if ( type.indexOf( "." ) > -1 ) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split( "." );
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf( ":" ) < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join( "." );
			event.rnamespace = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
				null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );

			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === ( elem.ownerDocument || document ) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;

				// jQuery handler
				handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
					dataPriv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}

				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {

				if ( ( !special._default ||
					special._default.apply( eventPath.pop(), data ) === false ) &&
					acceptData( elem ) ) {

					// Call a native DOM method on the target with the same name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];

						if ( tmp ) {
							elem[ ontype ] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;

						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		// Piggyback on a donor event to simulate a different one
		// Used only for `focus(in | out)` events
		simulate: function( type, elem, event ) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true
				}
			);

			jQuery.event.trigger( e, null, elem );
		}

	} );

	jQuery.fn.extend( {

		trigger: function( type, data ) {
			return this.each( function() {
				jQuery.event.trigger( type, data, this );
			} );
		},
		triggerHandler: function( type, data ) {
			var elem = this[ 0 ];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	} );


	jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup contextmenu" ).split( " " ),
		function( i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );

	jQuery.fn.extend( {
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		}
	} );




	support.focusin = "onfocusin" in window;


	// Support: Firefox <=44
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
	if ( !support.focusin ) {
		jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
			};

			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix );

					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access( doc, fix ) - 1;

					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						dataPriv.remove( doc, fix );

					} else {
						dataPriv.access( doc, fix, attaches );
					}
				}
			};
		} );
	}
	var location = window.location;

	var nonce = jQuery.now();

	var rquery = ( /\?/ );



	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE 9 - 11 only
		// IE throws on parseFromString with invalid input.
		try {
			xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};


	var
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams( prefix, obj, traditional, add ) {
		var name;

		if ( jQuery.isArray( obj ) ) {

			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {

					// Treat each array item as a scalar.
					add( prefix, v );

				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
						v,
						traditional,
						add
					);
				}
			} );

		} else if ( !traditional && jQuery.type( obj ) === "object" ) {

			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}

		} else {

			// Serialize scalar item.
			add( prefix, obj );
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, valueOrFunction ) {

				// If value is a function, invoke it and use its return value
				var value = jQuery.isFunction( valueOrFunction ) ?
					valueOrFunction() :
					valueOrFunction;

				s[ s.length ] = encodeURIComponent( key ) + "=" +
					encodeURIComponent( value == null ? "" : value );
			};

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );

		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" );
	};

	jQuery.fn.extend( {
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map( function() {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			} )
			.filter( function() {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			} )
			.map( function( i, elem ) {
				var val = jQuery( this ).val();

				if ( val == null ) {
					return null;
				}

				if ( jQuery.isArray( val ) ) {
					return jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					} );
				}

				return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			} ).get();
		}
	} );


	var
		r20 = /%20/g,
		rhash = /#.*$/,
		rantiCache = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,

		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},

		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),

		// Anchor tag for parsing the document origin
		originAnchor = document.createElement( "a" );
		originAnchor.href = location.href;

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {

		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {

			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

			if ( jQuery.isFunction( func ) ) {

				// For each dataType in the dataTypeExpression
				while ( ( dataType = dataTypes[ i++ ] ) ) {

					// Prepend if requested
					if ( dataType[ 0 ] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

					// Otherwise append
					} else {
						( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

		var inspected = {},
			seekingTransport = ( structure === transports );

		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			} );
			return selected;
		}

		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}

		return target;
	}

	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {

		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
			}
		}

		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {

			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}

	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},

			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while ( current ) {

			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}

			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}

			prev = current;
			current = dataTypes.shift();

			if ( current ) {

				// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {

					current = prev;

				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {

					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];

					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {

							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {

								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {

									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];

									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if ( conv !== true ) {

						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s.throws ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend( {

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test( location.protocol ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",

			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": JSON.parse,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?

				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},

		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),

		// Main method
		ajax: function( url, options ) {

			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,

				// URL without anti-cache param
				cacheURL,

				// Response headers
				responseHeadersString,
				responseHeaders,

				// timeout handle
				timeoutTimer,

				// Url cleanup var
				urlAnchor,

				// Request state (becomes false upon send and true upon completion)
				completed,

				// To know if global events are to be dispatched
				fireGlobals,

				// Loop variable
				i,

				// uncached part of the url
				uncached,

				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),

				// Callbacks context
				callbackContext = s.context || s,

				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					( callbackContext.nodeType || callbackContext.jquery ) ?
						jQuery( callbackContext ) :
						jQuery.event,

				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks( "once memory" ),

				// Status-dependent callbacks
				statusCode = s.statusCode || {},

				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},

				// Default abort message
				strAbort = "canceled",

				// Fake xhr
				jqXHR = {
					readyState: 0,

					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( completed ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
									responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},

					// Raw string
					getAllResponseHeaders: function() {
						return completed ? responseHeadersString : null;
					},

					// Caches the header
					setRequestHeader: function( name, value ) {
						if ( completed == null ) {
							name = requestHeadersNames[ name.toLowerCase() ] =
								requestHeadersNames[ name.toLowerCase() ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},

					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( completed == null ) {
							s.mimeType = type;
						}
						return this;
					},

					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( completed ) {

								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							} else {

								// Lazy-add the new callbacks in a way that preserves old ones
								for ( code in map ) {
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							}
						}
						return this;
					},

					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};

			// Attach deferreds
			deferred.promise( jqXHR );

			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || location.href ) + "" )
				.replace( rprotocol, location.protocol + "//" );

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

			// A cross-domain request is in order when the origin doesn't match the current origin.
			if ( s.crossDomain == null ) {
				urlAnchor = document.createElement( "a" );

				// Support: IE <=8 - 11, Edge 12 - 13
				// IE throws exception on accessing the href property if url is malformed,
				// e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;

					// Support: IE <=8 - 11 only
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch ( e ) {

					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}

			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}

			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

			// If request was aborted inside a prefilter, stop there
			if ( completed ) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger( "ajaxStart" );
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			// Remove hash to simplify url manipulation
			cacheURL = s.url.replace( rhash, "" );

			// More options handling for requests with no content
			if ( !s.hasContent ) {

				// Remember the hash so we can put it back
				uncached = s.url.slice( cacheURL.length );

				// If data is available, append data to url
				if ( s.data ) {
					cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add or update anti-cache param if needed
				if ( s.cache === false ) {
					cacheURL = cacheURL.replace( rantiCache, "$1" );
					uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
				}

				// Put hash and anti-cache on the URL that will be requested (gh-1732)
				s.url = cacheURL + uncached;

			// Change '%20' to '+' if this is encoded form body content (gh-2658)
			} else if ( s.data && s.processData &&
				( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
				s.data = s.data.replace( r20, "+" );
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}

			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
					s.accepts[ s.dataTypes[ 0 ] ] +
						( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);

			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}

			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend &&
				( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			completeDeferred.add( s.complete );
			jqXHR.done( s.success );
			jqXHR.fail( s.error );

			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}

				// If request was aborted inside ajaxSend, stop there
				if ( completed ) {
					return jqXHR;
				}

				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = window.setTimeout( function() {
						jqXHR.abort( "timeout" );
					}, s.timeout );
				}

				try {
					completed = false;
					transport.send( requestHeaders, done );
				} catch ( e ) {

					// Rethrow post-completion exceptions
					if ( completed ) {
						throw e;
					}

					// Propagate others as results
					done( -1, e );
				}
			}

			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;

				// Ignore repeat invocations
				if ( completed ) {
					return;
				}

				completed = true;

				// Clear timeout if it exists
				if ( timeoutTimer ) {
					window.clearTimeout( timeoutTimer );
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );

				// If successful, handle type chaining
				if ( isSuccess ) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader( "Last-Modified" );
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader( "etag" );
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}

					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";

					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";

					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";

				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}

				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;

				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}

				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}
			}

			return jqXHR;
		},

		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},

		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	} );

	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {

			// Shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax( jQuery.extend( {
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject( url ) && url ) );
		};
	} );


	jQuery._evalUrl = function( url ) {
		return jQuery.ajax( {
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			cache: true,
			async: false,
			global: false,
			"throws": true
		} );
	};


	jQuery.fn.extend( {
		wrapAll: function( html ) {
			var wrap;

			if ( this[ 0 ] ) {
				if ( jQuery.isFunction( html ) ) {
					html = html.call( this[ 0 ] );
				}

				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}

				wrap.map( function() {
					var elem = this;

					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}

					return elem;
				} ).append( this );
			}

			return this;
		},

		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each( function( i ) {
					jQuery( this ).wrapInner( html.call( this, i ) );
				} );
			}

			return this.each( function() {
				var self = jQuery( this ),
					contents = self.contents();

				if ( contents.length ) {
					contents.wrapAll( html );

				} else {
					self.append( html );
				}
			} );
		},

		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );

			return this.each( function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
			} );
		},

		unwrap: function( selector ) {
			this.parent( selector ).not( "body" ).each( function() {
				jQuery( this ).replaceWith( this.childNodes );
			} );
			return this;
		}
	} );


	jQuery.expr.pseudos.hidden = function( elem ) {
		return !jQuery.expr.pseudos.visible( elem );
	};
	jQuery.expr.pseudos.visible = function( elem ) {
		return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
	};




	jQuery.ajaxSettings.xhr = function() {
		try {
			return new window.XMLHttpRequest();
		} catch ( e ) {}
	};

	var xhrSuccessStatus = {

			// File protocol always yields status code 0, assume 200
			0: 200,

			// Support: IE <=9 only
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();

	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport( function( options ) {
		var callback, errorCallback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr();

					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}

					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {

									// Support: IE <=9 only
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if ( typeof xhr.status !== "number" ) {
										complete( 0, "error" );
									} else {
										complete(

											// File: protocol always yields status 0; see #8605, #14207
											xhr.status,
											xhr.statusText
										);
									}
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,

										// Support: IE <=9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										( xhr.responseType || "text" ) !== "text"  ||
										typeof xhr.responseText !== "string" ?
											{ binary: xhr.response } :
											{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};

					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = callback( "error" );

					// Support: IE 9 only
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if ( xhr.onabort !== undefined ) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function() {

							// Check readyState before timeout as it changes
							if ( xhr.readyState === 4 ) {

								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout( function() {
									if ( callback ) {
										errorCallback();
									}
								} );
							}
						};
					}

					// Create the abort callback
					callback = callback( "abort" );

					try {

						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {

						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},

				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );




	// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
	jQuery.ajaxPrefilter( function( s ) {
		if ( s.crossDomain ) {
			s.contents.script = false;
		}
	} );

	// Install script dataType
	jQuery.ajaxSetup( {
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	} );

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	} );

	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {

		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery( "<script>" ).prop( {
						charset: s.scriptCharset,
						src: s.url
					} ).on(
						"load error",
						callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						}
					);

					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	} );




	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup( {
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	} );

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" &&
					( s.contentType || "" )
						.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
					rjsonp.test( s.data ) && "data"
			);

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;

			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters[ "script json" ] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};

			// Force json dataType
			s.dataTypes[ 0 ] = "json";

			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always( function() {

				// If previous value didn't exist - remove it
				if ( overwritten === undefined ) {
					jQuery( window ).removeProp( callbackName );

				// Otherwise restore preexisting value
				} else {
					window[ callbackName ] = overwritten;
				}

				// Save back as free
				if ( s[ callbackName ] ) {

					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// Save the callback name for future use
					oldCallbacks.push( callbackName );
				}

				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}

				responseContainer = overwritten = undefined;
			} );

			// Delegate to script
			return "script";
		}
	} );




	// Support: Safari 8 only
	// In Safari 8 documents created via document.implementation.createHTMLDocument
	// collapse sibling forms: the second one becomes a child of the first one.
	// Because of that, this security measure has to be disabled in Safari 8.
	// https://bugs.webkit.org/show_bug.cgi?id=137337
	support.createHTMLDocument = ( function() {
		var body = document.implementation.createHTMLDocument( "" ).body;
		body.innerHTML = "<form></form><form></form>";
		return body.childNodes.length === 2;
	} )();


	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( typeof data !== "string" ) {
			return [];
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}

		var base, parsed, scripts;

		if ( !context ) {

			// Stop scripts or inline event handlers from being executed immediately
			// by using document.implementation
			if ( support.createHTMLDocument ) {
				context = document.implementation.createHTMLDocument( "" );

				// Set the base href for the created document
				// so any parsed elements with URLs
				// are based on the document's URL (gh-2965)
				base = context.createElement( "base" );
				base.href = document.location.href;
				context.head.appendChild( base );
			} else {
				context = document;
			}
		}

		parsed = rsingleTag.exec( data );
		scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[ 1 ] ) ];
		}

		parsed = buildFragment( [ data ], context, scripts );

		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	};


	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		var selector, type, response,
			self = this,
			off = url.indexOf( " " );

		if ( off > -1 ) {
			selector = stripAndCollapse( url.slice( off ) );
			url = url.slice( 0, off );
		}

		// If it's a function
		if ( jQuery.isFunction( params ) ) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax( {
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			} ).done( function( responseText ) {

				// Save response for use in complete callback
				response = arguments;

				self.html( selector ?

					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

					// Otherwise use the full result
					responseText );

			// If the request succeeds, this function gets "data", "status", "jqXHR"
			// but they are ignored because response was set above.
			// If it fails, this function gets "jqXHR", "status", "error"
			} ).always( callback && function( jqXHR, status ) {
				self.each( function() {
					callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
				} );
			} );
		}

		return this;
	};




	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	} );




	jQuery.expr.pseudos.animated = function( elem ) {
		return jQuery.grep( jQuery.timers, function( fn ) {
			return elem === fn.elem;
		} ).length;
	};




	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
	}

	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};

			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;

			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}

			if ( jQuery.isFunction( options ) ) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
			}

			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}

			if ( "using" in options ) {
				options.using.call( elem, props );

			} else {
				curElem.css( props );
			}
		}
	};

	jQuery.fn.extend( {
		offset: function( options ) {

			// Preserve chaining for setter
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each( function( i ) {
						jQuery.offset.setOffset( this, options, i );
					} );
			}

			var docElem, win, rect, doc,
				elem = this[ 0 ];

			if ( !elem ) {
				return;
			}

			// Support: IE <=11 only
			// Running getBoundingClientRect on a
			// disconnected node in IE throws an error
			if ( !elem.getClientRects().length ) {
				return { top: 0, left: 0 };
			}

			rect = elem.getBoundingClientRect();

			// Make sure element is not hidden (display: none)
			if ( rect.width || rect.height ) {
				doc = elem.ownerDocument;
				win = getWindow( doc );
				docElem = doc.documentElement;

				return {
					top: rect.top + win.pageYOffset - docElem.clientTop,
					left: rect.left + win.pageXOffset - docElem.clientLeft
				};
			}

			// Return zeros for disconnected and hidden elements (gh-2310)
			return rect;
		},

		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}

			var offsetParent, offset,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {

				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();

			} else {

				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				parentOffset = {
					top: parentOffset.top + jQuery.css( offsetParent[ 0 ], "borderTopWidth", true ),
					left: parentOffset.left + jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true )
				};
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},

		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function() {
			return this.map( function() {
				var offsetParent = this.offsetParent;

				while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			} );
		}
	} );

	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;

		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );

				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}

				if ( win ) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);

				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length );
		};
	} );

	// Support: Safari <=7 - 9.1, Chrome <=37 - 49
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );

					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	} );


	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
			function( defaultExtra, funcName ) {

			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

				return access( this, function( elem, type, value ) {
					var doc;

					if ( jQuery.isWindow( elem ) ) {

						// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
						return funcName.indexOf( "outer" ) === 0 ?
							elem[ "inner" + name ] :
							elem.document.documentElement[ "client" + name ];
					}

					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}

					return value === undefined ?

						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :

						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable );
			};
		} );
	} );


	jQuery.fn.extend( {

		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},

		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {

			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off( selector, "**" ) :
				this.off( types, selector || "**", fn );
		}
	} );

	jQuery.parseJSON = JSON.parse;




	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}




	var

		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$;

	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( !noGlobal ) {
		window.jQuery = window.$ = jQuery;
	}





	return jQuery;
	} );


/***/ },
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
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
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _imagePicker = __webpack_require__(180);

	var _imagePicker2 = _interopRequireDefault(_imagePicker);

	var _whiteSpace = __webpack_require__(137);

	var _whiteSpace2 = _interopRequireDefault(_whiteSpace);

	var _cropper = __webpack_require__(140);

	var _cropper2 = _interopRequireDefault(_cropper);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var url = "/otcdyanmic/appraisals.do?v=" + generateMixed(5); /*
	                                                             import React from 'react'
	                                                             import {render} from 'react-dom'
	                                                             import Userlist from '../../js/mobile_modules/islogin.js'
	                                                             import zepto from '../../js/mobile/zepto/1.0.0/zepto.js'
	                                                             import fontsize from '../../js/mobile/fontsize.js'
	                                                             import layer from '../../js/mobile/layer/layer.js'
	                                                             */

	var currturl = window.location.href; //获取当前url
	var daydate = geturl('day'); //走访时间
	var parenturl1 = "testproducts.html?custom_id=" + geturl('custom_id') + "&plan_id=" + geturl('plan_id') + "&day=" + daydate;

	var Saveproducts = React.createClass({
	    displayName: 'Saveproducts',

	    getInitialState: function getInitialState() {
	        return {
	            Y_login: true, //是否登录
	            unStuck: "",
	            referrer: topreurl(parenturl1), //上一页
	            custom_id: geturl('custom_id'),
	            plan_id: geturl('plan_id'),
	            goods_id: geturl('goods_id'),
	            visits_id: geturl('visits_id'),
	            goodsName: geturl('goodsName'),
	            detail_id: "", //产品id
	            goods_name: "", //产品名
	            purchase_source: "", //进货来源
	            display_surface: "", //陈列面
	            weighted_price: "", //加价权
	            purchase_number: "", //进货数量
	            tag_price: "", //标签价
	            image_urls: "", //图片
	            display_number: "", //陈列数
	            real_stock: "", //实际库存 
	            remark: "", //备注
	            //shop_point:"",      //铺点数
	            //sail_total:"" ,     // 销售额
	            batch_number: "", //批号
	            isloding: true,
	            isclick: true,
	            photoArr: ""
	        };
	    },

	    componentDidMount: function componentDidMount() {
	        var $this = this;

	        $(document).attr("title", this.state.goodsName + "-品牌俱乐部");

	        $(".Upload_btn").delegate('#filephoto', 'change', function () {
	            this.clickpoto();
	        }.bind(this));

	        //获取数据
	        this.pubsub_token = PubSub.subscribe('changprodupub', function (topic, newItem) {
	            this.setState({
	                unStuck: newItem.unStuck,
	                detail_id: isnull(newItem.detail_id), //产品id
	                goods_name: newItem.goods_name, //产品名
	                purchase_source: newItem.purchase_source, //进货来源
	                display_surface: newItem.display_surface, //陈列面
	                weighted_price: newItem.weighted_price, //加价权
	                purchase_number: newItem.purchase_number, //进货数量
	                tag_price: newItem.tag_price, //标签价
	                image_urls: newItem.image_urls, //图片
	                display_number: newItem.display_number, //陈列数
	                real_stock: newItem.real_stock, //实际库存 
	                remark: newItem.remark,
	                //shop_point:newItem.shop_point,               //铺点数
	                //sail_total:newItem.sail_total ,          // 销售额
	                batch_number: newItem.batch_number //批号
	            });
	            // if (newItem.detail_id != "" && newItem.detail_id != null && newItem.detail_id != undefined) {


	            $("#display_surface").val(newItem.display_surface); //陈列面
	            $("#display_number").val(newItem.display_number); //陈列数
	            $("#real_stock").val(newItem.real_stock); //实际库存 
	            $("#weighted_price").val(newItem.weighted_price); // 加价权
	            $("#tag_price").val(newItem.tag_price); //标签价

	            $("#purchase_number").val(newItem.purchase_number); //进货数量
	            $("#purchase_source").val(newItem.purchase_source); //进货来源
	            $("#batch_number").val(newItem.batch_number); //批号
	            $("#remark_text").val(newItem.remark); //备注
	            var imgsrc = newItem.image_urls;
	            if (imgsrc != "" && imgsrc.length > 0) {

	                //单个
	                if (imgsrc.indexOf(";") == -1) {
	                    //单个
	                    var photoname = todourl(imgsrc);
	                    $(".Upload_photos").append('<div class="previewimg" id="products1"><div class="imgwarp"> <img data-src="' + imgsrc + '"  data-name="' + photoname + '" src="' + isnullimg(imgsrc) + '"/><span class="imgclose"></span></div></div><p class="imgnum fn-hide1">1</p>');
	                    // this.lrzimg("/otc/"+imgsrc);
	                }
	                //单个结束


	                //多个 
	                if (imgsrc.indexOf(";") > -1) {
	                    //多个

	                    var imgspit = imgsrc.split(";");

	                    for (var i = 0; i <= imgspit.length - 1; i++) {

	                        $(".Upload_photos").append('<div class="previewimg" id="products' + (i + 1) + '"><div class="imgwarp"> <img data-src="' + imgspit[i] + '"  data-name="' + imgspit[i] + '" src="' + isnullimg(imgspit[i]) + '"/><span class="imgclose"></span></div><p class="imgnum fn-hide1">' + (i + 1) + '</p></div>');
	                        //this.lrzimg("/otc/" + imgspit[i], todourl(imgspit[i]));
	                    }
	                }
	                //多个结束
	                $(".imgwarp").delegate('.imgclose', 'click', function () {

	                    var $this1 = $(this).parent().parent();
	                    $this.removeimg($this1);
	                });
	            }

	            // }
	        }.bind(this));
	    },

	    componentWillUnmount: function componentWillUnmount() {
	        PubSub.unsubscribe(this.pubsub_token);
	    },

	    /*
	    //获取后台图片时压缩图片
	    lrzimg: function (imgurl, photoname) {
	        //压缩图片
	     
	        lrz(imgurl)
	            .then(function (rst) {
	                // 处理成功会执行
	                  //proimg = rst.base64;
	                $(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
	                //$("#preview").attr("src", proimg);//图片
	            })
	            .catch(function (err) {
	                // proimg = "1";
	                  // 处理失败会执行
	            })
	            .always(function () {
	            // 不管是成功失败，都会执行
	            });
	        //压缩图片结束
	      },
	      //获取后台图片时压缩图片结束
	    */
	    //点击上传图片
	    clickpoto: function clickpoto() {

	        var $images = $('#cutoutphoto');
	        //获取图片
	        var preview,
	            img_txt,
	            file_head = document.getElementById("filephoto"),
	            picture = file_head.value;
	        var $inputImage = $('#filephoto');
	        file_head.select();

	        var preview_src;
	        //获取图片url
	        if (file_head.files && file_head.files[0]) {
	            preview_src = window.navigator.userAgent.indexOf("Chrome") >= 1 || window.navigator.userAgent.indexOf("Safari") >= 1 ? window.webkitURL.createObjectURL(file_head.files[0]) : window.URL.createObjectURL(file_head.files[0]);
	        } else {
	            img_txt = document.selection.createRange().text;

	            preview_src = img_txt;
	            document.selection.empty();
	        }

	        //获取图片url结束

	        //获取图片名
	        var pos1 = picture.lastIndexOf("\\");

	        var pos2 = picture.lastIndexOf(".");

	        var pos = picture.substring(pos1 + 1, pos2);
	        var photoname = picture.substring(pos1 + 1, picture.length);
	        //$("#preview").attr("data-name", photoname);
	        //获取图片名结束

	        var $images = $('#cutoutphoto');
	        //压缩图片
	        var $this = this;
	        var img = new Image();
	        img.src = preview_src;
	        var rqi = ".divPhoto";
	        if (img.complete) {
	            var imgwd = img.width;

	            if (imgwd > 640) {
	                lrz(preview_src, { width: 640 }).then(function (rst) {
	                    // 处理成功会执行
	                    $("#cutoutphoto").attr("src", rst.base64);
	                    $("#cutoutphoto").attr("data-name", photoname);

	                    // $('.cropconter').animate({ "left": "0px" }, 1000);
	                    $('#yourElement').css("-webkit-transform", "translateX(0%)");
	                    //裁剪图片
	                    $images.cropper({
	                        aspectRatio: 1 / 1,
	                        autoCropArea: 0.9,
	                        background: false,
	                        guides: false,
	                        rotatable: false,
	                        movable: true,
	                        dragCrop: false,
	                        resizable: false
	                    });

	                    /*
	                            layer.open({
	                                shade: true,
	                                content: '头像上传中...',
	                                skin: 'msg',
	                                className: 'tip',
	                            });
	                             $this.ajaxphoto(rst.base64, photoname, $this);
	                             */

	                    //  $(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
	                    //$("#preview").attr("src", rst.base64);
	                }).catch(function (err) {
	                    // 处理失败会执行
	                }).always(function () {
	                    // 不管是成功失败，都会执行
	                });
	            }

	            if (imgwd <= 640) {
	                lrz(preview_src).then(function (rst) {
	                    // 处理成功会执行
	                    $("#cutoutphoto").attr("src", rst.base64);
	                    $("#cutoutphoto").attr("data-name", photoname);
	                    // $('.cropconter').animate({ "left": "0px" }, 1000);
	                    $('#yourElement').css("-webkit-transform", "translateX(0%)");
	                    //裁剪图片
	                    $images.cropper({
	                        aspectRatio: 1 / 1,
	                        autoCropArea: 0.9,
	                        background: false,
	                        guides: false,
	                        rotatable: false,
	                        movable: true,
	                        dragCrop: false,
	                        resizable: false
	                    });
	                    /*
	                             layer.open({
	                                shade: true,
	                                content: '头像上传中...',
	                                skin: 'msg',
	                                className: 'tip',
	                            });
	                            
	                             $this.ajaxphoto(rst.base64, photoname, $this);
	                             */
	                    //$(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
	                    //$("#preview").attr("src", rst.base64);
	                }).catch(function (err) {
	                    // 处理失败会执行
	                }).always(function () {
	                    // 不管是成功失败，都会执行
	                });
	            }
	        } else {
	            img.onload = function () {
	                var imgwd1 = img.width;

	                if (imgwd1 > 640) {
	                    lrz(preview_src, { width: 640 }).then(function (rst) {
	                        // 处理成功会执行
	                        $("#cutoutphoto").attr("src", rst.base64);
	                        $("#cutoutphoto").attr("data-name", photoname);
	                        // $('.cropconter').animate({ "left": "0px" }, 1000);
	                        $('#yourElement').css("-webkit-transform", "translateX(0%)");
	                        //裁剪图片
	                        $images.cropper({
	                            aspectRatio: 1 / 1,
	                            autoCropArea: 0.9,
	                            background: false,
	                            guides: false,
	                            rotatable: false,
	                            movable: true,
	                            dragCrop: false,
	                            resizable: false
	                        });
	                        /*
	                         layer.open({
	                        shade: true,
	                        content: '头像上传中...',
	                        skin: 'msg',
	                        className: 'tip',
	                        });
	                        $this.ajaxphoto(rst.base64, photoname, $this);
	                        */
	                        //$(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
	                        // $("#preview").attr("src", rst.base64);
	                    }).catch(function (err) {
	                        // 处理失败会执行
	                    }).always(function () {
	                        // 不管是成功失败，都会执行
	                    });
	                }
	                if (imgwd1 <= 640) {
	                    lrz(preview_src).then(function (rst) {
	                        // 处理成功会执行
	                        $("#cutoutphoto").attr("src", rst.base64);
	                        $("#cutoutphoto").attr("data-name", photoname);
	                        // $('.cropconter').animate({ "left": "0px" }, 1000);
	                        $('#yourElement').css("-webkit-transform", "translateX(0%)");
	                        //裁剪图片
	                        $images.cropper({
	                            aspectRatio: 1 / 1,
	                            autoCropArea: 0.9,
	                            background: false,
	                            guides: false,
	                            rotatable: false,
	                            movable: true,
	                            dragCrop: false,
	                            resizable: false
	                        });
	                        /*
	                         layer.open({
	                        shade: true,
	                        content: '头像上传中...',
	                        skin: 'msg',
	                        className: 'tip',
	                        });
	                        $this.ajaxphoto(rst.base64, photoname, $this);
	                        */
	                        //$(".Upload_photos").append('<div class="previewimg"><div class="imgwarp"> <img  data-name="' + photoname + '" src="' + rst.base64 + '"/><span class="imgclose"  onTouchEnd="$(this).parent().parent().remove()" ></span></div></div>');
	                        //$("#preview").attr("src", rst.base64);
	                    }).catch(function (err) {
	                        // 处理失败会执行
	                    }).always(function () {
	                        // 不管是成功失败，都会执行
	                    });
	                }

	                img.onload = null;
	            };
	        };
	    },

	    check: function check() {
	        var display_surface = $("#display_surface").val(); //陈列面
	        var display_number = $("#display_number").val(); //陈列数
	        var real_stock = $("#real_stock").val(); //实际库存 
	        var weighted_price = $("#weighted_price").val(); // 加价权
	        var tag_price = $("#tag_price").val(); //标签价
	        var sail_number = $("#sail_number").val(); //销售总额
	        var purchase_number = $("#purchase_number").val(); //进货数量
	        var purchase_source = $("#purchase_source").val(); //进货来源
	        var batch_number = $("#batch_number").val(); //批号
	        var image_urls = $("#preview").attr("src"); //图片
	        var fileName = $("#preview").attr("data-name"); //图片名字
	        var remark = $("#remark_text").val(); //备注
	        var reg = /^([1-9]\d*|[0]{1,1})$/; //判断正整数:（包括0） 
	        var reg1 = /^\d+(\.\d+)?$/; //判断数字:（包括小数点） 
	        var reg2 = /^[A-Za-z0-9]+$/; //匹配由数字和26个英文字母组成的字符串
	        if (display_surface == "" && display_surface.length <= 0) {
	            layer.open({
	                shade: true,
	                content: '陈列面不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }

	        if (!reg.exec(display_surface)) {
	            layer.open({
	                shade: true,
	                content: '陈列面值必须为数字',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        if (display_number == "" && display_number.length <= 0) {
	            layer.open({
	                shade: true,
	                content: '陈列数不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }

	        if (!reg.exec(display_number)) {
	            layer.open({
	                shade: true,
	                content: '陈列数值必须为数字',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        if (real_stock == "" && real_stock.length <= 0) {
	            layer.open({
	                shade: true,
	                content: '实际库存不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }

	        if (!reg.exec(real_stock)) {
	            layer.open({
	                shade: true,
	                content: '实际库存值必须为数字',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        if (weighted_price == "" && weighted_price.length <= 0) {
	            layer.open({
	                shade: true,
	                content: '加价权不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        /*
	        if (!reg1.exec(weighted_price)) {
	          layer.open({
	              shade: false,
	              content: '加价权值必须为数字',
	              skin: 'msg',
	              className: 'tip',
	              time: 2 //2秒后自动关闭
	          });
	          return false;
	        }
	        /*
	        if (weighted_price > 100) {
	          layer.open({
	              shade: false,
	              content: '加价权值必须为100以内的数字',
	              skin: 'msg',
	              className: 'tip',
	              time: 2 //2秒后自动关闭
	          });
	          return false;
	        }
	        */
	        if (tag_price == "" && tag_price.length <= 0) {
	            layer.open({
	                shade: true,
	                content: '标签价不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }

	        if (!reg1.exec(tag_price)) {
	            layer.open({
	                shade: true,
	                content: '标签价值必须为数字',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        /*
	           if (sail_number==""&& sail_number.length <= 0) {
	               layer.open({
	                   shade: false,
	                   content: '销售总额不能为空',
	                   skin: 'msg',
	                   className: 'tip',
	                   time: 2 //2秒后自动关闭
	               });
	               return false;
	           }
	           
	            if (!reg.exec(sail_number)) {
	                 layer.open({
	                   shade: false,
	                   content: '销售总额值必须为数字',
	                   skin: 'msg',
	                   className: 'tip',
	                   time: 2 //2秒后自动关闭
	               });
	            return false;
	            }
	           */
	        if (purchase_number == "" && purchase_number.length <= 0) {
	            layer.open({
	                shade: true,
	                content: '进货数量不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }

	        if (!reg.exec(purchase_number)) {
	            layer.open({
	                shade: true,
	                content: '进货数量值必须为数字',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        /*
	        if (purchase_source == "" && purchase_source.length <= 0) {
	            layer.open({
	                shade: false,
	                content: '进货来源不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        */
	        /*
	        if (batch_number == "" && batch_number.length <= 0) {
	            layer.open({
	                shade: false,
	                content: '批号不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	        */
	        /*
	          if (!reg2.exec(batch_number)) {
	              layer.open({
	                  shade: false,
	                  content: '批号值必须为数字和26个英文字母组成的字符串',
	                  skin: 'msg',
	                  className: 'tip',
	                  time: 2 //2秒后自动关闭
	              });
	              return false;
	          }
	          */
	        /*
	        if (remark == "" && remark.length <= 0) {
	            layer.open({
	                shade: false,
	                content: '备注内容不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        }
	         */
	        var imgnum = $(".Upload_photos").find(".imgwarp").length;

	        if (imgnum <= 0) {
	            layer.open({
	                shade: true,
	                content: '图片不能为空',
	                skin: 'msg',
	                className: 'tip',
	                time: 2 //2秒后自动关闭
	            });
	            return false;
	        } else {

	            if (this.state.isclick) {
	                this.saveinfo();
	                setTimeout(function () {
	                    if (this.state.isloding) {
	                        layer.open({
	                            shade: true,
	                            content: '正在保存信息...',
	                            skin: 'msg',
	                            className: 'tip'
	                        });
	                    }
	                }.bind(this), 1000);
	            }
	        }
	    },
	    //上传图片
	    ajaxphoto: function ajaxphoto(img, imgname, str) {
	        this.setState({ //禁止点击
	            isclick: false
	        });
	        var $this = str;
	        var object = new Object();
	        object.openId = OpenID;
	        object.controlType = "uploadImg";
	        object.base64Img = img;
	        object.fileName = imgname;
	        var showbox = this.refs.content;
	        var referrer = this.state.referrer;
	        //上传图片ajax
	        ajaxFn(object, $this, function (data) {

	            console.log("上传图片成功");
	            $(".layermcont").html("上传图片成功");
	            $this.cancelcropper();
	            setTimeout(function () {
	                layer.closeAll();
	            }, 1000);
	            var j = $(".Upload_photos").find(".imgwarp").length;

	            var imgsrc = isnullimg1(data.map.filePath);
	            $(".Upload_photos").append('<div class="previewimg" id="products' + (j + 1) + '"><div class="imgwarp"><img  data-src="' + imgsrc + '"  data-name="' + imgname + '" src="' + imgsrc + '"/><span class="imgclose"></span></div><p class="imgnum fn-hide1">' + (j + 1) + '</p></div>');
	            $(".imgwarp").delegate('.imgclose', 'click', function () {
	                var $this1 = $(this).parent().parent();
	                $this.removeimg($this1);
	            });
	            $this.setState({
	                isclick: true
	            });
	        }, url, showbox, referrer);

	        //上传图片ajax结束
	    },
	    removeimg: function removeimg(str) {
	        var imgnums = parseInt($(".Upload_photos").find(".imgwarp").length); //图片数
	        var photoId = str.attr("id");
	        var id = parseInt(str.find(".imgnum").html());
	        str.remove();
	        console.log("id:" + id + ";imgnums:" + imgnums);
	        for (var i = id + 1; i <= imgnums; i++) {
	            console.log(i);
	            $("#products" + i).find(".imgnum").html(i - 1);
	            $("#products" + i).attr("id", "#products" + (i - 1));
	        }
	    },

	    //保存数据ajax
	    saveinfo: function saveinfo() {
	        var $this = this;

	        this.setState({ //禁止点击
	            isclick: false
	        });
	        var unStuck = this.state.unStuck;
	        var display_surface = $("#display_surface").val(); //陈列面
	        var display_number = $("#display_number").val(); //陈列数
	        var real_stock = $("#real_stock").val(); //实际库存 
	        //var weighted_price = $("#weighted_price").val();   // 加价权
	        var tag_price = $("#tag_price").val(); //标签价
	        var sail_number = $("#sail_number").val(); //销售总额
	        var purchase_number = $("#purchase_number").val(); //进货数量
	        var purchase_source = $("#purchase_source").val(); //进货来源
	        var batch_number = $("#batch_number").val(); //批号
	        var image_urls = ""; //图片
	        var fileName = ""; //图片名字
	        var imgnums = $(".Upload_photos").find(".imgwarp").length;

	        if (imgnums == 1) {
	            image_urls = $(".Upload_photos").find(".imgwarp img").attr("data-src");
	        }
	        if (imgnums > 1) {
	            $.each($(".Upload_photos .previewimg"), function (i, n) {
	                if (i == imgnums - 1) {
	                    image_urls += $(this).find(".imgwarp img").attr("data-src");
	                } else {
	                    image_urls += $(this).find(".imgwarp img").attr("data-src") + ";";
	                }
	            });
	        }

	        var remark = $("#remark_text").val(); //备注
	        //var shop_point=$("#shop_point").attr("data-name");  //铺点数
	        //var sail_total=$("#sail_total").attr("data-name");  //销售额
	        var object = new Object();
	        object.openId = OpenID;
	        object.controlType = "add";
	        object.goods_id = this.state.goods_id;
	        object.visits_id = this.state.visits_id;
	        object.display_surface = display_surface; //陈列面
	        object.display_number = display_number; //陈列数
	        object.real_stock = real_stock; //实际库存 
	        // object.weighted_price = weighted_price;   // 加价权
	        object.tag_price = tag_price; //标签价
	        object.sail_number = sail_number; //销售总额
	        object.purchase_number = purchase_number; //进货数量
	        object.purchase_source = purchase_source; //进货来源
	        object.batch_number = batch_number; //批号
	        object.remark = remark; //

	        object.fileNames = image_urls;
	        var detail_id = this.state.detail_id;

	        if (detail_id != "" && detail_id != null && detail_id != undefined) {
	            object.detail_id = detail_id;
	        }
	        var showbox = this.refs.content;
	        // 保存信息ajax
	        ajaxFn(object, $this, function (data) {

	            layer.closeAll();
	            layer.open({
	                shade: true,
	                content: '保存数据成功',
	                skin: 'msg',
	                className: 'tip',
	                time: 2
	            });
	            setTimeout(function () {
	                window.location.href = $this.state.referrer;
	                //location.reload();
	                $this.setState({
	                    isclick: true
	                });
	            }, 2000);
	        }, url, showbox, this.state.referrer);
	        // 保存信息ajax结束  
	    },

	    save: function save() {

	        this.check();
	        // window.location.href = "productarticle.html";
	    },
	    cancelcropper: function cancelcropper() {
	        $('#yourElement').css("-webkit-transform", "translateX(180%)");
	        setTimeout(function () {
	            var $images = $('#cutoutphoto');
	            $(".crophoto").html("<img id='cutoutphoto' data-name='' src='' />");
	            $images.cropper('reset').cropper('replace', "");
	            $('#yourElement').removeClass('selecteds');
	        }, 600);
	    },

	    confirmcropper: function confirmcropper() {

	        var photourl = "";
	        var $images = $('#cutoutphoto');
	        //$images.cropper("enable");
	        var photo_name = $images.attr("data-name");
	        var $this = this;
	        var croppedCanvas = $images.cropper('getCroppedCanvas');
	        photourl = croppedCanvas.toDataURL();
	        var $this = this;

	        if (this.state.isclick) {
	            layer.open({
	                shade: true,
	                content: '图片上传中...',
	                skin: 'msg',
	                className: 'tip'
	            });
	            $this.ajaxphoto(photourl, photo_name, $this);
	        }
	    },
	    changes: function changes(event) {
	        var id = event.currentTarget.getAttribute("id");
	        $("#" + id).removeClass("black");
	    },
	    render: function render() {
	        return React.createElement(
	            'div',
	            null,
	            React.createElement(
	                'div',
	                { className: 'profile white', id: 'pagenav' },
	                React.createElement(
	                    'span',
	                    { className: 'toleft' },
	                    ' ',
	                    React.createElement('a', { href: this.state.referrer })
	                ),
	                this.state.goodsName
	            ),
	            React.createElement(
	                'div',
	                { ref: 'content' },
	                React.createElement(
	                    'h1',
	                    { className: 'saveprodt_Title ' },
	                    '\u5E93\u5B58'
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'profile pro_border ' },
	                    React.createElement(
	                        'dl',
	                        { className: 'white profile_pading save_input', id: 'save_input' },
	                        React.createElement(
	                            'dt',
	                            null,
	                            React.createElement(
	                                'label',
	                                null,
	                                '\u9648\u5217\u9762\uFF1A'
	                            ),
	                            React.createElement('input', { className: 'pdt_input  black', id: 'display_surface', onChange: this.changes, placeholder: '\u8BF7\u8F93\u5165' })
	                        )
	                    ),
	                    React.createElement(
	                        'dl',
	                        { className: 'white profile_pading save_input', id: 'save_input' },
	                        React.createElement(
	                            'dt',
	                            null,
	                            React.createElement(
	                                'label',
	                                null,
	                                '\u9648\u5217\u6570\uFF1A'
	                            ),
	                            React.createElement('input', { className: 'pdt_input black', id: 'display_number', onChange: this.changes, placeholder: '\u8BF7\u8F93\u5165' })
	                        )
	                    ),
	                    React.createElement(
	                        'dl',
	                        { className: 'white profile_pading save_input', id: 'save_input' },
	                        React.createElement(
	                            'dt',
	                            null,
	                            React.createElement(
	                                'label',
	                                null,
	                                '\u5B9E\u9645\u5E93\u5B58\uFF1A'
	                            ),
	                            React.createElement('input', { className: 'pdt_input black', id: 'real_stock', onChange: this.changes, placeholder: '\u8BF7\u8F93\u5165' })
	                        )
	                    ),
	                    React.createElement(
	                        'dl',
	                        { className: 'white save_input profile_pading', id: 'save_input' },
	                        React.createElement(
	                            'dt',
	                            null,
	                            React.createElement(
	                                'label',
	                                null,
	                                '\u6807\u7B7E\u4EF7\uFF1A'
	                            ),
	                            React.createElement('input', { className: 'pdt_input  black', id: 'tag_price', onChange: this.changes, placeholder: '\u8BF7\u8F93\u5165' })
	                        )
	                    )
	                ),
	                React.createElement(
	                    'h1',
	                    { className: 'saveprodt_Title  ' },
	                    '\u8FDB\u8D27'
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'profile pro_border ' },
	                    React.createElement(
	                        'dl',
	                        { className: 'white save_input profile_pading', id: 'save_input' },
	                        React.createElement(
	                            'dt',
	                            null,
	                            React.createElement(
	                                'label',
	                                null,
	                                '\u8FDB\u8D27\u6570\u91CF\uFF1A'
	                            ),
	                            React.createElement('input', { className: 'pdt_input  black', id: 'purchase_number', onChange: this.changes, placeholder: '\u8BF7\u8F93\u5165' })
	                        )
	                    ),
	                    React.createElement(
	                        'dl',
	                        { className: 'white save_input profile_pading', id: 'save_input' },
	                        React.createElement(
	                            'dt',
	                            null,
	                            React.createElement(
	                                'label',
	                                null,
	                                '\u8FDB\u8D27\u6765\u6E90\uFF1A'
	                            ),
	                            React.createElement('input', { className: 'pdt_input  black', id: 'purchase_source', onChange: this.changes, placeholder: '\u8BF7\u8F93\u5165' })
	                        )
	                    ),
	                    React.createElement(
	                        'dl',
	                        { className: 'white save_input profile_pading', id: 'save_input' },
	                        React.createElement(
	                            'dt',
	                            null,
	                            React.createElement(
	                                'label',
	                                null,
	                                '\u6279\u53F7\uFF1A'
	                            ),
	                            React.createElement('input', { className: 'pdt_input  black', id: 'batch_number', onChange: this.changes, placeholder: '\u8BF7\u8F93\u5165' })
	                        )
	                    ),
	                    React.createElement(
	                        'h1',
	                        { className: 'saveprodt_Title  ' },
	                        '\u5907\u6CE8'
	                    ),
	                    React.createElement('textarea', { name: 'remark_text', className: 'remark black', id: 'remark_text', cols: '450', rows: '5', onChange: this.changes, placeholder: '\u8BF7\u8F93\u5165\u4F60\u8981\u7EAA\u5F55\u7684\u5185\u5BB9' })
	                ),
	                React.createElement(
	                    'h1',
	                    { className: 'saveprodt_Title  ' },
	                    '\u4E0A\u4F20\u56FE\u7247'
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'white margint_1r Upload_photo' },
	                    React.createElement('div', { className: 'Upload_photos' }),
	                    React.createElement(
	                        'div',
	                        { className: 'Upload_btn' },
	                        React.createElement('input', { type: 'file', capture: 'camera', accept: 'image/*', id: 'filephoto', name: 'filephoto' })
	                    )
	                ),
	                React.createElement(
	                    'button',
	                    { className: 'fn-btn', onTouchEnd: this.save },
	                    '\u4FDD\u5B58'
	                ),
	                React.createElement(
	                    'div',
	                    { className: 'yourElements', id: 'yourElement' },
	                    React.createElement(
	                        'div',
	                        { className: 'crophoto' },
	                        React.createElement('img', { id: 'cutoutphoto', 'data-name': '', src: '' })
	                    ),
	                    React.createElement(
	                        'div',
	                        { className: 'cropbtn' },
	                        React.createElement(
	                            'p',
	                            null,
	                            React.createElement(
	                                'span',
	                                { className: 'btnN', onTouchStart: this.cancelcropper },
	                                '\u53D6\u6D88'
	                            ),
	                            React.createElement(
	                                'span',
	                                { className: 'btnY', onTouchStart: this.confirmcropper },
	                                '\u786E\u8BA4'
	                            )
	                        )
	                    )
	                )
	            )
	        );
	    }
	});

	module.exports = Saveproducts;

	/*
	ReactDOM.render(
	    <Saveproducts />,
	    document.getElementById('conter')
	);
	*/

/***/ },
/* 180 */
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

	var _wingBlank = __webpack_require__(138);

	var _wingBlank2 = _interopRequireDefault(_wingBlank);

	var _flex = __webpack_require__(181);

	var _flex2 = _interopRequireDefault(_flex);

	var _toast = __webpack_require__(184);

	var _toast2 = _interopRequireDefault(_toast);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function noop() {}

	var ImagePicker = function (_React$Component) {
	    (0, _inherits3["default"])(ImagePicker, _React$Component);

	    function ImagePicker() {
	        (0, _classCallCheck3["default"])(this, ImagePicker);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        // http://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side
	        var _this = (0, _possibleConstructorReturn3["default"])(this, _React$Component.call.apply(_React$Component, [this].concat(args)));

	        _this.getOrientation = function (file, callback) {
	            if (!/iphone|ipad/i.test(navigator.userAgent)) {
	                callback('-1');
	            } else {
	                var reader = new FileReader();
	                reader.onload = function (e) {
	                    var view = new DataView(e.target.result);
	                    if (view.getUint16(0, false) !== 0xFFD8) {
	                        return callback(-2);
	                    }
	                    var length = view.byteLength;
	                    var offset = 2;
	                    while (offset < length) {
	                        var marker = view.getUint16(offset, false);
	                        offset += 2;
	                        if (marker === 0xFFE1) {
	                            var tmp = view.getUint32(offset += 2, false);
	                            if (tmp !== 0x45786966) {
	                                return callback(-1);
	                            }
	                            var little = view.getUint16(offset += 6, false) === 0x4949;
	                            offset += view.getUint32(offset + 4, little);
	                            var tags = view.getUint16(offset, little);
	                            offset += 2;
	                            for (var i = 0; i < tags; i++) {
	                                if (view.getUint16(offset + i * 12, little) === 0x0112) {
	                                    return callback(view.getUint16(offset + i * 12 + 8, little));
	                                }
	                            }
	                        } else if ((marker & 0xFF00) !== 0xFF00) {
	                            break;
	                        } else {
	                            offset += view.getUint16(offset, false);
	                        }
	                    }
	                    return callback(-1);
	                };
	                reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
	            }
	        };
	        _this.removeImage = function (index) {
	            var newImages = [];
	            _this.props.files.forEach(function (image, idx) {
	                if (index !== idx) {
	                    newImages.push(image);
	                }
	            });
	            _this.props.onChange(newImages, 'remove', index);
	        };
	        _this.addImage = function (imgItem) {
	            var newImages = _this.props.files.concat(imgItem);
	            _this.props.onChange(newImages, 'add');
	        };
	        _this.onFileChange = function () {
	            var fileSelectorEl = _this.refs.fileSelectorInput;
	            if (fileSelectorEl.files && fileSelectorEl.files.length) {
	                (function () {
	                    var file = fileSelectorEl.files[0];
	                    var reader = new FileReader();
	                    reader.onload = function (e) {
	                        var dataURL = e.target.result;
	                        if (!dataURL) {
	                            _toast2["default"].fail('图片获取失败');
	                            return;
	                        }
	                        var orientation = 1;
	                        _this.getOrientation(file, function (res) {
	                            // -2: not jpeg , -1: not defined
	                            if (res > 0) {
	                                orientation = res;
	                            }
	                            _this.addImage({
	                                url: dataURL,
	                                orientation: orientation
	                            });
	                            fileSelectorEl.value = '';
	                        });
	                    };
	                    reader.readAsDataURL(file);
	                })();
	            }
	        };
	        return _this;
	    }

	    ImagePicker.prototype.render = function render() {
	        var _classNames,
	            _this2 = this;

	        var _props = this.props;
	        var prefixCls = _props.prefixCls;
	        var style = _props.style;
	        var className = _props.className;
	        var files = _props.files;

	        var dpr = window.devicePixelRatio || 1;
	        var imgItemList = [];
	        var customWidth = (document.documentElement.clientWidth - 18 * dpr - 6 * dpr * 3) / 4;
	        var wrapCls = (0, _classnames2["default"])((_classNames = {}, (0, _defineProperty3["default"])(_classNames, '' + prefixCls, true), (0, _defineProperty3["default"])(_classNames, className, className), _classNames));
	        var itemStyle = {
	            width: customWidth + 'px',
	            height: customWidth + 'px'
	        };
	        files.forEach(function (image, index) {
	            imgItemList.push(React.createElement(
	                'div',
	                { key: index, className: prefixCls + '-item', style: itemStyle },
	                React.createElement('div', { className: prefixCls + '-item-remove', onClick: _this2.removeImage.bind(_this2, index) }),
	                React.createElement('div', { className: prefixCls + '-item-content', style: { backgroundImage: 'url(' + image.url + ')' } })
	            ));
	        });
	        return React.createElement(
	            'div',
	            { className: wrapCls, style: style },
	            React.createElement(
	                'div',
	                { className: prefixCls + '-list' },
	                React.createElement(
	                    _wingBlank2["default"],
	                    { size: 'md' },
	                    React.createElement(
	                        _flex2["default"],
	                        { wrap: 'wrap' },
	                        imgItemList,
	                        React.createElement(
	                            'div',
	                            { className: prefixCls + '-item ' + prefixCls + '-upload-btn', style: itemStyle },
	                            React.createElement('input', { style: itemStyle, ref: 'fileSelectorInput', type: 'file', accept: 'image/jpg,image/jpeg,image/png,image/gif', onChange: this.onFileChange })
	                        )
	                    )
	                )
	            )
	        );
	    };

	    return ImagePicker;
	}(React.Component);

	exports["default"] = ImagePicker;

	ImagePicker.defaultProps = {
	    prefixCls: 'am-image-picker',
	    files: [],
	    onChange: noop
	};
	module.exports = exports['default'];

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Flex = __webpack_require__(182);

	var _Flex2 = _interopRequireDefault(_Flex);

	var _FlexItem = __webpack_require__(183);

	var _FlexItem2 = _interopRequireDefault(_FlexItem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	_Flex2["default"].Item = _FlexItem2["default"];
	exports["default"] = _Flex2["default"];
	module.exports = exports['default'];

/***/ },
/* 182 */
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

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var Flex = function (_React$Component) {
	    (0, _inherits3["default"])(Flex, _React$Component);

	    function Flex() {
	        (0, _classCallCheck3["default"])(this, Flex);
	        return (0, _possibleConstructorReturn3["default"])(this, _React$Component.apply(this, arguments));
	    }

	    Flex.prototype.render = function render() {
	        var _classNames;

	        var _props = this.props;
	        var direction = _props.direction;
	        var wrap = _props.wrap;
	        var justify = _props.justify;
	        var align = _props.align;
	        var alignContent = _props.alignContent;
	        var className = _props.className;
	        var children = _props.children;
	        var prefixCls = _props.prefixCls;
	        var style = _props.style;
	        var onClick = _props.onClick;

	        var wrapCls = (0, _classnames2["default"])((_classNames = {}, (0, _defineProperty3["default"])(_classNames, prefixCls, true), (0, _defineProperty3["default"])(_classNames, prefixCls + '-dir-row', direction === 'row'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-dir-row-reverse', direction === 'row-reverse'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-dir-column', direction === 'column'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-dir-column-reverse', direction === 'column-reverse'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-nowrap', wrap === 'nowrap'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-wrap', wrap === 'wrap'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-wrap-reverse', wrap === 'wrap-reverse'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-justify-start', justify === 'start'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-justify-end', justify === 'end'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-justify-center', justify === 'center'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-justify-between', justify === 'between'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-justify-around', justify === 'around'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-top', align === 'top' || align === 'start'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-middle', align === 'middle' || align === 'center'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-bottom', align === 'bottom' || align === 'end'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-baseline', align === 'baseline'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-stretch', align === 'stretch'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-content-start', alignContent === 'start'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-content-end', alignContent === 'end'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-content-center', alignContent === 'center'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-content-between', alignContent === 'between'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-content-around', alignContent === 'around'), (0, _defineProperty3["default"])(_classNames, prefixCls + '-align-content-stretch', alignContent === 'stretch'), (0, _defineProperty3["default"])(_classNames, className, className), _classNames));
	        return React.createElement(
	            'div',
	            { className: wrapCls, style: style, onClick: onClick },
	            children
	        );
	    };

	    return Flex;
	}(React.Component);

	exports["default"] = Flex;

	Flex.propTypes = {
	    direction: _react.PropTypes.oneOf(['row', 'row-reverse', 'column', 'column-reverse']),
	    wrap: _react.PropTypes.oneOf(['nowrap', 'wrap', 'wrap-reverse']),
	    justify: _react.PropTypes.oneOf(['start', 'end', 'center', 'between', 'around']),
	    align: _react.PropTypes.oneOf(['start', 'end', 'center', 'top', 'middle', 'bottom', 'baseline', 'stretch']),
	    alignContent: _react.PropTypes.oneOf(['start', 'end', 'center', 'between', 'around', 'stretch'])
	};
	Flex.defaultProps = {
	    prefixCls: 'am-flexbox',
	    align: 'center',
	    onClick: function onClick() {}
	};
	module.exports = exports['default'];

/***/ },
/* 183 */
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

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	var FlexItem = function (_React$Component) {
	    (0, _inherits3["default"])(FlexItem, _React$Component);

	    function FlexItem() {
	        (0, _classCallCheck3["default"])(this, FlexItem);
	        return (0, _possibleConstructorReturn3["default"])(this, _React$Component.apply(this, arguments));
	    }

	    FlexItem.prototype.render = function render() {
	        var _classNames;

	        var _props = this.props;
	        var children = _props.children;
	        var className = _props.className;
	        var prefixCls = _props.prefixCls;
	        var style = _props.style;
	        var onClick = _props.onClick;

	        var wrapCls = (0, _classnames2["default"])((_classNames = {}, (0, _defineProperty3["default"])(_classNames, prefixCls + '-item', true), (0, _defineProperty3["default"])(_classNames, className, className), _classNames));
	        return React.createElement(
	            'div',
	            { className: wrapCls, style: style, onClick: onClick },
	            children
	        );
	    };

	    return FlexItem;
	}(React.Component);

	exports["default"] = FlexItem;

	FlexItem.defaultProps = {
	    prefixCls: 'am-flexbox'
	};
	module.exports = exports['default'];

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _react = __webpack_require__(1);

	var React = _interopRequireWildcard(_react);

	var _rcNotification = __webpack_require__(185);

	var _rcNotification2 = _interopRequireDefault(_rcNotification);

	var _icon = __webpack_require__(134);

	var _icon2 = _interopRequireDefault(_icon);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

	var messageInstance = void 0;
	var prefixCls = 'am-toast';
	function getMessageInstance() {
	    messageInstance = _rcNotification2["default"].newInstance({
	        prefixCls: prefixCls,
	        style: { top: 0 },
	        transitionName: 'am-fade'
	    });
	    return messageInstance;
	}
	function notice(content, type) {
	    var duration = arguments.length <= 2 || arguments[2] === undefined ? 3 : arguments[2];
	    var _onClose = arguments[3];

	    var iconType = {
	        info: '',
	        success: 'check-circle-o',
	        fail: 'cross-circle-o',
	        offline: 'frown',
	        loading: 'loading'
	    }[type];
	    if (typeof duration === 'function') {
	        _onClose = duration;
	        duration = 3;
	    }
	    var instance = getMessageInstance();
	    instance.notice({
	        duration: duration,
	        style: {},
	        content: !!iconType ? React.createElement(
	            'div',
	            { className: prefixCls + '-text ' + prefixCls + '-text-icon' },
	            React.createElement(_icon2["default"], { type: iconType }),
	            React.createElement(
	                'div',
	                null,
	                content
	            )
	        ) : React.createElement(
	            'div',
	            { className: prefixCls + '-text' },
	            React.createElement(
	                'div',
	                null,
	                content
	            )
	        ),
	        onClose: function onClose() {
	            if (_onClose) {
	                _onClose();
	            }
	            instance.destroy();
	            instance = null;
	            messageInstance = null;
	        }
	    });
	}
	exports["default"] = {
	    SHORT: 3,
	    LONG: 8,
	    show: function show(content, duration) {
	        return notice(content, 'info', duration, function () {});
	    },
	    info: function info(content, duration, onClose) {
	        return notice(content, 'info', duration, onClose);
	    },
	    success: function success(content, duration, onClose) {
	        return notice(content, 'success', duration, onClose);
	    },
	    fail: function fail(content, duration, onClose) {
	        return notice(content, 'fail', duration, onClose);
	    },
	    offline: function offline(content, duration, onClose) {
	        return notice(content, 'offline', duration, onClose);
	    },
	    loading: function loading(content, duration, onClose) {
	        return notice(content, 'loading', duration, onClose);
	    },
	    hide: function hide() {
	        if (messageInstance) {
	            messageInstance.destroy();
	            messageInstance = null;
	        }
	    }
	};
	module.exports = exports['default'];

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Notification = __webpack_require__(186);

	var _Notification2 = _interopRequireDefault(_Notification);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	exports["default"] = _Notification2["default"];
	module.exports = exports['default'];

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _rcAnimate = __webpack_require__(109);

	var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

	var _createChainedFunction = __webpack_require__(187);

	var _createChainedFunction2 = _interopRequireDefault(_createChainedFunction);

	var _classnames = __webpack_require__(88);

	var _classnames2 = _interopRequireDefault(_classnames);

	var _Notice = __webpack_require__(188);

	var _Notice2 = _interopRequireDefault(_Notice);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var seed = 0;
	var now = Date.now();

	function getUuid() {
	  return 'rcNotification_' + now + '_' + seed++;
	}

	var Notification = _react2["default"].createClass({
	  displayName: 'Notification',

	  propTypes: {
	    prefixCls: _react.PropTypes.string,
	    transitionName: _react.PropTypes.string,
	    animation: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]),
	    style: _react.PropTypes.object
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      prefixCls: 'rc-notification',
	      animation: 'fade',
	      style: {
	        top: 65,
	        left: '50%'
	      }
	    };
	  },
	  getInitialState: function getInitialState() {
	    return {
	      notices: []
	    };
	  },
	  getTransitionName: function getTransitionName() {
	    var props = this.props;
	    var transitionName = props.transitionName;
	    if (!transitionName && props.animation) {
	      transitionName = props.prefixCls + '-' + props.animation;
	    }
	    return transitionName;
	  },
	  add: function add(notice) {
	    var key = notice.key = notice.key || getUuid();
	    this.setState(function (previousState) {
	      var notices = previousState.notices;
	      if (!notices.filter(function (v) {
	        return v.key === key;
	      }).length) {
	        return {
	          notices: notices.concat(notice)
	        };
	      }
	    });
	  },
	  remove: function remove(key) {
	    this.setState(function (previousState) {
	      return {
	        notices: previousState.notices.filter(function (notice) {
	          return notice.key !== key;
	        })
	      };
	    });
	  },
	  render: function render() {
	    var _this = this,
	        _className;

	    var props = this.props;
	    var noticeNodes = this.state.notices.map(function (notice) {
	      var onClose = (0, _createChainedFunction2["default"])(_this.remove.bind(_this, notice.key), notice.onClose);
	      return _react2["default"].createElement(
	        _Notice2["default"],
	        _extends({
	          prefixCls: props.prefixCls
	        }, notice, {
	          onClose: onClose
	        }),
	        notice.content
	      );
	    });
	    var className = (_className = {}, _defineProperty(_className, props.prefixCls, 1), _defineProperty(_className, props.className, !!props.className), _className);
	    return _react2["default"].createElement(
	      'div',
	      { className: (0, _classnames2["default"])(className), style: props.style },
	      _react2["default"].createElement(
	        _rcAnimate2["default"],
	        { transitionName: this.getTransitionName() },
	        noticeNodes
	      )
	    );
	  }
	});

	Notification.newInstance = function newNotificationInstance(properties) {
	  var props = properties || {};
	  var div = document.createElement('div');
	  document.body.appendChild(div);
	  var notification = _reactDom2["default"].render(_react2["default"].createElement(Notification, props), div);
	  return {
	    notice: function notice(noticeProps) {
	      notification.add(noticeProps);
	    },
	    removeNotice: function removeNotice(key) {
	      notification.remove(key);
	    },

	    component: notification,
	    destroy: function destroy() {
	      _reactDom2["default"].unmountComponentAtNode(div);
	      document.body.removeChild(div);
	    }
	  };
	};

	exports["default"] = Notification;
	module.exports = exports['default'];

/***/ },
/* 187 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * Safe chained function
	 *
	 * Will only create a new function if needed,
	 * otherwise will pass back existing functions or null.
	 *
	 * @returns {function|null}
	 */
	function createChainedFunction() {
	  var args = arguments;
	  return function chainedFunction() {
	    for (var i = 0; i < args.length; i++) {
	      if (args[i] && args[i].apply) {
	        args[i].apply(this, arguments);
	      }
	    }
	  };
	}

	module.exports = createChainedFunction;

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _classnames = __webpack_require__(88);

	var _classnames2 = _interopRequireDefault(_classnames);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var Notice = _react2["default"].createClass({
	  displayName: 'Notice',

	  propTypes: {
	    duration: _react.PropTypes.number,
	    onClose: _react.PropTypes.func,
	    children: _react.PropTypes.any
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      onEnd: function onEnd() {},
	      onClose: function onClose() {},

	      duration: 1.5,
	      style: {
	        right: '50%'
	      }
	    };
	  },
	  componentDidMount: function componentDidMount() {
	    var _this = this;

	    if (this.props.duration) {
	      this.closeTimer = setTimeout(function () {
	        _this.close();
	      }, this.props.duration * 1000);
	    }
	  },
	  componentWillUnmount: function componentWillUnmount() {
	    this.clearCloseTimer();
	  },
	  clearCloseTimer: function clearCloseTimer() {
	    if (this.closeTimer) {
	      clearTimeout(this.closeTimer);
	      this.closeTimer = null;
	    }
	  },
	  close: function close() {
	    this.clearCloseTimer();
	    this.props.onClose();
	  },
	  render: function render() {
	    var _className;

	    var props = this.props;
	    var componentClass = props.prefixCls + '-notice';
	    var className = (_className = {}, _defineProperty(_className, '' + componentClass, 1), _defineProperty(_className, componentClass + '-closable', props.closable), _defineProperty(_className, props.className, !!props.className), _className);
	    return _react2["default"].createElement(
	      'div',
	      { className: (0, _classnames2["default"])(className), style: props.style },
	      _react2["default"].createElement(
	        'div',
	        { className: componentClass + '-content' },
	        props.children
	      ),
	      props.closable ? _react2["default"].createElement(
	        'a',
	        { tabIndex: '0', onClick: this.close, className: componentClass + '-close' },
	        _react2["default"].createElement('span', { className: componentClass + '-close-x' })
	      ) : null
	    );
	  }
	});

	exports["default"] = Notice;
	module.exports = exports['default'];

/***/ }
/******/ ]);