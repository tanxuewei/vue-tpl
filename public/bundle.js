/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	(function (self) {
	  'use strict';
	
	  if (self.fetch) {
	    return;
	  }
	
	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && function () {
	      try {
	        new Blob();
	        return true;
	      } catch (e) {
	        return false;
	      }
	    }(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  };
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name);
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name');
	    }
	    return name.toLowerCase();
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value);
	    }
	    return value;
	  }
	
	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function next() {
	        var value = items.shift();
	        return { done: value === undefined, value: value };
	      }
	    };
	
	    if (support.iterable) {
	      iterator[Symbol.iterator] = function () {
	        return iterator;
	      };
	    }
	
	    return iterator;
	  }
	
	  function Headers(headers) {
	    this.map = {};
	
	    if (headers instanceof Headers) {
	      headers.forEach(function (value, name) {
	        this.append(name, value);
	      }, this);
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function (name) {
	        this.append(name, headers[name]);
	      }, this);
	    }
	  }
	
	  Headers.prototype.append = function (name, value) {
	    name = normalizeName(name);
	    value = normalizeValue(value);
	    var list = this.map[name];
	    if (!list) {
	      list = [];
	      this.map[name] = list;
	    }
	    list.push(value);
	  };
	
	  Headers.prototype['delete'] = function (name) {
	    delete this.map[normalizeName(name)];
	  };
	
	  Headers.prototype.get = function (name) {
	    var values = this.map[normalizeName(name)];
	    return values ? values[0] : null;
	  };
	
	  Headers.prototype.getAll = function (name) {
	    return this.map[normalizeName(name)] || [];
	  };
	
	  Headers.prototype.has = function (name) {
	    return this.map.hasOwnProperty(normalizeName(name));
	  };
	
	  Headers.prototype.set = function (name, value) {
	    this.map[normalizeName(name)] = [normalizeValue(value)];
	  };
	
	  Headers.prototype.forEach = function (callback, thisArg) {
	    Object.getOwnPropertyNames(this.map).forEach(function (name) {
	      this.map[name].forEach(function (value) {
	        callback.call(thisArg, value, name, this);
	      }, this);
	    }, this);
	  };
	
	  Headers.prototype.keys = function () {
	    var items = [];
	    this.forEach(function (value, name) {
	      items.push(name);
	    });
	    return iteratorFor(items);
	  };
	
	  Headers.prototype.values = function () {
	    var items = [];
	    this.forEach(function (value) {
	      items.push(value);
	    });
	    return iteratorFor(items);
	  };
	
	  Headers.prototype.entries = function () {
	    var items = [];
	    this.forEach(function (value, name) {
	      items.push([name, value]);
	    });
	    return iteratorFor(items);
	  };
	
	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'));
	    }
	    body.bodyUsed = true;
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function (resolve, reject) {
	      reader.onload = function () {
	        resolve(reader.result);
	      };
	      reader.onerror = function () {
	        reject(reader.error);
	      };
	    });
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader();
	    reader.readAsArrayBuffer(blob);
	    return fileReaderReady(reader);
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader();
	    reader.readAsText(blob);
	    return fileReaderReady(reader);
	  }
	
	  function Body() {
	    this.bodyUsed = false;
	
	    this._initBody = function (body) {
	      this._bodyInit = body;
	      if (typeof body === 'string') {
	        this._bodyText = body;
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body;
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body;
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString();
	      } else if (!body) {
	        this._bodyText = '';
	      } else if (support.arrayBuffer && ArrayBuffer.prototype.isPrototypeOf(body)) {
	        // Only support ArrayBuffers for POST method.
	        // Receiving ArrayBuffers happens via Blobs, instead.
	      } else {
	        throw new Error('unsupported BodyInit type');
	      }
	
	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8');
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type);
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	        }
	      }
	    };
	
	    if (support.blob) {
	      this.blob = function () {
	        var rejected = consumed(this);
	        if (rejected) {
	          return rejected;
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob);
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob');
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]));
	        }
	      };
	
	      this.arrayBuffer = function () {
	        return this.blob().then(readBlobAsArrayBuffer);
	      };
	
	      this.text = function () {
	        var rejected = consumed(this);
	        if (rejected) {
	          return rejected;
	        }
	
	        if (this._bodyBlob) {
	          return readBlobAsText(this._bodyBlob);
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as text');
	        } else {
	          return Promise.resolve(this._bodyText);
	        }
	      };
	    } else {
	      this.text = function () {
	        var rejected = consumed(this);
	        return rejected ? rejected : Promise.resolve(this._bodyText);
	      };
	    }
	
	    if (support.formData) {
	      this.formData = function () {
	        return this.text().then(decode);
	      };
	    }
	
	    this.json = function () {
	      return this.text().then(JSON.parse);
	    };
	
	    return this;
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase();
	    return methods.indexOf(upcased) > -1 ? upcased : method;
	  }
	
	  function Request(input, options) {
	    options = options || {};
	    var body = options.body;
	    if (Request.prototype.isPrototypeOf(input)) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read');
	      }
	      this.url = input.url;
	      this.credentials = input.credentials;
	      if (!options.headers) {
	        this.headers = new Headers(input.headers);
	      }
	      this.method = input.method;
	      this.mode = input.mode;
	      if (!body) {
	        body = input._bodyInit;
	        input.bodyUsed = true;
	      }
	    } else {
	      this.url = input;
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit';
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers);
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET');
	    this.mode = options.mode || this.mode || null;
	    this.referrer = null;
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests');
	    }
	    this._initBody(body);
	  }
	
	  Request.prototype.clone = function () {
	    return new Request(this);
	  };
	
	  function decode(body) {
	    var form = new FormData();
	    body.trim().split('&').forEach(function (bytes) {
	      if (bytes) {
	        var split = bytes.split('=');
	        var name = split.shift().replace(/\+/g, ' ');
	        var value = split.join('=').replace(/\+/g, ' ');
	        form.append(decodeURIComponent(name), decodeURIComponent(value));
	      }
	    });
	    return form;
	  }
	
	  function headers(xhr) {
	    var head = new Headers();
	    var pairs = (xhr.getAllResponseHeaders() || '').trim().split('\n');
	    pairs.forEach(function (header) {
	      var split = header.trim().split(':');
	      var key = split.shift().trim();
	      var value = split.join(':').trim();
	      head.append(key, value);
	    });
	    return head;
	  }
	
	  Body.call(Request.prototype);
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {};
	    }
	
	    this.type = 'default';
	    this.status = options.status;
	    this.ok = this.status >= 200 && this.status < 300;
	    this.statusText = options.statusText;
	    this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
	    this.url = options.url || '';
	    this._initBody(bodyInit);
	  }
	
	  Body.call(Response.prototype);
	
	  Response.prototype.clone = function () {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    });
	  };
	
	  Response.error = function () {
	    var response = new Response(null, { status: 0, statusText: '' });
	    response.type = 'error';
	    return response;
	  };
	
	  var redirectStatuses = [301, 302, 303, 307, 308];
	
	  Response.redirect = function (url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code');
	    }
	
	    return new Response(null, { status: status, headers: { location: url } });
	  };
	
	  self.Headers = Headers;
	  self.Request = Request;
	  self.Response = Response;
	
	  self.fetch = function (input, init) {
	    return new Promise(function (resolve, reject) {
	      var request;
	      if (Request.prototype.isPrototypeOf(input) && !init) {
	        request = input;
	      } else {
	        request = new Request(input, init);
	      }
	
	      var xhr = new XMLHttpRequest();
	
	      function responseURL() {
	        if ('responseURL' in xhr) {
	          return xhr.responseURL;
	        }
	
	        // Avoid security warnings on getResponseHeader when not allowed by CORS
	        if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
	          return xhr.getResponseHeader('X-Request-URL');
	        }
	
	        return;
	      }
	
	      xhr.onload = function () {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: headers(xhr),
	          url: responseURL()
	        };
	        var body = 'response' in xhr ? xhr.response : xhr.responseText;
	        resolve(new Response(body, options));
	      };
	
	      xhr.onerror = function () {
	        reject(new TypeError('Network request failed'));
	      };
	
	      xhr.ontimeout = function () {
	        reject(new TypeError('Network request failed'));
	      };
	
	      xhr.open(request.method, request.url, true);
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true;
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob';
	      }
	
	      request.headers.forEach(function (value, name) {
	        xhr.setRequestHeader(name, value);
	      });
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	    });
	  };
	  self.fetch.polyfill = true;
	})(typeof self !== 'undefined' ? self : undefined);

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _vueRouter = __webpack_require__(4);
	
	var _vueRouter2 = _interopRequireDefault(_vueRouter);
	
	var _vueValidator = __webpack_require__(5);
	
	var _vueValidator2 = _interopRequireDefault(_vueValidator);
	
	var _filter = __webpack_require__(7);
	
	var _filter2 = _interopRequireDefault(_filter);
	
	var _directive = __webpack_require__(8);
	
	var _directive2 = _interopRequireDefault(_directive);
	
	var _App = __webpack_require__(9);
	
	var _App2 = _interopRequireDefault(_App);
	
	var _Index = __webpack_require__(26);
	
	var _Index2 = _interopRequireDefault(_Index);
	
	var _List = __webpack_require__(68);
	
	var _List2 = _interopRequireDefault(_List);
	
	var _Cluster = __webpack_require__(72);
	
	var _Cluster2 = _interopRequireDefault(_Cluster);
	
	var _Build = __webpack_require__(77);
	
	var _Build2 = _interopRequireDefault(_Build);
	
	var _Publish = __webpack_require__(82);
	
	var _Publish2 = _interopRequireDefault(_Publish);
	
	var _Auth = __webpack_require__(95);
	
	var _Auth2 = _interopRequireDefault(_Auth);
	
	var _Build3 = __webpack_require__(109);
	
	var _Build4 = _interopRequireDefault(_Build3);
	
	var _Deploy = __webpack_require__(135);
	
	var _Deploy2 = _interopRequireDefault(_Deploy);
	
	var _BuildAndDeploy = __webpack_require__(147);
	
	var _BuildAndDeploy2 = _interopRequireDefault(_BuildAndDeploy);
	
	var _RollBack = __webpack_require__(151);
	
	var _RollBack2 = _interopRequireDefault(_RollBack);
	
	var _Restart = __webpack_require__(155);
	
	var _Restart2 = _interopRequireDefault(_Restart);
	
	var _Stop = __webpack_require__(159);
	
	var _Stop2 = _interopRequireDefault(_Stop);
	
	var _Online = __webpack_require__(163);
	
	var _Online2 = _interopRequireDefault(_Online);
	
	var _Offline = __webpack_require__(167);
	
	var _Offline2 = _interopRequireDefault(_Offline);
	
	var _index = __webpack_require__(171);
	
	var _index2 = _interopRequireDefault(_index);
	
	var _buildServerManage = __webpack_require__(186);
	
	var _buildServerManage2 = _interopRequireDefault(_buildServerManage);
	
	var _nosStoreManage = __webpack_require__(236);
	
	var _nosStoreManage2 = _interopRequireDefault(_nosStoreManage);
	
	var _basicType = __webpack_require__(241);
	
	var _basicType2 = _interopRequireDefault(_basicType);
	
	var _basicPackage = __webpack_require__(246);
	
	var _basicPackage2 = _interopRequireDefault(_basicPackage);
	
	var _templateManage = __webpack_require__(258);
	
	var _templateManage2 = _interopRequireDefault(_templateManage);
	
	var _productSetting = __webpack_require__(267);
	
	var _productSetting2 = _interopRequireDefault(_productSetting);
	
	var _admin = __webpack_require__(272);
	
	var _admin2 = _interopRequireDefault(_admin);
	
	var _index3 = __webpack_require__(277);
	
	var _index4 = _interopRequireDefault(_index3);
	
	var _secretKey = __webpack_require__(281);
	
	var _secretKey2 = _interopRequireDefault(_secretKey);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// import VueResource from 'vue-resource'
	// import 'bootstrap/dist/css/bootstrap.css'
	
	//个人配置
	
	
	//系统配置
	
	
	//发布主页面
	
	
	//首页
	_vue2.default.config.devtools = true;
	// import VueDragableFor from 'vuedragablefor'
	
	_vue2.default.config.debug = true;
	
	// Vue.use(VueResource)
	_vue2.default.use(_vueRouter2.default);
	_vue2.default.filter(_filter2.default);
	_vue2.default.directive(_directive2.default);
	_vue2.default.use(_vueValidator2.default);
	_vue2.default.use(__webpack_require__(286));
	// Vue.use(VueDragableFor);
	
	var router = new _vueRouter2.default();
	
	router.map({
	  '/home': {
	    name: 'home/list',
	    component: _Index2.default,
	    subRoutes: {
	      '/list': {
	        name: 'home/list',
	        component: _List2.default
	      },
	      '/cluster': {
	        component: _Cluster2.default
	      },
	      '/build': {
	        component: _Build2.default
	      },
	      '/publish': {
	        component: _Publish2.default
	      },
	      '/auth': {
	        component: _Auth2.default
	      },
	      '/deploy': {
	        component: _Build4.default
	      },
	      '/deploy/do': {
	        component: _Deploy2.default
	      },
	      '/deploy/all': {
	        component: _BuildAndDeploy2.default
	      },
	      '/deploy/rollback': {
	        component: _RollBack2.default
	      },
	      '/deploy/restart': {
	        component: _Restart2.default
	      },
	      '/deploy/stop': {
	        component: _Stop2.default
	      },
	      '/deploy/online': {
	        component: _Online2.default
	      },
	      '/deploy/offline': {
	        component: _Offline2.default
	      }
	    }
	  },
	  '/follow': {
	    name: 'follow/list',
	    component: _Index2.default,
	    subRoutes: {
	      '/list': {
	        name: 'follow/list',
	        component: _List2.default
	      },
	      '/cluster': {
	        component: _Cluster2.default
	      },
	      '/build': {
	        component: _Build2.default
	      },
	      '/publish': {
	        component: _Publish2.default
	      },
	      '/auth': {
	        component: _Auth2.default
	      },
	      '/deploy': {
	        component: _Build4.default
	      },
	      '/deploy/do': {
	        component: _Deploy2.default
	      },
	      '/deploy/all': {
	        component: _BuildAndDeploy2.default
	      },
	      '/deploy/rollback': {
	        component: _RollBack2.default
	      },
	      '/deploy/restart': {
	        component: _Restart2.default
	      },
	      '/deploy/stop': {
	        component: _Stop2.default
	      },
	      '/deploy/online': {
	        component: _Online2.default
	      },
	      '/deploy/offline': {
	        component: _Offline2.default
	      }
	    }
	  },
	  '/sysConfig': {
	    component: _index2.default,
	    subRoutes: {
	      '/buildServer': {
	        component: _buildServerManage2.default
	      },
	      '/nosStore': {
	        component: _nosStoreManage2.default
	      },
	      '/basicType': {
	        component: _basicType2.default
	      },
	      '/basicPackage': {
	        component: _basicPackage2.default
	      },
	      '/template': {
	        component: _templateManage2.default
	      },
	      '/product': {
	        component: _productSetting2.default
	      },
	      '/admin': {
	        component: _admin2.default
	      }
	    }
	  },
	  '/userConfig': {
	    component: _index4.default,
	    subRoutes: {
	      '/secretKey': {
	        component: _secretKey2.default
	      }
	    }
	  }
	});
	
	router.locals = window.__locals__ || {};
	
	router.redirect({
	  '*': '/home'
	});
	
	router.start(_App2.default, '#app');

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = Vue;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = VueRouter;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/*!
	 * vue-validator v2.1.6
	 * (c) 2016 kazuya kawaguchi
	 * Released under the MIT License.
	 */
	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var babelHelpers = {};
	babelHelpers.typeof = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};
	
	babelHelpers.classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	babelHelpers.createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();
	
	babelHelpers.inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : _typeof(superClass)));
	  }
	
	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};
	
	babelHelpers.possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	};
	
	babelHelpers;
	/**
	 * Utilties
	 */
	
	// export default for holding the Vue reference
	var exports$1 = {};
	/**
	 * warn
	 *
	 * @param {String} msg
	 * @param {Error} [err]
	 *
	 */
	
	function warn(msg, err) {
	  if (window.console) {
	    console.warn('[vue-validator] ' + msg);
	    if (err) {
	      console.warn(err.stack);
	    }
	  }
	}
	
	/**
	 * empty
	 *
	 * @param {Array|Object} target
	 * @return {Boolean}
	 */
	
	function empty(target) {
	  if (target === null || target === undefined) {
	    return true;
	  }
	
	  if (Array.isArray(target)) {
	    if (target.length > 0) {
	      return false;
	    }
	    if (target.length === 0) {
	      return true;
	    }
	  } else if (exports$1.Vue.util.isPlainObject(target)) {
	    for (var key in target) {
	      if (exports$1.Vue.util.hasOwn(target, key)) {
	        return false;
	      }
	    }
	  }
	
	  return true;
	}
	
	/**
	 * each
	 *
	 * @param {Array|Object} target
	 * @param {Function} iterator
	 * @param {Object} [context]
	 */
	
	function each(target, iterator, context) {
	  if (Array.isArray(target)) {
	    for (var i = 0; i < target.length; i++) {
	      iterator.call(context || target[i], target[i], i);
	    }
	  } else if (exports$1.Vue.util.isPlainObject(target)) {
	    var hasOwn = exports$1.Vue.util.hasOwn;
	    for (var key in target) {
	      if (hasOwn(target, key)) {
	        iterator.call(context || target[key], target[key], key);
	      }
	    }
	  }
	}
	
	/**
	 * pull
	 *
	 * @param {Array} arr
	 * @param {Object} item
	 * @return {Object|null}
	 */
	
	function pull(arr, item) {
	  var index = exports$1.Vue.util.indexOf(arr, item);
	  return ~index ? arr.splice(index, 1) : null;
	}
	
	/**
	 * trigger
	 *
	 * @param {Element} el
	 * @param {String} event
	 * @param {Object} [args]
	 */
	
	function trigger(el, event, args) {
	  var e = document.createEvent('HTMLEvents');
	  e.initEvent(event, true, false);
	
	  if (args) {
	    for (var prop in args) {
	      e[prop] = args[prop];
	    }
	  }
	
	  // Due to Firefox bug, events fired on disabled
	  // non-attached form controls can throw errors
	  try {
	    el.dispatchEvent(e);
	  } catch (e) {}
	}
	
	/**
	 * Forgiving check for a promise
	 *
	 * @param {Object} p
	 * @return {Boolean}
	 */
	
	function isPromise(p) {
	  return p && typeof p.then === 'function';
	}
	
	/**
	 * Togging classes
	 *
	 * @param {Element} el
	 * @param {String} key
	 * @param {Function} fn
	 */
	
	function toggleClasses(el, key, fn) {
	  key = key.trim();
	  if (key.indexOf(' ') === -1) {
	    fn(el, key);
	    return;
	  }
	
	  var keys = key.split(/\s+/);
	  for (var i = 0, l = keys.length; i < l; i++) {
	    fn(el, keys[i]);
	  }
	}
	
	/**
	 * Fundamental validate functions
	 */
	
	/**
	 * required
	 *
	 * This function validate whether the value has been filled out.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 */
	
	function required(val) {
	  if (Array.isArray(val)) {
	    if (val.length !== 0) {
	      var valid = true;
	      for (var i = 0, l = val.length; i < l; i++) {
	        valid = required(val[i]);
	        if (!valid) {
	          break;
	        }
	      }
	      return valid;
	    } else {
	      return false;
	    }
	  } else if (typeof val === 'number' || typeof val === 'function') {
	    return true;
	  } else if (typeof val === 'boolean') {
	    return val;
	  } else if (typeof val === 'string') {
	    return val.length > 0;
	  } else if (val !== null && (typeof val === 'undefined' ? 'undefined' : babelHelpers.typeof(val)) === 'object') {
	    return Object.keys(val).length > 0;
	  } else if (val === null || val === undefined) {
	    return false;
	  }
	}
	
	/**
	 * pattern
	 *
	 * This function validate whether the value matches the regex pattern
	 *
	 * @param val
	 * @param {String} pat
	 * @return {Boolean}
	 */
	
	function pattern(val, pat) {
	  if (typeof pat !== 'string') {
	    return false;
	  }
	
	  var match = pat.match(new RegExp('^/(.*?)/([gimy]*)$'));
	  if (!match) {
	    return false;
	  }
	
	  return new RegExp(match[1], match[2]).test(val);
	}
	
	/**
	 * minlength
	 *
	 * This function validate whether the minimum length.
	 *
	 * @param {String|Array} val
	 * @param {String|Number} min
	 * @return {Boolean}
	 */
	
	function minlength(val, min) {
	  if (typeof val === 'string') {
	    return isInteger(min, 10) && val.length >= parseInt(min, 10);
	  } else if (Array.isArray(val)) {
	    return val.length >= parseInt(min, 10);
	  } else {
	    return false;
	  }
	}
	
	/**
	 * maxlength
	 *
	 * This function validate whether the maximum length.
	 *
	 * @param {String|Array} val
	 * @param {String|Number} max
	 * @return {Boolean}
	 */
	
	function maxlength(val, max) {
	  if (typeof val === 'string') {
	    return isInteger(max, 10) && val.length <= parseInt(max, 10);
	  } else if (Array.isArray(val)) {
	    return val.length <= parseInt(max, 10);
	  } else {
	    return false;
	  }
	}
	
	/**
	 * min
	 *
	 * This function validate whether the minimum value of the numberable value.
	 *
	 * @param {*} val
	 * @param {*} arg minimum
	 * @return {Boolean}
	 */
	
	function min(val, arg) {
	  return !isNaN(+val) && !isNaN(+arg) && +val >= +arg;
	}
	
	/**
	 * max
	 *
	 * This function validate whether the maximum value of the numberable value.
	 *
	 * @param {*} val
	 * @param {*} arg maximum
	 * @return {Boolean}
	 */
	
	function max(val, arg) {
	  return !isNaN(+val) && !isNaN(+arg) && +val <= +arg;
	}
	
	/**
	 * isInteger
	 *
	 * This function check whether the value of the string is integer.
	 *
	 * @param {String} val
	 * @return {Boolean}
	 * @private
	 */
	
	function isInteger(val) {
	  return (/^(-?[1-9]\d*|0)$/.test(val)
	  );
	}
	
	var validators = Object.freeze({
	  required: required,
	  pattern: pattern,
	  minlength: minlength,
	  maxlength: maxlength,
	  min: min,
	  max: max
	});
	
	function Asset(Vue) {
	  var extend = Vue.util.extend;
	
	  // set global validators asset
	  var assets = Object.create(null);
	  extend(assets, validators);
	  Vue.options.validators = assets;
	
	  // set option merge strategy
	  var strats = Vue.config.optionMergeStrategies;
	  if (strats) {
	    strats.validators = function (parent, child) {
	      if (!child) {
	        return parent;
	      }
	      if (!parent) {
	        return child;
	      }
	      var ret = Object.create(null);
	      extend(ret, parent);
	      for (var key in child) {
	        ret[key] = child[key];
	      }
	      return ret;
	    };
	  }
	
	  /**
	   * Register or retrieve a global validator definition.
	   *
	   * @param {String} id
	   * @param {Function} definition
	   */
	
	  Vue.validator = function (id, definition) {
	    if (!definition) {
	      return Vue.options['validators'][id];
	    } else {
	      Vue.options['validators'][id] = definition;
	    }
	  };
	}
	
	function Override(Vue) {
	  // override _init
	  var init = Vue.prototype._init;
	  Vue.prototype._init = function (options) {
	    if (!this._validatorMaps) {
	      this._validatorMaps = Object.create(null);
	    }
	    init.call(this, options);
	  };
	
	  // override _destroy
	  var destroy = Vue.prototype._destroy;
	  Vue.prototype._destroy = function () {
	    destroy.apply(this, arguments);
	    this._validatorMaps = null;
	  };
	}
	
	var VALIDATE_UPDATE = '__vue-validator-validate-update__';
	var PRIORITY_VALIDATE = 4096;
	var PRIORITY_VALIDATE_CLASS = 32;
	var REGEX_FILTER = /[^|]\|[^|]/;
	var REGEX_VALIDATE_DIRECTIVE = /^v-validate(?:$|:(.*)$)/;
	var REGEX_EVENT = /^v-on:|^@/;
	
	var classId = 0; // ID for validation class
	
	
	function ValidateClass(Vue) {
	  var vIf = Vue.directive('if');
	  var FragmentFactory = Vue.FragmentFactory;
	  var _Vue$util = Vue.util;
	  var toArray = _Vue$util.toArray;
	  var replace = _Vue$util.replace;
	  var createAnchor = _Vue$util.createAnchor;
	
	  /**
	   * `v-validate-class` directive
	   */
	
	  Vue.directive('validate-class', {
	    terminal: true,
	    priority: vIf.priority + PRIORITY_VALIDATE_CLASS,
	
	    bind: function bind() {
	      var _this = this;
	
	      var id = String(classId++);
	      this.setClassIds(this.el, id);
	
	      this.vm.$on(VALIDATE_UPDATE, this.cb = function (classIds, validation, results) {
	        if (classIds.indexOf(id) > -1) {
	          validation.updateClasses(results, _this.frag.node);
	        }
	      });
	
	      this.setupFragment();
	    },
	    unbind: function unbind() {
	      this.vm.$off(VALIDATE_UPDATE, this.cb);
	      this.teardownFragment();
	    },
	    setClassIds: function setClassIds(el, id) {
	      var childNodes = toArray(el.childNodes);
	      for (var i = 0, l = childNodes.length; i < l; i++) {
	        var element = childNodes[i];
	        if (element.nodeType === 1) {
	          var hasAttrs = element.hasAttributes();
	          var attrs = hasAttrs && toArray(element.attributes);
	          for (var k = 0, _l = attrs.length; k < _l; k++) {
	            var attr = attrs[k];
	            if (attr.name.match(REGEX_VALIDATE_DIRECTIVE)) {
	              var existingId = element.getAttribute(VALIDATE_UPDATE);
	              var value = existingId ? existingId + ',' + id : id;
	              element.setAttribute(VALIDATE_UPDATE, value);
	            }
	          }
	        }
	
	        if (element.hasChildNodes()) {
	          this.setClassIds(element, id);
	        }
	      }
	    },
	    setupFragment: function setupFragment() {
	      this.anchor = createAnchor('v-validate-class');
	      replace(this.el, this.anchor);
	
	      this.factory = new FragmentFactory(this.vm, this.el);
	      this.frag = this.factory.create(this._host, this._scope, this._frag);
	      this.frag.before(this.anchor);
	    },
	    teardownFragment: function teardownFragment() {
	      if (this.frag) {
	        this.frag.remove();
	        this.frag = null;
	        this.factory = null;
	      }
	
	      replace(this.anchor, this.el);
	      this.anchor = null;
	    }
	  });
	}
	
	function Validate(Vue) {
	  var FragmentFactory = Vue.FragmentFactory;
	  var parseDirective = Vue.parsers.directive.parseDirective;
	  var _Vue$util = Vue.util;
	  var inBrowser = _Vue$util.inBrowser;
	  var bind = _Vue$util.bind;
	  var on = _Vue$util.on;
	  var off = _Vue$util.off;
	  var createAnchor = _Vue$util.createAnchor;
	  var replace = _Vue$util.replace;
	  var camelize = _Vue$util.camelize;
	  var isPlainObject = _Vue$util.isPlainObject;
	
	  // Test for IE10/11 textarea placeholder clone bug
	
	  function checkTextareaCloneBug() {
	    if (inBrowser) {
	      var t = document.createElement('textarea');
	      t.placeholder = 't';
	      return t.cloneNode(true).value === 't';
	    } else {
	      return false;
	    }
	  }
	  var hasTextareaCloneBug = checkTextareaCloneBug();
	
	  /**
	   * `v-validate` directive
	   */
	
	  Vue.directive('validate', {
	    deep: true,
	    terminal: true,
	    priority: PRIORITY_VALIDATE,
	    params: ['group', 'field', 'detect-blur', 'detect-change', 'initial', 'classes'],
	
	    paramWatchers: {
	      detectBlur: function detectBlur(val, old) {
	        if (this._invalid) {
	          return;
	        }
	        this.validation.detectBlur = this.isDetectBlur(val);
	        this.validator.validate(this.field);
	      },
	      detectChange: function detectChange(val, old) {
	        if (this._invalid) {
	          return;
	        }
	        this.validation.detectChange = this.isDetectChange(val);
	        this.validator.validate(this.field);
	      }
	    },
	
	    bind: function bind() {
	      var el = this.el;
	
	      if (process.env.NODE_ENV !== 'production' && el.__vue__) {
	        warn('v-validate="' + this.expression + '" cannot be used on an instance root element.');
	        this._invalid = true;
	        return;
	      }
	
	      if (process.env.NODE_ENV !== 'production' && (el.hasAttribute('v-if') || el.hasAttribute('v-for'))) {
	        warn('v-validate cannot be used `v-if` or `v-for` build-in terminal directive ' + 'on an element. these is wrapped with `<template>` or other tags: ' + '(e.g. <validator name="validator">' + '<template v-if="hidden">' + '<input type="text" v-validate:field1="[\'required\']">' + '</template>' + '</validator>).');
	        this._invalid = true;
	        return;
	      }
	
	      if (process.env.NODE_ENV !== 'production' && !(this.arg || this.params.field)) {
	        warn('you need specify field name for v-validate directive.');
	        this._invalid = true;
	        return;
	      }
	
	      var validatorName = this.vm.$options._validator;
	      if (process.env.NODE_ENV !== 'production' && !validatorName) {
	        warn('you need to wrap the elements to be validated in a <validator> element: ' + '(e.g. <validator name="validator">' + '<input type="text" v-validate:field1="[\'required\']">' + '</validator>).');
	        this._invalid = true;
	        return;
	      }
	
	      var raw = el.getAttribute('v-model');
	
	      var _parseModelRaw = this.parseModelRaw(raw);
	
	      var model = _parseModelRaw.model;
	      var filters = _parseModelRaw.filters;
	
	      this.model = model;
	
	      this.setupFragment();
	      this.setupValidate(validatorName, model, filters);
	      this.listen();
	    },
	    update: function update(value, old) {
	      if (!value || this._invalid) {
	        return;
	      }
	
	      if (isPlainObject(value) || old && isPlainObject(old)) {
	        this.handleObject(value, old);
	      } else if (Array.isArray(value) || old && Array.isArray(old)) {
	        this.handleArray(value, old);
	      }
	
	      var options = { field: this.field, noopable: this._initialNoopValidation };
	      if (this.frag) {
	        options.el = this.frag.node;
	      }
	      this.validator.validate(options);
	
	      if (this._initialNoopValidation) {
	        this._initialNoopValidation = null;
	      }
	    },
	    unbind: function unbind() {
	      if (this._invalid) {
	        return;
	      }
	
	      this.unlisten();
	      this.teardownValidate();
	      this.teardownFragment();
	
	      this.model = null;
	    },
	    parseModelRaw: function parseModelRaw(raw) {
	      if (REGEX_FILTER.test(raw)) {
	        var parsed = parseDirective(raw);
	        return { model: parsed.expression, filters: parsed.filters };
	      } else {
	        return { model: raw };
	      }
	    },
	    setupValidate: function setupValidate(name, model, filters) {
	      var params = this.params;
	      var validator = this.validator = this.vm._validatorMaps[name];
	
	      this.field = camelize(this.arg ? this.arg : params.field);
	
	      this.validation = validator.manageValidation(this.field, model, this.vm, this.getElementFrom(this.frag), this._scope, filters, params.initial, this.isDetectBlur(params.detectBlur), this.isDetectChange(params.detectChange));
	
	      isPlainObject(params.classes) && this.validation.setValidationClasses(params.classes);
	
	      params.group && validator.addGroupValidation(params.group, this.field);
	
	      this._initialNoopValidation = this.isInitialNoopValidation(params.initial);
	    },
	    listen: function listen() {
	      var model = this.model;
	      var validation = this.validation;
	      var el = this.getElementFrom(this.frag);
	
	      this.onBlur = bind(validation.listener, validation);
	      on(el, 'blur', this.onBlur);
	      if ((el.type === 'radio' || el.tagName === 'SELECT') && !model) {
	        this.onChange = bind(validation.listener, validation);
	        on(el, 'change', this.onChange);
	      } else if (el.type === 'checkbox') {
	        if (!model) {
	          this.onChange = bind(validation.listener, validation);
	          on(el, 'change', this.onChange);
	        } else {
	          this.onClick = bind(validation.listener, validation);
	          on(el, 'click', this.onClick);
	        }
	      } else {
	        if (!model) {
	          this.onInput = bind(validation.listener, validation);
	          on(el, 'input', this.onInput);
	        }
	      }
	    },
	    unlisten: function unlisten() {
	      var el = this.getElementFrom(this.frag);
	
	      if (this.onInput) {
	        off(el, 'input', this.onInput);
	        this.onInput = null;
	      }
	
	      if (this.onClick) {
	        off(el, 'click', this.onClick);
	        this.onClick = null;
	      }
	
	      if (this.onChange) {
	        off(el, 'change', this.onChange);
	        this.onChange = null;
	      }
	
	      if (this.onBlur) {
	        off(el, 'blur', this.onBlur);
	        this.onBlur = null;
	      }
	    },
	    teardownValidate: function teardownValidate() {
	      if (this.validator && this.validation) {
	        var el = this.getElementFrom(this.frag);
	
	        this.params.group && this.validator.removeGroupValidation(this.params.group, this.field);
	
	        this.validator.unmanageValidation(this.field, el);
	
	        this.validator = null;
	        this.validation = null;
	        this.field = null;
	      }
	    },
	    setupFragment: function setupFragment() {
	      this.anchor = createAnchor('v-validate');
	      replace(this.el, this.anchor);
	
	      this.factory = new FragmentFactory(this.vm, this.shimNode(this.el));
	      this.frag = this.factory.create(this._host, this._scope, this._frag);
	      this.frag.before(this.anchor);
	    },
	    teardownFragment: function teardownFragment() {
	      if (this.frag) {
	        this.frag.remove();
	        this.frag = null;
	        this.factory = null;
	      }
	
	      replace(this.anchor, this.el);
	      this.anchor = null;
	    },
	    handleArray: function handleArray(value, old) {
	      var _this = this;
	
	      old && this.validation.resetValidation();
	
	      each(value, function (val) {
	        _this.validation.setValidation(val);
	      });
	    },
	    handleObject: function handleObject(value, old) {
	      var _this2 = this;
	
	      old && this.validation.resetValidation();
	
	      each(value, function (val, key) {
	        if (isPlainObject(val)) {
	          if ('rule' in val) {
	            var msg = 'message' in val ? val.message : null;
	            var initial = 'initial' in val ? val.initial : null;
	            _this2.validation.setValidation(key, val.rule, msg, initial);
	          }
	        } else {
	          _this2.validation.setValidation(key, val);
	        }
	      });
	    },
	    isDetectBlur: function isDetectBlur(detectBlur) {
	      return detectBlur === undefined || detectBlur === 'on' || detectBlur === true;
	    },
	    isDetectChange: function isDetectChange(detectChange) {
	      return detectChange === undefined || detectChange === 'on' || detectChange === true;
	    },
	    isInitialNoopValidation: function isInitialNoopValidation(initial) {
	      return initial === 'off' || initial === false;
	    },
	    shimNode: function shimNode(node) {
	      var ret = node;
	      if (hasTextareaCloneBug) {
	        if (node.tagName === 'TEXTAREA') {
	          ret = node.cloneNode(true);
	          ret.value = node.value;
	          var i = ret.childNodes.length;
	          while (i--) {
	            ret.removeChild(ret.childNodes[i]);
	          }
	        }
	      }
	      return ret;
	    },
	    getElementFrom: function getElementFrom(frag) {
	      return frag.single ? frag.node : frag.node.nextSibling;
	    }
	  });
	}
	
	/**
	 * BaseValidation class
	 */
	
	var BaseValidation = function () {
	  function BaseValidation(field, model, vm, el, scope, validator, filters, detectBlur, detectChange) {
	    babelHelpers.classCallCheck(this, BaseValidation);
	
	    this.field = field;
	    this.touched = false;
	    this.dirty = false;
	    this.modified = false;
	
	    this._modified = false;
	    this._model = model;
	    this._filters = filters;
	    this._validator = validator;
	    this._vm = vm;
	    this._el = el;
	    this._forScope = scope;
	    this._init = this._getValue(el);
	    this._validators = {};
	    this._detectBlur = detectBlur;
	    this._detectChange = detectChange;
	    this._classes = {};
	  }
	
	  BaseValidation.prototype.manageElement = function manageElement(el, initial) {
	    var _this = this;
	
	    var scope = this._getScope();
	    var model = this._model;
	
	    this._initial = initial;
	
	    var classIds = el.getAttribute(VALIDATE_UPDATE);
	    if (classIds) {
	      el.removeAttribute(VALIDATE_UPDATE);
	      this._classIds = classIds.split(',');
	    }
	
	    if (model) {
	      el.value = this._evalModel(model, this._filters);
	      this._unwatch = scope.$watch(model, function (val, old) {
	        if (val !== old) {
	          if (_this.guardValidate(el, 'input')) {
	            return;
	          }
	
	          _this.handleValidate(el, { noopable: _this._initial });
	          if (_this._initial) {
	            _this._initial = null;
	          }
	        }
	      }, { deep: true });
	    }
	  };
	
	  BaseValidation.prototype.unmanageElement = function unmanageElement(el) {
	    this._unwatch && this._unwatch();
	  };
	
	  BaseValidation.prototype.resetValidation = function resetValidation() {
	    var _this2 = this;
	
	    var keys = Object.keys(this._validators);
	    each(keys, function (key, index) {
	      _this2._validators[key] = null;
	      delete _this2._validators[key];
	    });
	  };
	
	  BaseValidation.prototype.setValidation = function setValidation(name, arg, msg, initial) {
	    var validator = this._validators[name];
	    if (!validator) {
	      validator = this._validators[name] = {};
	      validator.name = name;
	    }
	
	    validator.arg = arg;
	    if (msg) {
	      validator.msg = msg;
	    }
	
	    if (initial) {
	      validator.initial = initial;
	      validator._isNoopable = true;
	    }
	  };
	
	  BaseValidation.prototype.setValidationClasses = function setValidationClasses(classes) {
	    var _this3 = this;
	
	    each(classes, function (value, key) {
	      _this3._classes[key] = value;
	    });
	  };
	
	  BaseValidation.prototype.willUpdateFlags = function willUpdateFlags() {
	    var touched = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
	    touched && this.willUpdateTouched(this._el, 'blur');
	    this.willUpdateDirty(this._el);
	    this.willUpdateModified(this._el);
	  };
	
	  BaseValidation.prototype.willUpdateTouched = function willUpdateTouched(el, type) {
	    if (type && type === 'blur') {
	      this.touched = true;
	      this._fireEvent(el, 'touched');
	    }
	  };
	
	  BaseValidation.prototype.willUpdateDirty = function willUpdateDirty(el) {
	    if (!this.dirty && this._checkModified(el)) {
	      this.dirty = true;
	      this._fireEvent(el, 'dirty');
	    }
	  };
	
	  BaseValidation.prototype.willUpdateModified = function willUpdateModified(el) {
	    this.modified = this._checkModified(el);
	    if (this._modified !== this.modified) {
	      this._fireEvent(el, 'modified', { modified: this.modified });
	      this._modified = this.modified;
	    }
	  };
	
	  BaseValidation.prototype.listener = function listener(e) {
	    if (this.guardValidate(e.target, e.type)) {
	      return;
	    }
	
	    this.handleValidate(e.target, { type: e.type });
	  };
	
	  BaseValidation.prototype.handleValidate = function handleValidate(el) {
	    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    var _ref$type = _ref.type;
	    var type = _ref$type === undefined ? null : _ref$type;
	    var _ref$noopable = _ref.noopable;
	    var noopable = _ref$noopable === undefined ? false : _ref$noopable;
	
	    this.willUpdateTouched(el, type);
	    this.willUpdateDirty(el);
	    this.willUpdateModified(el);
	
	    this._validator.validate({ field: this.field, el: el, noopable: noopable });
	  };
	
	  BaseValidation.prototype.validate = function validate(cb) {
	    var _this4 = this;
	
	    var noopable = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	    var el = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
	
	    var _ = exports$1.Vue.util;
	
	    var results = {};
	    var errors = [];
	    var valid = true;
	
	    this._runValidators(function (descriptor, name, done) {
	      var asset = _this4._resolveValidator(name);
	      var validator = null;
	      var msg = null;
	
	      if (_.isPlainObject(asset)) {
	        if (asset.check && typeof asset.check === 'function') {
	          validator = asset.check;
	        }
	        if (asset.message) {
	          msg = asset.message;
	        }
	      } else if (typeof asset === 'function') {
	        validator = asset;
	      }
	
	      if (descriptor.msg) {
	        msg = descriptor.msg;
	      }
	
	      if (noopable) {
	        results[name] = false;
	        return done();
	      }
	
	      if (descriptor._isNoopable) {
	        results[name] = false;
	        descriptor._isNoopable = null;
	        return done();
	      }
	
	      if (validator) {
	        var value = _this4._getValue(_this4._el);
	        _this4._invokeValidator(_this4._vm, validator, value, descriptor.arg, function (ret, err) {
	          if (!ret) {
	            valid = false;
	            if (err) {
	              // async error message
	              errors.push({ validator: name, message: err });
	              results[name] = err;
	            } else if (msg) {
	              var error = { validator: name };
	              error.message = typeof msg === 'function' ? msg.call(_this4._vm, _this4.field, descriptor.arg) : msg;
	              errors.push(error);
	              results[name] = error.message;
	            } else {
	              results[name] = !ret;
	            }
	          } else {
	            results[name] = !ret;
	          }
	
	          done();
	        });
	      } else {
	        done();
	      }
	    }, function () {
	      // finished
	      _this4._fireEvent(_this4._el, valid ? 'valid' : 'invalid');
	
	      var props = {
	        valid: valid,
	        invalid: !valid,
	        touched: _this4.touched,
	        untouched: !_this4.touched,
	        dirty: _this4.dirty,
	        pristine: !_this4.dirty,
	        modified: _this4.modified
	      };
	      if (!empty(errors)) {
	        props.errors = errors;
	      }
	      _.extend(results, props);
	
	      _this4.willUpdateClasses(results, el);
	
	      cb(results);
	    });
	  };
	
	  BaseValidation.prototype.resetFlags = function resetFlags() {
	    this.touched = false;
	    this.dirty = false;
	    this.modified = false;
	    this._modified = false;
	  };
	
	  BaseValidation.prototype.reset = function reset() {
	    each(this._validators, function (descriptor, key) {
	      if (descriptor.initial && !descriptor._isNoopable) {
	        descriptor._isNoopable = true;
	      }
	    });
	    this.resetFlags();
	    this._init = this._getValue(this._el);
	  };
	
	  BaseValidation.prototype.willUpdateClasses = function willUpdateClasses(results) {
	    var _this5 = this;
	
	    var el = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	
	    if (this._checkClassIds(el)) {
	      (function () {
	        var classIds = _this5._getClassIds(el);
	        _this5.vm.$nextTick(function () {
	          _this5.vm.$emit(VALIDATE_UPDATE, classIds, _this5, results);
	        });
	      })();
	    } else {
	      this.updateClasses(results);
	    }
	  };
	
	  BaseValidation.prototype.updateClasses = function updateClasses(results) {
	    var el = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	
	    this._updateClasses(el || this._el, results);
	  };
	
	  BaseValidation.prototype.guardValidate = function guardValidate(el, type) {
	    if (type && type === 'blur' && !this.detectBlur) {
	      return true;
	    }
	
	    if (type && type === 'input' && !this.detectChange) {
	      return true;
	    }
	
	    if (type && type === 'change' && !this.detectChange) {
	      return true;
	    }
	
	    if (type && type === 'click' && !this.detectChange) {
	      return true;
	    }
	
	    return false;
	  };
	
	  BaseValidation.prototype._getValue = function _getValue(el) {
	    return el.value;
	  };
	
	  BaseValidation.prototype._getScope = function _getScope() {
	    return this._forScope || this._vm;
	  };
	
	  BaseValidation.prototype._getClassIds = function _getClassIds(el) {
	    return this._classIds;
	  };
	
	  BaseValidation.prototype._checkModified = function _checkModified(target) {
	    return this._init !== this._getValue(target);
	  };
	
	  BaseValidation.prototype._checkClassIds = function _checkClassIds(el) {
	    return this._getClassIds(el);
	  };
	
	  BaseValidation.prototype._fireEvent = function _fireEvent(el, type, args) {
	    trigger(el, type, args);
	  };
	
	  BaseValidation.prototype._evalModel = function _evalModel(model, filters) {
	    var scope = this._getScope();
	
	    var val = null;
	    if (filters) {
	      val = scope.$get(model);
	      return filters ? this._applyFilters(val, null, filters) : val;
	    } else {
	      val = scope.$get(model);
	      return val === undefined || val === null ? '' : val;
	    }
	  };
	
	  BaseValidation.prototype._updateClasses = function _updateClasses(el, results) {
	    this._toggleValid(el, results.valid);
	    this._toggleTouched(el, results.touched);
	    this._togglePristine(el, results.pristine);
	    this._toggleModfied(el, results.modified);
	  };
	
	  BaseValidation.prototype._toggleValid = function _toggleValid(el, valid) {
	    var _util$Vue$util = exports$1.Vue.util;
	    var addClass = _util$Vue$util.addClass;
	    var removeClass = _util$Vue$util.removeClass;
	
	    var validClass = this._classes.valid || 'valid';
	    var invalidClass = this._classes.invalid || 'invalid';
	
	    if (valid) {
	      toggleClasses(el, validClass, addClass);
	      toggleClasses(el, invalidClass, removeClass);
	    } else {
	      toggleClasses(el, validClass, removeClass);
	      toggleClasses(el, invalidClass, addClass);
	    }
	  };
	
	  BaseValidation.prototype._toggleTouched = function _toggleTouched(el, touched) {
	    var _util$Vue$util2 = exports$1.Vue.util;
	    var addClass = _util$Vue$util2.addClass;
	    var removeClass = _util$Vue$util2.removeClass;
	
	    var touchedClass = this._classes.touched || 'touched';
	    var untouchedClass = this._classes.untouched || 'untouched';
	
	    if (touched) {
	      toggleClasses(el, touchedClass, addClass);
	      toggleClasses(el, untouchedClass, removeClass);
	    } else {
	      toggleClasses(el, touchedClass, removeClass);
	      toggleClasses(el, untouchedClass, addClass);
	    }
	  };
	
	  BaseValidation.prototype._togglePristine = function _togglePristine(el, pristine) {
	    var _util$Vue$util3 = exports$1.Vue.util;
	    var addClass = _util$Vue$util3.addClass;
	    var removeClass = _util$Vue$util3.removeClass;
	
	    var pristineClass = this._classes.pristine || 'pristine';
	    var dirtyClass = this._classes.dirty || 'dirty';
	
	    if (pristine) {
	      toggleClasses(el, pristineClass, addClass);
	      toggleClasses(el, dirtyClass, removeClass);
	    } else {
	      toggleClasses(el, pristineClass, removeClass);
	      toggleClasses(el, dirtyClass, addClass);
	    }
	  };
	
	  BaseValidation.prototype._toggleModfied = function _toggleModfied(el, modified) {
	    var _util$Vue$util4 = exports$1.Vue.util;
	    var addClass = _util$Vue$util4.addClass;
	    var removeClass = _util$Vue$util4.removeClass;
	
	    var modifiedClass = this._classes.modified || 'modified';
	
	    if (modified) {
	      toggleClasses(el, modifiedClass, addClass);
	    } else {
	      toggleClasses(el, modifiedClass, removeClass);
	    }
	  };
	
	  BaseValidation.prototype._applyFilters = function _applyFilters(value, oldValue, filters, write) {
	    var resolveAsset = exports$1.Vue.util.resolveAsset;
	    var scope = this._getScope();
	
	    var filter = void 0,
	        fn = void 0,
	        args = void 0,
	        arg = void 0,
	        offset = void 0,
	        i = void 0,
	        l = void 0,
	        j = void 0,
	        k = void 0;
	    for (i = 0, l = filters.length; i < l; i++) {
	      filter = filters[i];
	      fn = resolveAsset(this._vm.$options, 'filters', filter.name);
	      if (!fn) {
	        continue;
	      }
	
	      fn = write ? fn.write : fn.read || fn;
	      if (typeof fn !== 'function') {
	        continue;
	      }
	
	      args = write ? [value, oldValue] : [value];
	      offset = write ? 2 : 1;
	      if (filter.args) {
	        for (j = 0, k = filter.args.length; j < k; j++) {
	          arg = filter.args[j];
	          args[j + offset] = arg.dynamic ? scope.$get(arg.value) : arg.value;
	        }
	      }
	
	      value = fn.apply(this._vm, args);
	    }
	
	    return value;
	  };
	
	  BaseValidation.prototype._runValidators = function _runValidators(fn, cb) {
	    var validators = this._validators;
	    var length = Object.keys(validators).length;
	
	    var count = 0;
	    each(validators, function (descriptor, name) {
	      fn(descriptor, name, function () {
	        ++count;
	        count >= length && cb();
	      });
	    });
	  };
	
	  BaseValidation.prototype._invokeValidator = function _invokeValidator(vm, validator, val, arg, cb) {
	    var future = validator.call(this, val, arg);
	    if (typeof future === 'function') {
	      // function 
	      future(function () {
	        // resolve
	        cb(true);
	      }, function (msg) {
	        // reject
	        cb(false, msg);
	      });
	    } else if (isPromise(future)) {
	      // promise
	      future.then(function () {
	        // resolve
	        cb(true);
	      }, function (msg) {
	        // reject
	        cb(false, msg);
	      }).catch(function (err) {
	        cb(false, err.message);
	      });
	    } else {
	      // sync
	      cb(future);
	    }
	  };
	
	  BaseValidation.prototype._resolveValidator = function _resolveValidator(name) {
	    var resolveAsset = exports$1.Vue.util.resolveAsset;
	    return resolveAsset(this._vm.$options, 'validators', name);
	  };
	
	  babelHelpers.createClass(BaseValidation, [{
	    key: 'vm',
	    get: function get() {
	      return this._vm;
	    }
	  }, {
	    key: 'el',
	    get: function get() {
	      return this._el;
	    }
	  }, {
	    key: 'detectChange',
	    get: function get() {
	      return this._detectChange;
	    },
	    set: function set(val) {
	      this._detectChange = val;
	    }
	  }, {
	    key: 'detectBlur',
	    get: function get() {
	      return this._detectBlur;
	    },
	    set: function set(val) {
	      this._detectBlur = val;
	    }
	  }]);
	  return BaseValidation;
	}();
	
	/**
	 * CheckboxValidation class
	 */
	
	var CheckboxValidation = function (_BaseValidation) {
	  babelHelpers.inherits(CheckboxValidation, _BaseValidation);
	
	  function CheckboxValidation(field, model, vm, el, scope, validator, filters, detectBlur, detectChange) {
	    babelHelpers.classCallCheck(this, CheckboxValidation);
	
	    var _this = babelHelpers.possibleConstructorReturn(this, _BaseValidation.call(this, field, model, vm, el, scope, validator, filters, detectBlur, detectChange));
	
	    _this._inits = [];
	    return _this;
	  }
	
	  CheckboxValidation.prototype.manageElement = function manageElement(el, initial) {
	    var _this2 = this;
	
	    var scope = this._getScope();
	    var item = this._addItem(el, initial);
	
	    var model = item.model = this._model;
	    if (model) {
	      var value = this._evalModel(model, this._filters);
	      if (Array.isArray(value)) {
	        this._setChecked(value, item.el);
	        item.unwatch = scope.$watch(model, function (val, old) {
	          if (val !== old) {
	            if (_this2.guardValidate(item.el, 'change')) {
	              return;
	            }
	
	            _this2.handleValidate(item.el, { noopable: item.initial });
	            if (item.initial) {
	              item.initial = null;
	            }
	          }
	        });
	      } else {
	        el.checked = value || false;
	        this._init = el.checked;
	        item.init = el.checked;
	        item.value = el.value;
	        item.unwatch = scope.$watch(model, function (val, old) {
	          if (val !== old) {
	            if (_this2.guardValidate(el, 'change')) {
	              return;
	            }
	
	            _this2.handleValidate(el, { noopable: item.initial });
	            if (item.initial) {
	              item.initial = null;
	            }
	          }
	        });
	      }
	    } else {
	      var options = { field: this.field, noopable: initial };
	      if (this._checkClassIds(el)) {
	        options.el = el;
	      }
	      this._validator.validate(options);
	    }
	  };
	
	  CheckboxValidation.prototype.unmanageElement = function unmanageElement(el) {
	    var found = -1;
	    each(this._inits, function (item, index) {
	      if (item.el === el) {
	        found = index;
	        if (item.unwatch && item.model) {
	          item.unwatch();
	          item.unwatch = null;
	          item.model = null;
	        }
	      }
	    });
	    if (found === -1) {
	      return;
	    }
	
	    this._inits.splice(found, 1);
	    this._validator.validate({ field: this.field });
	  };
	
	  CheckboxValidation.prototype.willUpdateFlags = function willUpdateFlags() {
	    var _this3 = this;
	
	    var touched = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
	    each(this._inits, function (item, index) {
	      touched && _this3.willUpdateTouched(item.el, 'blur');
	      _this3.willUpdateDirty(item.el);
	      _this3.willUpdateModified(item.el);
	    });
	  };
	
	  CheckboxValidation.prototype.reset = function reset() {
	    this.resetFlags();
	    each(this._inits, function (item, index) {
	      item.init = item.el.checked;
	      item.value = item.el.value;
	    });
	  };
	
	  CheckboxValidation.prototype.updateClasses = function updateClasses(results) {
	    var _this4 = this;
	
	    var el = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	
	    if (el) {
	      // for another element
	      this._updateClasses(el, results);
	    } else {
	      each(this._inits, function (item, index) {
	        _this4._updateClasses(item.el, results);
	      });
	    }
	  };
	
	  CheckboxValidation.prototype._addItem = function _addItem(el, initial) {
	    var item = {
	      el: el,
	      init: el.checked,
	      value: el.value,
	      initial: initial
	    };
	
	    var classIds = el.getAttribute(VALIDATE_UPDATE);
	    if (classIds) {
	      el.removeAttribute(VALIDATE_UPDATE);
	      item.classIds = classIds.split(',');
	    }
	
	    this._inits.push(item);
	    return item;
	  };
	
	  CheckboxValidation.prototype._setChecked = function _setChecked(values, el) {
	    for (var i = 0, l = values.length; i < l; i++) {
	      var value = values[i];
	      if (!el.disabled && el.value === value && !el.checked) {
	        el.checked = true;
	      }
	    }
	  };
	
	  CheckboxValidation.prototype._getValue = function _getValue(el) {
	    var _this5 = this;
	
	    if (!this._inits || this._inits.length === 0) {
	      return el.checked;
	    } else {
	      var _ret = function () {
	        var vals = [];
	        each(_this5._inits, function (item, index) {
	          item.el.checked && vals.push(item.el.value);
	        });
	        return {
	          v: vals
	        };
	      }();
	
	      if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret)) === "object") return _ret.v;
	    }
	  };
	
	  CheckboxValidation.prototype._getClassIds = function _getClassIds(el) {
	    var classIds = void 0;
	    each(this._inits, function (item, index) {
	      if (item.el === el) {
	        classIds = item.classIds;
	      }
	    });
	    return classIds;
	  };
	
	  CheckboxValidation.prototype._checkModified = function _checkModified(target) {
	    var _this6 = this;
	
	    if (this._inits.length === 0) {
	      return this._init !== target.checked;
	    } else {
	      var _ret2 = function () {
	        var modified = false;
	        each(_this6._inits, function (item, index) {
	          if (!modified) {
	            modified = item.init !== item.el.checked;
	          }
	        });
	        return {
	          v: modified
	        };
	      }();
	
	      if ((typeof _ret2 === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret2)) === "object") return _ret2.v;
	    }
	  };
	
	  return CheckboxValidation;
	}(BaseValidation);
	
	/**
	 * RadioValidation class
	 */
	
	var RadioValidation = function (_BaseValidation) {
	  babelHelpers.inherits(RadioValidation, _BaseValidation);
	
	  function RadioValidation(field, model, vm, el, scope, validator, filters, detectBlur, detectChange) {
	    babelHelpers.classCallCheck(this, RadioValidation);
	
	    var _this = babelHelpers.possibleConstructorReturn(this, _BaseValidation.call(this, field, model, vm, el, scope, validator, filters, detectBlur, detectChange));
	
	    _this._inits = [];
	    return _this;
	  }
	
	  RadioValidation.prototype.manageElement = function manageElement(el, initial) {
	    var _this2 = this;
	
	    var scope = this._getScope();
	    var item = this._addItem(el, initial);
	
	    var model = item.model = this._model;
	    if (model) {
	      var value = this._evalModel(model, this._filters);
	      this._setChecked(value, el, item);
	      item.unwatch = scope.$watch(model, function (val, old) {
	        if (val !== old) {
	          if (_this2.guardValidate(item.el, 'change')) {
	            return;
	          }
	
	          _this2.handleValidate(el, { noopable: item.initial });
	          if (item.initial) {
	            item.initial = null;
	          }
	        }
	      });
	    } else {
	      var options = { field: this.field, noopable: initial };
	      if (this._checkClassIds(el)) {
	        options.el = el;
	      }
	      this._validator.validate(options);
	    }
	  };
	
	  RadioValidation.prototype.unmanageElement = function unmanageElement(el) {
	    var found = -1;
	    each(this._inits, function (item, index) {
	      if (item.el === el) {
	        found = index;
	      }
	    });
	    if (found === -1) {
	      return;
	    }
	
	    this._inits.splice(found, 1);
	    this._validator.validate({ field: this.field });
	  };
	
	  RadioValidation.prototype.willUpdateFlags = function willUpdateFlags() {
	    var _this3 = this;
	
	    var touched = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];
	
	    each(this._inits, function (item, index) {
	      touched && _this3.willUpdateTouched(item.el, 'blur');
	      _this3.willUpdateDirty(item.el);
	      _this3.willUpdateModified(item.el);
	    });
	  };
	
	  RadioValidation.prototype.reset = function reset() {
	    this.resetFlags();
	    each(this._inits, function (item, index) {
	      item.init = item.el.checked;
	      item.value = item.el.value;
	    });
	  };
	
	  RadioValidation.prototype.updateClasses = function updateClasses(results) {
	    var _this4 = this;
	
	    var el = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	
	    if (el) {
	      // for another element
	      this._updateClasses(el, results);
	    } else {
	      each(this._inits, function (item, index) {
	        _this4._updateClasses(item.el, results);
	      });
	    }
	  };
	
	  RadioValidation.prototype._addItem = function _addItem(el, initial) {
	    var item = {
	      el: el,
	      init: el.checked,
	      value: el.value,
	      initial: initial
	    };
	
	    var classIds = el.getAttribute(VALIDATE_UPDATE);
	    if (classIds) {
	      el.removeAttribute(VALIDATE_UPDATE);
	      item.classIds = classIds.split(',');
	    }
	
	    this._inits.push(item);
	    return item;
	  };
	
	  RadioValidation.prototype._setChecked = function _setChecked(value, el, item) {
	    if (el.value === value) {
	      el.checked = true;
	      this._init = el.checked;
	      item.init = el.checked;
	      item.value = value;
	    }
	  };
	
	  RadioValidation.prototype._getValue = function _getValue(el) {
	    var _this5 = this;
	
	    if (!this._inits || this._inits.length === 0) {
	      return el.checked;
	    } else {
	      var _ret = function () {
	        var vals = [];
	        each(_this5._inits, function (item, index) {
	          item.el.checked && vals.push(item.el.value);
	        });
	        return {
	          v: vals
	        };
	      }();
	
	      if ((typeof _ret === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret)) === "object") return _ret.v;
	    }
	  };
	
	  RadioValidation.prototype._getClassIds = function _getClassIds(el) {
	    var classIds = void 0;
	    each(this._inits, function (item, index) {
	      if (item.el === el) {
	        classIds = item.classIds;
	      }
	    });
	    return classIds;
	  };
	
	  RadioValidation.prototype._checkModified = function _checkModified(target) {
	    var _this6 = this;
	
	    if (this._inits.length === 0) {
	      return this._init !== target.checked;
	    } else {
	      var _ret2 = function () {
	        var modified = false;
	        each(_this6._inits, function (item, index) {
	          if (!modified) {
	            modified = item.init !== item.el.checked;
	          }
	        });
	        return {
	          v: modified
	        };
	      }();
	
	      if ((typeof _ret2 === 'undefined' ? 'undefined' : babelHelpers.typeof(_ret2)) === "object") return _ret2.v;
	    }
	  };
	
	  return RadioValidation;
	}(BaseValidation);
	
	/**
	 * SelectValidation class
	 */
	
	var SelectValidation = function (_BaseValidation) {
	  babelHelpers.inherits(SelectValidation, _BaseValidation);
	
	  function SelectValidation(field, model, vm, el, scope, validator, filters, detectBlur, detectChange) {
	    babelHelpers.classCallCheck(this, SelectValidation);
	
	    var _this = babelHelpers.possibleConstructorReturn(this, _BaseValidation.call(this, field, model, vm, el, scope, validator, filters, detectBlur, detectChange));
	
	    _this._multiple = _this._el.hasAttribute('multiple');
	    return _this;
	  }
	
	  SelectValidation.prototype.manageElement = function manageElement(el, initial) {
	    var _this2 = this;
	
	    var scope = this._getScope();
	    var model = this._model;
	
	    this._initial = initial;
	
	    var classIds = el.getAttribute(VALIDATE_UPDATE);
	    if (classIds) {
	      el.removeAttribute(VALIDATE_UPDATE);
	      this._classIds = classIds.split(',');
	    }
	
	    if (model) {
	      var value = this._evalModel(model, this._filters);
	      var values = !Array.isArray(value) ? [value] : value;
	      this._setOption(values, el);
	      this._unwatch = scope.$watch(model, function (val, old) {
	        var values1 = !Array.isArray(val) ? [val] : val;
	        var values2 = !Array.isArray(old) ? [old] : old;
	        if (values1.slice().sort().toString() !== values2.slice().sort().toString()) {
	          if (_this2.guardValidate(el, 'change')) {
	            return;
	          }
	
	          _this2.handleValidate(el, { noopable: _this2._initial });
	          if (_this2._initial) {
	            _this2._initial = null;
	          }
	        }
	      });
	    }
	  };
	
	  SelectValidation.prototype.unmanageElement = function unmanageElement(el) {
	    this._unwatch && this._unwatch();
	  };
	
	  SelectValidation.prototype.reset = function reset() {
	    this.resetFlags();
	  };
	
	  SelectValidation.prototype._getValue = function _getValue(el) {
	    var ret = [];
	
	    for (var i = 0, l = el.options.length; i < l; i++) {
	      var option = el.options[i];
	      if (!option.disabled && option.selected) {
	        ret.push(option.value);
	      }
	    }
	
	    return ret;
	  };
	
	  SelectValidation.prototype._setOption = function _setOption(values, el) {
	    for (var i = 0, l = values.length; i < l; i++) {
	      var value = values[i];
	      for (var j = 0, m = el.options.length; j < m; j++) {
	        var option = el.options[j];
	        if (!option.disabled && option.value === value && (!option.hasAttribute('selected') || !option.selected)) {
	          option.selected = true;
	        }
	      }
	    }
	  };
	
	  SelectValidation.prototype._checkModified = function _checkModified(target) {
	    var values = this._getValue(target).slice().sort();
	    if (this._init.length !== values.length) {
	      return true;
	    } else {
	      var inits = this._init.slice().sort();
	      return inits.toString() !== values.toString();
	    }
	  };
	
	  return SelectValidation;
	}(BaseValidation);
	
	/**
	 * Validator class
	 */
	
	var Validator$1 = function () {
	  function Validator(name, dir, groups, classes) {
	    var _this = this;
	
	    babelHelpers.classCallCheck(this, Validator);
	
	    this.name = name;
	
	    this._scope = {};
	    this._dir = dir;
	    this._validations = {};
	    this._checkboxValidations = {};
	    this._radioValidations = {};
	    this._groups = groups;
	    this._groupValidations = {};
	    this._events = {};
	    this._modified = false;
	    this._classes = classes;
	
	    each(groups, function (group) {
	      _this._groupValidations[group] = [];
	    });
	  }
	
	  Validator.prototype.enableReactive = function enableReactive() {
	    var vm = this._dir.vm;
	
	    // define the validation scope
	    exports$1.Vue.util.defineReactive(vm, this.name, this._scope);
	    vm._validatorMaps[this.name] = this;
	
	    // define the validation resetting meta method to vue instance
	    this._defineResetValidation();
	
	    // define the validate manually meta method to vue instance
	    this._defineValidate();
	
	    // define manually the validation errors
	    this._defineSetValidationErrors();
	  };
	
	  Validator.prototype.disableReactive = function disableReactive() {
	    var vm = this._dir.vm;
	    vm.$setValidationErrors = null;
	    delete vm['$setValidationErrors'];
	    vm.$validate = null;
	    delete vm['$validate'];
	    vm.$validatorReset = null;
	    delete vm['$validatorReset'];
	    vm._validatorMaps[this.name] = null;
	    delete vm._validatorMaps[this.name];
	    vm[this.name] = null;
	    delete vm[this.name];
	  };
	
	  Validator.prototype.registerEvents = function registerEvents() {
	    var isSimplePath = exports$1.Vue.parsers.expression.isSimplePath;
	
	    var attrs = this._dir.el.attributes;
	    for (var i = 0, l = attrs.length; i < l; i++) {
	      var event = attrs[i].name;
	      if (REGEX_EVENT.test(event)) {
	        var value = attrs[i].value;
	        if (isSimplePath(value)) {
	          value += '.apply(this, $arguments)';
	        }
	        event = event.replace(REGEX_EVENT, '');
	        this._events[this._getEventName(event)] = this._dir.vm.$eval(value, true);
	      }
	    }
	  };
	
	  Validator.prototype.unregisterEvents = function unregisterEvents() {
	    var _this2 = this;
	
	    each(this._events, function (handler, event) {
	      _this2._events[event] = null;
	      delete _this2._events[event];
	    });
	  };
	
	  Validator.prototype.manageValidation = function manageValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange) {
	    var validation = null;
	
	    if (el.tagName === 'SELECT') {
	      validation = this._manageSelectValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange);
	    } else if (el.type === 'checkbox') {
	      validation = this._manageCheckboxValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange);
	    } else if (el.type === 'radio') {
	      validation = this._manageRadioValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange);
	    } else {
	      validation = this._manageBaseValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange);
	    }
	
	    validation.setValidationClasses(this._classes);
	
	    return validation;
	  };
	
	  Validator.prototype.unmanageValidation = function unmanageValidation(field, el) {
	    if (el.type === 'checkbox') {
	      this._unmanageCheckboxValidation(field, el);
	    } else if (el.type === 'radio') {
	      this._unmanageRadioValidation(field, el);
	    } else if (el.tagName === 'SELECT') {
	      this._unmanageSelectValidation(field, el);
	    } else {
	      this._unmanageBaseValidation(field, el);
	    }
	  };
	
	  Validator.prototype.addGroupValidation = function addGroupValidation(group, field) {
	    var indexOf = exports$1.Vue.util.indexOf;
	
	    var validation = this._getValidationFrom(field);
	    var validations = this._groupValidations[group];
	
	    validations && !~indexOf(validations, validation) && validations.push(validation);
	  };
	
	  Validator.prototype.removeGroupValidation = function removeGroupValidation(group, field) {
	    var validation = this._getValidationFrom(field);
	    var validations = this._groupValidations[group];
	
	    validations && pull(validations, validation);
	  };
	
	  Validator.prototype.validate = function validate() {
	    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	    var _ref$el = _ref.el;
	    var el = _ref$el === undefined ? null : _ref$el;
	    var _ref$field = _ref.field;
	    var field = _ref$field === undefined ? null : _ref$field;
	    var _ref$touched = _ref.touched;
	    var touched = _ref$touched === undefined ? false : _ref$touched;
	    var _ref$noopable = _ref.noopable;
	    var noopable = _ref$noopable === undefined ? false : _ref$noopable;
	    var _ref$cb = _ref.cb;
	    var cb = _ref$cb === undefined ? null : _ref$cb;
	
	    if (!field) {
	      // all
	      each(this.validations, function (validation, key) {
	        validation.willUpdateFlags(touched);
	      });
	      this._validates(cb);
	    } else {
	      // each field
	      this._validate(field, touched, noopable, el, cb);
	    }
	  };
	
	  Validator.prototype.setupScope = function setupScope() {
	    var _this3 = this;
	
	    this._defineProperties(function () {
	      return _this3.validations;
	    }, function () {
	      return _this3._scope;
	    });
	
	    each(this._groups, function (name) {
	      var validations = _this3._groupValidations[name];
	      var group = {};
	      exports$1.Vue.set(_this3._scope, name, group);
	      _this3._defineProperties(function () {
	        return validations;
	      }, function () {
	        return group;
	      });
	    });
	  };
	
	  Validator.prototype.waitFor = function waitFor(cb) {
	    var method = '$activateValidator';
	    var vm = this._dir.vm;
	
	    vm[method] = function () {
	      cb();
	      vm[method] = null;
	    };
	  };
	
	  Validator.prototype._defineResetValidation = function _defineResetValidation() {
	    var _this4 = this;
	
	    this._dir.vm.$resetValidation = function (cb) {
	      _this4._resetValidation(cb);
	    };
	  };
	
	  Validator.prototype._defineValidate = function _defineValidate() {
	    var _this5 = this;
	
	    this._dir.vm.$validate = function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	
	      var field = null;
	      var touched = false;
	      var cb = null;
	
	      each(args, function (arg, index) {
	        if (typeof arg === 'string') {
	          field = arg;
	        } else if (typeof arg === 'boolean') {
	          touched = arg;
	        } else if (typeof arg === 'function') {
	          cb = arg;
	        }
	      });
	
	      _this5.validate({ field: field, touched: touched, cb: cb });
	    };
	  };
	
	  Validator.prototype._defineSetValidationErrors = function _defineSetValidationErrors() {
	    var _this6 = this;
	
	    this._dir.vm.$setValidationErrors = function (errors) {
	      _this6._setValidationErrors(errors);
	    };
	  };
	
	  Validator.prototype._validate = function _validate(field) {
	    var touched = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	    var noopable = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
	    var _this7 = this;
	
	    var el = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
	    var cb = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
	
	    var scope = this._scope;
	
	    var validation = this._getValidationFrom(field);
	    if (validation) {
	      validation.willUpdateFlags(touched);
	      validation.validate(function (results) {
	        exports$1.Vue.set(scope, field, results);
	        _this7._fireEvents();
	        cb && cb();
	      }, noopable, el);
	    }
	  };
	
	  Validator.prototype._validates = function _validates(cb) {
	    var _this8 = this;
	
	    var scope = this._scope;
	
	    this._runValidates(function (validation, key, done) {
	      validation.validate(function (results) {
	        exports$1.Vue.set(scope, key, results);
	        done();
	      });
	    }, function () {
	      // finished
	      _this8._fireEvents();
	      cb && cb();
	    });
	  };
	
	  Validator.prototype._getValidationFrom = function _getValidationFrom(field) {
	    return this._validations[field] || this._checkboxValidations[field] && this._checkboxValidations[field].validation || this._radioValidations[field] && this._radioValidations[field].validation;
	  };
	
	  Validator.prototype._resetValidation = function _resetValidation(cb) {
	    each(this.validations, function (validation, key) {
	      validation.reset();
	    });
	    this._validates(cb);
	  };
	
	  Validator.prototype._setValidationErrors = function _setValidationErrors(errors) {
	    var _this9 = this;
	
	    var extend = exports$1.Vue.util.extend;
	
	    // make tempolaly errors
	
	    var temp = {};
	    each(errors, function (error, index) {
	      if (!temp[error.field]) {
	        temp[error.field] = [];
	      }
	      temp[error.field].push(error);
	    });
	
	    // set errors
	    each(temp, function (values, field) {
	      var results = _this9._scope[field];
	      var newResults = {};
	
	      each(values, function (error) {
	        if (error.validator) {
	          results[error.validator] = error.message;
	        }
	      });
	
	      results.valid = false;
	      results.invalid = true;
	      results.errors = values;
	      extend(newResults, results);
	
	      var validation = _this9._getValidationFrom(field);
	      validation.willUpdateClasses(newResults, validation.el);
	
	      exports$1.Vue.set(_this9._scope, field, newResults);
	    });
	  };
	
	  Validator.prototype._manageBaseValidation = function _manageBaseValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange) {
	    var validation = this._validations[field] = new BaseValidation(field, model, vm, el, scope, this, filters, detectBlur, detectChange);
	    validation.manageElement(el, initial);
	    return validation;
	  };
	
	  Validator.prototype._unmanageBaseValidation = function _unmanageBaseValidation(field, el) {
	    var validation = this._validations[field];
	    if (validation) {
	      validation.unmanageElement(el);
	      exports$1.Vue.delete(this._scope, field);
	      this._validations[field] = null;
	      delete this._validations[field];
	    }
	  };
	
	  Validator.prototype._manageCheckboxValidation = function _manageCheckboxValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange) {
	    var validationSet = this._checkboxValidations[field];
	    if (!validationSet) {
	      var validation = new CheckboxValidation(field, model, vm, el, scope, this, filters, detectBlur, detectChange);
	      validationSet = { validation: validation, elements: 0 };
	      this._checkboxValidations[field] = validationSet;
	    }
	
	    validationSet.elements++;
	    validationSet.validation.manageElement(el, initial);
	    return validationSet.validation;
	  };
	
	  Validator.prototype._unmanageCheckboxValidation = function _unmanageCheckboxValidation(field, el) {
	    var validationSet = this._checkboxValidations[field];
	    if (validationSet) {
	      validationSet.elements--;
	      validationSet.validation.unmanageElement(el);
	      if (validationSet.elements === 0) {
	        exports$1.Vue.delete(this._scope, field);
	        this._checkboxValidations[field] = null;
	        delete this._checkboxValidations[field];
	      }
	    }
	  };
	
	  Validator.prototype._manageRadioValidation = function _manageRadioValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange) {
	    var validationSet = this._radioValidations[field];
	    if (!validationSet) {
	      var validation = new RadioValidation(field, model, vm, el, scope, this, filters, detectBlur, detectChange);
	      validationSet = { validation: validation, elements: 0 };
	      this._radioValidations[field] = validationSet;
	    }
	
	    validationSet.elements++;
	    validationSet.validation.manageElement(el, initial);
	    return validationSet.validation;
	  };
	
	  Validator.prototype._unmanageRadioValidation = function _unmanageRadioValidation(field, el) {
	    var validationSet = this._radioValidations[field];
	    if (validationSet) {
	      validationSet.elements--;
	      validationSet.validation.unmanageElement(el);
	      if (validationSet.elements === 0) {
	        exports$1.Vue.delete(this._scope, field);
	        this._radioValidations[field] = null;
	        delete this._radioValidations[field];
	      }
	    }
	  };
	
	  Validator.prototype._manageSelectValidation = function _manageSelectValidation(field, model, vm, el, scope, filters, initial, detectBlur, detectChange) {
	    var validation = this._validations[field] = new SelectValidation(field, model, vm, el, scope, this, filters, detectBlur, detectChange);
	    validation.manageElement(el, initial);
	    return validation;
	  };
	
	  Validator.prototype._unmanageSelectValidation = function _unmanageSelectValidation(field, el) {
	    var validation = this._validations[field];
	    if (validation) {
	      validation.unmanageElement(el);
	      exports$1.Vue.delete(this._scope, field);
	      this._validations[field] = null;
	      delete this._validations[field];
	    }
	  };
	
	  Validator.prototype._fireEvent = function _fireEvent(type) {
	    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	      args[_key2 - 1] = arguments[_key2];
	    }
	
	    var handler = this._events[this._getEventName(type)];
	    handler && this._dir.vm.$nextTick(function () {
	      handler.apply(null, args);
	    });
	  };
	
	  Validator.prototype._fireEvents = function _fireEvents() {
	    var scope = this._scope;
	
	    scope.touched && this._fireEvent('touched');
	    scope.dirty && this._fireEvent('dirty');
	
	    if (this._modified !== scope.modified) {
	      this._fireEvent('modified', scope.modified);
	      this._modified = scope.modified;
	    }
	
	    var valid = scope.valid;
	    this._fireEvent(valid ? 'valid' : 'invalid');
	  };
	
	  Validator.prototype._getEventName = function _getEventName(type) {
	    return this.name + ':' + type;
	  };
	
	  Validator.prototype._defineProperties = function _defineProperties(validationsGetter, targetGetter) {
	    var _this10 = this;
	
	    var bind = exports$1.Vue.util.bind;
	
	    each({
	      valid: { fn: this._defineValid, arg: validationsGetter },
	      invalid: { fn: this._defineInvalid, arg: targetGetter },
	      touched: { fn: this._defineTouched, arg: validationsGetter },
	      untouched: { fn: this._defineUntouched, arg: targetGetter },
	      modified: { fn: this._defineModified, arg: validationsGetter },
	      dirty: { fn: this._defineDirty, arg: validationsGetter },
	      pristine: { fn: this._definePristine, arg: targetGetter },
	      errors: { fn: this._defineErrors, arg: validationsGetter }
	    }, function (descriptor, name) {
	      Object.defineProperty(targetGetter(), name, {
	        enumerable: true,
	        configurable: true,
	        get: function get() {
	          return bind(descriptor.fn, _this10)(descriptor.arg);
	        }
	      });
	    });
	  };
	
	  Validator.prototype._runValidates = function _runValidates(fn, cb) {
	    var length = Object.keys(this.validations).length;
	
	    var count = 0;
	    each(this.validations, function (validation, key) {
	      fn(validation, key, function () {
	        ++count;
	        count >= length && cb();
	      });
	    });
	  };
	
	  Validator.prototype._walkValidations = function _walkValidations(validations, property, condition) {
	    var _this11 = this;
	
	    var hasOwn = exports$1.Vue.util.hasOwn;
	    var ret = condition;
	
	    each(validations, function (validation, key) {
	      if (ret === !condition) {
	        return;
	      }
	      if (hasOwn(_this11._scope, validation.field)) {
	        var target = _this11._scope[validation.field];
	        if (target && target[property] === !condition) {
	          ret = !condition;
	        }
	      }
	    });
	
	    return ret;
	  };
	
	  Validator.prototype._defineValid = function _defineValid(validationsGetter) {
	    return this._walkValidations(validationsGetter(), 'valid', true);
	  };
	
	  Validator.prototype._defineInvalid = function _defineInvalid(scopeGetter) {
	    return !scopeGetter().valid;
	  };
	
	  Validator.prototype._defineTouched = function _defineTouched(validationsGetter) {
	    return this._walkValidations(validationsGetter(), 'touched', false);
	  };
	
	  Validator.prototype._defineUntouched = function _defineUntouched(scopeGetter) {
	    return !scopeGetter().touched;
	  };
	
	  Validator.prototype._defineModified = function _defineModified(validationsGetter) {
	    return this._walkValidations(validationsGetter(), 'modified', false);
	  };
	
	  Validator.prototype._defineDirty = function _defineDirty(validationsGetter) {
	    return this._walkValidations(validationsGetter(), 'dirty', false);
	  };
	
	  Validator.prototype._definePristine = function _definePristine(scopeGetter) {
	    return !scopeGetter().dirty;
	  };
	
	  Validator.prototype._defineErrors = function _defineErrors(validationsGetter) {
	    var _this12 = this;
	
	    var hasOwn = exports$1.Vue.util.hasOwn;
	    var isPlainObject = exports$1.Vue.util.isPlainObject;
	    var errors = [];
	
	    each(validationsGetter(), function (validation, key) {
	      if (hasOwn(_this12._scope, validation.field)) {
	        var target = _this12._scope[validation.field];
	        if (target && !empty(target.errors)) {
	          each(target.errors, function (err, index) {
	            var error = { field: validation.field };
	            if (isPlainObject(err)) {
	              if (err.validator) {
	                error.validator = err.validator;
	              }
	              error.message = err.message;
	            } else if (typeof err === 'string') {
	              error.message = err;
	            }
	            errors.push(error);
	          });
	        }
	      }
	    });
	
	    return empty(errors) ? undefined : errors.sort(function (a, b) {
	      return a.field < b.field ? -1 : 1;
	    });
	  };
	
	  babelHelpers.createClass(Validator, [{
	    key: 'validations',
	    get: function get() {
	      var extend = exports$1.Vue.util.extend;
	
	      var ret = {};
	      extend(ret, this._validations);
	
	      each(this._checkboxValidations, function (dataset, key) {
	        ret[key] = dataset.validation;
	      });
	
	      each(this._radioValidations, function (dataset, key) {
	        ret[key] = dataset.validation;
	      });
	
	      return ret;
	    }
	  }]);
	  return Validator;
	}();
	
	function Validator(Vue) {
	  var FragmentFactory = Vue.FragmentFactory;
	  var vIf = Vue.directive('if');
	  var _Vue$util = Vue.util;
	  var isArray = _Vue$util.isArray;
	  var isPlainObject = _Vue$util.isPlainObject;
	  var createAnchor = _Vue$util.createAnchor;
	  var replace = _Vue$util.replace;
	  var extend = _Vue$util.extend;
	  var camelize = _Vue$util.camelize;
	
	  /**
	   * `validator` element directive
	   */
	
	  Vue.elementDirective('validator', {
	    params: ['name', 'groups', 'lazy', 'classes'],
	
	    bind: function bind() {
	      var params = this.params;
	
	      if (process.env.NODE_ENV !== 'production' && !params.name) {
	        warn('validator element requires a \'name\' attribute: ' + '(e.g. <validator name="validator1">...</validator>)');
	        return;
	      }
	
	      this.validatorName = '$' + camelize(params.name);
	      if (!this.vm._validatorMaps) {
	        throw new Error('Invalid validator management error');
	      }
	
	      var classes = {};
	      if (isPlainObject(this.params.classes)) {
	        classes = this.params.classes;
	      }
	
	      this.setupValidator(classes);
	      this.setupFragment(params.lazy);
	    },
	    unbind: function unbind() {
	      this.teardownFragment();
	      this.teardownValidator();
	    },
	    getGroups: function getGroups() {
	      var params = this.params;
	      var groups = [];
	
	      if (params.groups) {
	        if (isArray(params.groups)) {
	          groups = params.groups;
	        } else if (!isPlainObject(params.groups) && typeof params.groups === 'string') {
	          groups.push(params.groups);
	        }
	      }
	
	      return groups;
	    },
	    setupValidator: function setupValidator(classes) {
	      var validator = this.validator = new Validator$1(this.validatorName, this, this.getGroups(), classes);
	      validator.enableReactive();
	      validator.setupScope();
	      validator.registerEvents();
	    },
	    teardownValidator: function teardownValidator() {
	      this.validator.unregisterEvents();
	      this.validator.disableReactive();
	
	      if (this.validatorName) {
	        this.validatorName = null;
	        this.validator = null;
	      }
	    },
	    setupFragment: function setupFragment(lazy) {
	      var _this = this;
	
	      var vm = this.vm;
	
	      this.validator.waitFor(function () {
	        _this.anchor = createAnchor('vue-validator');
	        replace(_this.el, _this.anchor);
	        extend(vm.$options, { _validator: _this.validatorName });
	        _this.factory = new FragmentFactory(vm, _this.el.innerHTML);
	        vIf.insert.call(_this);
	      });
	
	      !lazy && vm.$activateValidator();
	    },
	    teardownFragment: function teardownFragment() {
	      vIf.unbind.call(this);
	    }
	  });
	}
	
	function ValidatorError(Vue) {
	  /**
	   * ValidatorError component
	   */
	
	  var error = {
	    name: 'validator-error',
	
	    props: {
	      field: {
	        type: String,
	        required: true
	      },
	      validator: {
	        type: String
	      },
	      message: {
	        type: String,
	        required: true
	      },
	      partial: {
	        type: String,
	        default: 'validator-error-default'
	      }
	    },
	
	    template: '<div><partial :name="partial"></partial></div>',
	
	    partials: {}
	  };
	
	  // only use ValidatorError component
	  error.partials['validator-error-default'] = '<p>{{field}}: {{message}}</p>';
	
	  return error;
	}
	
	function Errors(Vue) {
	  var _ = Vue.util;
	  var error = ValidatorError(Vue); // import ValidatorError component
	
	  /**
	   * ValidatorErrors component
	   */
	
	  var errors = {
	    name: 'validator-errors',
	
	    props: {
	      validation: {
	        type: Object,
	        required: true
	      },
	      group: {
	        type: String,
	        default: null
	      },
	      field: {
	        type: String,
	        default: null
	      },
	      component: {
	        type: String,
	        default: 'validator-error'
	      }
	    },
	
	    computed: {
	      errors: function errors() {
	        var _this = this;
	
	        if (this.group !== null) {
	          return this.validation[this.group].errors;
	        } else if (this.field !== null) {
	          var target = this.validation[this.field];
	          if (!target.errors) {
	            return;
	          }
	
	          return target.errors.map(function (error) {
	            var err = { field: _this.field };
	            if (_.isPlainObject(error)) {
	              if (error.validator) {
	                err.validator = error.validator;
	              }
	              err.message = error.message;
	            } else if (typeof error === 'string') {
	              err.message = error;
	            }
	            return err;
	          });
	        } else {
	          return this.validation.errors;
	        }
	      }
	    },
	
	    template: '<template v-for="error in errors">' + '<component :is="component" :partial="partial" :field="error.field" :validator="error.validator" :message="error.message">' + '</component>' + '</template>',
	
	    components: {}
	  };
	
	  // define 'partial' prop
	  errors.props['partial'] = error.props['partial'];
	
	  // only use ValidatorErrors component
	  errors.components[error.name] = error;
	
	  // install ValidatorErrors component
	  Vue.component(errors.name, errors);
	
	  return errors;
	}
	
	/**
	 * plugin
	 *
	 * @param {Function} Vue
	 * @param {Object} options
	 */
	
	function plugin(Vue) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  if (plugin.installed) {
	    warn('already installed.');
	    return;
	  }
	
	  exports$1.Vue = Vue;
	  Asset(Vue);
	  Errors(Vue);
	
	  Override(Vue);
	  Validator(Vue);
	  ValidateClass(Vue);
	  Validate(Vue);
	}
	
	plugin.version = '2.1.6';
	
	if (typeof window !== 'undefined' && window.Vue) {
	  window.Vue.use(plugin);
	}
	
	module.exports = plugin;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	(function () {
	    try {
	        cachedSetTimeout = setTimeout;
	    } catch (e) {
	        cachedSetTimeout = function cachedSetTimeout() {
	            throw new Error('setTimeout is not defined');
	        };
	    }
	    try {
	        cachedClearTimeout = clearTimeout;
	    } catch (e) {
	        cachedClearTimeout = function cachedClearTimeout() {
	            throw new Error('clearTimeout is not defined');
	        };
	    }
	})();
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e) {
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e) {
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while (len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () {
	    return '/';
	};
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function () {
	    return 0;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_vue2.default.filter('tab', function (code) {
	  var companyTypeArr = ['我的任务2', '我的绩效表', '员工考核进度', '绩效汇总分析', '考核管理'],
	      codeArr = [1, 2, 3];
	  var index = codeArr.indexOf(code);
	  return companyTypeArr[index];
	}); /*
	     * --------------------------------------------
	     * vue模板过滤器
	     * @version  1.0
	     * @author   shirley(hztanxuewei@corp.netease.com)
	     * --------------------------------------------
	     */
	
	
	_vue2.default.filter('format', function (date) {});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_vue2.default.directive('v-scroll', function (item, value) {
	  console.log(value);
	  this.$watch(value, function (newValue) {
	    console.log(value);
	    if (newValue && elem) {
	      elem.parentElement.scrollTop = elem.offsetTop;
	    }
	  });
	}); /*
	     * --------------------------------------------
	     * vue指令
	     * @version  1.0
	     * @author   shirley(hztanxuewei@corp.netease.com)
	     * --------------------------------------------
	     */

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(10)
	__vue_script__ = __webpack_require__(12)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/App.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(25)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./App.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 10 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 11 */,
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Alert = __webpack_require__(13);
	
	var _Alert2 = _interopRequireDefault(_Alert);
	
	var _Sidebar = __webpack_require__(19);
	
	var _Sidebar2 = _interopRequireDefault(_Sidebar);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { Sidebar: _Sidebar2.default, Alert: _Alert2.default },
	  ready: function ready() {
	    _vue2.default.$alert = _vue2.default.prototype.$alert = this.$refs.alert.open.bind(this.$refs.alert);
	  },
	  data: function data() {
	    return {
	      totalTime: 0,
	      showTop: false
	    };
	  },
	
	  events: {
	    timeUpdate: function timeUpdate(timeEntry) {
	      this.totalTime += parseFloat(timeEntry.totalTime);
	    },
	    deleteTime: function deleteTime(timeEntry) {
	      this.totalTime -= parseFloat(timeEntry.totalTime);
	    },
	    selectProduct: function selectProduct(id) {
	      var view = this.$refs.view;
	      view && typeof view.getAppList == 'function' && view.getAppList(id);
	    }
	  }
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(14)
	__vue_script__ = __webpack_require__(15)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Alert.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(18)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Alert.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 14 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _coerceBoolean = __webpack_require__(16);
	
	var _coerceBoolean2 = _interopRequireDefault(_coerceBoolean);
	
	var _coerceNumber = __webpack_require__(17);
	
	var _coerceNumber2 = _interopRequireDefault(_coerceNumber);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  props: {
	    type: {
	      type: String
	    },
	    dismissable: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: false
	    },
	    show: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: true,
	      twoWay: true
	    },
	    duration: {
	      type: Number,
	      coerce: _coerceNumber2.default,
	      default: 0
	    },
	    width: {
	      type: String
	    },
	    placement: {
	      type: String
	    }
	  },
	  data: function data() {
	    return {
	      message: ''
	    };
	  },
	
	  watch: {
	    show: function show(val) {
	      var _this = this;
	
	      if (this._timeout) clearTimeout(this._timeout);
	      if (val && Boolean(this.duration)) {
	        this._timeout = setTimeout(function () {
	          _this.show = false;
	        }, this.duration);
	      }
	    }
	  },
	  methods: {
	    open: function open(text, state, duration) {
	      this.message = text;
	      this.type = state ? state : 'danger';
	      this.show = true;
	    }
	  }
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// Attempt to convert a string value to a Boolean. Otherwise, return the value
	// without modification so Vue can throw a warning.
	exports.default = function (val) {
	  return typeof val !== 'string' ? val : val === 'true' ? true : val === 'false' ? false : val === 'null' ? false : val === 'undefined' ? false : val;
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	// Attempt to convert a string value to a Number.
	// Otherwise, return 0.
	exports.default = function (val) {
	  var alt = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	  return typeof val === 'number' ? val : val === undefined || val === null || isNaN(Number(val)) ? alt : Number(val);
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = "\n<div\n  v-show=\"show\"\n  v-bind:class=\"{\n    'alert':\t\ttrue,\n    'alert-success':(type == 'success'),\n    'alert-warning':(type == 'warning'),\n    'alert-info':\t(type == 'info'),\n    'alert-danger':\t(type == 'danger'),\n    'top': \t\t\t(placement === 'top'),\n    'top-right': \t(placement === 'top-right')\n  }\"\n  transition=\"fade\"\n  v-bind:style=\"{'max-width':width}\"\n  role=\"alert\">\n  <!-- <button v-show=\"dismissable\" type=\"button\" class=\"close\"\n    @click=\"show = false\">\n    <span>&times;</span>\n  </button> -->\n  <p>{{ message }}</p>\n</div>\n";

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(20)
	__vue_script__ = __webpack_require__(21)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Sidebar.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(24)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Sidebar.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 20 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _common = __webpack_require__(22);
	
	exports.default = {
	  data: function data() {
	    return {
	      productList: [],
	      noProductList: false,
	      followedList: [],
	      noFollowedList: false,
	      pId: this.$route.query.proId
	    };
	  },
	  ready: function ready() {
	    this.getProductList();
	    this.getFollowedList();
	  },
	
	  methods: {
	    getProductList: function getProductList() {
	      var _this = this;
	
	      (0, _common.getProductList)({}).then(function (data) {
	        _this.productList = data.list || [];
	        _this.noProductList = _this.productList.length == 0 ? true : false;
	      });
	    },
	    getFollowedList: function getFollowedList() {
	      var _this2 = this;
	
	      (0, _common.getFollowedProList)({}).then(function (data) {
	        _this2.followedList = data.list || [];
	        _this2.noFollowedList = _this2.followedList.length == 0 ? true : false;
	      });
	    },
	    selectProduct: function selectProduct(id) {
	      this.$dispatch('selectProduct', id);
	    }
	  }
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getAllProductList = getAllProductList;
	exports.getProductList = getProductList;
	exports.getAppList = getAppList;
	exports.getClusterList = getClusterList;
	exports.follow = follow;
	exports.getFollowedProList = getFollowedProList;
	exports.getFollowedAppList = getFollowedAppList;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// 获取所有产品
	function getAllProductList(params) {
	    return request.get('/api/product/config/products', params);
	}
	
	// 获取我的产品
	/*
	 * --------------------------------------------
	 * 异步接口 - 角色配置
	 * @version  1.0
	 * @author   shirley(hztanxuewei@corp.netease.com)
	 * --------------------------------------------
	 */
	function getProductList(params) {
	    return request.get('/api/product', params);
	}
	//获取产品下应用
	function getAppList(params) {
	    return request.get('/api/app', params);
	}
	//获取应用下集群
	function getClusterList(params) {
	    return request.get('/api/app/cluster', params);
	}
	//收藏应用
	function follow(params) {
	    return request.get('/api/app/follow', params);
	}
	//获取我收藏的产品
	function getFollowedProList(params) {
	    return request.get('/api/app/followed', params);
	}
	//获取我收藏产品下的应用
	function getFollowedAppList(id) {
	    return request.get('/api/app/followed/' + id, {});
	}

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                   * @method request 请求
	                                                                                                                                                                                                                                                   * @param {string}                  url                 请求路径
	                                                                                                                                                                                                                                                   * @param {object}                  options             请求选项
	                                                                                                                                                                                                                                                   * @param {boolean=true}            options.data        请求数据
	                                                                                                                                                                                                                                                   * @param {string}                  options.method      请求方式
	                                                                                                                                                                                                                                                   */
	
	
	exports.get = get;
	exports.post = post;
	exports.put = put;
	exports.del = del;
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	__webpack_require__(1);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var request = function request(url) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    var opt = {
	        credentials: 'same-origin', // send cookie
	        headers: {
	            'Accept': 'application/json'
	        }
	    };
	
	    // const isJSON = typeof options.data === 'object';
	    var isJSON = options.type === 'formData' ? false : true;
	    isJSON && (opt.headers['Content-Type'] = 'application/json');
	    // !isJSON && (opt.headers['Content-Type'] = `multipart/form-data;`);
	
	    opt.method = (options.method || 'GET').toUpperCase();
	
	    if (options.data && isJSON) {
	        switch (opt.method) {
	            case 'GET':
	            case 'DELETE':
	                url += '?' + serialize(options.data);
	                break;
	            case 'POST':
	            case 'PUT':
	                // opt.body = JSON.stringify(options.data);
	                var cache = [];
	                opt.body = JSON.stringify(options.data, function (key, value) {
	                    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null) {
	                        if (cache.indexOf(value) !== -1) {
	                            // Circular reference found, discard key
	                            return;
	                        }
	                        // Store value in our collection
	                        cache.push(value);
	                    }
	                    return value;
	                });
	                cache = null; // Enable garbage collection
	                break;
	            default:
	                throw new Error('No `method` when request!');
	        }
	    } else opt.body = options.data;
	
	    return new Promise(function (resolve, reject) {
	        fetch(url, opt).then(function (res) {
	            if (res.ok) return res.json();else {
	                console.log("Looks like the response wasn't perfect, got status", res.status);
	                throw new Error(res.status);
	            }
	        }).then(function (json) {
	            // json.code === 200 ? resolve(json) : reject(json);
	            if (json.code === 200) {
	                json.data ? resolve(json.data) : resolve(json.data);
	            } else if (json.code === 401) {
	                resolve(json.data);
	                json.message ? _vue2.default.$alert(json.message, 'danger') : _vue2.default.$alert('您没有权限', 'danger');
	            } else {
	                json.message ? _vue2.default.$alert(json.message, 'danger') : _vue2.default.$alert('请求失败', 'danger');
	            }
	        }).catch(function (err) {
	            console.error('Request failed:', err);
	            // alert('获取失败');
	        });
	    });
	};
	
	var serialize = function serialize(obj) {
	    return Object.keys(obj).map(function (name) {
	        return name + '=' + obj[name];
	    }).join('&');
	};
	
	/**
	 * @method request GET请求
	 * @param {string}                  url                 请求路径
	 * @param {var}                     data                请求数据
	 */
	function get(url) {
	    var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	    var timestamp = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	
	    if (timestamp) {
	        data = data || {};
	        data.timestamp = +new Date();
	    }
	    return request(url, { method: 'GET', data: data });
	}
	
	/**
	 * @method request POST请求
	 * @param {string}                  url                 请求路径
	 * @param {var}                     data                请求数据
	 */
	function post(url, data, type) {
	    return request(url, { method: 'POST', data: data, type: type });
	}
	
	/**
	 * @method request PUT请求
	 * @param {string}                  url                 请求路径
	 * @param {var}                     data                请求数据
	 */
	function put(url, data) {
	    return request(url, { method: 'PUT', data: data });
	}
	
	/**
	 * @method request DEL请求
	 * @param {string}                  url                 请求路径
	 * @param {var}                     data                请求数据
	 */
	function del(url, data) {
	    return request(url, { method: 'DELETE', data: data });
	}

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = "\n<div class=\"m-sidebar\">\n    <ul class=\"tlt\">\n      <li><a v-link=\"'/home/list'\" :class=\"{ 'act': $route.name != 'follow/list'}\">我的产品</a></li>\n      <li><a v-link=\"'/follow/list'\" :class=\"{ 'act': $route.name == 'follow/list'}\">我的收藏</a></li>\n    </ul>\n    <ul class=\"list\" v-if=\"$route.name != 'follow/list'\">\n      <li v-for=\"item in productList\">\n          <a :class=\"{ 'act': $route.query.productId == item.productId }\"\n             title=\"{{ item.productName }}\"\n             @click=\"selectProduct(item.productId)\"\n             v-link=\"{path: '/home/list', exact: true, query: {'productId': item.productId}}\">{{ item.productName }}</a>\n      </li>\n      <p v-if=\"noProductList\" class=\"no-data\">暂无产品</p>\n    </ul>\n    <ul class=\"list\" v-if=\"$route.name == 'follow/list'\">\n      <li v-for=\"item in followedList\">\n          <a :class=\"{ 'act': $route.query.productId == item.productId }\"\n             title=\"{{ item.productName }}\"\n             @click=\"selectProduct(item.productId)\"\n             v-link=\"{path: '/follow/list', exact: true, query: {'productId': item.productId}}\">{{ item.productName }}</a>\n      </li>\n      <p v-if=\"noFollowedList\" class=\"no-data\">暂无产品</p>\n    </ul>\n</div>\n";

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = "\n<div>\n  <header class=\"f-cb\">\n      <div class=\"m-logo\">\n          <a class=\"\" href=\"#\" v-link=\"'/home'\">\n            网易自动部署平台\n          </a>\n      </div>\n      <ul class=\"m-nav f-fr\">\n          <li v-if=\"$router.locals.isAdmin=='1'\"><a v-link=\"'/sysConfig/buildServer'\"><i class=\"u-icon u-icon-sys\"></i>系统设置</a></li>\n          <li><a v-link=\"'/userConfig/secretKey'\"><i class=\"u-icon u-icon-user\"></i>个人设置</a></li>\n          <li>{{ $router.locals.userName }}</li>\n          <li><a href=\"/logout\"><i class=\"u-icon u-icon-exit\"></i>退出</a></li>\n      </ul>\n  </header>\n  <div class=\"g-bd\">\n    <div class=\"g-sd\">\n        <sidebar :time=\"totalTime\" v-ref:sidebar></sidebar>\n    </div>\n    <div class=\"g-mn\">\n        <router-view v-ref:view></router-view>\n    </div>\n  </div>\n  <!-- <footer>\n    网易杭州研究院运维部\n  </footer> -->\n<alert :show.sync=\"showTop\" placement=\"top\" duration=\"3000\" width=\"400px\" dismissable v-ref:alert>\n  <!-- <i class=\"iconfont icon-tip\"></i> -->\n</alert>\n</div>\n";

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(27)
	__vue_script__ = __webpack_require__(28)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/Index.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(67)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Index.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 27 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _assign = __webpack_require__(29);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _common = __webpack_require__(22);
	
	var _util = __webpack_require__(66);
	
	var _util2 = _interopRequireDefault(_util);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  data: function data() {
	    return {
	      appList: [],
	      appName: '',
	      noAppList: false,
	      searchWord: '',
	      clusterList: [],
	      clusterName: '',
	      children: this.$children[0]
	    };
	  },
	  ready: function ready() {
	    this.appList = [];
	    var pId = this.$route.query.productId;
	    var clusterId = this.$route.query.clusterId;
	    pId && this.getAppList(pId);
	  },
	
	  watch: {
	    'clusterName': function clusterName(val, oldVal) {
	      this.$children[0] && (this.$children[0].clusterName = val);
	      this.$children[0] && this.$children[0].$children[0] && (this.$children[0].$children[0].clusterName = val);
	    }
	  },
	  methods: {
	    getAppList: function getAppList(id) {
	      var _this = this;
	
	      if (this.$route.name == 'follow/list') {
	        (0, _common.getFollowedAppList)(id).then(function (data) {
	          _this.appList = data.list || [];
	          _this.noAppList = _this.appList.length == 0 ? true : false;
	          _this.doGetAppName();
	        });
	      } else {
	        (0, _common.getAppList)({ productId: id }).then(function (data) {
	          _this.allAppList = data.list || [];
	          _this.appList = data.list || [];
	          _this.noAppList = _this.appList.length == 0 ? true : false;
	          _this.doGetAppName();
	        });
	      }
	    },
	    search: function search(val) {
	      this.appList = this.allAppList.filter(function (item) {
	        return item.applicationName.indexOf(val) != -1;
	      });
	      this.noAppList = this.appList.length == 0 ? true : false;
	    },
	    selectApp: function selectApp(appId, appName) {
	      (0, _assign2.default)(this.$route.query, {
	        'appId': appId
	      });
	      if (!!appName) this.appName = appName;
	      if (this.$children[0] && typeof this.$children[0].getClusterList == 'function') {
	        this.$children[0].getClusterList(this.$route.query, appName || this.appName);
	      }
	    },
	    doGetAppName: function doGetAppName() {
	      var appId = this.$route.query.appId;
	      this.appName = '';
	
	      if (!!appId && this.$route.name.indexOf('list') != -1) {
	        this.appName = this.getSelectAppName(appId);
	        this.selectApp(appId, this.appName);
	      }
	    },
	    getSelectAppName: function getSelectAppName(appId) {
	      var appObj = this.appList.find(function (n) {
	        return n.applicationId == appId;
	      });
	      return appObj ? appObj.applicationName : '';
	    },
	    getClusterList: function getClusterList(params) {
	      var _this2 = this;
	
	      if (!params.appId) return;
	
	      (0, _common.getClusterList)({
	        productId: params.productId,
	        appId: params.appId
	      }).then(function (data) {
	        _this2.clusterList = data.clusters || [];
	        var obj = _util2.default.findInMap(_this2.clusterList, 'clusterId', params.clusterId);
	        _this2.clusterName = obj ? obj.clusterName : '';
	      });
	    },
	    getClusterName: function getClusterName(params) {
	      this.clusterName = '';
	      this.getClusterList(params);
	    }
	  }
	};

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(30), __esModule: true };

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(31);
	module.exports = __webpack_require__(34).Object.assign;

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(32);
	
	$export($export.S + $export.F, 'Object', { assign: __webpack_require__(47) });

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var global = __webpack_require__(33),
	    core = __webpack_require__(34),
	    ctx = __webpack_require__(35),
	    hide = __webpack_require__(37),
	    PROTOTYPE = 'prototype';
	
	var $export = function $export(type, name, source) {
	  var IS_FORCED = type & $export.F,
	      IS_GLOBAL = type & $export.G,
	      IS_STATIC = type & $export.S,
	      IS_PROTO = type & $export.P,
	      IS_BIND = type & $export.B,
	      IS_WRAP = type & $export.W,
	      exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
	      expProto = exports[PROTOTYPE],
	      target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
	      key,
	      own,
	      out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && key in exports) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? function (C) {
	      var F = function F(a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0:
	              return new C();
	            case 1:
	              return new C(a);
	            case 2:
	              return new C(a, b);
	          }return new C(a, b, c);
	        }return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	      // make static versions for prototype methods
	    }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1; // forced
	$export.G = 2; // global
	$export.S = 4; // static
	$export.P = 8; // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	$export.U = 64; // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';
	
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';
	
	var core = module.exports = { version: '2.4.0' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// optional / simple context binding
	var aFunction = __webpack_require__(36);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };
	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };
	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }
	  return function () /* ...args */{
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dP = __webpack_require__(38),
	    createDesc = __webpack_require__(46);
	module.exports = __webpack_require__(42) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var anObject = __webpack_require__(39),
	    IE8_DOM_DEFINE = __webpack_require__(41),
	    toPrimitive = __webpack_require__(45),
	    dP = Object.defineProperty;
	
	exports.f = __webpack_require__(42) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) {/* empty */}
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isObject = __webpack_require__(40);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	module.exports = function (it) {
	  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = !__webpack_require__(42) && !__webpack_require__(43)(function () {
	  return Object.defineProperty(__webpack_require__(44)('div'), 'a', { get: function get() {
	      return 7;
	    } }).a != 7;
	});

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(43)(function () {
	  return Object.defineProperty({}, 'a', { get: function get() {
	      return 7;
	    } }).a != 7;
	});

/***/ },
/* 43 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isObject = __webpack_require__(40),
	    document = __webpack_require__(33).document
	// in old IE typeof document.createElement is 'object'
	,
	    is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(40);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	
	var getKeys = __webpack_require__(48),
	    gOPS = __webpack_require__(63),
	    pIE = __webpack_require__(64),
	    toObject = __webpack_require__(65),
	    IObject = __webpack_require__(52),
	    $assign = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(43)(function () {
	  var A = {},
	      B = {},
	      S = Symbol(),
	      K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) {
	    B[k] = k;
	  });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) {
	  // eslint-disable-line no-unused-vars
	  var T = toObject(target),
	      aLen = arguments.length,
	      index = 1,
	      getSymbols = gOPS.f,
	      isEnum = pIE.f;
	  while (aLen > index) {
	    var S = IObject(arguments[index++]),
	        keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S),
	        length = keys.length,
	        j = 0,
	        key;
	    while (length > j) {
	      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	    }
	  }return T;
	} : $assign;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(49),
	    enumBugKeys = __webpack_require__(62);
	
	module.exports = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var has = __webpack_require__(50),
	    toIObject = __webpack_require__(51),
	    arrayIndexOf = __webpack_require__(55)(false),
	    IE_PROTO = __webpack_require__(59)('IE_PROTO');
	
	module.exports = function (object, names) {
	  var O = toIObject(object),
	      i = 0,
	      result = [],
	      key;
	  for (key in O) {
	    if (key != IE_PROTO) has(O, key) && result.push(key);
	  } // Don't enum bug & hidden keys
	  while (names.length > i) {
	    if (has(O, key = names[i++])) {
	      ~arrayIndexOf(result, key) || result.push(key);
	    }
	  }return result;
	};

/***/ },
/* 50 */
/***/ function(module, exports) {

	"use strict";
	
	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(52),
	    defined = __webpack_require__(54);
	module.exports = function (it) {
	  return IObject(defined(it));
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(53);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	"use strict";
	
	var toString = {}.toString;
	
	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 54 */
/***/ function(module, exports) {

	"use strict";
	
	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(51),
	    toLength = __webpack_require__(56),
	    toIndex = __webpack_require__(58);
	module.exports = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject($this),
	        length = toLength(O.length),
	        index = toIndex(fromIndex, length),
	        value;
	    // Array#includes uses SameValueZero equality algorithm
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      if (value != value) return true;
	      // Array#toIndex ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if (IS_INCLUDES || index in O) {
	        if (O[index] === el) return IS_INCLUDES || index || 0;
	      }
	    }return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 7.1.15 ToLength
	var toInteger = __webpack_require__(57),
	    min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	"use strict";
	
	// 7.1.4 ToInteger
	var ceil = Math.ceil,
	    floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var toInteger = __webpack_require__(57),
	    max = Math.max,
	    min = Math.min;
	module.exports = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var shared = __webpack_require__(60)('keys'),
	    uid = __webpack_require__(61);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var global = __webpack_require__(33),
	    SHARED = '__core-js_shared__',
	    store = global[SHARED] || (global[SHARED] = {});
	module.exports = function (key) {
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 61 */
/***/ function(module, exports) {

	'use strict';
	
	var id = 0,
	    px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 62 */
/***/ function(module, exports) {

	'use strict';
	
	// IE 8- don't enum bug keys
	module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

/***/ },
/* 63 */
/***/ function(module, exports) {

	"use strict";
	
	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 64 */
/***/ function(module, exports) {

	"use strict";
	
	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(54);
	module.exports = function (it) {
	  return Object(defined(it));
	};

/***/ },
/* 66 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/*
	 * --------------------------------------------
	 * extend 公共方法
	 * @version  1.0
	 * @author   shirley(hztanxuewei@corp.netease.com)
	 * --------------------------------------------
	 */
	var util = {
	    /**
	     * 用于在本项目中查找map.js中的对象
	     * @param  {Array} arr     [{},{}]
	     * @param  {String} key   查找的key
	     * @param   value         查找的key对应的值
	     * @return {Object}       返回Object
	     */
	    findInMap: function findInMap(arr, key, value) {
	        for (var i = 0; i < arr.length; i++) {
	            if (arr[i][key] == value) {
	                return arr[i];
	            }
	        }
	        // return {};
	    },
	    findInArr: function findInArr(arr, key, value) {
	
	        return arr.filter(function (item) {
	            return item[key] == value;
	        });
	    },
	    optionsData: function optionsData(list, id, name) {
	        return list.map(function (item, index) {
	            item.value = item[id];
	            item.label = item[name] || '';
	            return item;
	        });
	    },
	    findIdList: function findIdList(arr, key) {
	        var newArr = [];
	        arr.forEach(function (item) {
	            newArr.push(item[key]);
	        });
	        return newArr;
	    },
	    checkIp: function checkIp(ip) {
	        var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //匹配ip地址的正则表达式
	        if (re.test(ip)) {
	            if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
	                return true;
	            }
	        }
	        return false;
	    }
	};
	
	exports.default = util;

/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = "\r\n<div class=\"wrap\" v-if=\"$route.query.productId\">\r\n  <nav>\r\n    <div class=\"u-iptsearch\">\r\n        <input type=\"text\" \r\n          class=\"u-ipt u-ipt-s\"\r\n          v-model=\"searchWord\"\r\n          @input=\"search(searchWord)\"\r\n          placeholder=\"按应用搜索\" /></div>\r\n    <ul>\r\n      <li v-for=\"item in appList\">\r\n          <a :class=\"{'act': $route.query.appId == item.applicationId}\"\r\n             title=\"{{ item.applicationName }}\"\r\n             @click=\"selectApp(item.applicationId,item.applicationName)\"\r\n             v-link=\"{path: '/'+$route.name, exact: true, query: {'appId': item.applicationId, 'productId': $route.query.productId}}\">{{ item.applicationName }}</a>\r\n      </li>\r\n      <p v-if=\"noAppList\" class=\"no-data\">无应用</p>\r\n    </ul>\r\n  </nav>\r\n  <div class=\"m-home\" v-if=\"$route.query.appId\">\r\n    <router-view></router-view>\r\n  </div>\r\n  <div class=\"m-home\" v-if=\"$route.query.productId && !$route.query.appId\">请选择左侧的应用哟~</div>\r\n</div>\r\n<div class=\"no-data\" v-else>请选择左侧的产品呦~</div>\r\n";

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(69)
	__vue_script__ = __webpack_require__(70)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/config/List.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(71)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./List.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 69 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _assign = __webpack_require__(29);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _common = __webpack_require__(22);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  data: function data() {
	    return {
	      clusterList: [],
	      appName: '',
	      followed: false,
	      optList: [{
	        name: '集群配置',
	        link: 'cluster'
	      }, {
	        name: '构建配置',
	        link: 'build'
	      }, {
	        name: '发布配置',
	        link: 'publish'
	      }, {
	        name: '权限配置',
	        link: 'auth'
	      }]
	    };
	  },
	  ready: function ready() {
	    this.$parent.selectApp(this.$route.query.appId);
	  },
	
	  methods: {
	    getClusterList: function getClusterList(params, appName) {
	      var _this = this;
	
	      if (!params.appId) return;
	      this.appName = appName;
	      (0, _common.getClusterList)(params).then(function (data) {
	        if (!data) {
	          _this.clusterList = [];
	          return;
	        }
	        _this.clusterList = data.clusters || [];
	        _this.followed = data.followed || false;
	      });
	    },
	    follow: function follow(type) {
	      var _this2 = this;
	
	      (0, _assign2.default)(this.$route.query, {
	        'action': type
	      });
	      (0, _common.follow)(this.$route.query).then(function (data) {
	        _this2.followed = !_this2.followed;
	        if (_this2.$route.name == 'home/list') {
	
	          _this2.refreshProList();
	        }
	      });
	    },
	    refreshProList: function refreshProList() {
	      var sidebar = this.$parent.$parent.$refs.sidebar;
	
	      sidebar && sidebar.getFollowedList();
	    }
	  }
	};

/***/ },
/* 71 */
/***/ function(module, exports) {

	module.exports = "\n<div>\n  <p class=\"tlt f-cb\">\n      <span class=\"f-fl\">{{ appName }}</span>\n      <span class=\"f-fr\">\n        <span v-if=\"followed\" \n              class=\"u-btn u-btn-gray\" \n              @click=\"follow('unfollow')\">已收藏</span>\n        <span v-else \n              class=\"u-btn u-btn-s\" \n              @click=\"follow('follow')\">收藏</span>\n      </span>\n  </p>\n  <table class=\"m-table\">\n      <thead>\n          <tr>\n              <th>集群名称</th>\n              <th>集群状态</th>\n              <th>应用类型</th>\n              <th>配置</th>\n          </tr>\n      </thead>\n      <tbody>\n          <tr v-for=\"item in clusterList\">\n              <td><a v-link=\"{path: '/home/deploy', exact: true, query: {'appId': $route.query.appId, 'productId': $route.query.productId, 'clusterId': item.clusterId}}\" title=\"{{ item.clusterName }}\">{{ item.clusterName }}</a></td>\n              <td>{{ item.clusterStatus }}</td>\n              <td>{{ item.appType }}</td>\n              <td class=\"u-btns\">\n                <template v-if=\"item.isDeployer\" v-for=\"(index, obj) in optList\">\n                  <span v-if=\"!item.appType && index==2\" class=\"u-btn u-btn-s1 u-btn-dis\" title=\"请先进行集群配置\">发布配置</span>\n                  <span v-else class=\"u-btn u-btn-s1\">\n                    <a v-link=\"{path: '/home/'+ obj.link, exact: true, query: {'appId': $route.query.appId, 'productId': $route.query.productId, 'clusterId': item.clusterId}}\">{{ obj.name }}</a>\n                  </span>\n                </template>\n                <template v-if=\"!item.isDeployer\">\n                  <span class=\"u-btn u-btn-s1 u-btn-dis\" v-for=\"obj in optList\">{{ obj.name }}</span>\n                </template>\n              </td>\n          </tr>\n      </tbody>\n  </table>\n</div>\n";

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(73)
	__vue_script__ = __webpack_require__(74)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/config/Cluster.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(76)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Cluster.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 73 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _cluster = __webpack_require__(75);
	
	var service = _interopRequireWildcard(_cluster);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  data: function data() {
	    return {
	      query: this.$route.query,
	      clusterId: this.$route.query.clusterId,
	      clusterName: '',
	      options: [],
	      obj: {
	        appType: '',
	        buildServerClusterId: '',
	        nosConfigId: '',
	        clusterId: +this.$route.query.clusterId
	      },
	      database: {
	        appType: [],
	        buildServerCluster: [],
	        nosConfig: []
	      }
	    };
	  },
	  ready: function ready() {
	    this.getConfig();
	    this.$parent.getClusterName(this.query);
	  },
	
	  methods: {
	    getConfig: function getConfig() {
	      var _this = this;
	
	      service.get(this.clusterId).then(function (data) {
	        var clusterConfig = data.clusterConfig || {};
	
	        _this.database = data.database || {};
	        _this.obj = {
	          appType: clusterConfig.appType ? clusterConfig.appType.replace(/\s/, '') : '',
	          buildServerClusterId: clusterConfig.buildServerClusterId || '',
	          nosConfigId: clusterConfig.nosConfigId || '',
	          clusterId: +_this.clusterId
	        };
	      });
	    },
	    go: function go() {
	      this.$router.go({ path: '/home/list', query: { productId: this.query.productId, appId: this.query.appId } });
	    },
	    add: function add() {
	      var _this2 = this;
	
	      this.obj.buildServerClusterId = this.obj.buildServerClusterId;
	      this.obj.nosConfigId = this.obj.nosConfigId;
	
	      service.update(this.obj).then(function (data) {
	        _vue2.default.$alert('设置成功', 'success');
	        _this2.go();
	      });
	    },
	    cancel: function cancel() {
	      this.go();
	    }
	  }
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.get = get;
	exports.update = update;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * 
	 */
	function get(id) {
	  return request.get('/api/clusterConfig/' + id, {});
	} /*
	   * --------------------------------------------
	   * 集群
	   * @version  1.0
	   * @author   shirley(hztanxuewei@corp.netease.com)
	   * --------------------------------------------
	   */
	function update(params) {
	  return request.post('/api/clusterConfig', params);
	}

/***/ },
/* 76 */
/***/ function(module, exports) {

	module.exports = "\n\r\n<div>\r\n  <p class=\"tlt\"><a v-link=\"{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}\">{{ clusterName }}</a>&nbsp;>&nbsp;集群配置</p>\r\n  <form class=\"m-form\">\r\n      <div class=\"fmitem\">\r\n          <label class=\"fmlab\"><i>*</i>应用类型：</label>\r\n          <div class=\"fmcnt\">\r\n              <select class=\"u-ipt\" \r\n                      v-model=\"obj.appType\">\r\n                <option value=\"\">请选择</option>\r\n                <option value=\"{{ key }}\" v-for=\"(key, val) in database.appType\">{{ val }}</option>\r\n              </select>\r\n          </div>\r\n      </div>\r\n      <div class=\"fmitem\">\r\n          <label class=\"fmlab\">构建服务器：</label>\r\n          <div class=\"fmcnt\">\r\n              <select class=\"u-ipt\" v-model=\"obj.buildServerClusterId\">\r\n                <option value=\"\">默认</option>\r\n                <option value=\"{{ item.clusterId }}\" v-for=\"item in database.buildServerCluster\">{{ item.clusterName }}</option>\r\n              </select>\r\n          </div>\r\n      </div>\r\n      <div class=\"fmitem\">\r\n          <label class=\"fmlab\">NOS配置：</label>\r\n          <div class=\"fmcnt\">\r\n              <select class=\"u-ipt\" v-model=\"obj.nosConfigId\">\r\n                <option value=\"\">默认</option>\r\n                <option value=\"{{ item.id }}\" v-for=\"item in database.nosConfig\">{{ item.name }}</option>\r\n              </select>\r\n          </div>\r\n      </div>\r\n      <div class=\"fmitem\">\r\n        <label class=\"fmlab\"></label>\r\n        <div class=\"fmcnt u-btns\">\r\n          <input type=\"button\" \r\n             name=\"submit\" \r\n             class=\"u-btn mb10\" \r\n             value=\"取消\"\r\n             @click=\"cancel\"/>\r\n          <input type=\"button\" \r\n             name=\"submit\" \r\n             class=\"u-btn u-btn-primary\" \r\n             value=\"保存\"\r\n             @click=\"add\"/>\r\n        </div>\r\n      </div>\r\n    </form>\r\n</div>\r\n";

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(78)
	__vue_script__ = __webpack_require__(79)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/config/Build.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(81)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Build.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 78 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _build = __webpack_require__(80);
	
	var service = _interopRequireWildcard(_build);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  data: function data() {
	    return {
	      clusterId: this.$route.query.clusterId,
	      clusterName: '',
	      envList: [],
	      typeList: [],
	      sshkeyList: [],
	
	      isCustom: false,
	      isNEJ: false,
	      check: false,
	
	      obj: {
	        applicationType: '',
	        clusterId: this.$route.query.clusterId,
	
	        envDependency: '',
	
	        repoType: 'git',
	        gitRepo: '',
	        gitBranch: '',
	        gitVersion: '',
	        gitSubfolder: '',
	        sshKeyId: '',
	        sshInfo: '',
	        newSshKeyId: '',
	
	        svnRepo: '',
	        svnVersion: '',
	        svnUsername: '',
	        svnPassword: '',
	
	        buildType: 0,
	        buildXml: '',
	
	        buildXmlDefineMethod: 'AUTO',
	        nejConfig: 0,
	
	        releaseConfPath: '',
	        dependParent: 0,
	        confName: ''
	      }
	    };
	  },
	
	  computed: {},
	  ready: function ready() {
	    this.getBuildList();
	    this.$parent.getClusterName(this.$route.query);
	  },
	
	  watch: {
	    'obj.buildXmlDefineMethod': function objBuildXmlDefineMethod(val, oldVal) {
	      this.isCustom = val == 'CUSTOM' ? true : false;
	    },
	    'obj.nejConfig': function objNejConfig(val, oldVal) {
	      val != 1 && (this.obj.releaseConfPath = '');
	      this.isNEJ = val == 1 ? true : false;
	    }
	  },
	  methods: {
	    getBuildList: function getBuildList() {
	      var _this = this;
	
	      service.getBuildEnv({}).then(function (data) {
	        _this.envList = data.list || [];
	        _this.obj.envDependency = _this.envList[0] ? _this.envList[0] : '';
	      });
	
	      service.getBuildType({ clusterId: this.clusterId }).then(function (data) {
	        _this.typeList = data.list || [];
	        _this.obj.buildType = _this.typeList[0] ? _this.typeList[0] : '';
	      });
	
	      service.getSSHkey({}).then(function (data) {
	        _this.sshkeyList = data.list || [];
	      });
	
	      service.get(this.clusterId).then(function (data) {
	        if (data) {
	          _this.obj = data;
	        }
	        _this.obj.newSshKeyId = '';
	        _this.check = false;
	        _this.$resetValidation();
	      });
	    },
	    go: function go() {
	      this.$router.go({ path: '/home/list', query: { productId: this.$route.query.productId, appId: this.$route.query.appId } });
	    },
	    add: function add() {
	      var _this2 = this;
	
	      this.check = true;
	      if (this.$validation1.invalid) {
	        _vue2.default.$alert('请填写必填项', 'danger');
	        return;
	      }
	
	      if (this.obj.repoType == 'git') {
	
	        if (!this.obj.sshKeyId && !this.obj.newSshKeyId) {
	          _vue2.default.$alert('请选择密钥', 'danger');
	          return;
	        }
	        this.obj.newSshKeyId && (this.obj.sshKeyId = this.obj.newSshKeyId);
	      }
	
	      if (!this.isCustom && this.obj.dependParent == 1 && !this.obj.gitSubfolder) {
	        _vue2.default.$alert('应用子目录不能为空', 'danger');
	        return;
	      }
	      if (!this.isCustom && this.isNEJ && !this.obj.releaseConfPath) {
	        _vue2.default.$alert('release.conf路径不能为空', 'danger');
	        return;
	      }
	      if (this.isCustom && !this.obj.buildXml) {
	        _vue2.default.$alert('选择自定义提交时，内容不能为空', 'danger');
	        return;
	      }
	      service.add(this.obj).then(function (data) {
	        _vue2.default.$alert('设置成功', 'success');
	        _this2.go();
	      });
	    },
	    cancel: function cancel() {
	      this.go();
	    }
	  }
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.get = get;
	exports.add = add;
	exports.del = del;
	exports.getBuildEnv = getBuildEnv;
	exports.getBuildType = getBuildType;
	exports.getSSHkey = getSSHkey;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * 类型
	 */
	function get(clusterId) {
	    return request.get('/api/cluster/config/build/' + clusterId, {});
	} /*
	   * --------------------------------------------
	   * 构建
	   * @version  1.0
	   * @author   shirley(hztanxuewei@corp.netease.com)
	   * --------------------------------------------
	   */
	function add(params) {
	    return request.post('/api/cluster/config/build', params);
	}
	function del(clusterId) {
	    return request.del('/api/cluster/config/build/' + clusterId, params);
	}
	function getBuildEnv(params) {
	    return request.get('/api/cluster/config/build/env', params);
	}
	function getBuildType(params) {
	    return request.get('/api/cluster/config/build/buildtype', params);
	}
	function getSSHkey(params) {
	    return request.get('/api/cluster/config/build/sshkey', params);
	}

/***/ },
/* 81 */
/***/ function(module, exports) {

	module.exports = "\r\n<div>\r\n  <p class=\"tlt\"><a v-link=\"{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}\">{{ clusterName }}</a>&nbsp;>&nbsp;构建配置</p>\r\n  <validator name=\"validation1\" novalidate>\r\n    <form class=\"m-form\">\r\n      <div class=\"fmitem\" v-if=\"obj.applicationType != 'python' && obj.applicationType != 'self_define' && obj.applicationType != 'static_resource'\">\r\n          <label class=\"fmlab\"><i>*</i>依赖环境：</label>\r\n          <div class=\"fmcnt\">\r\n              <select class=\"u-ipt\"\r\n                      v-model=\"obj.envDependency\">\r\n                  <option value=\"{{ item }}\" v-for=\"item in envList\">{{ item }}</option>\r\n              </select>\r\n          </div>\r\n      </div>\r\n      <div class=\"fmitem\">\r\n          <label class=\"fmlab\"><i>*</i>源码管理：</label>\r\n          <div class=\"fmcnt\">\r\n              <div class=\"u-radios\">\r\n                <input type=\"radio\" \r\n                       name=\"repoType\"\r\n                       class=\"u-radio\"\r\n                       value=\"git\"\r\n                       id=\"git\"\r\n                       v-model=\"obj.repoType\"/>\r\n                <label for=\"git\">Git</label>\r\n                <input type=\"radio\" \r\n                       name=\"repoType\"\r\n                       class=\"u-radio\"\r\n                       value=\"svn\"\r\n                       id=\"svn\"\r\n                       v-model=\"obj.repoType\"/>\r\n                <label for=\"svn\">Svn</label>\r\n              </div>\r\n              <template v-if=\"obj.repoType=='git'\">\r\n                <div class=\"fmitem\">\r\n                  <label class=\"fmlab\"><i>*</i>Git仓库：</label>\r\n                  <div class=\"fmcnt\">\r\n                      <input type=\"text\" \r\n                             name=\"name\" \r\n                             class=\"u-ipt u-ipt-mid\"\r\n                             :class=\"{'check': check==true}\"\r\n                             v-validate:gitRepo=\"['required']\"\r\n                             v-model=\"obj.gitRepo\"/>\r\n                  </div>\r\n                </div>\r\n                <div class=\"fmitem\">\r\n                  <label class=\"fmlab\"><i>*</i>Branch：</label>\r\n                  <div class=\"fmcnt\">\r\n                      <input type=\"text\" \r\n                             name=\"name\" \r\n                             class=\"u-ipt\"\r\n                             :class=\"{'check': check==true}\"\r\n                             v-validate:gitBranch=\"['required']\"\r\n                             v-model=\"obj.gitBranch\"/>\r\n                  </div>\r\n                </div>\r\n                <div class=\"fmitem\">\r\n                  <label class=\"fmlab\">Version：</label>\r\n                  <div class=\"fmcnt\">\r\n                      <input type=\"text\" \r\n                             name=\"name\" \r\n                             class=\"u-ipt\"\r\n                             v-model=\"obj.gitVersion\"/>\r\n                  </div>\r\n                </div>\r\n                <div class=\"fmitem\">\r\n                  <label class=\"fmlab\">应用子目录：</label>\r\n                  <div class=\"fmcnt\">\r\n                      <input type=\"text\" \r\n                             name=\"name\" \r\n                             class=\"u-ipt\"\r\n                             v-model=\"obj.gitSubfolder\"/>\r\n                  </div>\r\n                </div>\r\n                <div class=\"fmitem\">\r\n                  <label class=\"fmlab\"><i>*</i>密钥：</label>\r\n                  <div class=\"fmcnt\">\r\n                      <span class=\"mr10\" v-if=\"obj.sshKeyId\">{{ obj.sshInfo }}</span>\r\n                      <select class=\"u-ipt\"\r\n                              v-model=\"obj.newSshKeyId\">\r\n                          <option value=\"\">请选择</option>\r\n                          <option value=\"{{ item.id }}\" v-for=\"item in sshkeyList\">{{ item.name }}</option>\r\n                      </select>\r\n                  </div>\r\n                </div>\r\n              </template>\r\n              <template v-if=\"obj.repoType=='svn'\">\r\n                <div class=\"fmitem\">\r\n                  <label class=\"fmlab\"><i>*</i>Svn仓库：</label>\r\n                  <div class=\"fmcnt\">\r\n                      <input type=\"text\" \r\n                             name=\"name\" \r\n                             class=\"u-ipt u-ipt-mid\"\r\n                             :class=\"{'check': check==true}\"\r\n                             v-validate:svnRepo=\"['required']\"\r\n                             v-model=\"obj.svnRepo\"/>\r\n                  </div>\r\n                </div>\r\n                <div class=\"fmitem\">\r\n                  <label class=\"fmlab\">Version：</label>\r\n                  <div class=\"fmcnt\">\r\n                      <input type=\"text\" \r\n                             name=\"name\" \r\n                             class=\"u-ipt\"\r\n                             v-model=\"obj.svnVersion\"/>\r\n                  </div>\r\n                </div>\r\n                <div class=\"fmitem\">\r\n                  <label class=\"fmlab\">应用子目录：</label>\r\n                  <div class=\"fmcnt\">\r\n                      <input type=\"text\" \r\n                             name=\"name\" \r\n                             class=\"u-ipt\"\r\n                             v-model=\"obj.gitSubfolder\"/>\r\n                  </div>\r\n                </div>\r\n                <div class=\"fmitem\">\r\n                  <label class=\"fmlab\">Username：</label>\r\n                  <div class=\"fmcnt\">\r\n                      <input type=\"text\" \r\n                             name=\"name\" \r\n                             class=\"u-ipt\"\r\n                             v-model=\"obj.svnUsername\"/>\r\n                  </div>\r\n                </div>\r\n                <div class=\"fmitem\">\r\n                  <label class=\"fmlab\">Password：</label>\r\n                  <div class=\"fmcnt\">\r\n                      <input type=\"password\" \r\n                             name=\"name\" \r\n                             class=\"u-ipt\"\r\n                             v-model=\"obj.svnPassword\"/>\r\n                  </div>\r\n                </div>\r\n              </template>\r\n          </div>\r\n      </div>\r\n      <div class=\"fmitem\">\r\n          <label class=\"fmlab\"><i>*</i>构建方式：</label>\r\n          <div class=\"fmcnt\">\r\n              <select class=\"u-ipt\"\r\n                      v-model=\"obj.buildType\">\r\n                  <option value=\"{{ item }}\" v-for=\"item in typeList\">{{ item }}</option>\r\n              </select>\r\n          </div>\r\n      </div>\r\n      <div class=\"fmitem\">\r\n          <label class=\"fmlab\"><i>*</i>build.xml：</label>\r\n          <div class=\"fmcnt\">\r\n              <input type=\"radio\" \r\n                     name=\"buildXml\" \r\n                     value=\"AUTO\"\r\n                     checked\r\n                     v-model=\"obj.buildXmlDefineMethod\"/>自动生成\r\n              <input type=\"radio\" \r\n                     name=\"buildXml\" \r\n                     value=\"CUSTOM\"\r\n                     v-model=\"obj.buildXmlDefineMethod\"/>自定义提交\r\n              <div>\r\n                <textarea \r\n                        class=\"u-ipt u-mid\"\r\n                        :disabled=\"isCustom==false\"\r\n                        v-model=\"obj.buildXml\"\r\n                        placeholder=\"不能为空\"></textarea>\r\n                <p class=\"f-red\" v-if=\"isCustom==false\">自动生成时，文本框不可编辑</p>\r\n              </div>\r\n          </div>\r\n      </div>\r\n      <template v-if=\"obj.applicationType != 'python' && obj.applicationType != 'self_define' && obj.applicationType != 'static_resource'\">\r\n        <template v-if=\"obj.applicationType != 'javaapp'\">\r\n        <div class=\"fmitem\" v-if=\"isCustom==false\">\r\n            <label class=\"fmlab\"><i>*</i>NEJ配置：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"radio\" \r\n                       name=\"nejConfig\" \r\n                       value=\"0\"\r\n                       checked\r\n                       v-model=\"obj.nejConfig\"/>否\r\n                <input type=\"radio\" \r\n                       name=\"nejConfig\" \r\n                       value=\"1\"\r\n                       v-model=\"obj.nejConfig\"/>是\r\n                <div class=\"fmitem\" v-if=\"isNEJ == true\">\r\n                  <label class=\"fmlab\"><i>*</i>release.conf路径：</label>\r\n                  <div class=\"fmcnt\">\r\n                      <input type=\"text\" \r\n                             name=\"name\" \r\n                             class=\"u-ipt\"\r\n                             placeholder=\"不能为空\" \r\n                             v-model=\"obj.releaseConfPath\"/>\r\n                      <span>(如 src/main/webapp/deploy/release.conf)</span>\r\n                  </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\" v-if=\"isCustom==false\">\r\n            <label class=\"fmlab\"><i>*</i>依赖父工程：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"radio\" \r\n                       name=\"dependParent\" \r\n                       value=\"0\"\r\n                       checked\r\n                       v-model=\"obj.dependParent\"/>否\r\n                <input type=\"radio\" \r\n                       name=\"dependParent\" \r\n                       value=\"1\"\r\n                       v-model=\"obj.dependParent\"/>是\r\n            </div>\r\n        </div>\r\n        </template>\r\n        <div class=\"fmitem\" v-if=\"isCustom==false\">\r\n            <label class=\"fmlab\"><i>*</i>conf名称：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"text\" \r\n                       name=\"name\" \r\n                       class=\"u-ipt\"\r\n                       :class=\"{'check': check==true}\"\r\n                       v-validate:confName=\"['required']\"\r\n                       v-model=\"obj.confName\"/>\r\n            </div>\r\n        </div>\r\n      </template>  \r\n      <div class=\"fmitem\">\r\n        <label class=\"fmlab\"></label>\r\n        <div class=\"fmcnt u-btns\">\r\n          <input type=\"button\" \r\n             name=\"submit\" \r\n             class=\"u-btn mb10\" \r\n             value=\"取消\"\r\n             @click=\"cancel\"/>\r\n          <input type=\"button\" \r\n             name=\"submit\" \r\n             class=\"u-btn u-btn-primary\" \r\n             value=\"保存\"\r\n             @click=\"add\"/>\r\n        </div>\r\n      </div>\r\n    </form>\r\n  </validator>\r\n</div>\r\n";

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(83)
	__vue_script__ = __webpack_require__(84)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/config/Publish.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(94)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Publish.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 83 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _defineProperty2 = __webpack_require__(85);
	
	var _defineProperty3 = _interopRequireDefault(_defineProperty2);
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _util = __webpack_require__(66);
	
	var _util2 = _interopRequireDefault(_util);
	
	var _publish = __webpack_require__(93);
	
	var service = _interopRequireWildcard(_publish);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { modal: _Modal2.default },
	  data: function data() {
	    var _ref;
	
	    return _ref = {
	      id: '',
	      clusterName: '',
	      instanceList: []
	    }, (0, _defineProperty3.default)(_ref, 'clusterName', ''), (0, _defineProperty3.default)(_ref, 'clusterId', this.$route.query.clusterId), (0, _defineProperty3.default)(_ref, 'showModal', false), (0, _defineProperty3.default)(_ref, 'showDelModal', false), (0, _defineProperty3.default)(_ref, 'showDelTpl', false), (0, _defineProperty3.default)(_ref, 'delType', 1), (0, _defineProperty3.default)(_ref, 'templateId', ''), (0, _defineProperty3.default)(_ref, 'templates', []), (0, _defineProperty3.default)(_ref, 'curTpl', {}), (0, _defineProperty3.default)(_ref, 'baseSoftwareConfigs', []), (0, _defineProperty3.default)(_ref, 'replaceBaseSoftwareConfigs', []), (0, _defineProperty3.default)(_ref, 'baseLength', 0), (0, _defineProperty3.default)(_ref, 'statusMap', ['disable', 'enable']), (0, _defineProperty3.default)(_ref, 'obj', this.initObj()), (0, _defineProperty3.default)(_ref, 'sourceActions', this.actionsObj()), (0, _defineProperty3.default)(_ref, 'replaceActions', this.actionsObj()), (0, _defineProperty3.default)(_ref, 'templateType', '1'), (0, _defineProperty3.default)(_ref, 'onAddTplFlag', false), _ref;
	  },
	  ready: function ready() {
	    this.getList();
	    this.$parent.getClusterName(this.$route.query);
	  },
	
	  watch: {
	    'templateType': function templateType(val, oldVal) {
	      switch (val) {
	        case '1':
	          break;
	        case '2':
	          break;
	      }
	    }
	  },
	  methods: {
	    initObj: function initObj() {
	      return {
	        clusterId: +this.$route.query.clusterId,
	
	        instanceName: '',
	        sourceTemplateId: '',
	        status: 1,
	        deployUser: '',
	        checkUrl: '',
	        onlineUrl: '',
	        offlineUrl: '',
	        statusUrl: '',
	        port: '',
	
	        sourcePlaceholders: [],
	        sourceTemplate: {
	          id: '',
	          name: '',
	          actions: [],
	          baseSoftwareConfigList: []
	        },
	        replaceTemplateId: '',
	        replacePlaceholders: [],
	        replaceTemplate: {
	          id: '',
	          name: '',
	          actions: [],
	          baseSoftwareConfigList: []
	        }
	      };
	    },
	    actionsObj: function actionsObj() {
	      return {
	        deploy: '',
	        restart: '',
	        stop: '',
	        online: '',
	        offline: ''
	      };
	    },
	    getList: function getList() {
	      var _this = this;
	
	      service.getList(this.clusterId).then(function (data) {
	        _this.instanceList = data.list || [];
	      });
	    },
	    getClusterConfig: function getClusterConfig() {
	      var _this2 = this;
	
	      service.getClusterConfig(this.clusterId).then(function (data) {
	        _this2.templates = data.templates || [];
	      });
	    },
	    add: function add() {
	      this.id = '';
	      this.templateType = 0;
	      this.templateId = '';
	      this.obj = this.initObj();
	      this.sourceActions = this.actionsObj(), this.baseSoftwareConfigs = [];
	      this.getClusterConfig();
	      this.showModal = true;
	    },
	    handleActions: function handleActions(obj) {
	      var arr = [];
	      for (var key in obj) {
	        arr.push({
	          actionType: key,
	          parameter: obj[key]
	        });
	      }
	      return arr;
	    },
	    unHandleActions: function unHandleActions(list) {
	      var obj = {};
	      list.forEach(function (item) {
	        item.actionType && (obj[item.actionType] = item.parameter);
	      });
	      return obj;
	    },
	    handlePlaceholders: function handlePlaceholders(configs, placeholders) {
	      var tempList = [];
	      configs.forEach(function (item) {
	        tempList = tempList.concat(item.baseSoftwareConfig.placeholderList);
	      });
	      this.obj[placeholders] = tempList;
	
	      for (var j = 0, len = tempList.length; j < len; j++) {
	        var item = tempList[j];
	        item.placeholderName = item.placeholderName || item.name;
	        if (item.mandatory && !item.adoptDefault && !item.placeholderValue) {
	          return;
	        }
	      }
	      return true;
	    },
	    renderTpl: function renderTpl(configs, list) {
	      configs.forEach(function (item) {
	        item.baseSoftwareConfig = item;
	        item.baseSoftwareConfig.placeholderList = _util2.default.findInArr(list, 'baseSoftwareConfigId', item.id);
	      });
	      return configs;
	    },
	    edit: function edit(id) {
	      var _this3 = this;
	
	      var self = this;
	      this.id = id;
	      this.templateId = '';
	      this.showModal = true;
	
	      service.get({
	        instanceId: id,
	        clusterId: this.clusterId
	      }).then(function (data) {
	        self.templateType = '1';
	        self.obj = data;
	        self.baseSoftwareConfigs = self.obj.sourceTemplate ? self.obj.sourceTemplate.baseSoftwareConfigList : [];
	        self.replaceBaseSoftwareConfigs = self.obj.replaceTemplate ? self.obj.replaceTemplate.baseSoftwareConfigList : [];
	        data.sourcePlaceholders && (self.baseSoftwareConfigs = self.renderTpl(self.baseSoftwareConfigs, data.sourcePlaceholders));
	        data.replacePlaceholders && (self.replaceBaseSoftwareConfigs = self.renderTpl(self.replaceBaseSoftwareConfigs, data.replacePlaceholders));
	        _this3.sourceActions = self.unHandleActions(self.obj.sourceTemplate.actions || []);
	      });
	    },
	    changeTpl: function changeTpl(id) {
	      this.templateId = id;
	      this.curTpl = _util2.default.findInMap(this.templates, 'id', id);
	      if (this.templateType == '2') {
	        this.replaceBaseSoftwareConfigs = this.curTpl ? this.curTpl.templateSoftwareList : [];
	      } else {
	        this.baseSoftwareConfigs = this.curTpl.templateSoftwareList;
	      }
	    },
	    doSubmit: function doSubmit() {
	      var _this4 = this;
	
	      if (!this.handlePlaceholders(this.baseSoftwareConfigs, 'sourcePlaceholders')) {
	        _vue2.default.$alert('如果占位符不是必填，必须要设置默认值', 'danger');
	        return;
	      }
	
	      this.obj.sourceTemplate.actions = this.handleActions(this.sourceActions);
	
	
	      if (!!this.id) {
	
	        service.edit(this.obj).then(function (data) {
	          _vue2.default.$alert('修改成功', 'success');
	          _this4.showModal = false;
	          _this4.getList();
	        });
	      } else {
	
	        service.add(this.obj).then(function (data) {
	          _vue2.default.$alert('添加成功', 'success');
	          _this4.showModal = false;
	          _this4.getList();
	        });
	      }
	    },
	    onDel: function onDel(id) {
	      this.id = id;
	      this.showDelModal = true;
	    },
	    doDel: function doDel() {
	      var _this5 = this;
	
	      service.del({
	        instanceId: this.id,
	        clusterId: this.clusterId
	      }).then(function (data) {
	        _vue2.default.$alert('删除实例成功', 'success');
	        _this5.showDelModal = false;
	        _this5.getList();
	      });
	    },
	    onAddReplaceTpl: function onAddReplaceTpl() {
	      this.getClusterConfig();
	      this.obj.replaceTemplateId = '';
	      this.onAddTplFlag = true;
	    },
	    doAddReplaceTpl: function doAddReplaceTpl() {
	      var _this6 = this;
	
	      if (!this.handlePlaceholders(this.replaceBaseSoftwareConfigs, 'replacePlaceholders')) {
	        _vue2.default.$alert('所有占位符必须要设置默认值', 'danger');
	        return;
	      }
	      this.obj.replaceTemplate = {
	        actions: this.handleActions(this.replaceActions)
	      };
	      service.addReplaceTpl(this.obj).then(function (data) {
	        _vue2.default.$alert('添加变更模板成功', 'success');
	        _this6.showModal = false;
	      });
	    },
	    onDelSourceTpl: function onDelSourceTpl() {
	      this.delType = 1;
	      this.showDelTpl = true;
	    },
	    doDelSourceTpl: function doDelSourceTpl() {
	      service.delSouceTpl({
	        instanceId: this.id,
	        clusterId: this.clusterId
	      }).then(function (data) {
	        _vue2.default.$alert('删除原模板成功', 'success');
	      });
	    },
	    onDelReplaceTpl: function onDelReplaceTpl() {
	      this.delType = 2;
	      this.showDelTpl = true;
	    },
	    doDelReplaceTpl: function doDelReplaceTpl() {
	      service.delReplaceTpl({
	        instanceId: this.id,
	        clusterId: this.clusterId
	      }).then(function (data) {
	        _vue2.default.$alert('删除变更模板成功', 'success');
	      });
	    }
	  }
	};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(86);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
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
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(87), __esModule: true };

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(88);
	var $Object = __webpack_require__(34).Object;
	module.exports = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $export = __webpack_require__(32);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(42), 'Object', { defineProperty: __webpack_require__(38).f });

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(90)
	__vue_script__ = __webpack_require__(91)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Modal.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(92)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Modal.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 90 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 91 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  props: {
	    show: {
	      type: Boolean,
	      required: true,
	      twoWay: true
	    },
	    submit: {
	      type: Function,
	      default: function _default() {
	        this.show = false;
	      }
	    },
	    modalclazz: {
	      type: String,
	      default: ''
	    },
	    bottomBar: {
	      type: Boolean,
	      default: true
	    }
	  }
	};

/***/ },
/* 92 */
/***/ function(module, exports) {

	module.exports = "\n <div class=\"modal-mask\" v-show=\"show\" transition=\"modal\">\n  <div class=\"modal-wrapper\">\n    <div class=\"modal-container\" :class=\"modalclazz\">\n\n      <div class=\"modal-header\">\n        <i class=\"iconfont icon-del-2\" @click=\"show = false\"></i>\n        <slot name=\"header\">\n          default header\n        </slot>\n      </div>\n      \n      <div class=\"modal-body\">\n        <slot name=\"body\">\n          default body\n        </slot>\n      </div>\n\n      <div class=\"modal-footer u-btns\" v-if=\"bottomBar\">\n        <slot name=\"footer\">\n          <button class=\"u-btn\"\n            @click=\"show = false\">\n            取消\n          </button>\n          <button class=\"u-btn u-btn-primary\"\n            @click=\"submit\">\n            确定\n          </button>\n        </slot>\n      </div>\n    </div>\n  </div>\n</div>\n";

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getList = getList;
	exports.getClusterConfig = getClusterConfig;
	exports.add = add;
	exports.del = del;
	exports.get = get;
	exports.edit = edit;
	exports.addReplaceTpl = addReplaceTpl;
	exports.delReplaceTpl = delReplaceTpl;
	exports.delSouceTpl = delSouceTpl;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * 类型
	 */
	function getList(clusterId) {
	    return request.get('/api/instanceConfig/listInstance/' + clusterId, {});
	} /*
	   * --------------------------------------------
	   * 发布
	   * @version  1.0
	   * @author   shirley(hztanxuewei@corp.netease.com)
	   * --------------------------------------------
	   */
	function getClusterConfig(clusterId) {
	    return request.get('/api/instanceConfig/getInstanceRelatedParam/' + clusterId, {});
	}
	
	function add(params) {
	    return request.post('/api/instanceConfig/addInstance', params);
	}
	
	function del(params) {
	    return request.del('/api/instanceConfig/deleteInstance', params);
	}
	
	function get(params) {
	    return request.get('/api/instanceConfig/getInstance', params);
	}
	
	function edit(params) {
	    return request.put('/api/instanceConfig/updateInstance', params);
	}
	/*
	 * 变更模板相关
	 */
	function addReplaceTpl(params) {
	    return request.post('/api/instanceConfig/addReplaceTemplate', params);
	}
	
	function delReplaceTpl(params) {
	    return request.del('/api/instanceConfig/deleteReplaceTemplate', params);
	}
	
	function delSouceTpl(params) {
	    return request.del('/api/instanceConfig/deleteSourceTemplate', params);
	}

/***/ },
/* 94 */
/***/ function(module, exports) {

	module.exports = "\r\n<div>\r\n  <p class=\"tlt\"><a v-link=\"{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}\">{{ clusterName }}</a>&nbsp;>&nbsp;发布配置</p>\r\n  <input type=\"button\" \r\n           name=\"submit\" \r\n           class=\"u-btn u-btn-primary mb10\" \r\n           value=\"增加实例\"\r\n           @click=\"add\"/>\r\n    <table class=\"m-table\">\r\n        <thead>\r\n            <tr>\r\n                <th>实例</th>\r\n                <th>状态</th>\r\n                <th>创建时间</th>\r\n                <th>操作</th>\r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n            <tr v-for=\"instance in instanceList\">\r\n                <td>{{ instance.instanceName }}</td>\r\n                <td>{{ statusMap[instance.status] }}</td>\r\n                <td>{{ instance.createTime | moment \"YYYY-MM-DD HH:mm:ss\" }}</td>\r\n                <td>\r\n                    <i class=\"iconfont icon-edit\" @click=\"edit(instance.id)\" title=\"配置\"></i>\r\n                    <i class=\"iconfont icon-del\" @click=\"onDel(instance.id)\" title=\"删除\" style=\"margin-left: 5px;\"></i>\r\n                </td>\r\n            </tr>\r\n        </tbody>\r\n    </table>\r\n</div>\r\n<modal :show.sync=\"showModal\" :submit=\"doSubmit\" :modalclazz=\"'modal-large'\">\r\n    <h3 slot=\"header\">{{ id?'修改':'添加'}}实例</h3>\r\n    <div slot=\"body\">\r\n      <validator name=\"validation1\">\r\n      <form class=\"m-form\" novalidate>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\"><i>*</i>实例名称：</label>\r\n            <div class=\"fmcnt\">\r\n                <template v-if=\"!id\">\r\n                    <input type=\"text\" \r\n                       name=\"\" \r\n                       class=\"u-ipt\"\r\n                       :class=\"{'check': check==true}\"\r\n                       v-model=\"obj.instanceName\"\r\n                       v-validate:instanceName=\"['required']\"/>\r\n                </template>\r\n                <p v-else>{{ obj.instanceName }}</p>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">状态：</label>\r\n            <div class=\"fmcnt\">\r\n                <select class=\"u-ipt\"\r\n                        v-model=\"obj.status\">\r\n                    <option value=\"1\">enable</option>\r\n                    <option value=\"0\">disable</option>\r\n                </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\"><i>*</i>发布账号：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"text\" \r\n                       name=\"\" \r\n                       class=\"u-ipt\"\r\n                       :class=\"{'check': check==true}\"\r\n                       v-model=\"obj.deployUser\"\r\n                       v-validate:deployUser=\"['required']\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">check_url：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"text\" \r\n                       name=\"\" \r\n                       class=\"u-ipt\"\r\n                       v-model=\"obj.checkUrl\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">online_url：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"text\" \r\n                       name=\"\" \r\n                       class=\"u-ipt\"\r\n                       v-model=\"obj.onlineUrl\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">offline_url：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"text\" \r\n                       name=\"\" \r\n                       class=\"u-ipt\"\r\n                       v-model=\"obj.offlineUrl\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">status_url：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"text\" \r\n                       name=\"\" \r\n                       class=\"u-ipt\"\r\n                       v-model=\"obj.statusUrl\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">端口：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"text\" \r\n                       name=\"\" \r\n                       class=\"u-ipt\"\r\n                       v-model=\"obj.port\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\" v-if=\"id\">\r\n            <label class=\"fmlab\"><i>*</i>模板类型：</label>\r\n            <div class=\"fmcnt\">\r\n              <input type=\"radio\" v-model=\"templateType\" name=\"type\" value=\"1\"/>原模板\r\n              <input type=\"radio\" v-model=\"templateType\" name=\"type\" value=\"2\"/>变更模板\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\" v-if=\"!id\">\r\n            <label class=\"fmlab\"><i>*</i>模板：</label>\r\n            <div class=\"fmcnt\">\r\n              <select v-model=\"obj.sourceTemplateId\"\r\n                      v-if=\"!id\"\r\n                      @change=\"changeTpl(obj.sourceTemplateId)\">\r\n                <option value=\"\">请选择</option>\r\n                <option value=\"{{ item.id }}\" v-for=\"item in templates\">{{ item.name }}</option>\r\n              </select>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\" v-if=\"id\">\r\n            <label class=\"fmlab\"><i>*</i>模板：</label>\r\n            <div class=\"fmcnt\">\r\n                <template v-if=\"templateType==1\">\r\n                    <p>\r\n                        {{ obj.sourceTemplate.name }}\r\n                        <i class=\"iconfont icon-del-2\"\r\n                           v-if=\"obj.replaceTemplate\"\r\n                           @click=\"onDelSourceTpl\"></i>\r\n                    </p>\r\n                </template>\r\n                <template v-if=\"templateType==2\">\r\n                    <p v-if=\"obj.replaceTemplate && obj.replaceTemplate.id\">\r\n                        {{ obj.replaceTemplate.name }}\r\n                        <i class=\"iconfont icon-del-2\"\r\n                           v-if=\"obj.sourceTemplate\"\r\n                           @click=\"onDelReplaceTpl\"></i>\r\n                    </p>\r\n                    <p else>\r\n                        <span class=\"u-btn u-btn-primary\"\r\n                              v-if=\"!onAddTplFlag\" \r\n                              @click=\"onAddReplaceTpl\">添加</span>\r\n                    </p>\r\n                    <select v-model=\"obj.replaceTemplateId\"\r\n                            v-if=\"onAddTplFlag\"\r\n                            @change=\"changeTpl(obj.replaceTemplateId)\">\r\n                        <option value=\"\">请选择</option>\r\n                        <option value=\"{{ item.id }}\" v-for=\"item in templates\">{{ item.name }}</option>\r\n                    </select>\r\n                    <span v-if=\"onAddTplFlag\" class=\"u-btn u-btn-primary ml30\" @click=\"doAddReplaceTpl\">保存</span>\r\n                    <span v-if=\"onAddTplFlag\" class=\"f-red\">保存后才能生效</span>\r\n                </template>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\" \r\n            v-for=\"item in (templateType==2?replaceBaseSoftwareConfigs:baseSoftwareConfigs)\">\r\n            <label class=\"fmlab\">{{ item.baseSoftwareConfig.name }}：</label>\r\n            <div class=\"fmcnt\">\r\n                <div class=\"m-form\">\r\n                    <div class=\"fmitem\">\r\n                        <label class=\"fmlab\">描述：</label>\r\n                        <div class=\"fmcnt\">\r\n                            {{ item.baseSoftwareConfig.descp }}\r\n                        </div>\r\n                    </div>\r\n                    <div class=\"fmitem\">\r\n                        <label class=\"fmlab\">占位符：</label>\r\n                        <div class=\"fmcnt\">\r\n                            <table class=\"m-table\">\r\n                              <thead>\r\n                                  <tr>\r\n                                      <th>占位符</th>\r\n                                      <th>类型</th>\r\n                                      <th>是否唯一</th>\r\n                                      <th>是否必填</th>\r\n                                      <th>是否默认</th>\r\n                                      <th>值</th>\r\n                                  </tr>\r\n                              </thead>\r\n                              <tbody>\r\n                                  <tr v-for=\"val in item.baseSoftwareConfig.placeholderList\">\r\n                                      <td>{{ val.name || val.placeholderName }}</td>\r\n                                      <td>{{ val.dataType }}</td>\r\n                                      <td>{{ val.instanceUnique==true?'是':'否' }}</td>\r\n                                      <td>{{ val.mandatory==true?'是':'否' }}</td>\r\n                                      <td>\r\n                                          <input type=\"checkbox\" \r\n                                                 value=\"{{ val.adoptDefault }}\" \r\n                                                 :disabled=\"!val.defaultValue\"\r\n                                                 v-model=\"val.adoptDefault\"/>默认\r\n                                      </td>\r\n                                      <td>\r\n                                          <input class=\"u-ipt u-ipt-auto\" \r\n                                                 value=\"{{ !val.defaultValue?val.placeholderValue:(val.adoptDefault==true?val.defaultValue:val.placeholderValue) }}\"\r\n                                                 :disabled=\"val.adoptDefault==true\" \r\n                                                 v-model=\"val.placeholderValue\"/>\r\n                                      </td>\r\n                                  </tr>\r\n                              </tbody>\r\n                          </table>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\" v-if=\"(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId\">\r\n            <label class=\"fmlab\">发布的动作：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"text\" \r\n                       name=\"\" \r\n                       class=\"u-ipt\"\r\n                       v-model=\"sourceActions.deploy\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\" v-if=\"(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId\">\r\n            <label class=\"fmlab\">重启的动作：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"text\" \r\n                       name=\"\" \r\n                       class=\"u-ipt\"\r\n                       v-model=\"sourceActions.restart\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\" v-if=\"(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId\">\r\n            <label class=\"fmlab\">停止容器的动作：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"text\" \r\n                       name=\"\" \r\n                       class=\"u-ipt\"\r\n                       v-model=\"sourceActions.stop\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\" v-if=\"(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId\">\r\n            <label class=\"fmlab\">上线的动作：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"text\" \r\n                       name=\"\" \r\n                       class=\"u-ipt\"\r\n                       v-model=\"sourceActions.online\"/>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\" v-if=\"(templateType==1 &&obj.sourceTemplate) || (templateType==2 && obj.replaceTemplate) || templateId\">\r\n            <label class=\"fmlab\">下线的动作：</label>\r\n            <div class=\"fmcnt\">\r\n                <input type=\"text\" \r\n                       name=\"\" \r\n                       class=\"u-ipt\"\r\n                       v-model=\"sourceActions.offline\"/>\r\n            </div>\r\n        </div>\r\n        <!-- <div class=\"fmitem\" v-if=\"baseLength==0\">\r\n            <label class=\"fmlab\">基础配件：</label>\r\n            <div class=\"fmcnt\">\r\n                无\r\n            </div>\r\n        </div> -->\r\n      </form>\r\n      </validator>\r\n    </div>\r\n  </modal>\r\n  <modal :show.sync=\"showDelModal\" :submit=\"doDel\">\r\n    <h3 slot=\"header\">删除实例</h3>\r\n    <div slot=\"body\">\r\n      <p class=\"tip\"><i class=\"iconfont icon-tip\"></i>确定删除该实例么？</p>\r\n    </div>\r\n  </modal>\r\n  <modal :show.sync=\"showDelTpl\" :submit=\"delType==1?doDelSourceTpl:doDelReplaceTpl\">\r\n    <h3 slot=\"header\">删除模板</h3>\r\n    <div slot=\"body\">\r\n      <p class=\"tip\"><i class=\"iconfont icon-tip\"></i>确定删除该模板么？</p>\r\n    </div>\r\n  </modal>\r\n";

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(96)
	__vue_script__ = __webpack_require__(97)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/config/Auth.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(108)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Auth.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 96 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _select = __webpack_require__(98);
	
	var _select2 = _interopRequireDefault(_select);
	
	var _auth = __webpack_require__(106);
	
	var service = _interopRequireWildcard(_auth);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { select2: _select2.default },
	  data: function data() {
	    return {
	      query: this.$route.query,
	      clusterId: this.$route.query.clusterId,
	      clusterName: '',
	      result: {
	        clusterOwners: [],
	        appOwners: [],
	        productOwners: [],
	        clusterDeployers: [],
	        appDeployers: [],
	        peMaster: [],
	        peSlave: [],
	        peExpert: [],
	        qa: []
	      }
	    };
	  },
	  ready: function ready() {
	    this.getPersonInCharge();
	    this.$parent.getClusterName(this.query);
	  },
	
	  methods: {
	    getPersonInCharge: function getPersonInCharge() {
	      var _this = this;
	
	      service.getPersonInCharge(this.clusterId).then(function (data) {
	        _this.result = data || {};
	        for (var key in data) {
	          if (data[key].length == 0) {
	            _this.result[key].push({ userName: '无' });
	          }
	        }
	      });
	    },
	    go: function go() {
	      this.$router.go({ path: '/home/list', query: { productId: this.query.productId, appId: this.query.appId } });
	    },
	    add: function add() {
	      var _this2 = this;
	
	      service.update(this.obj).then(function (data) {
	
	        _this2.go();
	      });
	    },
	    cancel: function cancel() {
	      this.go();
	    }
	  }
	};

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(99)
	__vue_script__ = __webpack_require__(100)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/select2.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(107)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./select2.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 99 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Dropdown = __webpack_require__(101);
	
	var _Dropdown2 = _interopRequireDefault(_Dropdown);
	
	var _auth = __webpack_require__(106);
	
	var service = _interopRequireWildcard(_auth);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { dropdown: _Dropdown2.default },
	  props: {},
	  data: function data() {
	    return {
	      value: ''
	    };
	  },
	  ready: function ready() {},
	
	  methods: {
	    search: function search() {
	      service.searchUser({
	        word: this.value
	      }).then(function (data) {});
	    }
	  }
	};

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(102)
	__vue_script__ = __webpack_require__(103)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Dropdown.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(105)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Dropdown.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 102 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _coerceBoolean = __webpack_require__(16);
	
	var _coerceBoolean2 = _interopRequireDefault(_coerceBoolean);
	
	var _NodeList = __webpack_require__(104);
	
	var _NodeList2 = _interopRequireDefault(_NodeList);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  props: {
	    show: {
	      twoWay: true,
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: false
	    },
	    'class': null,
	    disabled: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: false
	    },
	    text: {
	      type: String,
	      default: null
	    },
	    type: {
	      type: String,
	      default: null
	    }
	  },
	  computed: {
	    classes: function classes() {
	      return [{ open: this.show, disabled: this.disabled }, this.class];
	    },
	    menu: function menu() {
	      return !this.$parent || this.$parent.navbar;
	    },
	    submenu: function submenu() {
	      return this.$parent && (this.$parent.menu || this.$parent.submenu);
	    },
	    slots: function slots() {
	      return this._slotContents;
	    }
	  },
	  methods: {
	    blur: function blur() {
	      var _this = this;
	
	      this.unblur();
	      this._hide = setTimeout(function () {
	        _this._hide = null;
	        _this.show = false;
	      }, 100);
	    },
	    unblur: function unblur() {
	      if (this._hide) {
	        clearTimeout(this._hide);
	        this._hide = null;
	      }
	    }
	  },
	  ready: function ready() {
	    var _this2 = this;
	
	    var $el = (0, _NodeList2.default)(this.$els.dropdown);
	    $el.onBlur(function (e) {
	      _this2.show = false;
	    });
	    $el.findChildren('a,button').on('click', function (e) {
	      e.preventDefault();
	      if (_this2.disabled) {
	        return false;
	      }
	      _this2.show = !_this2.show;
	      return false;
	    });
	    $el.findChildren('ul').on('click', 'li>a', function (e) {
	      _this2.show = false;
	    });
	  },
	  beforeDestroy: function beforeDestroy() {
	    var $el = (0, _NodeList2.default)(this.$els.dropdown);
	    $el.offBlur();
	    $el.findChildren('a,button').off();
	    $el.findChildren('ul').off();
	  }
	};

/***/ },
/* 104 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ArrayProto = Array.prototype;
	var nodeError = new Error('Passed arguments must be of Node');
	var blurEvent = void 0;
	var blurList = [];
	var Events = [];
	
	var NodeList = function () {
	  function NodeList(args) {
	    _classCallCheck(this, NodeList);
	
	    var i = 0,
	        l,
	        nodes = args;
	    if (args[0] === window) {
	      nodes = [window];
	    } else if (typeof args[0] === 'string') {
	      nodes = (args[1] || document).querySelectorAll(args[0]);
	      if (args[1]) {
	        this.owner = args[1];
	      }
	    } else if (0 in args && !(args[0] instanceof Node) && args[0] && 'length' in args[0]) {
	      nodes = args[0];
	      if (args[1]) {
	        this.owner = args[1];
	      }
	    }
	    if (nodes) {
	      for (var _i in nodes) {
	        this[_i] = nodes[_i];
	      }
	      this.length = nodes.length;
	    } else {
	      this.length = 0;
	    }
	  }
	
	  _createClass(NodeList, [{
	    key: 'concat',
	    value: function concat() {
	      var nodes = ArrayProto.slice.call(this);
	      function flatten(arr) {
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	          for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var el = _step.value;
	
	            if (el instanceof Node) {
	              if (!~nodes.indexOf(el)) nodes.push(el);
	            } else if (el) {
	              flatten(el);
	            }
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = arguments[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          var arg = _step2.value;
	
	          if (arg instanceof Node) {
	            if (!~nodes.indexOf(arg)) nodes.push(arg);
	          } else if (arg instanceof window.NodeList || arg instanceof NodeList || arg instanceof HTMLCollection || arg instanceof Array) {
	            flatten(arg);
	          } else {
	            throw Error('Concat arguments must be of a Node, NodeList, HTMLCollection, or Array of (Node, NodeList, HTMLCollection, Array)');
	          }
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2.return) {
	            _iterator2.return();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	
	      return new NodeList([nodes, this]);
	    }
	  }, {
	    key: 'each',
	    value: function each() {
	      ArrayProto.forEach.apply(this, arguments);
	      return this;
	    }
	  }, {
	    key: 'parent',
	    value: function parent() {
	      return this.map(function (el) {
	        return el.parentNode;
	      });
	    }
	  }, {
	    key: 'filter',
	    value: function filter() {
	      return new NodeList([ArrayProto.filter.apply(this, arguments), this]);
	    }
	  }, {
	    key: 'find',
	    value: function find(element) {
	      var nodes = [];
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;
	
	      try {
	        for (var _iterator3 = flatten(this)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var el = _step3.value;
	
	          var node = el.querySelectorAll(element);
	          if (node && node.length) nodes.push(node);
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
	          }
	        }
	      }
	
	      return flatten(nodes, this.owner);
	    }
	  }, {
	    key: 'findChildren',
	    value: function findChildren(element) {
	      var _this = this;
	
	      return this.find(element).filter(function (el) {
	        return _this.includes(el.parentElement);
	      });
	    }
	  }, {
	    key: 'forEach',
	    value: function forEach() {
	      ArrayProto.forEach.apply(this, arguments);
	      return this;
	    }
	  }, {
	    key: 'includes',
	    value: function includes(element, index) {
	      return ~this.indexOf(element, index);
	    }
	  }, {
	    key: 'map',
	    value: function map() {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	
	      return flatten(ArrayProto.map.apply(this, args), this);
	    }
	  }, {
	    key: 'pop',
	    value: function pop(amount) {
	      if (typeof amount !== 'number') {
	        amount = 1;
	      }
	      var nodes = [];
	      var pop = ArrayProto.pop.bind(this);
	      while (amount--) {
	        nodes.push(pop());
	      }return new NodeList([nodes, this]);
	    }
	  }, {
	    key: 'push',
	    value: function push() {
	      var _iteratorNormalCompletion4 = true;
	      var _didIteratorError4 = false;
	      var _iteratorError4 = undefined;
	
	      try {
	        for (var _iterator4 = arguments[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	          var arg = _step4.value;
	
	          if (!(arg instanceof Node)) throw nodeError;
	          if (!~this.indexOf(arg)) ArrayProto.push.call(this, arg);
	        }
	      } catch (err) {
	        _didIteratorError4 = true;
	        _iteratorError4 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion4 && _iterator4.return) {
	            _iterator4.return();
	          }
	        } finally {
	          if (_didIteratorError4) {
	            throw _iteratorError4;
	          }
	        }
	      }
	
	      return this;
	    }
	  }, {
	    key: 'delete',
	    value: function _delete() {
	      var list = new NodeList([[], this.owner]);
	      var splice = function splice(index) {
	        return ArrayProto.splice.apply();
	      };
	      var i = this.length - 1;
	      for (var el = this[i]; el; el = this[--i]) {
	        if (el.remove) {
	          el.remove();
	          ArrayProto.splice.call(this, i, 1);
	        } else if (el.parentNode) {
	          el.parentNode.removeChild(el);
	          ArrayProto.splice.call(this, i, 1);
	        }
	      }
	      return this;
	    }
	  }, {
	    key: 'shift',
	    value: function shift(amount) {
	      if (typeof amount !== 'number') {
	        amount = 1;
	      }
	      var nodes = [];
	      var shift = ArrayProto.shift.bind(this);
	      while (amount--) {
	        nodes.push(shift());
	      }return new NodeList([nodes, this]);
	    }
	  }, {
	    key: 'slice',
	    value: function slice() {
	      return new NodeList([ArrayProto.slice.apply(this, arguments), this]);
	    }
	  }, {
	    key: 'splice',
	    value: function splice() {
	      for (var i = 2, l = arguments.length; i < l; i++) {
	        if (!(arguments[i] instanceof Node)) throw nodeError;
	      }
	      return new NodeList([ArrayProto.splice.apply(this, arguments), this]);
	    }
	  }, {
	    key: 'unshift',
	    value: function unshift() {
	      var unshift = ArrayProto.unshift.bind(this);
	      var _iteratorNormalCompletion5 = true;
	      var _didIteratorError5 = false;
	      var _iteratorError5 = undefined;
	
	      try {
	        for (var _iterator5 = arguments[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	          var arg = _step5.value;
	
	          if (!(arg instanceof Node)) throw nodeError;
	          if (!~this.indexOf(arg)) unshift(arg);
	        }
	      } catch (err) {
	        _didIteratorError5 = true;
	        _iteratorError5 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion5 && _iterator5.return) {
	            _iterator5.return();
	          }
	        } finally {
	          if (_didIteratorError5) {
	            throw _iteratorError5;
	          }
	        }
	      }
	
	      return this;
	    }
	  }, {
	    key: 'addClass',
	    value: function addClass(classes) {
	      return this.toggleClass(classes, true);
	    }
	  }, {
	    key: 'removeClass',
	    value: function removeClass(classes) {
	      return this.toggleClass(classes, false);
	    }
	  }, {
	    key: 'toggleClass',
	    value: function toggleClass(classes, value) {
	      var _this2 = this;
	
	      var method = value === undefined || value === null ? 'toggle' : value ? 'add' : 'remove';
	      if (typeof classes === 'string') {
	        classes = classes.trim().replace(/\s+/, ' ').split(' ');
	      }
	      classes.forEach(function (c) {
	        return _this2.each(function (el) {
	          return el.classList[method](c);
	        });
	      });
	      return this;
	    }
	  }, {
	    key: 'get',
	    value: function get(prop) {
	      var arr = [];
	      var _iteratorNormalCompletion6 = true;
	      var _didIteratorError6 = false;
	      var _iteratorError6 = undefined;
	
	      try {
	        for (var _iterator6 = this[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	          var el = _step6.value;
	
	          if (el !== null) {
	            el = el[prop];
	          }
	          arr.push(el);
	        }
	      } catch (err) {
	        _didIteratorError6 = true;
	        _iteratorError6 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion6 && _iterator6.return) {
	            _iterator6.return();
	          }
	        } finally {
	          if (_didIteratorError6) {
	            throw _iteratorError6;
	          }
	        }
	      }
	
	      return flatten(arr, this);
	    }
	  }, {
	    key: 'set',
	    value: function set(prop, value) {
	      if (prop.constructor === Object) {
	        var _iteratorNormalCompletion7 = true;
	        var _didIteratorError7 = false;
	        var _iteratorError7 = undefined;
	
	        try {
	          for (var _iterator7 = this[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	            var el = _step7.value;
	
	            if (el) {
	              for (key in prop) {
	                if (key in el) {
	                  el[key] = prop[key];
	                }
	              }
	            }
	          }
	        } catch (err) {
	          _didIteratorError7 = true;
	          _iteratorError7 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion7 && _iterator7.return) {
	              _iterator7.return();
	            }
	          } finally {
	            if (_didIteratorError7) {
	              throw _iteratorError7;
	            }
	          }
	        }
	      } else {
	        var _iteratorNormalCompletion8 = true;
	        var _didIteratorError8 = false;
	        var _iteratorError8 = undefined;
	
	        try {
	          for (var _iterator8 = this[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	            var _el = _step8.value;
	
	            if (prop in _el) {
	              _el[prop] = value;
	            }
	          }
	        } catch (err) {
	          _didIteratorError8 = true;
	          _iteratorError8 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion8 && _iterator8.return) {
	              _iterator8.return();
	            }
	          } finally {
	            if (_didIteratorError8) {
	              throw _iteratorError8;
	            }
	          }
	        }
	      }
	      return this;
	    }
	  }, {
	    key: 'call',
	    value: function call() {
	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }
	
	      var method = ArrayProto.shift.call(args);
	      var arr = [];
	      var returnThis = true;
	      var _iteratorNormalCompletion9 = true;
	      var _didIteratorError9 = false;
	      var _iteratorError9 = undefined;
	
	      try {
	        for (var _iterator9 = this[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	          var el = _step9.value;
	
	          if (el && el[method] instanceof Function) {
	            el = el[method].apply(el, args);
	            arr.push(el);
	            if (returnThis && el !== undefined) {
	              returnThis = false;
	            }
	          } else {
	            arr.push(undefined);
	          }
	        }
	      } catch (err) {
	        _didIteratorError9 = true;
	        _iteratorError9 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion9 && _iterator9.return) {
	            _iterator9.return();
	          }
	        } finally {
	          if (_didIteratorError9) {
	            throw _iteratorError9;
	          }
	        }
	      }
	
	      return returnThis ? this : flatten(arr, this);
	    }
	  }, {
	    key: 'item',
	    value: function item(index) {
	      return new NodeList([[this[index]], this]);
	    }
	  }, {
	    key: 'on',
	
	
	    // event handlers
	    value: function on(events, selector, callback) {
	      if (typeof events === 'string') {
	        events = events.trim().replace(/\s+/, ' ').split(' ');
	      }
	      if (!this || !this.length) return this;
	      if (callback === undefined) {
	        callback = selector;
	        selector = null;
	      }
	      if (!callback) return this;
	      var fn = callback;
	      callback = selector ? function (e) {
	        var els = new NodeList([selector, this]);
	        if (!els.length) {
	          return;
	        }
	        els.some(function (el) {
	          var target = el.contains(e.target);
	          if (target) fn.call(el, e, el);
	          return target;
	        });
	      } : function (e) {
	        fn.apply(this, [e, this]);
	      };
	      var _iteratorNormalCompletion10 = true;
	      var _didIteratorError10 = false;
	      var _iteratorError10 = undefined;
	
	      try {
	        for (var _iterator10 = events[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
	          var event = _step10.value;
	          var _iteratorNormalCompletion11 = true;
	          var _didIteratorError11 = false;
	          var _iteratorError11 = undefined;
	
	          try {
	            for (var _iterator11 = this[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
	              var el = _step11.value;
	
	              el.addEventListener(event, callback, false);
	              Events.push({
	                el: el,
	                event: event,
	                callback: callback
	              });
	            }
	          } catch (err) {
	            _didIteratorError11 = true;
	            _iteratorError11 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion11 && _iterator11.return) {
	                _iterator11.return();
	              }
	            } finally {
	              if (_didIteratorError11) {
	                throw _iteratorError11;
	              }
	            }
	          }
	        }
	      } catch (err) {
	        _didIteratorError10 = true;
	        _iteratorError10 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion10 && _iterator10.return) {
	            _iterator10.return();
	          }
	        } finally {
	          if (_didIteratorError10) {
	            throw _iteratorError10;
	          }
	        }
	      }
	
	      return this;
	    }
	  }, {
	    key: 'off',
	    value: function off(events, callback) {
	      if (events instanceof Function) {
	        callback = events;
	        events = null;
	      }
	      if (typeof events === 'string' && callback instanceof Function) {
	        var _iteratorNormalCompletion12 = true;
	        var _didIteratorError12 = false;
	        var _iteratorError12 = undefined;
	
	        try {
	          for (var _iterator12 = this[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
	            var el = _step12.value;
	
	            for (var e in Events) {
	              var _iteratorNormalCompletion13 = true;
	              var _didIteratorError13 = false;
	              var _iteratorError13 = undefined;
	
	              try {
	                for (var _iterator13 = events.split(' ')[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
	                  var event = _step13.value;
	
	                  if (Events[e] && Events[e].el === el && Events[e].event === event && Events[e].callback === callback) {
	                    Events[e].el.removeEventListener(Events[e].event, Events[e].callback);
	                    delete Events[e];
	                  }
	                }
	              } catch (err) {
	                _didIteratorError13 = true;
	                _iteratorError13 = err;
	              } finally {
	                try {
	                  if (!_iteratorNormalCompletion13 && _iterator13.return) {
	                    _iterator13.return();
	                  }
	                } finally {
	                  if (_didIteratorError13) {
	                    throw _iteratorError13;
	                  }
	                }
	              }
	            }
	          }
	        } catch (err) {
	          _didIteratorError12 = true;
	          _iteratorError12 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion12 && _iterator12.return) {
	              _iterator12.return();
	            }
	          } finally {
	            if (_didIteratorError12) {
	              throw _iteratorError12;
	            }
	          }
	        }
	      } else if (typeof events === 'string') {
	        var _iteratorNormalCompletion14 = true;
	        var _didIteratorError14 = false;
	        var _iteratorError14 = undefined;
	
	        try {
	          for (var _iterator14 = this[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
	            var _el2 = _step14.value;
	
	            for (var _e in Events) {
	              var _iteratorNormalCompletion15 = true;
	              var _didIteratorError15 = false;
	              var _iteratorError15 = undefined;
	
	              try {
	                for (var _iterator15 = events.split(' ')[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
	                  var _event = _step15.value;
	
	                  if (Events[_e] && Events[_e].el === _el2 && Events[_e].event === _event) {
	                    Events[_e].el.removeEventListener(Events[_e].event, Events[_e].callback);
	                    delete Events[_e];
	                  }
	                }
	              } catch (err) {
	                _didIteratorError15 = true;
	                _iteratorError15 = err;
	              } finally {
	                try {
	                  if (!_iteratorNormalCompletion15 && _iterator15.return) {
	                    _iterator15.return();
	                  }
	                } finally {
	                  if (_didIteratorError15) {
	                    throw _iteratorError15;
	                  }
	                }
	              }
	            }
	          }
	        } catch (err) {
	          _didIteratorError14 = true;
	          _iteratorError14 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion14 && _iterator14.return) {
	              _iterator14.return();
	            }
	          } finally {
	            if (_didIteratorError14) {
	              throw _iteratorError14;
	            }
	          }
	        }
	      } else if (callback instanceof Function) {
	        var _iteratorNormalCompletion16 = true;
	        var _didIteratorError16 = false;
	        var _iteratorError16 = undefined;
	
	        try {
	          for (var _iterator16 = this[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
	            var _el3 = _step16.value;
	
	            for (var _e2 in Events) {
	              if (Events[_e2] && Events[_e2].el === _el3 && Events[_e2].callback === callback) {
	                Events[_e2].el.removeEventListener(Events[_e2].event, Events[_e2].callback);
	                delete Events[_e2];
	              }
	            }
	          }
	        } catch (err) {
	          _didIteratorError16 = true;
	          _iteratorError16 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion16 && _iterator16.return) {
	              _iterator16.return();
	            }
	          } finally {
	            if (_didIteratorError16) {
	              throw _iteratorError16;
	            }
	          }
	        }
	      } else {
	        var _iteratorNormalCompletion17 = true;
	        var _didIteratorError17 = false;
	        var _iteratorError17 = undefined;
	
	        try {
	          for (var _iterator17 = this[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
	            var _el4 = _step17.value;
	
	            for (var _e3 in Events) {
	              if (Events[_e3] && Events[_e3].el === _el4) {
	                Events[_e3].el.removeEventListener(Events[_e3].event, Events[_e3].callback);
	                delete Events[_e3];
	              }
	            }
	          }
	        } catch (err) {
	          _didIteratorError17 = true;
	          _iteratorError17 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion17 && _iterator17.return) {
	              _iterator17.return();
	            }
	          } finally {
	            if (_didIteratorError17) {
	              throw _iteratorError17;
	            }
	          }
	        }
	      }
	      Events = Events.filter(function (el) {
	        return el !== undefined;
	      });
	      return this;
	    }
	  }, {
	    key: 'onBlur',
	    value: function onBlur(callback) {
	      if (!this || !this.length) return this;
	      if (!callback) return this;
	      this.each(function (el) {
	        blurList.push({
	          el: el,
	          callback: callback
	        });
	      });
	      if (!blurEvent) {
	        blurEvent = function blurEvent(e) {
	          var _iteratorNormalCompletion18 = true;
	          var _didIteratorError18 = false;
	          var _iteratorError18 = undefined;
	
	          try {
	            for (var _iterator18 = blurList[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
	              var item = _step18.value;
	
	              var target = item.el.contains(e.target) || item.el === e.target;
	              if (!target) item.callback.call(item.el, e, item.el);
	            }
	          } catch (err) {
	            _didIteratorError18 = true;
	            _iteratorError18 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion18 && _iterator18.return) {
	                _iterator18.return();
	              }
	            } finally {
	              if (_didIteratorError18) {
	                throw _iteratorError18;
	              }
	            }
	          }
	        };
	        document.addEventListener('click', blurEvent, false);
	        document.addEventListener('touchstart', blurEvent, false);
	      }
	      return this;
	    }
	  }, {
	    key: 'offBlur',
	    value: function offBlur(callback) {
	      this.each(function (el) {
	        for (var e in blurList) {
	          if (blurList[e] && blurList[e].el === el && (!callback || blurList[e].callback === callback)) {
	            delete blurList[e];
	          }
	        }
	      });
	      blurList = blurList.filter(function (el) {
	        return el !== undefined;
	      });
	      return this;
	    }
	  }, {
	    key: 'asArray',
	    get: function get() {
	      return ArrayProto.slice.call(this);
	    }
	  }]);
	
	  return NodeList;
	}();
	
	var NL = NodeList.prototype;
	
	function flatten(arr, owner) {
	  var list = [];
	  var _iteratorNormalCompletion19 = true;
	  var _didIteratorError19 = false;
	  var _iteratorError19 = undefined;
	
	  try {
	    for (var _iterator19 = arr[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
	      var el = _step19.value;
	
	      if (el instanceof Node || el === null) {
	        if (!~list.indexOf(el)) list.push(el);
	      } else if (el instanceof window.NodeList || el instanceof NodeList || el instanceof HTMLCollection || el instanceof Array) {
	        var _iteratorNormalCompletion20 = true;
	        var _didIteratorError20 = false;
	        var _iteratorError20 = undefined;
	
	        try {
	          for (var _iterator20 = el[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
	            var el2 = _step20.value;
	            list.push(el2);
	          }
	        } catch (err) {
	          _didIteratorError20 = true;
	          _iteratorError20 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion20 && _iterator20.return) {
	              _iterator20.return();
	            }
	          } finally {
	            if (_didIteratorError20) {
	              throw _iteratorError20;
	            }
	          }
	        }
	      } else {
	        arr.get = NL.get;
	        arr.set = NL.set;
	        arr.call = NL.call;
	        arr.owner = owner;
	        return arr;
	      }
	    }
	  } catch (err) {
	    _didIteratorError19 = true;
	    _iteratorError19 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion19 && _iterator19.return) {
	        _iterator19.return();
	      }
	    } finally {
	      if (_didIteratorError19) {
	        throw _iteratorError19;
	      }
	    }
	  }
	
	  return new NodeList([list, owner]);
	}
	
	Object.getOwnPropertyNames(ArrayProto).forEach(function (key) {
	  if (key !== 'join' && key !== 'copyWithin' && key !== 'fill' && NL[key] === undefined) {
	    NL[key] = ArrayProto[key];
	  }
	});
	if (window.Symbol && Symbol.iterator) {
	  NL[Symbol.iterator] = NL.values = ArrayProto[Symbol.iterator];
	}
	var div = document.createElement('div');
	function setterGetter(prop) {
	  var _this3 = this,
	      _arguments = arguments;
	
	  if (div[prop] instanceof Function) {
	    NL[prop] = function () {
	      var arr = [];
	      var returnThis = true;
	      var _iteratorNormalCompletion21 = true;
	      var _didIteratorError21 = false;
	      var _iteratorError21 = undefined;
	
	      try {
	        for (var _iterator21 = NL[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
	          var el = _step21.value;
	
	          if (el && el[prop] instanceof Function) {
	            el = el[prop].apply(el, _arguments);
	            arr.push(el);
	            if (returnThis && el !== undefined) {
	              returnThis = false;
	            }
	          } else {
	            arr.push(undefined);
	          }
	        }
	      } catch (err) {
	        _didIteratorError21 = true;
	        _iteratorError21 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion21 && _iterator21.return) {
	            _iterator21.return();
	          }
	        } finally {
	          if (_didIteratorError21) {
	            throw _iteratorError21;
	          }
	        }
	      }
	
	      return returnThis ? _this3 : flatten(arr, _this3);
	    };
	  } else {
	    Object.defineProperty(NL, prop, {
	      get: function get() {
	        var arr = [];
	        var _iteratorNormalCompletion22 = true;
	        var _didIteratorError22 = false;
	        var _iteratorError22 = undefined;
	
	        try {
	          for (var _iterator22 = this[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
	            var el = _step22.value;
	
	            if (el !== null) {
	              el = el[prop];
	            }
	            arr.push(el);
	          }
	        } catch (err) {
	          _didIteratorError22 = true;
	          _iteratorError22 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion22 && _iterator22.return) {
	              _iterator22.return();
	            }
	          } finally {
	            if (_didIteratorError22) {
	              throw _iteratorError22;
	            }
	          }
	        }
	
	        return flatten(arr, this);
	      },
	      set: function set(value) {
	        var _iteratorNormalCompletion23 = true;
	        var _didIteratorError23 = false;
	        var _iteratorError23 = undefined;
	
	        try {
	          for (var _iterator23 = this[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
	            var el = _step23.value;
	
	            if (el && prop in el) {
	              el[prop] = value;
	            }
	          }
	        } catch (err) {
	          _didIteratorError23 = true;
	          _iteratorError23 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion23 && _iterator23.return) {
	              _iterator23.return();
	            }
	          } finally {
	            if (_didIteratorError23) {
	              throw _iteratorError23;
	            }
	          }
	        }
	      }
	    });
	  }
	}
	for (var prop in div) {
	  setterGetter(prop);
	}function NodeListJS() {
	  return new NodeList(arguments);
	}
	window.NL = NodeListJS;
	
	exports.default = NodeListJS;

/***/ },
/* 105 */
/***/ function(module, exports) {

	module.exports = "\n<li v-if=\"$parent._navbar||$parent.menu||$parent._tabset\" v-el:dropdown=\"\" class=\"dropdown\" :class=\"classes\" _v-1b7c064a=\"\">\n    <a v-if=\"text\" class=\"dropdown-toggle\" role=\"button\" :class=\"{disabled: disabled}\" @keyup.esc=\"show = false\" _v-1b7c064a=\"\">\n      {{ text }}\n      <span class=\"caret\" _v-1b7c064a=\"\"></span>\n    </a>\n    <slot v-else=\"\" name=\"button\" _v-1b7c064a=\"\"></slot>\n  <slot v-if=\"slots['dropdown-menu']\" name=\"dropdown-menu\" _v-1b7c064a=\"\"></slot>\n  <ul v-else=\"\" class=\"dropdown-menu\" _v-1b7c064a=\"\">\n    <slot _v-1b7c064a=\"\"></slot>\n  </ul>\n</li>\n<div v-else=\"\" v-el:dropdown=\"\" class=\"btn-group\" :class=\"classes\" _v-1b7c064a=\"\">\n    <button v-if=\"text\" type=\"button\" class=\"btn btn-{{type||'default'}} dropdown-toggle\" @keyup.esc=\"show = false\" :disabled=\"disabled\" _v-1b7c064a=\"\">\n      {{ text }}\n      <span class=\"caret\" _v-1b7c064a=\"\"></span>\n    </button>\n    <slot v-else=\"\" name=\"button\" _v-1b7c064a=\"\"></slot>\n  <slot v-if=\"slots['dropdown-menu']\" name=\"dropdown-menu\" _v-1b7c064a=\"\"></slot>\n  <ul v-else=\"\" class=\"dropdown-menu\" _v-1b7c064a=\"\">\n    <slot _v-1b7c064a=\"\"></slot>\n  </ul>\n</div>\n";

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getPersonInCharge = getPersonInCharge;
	exports.updateDeployer = updateDeployer;
	exports.searchUser = searchUser;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * get
	 */
	function getPersonInCharge(clusterId) {
	    return request.get('/api/cluster/getPersonInCharge/' + clusterId, {});
	} /*
	   * --------------------------------------------
	   * 权限
	   * @version  1.0
	   * @author   shirley(hztanxuewei@corp.netease.com)
	   * --------------------------------------------
	   */
	function updateDeployer(clusterId, params) {
	    return request.post('/api/cluster/updateDeployer/' + clusterId, params);
	}
	
	//搜索人员
	function searchUser(params) {
	    return request.get('/api/cluster/searchUser', params);
	}

/***/ },
/* 107 */
/***/ function(module, exports) {

	module.exports = "\n<div class=\"m-select2\">\n  <div class=\"select-box f-cb\">\n    <input type=\"search\" \n           class=\"u-ipt\"\n           v-model=\"value\"\n           @input=\"search\"/>\n  </div>\n  <dropdown :show.sync=\"false\">\n    <li>111</li>\n    <li>111</li>\n    <li>111</li>\n  </dropdown>\n</div>\n";

/***/ },
/* 108 */
/***/ function(module, exports) {

	module.exports = "\r\n<div class=\"m-auth\">\r\n    <p class=\"tlt\"><a v-link=\"{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}\">{{ clusterName }}</a>&nbsp;>&nbsp;权限配置</p>\r\n    <form class=\"m-form\">\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">集群责任人：</label>\r\n            <div class=\"fmcnt\">\r\n                <ul class=\"per\">\r\n                  <li v-for=\"item in result.clusterOwners\">{{ item.userName }}<span v-if=\"item.account\">({{ item.account }})</span></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">应用责任人：</label>\r\n            <div class=\"fmcnt\">\r\n                <ul class=\"per\">\r\n                  <li v-for=\"item in result.appOwners\">{{ item.userName }}<span v-if=\"item.account\">({{ item.account }})</span></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">产品责任人：</label>\r\n            <div class=\"fmcnt\">\r\n                <ul class=\"per\">\r\n                  <li v-for=\"item in result.productOwners\">{{ item.userName }}<span v-if=\"item.account\">({{ item.account }})</span></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">集群发布人：</label>\r\n            <div class=\"fmcnt\">\r\n                <!-- <select2></select2> -->\r\n                <ul class=\"per\">\r\n                  <li v-for=\"item in result.clusterDeployers\">{{ item.name || item.userName }}<span v-if=\"item.account\">({{ item.account }})</span></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">应用发布人：</label>\r\n            <div class=\"fmcnt\">\r\n                <ul class=\"per\">\r\n                  <li v-for=\"item in result.appDeployers\">{{ item.userName }}<span v-if=\"item.account\">({{ item.account }})</span></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">PE主责任人：</label>\r\n            <div class=\"fmcnt\">\r\n                <ul class=\"per\">\r\n                  <li v-for=\"item in result.peMaster\">{{ item.userName }}<span v-if=\"item.account\">({{ item.account }})</span></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">PE次责任人：</label>\r\n            <div class=\"fmcnt\">\r\n                <ul class=\"per\">\r\n                  <li v-for=\"item in result.peSlave\">{{ item.userName }}<span v-if=\"item.account\">({{ item.account }})</span></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">PE专家：</label>\r\n            <div class=\"fmcnt\">\r\n                <ul class=\"per\">\r\n                  <li v-for=\"item in result.peExpert\">{{ item.userName }}<span v-if=\"item.account\">({{ item.account }})</span></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <div class=\"fmitem\">\r\n            <label class=\"fmlab\">QA：</label>\r\n            <div class=\"fmcnt\">\r\n                <ul class=\"per\">\r\n                  <li v-for=\"item in result.qa\">{{ item.userName }}<span v-if=\"item.account\">({{ item.account }})</span></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n        <!-- <div class=\"fmitem\">\r\n            <label class=\"fmlab\"></label>\r\n            <div class=\"fmcnt u-btns\">\r\n                <input type=\"button\" \r\n                   name=\"submit\" \r\n                   class=\"u-btn mb10\" \r\n                   value=\"取消\"\r\n                   @click=\"cancel\"/>\r\n                <input type=\"button\" \r\n                   name=\"submit\" \r\n                   class=\"u-btn u-btn-primary\" \r\n                   value=\"保存\"\r\n                   @click=\"add\"/>\r\n            </div>\r\n        </div> -->\r\n    </form>\r\n</div>\r\n";

/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(110)
	__vue_script__ = __webpack_require__(111)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/deploy/Build.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(134)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Build.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 110 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _Spin = __webpack_require__(112);
	
	var _Spin2 = _interopRequireDefault(_Spin);
	
	var _Steps = __webpack_require__(117);
	
	var _Steps2 = _interopRequireDefault(_Steps);
	
	var _Step = __webpack_require__(120);
	
	var _Step2 = _interopRequireDefault(_Step);
	
	var _Grid = __webpack_require__(123);
	
	var _Grid2 = _interopRequireDefault(_Grid);
	
	var _Tooltip = __webpack_require__(127);
	
	var _Tooltip2 = _interopRequireDefault(_Tooltip);
	
	var _util = __webpack_require__(66);
	
	var _util2 = _interopRequireDefault(_util);
	
	var _deploy = __webpack_require__(133);
	
	var service = _interopRequireWildcard(_deploy);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { modal: _Modal2.default, spin: _Spin2.default, steps: _Steps2.default, step: _Step2.default, grid: _Grid2.default, tooltip: _Tooltip2.default },
	  data: function data() {
	    return {
	      query: this.$route.query,
	      clusterId: this.$route.query.clusterId,
	      clusterName: '',
	      optList: [{
	        name: '构建',
	        link: 'build'
	      }, {
	        name: '发布',
	        link: 'do'
	      }, {
	        name: '一键发布',
	        link: 'all'
	      }, {
	        name: '回滚',
	        link: 'rollback'
	      }, {
	        name: '重启',
	        link: 'restart'
	      }, {
	        name: '停止',
	        link: 'stop'
	      }, {
	        name: '上线',
	        link: 'online'
	      }, {
	        name: '下线',
	        link: 'offline'
	      }],
	      typeList: [{
	        name: '组一',
	        descp: '',
	        status: 'ok'
	      }, {
	        name: 'xxx.hz.netease.com',
	        descp: 'default',
	        status: 'ok'
	      }, {
	        name: 'xxx.hz.netease.com',
	        descp: 'default',
	        status: 'ok'
	      }, {
	        name: 'xxx.hz.netease.com',
	        descp: 'default',
	        status: 'ok'
	      }, {
	        name: 'xxx.hz.netease.com',
	        descp: 'default',
	        status: 'ok'
	      }],
	      showModal: false,
	      auth: true,
	      buildStatusMap: { 'no': '无状态', 'pending': '等待中', 'ongoing': '构建中', 'error': '构建失败', 'finish': '构建成功' },
	
	      buildMap: {
	        status: 'no',
	        currentVersion: '',
	        buildTaskId: 0,
	        progress: 0,
	        workflowId: 0,
	        errorMsg: ''
	      },
	      errorMsg: '',
	      showLog: false,
	      logs: '',
	
	      lineNumber: 0,
	      logList: [],
	      batchGroupList: [],
	      instanceList: [],
	      curBatch: {},
	      curBatchId: -1,
	      selBatchId: 0,
	      deployStatus: 'ongoing',
	      showNext: '',
	      selBatchStatus: '',
	
	      offset: 0,
	      isDeploy: false,
	      instanceErrorMsg: ''
	    };
	  },
	
	  route: {
	    deactivate: function deactivate(transition) {
	      clearInterval(this.buildStatusTimer);
	      clearInterval(this.logTimer);
	      clearInterval(this.groupStatusTimer);
	      clearInterval(this.instanceStatusTimer);
	      transition.next();
	    }
	  },
	  computed: {
	    curBuildStatus: function curBuildStatus() {
	      return this.buildMap.status || 'no';
	    },
	    logLength: function logLength() {
	      return this.logList.length;
	    }
	  },
	  watch: {
	    'curBuildStatus': function curBuildStatus(val) {
	      switch (val) {
	        case 'ongoing':
	          this.showLog = true;
	          this.getBuildLog();
	          break;
	        case 'finish':
	          this.lineNumber = 0;
	          this.showLog = false;
	          clearInterval(this.buildStatusTimer);
	          this.buildStatusTimer = null;
	
	          if (this.deployStatus == 'pending') {
	            this.getDeployStatus();
	          }
	          break;
	        default:
	          clearInterval(this.buildStatusTimer);
	          this.buildStatusTimer = null;
	          break;
	      }
	    },
	    'deployStatus': function deployStatus(val) {
	      switch (val) {
	        case 'pending':
	          break;
	        case 'ongoing':
	          break;
	        default:
	          break;
	      }
	    },
	    'logLength': function logLength(val) {
	      this.$els.log && (this.$els.log.scrollTop = 99999999);
	    }
	  },
	  ready: function ready() {
	    this.$parent.getClusterName(this.query);
	    this.getBuildStatus();
	    this.getDeployStatus('init');
	  },
	
	  methods: {
	    getBuildStatus: function getBuildStatus() {
	      var _this = this;
	
	      var self = this;
	      service.getBuildStatus({
	        clusterId: this.clusterId
	      }).then(function (data) {
	        if (!data) {
	          _this.auth = false;
	        }
	        _this.buildMap = data || {};
	        _this.errorMsg = _this.buildMap.errorMsg || '无错误信息';
	      });
	    },
	    refreshBuildStatus: function refreshBuildStatus() {
	      this.buildStatusTimer = setInterval(this.getBuildStatus, 10000);
	    },
	    onBuild: function onBuild() {
	      var _this2 = this;
	
	      service.startBuild({
	        clusterId: this.clusterId
	      }).then(function (data) {
	        _this2.getBuildStatus();
	      });
	    },
	    restartBuild: function restartBuild() {
	      var _this3 = this;
	
	      service.restartBuild({
	        clusterId: this.clusterId
	      }).then(function (data) {
	        _this3.getBuildStatus();
	      });
	    },
	    getBuildLog: function getBuildLog() {
	      var _this4 = this;
	
	      var self = this;
	      service.getBuildLog({
	        buildTaskId: this.buildMap.buildTaskId,
	        lineNumber: this.lineNumber
	      }).then(function (data) {
	        _this4.logList = _this4.logList.concat(data.list || []);
	        _this4.$els.log && (_this4.$els.log.scrollTop = 99999999);
	        if (!!data.isFinish) {
	          _this4.getBuildStatus();
	
	          clearInterval(_this4.logTimer);
	          _this4.logTimer = null;
	        } else {
	          _this4.lineNumber += Number(data.total) || 0;
	
	          if (data.total == 0) {
	            clearInterval(_this4.logTimer);
	            _this4.logTimer = null;
	            _this4.logTimer = setInterval(function () {
	              self.getBuildLog();
	            }, 5000);
	          } else {
	            clearInterval(_this4.logTimer);
	            _this4.logTimer = null;
	            _this4.getBuildLog();
	          }
	        }
	      });
	    },
	    getDeployStatus: function getDeployStatus(type) {
	      var _this5 = this;
	
	      var self = this;
	
	      service.getDeployStatus({
	        clusterId: this.clusterId
	      }).then(function (data) {
	        if (!data) {
	          _this5.deployStatus = null;
	          return;
	        }
	
	        if (type) {
	          self.batchGroupList = data.batchGroupList || [];
	        }
	
	        self.deployStatus = data.status;
	
	        if (!!data.status) {
	          if (data.status == 'pending') {
	            self.curBatch = data.batchGroupList ? data.batchGroupList[0] : {};
	            self.curBatchId = 0;
	            self.selBatchStatus = self.curBatch.status;
	            self.instanceList = self.curBatch.instanceList || [];
	            clearInterval(self.groupStatusTimer);
	          } else {
	
	            var showGoing = _util2.default.findInMap(data.batchGroupList, 'status', 'ongoing');
	            self.showNext = _util2.default.findInMap(data.batchGroupList, 'showContinueButton', true);
	            self.curBatch = showGoing || self.showNext || data.batchGroupList[data.batchGroupList.length - 1] || {};
	            self.curBatchId = self.curBatch.actionBatchId || 0;
	            self.selBatchStatus = self.curBatch.status;
	            self.instanceList = self.curBatch.instanceList || [];
	            clearInterval(self.groupStatusTimer);
	
	            if (showGoing) {
	
	              self.groupStatusTimer = setInterval(function () {
	                self.getDeployGroupStatus(self.curBatchId);
	              }, 10000);
	              self.getDeployGroupStatus(self.curBatchId);
	            }
	
	            if (self.showNext) {
	              console.log(self.showNext);
	            }
	          }
	        } else {
	          self.batchGroupList = data.batchGroupList || [];
	          self.instanceList = self.batchGroupList[0] ? self.batchGroupList[0].instanceList : [];
	        }
	      });
	    },
	    getDeployGroupStatus: function getDeployGroupStatus(num, type) {
	      var _this6 = this;
	
	      var self = this;
	      if (!num) return;
	
	      service.getDeployGroupStatus({
	        batchIds: num
	      }).then(function (data) {
	        var obj = data[num];
	        if (obj.status == 'ongoing') {
	          clearInterval(_this6.instanceStatusTimer);
	          self.getInstanceStatus(num);
	          _this6.instanceStatusTimer = setInterval(function () {
	            self.getInstanceStatus(num);
	          }, 20000);
	        } else if (obj.status == 'finish') {
	          clearInterval(_this6.groupStatusTimer);
	          clearInterval(_this6.instanceStatusTimer);
	
	          if (type != 'sel') {
	
	            _this6.getDeployStatus();
	          }
	        }
	      });
	    },
	    getInstanceStatus: function getInstanceStatus(num) {
	      var _this7 = this;
	
	      var instanceIdList = _util2.default.findIdList(this.instanceList, 'batchInstanceId');
	      if (instanceIdList.length == 0) return;
	
	      service.getInstanceStatus({
	        batchId: num,
	        instanceIds: instanceIdList.join(',')
	      }).then(function (data) {
	        for (var key in data) {
	          for (var i = 0, len = _this7.instanceList.length; i < len; i++) {
	            var item = _this7.instanceList[i];
	            key == item.batchInstanceId && (item.deployStatus = data[key].status);
	          }
	        }
	      });
	    },
	    getBuildTaskLog: function getBuildTaskLog() {
	      var _this8 = this;
	
	      if (!this.buildMap.buildTaskId) return;
	
	      service.getBuildTaskLog({
	        buildTaskId: this.buildMap.buildTaskId
	      }).then(function (data) {
	        _this8.showLog = true;
	        var log = data.log ? data.log.replace(/\n/g, '<br/>') : '';
	        _this8.logs = log || '<span class="f-red">没有日志</span>';
	      });
	    },
	    closeLog: function closeLog() {
	      this.showLog = false;
	      this.logList = [];
	      this.logs = '';
	    },
	    onDeployLog: function onDeployLog(id) {
	      if (!id) return;
	      this.showLog = true;
	      this.isDeploy = true;
	      this.logs = '';
	      clearInterval(this.logTimer);
	
	      this.getDeployLog(id, 0);
	    },
	    getDeployLog: function getDeployLog(id, end) {
	      var _this9 = this;
	
	      var self = this;
	
	      service.getDeployLog({
	        instanceId: id,
	        offset: end
	      }).then(function (data) {
	        var log = data.content ? data.content.replace(/\n/g, '<br/>') : '';
	        _this9.logs = _this9.logs + log;
	        _this9.$els.log && (_this9.$els.log.scrollTop = 99999999);
	        if (!!data.hasFinished && data.content && data.content.indexOf('get log failed') == -1) {
	          clearInterval(_this9.logTimer);
	          _this9.logTimer = null;
	        } else {
	          if (data.end == 0) {
	            clearInterval(_this9.logTimer);
	            _this9.logTimer = null;
	            _this9.logTimer = setInterval(function () {
	              self.getDeployLog(id, 0);
	            }, 5000);
	          } else {
	            clearInterval(_this9.logTimer);
	            _this9.logTimer = null;
	            _this9.getDeployLog(id, data.end);
	          }
	        }
	      });
	    },
	    onAppLog: function onAppLog(id) {},
	    doRetry: function doRetry(id) {
	      var _this10 = this;
	
	      service.retryInstance({
	        clusterId: this.clusterId,
	        instanceId: id
	      }).then(function (data) {
	        _vue2.default.$alert('重试成功', 'success');
	        _this10.getDeployStatus();
	      });
	    },
	    doIgnore: function doIgnore(id) {
	      var self = this;
	      service.ignoreInstance({
	        instanceId: id
	      }).then(function (data) {
	        _vue2.default.$alert('忽略成功', 'success');
	        self.getDeployStatus();
	      });
	    },
	    onStep: function onStep(num) {
	      this.selBatchId = num;
	
	      var selBatch = _util2.default.findInMap(this.batchGroupList, 'actionBatchId', num);
	      this.instanceList = selBatch ? selBatch.instanceList : [];
	      this.selBatchStatus = selBatch ? selBatch.status : 'finish';
	      this.getDeployGroupStatus(num, 'sel');
	    },
	    next: function next() {
	      var _this11 = this;
	
	      service.groupContinue({
	        sourceBatchId: this.curBatchId,
	        targetBatchId: this.curBatchId + 1
	      }).then(function (data) {
	        _this11.getDeployStatus();
	      });
	    },
	    showInstaceErrorMsg: function showInstaceErrorMsg(msg) {
	      this.showModal = true;
	      this.instanceErrorMsg = msg;
	    }
	  }
	};

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(113)
	__vue_script__ = __webpack_require__(114)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Spin.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(116)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Spin.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 113 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _defineProperty2 = __webpack_require__(85);
	
	var _defineProperty3 = _interopRequireDefault(_defineProperty2);
	
	var _assist = __webpack_require__(115);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var prefixCls = 'ivu-spin';
	exports.default = {
	    props: {
	        size: {
	            validator: function validator(value) {
	                return (0, _assist.oneOf)(value, ['small', 'large']);
	            }
	        },
	        fix: {
	            type: Boolean,
	            default: false
	        }
	    },
	    data: function data() {
	        return {
	            showText: false
	        };
	    },
	
	    computed: {
	        classes: function classes() {
	            var _ref;
	
	            return ['' + prefixCls, (_ref = {}, (0, _defineProperty3.default)(_ref, prefixCls + '-' + this.size, !!this.size), (0, _defineProperty3.default)(_ref, prefixCls + '-fix', this.fix), (0, _defineProperty3.default)(_ref, prefixCls + '-show-text', this.showText), _ref)];
	        },
	        mainClasses: function mainClasses() {
	            return prefixCls + '-main';
	        },
	        dotClasses: function dotClasses() {
	            return prefixCls + '-dot';
	        },
	        textClasses: function textClasses() {
	            return prefixCls + '-text';
	        }
	    },
	    compiled: function compiled() {
	        var text = this.$els.text.innerHTML;
	        if (text != '') {
	            this.showText = true;
	        }
	    }
	};

/***/ },
/* 115 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	        value: true
	});
	exports.oneOf = oneOf;
	exports.camelcaseToHyphen = camelcaseToHyphen;
	exports.getScrollBarSize = getScrollBarSize;
	// 判断参数是否是其中之一
	function oneOf(value, validList) {
	        for (var i = 0; i < validList.length; i++) {
	                if (value === validList[i]) {
	                        return true;
	                }
	        }
	        return false;
	}
	
	function camelcaseToHyphen(str) {
	        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
	}
	
	// For Modal scrollBar hidden
	var cached = void 0;
	function getScrollBarSize(fresh) {
	        if (fresh || cached === undefined) {
	                var inner = document.createElement('div');
	                inner.style.width = '100%';
	                inner.style.height = '200px';
	
	                var outer = document.createElement('div');
	                var outerStyle = outer.style;
	
	                outerStyle.position = 'absolute';
	                outerStyle.top = 0;
	                outerStyle.left = 0;
	                outerStyle.pointerEvents = 'none';
	                outerStyle.visibility = 'hidden';
	                outerStyle.width = '200px';
	                outerStyle.height = '150px';
	                outerStyle.overflow = 'hidden';
	
	                outer.appendChild(inner);
	
	                document.body.appendChild(outer);
	
	                var widthContained = inner.offsetWidth;
	                outer.style.overflow = 'scroll';
	                var widthScroll = inner.offsetWidth;
	
	                if (widthContained === widthScroll) {
	                        widthScroll = outer.clientWidth;
	                }
	
	                document.body.removeChild(outer);
	
	                cached = widthContained - widthScroll;
	        }
	        return cached;
	}

/***/ },
/* 116 */
/***/ function(module, exports) {

	module.exports = "\n<div :class=\"classes\" transition=\"fade\">\n    <div :class=\"mainClasses\">\n        <span :class=\"dotClasses\"></span>\n        <div :class=\"textClasses\" v-el:text><slot></slot></div>\n    </div>\n</div>\n";

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__vue_script__ = __webpack_require__(118)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Steps.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(119)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Steps.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _defineProperty2 = __webpack_require__(85);
	
	var _defineProperty3 = _interopRequireDefault(_defineProperty2);
	
	var _assist = __webpack_require__(115);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var prefixCls = 'ivu-steps';
	exports.default = {
	    props: {
	        current: {
	            type: Number,
	            default: 0
	        },
	        status: {
	            validator: function validator(value) {
	                return (0, _assist.oneOf)(value, ['pending', 'ongoing', 'finish', 'error']);
	            },
	
	            default: 'ongoing'
	        },
	        size: {
	            validator: function validator(value) {
	                return (0, _assist.oneOf)(value, ['small']);
	            }
	        },
	        direction: {
	            validator: function validator(value) {
	                return (0, _assist.oneOf)(value, ['horizontal', 'vertical']);
	            },
	
	            default: 'horizontal'
	        }
	    },
	    computed: {
	        classes: function classes() {
	            return ['' + prefixCls, prefixCls + '-' + this.direction, (0, _defineProperty3.default)({}, prefixCls + '-' + this.size, !!this.size)];
	        }
	    },
	    ready: function ready() {
	        this.updateChildProps(true);
	        this.setNextError();
	        this.updateCurrent(true);
	    },
	
	    methods: {
	        updateChildProps: function updateChildProps(isInit) {
	            var total = this.$children.length;
	            var self = this;
	            this.$children.forEach(function (child, index) {
	                child.stepNumber = index + 1;
	                if (self.direction === 'horizontal') {
	                    child.total = total;
	                }
	
	                if (!(isInit && child.status)) {
	                    if (child.id == self.current) {
	                        if (child.status == 'finish') {
	                            child.status == 'finish';
	                        } else {
	
	                            if (self.status != 'error') {
	                                child.status = 'ongoing';
	                            }
	                        }
	                    } else if (child.id < self.current) {
	                        child.status = 'finish';
	                    } else {
	                        child.status = 'pending';
	                    }
	                }
	                if (child.status != 'error' && child.id != 0 && index != 0) {
	                    self.$children[index - 1].nextError = false;
	                }
	            });
	        },
	        setNextError: function setNextError() {
	            var _this = this;
	
	            this.$children.forEach(function (child, index) {
	                if (child.status == 'error' && index != 0) {
	                    _this.$children[index - 1].nextError = true;
	                }
	            });
	        },
	        updateCurrent: function updateCurrent(isInit) {
	            if (this.$children.length > 0) {
	
	                if (isInit) {
	                    var current_status = this.$children[this.current].status;
	                    if (!current_status) {
	                        this.$children[this.current].status = this.status;
	                    }
	                } else {
	                    this.$children[this.current].status = this.status;
	                }
	            }
	        }
	    },
	    watch: {
	        current: function current() {
	            this.updateChildProps();
	        },
	        status: function status() {
	            this.updateCurrent();
	        }
	    }
	};

/***/ },
/* 119 */
/***/ function(module, exports) {

	module.exports = "\n<div :class=\"classes\">\n    <slot></slot>\n</div>\n";

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__vue_script__ = __webpack_require__(121)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Step.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(122)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Step.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _defineProperty2 = __webpack_require__(85);
	
	var _defineProperty3 = _interopRequireDefault(_defineProperty2);
	
	var _assist = __webpack_require__(115);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var prefixCls = 'ivu-steps';
	var iconPrefixCls = 'ivu-icon';
	exports.default = {
	    props: {
	        status: {
	            validator: function validator(value) {
	                return (0, _assist.oneOf)(value, ['pending', 'ongoing', 'finish', 'error']);
	            }
	        },
	        title: {
	            type: String,
	            default: ''
	        },
	        id: {
	            type: Number,
	            default: 1
	        },
	        content: {
	            type: String
	        },
	        icon: {
	            type: String
	        },
	        onStep: {
	            type: Function
	        }
	    },
	    data: function data() {
	        return {
	            prefixCls: prefixCls,
	            stepNumber: '',
	            nextError: false,
	            total: 1
	        };
	    },
	
	    computed: {
	        wrapClasses: function wrapClasses() {
	            var _ref;
	
	            return [prefixCls + '-item', prefixCls + '-status-' + this.status, (_ref = {}, (0, _defineProperty3.default)(_ref, prefixCls + '-custom', !!this.icon), (0, _defineProperty3.default)(_ref, prefixCls + '-next-error', this.nextError), _ref)];
	        },
	        iconClasses: function iconClasses() {
	            var icon = '';
	            if (!!this.icon) {
	                icon = this.icon;
	            } else {
	                if (this.status == 'finish') {
	                    icon = 'ok';
	                } else if (this.status == 'error') {
	                    icon = 'close';
	                }
	            }
	            return [prefixCls + '-icon', '' + iconPrefixCls, (0, _defineProperty3.default)({}, iconPrefixCls + '-' + icon, icon != '')];
	        },
	        styles: function styles() {
	            return {
	                width: 1 / this.total * 100 + '%'
	            };
	        }
	    },
	    watch: {
	        status: function status() {
	            if (this.status == 'error') {
	                this.$parent.setNextError();
	            }
	        }
	    }
	};

/***/ },
/* 122 */
/***/ function(module, exports) {

	module.exports = "\n<div :class=\"wrapClasses\" :style=\"styles\">\n    <div :class=\"[`${prefixCls}-tail`]\"><i></i></div>\n    <div :class=\"[`${prefixCls}-head`]\">\n        <div :class=\"[`${prefixCls}-head-inner`]\"\n             @click=\"onStep(id)\">\n            <span v-if=\"!icon && status != 'finish' && status != 'error'\">{{ stepNumber }}</span>\n            <span v-else :class=\"iconClasses\"></span>\n        </div>\n    </div>\n    <div :class=\"[`${prefixCls}-main`]\">\n        <div :class=\"[`${prefixCls}-title`]\">{{ title }}</div>\n        <div v-if=\"content\" :class=\"[`${prefixCls}-content`]\">{{ content }}</div>\n    </div>\n</div>\n";

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(124)
	__vue_script__ = __webpack_require__(125)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Grid.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(126)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Grid.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 124 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _assist = __webpack_require__(115);
	
	exports.default = {
	    props: {
	        status: {
	            validator: function validator(value) {
	                return (0, _assist.oneOf)(value, ['wait', 'process', 'finish', 'error']);
	            }
	        },
	        title: {
	            type: String,
	            default: ''
	        },
	        content: {
	            type: String
	        },
	        icon: {
	            type: String
	        }
	    },
	    data: function data() {
	        return {
	            stepNumber: '',
	            nextError: false,
	            total: 1
	        };
	    },
	
	    computed: {},
	    watch: {}
	};

/***/ },
/* 126 */
/***/ function(module, exports) {

	module.exports = "\r\n<div class=\"tb\">\r\n    <div class=\"tb-hd\">\r\n        <table class=\"m-table\">\r\n            <thead>\r\n                <tr>\r\n                    <th>主机</th>\r\n                    <th>实例名</th>\r\n                    <th>发布状态</th>\r\n                    <th>权限</th>\r\n                </tr>\r\n            </thead>\r\n            <tbody style=\"display: none;\">\r\n                <!-- <slot name=\"tbody\"></slot> -->\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n    <div class=\"tb-bd\" v-el:tbody>\r\n        <slot name=\"body\"></slot>\r\n    </div>\r\n</div>\r\n";

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(128)
	__vue_script__ = __webpack_require__(129)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Tooltip.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(132)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Tooltip.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 128 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _popoverMixins = __webpack_require__(130);
	
	var _popoverMixins2 = _interopRequireDefault(_popoverMixins);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  mixins: [_popoverMixins2.default],
	  props: {
	    trigger: {
	      type: String,
	      default: 'hover'
	    },
	    effect: {
	      type: String,
	      default: 'scale'
	    },
	    content: {
	      type: String
	    }
	  }
	};

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _utils = __webpack_require__(131);
	
	var _NodeList = __webpack_require__(104);
	
	var _NodeList2 = _interopRequireDefault(_NodeList);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  props: {
	    trigger: {
	      type: String
	    },
	    effect: {
	      type: String,
	      default: 'fade'
	    },
	    title: {
	      type: String
	    },
	    content: {
	      type: String
	    },
	    header: {
	      type: Boolean,
	      coerce: _utils.coerce.boolean,
	      default: true
	    },
	    placement: {
	      type: String,
	      default: 'top'
	    }
	  },
	  data: function data() {
	    return {
	      position: {
	        top: 0,
	        left: 0
	      },
	      show: false
	    };
	  },
	
	  methods: {
	    toggle: function toggle(e) {
	      var _this = this;
	
	      if (e && this.trigger === 'contextmenu') e.preventDefault();
	      if (!(this.show = !this.show)) {
	        return;
	      }
	      setTimeout(function () {
	        var popover = _this.$els.popover;
	        var trigger = _this.$els.trigger.children[0];
	        switch (_this.placement) {
	          case 'top':
	            _this.position.left = trigger.offsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2;
	            _this.position.top = trigger.offsetTop - popover.offsetHeight - 5;
	            break;
	          case 'left':
	            _this.position.left = trigger.offsetLeft - popover.offsetWidth;
	            _this.position.top = trigger.offsetTop + trigger.offsetHeight / 2 - popover.offsetHeight / 2;
	            break;
	          case 'right':
	            _this.position.left = trigger.offsetLeft + trigger.offsetWidth;
	            _this.position.top = trigger.offsetTop + trigger.offsetHeight / 2 - popover.offsetHeight / 2;
	            break;
	          case 'bottom':
	            _this.position.left = trigger.offsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2;
	            _this.position.top = trigger.offsetTop + trigger.offsetHeight;
	            break;
	          default:
	            console.warn('Wrong placement prop');
	        }
	        popover.style.top = _this.position.top + 'px';
	        popover.style.left = _this.position.left + 'px';
	      }, 0);
	    }
	  },
	  ready: function ready() {
	    var trigger = this.$els.trigger;
	    if (!trigger) return console.error('Could not find trigger v-el in your component that uses popoverMixin.');
	
	    if (this.trigger === 'focus' && !~trigger.tabIndex) {
	      trigger = (0, _NodeList2.default)('a,input,select,textarea,button', trigger);
	      if (!trigger.length) {
	        trigger = null;
	      }
	    }
	    if (trigger) {
	      var events = { contextmenu: 'contextmenu', hover: 'mouseleave mouseenter', focus: 'blur focus' };
	      (0, _NodeList2.default)(trigger).on(events[this.trigger] || 'click', this.toggle);
	      this._trigger = trigger;
	    }
	  },
	  beforeDestroy: function beforeDestroy() {
	    if (this._trigger) (0, _NodeList2.default)(this._trigger).off();
	  }
	};

/***/ },
/* 131 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getJSON = getJSON;
	exports.getScrollBarWidth = getScrollBarWidth;
	exports.translations = translations;
	// coerce convert som types of data into another type
	var coerce = exports.coerce = {
	  // Convert a string to booleam. Otherwise, return the value without modification, so if is not boolean, Vue throw a warning.
	  boolean: function boolean(val) {
	    return typeof val === 'string' ? val === 'false' || val === 'null' || val === 'undefined' ? false : val === 'true' ? true : val : val;
	  },
	  // Attempt to convert a string value to a Number. Otherwise, return 0.
	  number: function number(val) {
	    var alt = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	    return typeof val === 'number' ? val : val === undefined || val === null || isNaN(Number(val)) ? alt : Number(val);
	  },
	  // Attempt to convert to string any value, except for null or undefined.
	  string: function string(val) {
	    return val === undefined || val === null ? '' : val + '';
	  },
	  // Pattern accept RegExp, function, or string (converted to RegExp). Otherwise return null.
	  pattern: function pattern(val) {
	    return val instanceof Function || val instanceof RegExp ? val : typeof val === 'string' ? new RegExp(val) : null;
	  }
	};
	
	function getJSON(url) {
	  var request = new window.XMLHttpRequest();
	  var data = {};
	  // p (-simulated- promise)
	  var p = {
	    then: function then(fn1, fn2) {
	      return p.done(fn1).fail(fn2);
	    },
	    catch: function _catch(fn) {
	      return p.fail(fn);
	    },
	    always: function always(fn) {
	      return p.done(fn).fail(fn);
	    }
	  }[('done', 'fail')].forEach(function (name) {
	    data[name] = [];
	    p[name] = function (fn) {
	      if (fn instanceof Function) data[name].push(fn);
	      return p;
	    };
	  });
	  p.done(JSON.parse);
	  request.onreadystatechange = function () {
	    if (request.readyState === 4) {
	      (function () {
	        var e = { status: request.status };
	        if (request.status === 200) {
	          try {
	            (function () {
	              var value = void 0,
	                  response = request.responseText;
	              data.done.forEach(function (done) {
	                if ((value = done(response)) !== undefined) {
	                  response = value;
	                }
	              });
	            })();
	          } catch (e) {
	            data.fail.forEach(function (fail) {
	              fail(e);
	            });
	          }
	        } else {
	          data.fail.forEach(function (fail) {
	            fail(e);
	          });
	        }
	      })();
	    }
	  };
	  request.open('GET', url);
	  request.setRequestHeader('Accept', 'application/json');
	  request.send();
	  return p;
	}
	
	function getScrollBarWidth() {
	  if (document.documentElement.scrollHeight <= document.documentElement.clientHeight) {
	    return 0;
	  }
	  var inner = document.createElement('p');
	  inner.style.width = '100%';
	  inner.style.height = '200px';
	
	  var outer = document.createElement('div');
	  outer.style.position = 'absolute';
	  outer.style.top = '0px';
	  outer.style.left = '0px';
	  outer.style.visibility = 'hidden';
	  outer.style.width = '200px';
	  outer.style.height = '150px';
	  outer.style.overflow = 'hidden';
	  outer.appendChild(inner);
	
	  document.body.appendChild(outer);
	  var w1 = inner.offsetWidth;
	  outer.style.overflow = 'scroll';
	  var w2 = inner.offsetWidth;
	  if (w1 === w2) w2 = outer.clientWidth;
	
	  document.body.removeChild(outer);
	
	  return w1 - w2;
	}
	
	// return all the translations or the default language (english)
	function translations(lang) {
	  lang = lang || 'en';
	  var text = {
	    daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
	    limit: 'Limit reached ({{limit}} items max).',
	    loading: 'Loading...',
	    minLength: 'Min. Length',
	    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	    notSelected: 'Nothing Selected',
	    required: 'Required',
	    search: 'Search'
	  };
	  return window.VueStrapLang ? window.VueStrapLang(lang) : text;
	}

/***/ },
/* 132 */
/***/ function(module, exports) {

	module.exports = "\n<span v-el:trigger>\n  <slot></slot>\n</span>\n<div v-el:popover v-if=\"show\" style=\"display:block;\"\n  :class=\"['tooltip',placement]\"\n  :transition=\"effect\">\n  <div class=\"tooltip-arrow\"></div>\n  <div class=\"tooltip-inner\">\n    <slot name=\"content\">{{content}}</slot>\n </div>\n</div>\n";

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getBuildStatus = getBuildStatus;
	exports.getBuildLog = getBuildLog;
	exports.getBuildTaskLog = getBuildTaskLog;
	exports.startBuild = startBuild;
	exports.restartBuild = restartBuild;
	exports.getDeployStatus = getDeployStatus;
	exports.getDeployGroupStatus = getDeployGroupStatus;
	exports.getInstanceStatus = getInstanceStatus;
	exports.getDeployLog = getDeployLog;
	exports.groupContinue = groupContinue;
	exports.retryInstance = retryInstance;
	exports.ignoreInstance = ignoreInstance;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * 获取构建状态
	 */
	function getBuildStatus(params) {
	  return request.get('/api/main/build/status', params);
	}
	
	/*
	 * 获取构建日志
	 */
	/*
	 * --------------------------------------------
	 * 部署
	 * @version  1.0
	 * @author   shirley(hztanxuewei@corp.netease.com)
	 * --------------------------------------------
	 */
	function getBuildLog(params) {
	  return request.get('/api/main/build/getlog', params);
	}
	
	/*
	 * 获取构建完后的日志
	 */
	function getBuildTaskLog(params) {
	  return request.get('/api/main/build/buildTaskLog', params);
	}
	
	/*
	 * 启动单集群的build过程
	 */
	function startBuild(params) {
	  return request.get('/api/main/build/startBuild', params);
	}
	
	/*
	 * 当一次build为error状态下重新启动build
	 */
	function restartBuild(params) {
	  return request.get('/api/main/build/restartBuild', params);
	}
	
	/*
	 * 获取发布状态，包括发布的分组信息，以及分组的状态，以及分组
	 */
	function getDeployStatus(params) {
	  return request.get('/api/main/deploy/status', params);
	}
	
	/*
	 * 获取各个发布批次的状态
	 */
	function getDeployGroupStatus(params) {
	  return request.get('/api/main/deploy/groupStatus', params);
	}
	
	/*
	 * 实例的状态
	 */
	function getInstanceStatus(params) {
	  return request.get('/api/main/deploy/instanceStatus', params);
	}
	
	/*
	 * 获取发布日志
	 */
	function getDeployLog(params) {
	  return request.get('/api/main/deploy/deployLog', params);
	}
	
	/*
	 * 手工启动下一个批次
	 */
	function groupContinue(params) {
	  return request.get('/api/main/deploy/groupContinue', params);
	}
	
	/*
	 * 实例发布error时，重试某个实例
	 */
	function retryInstance(params) {
	  return request.get('/api/main/deploy/retryInstanceAction', params);
	}
	
	/*
	 * 实例发布error时，忽略某个实例
	 */
	function ignoreInstance(params) {
	  return request.get('/api/main/deploy/ignoreInstance', params);
	}

/***/ },
/* 134 */
/***/ function(module, exports) {

	module.exports = "\r\n<div class=\"m-deploy\">\r\n  <p class=\"tlt\"><a v-link=\"{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}\">{{ clusterName }}</a></p>\r\n  <ul v-if=\"auth\" class=\"item-btn\">\r\n    <li class=\"u-btn u-btn-gray disabled\"\r\n        v-if=\"curBuildStatus == 'error' || curBuildStatus == 'ongoing'\">构建\r\n    </li>\r\n    <li class=\"u-btn u-btn-gray\"\r\n        v-else\r\n        @click=\"onBuild\">构建\r\n    </li>\r\n    <template v-for=\"(index, item) in optList\">\r\n      <li v-if=\"index!=0\"><a class=\"u-btn u-btn-gray\" v-link=\"{path: '/home/deploy/'+ item.link, exact: true, query: $route.query}\">{{ item.name }}</a></li>\r\n    </template>\r\n  </ul>\r\n  <ul v-else class=\"item-btn\">\r\n    <li class=\"u-btn u-btn-gray disabled\" v-for=\"item in optList\">{{ item.name }}</li>\r\n  </ul>\r\n  <form class=\"m-form m-form-2\">\r\n      <div class=\"fmitem\">\r\n          <label class=\"fmlab\">构建状态：</label>\r\n          <div class=\"fmcnt f-cb\">\r\n              <spin v-if=\"curBuildStatus == 'ongoing'\"></spin>\r\n              <span class=\"b-name\">{{ buildStatusMap[curBuildStatus] }}</span>\r\n              <tooltip effect=\"scale\" placement=\"top\" :content=\"errorMsg\" v-if=\"curBuildStatus == 'error'\">\r\n                  <span v-if=\"curBuildStatus == 'error'\" \r\n                    class=\"iconfont icon-tip ml10\"></span>\r\n              </tooltip>\r\n              <span v-if=\"curBuildStatus == 'error'\" \r\n                    class=\"u-btn u-btn-small ml30\"\r\n                    @click=\"restartBuild\">重新构建</span>\r\n          </div>\r\n      </div>\r\n      <div class=\"fmitem\">\r\n          <label class=\"fmlab\">最新版本：</label>\r\n          <div class=\"fmcnt\">\r\n              {{ buildMap.currentVersion || '暂无版本' }}\r\n              <span v-if=\"buildMap.buildTaskId\" \r\n                    class=\"u-btn u-btn-small ml30\"\r\n                    @click=\"getBuildTaskLog\">查看日志</span>\r\n          </div>\r\n      </div>\r\n      <div class=\"fmitem row\">\r\n          <label class=\"fmlab\">发布状态：</label>\r\n          <div class=\"fmcnt\">\r\n            <Steps :current=\"curBatchId\" size=\"small\" :status=\"deployStatus\" v-if=\"deployStatus\" v-ref:steps>\r\n                <Step v-for=\"(index, item) in batchGroupList\" \r\n                      :title=\"'组'+(index+1)+(item.actionBatchId==selBatchId?'(选中)':'')\" \r\n                      :id=\"item.actionBatchId\" \r\n                      :status=\"item.status\"\r\n                      :on-step=\"onStep\"></Step>\r\n            </Steps>\r\n            <p v-else style=\"margin-top: -5px;\">不在发布中</p>\r\n            <span class=\"u-btn u-btn-primary u-btn-small\" @click=\"next\" v-if=\"showNext\">继续</span>\r\n          </div>\r\n      </div>\r\n  </form>\r\n  <table class=\"m-table\">\r\n      <thead>\r\n          <tr>\r\n              <th>主机</th>\r\n              <th>实例</th>\r\n              <th>当前模板</th>\r\n              <template v-if=\"deployStatus\">\r\n                <th>目标模板</th>\r\n                <th>发布状态</th>\r\n                <th>操作</th>\r\n              </template>\r\n              <template v-else>\r\n                <th>上次发布时间</th>\r\n                <th>上次发布状态</th>\r\n              </template>\r\n          </tr>\r\n      </thead>\r\n      <tbody>\r\n        <tr v-for=\"item in instanceList\">\r\n            <td title=\"{{ item.hostName }}\">{{ item.hostName }}</td>\r\n            <td title=\"{{ item.instanceName }}\">{{ item.instanceName }}</td>\r\n            <td title=\"{{ item.sourceTemplateName }}\">{{ item.sourceTemplateName }}</td>\r\n            <template v-if=\"deployStatus\">\r\n              <td title=\"{{ item.targetTemplateName }}\">{{ item.targetTemplateName }}</td>\r\n              <td title=\"{{ item.deployStatus }}\">\r\n                <spin v-if=\"item.deployStatus == 'ongoing'\"></spin>\r\n                <i v-if=\"item.deployStatus == 'finish'\" class=\"iconfont icon-success\"></i>\r\n                <i v-if=\"item.deployStatus == 'pending'\" class=\"iconfont icon-wait\"></i>\r\n                <i v-if=\"item.deployStatus == 'error'\" class=\"iconfont icon-error\"></i>\r\n              </td>\r\n              <td class=\"u-btns\">\r\n                  <span class=\"u-btn u-btn-s1\" \r\n                     @click=\"onDeployLog(item.batchInstanceId)\" \r\n                     v-if=\"item.deployStatus != 'pending'\"\r\n                     title=\"发布日志\">发布日志</span>\r\n                  <!-- <span class=\"u-btn u-btn-s1\" \r\n                      @click=\"onAppLog(item.batchInstanceId)\" \r\n                      title=\"应用日志\" \r\n                      style=\"margin-left: 5px;\">应用日志</span> -->\r\n                  <span class=\"u-btn u-btn-s1\" \r\n                      v-if=\"(selBatchStatus == 'ongoing' || selBatchStatus == 'error') && item.deployStatus == 'error'\"\r\n                      @click=\"doRetry(item.batchInstanceId)\" \r\n                      title=\"重试\" \r\n                      style=\"margin-left: 5px;\">重试</span>\r\n                  <span class=\"u-btn u-btn-s1\" \r\n                      v-if=\"(selBatchStatus == 'ongoing' || selBatchStatus == 'error') && item.deployStatus == 'error'\"\r\n                      @click=\"doIgnore(item.batchInstanceId)\" \r\n                      title=\"忽略\" \r\n                      style=\"margin-left: 5px;\">忽略</span>\r\n              </td>\r\n            </template>\r\n            <template v-else>\r\n              <td title=\"{{ item.lastDeployTime | moment 'YYYY-MM-DD HH:mm:ss' }}\">{{ item.lastDeployTime | moment \"YYYY-MM-DD HH:mm:ss\" }}</td>\r\n              <td title=\"{{ item.lastDeployStatus }}\">\r\n                  <span v-if=\"item.lastDeployStatus == 'error'\" \r\n                        class=\"iconfont icon-error\"\r\n                        @click=\"showInstaceErrorMsg(item.lastErrorReason)\"></span>\r\n                  <i v-if=\"item.lastDeployStatus == 'finish'\" class=\"iconfont icon-success\"></i>\r\n                  <i v-if=\"item.lastDeployStatus == 'pending'\" class=\"iconfont icon-wait\"></i>\r\n              </td>\r\n            </template>\r\n        </tr>\r\n      </tbody>\r\n  </table>\r\n</div>\r\n<modal :show.sync=\"showModal\" :bottom-bar=\"false\">\r\n    <h3 slot=\"header\">错误信息</h3>\r\n    <div slot=\"body\">\r\n      {{ instanceErrorMsg }}\r\n    </div>\r\n</modal>\r\n<!-- 显示日志 -->\r\n<div class=\"m-log\" v-if=\"showLog\">\r\n  <i class=\"iconfont icon-del-2\" @click=\"closeLog\"></i>\r\n  <!-- 构建日志 -->\r\n  <ul v-el:log\r\n      v-if=\"curBuildStatus=='ongoing'\"\r\n      class=\"log\">\r\n    <li v-for=\"(index, item) in logList\" track-by=\"$index\">{{ item }}</li>\r\n  </ul>\r\n  <!-- 查看日志 -->\r\n  <div v-el:log\r\n       v-else\r\n       class=\"log\">\r\n    {{{ logs }}}\r\n  </div>\r\n</div>\r\n";

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(136)
	__vue_script__ = __webpack_require__(137)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/deploy/Deploy.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(146)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Deploy.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 136 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Common = __webpack_require__(138);
	
	var _Common2 = _interopRequireDefault(_Common);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _deployBuild = __webpack_require__(144);
	
	var service = _interopRequireWildcard(_deployBuild);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { modal: _Modal2.default, Common: _Common2.default },
	  data: function data() {
	    return {
	      query: this.$route.query,
	      clusterId: this.$route.query.clusterId
	    };
	  },
	  ready: function ready() {},
	
	  methods: {
	    doDeploy: function doDeploy() {
	      var _this = this;
	
	      if (!this.$refs.child) return;
	      var list = this.$refs.child.batchList;
	      list = this.$refs.child.handleContinue(list);
	
	      service.doDeploy({
	        clusterId: this.clusterId,
	        batchList: list,
	        strategy: this.$refs.child.obj,
	        workflowType: 'deploy'
	      }).then(function (data) {
	        _vue2.default.$alert('开始发布', 'success');
	        _this.go();
	      });
	    },
	    go: function go() {
	      this.$router.go({ path: '/home/deploy', query: this.query });
	    }
	  }
	};

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(139)
	__vue_script__ = __webpack_require__(140)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/deploy/Common.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(145)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Common.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 139 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _stringify = __webpack_require__(141);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _dragAndDrop = __webpack_require__(143);
	
	var _deployBuild = __webpack_require__(144);
	
	var service = _interopRequireWildcard(_deployBuild);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { modal: _Modal2.default },
	  props: {
	    type: {
	      type: String,
	      default: 'deploy'
	    },
	    doSubmit: {
	      type: Function,
	      default: function _default() {}
	    }
	  },
	  data: function data() {
	    return {
	      query: this.$route.query,
	      clusterId: this.$route.query.clusterId,
	      clusterName: '',
	      planId: '',
	      deployPlanList: [],
	      batchList: [],
	      sourceBatchList: [],
	      restList: [],
	      excludeServerList: [],
	      showModal: false,
	      typeMap: {
	        'deploy': '发布',
	        'buildAndDeploy': '一键发布',
	        'rollback': '回滚',
	        'restart': '重启',
	        'stop': '停止',
	        'online': '上线',
	        'offline': '下线'
	      },
	
	      obj: {
	        clusterId: this.$route.query.clusterId,
	        numOfBatch: 3,
	        instanceInDiffBatch: false,
	        instanceDivisionType: 'oneInFirstBatch',
	        pauseType: 'pauseEachBatch',
	        mulTemplates: [],
	        justDeployedInstance: false
	      },
	
	      curPlanName: '',
	      curDefault: false
	    };
	  },
	  ready: function ready() {
	    this.$parent.$parent.getClusterName(this.query);
	    this.getDeployPlanList();
	    this.type && this.getDeployedInstance();
	  },
	
	  computed: {
	    showType: function showType(val) {
	      if (this.type == 'restart' || this.type == 'stop' || this.type == 'online' || this.type == 'offline') {
	        return false;
	      } else {
	        return true;
	      }
	    }
	  },
	  methods: {
	    getDeployPlanList: function getDeployPlanList() {
	      var _this = this;
	
	      service.getDeployPlanList(this.clusterId).then(function (data) {
	        _this.deployPlanList = data.list || [];
	      });
	    },
	    changePlan: function changePlan(id) {
	      var _this2 = this;
	
	      service.getDeployPlanDetail(this.clusterId, {
	        planId: id
	      }).then(function (data) {
	        _this2.batchList = data.batchList || [];
	        _this2.handleContinue(_this2.batchList);
	        _this2.obj = data.strategy;
	        _this2.obj.mulTemplates = _this2.obj.mulTemplates.map(function (item) {
	          item.destTemplateId = item.sourceTemplateId;
	          return item;
	        });
	      });
	    },
	    handleContinue: function handleContinue(list) {
	      list.forEach(function (item) {
	        item.continueIfSuccess = !item.continueIfSuccess;
	      });
	      return list;
	    },
	    doBatch: function doBatch() {
	      var _this3 = this;
	
	      this.obj.justDeployedInstance = !this.showType;
	      service.getDivision(this.obj).then(function (data) {
	        _this3.sourceBatchList = JSON.parse((0, _stringify2.default)(data.list)) || [];
	        _this3.batchList = JSON.parse((0, _stringify2.default)(data.list)) || [];
	        _this3.batchList.map(function (item, index) {
	          item.instanceList.map(function (item1, index1) {
	            item1.type = index + '-' + index1;
	            return item1;
	          });
	          return item;
	        });
	        _this3.sourceBatchList.map(function (item, index) {
	          item.instanceList.map(function (item1, index1) {
	            item1.type = index + '-' + index1;
	            return item1;
	          });
	          return item;
	        });
	        _this3.excludeServerList = [];
	        _this3.handleContinue(_this3.batchList);
	      });
	    },
	    go: function go() {
	      this.$router.go({ path: '/home/deploy', query: this.query });
	    },
	    doCancel: function doCancel() {
	      this.go();
	    },
	    onAddPlan: function onAddPlan() {
	      this.showModal = true;
	      this.deployPlanList.push({
	        planName: '',
	        default: false
	      });
	    },
	    doAddPlan: function doAddPlan() {
	      var _this4 = this;
	
	      if (!this.curPlanName) {
	        _vue2.default.$alert('请输入发布名称', 'danger');
	        return;
	      }
	      this.handleContinue(this.batchList);
	      service.createDeployPlan({
	        clusterId: +this.clusterId,
	        planName: this.curPlanName,
	        isDefault: !!this.curDefault,
	        batchList: this.batchList
	      }).then(function (data) {
	        _vue2.default.$alert('添加发布计划成功', 'success');
	        _this4.getDeployPlanList();
	        _this4.showModal = false;
	      });
	    },
	    delPlan: function delPlan(id) {
	      var _this5 = this;
	
	      service.delDeployPlan(this.clusterId, {
	        planId: id
	      }).then(function (data) {
	        _vue2.default.$alert('删除发布计划成功', 'success');
	        _this5.getDeployPlanList();
	      });
	    },
	    getDeployedInstance: function getDeployedInstance() {
	      var _this6 = this;
	
	      service.getDeployedInstance(this.clusterId).then(function (data) {
	        _this6.batchList = data.list || [];
	      });
	    },
	    onDragStart: function onDragStart(event) {
	      (0, _dragAndDrop.onDragStart)(event);
	      this.oldId = event.target.parentNode.id;
	    },
	    onDragOver: function onDragOver(event) {
	      (0, _dragAndDrop.onDragOver)(event);
	    },
	    onDragEnd: function onDragEnd(event) {
	      (0, _dragAndDrop.onDragEnd)(event);
	
	      var id = event.target.id;
	      var arr = id.split('-');
	
	      var newId = event.toElement.parentNode.id;
	
	      if (this.oldId == newId) return;
	
	      if ((this.oldId || this.oldId == '0') && (newId || newId == '0')) {
	        this.batchList[newId].instanceList.push(this.sourceBatchList[arr[0]].instanceList[arr[1]]);
	        this.batchList[arr[0]].instanceList = this.batchList[arr[0]].instanceList.filter(function (item) {
	          return item.type != id;
	        });
	      } else if ((this.oldId || this.oldId == '0') && !(newId || newId == '0')) {
	        this.excludeServerList.push(this.sourceBatchList[arr[0]].instanceList[arr[1]]);
	        this.batchList[arr[0]].instanceList = this.batchList[arr[0]].instanceList.filter(function (item) {
	          return item.type != id;
	        });
	      } else if (!(this.oldId || this.oldId == '0') && (newId || newId == '0')) {
	        this.excludeServerList = this.excludeServerList.filter(function (item) {
	          return item.type != id;
	        });
	        this.batchList[newId].instanceList.push(this.sourceBatchList[arr[0]].instanceList[arr[1]]);
	      } else {}
	      this.oldId = '';
	      this.$log('batchList');
	    }
	  }
	};

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(142), __esModule: true };

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var core = __webpack_require__(34),
	    $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
	module.exports = function stringify(it) {
	  // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ },
/* 143 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.onDragStart = onDragStart;
	exports.onDragEnd = onDragEnd;
	exports.onDragOver = onDragOver;
	/*
	 * --------------------------------------------
	 * 拖放
	 * @version  1.0
	 * @author   shirley(hztanxuewei@corp.netease.com)
	 * --------------------------------------------
	 */
	var manager = {};
	
	var getElementIndex = function getElementIndex(element) {
	    return Array.prototype.indexOf.call(element.parentElement.children, element);
	};
	
	function onDragStart(e) {
	    manager.source = e.target;
	    e.dataTransfer.effectAllowed = 'move';
	    e.dataTransfer.setData("text/html", e.target.innerHTML);
	    setTimeout(function () {
	        e.target.className = 'w2 graph js-blog z-dragSource';
	    }, 0);
	}
	function onDragEnd(e) {
	    e.target.className = 'w2 graph js-blog';
	}
	function onDragOver(e) {
	    e.preventDefault();
	
	    var source = manager.source;
	    var target = e.target;
	
	    while (target && target.tagName !== 'TR') {
	        target = target.parentElement;
	    }if (!target || target.tagName !== 'TR') return;
	
	    // 排除source和target相同的情况
	    if (source === target) return;
	
	    var sourceParent = source.parentElement;
	    var targetParent = target.parentElement;
	    var sourceIndex = getElementIndex(source);
	    var targetIndex = getElementIndex(target);
	
	    // 删除起始元素
	    sourceParent.removeChild(source);
	
	    // 再将起始元素插入到新的位置
	    if (sourceIndex >= targetIndex || sourceParent !== targetParent) targetParent.insertBefore(source, target);else targetParent.insertBefore(source, target.nextElementSibling);
	}

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getDeployPlanList = getDeployPlanList;
	exports.getDeployPlanDetail = getDeployPlanDetail;
	exports.createDeployPlan = createDeployPlan;
	exports.updateDeployPlan = updateDeployPlan;
	exports.delDeployPlan = delDeployPlan;
	exports.getDivision = getDivision;
	exports.doDeploy = doDeploy;
	exports.getDeployedInstance = getDeployedInstance;
	exports.doBuildAndDeploy = doBuildAndDeploy;
	exports.getBuildVersionList = getBuildVersionList;
	exports.doRollBack = doRollBack;
	exports.doRestart = doRestart;
	exports.doStop = doStop;
	exports.doOnline = doOnline;
	exports.doOffline = doOffline;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * 获取发布计划列表
	 */
	function getDeployPlanList(clusterId) {
	  return request.get('/api/deployPlan/listDeployPlan/' + clusterId, {});
	}
	
	/*
	 * 获取具体的发布计划详情
	 */
	/*
	 * --------------------------------------------
	 * 发布批次配置
	 * @version  1.0
	 * @author   shirley(hztanxuewei@corp.netease.com)
	 * --------------------------------------------
	 */
	function getDeployPlanDetail(clusterId, params) {
	  return request.get('/api/deployPlan/getDeployPlan/' + clusterId, params);
	}
	
	/*
	 * 添加发布计划
	 */
	function createDeployPlan(params) {
	  return request.post('/api/deployPlan/createDeployPlan', params);
	}
	
	/*
	 * 更新发布计划
	 */
	function updateDeployPlan(params) {
	  return request.put('/api/deployPlan/updateDeployPlan', params);
	}
	
	/*
	 * 删除发布计划
	 */
	function delDeployPlan(clusterId, params) {
	  return request.del('/api/deployPlan/deleteDeployPlan/' + clusterId, params);
	}
	
	/*
	 * 获取分组
	 */
	function getDivision(params) {
	  return request.post('/api/deployPlan/groupDivision', params);
	}
	
	/*
	 * 执行 -- 发布
	 */
	function doDeploy(params) {
	  return request.post('/api/main/deploy/doDeploy', params);
	}
	
	/*
	 * 重启、停止、上线和上线获取实例组合
	 */
	function getDeployedInstance(clusterId) {
	  return request.get('/api/deployPlan/getDeployedInstance/' + clusterId, {});
	}
	
	/*
	 * 执行 -- 一键发布
	 */
	function doBuildAndDeploy(params) {
	  return request.post('/api/main/deploy/doBuildAndDeploy', params);
	}
	
	/*
	 * 一键发布 -- 获取构建版本
	 */
	function getBuildVersionList(clusterId) {
	  return request.get('/api/deployPlan/listBuildVersionList/' + clusterId, {});
	}
	
	/*
	 * 执行 -- 回滚
	 */
	function doRollBack(params) {
	  return request.post('/api/main/deploy/doRollBack', params);
	}
	
	/*
	 * 执行 -- 重启
	 */
	function doRestart(params) {
	  return request.post('/api/main/deploy/doRestart', params);
	}
	
	/*
	 * 执行 --停止
	 */
	function doStop(params) {
	  return request.post('/api/main/deploy/doStop', params);
	}
	
	/*
	 * 执行 -- 上线
	 */
	function doOnline(params) {
	  return request.post('/api/main/deploy/doOnline', params);
	}
	
	/*
	 * 执行 -- 下线
	 */
	function doOffline(params) {
	  return request.post('/api/main/deploy/doOffline', params);
	}

/***/ },
/* 145 */
/***/ function(module, exports) {

	module.exports = "\n<div _v-ae551a74=\"\">\n  <p class=\"tlt\" _v-ae551a74=\"\"><a v-link=\"{path: '/home/list', exact: true, query: {'productId': $route.query.productId, 'appId': $route.query.appId}}\" _v-ae551a74=\"\">{{ clusterName }}</a>&nbsp;&gt;&nbsp;{{ typeMap[type] }}</p>\n  <h3 _v-ae551a74=\"\">分组配置</h3>\n  <form class=\"m-form\" _v-ae551a74=\"\">\n    <div class=\"fmitem\" v-if=\"showType\" _v-ae551a74=\"\">\n        <label class=\"fmlab\" _v-ae551a74=\"\">现有配置列表：</label>\n        <div class=\"fmcnt\" _v-ae551a74=\"\">\n            <select v-model=\"planId\" @change=\"changePlan(planId)\" _v-ae551a74=\"\">\n              <option value=\"\" _v-ae551a74=\"\">当前配置</option>\n              <option value=\"{{ item.id }}\" v-for=\"item in deployPlanList\" _v-ae551a74=\"\">{{ item.planName }}</option>\n            </select>\n        </div>\n    </div>\n    <div class=\"fmitem\" _v-ae551a74=\"\">\n        <label class=\"fmlab\" _v-ae551a74=\"\"><i _v-ae551a74=\"\">*</i>批次：</label>\n        <div class=\"fmcnt\" _v-ae551a74=\"\">\n            <input type=\"text\" name=\"\" class=\"u-ipt\" v-model=\"obj.numOfBatch\" _v-ae551a74=\"\">\n        </div>\n    </div>\n    <div class=\"fmitem\" _v-ae551a74=\"\">\n        <label class=\"fmlab\" _v-ae551a74=\"\">多实例分开发布：</label>\n        <div class=\"fmcnt\" _v-ae551a74=\"\">\n            <input type=\"checkbox\" name=\"instanceInDiffBatch\" v-model=\"obj.instanceInDiffBatch\" _v-ae551a74=\"\">是\n        </div>\n    </div>\n    <div class=\"fmitem\" _v-ae551a74=\"\">\n        <label class=\"fmlab\" _v-ae551a74=\"\">实例分布策略：</label>\n        <div class=\"fmcnt\" _v-ae551a74=\"\">\n            <input type=\"radio\" name=\"strategy\" value=\"oneInFirstBatch\" v-model=\"obj.instanceDivisionType\" _v-ae551a74=\"\">第一组一个，其他均分\n            <input type=\"radio\" name=\"strategy\" value=\"allDivision\" v-model=\"obj.instanceDivisionType\" _v-ae551a74=\"\">全部均分\n        </div>\n    </div>\n    <div class=\"fmitem\" _v-ae551a74=\"\">\n        <label class=\"fmlab\" _v-ae551a74=\"\">暂停策略：</label>\n        <div class=\"fmcnt\" _v-ae551a74=\"\">\n            <input type=\"radio\" name=\"pauseType\" value=\"pauseEachBatch\" v-model=\"obj.pauseType\" _v-ae551a74=\"\">每组暂停\n            <input type=\"radio\" name=\"pauseType\" value=\"pauseOnlyFirstBatch\" v-model=\"obj.pauseType\" _v-ae551a74=\"\">第一组暂停\n        </div>\n    </div>\n    <div class=\"fmitem\" v-if=\"obj.mulTemplates.length!=0\" _v-ae551a74=\"\">\n        <label class=\"fmlab\" _v-ae551a74=\"\">实例模板：</label>\n        <div class=\"fmcnt\" _v-ae551a74=\"\">\n            <div class=\"fmitem\" v-for=\"item in obj.mulTemplates\" _v-ae551a74=\"\">\n                <label class=\"fmlab\" _v-ae551a74=\"\">{{ item.instanceName }}：</label>\n                <div class=\"fmcnt\" _v-ae551a74=\"\">\n                    <input type=\"radio\" name=\"template\" value=\"{{ item.sourceTemplateId }}\" v-model=\"item.destTemplateId\" _v-ae551a74=\"\">{{ item.sourceTemplateName }}\n                    <input type=\"radio\" name=\"template\" value=\"{{ item.replaceTemplateId }}\" v-model=\"item.destTemplateId\" _v-ae551a74=\"\">{{ item.replaceTemplateName }}\n                </div>\n            </div>\n        </div>\n    </div>\n    <div class=\"fmitem\" _v-ae551a74=\"\">\n        <label class=\"fmlab\" _v-ae551a74=\"\"></label>\n        <div class=\"fmcnt\" _v-ae551a74=\"\">\n            <span class=\"u-btn u-btn-primary\" @click=\"doBatch\" _v-ae551a74=\"\">分配</span>\n        </div>\n    </div>\n  </form>\n  <div class=\"f-cb\" v-if=\"batchList.length!=0\" _v-ae551a74=\"\">\n      <h3 _v-ae551a74=\"\">分组情况</h3>\n      <div class=\"m-group f-cb\" _v-ae551a74=\"\">\n          <div class=\"gr-left f-fl\" _v-ae551a74=\"\">\n              <div class=\"item\" v-for=\"(index, item) in batchList\" _v-ae551a74=\"\">\n                <p _v-ae551a74=\"\">组{{ index+1 }}：<input type=\"checkbox\" name=\"\" class=\"ml30\" value=\"item.continueIfSuccess\" v-model=\"item.continueIfSuccess\" _v-ae551a74=\"\">完成后暂停</p>\n                <div class=\"item-table\" _v-ae551a74=\"\">\n                    <table class=\"m-table\" _v-ae551a74=\"\">\n                      <thead _v-ae551a74=\"\">\n                        <tr _v-ae551a74=\"\">\n                          <th _v-ae551a74=\"\">服务器</th>\n                          <th _v-ae551a74=\"\">实例</th>\n                          <th _v-ae551a74=\"\">当前模板</th>\n                          <th _v-ae551a74=\"\">目标模板</th>\n                        </tr>\n                      </thead>\n                      <tbody @dragstart=\"onDragStart($event)\" @dragend=\"onDragEnd($event)\" @dragover=\"onDragOver($event)\" id=\"{{ index }}\" _v-ae551a74=\"\">\n                        <tr v-for=\"instance in item.instanceList\" draggable=\"true\" id=\"{{ instance.type }}\" _v-ae551a74=\"\">\n                          <td _v-ae551a74=\"\">{{ instance.serverName }}</td>\n                          <td _v-ae551a74=\"\">{{ instance.instanceName }}</td>\n                          <td _v-ae551a74=\"\">{{ instance.currentTemplate?instance.currentTemplate.name:'' }}</td>\n                          <td _v-ae551a74=\"\">{{ instance.destTemplate?instance.destTemplate.name:'' }}</td>\n                        </tr>\n                        <tr draggable=\"true\" v-if=\"item.instanceList.length==0\" _v-ae551a74=\"\">\n                          <td _v-ae551a74=\"\">无数据</td>\n                          <td _v-ae551a74=\"\"></td>\n                          <td _v-ae551a74=\"\"></td>\n                          <td _v-ae551a74=\"\"></td>\n                        </tr>\n                      </tbody>\n                    </table>\n                </div>\n              </div>\n          </div>\n          <div class=\"gr-right f-fr\" _v-ae551a74=\"\">\n              <h3 _v-ae551a74=\"\">不发布组</h3>\n              <div class=\"item-table\" _v-ae551a74=\"\">\n                  <table class=\"m-table\" _v-ae551a74=\"\">\n                    <thead _v-ae551a74=\"\">\n                      <tr _v-ae551a74=\"\">\n                        <th _v-ae551a74=\"\">服务器</th>\n                        <th _v-ae551a74=\"\">实例</th>\n                        <th _v-ae551a74=\"\">当前模板</th>\n                        <th _v-ae551a74=\"\">目标模板</th>\n                      </tr>\n                    </thead>\n                    <tbody @dragstart=\"onDragStart($event)\" @dragend=\"onDragEnd($event)\" @dragover=\"onDragOver($event)\" _v-ae551a74=\"\">\n                        <tr v-for=\"instance in excludeServerList\" draggable=\"true\" id=\"{{ instance.type }}\" _v-ae551a74=\"\">\n                          <td _v-ae551a74=\"\">{{ instance.serverName }}</td>\n                          <td _v-ae551a74=\"\">{{ instance.instanceName }}</td>\n                          <td _v-ae551a74=\"\">{{ instance.currentTemplate?instance.currentTemplate.name:'' }}</td>\n                          <td _v-ae551a74=\"\">{{ instance.destTemplate?instance.destTemplate.name:'' }}</td>\n                        </tr>\n                        <tr draggable=\"true\" v-if=\"excludeServerList.length==0\" _v-ae551a74=\"\">\n                          <td _v-ae551a74=\"\">无数据</td>\n                          <td _v-ae551a74=\"\"></td>\n                          <td _v-ae551a74=\"\"></td>\n                          <td _v-ae551a74=\"\"></td>\n                        </tr>\n                    </tbody>\n                  </table>\n              </div>\n          </div>\n      </div>\n      <div class=\"ft\" _v-ae551a74=\"\">\n        <span class=\"u-btn\" @click=\"doCancel\" _v-ae551a74=\"\">取消</span>\n        <span class=\"u-btn u-btn-primary ml30\" @click=\"doSubmit\" _v-ae551a74=\"\">{{ typeMap[type] }}</span>\n        <span class=\"u-btn u-btn-primary ml30\" v-if=\"showType\" @click=\"onAddPlan\" _v-ae551a74=\"\">保存配置</span>\n      </div>\n  </div>\n</div>\n<!-- 添加发布计划 -->\n  <modal :show.sync=\"showModal\" :bottom-bar=\"false\" _v-ae551a74=\"\">\n    <h3 slot=\"header\" _v-ae551a74=\"\">添加发布计划</h3>\n    <div slot=\"body\" _v-ae551a74=\"\">\n      <table class=\"m-table\" _v-ae551a74=\"\">\n        <thead _v-ae551a74=\"\">\n          <tr _v-ae551a74=\"\">\n            <th _v-ae551a74=\"\">配置名</th>\n            <th _v-ae551a74=\"\">是否默认</th>\n            <th _v-ae551a74=\"\">操作</th>\n          </tr>\n        </thead>\n\n        <tbody _v-ae551a74=\"\">\n          <tr v-for=\"item in deployPlanList\" _v-ae551a74=\"\">\n            <td v-if=\"item.id\" _v-ae551a74=\"\">{{ item.planName }}</td>\n            <td v-else=\"\" _v-ae551a74=\"\"><input type=\"text\" class=\"u-ipt u-ipt-auto\" value=\"{{ curPlanName }}\" v-model=\"curPlanName\" placeholder=\"请输入发布名称\" _v-ae551a74=\"\"></td>\n            <td v-if=\"item.id\" _v-ae551a74=\"\"><input type=\"radio\" checked=\"{{ !!item.default }}\" name=\"default\" _v-ae551a74=\"\"></td>\n            <td v-else=\"\" _v-ae551a74=\"\"><input type=\"radio\" checked=\"{{ !!curDefault }}\" name=\"default\" v-model=\"curDefault\" _v-ae551a74=\"\"></td>\n            <td _v-ae551a74=\"\">\n                <i v-if=\"item.id\" class=\"iconfont icon-del\" title=\"删除\" @click=\"delPlan(item.id)\" _v-ae551a74=\"\"></i>\n                <i v-else=\"\" class=\"iconfont icon-add\" title=\"添加\" @click=\"doAddPlan\" _v-ae551a74=\"\"></i>\n            </td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </modal>\n";

/***/ },
/* 146 */
/***/ function(module, exports) {

	module.exports = "\n<common :type=\"'deploy'\" :do-submit=\"doDeploy\" v-ref:child=\"\" _v-546a487c=\"\"></common>\n";

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(148)
	__vue_script__ = __webpack_require__(149)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/deploy/BuildAndDeploy.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(150)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./BuildAndDeploy.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 148 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Common = __webpack_require__(138);
	
	var _Common2 = _interopRequireDefault(_Common);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _deployBuild = __webpack_require__(144);
	
	var service = _interopRequireWildcard(_deployBuild);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { modal: _Modal2.default, Common: _Common2.default },
	  data: function data() {
	    return {
	      query: this.$route.query,
	      clusterId: this.$route.query.clusterId
	    };
	  },
	  ready: function ready() {},
	
	  methods: {
	    doBuildAndDeploy: function doBuildAndDeploy() {
	      var _this = this;
	
	      if (!this.$refs.child) return;
	      var list = this.$refs.child.batchList;
	      list = this.$refs.child.handleContinue(list);
	
	      service.doBuildAndDeploy({
	        clusterId: this.clusterId,
	        batchList: list,
	        strategy: this.$refs.child.obj,
	        workflowType: 'buildAndDeploy'
	      }).then(function (data) {
	        _vue2.default.$alert('开始一键发布', 'success');
	        _this.go();
	      });
	    },
	    go: function go() {
	      this.$router.go({ path: '/home/deploy', query: this.query });
	    }
	  }
	};

/***/ },
/* 150 */
/***/ function(module, exports) {

	module.exports = "\n<common :type=\"'buildAndDeploy'\" :do-submit=\"doBuildAndDeploy\" v-ref:child=\"\" _v-01fc6a2b=\"\"></common>\n";

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(152)
	__vue_script__ = __webpack_require__(153)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/deploy/RollBack.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(154)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./RollBack.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 152 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Common = __webpack_require__(138);
	
	var _Common2 = _interopRequireDefault(_Common);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _deployBuild = __webpack_require__(144);
	
	var service = _interopRequireWildcard(_deployBuild);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { modal: _Modal2.default, Common: _Common2.default },
	  data: function data() {
	    return {
	      query: this.$route.query,
	      clusterId: this.$route.query.clusterId,
	      showModal: false,
	      versionList: [],
	      versionId: ''
	    };
	  },
	  ready: function ready() {},
	
	  methods: {
	    getBuildVersionList: function getBuildVersionList() {
	      var _this = this;
	
	      service.getBuildVersionList(this.clusterId).then(function (data) {
	        _this.versionList = data.list || [];
	      });
	    },
	    onRollBack: function onRollBack() {
	      this.getBuildVersionList();
	      this.showModal = true;
	    },
	    doRollBack: function doRollBack() {
	      var _this2 = this;
	
	      if (!this.versionId) {
	        _vue2.default.$alert('请选择回滚版本', 'danger');
	        return;
	      }
	      if (!this.$refs.child) return;
	      var list = this.$refs.child.batchList;
	      list = this.$refs.child.handleContinue(list);
	
	      service.doRollBack({
	        clusterId: this.clusterId,
	        batchList: list,
	        strategy: this.$refs.child.obj,
	        workflowType: 'deploy',
	        rollBackBuildVersionId: this.versionId
	      }).then(function (data) {
	        _vue2.default.$alert('开始回滚', 'success');
	        _this2.go();
	      });
	    },
	    go: function go() {
	      this.$router.go({ path: '/home/deploy', query: this.query });
	    }
	  }
	};

/***/ },
/* 154 */
/***/ function(module, exports) {

	module.exports = "\n<common :type=\"'rollback'\" :do-submit=\"onRollBack\" v-ref:child=\"\" _v-1b8ea29f=\"\"></common>\n\n<!-- 回滚选择历史版本 -->\n<modal :show.sync=\"showModal\" :submit=\"doRollBack\" _v-1b8ea29f=\"\">\n  <h3 slot=\"header\" _v-1b8ea29f=\"\">回滚</h3>\n  <div slot=\"body\" _v-1b8ea29f=\"\">\n    <form class=\"m-form\" _v-1b8ea29f=\"\">\n      <div class=\"fmitem\" _v-1b8ea29f=\"\">\n          <label class=\"fmlab\" _v-1b8ea29f=\"\"><i _v-1b8ea29f=\"\">*</i>历史版本：</label>\n          <div class=\"fmcnt\" _v-1b8ea29f=\"\">\n              <select v-model=\"versionId\" _v-1b8ea29f=\"\">\n                <option value=\"\" _v-1b8ea29f=\"\">请选择</option>\n                <option value=\"{{ item.id }}\" v-for=\"item in versionList\" _v-1b8ea29f=\"\">{{ item.versionId }}</option>\n              </select>\n          </div>\n      </div>\n    </form>\n  </div>\n</modal>\n";

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(156)
	__vue_script__ = __webpack_require__(157)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/deploy/Restart.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(158)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Restart.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 156 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Common = __webpack_require__(138);
	
	var _Common2 = _interopRequireDefault(_Common);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _deployBuild = __webpack_require__(144);
	
	var service = _interopRequireWildcard(_deployBuild);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { modal: _Modal2.default, Common: _Common2.default },
	  data: function data() {
	    return {
	      query: this.$route.query,
	      clusterId: this.$route.query.clusterId,
	      type: 'restart'
	    };
	  },
	  ready: function ready() {},
	
	  methods: {
	    doRestart: function doRestart() {
	      var _this = this;
	
	      if (!this.$refs.child) return;
	      var list = this.$refs.child.batchList;
	      list = this.$refs.child.handleContinue(list);
	
	      service.doRestart({
	        clusterId: this.clusterId,
	        batchList: list,
	        strategy: this.$refs.child.obj,
	        workflowType: this.type
	      }).then(function (data) {
	        _vue2.default.$alert('开始重启', 'success');
	        _this.go();
	      });
	    },
	    go: function go() {
	      this.$router.go({ path: '/home/deploy', query: this.query });
	    }
	  }
	};

/***/ },
/* 158 */
/***/ function(module, exports) {

	module.exports = "\n<common :type=\"type\" :do-submit=\"doRestart\" v-ref:child=\"\" _v-1719a5c4=\"\"></common>\n";

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(160)
	__vue_script__ = __webpack_require__(161)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/deploy/Stop.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(162)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Stop.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 160 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Common = __webpack_require__(138);
	
	var _Common2 = _interopRequireDefault(_Common);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _deployBuild = __webpack_require__(144);
	
	var service = _interopRequireWildcard(_deployBuild);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { modal: _Modal2.default, Common: _Common2.default },
	  data: function data() {
	    return {
	      query: this.$route.query,
	      clusterId: this.$route.query.clusterId,
	      type: 'stop'
	    };
	  },
	  ready: function ready() {},
	
	  methods: {
	    doStop: function doStop() {
	      var _this = this;
	
	      if (!this.$refs.child) return;
	      var list = this.$refs.child.batchList;
	      list = this.$refs.child.handleContinue(list);
	
	      service.doStop({
	        clusterId: this.clusterId,
	        batchList: list,
	        strategy: this.$refs.child.obj,
	        workflowType: this.type
	      }).then(function (data) {
	        _vue2.default.$alert('正在终止', 'success');
	        _this.go();
	      });
	    },
	    go: function go() {
	      this.$router.go({ path: '/home/deploy', query: this.query });
	    }
	  }
	};

/***/ },
/* 162 */
/***/ function(module, exports) {

	module.exports = "\n<common :type=\"type\" :do-submit=\"doStop\" v-ref:child=\"\" _v-eb94fbc6=\"\"></common>\n";

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(164)
	__vue_script__ = __webpack_require__(165)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/deploy/Online.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(166)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Online.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 164 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Common = __webpack_require__(138);
	
	var _Common2 = _interopRequireDefault(_Common);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _deployBuild = __webpack_require__(144);
	
	var service = _interopRequireWildcard(_deployBuild);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { modal: _Modal2.default, Common: _Common2.default },
	  data: function data() {
	    return {
	      query: this.$route.query,
	      clusterId: this.$route.query.clusterId,
	      type: 'online'
	    };
	  },
	  ready: function ready() {},
	
	  methods: {
	    doOnline: function doOnline() {
	      var _this = this;
	
	      if (!this.$refs.child) return;
	      var list = this.$refs.child.batchList;
	      list = this.$refs.child.handleContinue(list);
	
	      service.doOnline({
	        clusterId: this.clusterId,
	        batchList: list,
	        strategy: this.$refs.child.obj,
	        workflowType: this.type
	      }).then(function (data) {
	        _vue2.default.$alert('开始上线', 'success');
	        _this.go();
	      });
	    },
	    go: function go() {
	      this.$router.go({ path: '/home/deploy', query: this.query });
	    }
	  }
	};

/***/ },
/* 166 */
/***/ function(module, exports) {

	module.exports = "\n<common :type=\"type\" :do-submit=\"doOnline\" v-ref:child=\"\" _v-4a548b2e=\"\"></common>\n";

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(168)
	__vue_script__ = __webpack_require__(169)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/home/deploy/Offline.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(170)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Offline.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 168 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Common = __webpack_require__(138);
	
	var _Common2 = _interopRequireDefault(_Common);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _deployBuild = __webpack_require__(144);
	
	var service = _interopRequireWildcard(_deployBuild);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { modal: _Modal2.default, Common: _Common2.default },
	  data: function data() {
	    return {
	      query: this.$route.query,
	      clusterId: this.$route.query.clusterId,
	      type: 'offline'
	    };
	  },
	  ready: function ready() {},
	
	  methods: {
	    doOffline: function doOffline() {
	      var _this = this;
	
	      if (!this.$refs.child) return;
	      var list = this.$refs.child.batchList;
	      list = this.$refs.child.handleContinue(list);
	
	      service.doOffline({
	        clusterId: this.clusterId,
	        batchList: list,
	        strategy: this.$refs.child.obj,
	        workflowType: this.type
	      }).then(function (data) {
	        _vue2.default.$alert('开始下线', 'success');
	        _this.go();
	      });
	    },
	    go: function go() {
	      this.$router.go({ path: '/home/deploy', query: this.query });
	    }
	  }
	};

/***/ },
/* 170 */
/***/ function(module, exports) {

	module.exports = "\n<common :type=\"type\" :do-submit=\"doOffline\" v-ref:child=\"\" _v-25bd0b98=\"\"></common>\n";

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(172)
	__vue_script__ = __webpack_require__(173)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/sysConfig/index.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(185)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./index.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 172 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Tab = __webpack_require__(174);
	
	var _Tab2 = _interopRequireDefault(_Tab);
	
	var _Tabs = __webpack_require__(177);
	
	var _Tabs2 = _interopRequireDefault(_Tabs);
	
	var _TabGroup = __webpack_require__(181);
	
	var _TabGroup2 = _interopRequireDefault(_TabGroup);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { Tab: _Tab2.default, Tabs: _Tabs2.default, TabGroup: _TabGroup2.default },
	  data: function data() {
	    return {};
	  },
	
	  methods: {}
	};

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__vue_script__ = __webpack_require__(175)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Tab.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(176)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Tab.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _coerceBoolean = __webpack_require__(16);
	
	var _coerceBoolean2 = _interopRequireDefault(_coerceBoolean);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  props: {
	    header: {
	      type: String
	    },
	    disabled: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: false
	    },
	    url: {
	      type: String
	    }
	  },
	  computed: {
	    active: function active() {
	      return this._tabset.show == this;
	    },
	    index: function index() {
	      return this._tabset.tabs.indexOf(this);
	    },
	    show: function show() {
	      return this._tabset && this._tabset.show === this;
	    },
	    transition: function transition() {
	      return this._tabset ? this._tabset.effect : null;
	    }
	  },
	  created: function created() {
	    this._ingroup = this.$parent && this.$parent._tabgroup;
	    var tabset = this;
	    while (tabset && tabset._tabset !== true && tabset.$parent) {
	      tabset = tabset.$parent;
	    }
	    if (!tabset._tabset) {
	      this._tabset = {};
	      console.warn('Warning: "tab" depend on "tabset" to work properly.');
	    } else {
	      tabset.tabs.push(this);
	      if (!this._ingroup) {
	        tabset.headers.push(this);
	      } else {
	        if (!~tabset.headers.indexOf(this.$parent)) {
	          tabset.headers.push(this.$parent);
	        }
	      }
	      this._tabset = tabset;
	    }
	    if (this._ingroup) {
	      this.$parent.tabs.push(this);
	    }
	  },
	  beforeDestroy: function beforeDestroy() {
	    if (this._tabset.active === this.index) {
	      this._tabset.active = 0;
	    }
	    this._tabset.tabs.$remove(this);
	  }
	};

/***/ },
/* 176 */
/***/ function(module, exports) {

	module.exports = "\n<div role=\"tabpanel\" class=\"tab-pane active\" v-show=\"show\"\n  :class=\"{hide:!show}\"\n  :transition=\"transition\"\n>\n  <slot></slot>\n</div>\n";

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(178)
	__vue_script__ = __webpack_require__(179)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Tabs.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(180)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Tabs.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 178 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _coerceNumber = __webpack_require__(17);
	
	var _coerceNumber2 = _interopRequireDefault(_coerceNumber);
	
	var _Dropdown = __webpack_require__(101);
	
	var _Dropdown2 = _interopRequireDefault(_Dropdown);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: {
	    dropdown: _Dropdown2.default
	  },
	  props: {
	    navStyle: {
	      type: String,
	      default: 'tabs'
	    },
	    effect: {
	      type: String,
	      default: 'fadein'
	    },
	    active: {
	      type: Number,
	      coerce: _coerceNumber2.default,
	      default: 0
	    }
	  },
	  data: function data() {
	    return {
	      show: null,
	      headers: [],
	      tabs: []
	    };
	  },
	  created: function created() {
	    this._tabset = true;
	  },
	
	  watch: {
	    active: function active(val) {
	      this.show = this.tabs[val];
	    }
	  },
	  ready: function ready() {
	    this.show = this.tabs[this.active];
	  },
	
	  methods: {
	    select: function select(tab) {
	      if (!tab.disabled) {
	        this.active = tab.index;
	      }
	    }
	  }
	};

/***/ },
/* 180 */
/***/ function(module, exports) {

	module.exports = "\n<!-- Nav tabs -->\n<ul class=\"nav nav-{{navStyle}}\" role=\"tablist\">\n  <template v-for=\"t in headers\">\n    <li class=\"j-tab\" v-if=\"!t._tabgroup\" :class=\"{active: ($route.path == t.url), disabled:t.disabled}\" @click.prevent=\"select(t)\">\n      <a v-link=\"{ 'path': t.url}\"><slot name=\"header\">{{{t.header}}}</slot></a>\n    </li>\n    <dropdown v-else :text=\"t.header\" :class=\"{active:t.active}\" :disabled=\"t.disabled\">\n      <li v-for=\"tab in t.tabs\" :class=\"{disabled:tab.disabled}\">\n        <!-- <a v-link=\"{ 'path': tab.url}\" @click.prevent=\"select(tab)\">{{tab.header}}</a> -->\n        <a v-link=\"{ 'path': tab.url}\">{{tab.header}}</a>\n      </li>\n    </dropdown>\n  </template>\n</ul>\n<div class=\"tab-content\" v-el:tab-content>\n  <slot></slot>\n</div>\n";

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(182)
	__vue_script__ = __webpack_require__(183)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/TabGroup.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(184)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./TabGroup.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 182 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _coerceBoolean = __webpack_require__(16);
	
	var _coerceBoolean2 = _interopRequireDefault(_coerceBoolean);
	
	var _coerceNumber = __webpack_require__(17);
	
	var _coerceNumber2 = _interopRequireDefault(_coerceNumber);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  props: {
	    disabled: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: false
	    },
	    header: {
	      type: String
	    },
	    url: {
	      type: String
	    }
	  },
	  data: function data() {
	    return {
	      tabs: [],
	      show: false
	    };
	  },
	
	  computed: {
	    active: function active() {
	      return ~this.tabs.indexOf(this._tabset.show);
	    }
	  },
	  created: function created() {
	    this._tabgroup = true;
	    var tabset = this.$parent && this.$parent._tabset === true ? this.$parent : {};
	    if (this.$parent && this.$parent._tabgroup) {
	      console.error('Can\'t nest tabgroups.');
	    }
	    while (tabset && !tabset._tabset && tabset.$parent) {
	      tabset = tabset.$parent;
	    }
	    if (!tabset._tabset) {
	      this._tabset = {};
	      this.show = true;
	      console.warn('Warning: tabgroup depend on tabset to work properly.');
	    } else {
	      this._tabset = tabset;
	    }
	  },
	
	  methods: {
	    blur: function blur() {
	      this.show = false;
	    },
	    toggle: function toggle() {
	      this.show = !this.show;
	    }
	  }
	};

/***/ },
/* 184 */
/***/ function(module, exports) {

	module.exports = "<slot _v-37b8e9a3=\"\"></slot>";

/***/ },
/* 185 */
/***/ function(module, exports) {

	module.exports = "\n  <div class=\"m-content\">\n    <tabs>\n      <tab header=\"构建服务器管理\" url=\"/sysConfig/buildServer\">\n      </tab>\n      <tab header=\"NOS存储管理\" url=\"/sysConfig/nosStore\">\n      </tab>\n      <tab-group header=\"基础件管理\">\n        <tab header=\"类型\" url=\"/sysConfig/basicType\">\n        </tab>\n        <tab header=\"基础包\" url=\"/sysConfig/basicPackage\">\n        </tab>\n      </tab-group>\n      <tab header=\"模板管理\" url=\"/sysConfig/template\">\n      </tab>\n      <tab header=\"产品设置\" url=\"/sysConfig/product\">\n      </tab>\n      <tab header=\"管理员设置\" url=\"/sysConfig/admin\">\n      </tab>\n    </tabs>\n    <router-view></router-view>\n</template>";

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(187)
	__vue_script__ = __webpack_require__(188)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/sysConfig/buildServerManage.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(235)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./buildServerManage.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 187 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _Select = __webpack_require__(189);
	
	var _Select2 = _interopRequireDefault(_Select);
	
	var _util = __webpack_require__(66);
	
	var _util2 = _interopRequireDefault(_util);
	
	var _buildServerManage = __webpack_require__(234);
	
	var service = _interopRequireWildcard(_buildServerManage);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: {
	    vSelect: _Select2.default,
	    modal: _Modal2.default
	  },
	  data: function data() {
	    return {
	      value: '',
	      options: [],
	      serverList: [],
	      showModal: false,
	      obj: {
	        status: '',
	        ip: '',
	        port: ''
	      }
	    };
	  },
	  ready: function ready() {
	    this.getAllServer();
	  },
	
	  watch: {
	    'value': function value(val, oldVal) {
	      this.search();
	    }
	  },
	  methods: {
	    getAllServer: function getAllServer() {
	      var _this = this;
	
	      service.getAllServer({}).then(function (data) {
	        _this.options = _util2.default.optionsData(data.list || [], 'clusterId', 'clusterName');
	      });
	    },
	    search: function search(type) {
	      var _this2 = this;
	
	      if (!this.value) {
	        _vue2.default.$alert('请选择组别!', 'danger');
	        return;
	      }
	      service.getServerByGroup(this.value).then(function (data) {
	        !!type && _vue2.default.$alert('刷新成功', 'success');
	        _this2.serverList = data.list || [];
	      });
	    },
	    doSet: function doSet(id) {
	      var _this3 = this;
	
	      this.showModal = true;
	      service.getServerDetail(id).then(function (data) {
	        _this3.obj = data || {};
	      });
	    },
	    checkIPs: function checkIPs(value) {
	      var arr = value.trim().split(',');
	      for (var i = 0, len = arr.length; i < len; i++) {
	        if (arr[i].trim() && !_util2.default.checkIp(arr[i].trim())) {
	          return false;
	        }
	      }
	      return true;
	    },
	    doSubmit: function doSubmit() {
	      var _this4 = this;
	
	      var reg1 = /^\d+$/i;
	
	      if (!this.checkIPs(this.obj.serverIPs)) {
	        _vue2.default.$alert('请输入合法的IP，多个IP以,分隔', 'danger');
	        return;
	      }
	      if (!reg1.test(this.obj.port)) {
	        _vue2.default.$alert('端口只能是数字', 'danger');
	        return;
	      }
	      service.setServer(this.obj).then(function (data) {
	        _vue2.default.$alert('修改成功', 'success');
	        _this4.showModal = false;
	        _this4.search();
	      });
	    },
	    doSetStatus: function doSetStatus(item, status) {
	      var _this5 = this;
	
	      service.setServerStatus({
	        sn: item.serverSn,
	        status: status,
	        ip: item.serverIPs,
	        port: item.port
	      }).then(function (data) {
	        data == 'ok' ? _vue2.default.$alert('服务设置成功', 'success') : _vue2.default.$alert(data, 'danger');
	        _this5.search();
	      });
	    }
	  }
	};

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(190)
	__vue_script__ = __webpack_require__(191)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Select.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(233)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Select.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 190 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof2 = __webpack_require__(192);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _getIterator2 = __webpack_require__(227);
	
	var _getIterator3 = _interopRequireDefault(_getIterator2);
	
	var _coerceBoolean = __webpack_require__(16);
	
	var _coerceBoolean2 = _interopRequireDefault(_coerceBoolean);
	
	var _coerceNumber = __webpack_require__(17);
	
	var _coerceNumber2 = _interopRequireDefault(_coerceNumber);
	
	var _translations = __webpack_require__(232);
	
	var _translations2 = _interopRequireDefault(_translations);
	
	var _NodeList = __webpack_require__(104);
	
	var _NodeList2 = _interopRequireDefault(_NodeList);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var timeout = {};
	exports.default = {
	  props: {
	    value: {
	      twoWay: true
	    },
	    options: {
	      twoWay: true,
	      type: Array,
	      default: function _default() {
	        return [];
	      }
	    },
	    multiple: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: false
	    },
	    clearButton: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: false
	    },
	    closeOnSelect: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: false
	    },
	    disabled: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: false
	    },
	    justified: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: false
	    },
	    lang: {
	      type: String,
	      default: navigator.language
	    },
	    limit: {
	      type: Number,
	      coerce: _coerceNumber2.default,
	      default: 1024
	    },
	    name: {
	      type: String,
	      default: null
	    },
	    parent: {
	      default: true
	    },
	    placeholder: {
	      type: String,
	      default: null
	    },
	    readonly: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: null
	    },
	    required: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: null
	    },
	    minSearch: {
	      type: Number,
	      coerce: _coerceNumber2.default,
	      default: 0
	    },
	    search: {
	      type: Boolean,
	      coerce: _coerceBoolean2.default,
	      default: false
	    },
	    searchText: {
	      type: String,
	      default: null
	    },
	    url: {
	      type: String,
	      default: null
	    }
	  },
	  data: function data() {
	    return {
	      loading: null,
	      searchValue: null,
	      show: false,
	      showNotify: false
	    };
	  },
	
	  computed: {
	    selectedItems: function selectedItems() {
	      var foundItems = [];
	      var value = this.values;
	      if (value.length) {
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	          for (var _iterator = (0, _getIterator3.default)(value), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var item = _step.value;
	
	            if (this.options.length === 0) {
	              foundItems = value;
	            } else {
	              if (~['number', 'string'].indexOf(typeof item === 'undefined' ? 'undefined' : (0, _typeof3.default)(item))) {
	                var option = void 0;
	                this.options.some(function (o) {
	                  if (o instanceof Object && o.value === item || o === item) {
	                    option = o;
	                    return true;
	                  }
	                });
	                if (option) foundItems.push(option.label || option);
	              }
	            }
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }
	      return foundItems.join(', ');
	    },
	    canSearch: function canSearch() {
	      return this.minSearch ? this.options.length >= this.minSearch : this.search;
	    },
	    limitText: function limitText() {
	      return this.text.limit.replace('{{limit}}', this.limit);
	    },
	    showPlaceholder: function showPlaceholder() {
	      return this.values.length === 0 || !this.hasParent ? this.placeholder || '请选择' : null;
	    },
	    text: function text() {
	      return (0, _translations2.default)(this.lang);
	    },
	    hasParent: function hasParent() {
	      return this.parent instanceof Array ? this.parent.length : this.parent;
	    },
	    values: function values() {
	      return this.value instanceof Array ? this.value : !!this.value ? [this.value] : '';
	    }
	  },
	  watch: {
	    options: function options(_options) {
	      var changed = false;
	      if (_options instanceof Array && _options.length) {
	        for (var i in _options) {
	          if (!(_options[i] instanceof Object)) {
	            _options[i] = { label: _options[i], value: _options[i] };
	            changed = true;
	          }
	        }
	      }
	      if (changed) this.options = _options;
	    },
	    value: function value(val) {
	      var _this = this;
	
	      if (this.value instanceof Array && val.length > this.limit) {
	        this.showNotify = true;
	        if (timeout.limit) clearTimeout(timeout.limit);
	        timeout.limit = setTimeout(function () {
	          timeout.limit = false;
	          _this.showNotify = false;
	        }, 1500);
	      }
	      this.checkValue();
	    },
	    show: function show(val) {
	      if (val) {
	        this.$els.sel.focus();
	        this.$els.search && this.$els.search.focus();
	      }
	    },
	    url: function url() {
	      this.update();
	    }
	  },
	  methods: {
	    select: function select(v) {
	      if (this.value instanceof Array) {
	        if (~this.value.indexOf(v)) {
	          this.value.$remove(v);
	        } else {
	          this.value.push(v);
	        }
	        if (this.closeOnSelect) {
	          this.toggle();
	        }
	      } else {
	        this.value = v;
	        this.toggle();
	      }
	    },
	    clear: function clear() {
	      if (this.disabled || this.readonly) {
	        return;
	      }
	      this.value = this.value instanceof Array ? [] : null;
	      this.toggle();
	    },
	    clearSearch: function clearSearch() {
	      this.searchValue = '';
	      this.$els.search.focus();
	    },
	    checkValue: function checkValue() {
	      if (this.multiple && !(this.value instanceof Array)) {
	        this.value = this.value === null || this.value === undefined ? [] : [this.value];
	      }
	      if (!this.multiple && this.value instanceof Array) {
	        this.value = this.value.length ? this.value.pop() : null;
	      }
	      if (this.limit < 1) {
	        this.limit = 1;
	      }
	      if (this.values.length > this.limit) {
	        this.value = this.value.slice(0, this.limit);
	      }
	    },
	    isSelected: function isSelected(v) {
	      return this.values.indexOf(v) > -1;
	    },
	    toggle: function toggle() {
	      this.show = !this.show;
	    },
	    blur: function blur() {
	      this.show = false;
	    },
	    update: function update() {
	      var _this2 = this;
	
	      if (!this.url) return;
	      this.loading = true;
	      callAjax(this.url, function (data) {
	        var options = [];
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;
	
	        try {
	          for (var _iterator2 = (0, _getIterator3.default)(data), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var opc = _step2.value;
	
	            if (opc.value !== undefined && opc.label !== undefined) options.push({ value: opc.value, label: opc.label });
	          }
	        } catch (err) {
	          _didIteratorError2 = true;
	          _iteratorError2 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	              _iterator2.return();
	            }
	          } finally {
	            if (_didIteratorError2) {
	              throw _iteratorError2;
	            }
	          }
	        }
	
	        _this2.options = options;
	        if (!options.length) {
	          _this2.value = _this2.value instanceof Array ? [] : null;
	        }
	      }).always(function () {
	        _this2.loading = false;
	        _this2.checkValue();
	      });
	    }
	  },
	  created: function created() {
	    if (this.value === undefined || !this.parent) {
	      this.value = null;
	    }
	    if (!this.multiple && this.value instanceof Array) {
	      this.value = this.value.shift();
	    }
	    this.checkValue();
	    if (this.url) this.update();
	  },
	  ready: function ready() {
	    var _this3 = this;
	
	    (0, _NodeList2.default)(this.$els.select).onBlur(function (e) {
	      _this3.show = false;
	    });
	  },
	  beforeDestroy: function beforeDestroy() {
	    (0, _NodeList2.default)(this.$els.select).offBlur();
	  }
	};

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(193);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(213);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && _typeof2(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
	};
	
	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(194), __esModule: true };

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(195);
	__webpack_require__(208);
	module.exports = __webpack_require__(212).f('iterator');

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var $at = __webpack_require__(196)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(197)(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0; // next index
	  // 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t,
	      index = this._i,
	      point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var toInteger = __webpack_require__(57),
	    defined = __webpack_require__(54);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that)),
	        i = toInteger(pos),
	        l = s.length,
	        a,
	        b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff ? TO_STRING ? s.charAt(i) : a : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LIBRARY = __webpack_require__(198),
	    $export = __webpack_require__(32),
	    redefine = __webpack_require__(199),
	    hide = __webpack_require__(37),
	    has = __webpack_require__(50),
	    Iterators = __webpack_require__(200),
	    $iterCreate = __webpack_require__(201),
	    setToStringTag = __webpack_require__(205),
	    getPrototypeOf = __webpack_require__(207),
	    ITERATOR = __webpack_require__(206)('iterator'),
	    BUGGY = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	,
	    FF_ITERATOR = '@@iterator',
	    KEYS = 'keys',
	    VALUES = 'values';
	
	var returnThis = function returnThis() {
	  return this;
	};
	
	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function getMethod(kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS:
	        return function keys() {
	          return new Constructor(this, kind);
	        };
	      case VALUES:
	        return function values() {
	          return new Constructor(this, kind);
	        };
	    }return function entries() {
	      return new Constructor(this, kind);
	    };
	  };
	  var TAG = NAME + ' Iterator',
	      DEF_VALUES = DEFAULT == VALUES,
	      VALUES_BUG = false,
	      proto = Base.prototype,
	      $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT],
	      $default = $native || getMethod(DEFAULT),
	      $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined,
	      $anyNative = NAME == 'Array' ? proto.entries || $native : $native,
	      methods,
	      key,
	      IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() {
	      return $native.call(this);
	    };
	  }
	  // Define iterator
	  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 198 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = true;

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(37);

/***/ },
/* 200 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = {};

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var create = __webpack_require__(202),
	    descriptor = __webpack_require__(46),
	    setToStringTag = __webpack_require__(205),
	    IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(37)(IteratorPrototype, __webpack_require__(206)('iterator'), function () {
	  return this;
	});
	
	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject = __webpack_require__(39),
	    dPs = __webpack_require__(203),
	    enumBugKeys = __webpack_require__(62),
	    IE_PROTO = __webpack_require__(59)('IE_PROTO'),
	    Empty = function Empty() {/* empty */},
	    PROTOTYPE = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var _createDict = function createDict() {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(44)('iframe'),
	      i = enumBugKeys.length,
	      lt = '<',
	      gt = '>',
	      iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(204).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  _createDict = iframeDocument.F;
	  while (i--) {
	    delete _createDict[PROTOTYPE][enumBugKeys[i]];
	  }return _createDict();
	};
	
	module.exports = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = _createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dP = __webpack_require__(38),
	    anObject = __webpack_require__(39),
	    getKeys = __webpack_require__(48);
	
	module.exports = __webpack_require__(42) ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties),
	      length = keys.length,
	      i = 0,
	      P;
	  while (length > i) {
	    dP.f(O, P = keys[i++], Properties[P]);
	  }return O;
	};

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(33).document && document.documentElement;

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var def = __webpack_require__(38).f,
	    has = __webpack_require__(50),
	    TAG = __webpack_require__(206)('toStringTag');
	
	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var store = __webpack_require__(60)('wks'),
	    uid = __webpack_require__(61),
	    _Symbol = __webpack_require__(33).Symbol,
	    USE_SYMBOL = typeof _Symbol == 'function';
	
	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] = USE_SYMBOL && _Symbol[name] || (USE_SYMBOL ? _Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = __webpack_require__(50),
	    toObject = __webpack_require__(65),
	    IE_PROTO = __webpack_require__(59)('IE_PROTO'),
	    ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  }return O instanceof Object ? ObjectProto : null;
	};

/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(209);
	var global = __webpack_require__(33),
	    hide = __webpack_require__(37),
	    Iterators = __webpack_require__(200),
	    TO_STRING_TAG = __webpack_require__(206)('toStringTag');
	
	for (var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++) {
	  var NAME = collections[i],
	      Collection = global[NAME],
	      proto = Collection && Collection.prototype;
	  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var addToUnscopables = __webpack_require__(210),
	    step = __webpack_require__(211),
	    Iterators = __webpack_require__(200),
	    toIObject = __webpack_require__(51);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(197)(Array, 'Array', function (iterated, kind) {
	  this._t = toIObject(iterated); // target
	  this._i = 0; // next index
	  this._k = kind; // kind
	  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t,
	      kind = this._k,
	      index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return step(1);
	  }
	  if (kind == 'keys') return step(0, index);
	  if (kind == 'values') return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 210 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function () {/* empty */};

/***/ },
/* 211 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (done, value) {
	  return { value: value, done: !!done };
	};

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.f = __webpack_require__(206);

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(214), __esModule: true };

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(215);
	__webpack_require__(224);
	__webpack_require__(225);
	__webpack_require__(226);
	module.exports = __webpack_require__(34).Symbol;

/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var global = __webpack_require__(33),
	    has = __webpack_require__(50),
	    DESCRIPTORS = __webpack_require__(42),
	    $export = __webpack_require__(32),
	    redefine = __webpack_require__(199),
	    META = __webpack_require__(216).KEY,
	    $fails = __webpack_require__(43),
	    shared = __webpack_require__(60),
	    setToStringTag = __webpack_require__(205),
	    uid = __webpack_require__(61),
	    wks = __webpack_require__(206),
	    wksExt = __webpack_require__(212),
	    wksDefine = __webpack_require__(217),
	    keyOf = __webpack_require__(218),
	    enumKeys = __webpack_require__(219),
	    isArray = __webpack_require__(220),
	    anObject = __webpack_require__(39),
	    toIObject = __webpack_require__(51),
	    toPrimitive = __webpack_require__(45),
	    createDesc = __webpack_require__(46),
	    _create = __webpack_require__(202),
	    gOPNExt = __webpack_require__(221),
	    $GOPD = __webpack_require__(223),
	    $DP = __webpack_require__(38),
	    $keys = __webpack_require__(48),
	    gOPD = $GOPD.f,
	    dP = $DP.f,
	    gOPN = gOPNExt.f,
	    $Symbol = global.Symbol,
	    $JSON = global.JSON,
	    _stringify = $JSON && $JSON.stringify,
	    PROTOTYPE = 'prototype',
	    HIDDEN = wks('_hidden'),
	    TO_PRIMITIVE = wks('toPrimitive'),
	    isEnum = {}.propertyIsEnumerable,
	    SymbolRegistry = shared('symbol-registry'),
	    AllSymbols = shared('symbols'),
	    OPSymbols = shared('op-symbols'),
	    ObjectProto = Object[PROTOTYPE],
	    USE_NATIVE = typeof $Symbol == 'function',
	    QObject = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function () {
	  return _create(dP({}, 'a', {
	    get: function get() {
	      return dP(this, 'a', { value: 7 }).a;
	    }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  dP(it, key, D);
	  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function wrap(tag) {
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && _typeof($Symbol.iterator) == 'symbol' ? function (it) {
	  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if (has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, { enumerable: createDesc(0, false) });
	    }return setSymbolDesc(it, key, D);
	  }return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P)),
	      i = 0,
	      l = keys.length,
	      key;
	  while (l > i) {
	    $defineProperty(it, key = keys[i++], P[key]);
	  }return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = toIObject(it);
	  key = toPrimitive(key, true);
	  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
	  var D = gOPD(it, key);
	  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN(toIObject(it)),
	      result = [],
	      i = 0,
	      key;
	  while (names.length > i) {
	    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  }return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto,
	      names = gOPN(IS_OP ? OPSymbols : toIObject(it)),
	      result = [],
	      i = 0,
	      key;
	  while (names.length > i) {
	    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
	  }return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function _Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function $set(value) {
	      if (this === ObjectProto) $set.call(OPSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f = $defineProperty;
	  __webpack_require__(222).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(64).f = $propertyIsEnumerable;
	  __webpack_require__(63).f = $getOwnPropertySymbols;
	
	  if (DESCRIPTORS && !__webpack_require__(198)) {
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function (name) {
	    return wrap(wks(name));
	  };
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });
	
	for (var symbols =
	// 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'.split(','), i = 0; symbols.length > i;) {
	  wks(symbols[i++]);
	}for (var symbols = $keys(wks.store), i = 0; symbols.length > i;) {
	  wksDefine(symbols[i++]);
	}$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function _for(key) {
	    return has(SymbolRegistry, key += '') ? SymbolRegistry[key] : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key) {
	    if (isSymbol(key)) return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function useSetter() {
	    setter = true;
	  },
	  useSimple: function useSimple() {
	    setter = false;
	  }
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
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    var args = [it],
	        i = 1,
	        replacer,
	        $replacer;
	    while (arguments.length > i) {
	      args.push(arguments[i++]);
	    }replacer = args[1];
	    if (typeof replacer == 'function') $replacer = replacer;
	    if ($replacer || !isArray(replacer)) replacer = function replacer(key, value) {
	      if ($replacer) value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(37)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var META = __webpack_require__(61)('meta'),
	    isObject = __webpack_require__(40),
	    has = __webpack_require__(50),
	    setDesc = __webpack_require__(38).f,
	    id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !__webpack_require__(43)(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function setMeta(it) {
	  setDesc(it, META, { value: {
	      i: 'O' + ++id, // object ID
	      w: {} // weak collections IDs
	    } });
	};
	var fastKey = function fastKey(it, create) {
	  // return primitive with prefix
	  if (!isObject(it)) return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	    // return object ID
	  }return it[META].i;
	};
	var getWeak = function getWeak(it, create) {
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	    // return hash weak collections IDs
	  }return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function onFreeze(it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var global = __webpack_require__(33),
	    core = __webpack_require__(34),
	    LIBRARY = __webpack_require__(198),
	    wksExt = __webpack_require__(212),
	    defineProperty = __webpack_require__(38).f;
	module.exports = function (name) {
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
	};

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getKeys = __webpack_require__(48),
	    toIObject = __webpack_require__(51);
	module.exports = function (object, el) {
	  var O = toIObject(object),
	      keys = getKeys(O),
	      length = keys.length,
	      index = 0,
	      key;
	  while (length > index) {
	    if (O[key = keys[index++]] === el) return key;
	  }
	};

/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(48),
	    gOPS = __webpack_require__(63),
	    pIE = __webpack_require__(64);
	module.exports = function (it) {
	  var result = getKeys(it),
	      getSymbols = gOPS.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it),
	        isEnum = pIE.f,
	        i = 0,
	        key;
	    while (symbols.length > i) {
	      if (isEnum.call(it, key = symbols[i++])) result.push(key);
	    }
	  }return result;
	};

/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(53);
	module.exports = Array.isArray || function isArray(arg) {
	  return cof(arg) == 'Array';
	};

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(51),
	    gOPN = __webpack_require__(222).f,
	    toString = {}.toString;
	
	var windowNames = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) == 'object' && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function getWindowNames(it) {
	  try {
	    return gOPN(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it) {
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};

/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys = __webpack_require__(49),
	    hiddenKeys = __webpack_require__(62).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var pIE = __webpack_require__(64),
	    createDesc = __webpack_require__(46),
	    toIObject = __webpack_require__(51),
	    toPrimitive = __webpack_require__(45),
	    has = __webpack_require__(50),
	    IE8_DOM_DEFINE = __webpack_require__(41),
	    gOPD = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(42) ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if (IE8_DOM_DEFINE) try {
	    return gOPD(O, P);
	  } catch (e) {/* empty */}
	  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 224 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(217)('asyncIterator');

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(217)('observable');

/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	module.exports = { "default": __webpack_require__(228), __esModule: true };

/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(208);
	__webpack_require__(195);
	module.exports = __webpack_require__(229);

/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var anObject = __webpack_require__(39),
	    get = __webpack_require__(230);
	module.exports = __webpack_require__(34).getIterator = function (it) {
	  var iterFn = get(it);
	  if (typeof iterFn != 'function') throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var classof = __webpack_require__(231),
	    ITERATOR = __webpack_require__(206)('iterator'),
	    Iterators = __webpack_require__(200);
	module.exports = __webpack_require__(34).getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR] || it['@@iterator'] || Iterators[classof(it)];
	};

/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(53),
	    TAG = __webpack_require__(206)('toStringTag')
	// ES3 wrong here
	,
	    ARG = cof(function () {
	  return arguments;
	}()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function tryGet(it, key) {
	  try {
	    return it[key];
	  } catch (e) {/* empty */}
	};
	
	module.exports = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	  // @@toStringTag case
	  : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	  // builtinTag case
	  : ARG ? cof(O)
	  // ES3 arguments fallback
	  : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 232 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// return all the translations
	var text = {
	  daysOfWeek: {
	    en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
	    es: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
	    'pt-BR': ['Do', 'Se', 'Te', 'Qa', 'Qi', 'Sx', 'Sa']
	  },
	  limit: {
	    en: 'Limit reached ({{limit}} items max).',
	    es: 'Limite alcanzado (máximo {{limit}} items).',
	    'pt-BR': 'Limite atingido (máximo {{limit}} items).'
	  },
	  loading: {
	    en: 'Loading...',
	    es: 'Cargando...',
	    'pt-BR': 'Cargando...'
	  },
	  minLength: {
	    en: 'Min. Length',
	    es: 'Tamaño Mínimo',
	    'pt-BR': 'Tamanho Mínimo'
	  },
	  months: {
	    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
	    es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
	    'pt-BR': ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
	  },
	  notSelected: {
	    en: 'Nothing Selected',
	    es: 'Nada seleccionado',
	    'pt-BR': 'Nada selecionado'
	  },
	  required: {
	    en: 'Required',
	    es: 'Requerido',
	    'pt-BR': 'Requerido'
	  },
	  search: {
	    en: 'Search',
	    es: 'Buscar',
	    'pt-BR': 'Buscar'
	  }
	};
	
	exports.default = function () {
	  var lang = arguments.length <= 0 || arguments[0] === undefined ? 'en' : arguments[0];
	
	  var tr = {};
	  for (var i in text) {
	    tr[i] = text[i][lang] || text[i]['en'];
	  }
	  return tr;
	};

/***/ },
/* 233 */
/***/ function(module, exports) {

	module.exports = "\n<div v-el:select=\"\" :class=\"{'btn-group btn-group-justified': justified, 'btn-select': !justified}\" _v-b531c416=\"\">\n  <slot name=\"before\" _v-b531c416=\"\"></slot>\n  <div :class=\"{open:show,dropdown:!justified}\" _v-b531c416=\"\">\n    <select v-el:sel=\"\" v-model=\"value\" v-show=\"show\" name=\"{{name}}\" class=\"secret\" :multiple=\"multiple\" :required=\"required\" :readonly=\"readonly\" :disabled=\"disabled\" _v-b531c416=\"\">\n      <option v-if=\"required\" value=\"\" _v-b531c416=\"\"></option>\n      <option v-for=\"option in options\" :value=\"option.value||option\" _v-b531c416=\"\">{{ option.label||option }}</option>\n    </select>\n    <button type=\"button\" class=\"form-control dropdown-toggle\" :disabled=\"disabled || !hasParent\" :readonly=\"readonly\" @click=\"toggle()\" @keyup.esc=\"show = false\" _v-b531c416=\"\">\n      <span class=\"btn-content\" _v-b531c416=\"\">{{ loading ? text.loading : showPlaceholder || selectedItems }}</span>\n      <span class=\"caret\" _v-b531c416=\"\"></span>\n      <span v-if=\"clearButton&amp;&amp;values.length\" class=\"close\" @click=\"clear()\" _v-b531c416=\"\">×</span>\n    </button>\n    <ul class=\"dropdown-menu\" _v-b531c416=\"\">\n      <template v-if=\"options.length\">\n        <li v-if=\"canSearch\" class=\"bs-searchbox\" _v-b531c416=\"\">\n          <input type=\"text\" placeholder=\"{{searchText||text.search}}\" class=\"form-control\" autocomplete=\"off\" v-el:search=\"\" v-model=\"searchValue\" @keyup.esc=\"show = false\" _v-b531c416=\"\">\n          <span v-show=\"searchValue\" class=\"close\" @click=\"clearSearch\" _v-b531c416=\"\">×</span>\n        </li>\n        <li v-if=\"required&amp;&amp;!clearButton\" _v-b531c416=\"\"><a @mousedown.prevent=\"clear() &amp;&amp; blur()\" _v-b531c416=\"\">{{ placeholder || text.notSelected }}</a></li>\n        <li v-for=\"option in options | filterBy searchValue\" :id=\"option.value||option\" _v-b531c416=\"\">\n          <a @mousedown.prevent=\"select(option.value||option)\" _v-b531c416=\"\">\n            {{ option.label||option }}\n            <!-- <span class=\"glyphicon glyphicon-ok check-mark\" v-show=\"isSelected(option.value||option)\"></span> -->\n            <i class=\"iconfont\" v-show=\"isSelected(option.value||option)\" _v-b531c416=\"\"></i>\n          </a>\n        </li>\n      </template>\n      <slot v-else=\"\" _v-b531c416=\"\"></slot>\n      <div v-if=\"showNotify &amp;&amp; !closeOnSelect\" class=\"notify\" transition=\"fadein\" _v-b531c416=\"\">{{limitText}}</div>\n    </ul>\n    <div v-if=\"showNotify &amp;&amp; closeOnSelect\" class=\"notify\" transition=\"fadein\" _v-b531c416=\"\"><div _v-b531c416=\"\">{{limitText}}</div></div>\n  </div>\n  <slot name=\"after\" _v-b531c416=\"\"></slot>\n</div>\n";

/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getAllServer = getAllServer;
	exports.getServerByGroup = getServerByGroup;
	exports.getServerDetail = getServerDetail;
	exports.setServer = setServer;
	exports.setServerStatus = setServerStatus;
	exports.refreshStatus = refreshStatus;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * 类型
	 */
	function getAllServer(params) {
	    return request.get('/api/buildserver/status/clusters', params);
	}
	/*
	 * ****功能: 获取某一个组别下的所有服务器***
	 */
	/*
	 * --------------------------------------------
	 * 构建服务器
	 * @version  1.0
	 * @author   shirley(hztanxuewei@corp.netease.com)
	 * --------------------------------------------
	 */
	function getServerByGroup(id) {
	    return request.get('/api/buildserver/status/' + id, {});
	}
	
	function getServerDetail(id) {
	    return request.get('/api/buildserver/status/id/' + id, {});
	}
	
	function setServer(params) {
	    return request.post('/api/buildserver/status', params);
	}
	
	function setServerStatus(params) {
	    return request.post('/api/buildserver/status/set/servicestatus', params);
	}
	
	function refreshStatus(params) {
	    return request.get('/api/buildserver/status/refresh', params);
	}

/***/ },
/* 235 */
/***/ function(module, exports) {

	module.exports = "\n  <div _v-29594fc3=\"\">\n    <form class=\"m-form\" _v-29594fc3=\"\">\n      <div class=\"fmitem\" _v-29594fc3=\"\">\n          <label class=\"fmlab\" _v-29594fc3=\"\">组别</label>\n          <div class=\"fmcnt\" _v-29594fc3=\"\">\n              <v-select :value.sync=\"value\" :options.sync=\"options\" _v-29594fc3=\"\"></v-select>\n              <input type=\"button\" name=\"\" class=\"u-btn u-btn-primary ml30\" value=\"刷新\" @click=\"search('refresh')\" _v-29594fc3=\"\">\n          </div>\n      </div>\n    </form>\n  </div>\n  <table class=\"m-table\" _v-29594fc3=\"\">\n      <thead _v-29594fc3=\"\">\n          <tr _v-29594fc3=\"\">\n              <th _v-29594fc3=\"\">Sn</th>\n              <th _v-29594fc3=\"\">主IP</th>\n              <th _v-29594fc3=\"\">主机名</th>\n              <th _v-29594fc3=\"\">服务可用状态</th>\n              <th _v-29594fc3=\"\">运行任务数</th>\n              <th _v-29594fc3=\"\">机器存活状态</th>\n              <th _v-29594fc3=\"\">映射IP</th>\n              <th _v-29594fc3=\"\">端口</th>\n              <th _v-29594fc3=\"\">服务配置</th>\n              <th _v-29594fc3=\"\">操作</th>\n          </tr>\n      </thead>\n      <tbody _v-29594fc3=\"\">\n          <tr v-for=\"item in serverList\" _v-29594fc3=\"\">\n              <td _v-29594fc3=\"\">{{ item.serverSn }}</td>\n              <td _v-29594fc3=\"\">{{ item.hostIp }}</td>\n              <td title=\"{{ item.hostName }}\" _v-29594fc3=\"\">{{ item.hostName }}</td>\n              <td title=\"{{ item.appStatus }}\" _v-29594fc3=\"\">{{ item.appStatus }}</td>\n              <td _v-29594fc3=\"\">{{ item.runningTaskCount }}</td>\n              <td _v-29594fc3=\"\">{{ item.status }}</td>\n              <td title=\"{{ item.serverIPs }}\" _v-29594fc3=\"\">{{ item.serverIPs }}</td>\n              <td _v-29594fc3=\"\">{{ item.port }}</td>\n              <td _v-29594fc3=\"\">\n                <span v-if=\"item.appStatus == 'enable'\" class=\" u-btn u-btn-s1\" @click=\"doSetStatus(item, 'disable')\" _v-29594fc3=\"\">\n                      disable\n                </span>\n                <span v-else=\"\" _v-29594fc3=\"\">\n                  <span v-if=\"item.appStatus == 'exception'\" class=\" u-btn u-btn-s1 u-btn-dis\" _v-29594fc3=\"\">\n                      enable\n                  </span>\n                  <span v-else=\"\" class=\" u-btn u-btn-s1\" @click=\"doSetStatus(item, 'enable')\" _v-29594fc3=\"\">\n                      enable\n                </span>\n                </span>\n              </td>\n              <td _v-29594fc3=\"\">\n                <span class=\" u-btn u-btn-s1\" @click=\"doSet(item.id)\" _v-29594fc3=\"\">修改</span>\n              </td>\n          </tr>\n      </tbody>\n  </table>\n  <modal :show.sync=\"showModal\" :submit=\"doSubmit\" _v-29594fc3=\"\">\n    <h3 slot=\"header\" _v-29594fc3=\"\">设置</h3>\n    <div slot=\"body\" _v-29594fc3=\"\">\n      <form class=\"m-form\" _v-29594fc3=\"\">\n        <div class=\"fmitem\" _v-29594fc3=\"\">\n            <label class=\"fmlab\" _v-29594fc3=\"\">集群ID：</label>\n            <div class=\"fmcnt\" _v-29594fc3=\"\">\n                {{ obj.clusterId }}\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-29594fc3=\"\">\n            <label class=\"fmlab\" _v-29594fc3=\"\">Sn：</label>\n            <div class=\"fmcnt\" _v-29594fc3=\"\">\n                {{ obj.serverSn }}\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-29594fc3=\"\">\n            <label class=\"fmlab\" _v-29594fc3=\"\">机器存活状态：</label>\n            <div class=\"fmcnt\" _v-29594fc3=\"\">\n                <select class=\"u-ipt\" v-model=\"obj.status\" _v-29594fc3=\"\">\n                  <option value=\"online\" _v-29594fc3=\"\">online</option>\n                  <option value=\"offline\" _v-29594fc3=\"\">offline</option>\n                </select>\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-29594fc3=\"\">\n            <label class=\"fmlab\" _v-29594fc3=\"\">映射IP：</label>\n            <div class=\"fmcnt\" _v-29594fc3=\"\">\n                <textarea class=\"u-ipt\" v-model=\"obj.serverIPs\" _v-29594fc3=\"\">                </textarea>\n                <p class=\"f-red\" _v-29594fc3=\"\">多个IP以英文逗号(,)分隔</p>\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-29594fc3=\"\">\n            <label class=\"fmlab\" _v-29594fc3=\"\">端口：</label>\n            <div class=\"fmcnt\" _v-29594fc3=\"\">\n                <input type=\"text\" name=\"\" class=\"u-ipt\" v-model=\"obj.port\" _v-29594fc3=\"\">\n            </div>\n        </div>\n      </form>\n    </div>\n  </modal>\n\n";

/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(237)
	__vue_script__ = __webpack_require__(238)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/sysConfig/nosStoreManage.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(240)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./nosStoreManage.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 237 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _nosStoreManage = __webpack_require__(239);
	
	var service = _interopRequireWildcard(_nosStoreManage);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: {
	    modal: _Modal2.default
	  },
	  data: function data() {
	    return {
	      nosList: [],
	      showModal: false,
	      showDelModal: false,
	      obj: this.initObj(),
	      check: false
	    };
	  },
	  ready: function ready() {
	    this.getAllNos();
	  },
	
	  methods: {
	    getAllNos: function getAllNos() {
	      var _this = this;
	
	      service.getAllNos({}).then(function (data) {
	        _this.nosList = data.list || [];
	      });
	    },
	    initObj: function initObj() {
	      return {
	        name: '',
	        bucketName: '',
	        endpoint: '',
	        endpointExt: '',
	        accessKey: '',
	        secretKey: '',
	        isDefault: 0,
	        id: ''
	      };
	    },
	    add: function add() {
	      this.check = false;
	      this.$resetValidation();
	      this.showModal = true;
	      this.obj = this.initObj();
	    },
	    edit: function edit(id) {
	      var _this2 = this;
	
	      this.obj.id = id;
	      service.get(id).then(function (data) {
	        _this2.showModal = true;
	        _this2.obj = data;
	      });
	    },
	    onDel: function onDel(id) {
	      this.showDelModal = true;
	      this.delId = id;
	    },
	    doDel: function doDel() {
	      var _this3 = this;
	
	      service.del(this.delId).then(function (data) {
	        _this3.showDelModal = false;
	        _this3.delId = '';
	        _this3.getAllNos();
	      });
	    },
	    doSubmit: function doSubmit() {
	      var _this4 = this;
	
	      this.check = true;
	      if (this.$validation1.invalid) {
	        _vue2.default.$alert('请填写必填项', 'danger');
	        return;
	      }
	      if (!!this.obj.id) {
	
	        service.edit(this.obj).then(function (data) {
	          _this4.showModal = false;
	          _this4.getAllNos();
	        });
	      } else {
	
	        service.add(this.obj).then(function (data) {
	          _this4.showModal = false;
	          _this4.getAllNos();
	        });
	      }
	    }
	  },
	  events: {}
	};

/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getAllNos = getAllNos;
	exports.add = add;
	exports.get = get;
	exports.edit = edit;
	exports.del = del;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * 类型
	 */
	function getAllNos(params) {
	    return request.get('/api/nosConfig', params);
	} /*
	   * --------------------------------------------
	   * nos管理
	   * @version  1.0
	   * @author   shirley(hztanxuewei@corp.netease.com)
	   * --------------------------------------------
	   */
	function add(params) {
	    return request.post('/api/nosConfig', params);
	}
	
	function get(id) {
	    return request.get('/api/nosConfig/' + id, {});
	}
	
	function edit(params) {
	    return request.put('/api/nosConfig', params);
	}
	
	function del(id) {
	    return request.del('/api/nosConfig/' + id, {});
	}

/***/ },
/* 240 */
/***/ function(module, exports) {

	module.exports = "\n<div _v-26e41c17=\"\">\n  <input type=\"button\" name=\"submit\" class=\"u-btn u-btn-primary mb10\" value=\"添加\" @click=\"add\" _v-26e41c17=\"\">\n  <table class=\"m-table\" _v-26e41c17=\"\">\n      <thead _v-26e41c17=\"\">\n          <tr _v-26e41c17=\"\">\n              <th _v-26e41c17=\"\">配置名</th>\n              <th _v-26e41c17=\"\">桶名</th>\n              <th _v-26e41c17=\"\">地址</th>\n              <th _v-26e41c17=\"\">扩充地址</th>\n              <th _v-26e41c17=\"\">Access Key</th>\n              <th _v-26e41c17=\"\">Secret Key</th>\n              <th _v-26e41c17=\"\">默认配置</th>\n              <th _v-26e41c17=\"\">操作</th>\n          </tr>\n      </thead>\n      <tbody _v-26e41c17=\"\">\n          <tr v-for=\"item in nosList\" _v-26e41c17=\"\">\n              <td _v-26e41c17=\"\">{{ item.name }}</td>\n              <td _v-26e41c17=\"\">{{ item.bucketName }}</td>\n              <td title=\"{{ item.endpoint }}\" _v-26e41c17=\"\">{{ item.endpoint }}</td>\n              <td title=\"{{ item.endpointExt }}\" _v-26e41c17=\"\">{{ item.endpointExt }}</td>\n              <td title=\"{{ item.accessKey }}\" _v-26e41c17=\"\">{{ item.accessKey }}</td>\n              <td title=\"{{ item.secretKey }}\" _v-26e41c17=\"\">{{ item.secretKey }}</td>\n              <td _v-26e41c17=\"\">\n                <span v-if=\"item.isDefault==1\" _v-26e41c17=\"\">是</span>\n                <span v-else=\"\" _v-26e41c17=\"\">否</span>\n              </td>\n              <td _v-26e41c17=\"\">\n                  <i class=\"iconfont icon-edit\" @click=\"edit(item.id)\" title=\"编辑\" _v-26e41c17=\"\"></i>\n                  <i class=\"iconfont icon-del\" @click=\"onDel(item.id)\" title=\"删除\" style=\"margin-left: 5px;\" _v-26e41c17=\"\"></i>\n              </td>\n          </tr>\n      </tbody>\n  </table>\n</div>\n<modal :show.sync=\"showModal\" :submit=\"doSubmit\" _v-26e41c17=\"\">\n  <h3 slot=\"header\" _v-26e41c17=\"\">{{ obj.id?'修改':'添加' }}NOS</h3>\n  <div slot=\"body\" _v-26e41c17=\"\">\n    <validator name=\"validation1\" _v-26e41c17=\"\">\n      <form class=\"m-form\" novalidate=\"\" _v-26e41c17=\"\">\n        <div class=\"fmitem\" _v-26e41c17=\"\">\n            <label class=\"fmlab\" _v-26e41c17=\"\"><i _v-26e41c17=\"\">*</i>配置名：</label>\n            <div class=\"fmcnt\" _v-26e41c17=\"\">\n                <input type=\"text\" name=\"\" class=\"u-ipt\" :class=\"{'check': check==true}\" v-validate:name=\"['required']\" v-model=\"obj.name\" _v-26e41c17=\"\">\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-26e41c17=\"\">\n            <label class=\"fmlab\" _v-26e41c17=\"\"><i _v-26e41c17=\"\">*</i>桶名：</label>\n            <div class=\"fmcnt\" _v-26e41c17=\"\">\n                <input type=\"text\" name=\"\" class=\"u-ipt\" :class=\"{'check': check==true}\" v-validate:bucketname=\"['required']\" v-model=\"obj.bucketName\" _v-26e41c17=\"\">\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-26e41c17=\"\">\n            <label class=\"fmlab\" _v-26e41c17=\"\"><i _v-26e41c17=\"\">*</i>地址：</label>\n            <div class=\"fmcnt\" _v-26e41c17=\"\">\n                <input type=\"text\" name=\"\" class=\"u-ipt\" :class=\"{'check': check==true}\" v-validate:endpoint=\"['required']\" v-model=\"obj.endpoint\" _v-26e41c17=\"\">\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-26e41c17=\"\">\n            <label class=\"fmlab\" _v-26e41c17=\"\">扩充地址：</label>\n            <div class=\"fmcnt\" _v-26e41c17=\"\">\n                <input type=\"text\" name=\"\" class=\"u-ipt\" v-model=\"obj.endpointExt\" _v-26e41c17=\"\">\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-26e41c17=\"\">\n            <label class=\"fmlab\" _v-26e41c17=\"\"><i _v-26e41c17=\"\">*</i>Access Key：</label>\n            <div class=\"fmcnt\" _v-26e41c17=\"\">\n                <input type=\"text\" name=\"\" class=\"u-ipt\" :class=\"{'check': check==true}\" v-validate:accesskey=\"['required']\" v-model=\"obj.accessKey\" _v-26e41c17=\"\">\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-26e41c17=\"\">\n            <label class=\"fmlab\" _v-26e41c17=\"\"><i _v-26e41c17=\"\">*</i>Secret Key：</label>\n            <div class=\"fmcnt\" _v-26e41c17=\"\">\n                <input type=\"text\" name=\"\" class=\"u-ipt\" :class=\"{'check': check==true}\" v-validate:secretkey=\"['required']\" v-model=\"obj.secretKey\" _v-26e41c17=\"\">\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-26e41c17=\"\">\n            <label class=\"fmlab\" _v-26e41c17=\"\"><i _v-26e41c17=\"\">*</i>默认配置：</label>\n            <div class=\"fmcnt\" _v-26e41c17=\"\">\n                <select class=\"u-ipt\" v-model=\"obj.isDefault\" _v-26e41c17=\"\">\n                    <option value=\"1\" _v-26e41c17=\"\">是</option>\n                    <option value=\"0\" _v-26e41c17=\"\">否</option>\n                </select>\n            </div>\n        </div>\n      </form>\n    </validator>\n  </div>\n</modal>\n<modal :show.sync=\"showDelModal\" :submit=\"doDel\" _v-26e41c17=\"\">\n  <h3 slot=\"header\" _v-26e41c17=\"\">删除类型</h3>\n  <div slot=\"body\" _v-26e41c17=\"\">\n    <p class=\"tip\" _v-26e41c17=\"\"><i class=\"iconfont icon-tip\" _v-26e41c17=\"\"></i>确定删除该NOS么？</p>\n  </div>\n</modal>\n";

/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(242)
	__vue_script__ = __webpack_require__(243)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/sysConfig/basicType.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(245)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./basicType.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 242 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _util = __webpack_require__(66);
	
	var _util2 = _interopRequireDefault(_util);
	
	var _basicPartManage = __webpack_require__(244);
	
	var service = _interopRequireWildcard(_basicPartManage);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { modal: _Modal2.default },
	  props: {
	    value: {
	      type: String
	    }
	  },
	  data: function data() {
	    return {
	      typeList: [],
	      showModal: false,
	      showDelModal: false,
	      obj: this.initObj(),
	      check: false
	    };
	  },
	  ready: function ready() {
	    this.getAllType();
	  },
	
	  methods: {
	    initObj: function initObj() {
	      return {
	        name: '',
	        descp: '',
	        id: ''
	      };
	    },
	    getAllType: function getAllType() {
	      var _this = this;
	
	      service.getAllType({}).then(function (data) {
	        _this.typeList = data.list || [];
	      });
	    },
	    add: function add() {
	      this.check = false;
	      this.$resetValidation();
	      this.showModal = true;
	      this.obj = this.initObj();
	    },
	    edit: function edit(id) {
	      var _this2 = this;
	
	      this.obj.id = id;
	      service.getType({
	        id: id
	      }).then(function (data) {
	        _this2.showModal = true;
	        _this2.obj = data;
	      });
	    },
	    doSubmit: function doSubmit() {
	      var _this3 = this;
	
	      this.check = true;
	      if (this.$validation1.invalid) {
	        _vue2.default.$alert('请填写必填项', 'danger');
	        return;
	      }
	
	      service.addType(this.obj).then(function (data) {
	        _this3.showModal = false;
	        _this3.getAllType();
	      });
	    },
	    onDel: function onDel(id) {
	      this.showDelModal = true;
	      this.delId = id;
	    },
	    doDel: function doDel() {
	      var _this4 = this;
	
	      service.delType({
	        ids: this.delId
	      }).then(function (data) {
	        _this4.showDelModal = false;
	        _this4.delId = '';
	        _this4.getAllType();
	      });
	    }
	  },
	  events: {}
	};

/***/ },
/* 244 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getAllType = getAllType;
	exports.addType = addType;
	exports.delType = delType;
	exports.getType = getType;
	exports.searchPackage = searchPackage;
	exports.addPackage = addPackage;
	exports.getPackage = getPackage;
	exports.updatePackage = updatePackage;
	exports.delPackage = delPackage;
	exports.addConfig = addConfig;
	exports.delConfig = delConfig;
	exports.getAllConfig = getAllConfig;
	exports.getPlaceholder = getPlaceholder;
	exports.updatePlaceholder = updatePlaceholder;
	exports.searchPackageByWord = searchPackageByWord;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * 类型
	 */
	function getAllType(params) {
	    return request.get('/api/software/type/all', params);
	} /*
	   * --------------------------------------------
	   * 基础件管理
	   * @version  1.0
	   * @author   shirley(hztanxuewei@corp.netease.com)
	   * --------------------------------------------
	   */
	function addType(params) {
	    return request.post('/api/software/type', params);
	}
	
	function delType(params) {
	    return request.del('/api/software/type', params);
	}
	
	function getType(params) {
	    return request.get('/api/software/type', params);
	}
	
	/*
	 * 基础包
	 */
	function searchPackage(params) {
	    return request.get('/api/software/base/query', params);
	}
	
	function addPackage(params) {
	    return request.post('/api/software/base/upload', params, 'formData');
	}
	
	function getPackage(id) {
	    return request.get('/api/software/base/get/' + id, {});
	}
	
	function updatePackage(params) {
	    return request.post('/api/software/base/update', params);
	}
	
	function delPackage(id) {
	    return request.del('/api/software/base/delete/' + id, {});
	}
	
	function addConfig(params) {
	    return request.post('/api/software/config/upload', params, 'formData');
	}
	
	function delConfig(id) {
	    return request.del('/api/software/config/delete/' + id, {});
	}
	/****功能: 获取某一个基础软件包下面的所有配置包信息******/
	function getAllConfig(params) {
	    return request.get('/api/software/config/query', params);
	}
	/*****功能: 获取对应配置软件包下的所有占位符信息****/
	function getPlaceholder(id) {
	    return request.get('/api/software/placeholder/' + id, {});
	}
	/*******功能：更新占位符信息，更新只能更新对应的数据类型、默认值、描述 这个的更新批量 */
	function updatePlaceholder(params) {
	    return request.post('/api/software/placeholder/update', params);
	}
	
	/*
	 * 基础包全局搜索
	 */
	function searchPackageByWord(params) {
	    return request.get('/api/software/base/search', params);
	}

/***/ },
/* 245 */
/***/ function(module, exports) {

	module.exports = "\n<div _v-477c4796=\"\">\n  <input type=\"button\" name=\"submit\" class=\"u-btn u-btn-primary mb10\" value=\"添加类型\" @click=\"add\" _v-477c4796=\"\">\n  <table class=\"m-table\" _v-477c4796=\"\">\n      <thead _v-477c4796=\"\">\n          <tr _v-477c4796=\"\">\n              <th _v-477c4796=\"\">名称</th>\n              <th _v-477c4796=\"\">描述</th>\n              <th _v-477c4796=\"\">操作</th>\n          </tr>\n      </thead>\n      <tbody _v-477c4796=\"\">\n          <tr v-for=\"type in typeList\" _v-477c4796=\"\">\n              <td _v-477c4796=\"\">{{ type.name }}</td>\n              <td _v-477c4796=\"\">{{ type.descp }}</td>\n              <td _v-477c4796=\"\">\n                  <i class=\"iconfont icon-edit\" @click=\"edit(type.id)\" title=\"编辑\" _v-477c4796=\"\"></i>\n                  <i class=\"iconfont icon-del\" @click=\"onDel(type.id)\" title=\"删除\" style=\"margin-left: 5px;\" _v-477c4796=\"\"></i>\n              </td>\n          </tr>\n      </tbody>\n  </table>\n</div>\n<modal :show.sync=\"showModal\" :submit=\"doSubmit\" _v-477c4796=\"\">\n  <h3 slot=\"header\" _v-477c4796=\"\">{{ obj.id?'修改':'添加' }}类型</h3>\n  <div slot=\"body\" _v-477c4796=\"\">\n    <validator name=\"validation1\" _v-477c4796=\"\">\n      <form class=\"m-form\" onsubmit=\"return false\" novalidate=\"\" _v-477c4796=\"\">\n        <div class=\"fmitem\" _v-477c4796=\"\">\n            <label class=\"fmlab\" _v-477c4796=\"\"><i _v-477c4796=\"\">*</i>名称：</label>\n            <div class=\"fmcnt\" _v-477c4796=\"\">\n                <input type=\"text\" name=\"\" class=\"u-ipt\" :class=\"{'check': check==true}\" v-validate:name=\"['required']\" v-model=\"obj.name\" _v-477c4796=\"\">\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-477c4796=\"\">\n            <label class=\"fmlab\" _v-477c4796=\"\">描述：</label>\n            <div class=\"fmcnt\" _v-477c4796=\"\">\n                <textarea class=\"u-ipt\" v-model=\"obj.descp\" _v-477c4796=\"\">                </textarea>\n            </div>\n        </div>\n      </form>\n    </validator>\n  </div>\n</modal>\n<modal :show.sync=\"showDelModal\" :submit=\"doDel\" _v-477c4796=\"\">\n  <h3 slot=\"header\" _v-477c4796=\"\">删除类型</h3>\n  <div slot=\"body\" _v-477c4796=\"\">\n    <p class=\"tip\" _v-477c4796=\"\"><i class=\"iconfont icon-tip\" _v-477c4796=\"\"></i>确定删除该类型么？</p>\n  </div>\n</modal>\n";

/***/ },
/* 246 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(247)
	__vue_script__ = __webpack_require__(248)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/sysConfig/basicPackage.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(257)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./basicPackage.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 247 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Select = __webpack_require__(189);
	
	var _Select2 = _interopRequireDefault(_Select);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _Upload = __webpack_require__(249);
	
	var _Upload2 = _interopRequireDefault(_Upload);
	
	var _basicPlaceholder = __webpack_require__(253);
	
	var _basicPlaceholder2 = _interopRequireDefault(_basicPlaceholder);
	
	var _util = __webpack_require__(66);
	
	var _util2 = _interopRequireDefault(_util);
	
	var _basicPartManage = __webpack_require__(244);
	
	var service = _interopRequireWildcard(_basicPartManage);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: {
	    vSelect: _Select2.default,
	    modal: _Modal2.default,
	    upload: _Upload2.default,
	    placeholader: _basicPlaceholder2.default
	  },
	  data: function data() {
	    return {
	      id: '',
	      value: '',
	      options: [],
	      packageList: [],
	      allConfigList: [],
	      placeholderList: [],
	      showModal: false,
	      showAddConfig: false,
	      showAllConfig: false,
	      showDelModal: false,
	
	      isFirstSubmit: true,
	      fileName: '',
	      obj: this.initObj(),
	      packageName: '',
	
	      showPlaceholder: false,
	      placeholderId: 0,
	      oneOfPHList: []
	    };
	  },
	  ready: function ready() {
	    this.getAllType();
	  },
	
	  watch: {
	    'value': function value(val, oldVal) {
	      this.search(val);
	      this.getPackageName(val);
	    }
	  },
	  methods: {
	    getAllType: function getAllType() {
	      var _this = this;
	
	      service.getAllType({}).then(function (data) {
	        _this.options = _util2.default.optionsData(data.list || [], 'id', 'name');
	      });
	    },
	    search: function search(val) {
	      var _this2 = this;
	
	      var params = {
	        typeId: val,
	        pageSize: 10,
	        pageNumber: 1
	      };
	      if (!val) {
	        this.packageList = [];
	        return;
	      }
	      service.searchPackage(params).then(function (data) {
	        _this2.packageList = data.result || [];
	      });
	    },
	    getPackageName: function getPackageName(val) {
	      var obj = _util2.default.findInMap(this.options, 'id', val);
	      this.packageName = obj ? obj.name : '';
	    },
	    initObj: function initObj() {
	      return {
	        typeId: '',
	        name: '',
	        descp: '',
	        file: '',
	        fileName: ''
	      };
	    },
	    onAddPackage: function onAddPackage() {
	      this.id = '';
	      this.showModal = true;
	      this.obj = this.initObj();
	      this.$els.form.file && (this.$els.form.file.value = '');
	      this.fileName = '';
	    },
	    onEditPackage: function onEditPackage(id) {
	      var _this3 = this;
	
	      this.id = id;
	      this.showModal = true;
	      service.getPackage(id).then(function (data) {
	        _this3.obj = data || {};
	      });
	    },
	    doAddPackage: function doAddPackage() {
	      var _this4 = this;
	
	      if (!this.obj.typeId) {
	        _vue2.default.$alert('请选择类型', 'danger');
	        return;
	      }
	      if (!this.fileName) {
	        _vue2.default.$alert('请上传文件', 'danger');
	        return;
	      }
	      if (!!this.id) {
	        if (!this.obj.name) {
	          _vue2.default.$alert('请输入名称', 'danger');
	          return;
	        }
	        service.updatePackage(this.obj).then(function (data) {
	          _vue2.default.$alert('修改成功', 'success');
	          _this4.showModal = false;
	          _this4.search(_this4.value);
	        });
	      } else {
	        var data = new FormData(this.$els.form);
	
	        service.addPackage(data).then(function (data) {
	          _vue2.default.$alert('添加成功', 'success');
	          _this4.showModal = false;
	          _this4.search(_this4.value);
	        });
	      }
	    },
	    onAddConfig: function onAddConfig(id) {
	      this.showAddConfig = true;
	      this.selId = id;
	      this.obj = {
	        typeId: '',
	        name: '',
	        descp: ''
	      };
	      this.$els.formadd.file.value = '';
	      this.fileName = '';
	    },
	    doAddConfig: function doAddConfig() {
	      var _this5 = this;
	
	      var data = new FormData(this.$els.formadd);
	      if (!this.fileName) {
	        _vue2.default.$alert('请上传文件', 'danger');
	        return;
	      }
	
	      data.append('baseSoftwareId', this.selId);
	
	      service.addConfig(data).then(function (data) {
	        _this5.isFirstSubmit = false;
	        _this5.placeholderList = data.list || [];
	        _this5.placeholderList.map(function (item) {
	          item.dataType = item.dataType ? item.dataType : 'STRING';
	          return item;
	        });
	      });
	    },
	    doAddPlaceholder: function doAddPlaceholder(type) {
	      var _this6 = this;
	
	      var list = type == "show" ? this.oneOfPHList : this.placeholderList;
	
	      service.updatePlaceholder(list).then(function (data) {
	        _vue2.default.$alert('保存成功', 'success');
	        _this6.showAddConfig = false;
	        _this6.isFirstSubmit = true;
	      });
	    },
	    onShowAllConfig: function onShowAllConfig(id) {
	      var _this7 = this;
	
	      this.showAllConfig = true;
	      this.baseId = id;
	      this.placeholderId = 0;
	
	      service.getAllConfig({
	        baseSoftwareId: id
	      }).then(function (data) {
	        _this7.allConfigList = data.list || [];
	      });
	    },
	    getPlaceholder: function getPlaceholder(id) {
	      var _this8 = this;
	
	      this.showPlaceholder = true;
	      if (this.placeholderId == id) {
	        this.placeholderId = 0;
	      } else {
	        this.placeholderId = id;
	        service.getPlaceholder(id).then(function (data) {
	          _this8.oneOfPHList = data.list || [];
	        });
	      }
	    },
	    save: function save() {
	      if (!this.placeholderId) return;
	      this.doAddPlaceholder('show');
	    },
	    delConfig: function delConfig(id) {
	      var _this9 = this;
	
	      service.delConfig(id).then(function (data) {
	        _vue2.default.$alert('删除成功', 'success');
	        _this9.onShowAllConfig(_this9.baseId);
	      });
	    },
	    onDel: function onDel(id) {
	      this.baseId = id;
	      this.showDelModal = true;
	    },
	    doDel: function doDel() {
	      var _this10 = this;
	
	      service.delPackage(this.baseId).then(function (data) {
	        _vue2.default.$alert('删除成功', 'success');
	        _this10.showDelModal = false;
	        _this10.search(_this10.value);
	      });
	    }
	  },
	  events: {}
	};

/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(250)
	__vue_script__ = __webpack_require__(251)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Upload.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(252)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Upload.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 250 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 251 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  props: {
	    fileName: {
	      type: String,
	      default: ''
	    },
	    fileTxt: {
	      twoWay: true,
	      type: String,
	      default: ''
	    },
	    show: {
	      type: Boolean,
	      default: false
	    }
	  },
	  data: function data() {
	    return {};
	  },
	  ready: function ready() {
	    this.$els.file.value = '';
	  },
	
	  methods: {
	    upload: function upload() {
	      this.$els.file.value = '';
	      this.$els.file.click();
	    },
	    select: function select() {
	      this.fileName = this.$els.file.files[0].name;
	
	      this.show && this.getFileTxt();
	    },
	    getFileTxt: function getFileTxt() {
	      var self = this;
	      var files = this.$els.file.files;
	      this.fileName = '';
	
	      if (files.length == 0) return;
	
	      if (!(window.File || window.FileReader || window.FileList || window.Blob)) return;
	
	      var reader = new FileReader();
	      reader.readAsText(files[0], 'UTF-8');
	      reader.onload = function (evt) {
	        var fileString = evt.target.result;
	        self.fileTxt = fileString;
	      };
	    }
	  }
	};

/***/ },
/* 252 */
/***/ function(module, exports) {

	module.exports = "\n<div>\n  <button class=\"u-btn\" @click.prevent=\"upload\">上传文件</button>\n  <span>{{ fileName }}</span>\n  <input type=\"file\" \n        name=\"file\" \n        v-el:file \n        @change=\"select\"/>\n</div>\n";

/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(254)
	__vue_script__ = __webpack_require__(255)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/sysConfig/basicPlaceholder.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(256)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./basicPlaceholder.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 254 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 255 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  props: {
	    placeholderList: {
	      type: Array,
	      default: []
	    }
	  },
	  data: function data() {
	    return {};
	  },
	  ready: function ready() {},
	
	  methods: {},
	  events: {}
	};

/***/ },
/* 256 */
/***/ function(module, exports) {

	module.exports = "\r\n<div class=\"fmitem\" v-for=\"item in placeholderList\">\r\n    <label class=\"fmlab\">{{ item.name }}：</label>\r\n    <div class=\"fmcnt\">\r\n        <select class=\"u-ipt\" v-model=\"item.dataType\">\r\n          <option value=\"INT\">INT</option>\r\n          <option value=\"DECIMAL\">DECIMAL</option>\r\n          <option value=\"STRING\">STRING</option>\r\n        </select>\r\n        <input type=\"text\" \r\n              class=\"u-ipt ml10\"\r\n              placeholder=\"请填写默认值\" \r\n              v-model=\"item.defaultValue\"/>\r\n        <input type=\"checkbox\" v-model=\"item.instanceUnique\" class=\"ml10\"/>唯一\r\n        <input type=\"checkbox\" v-model=\"item.mandatory\" class=\"ml10\"/>必填\r\n    </div>\r\n</div>\r\n<div class=\"fmitem\" v-if=\"placeholderList.length==0\">\r\n  <label class=\"fmlab\"></label>\r\n  <div class=\"fmcnt\">\r\n    <p class=\"no-data\" >暂无占位符信息</p>\r\n  </div>\r\n</div>\r\n";

/***/ },
/* 257 */
/***/ function(module, exports) {

	module.exports = "\n<div>\n  <form class=\"m-form\">\n      <div class=\"fmitem\">\n          <label class=\"fmlab\">类型</label>\n          <div class=\"fmcnt\">\n              <v-select :value.sync=\"value\" :options.sync=\"options\"></v-select>\n              <input type=\"button\" \n                     name=\"\" \n                     class=\"u-btn u-btn-primary ml30\" \n                     value=\"添加基础件\"\n                     @click=\"onAddPackage\"/>\n          </div>\n      </div>\n  </form>\n  <table class=\"m-table\">\n      <thead>\n          <tr>\n              <th>名称</th>\n              <th>描述</th>\n              <th>操作</th>\n          </tr>\n      </thead>\n      <tbody>\n          <tr v-for=\"item in packageList\">\n              <td><a @click.prevent=\"onEditPackage(item.id)\" href=\"\">{{ item.name }}</a></td>\n              <td>{{ item.descp }}</td>\n              <td class=\"u-btns\">\n                <span class=\"u-btn u-btn-s1\" @click=\"onAddConfig(item.id)\">增加配置</span>\n                <span class=\"u-btn u-btn-s1\" @click=\"onShowAllConfig(item.id)\">查看配置</span>\n                <span class=\"u-btn u-btn-s1\" @click=\"onDel(item.id)\">删除</span>\n                <a class=\"u-btn u-btn-s1\" href=\"/api/software/base/download/{{ item.id }}\">下载</a>\n              </td>\n          </tr>\n      </tbody>\n  </table>\n</div>\n<!-- 添加基础件 -->\n<modal :show.sync=\"showModal\" :submit=\"doAddPackage\">\n  <h3 slot=\"header\">{{ id?'修改':'添加'}}基础件</h3>\n  <div slot=\"body\">\n    <form class=\"m-form\" v-el:form>\n      <div class=\"fmitem\">\n          <label class=\"fmlab\"><i>*</i>类型：</label>\n          <div class=\"fmcnt\">\n              <select class=\"u-ipt\" \n                      v-if=\"!id\"\n                      v-model=\"obj.typeId\" \n                      name=\"typeId\">\n                <option value=\"\">请选择</option>\n                <option value=\"{{ item.id }}\" v-for=\"item in options\">{{ item.name }}</option>\n              </select>\n              <span v-else>{{ packageName }}</span>\n          </div>\n      </div>\n      <div class=\"fmitem\">\n          <label class=\"fmlab\">名称：</label>\n          <div class=\"fmcnt\">\n              <input type=\"text\" \n                     name=\"name\" \n                     class=\"u-ipt\"\n                     v-model=\"obj.name\"/>\n          </div>\n      </div>\n      <div class=\"fmitem\">\n          <label class=\"fmlab\">描述：</label>\n          <div class=\"fmcnt\">\n              <textarea class=\"u-ipt\"\n                        name=\"descp\"\n                        v-model=\"obj.descp\">\n              </textarea>\n          </div>\n      </div>\n      <div class=\"fmitem\">\n          <label class=\"fmlab\">文件：</label>\n          <div class=\"fmcnt\">\n              <upload :file-name.sync=\"fileName\" v-if=\"!id\"></upload>\n              {{ obj.fileName }}\n              <a v-if=\"id && obj.id\" \n                 href=\"/api/software/base/download/{{ obj.id }}\"\n                 class=\"ml10\">\n                <i class=\"iconfont icon-download\" title=\"下载\"></i>\n              </a>\n          </div>\n      </div>\n    </form>\n  </div>\n</modal>\n<!-- 增加配置 -->\n<modal :show.sync=\"showAddConfig\" \n       :submit=\"isFirstSubmit==true?doAddConfig:doAddPlaceholder\" \n       :modalclazz=\"isFirstSubmit==true?'':'modal-mid'\">\n  <h3 slot=\"header\">增加配置</h3>\n  <div slot=\"body\">\n    <form class=\"m-form\" v-el:formadd v-show=\"isFirstSubmit==true\">\n      <div class=\"fmitem\">\n          <label class=\"fmlab\">名称：</label>\n          <div class=\"fmcnt\">\n              <input type=\"text\" \n                     name=\"name\" \n                     class=\"u-ipt\"\n                     v-model=\"obj.name\"/>\n          </div>\n      </div>\n      <div class=\"fmitem\">\n          <label class=\"fmlab\">描述：</label>\n          <div class=\"fmcnt\">\n              <textarea class=\"u-ipt\"\n                        name=\"descp\"\n                        v-model=\"obj.descp\">\n              </textarea>\n          </div>\n      </div>\n      <div class=\"fmitem\">\n          <label class=\"fmlab\">文件：</label>\n          <div class=\"fmcnt\">\n              <upload :file-name.sync=\"fileName\"></upload>\n          </div>\n      </div>\n    </form>\n    <form class=\"m-form\" v-show=\"isFirstSubmit==false\">\n      <div class=\"fmitem\">\n          <label class=\"fmlab\">名称：</label>\n          <div class=\"fmcnt\">\n              {{ obj.name }}\n          </div>\n      </div>\n      <div class=\"fmitem\">\n          <label class=\"fmlab\">描述：</label>\n          <div class=\"fmcnt\">\n              {{ obj.descp }}\n          </div>\n      </div>\n      <placeholader :placeholder-list=\"placeholderList\"></placeholader>\n    </form>\n  </div>\n</modal>\n<modal :show.sync=\"showAllConfig\" \n       :bottom-bar=\"false\"\n       :modalclazz=\"showPlaceholder==false?'':'modal-mid'\">\n  <h3 slot=\"header\">查看配置</h3>\n  <div slot=\"body\">\n      <ul class=\"m-view-config\" v-if=\"allConfigList.length!=0\">\n        <li v-for=\"(index, item) in allConfigList\" class=\"j-li\">\n          <p>\n            {{ index+1 }}. {{ item.name }}\n            <a href=\"/api/software/config/download/{{item.id}}\">\n              <i class=\"iconfont icon-download\" title=\"下载\"></i>\n            </a>\n            <i \n                class=\"iconfont icon-arrow-bottom\"\n                title=\"展开\"\n                @click=\"getPlaceholder(item.id)\"></i>\n            <i \n                class=\"iconfont icon-del-2\" \n                title=\"删除\"\n                @click=\"delConfig(item.id)\"></i>\n          </p>\n          <div class=\"m-form\" v-if=\"item.id==placeholderId\">\n            <placeholader :placeholder-list=\"oneOfPHList\"></placeholader>\n            <div class=\"fmitem\" v-if=\"oneOfPHList.length!=0\">\n                <label class=\"fmlab\"></label>\n                <div class=\"fmcnt\">\n                    <input type=\"button\" \n                           class=\"u-btn u-btn-primary\" \n                           value=\"保存\"\n                           @click=\"save()\"/>\n                </div>\n            </div>\n          </div>\n        </li>\n      </ul>\n      <p v-else class=\"no-data\">暂无配置</p>\n  </div>\n</modal>\n<modal :show.sync=\"showDelModal\" :submit=\"doDel\">\n  <h3 slot=\"header\">删除类型</h3>\n  <div slot=\"body\">\n    <p class=\"tip\"><i class=\"iconfont icon-tip\"></i>确定删除该基础包么？</p>\n  </div>\n</modal>\n";

/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(259)
	__vue_script__ = __webpack_require__(260)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/sysConfig/templateManage.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(266)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./templateManage.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 259 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Select = __webpack_require__(189);
	
	var _Select2 = _interopRequireDefault(_Select);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _Upload = __webpack_require__(249);
	
	var _Upload2 = _interopRequireDefault(_Upload);
	
	var _Pager = __webpack_require__(261);
	
	var _Pager2 = _interopRequireDefault(_Pager);
	
	var _templateManage = __webpack_require__(265);
	
	var service = _interopRequireWildcard(_templateManage);
	
	var _basicPartManage = __webpack_require__(244);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: {
	    vSelect: _Select2.default,
	    modal: _Modal2.default,
	    upload: _Upload2.default,
	    pager: _Pager2.default
	  },
	  data: function data() {
	    return {
	      appTypeList: [],
	      tplList: [],
	      total: 1,
	
	      configId: '',
	      packageId: '',
	      basicList: [{
	        packageId: this.packageId || '',
	        configId: this.configId || '',
	        configList: []
	      }],
	      packageList: [],
	      configList: [],
	
	      templateFiles: [],
	      views: [],
	
	      showModal: false,
	      showAddComponent: false,
	      showAddScript: false,
	      showAllConfig: false,
	      showDelModal: false,
	
	      fileName: '',
	      obj: this.initObj(),
	      tplObj: this.initTplObj(),
	      check: false
	    };
	  },
	  ready: function ready() {
	    this.getTplList();
	
	    this.$refs.pager.$on('on-change', function (page) {
	      this.getTplList(page);
	    }.bind(this));
	  },
	
	  watch: {
	    'configId': function configId(val, oldVal) {
	      console.log(val);
	    },
	    'fileName': function fileName(val, oldVal) {
	      this.tplObj.name = val;
	    }
	  },
	  methods: {
	    getTplList: function getTplList(num) {
	      var _this = this;
	
	      service.getTplList({
	        pageSize: 10,
	        pageNumber: num || 1
	      }).then(function (data) {
	        _this.tplList = data.result || [];
	        _this.total = data.total;
	      });
	    },
	    getAppType: function getAppType() {
	      var _this2 = this;
	
	      service.getAppType({}).then(function (data) {
	        _this2.appTypeList = data || {};
	      });
	    },
	    initObj: function initObj() {
	      return {
	        appType: 'javaweb',
	        name: '',
	        descp: '',
	        id: ''
	      };
	    },
	    initTplObj: function initTplObj() {
	      return {
	        templateId: '',
	        name: '',
	        descp: '',
	        file: ''
	      };
	    },
	    initComObj: function initComObj() {
	      return {
	        packageId: this.packageId || '',
	        configId: this.configId || '',
	        configList: []
	      };
	    },
	    onAddTpl: function onAddTpl() {
	      this.getAppType();
	      this.check = false;
	      this.$resetValidation();
	      this.id = '';
	      this.showModal = true;
	      this.obj = this.initObj();
	    },
	    onEdit: function onEdit(id) {
	      var _this3 = this;
	
	      this.obj.id = id;
	      this.showModal = true;
	      this.getAppType();
	
	      service.get(id).then(function (data) {
	        _this3.obj = data || {};
	      });
	    },
	    doAddTpl: function doAddTpl() {
	      var _this4 = this;
	
	      this.check = true;
	      if (this.$validation1.invalid) {
	        _vue2.default.$alert('请填写必填项', 'danger');
	        return;
	      }
	
	      if (!!this.obj.id) {
	
	        service.edit(this.obj).then(function (data) {
	          _vue2.default.$alert('修改模板成功', 'success');
	          _this4.showModal = false;
	          _this4.getTplList();
	        });
	      } else {
	
	        service.add(this.obj).then(function (data) {
	          _vue2.default.$alert('添加模板成功', 'success');
	          _this4.showModal = false;
	          _this4.getTplList();
	        });
	      }
	    },
	    getPackageList: function getPackageList() {
	      var _this5 = this;
	
	      (0, _basicPartManage.searchPackageByWord)({
	        searchword: ''
	      }).then(function (data) {
	        _this5.packageList = data.list || [];
	      });
	    },
	    changePackage: function changePackage(id, index) {
	      this.getConfigList(id, index);
	    },
	    getConfigList: function getConfigList(id, index) {
	      var self = this;
	      if (!id) {
	        this.configList = [];
	        return;
	      }
	      (0, _basicPartManage.getAllConfig)({
	        baseSoftwareId: id
	      }).then(function (data) {
	        self.basicList[index].configList = data.list || [];
	      });
	    },
	    addRow: function addRow() {
	      this.basicList.push(this.initComObj());
	    },
	    onAddComponent: function onAddComponent(id) {
	      this.id = id;
	      this.showAddComponent = true;
	      this.getPackageList();
	    },
	    doAddComponent: function doAddComponent() {
	      var _this6 = this;
	
	      var configIdList = [];
	      this.basicList.forEach(function (item) {
	        item.configId && configIdList.push(item.configId);
	      });
	
	      if (configIdList.length == 0) {
	        _vue2.default.$alert('请至少选择一个组件', 'danger');
	        return;
	      }
	      var data = {
	        templateId: this.id,
	        softwareConfigId: configIdList
	      };
	      service.addComponent(data).then(function (data) {
	        _vue2.default.$alert('添加组件成功', 'success');
	        _this6.showAddComponent = false;
	      });
	    },
	    onDel: function onDel(id) {
	      this.id = id;
	      this.showDelModal = true;
	    },
	    doDel: function doDel() {
	      var _this7 = this;
	
	      service.del(this.id).then(function (data) {
	        _vue2.default.$alert('删除模板成功', 'success');
	        _this7.showDelModal = false;
	        _this7.getTplList();
	      });
	    },
	    onAddScript: function onAddScript(id) {
	      this.id = id;
	      this.showAddScript = true;
	
	      this.$els.form.file.value = '';
	      this.fileName = '';
	      this.tplObj = this.initTplObj();
	    },
	    doAddScript: function doAddScript() {
	      var _this8 = this;
	
	      var data = new FormData(this.$els.form);
	      if (!this.fileName) {
	        _vue2.default.$alert('请上传文件', 'danger');
	        return;
	      }
	      data.append('templateId', this.id);
	
	      service.addScript(data).then(function (data) {
	        _vue2.default.$alert('添加脚本成功', 'success');
	        _this8.showAddScript = false;
	      });
	    },
	    onShowAllConfig: function onShowAllConfig(id) {
	      var _this9 = this;
	
	      this.showAllConfig = true;
	      this.id = id;
	
	      service.getAllConfig(id).then(function (data) {
	        _this9.templateFiles = data.templateFiles || [];
	        _this9.views = data.views || [];
	      });
	    },
	    delScript: function delScript(id) {
	      var _this10 = this;
	
	      service.delScript(id).then(function (data) {
	        _vue2.default.$alert('删除脚本成功', 'success');
	        _this10.onShowAllConfig(_this10.id);
	      });
	    },
	    delComponent: function delComponent(id) {
	      var _this11 = this;
	
	      service.delComponent(id).then(function (data) {
	        _vue2.default.$alert('删除组件成功', 'success');
	        _this11.onShowAllConfig(_this11.id);
	      });
	    }
	  },
	  events: {}
	};

/***/ },
/* 261 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(262)
	__vue_script__ = __webpack_require__(263)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/components/Pager.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(264)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./Pager.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 262 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 263 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _defineProperty2 = __webpack_require__(85);
	
	var _defineProperty3 = _interopRequireDefault(_defineProperty2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var prefixCls = 'i-page';
	exports.default = {
	    props: {
	        current: {
	            type: Number,
	            default: 1
	        },
	        total: {
	            type: Number,
	            default: 0
	        },
	        pageSize: {
	            type: Number,
	            default: 10
	        }
	    },
	    data: function data() {
	        return {
	            prefixCls: prefixCls
	        };
	    },
	
	    computed: {
	        allPages: function allPages() {
	            return Math.ceil(this.total / this.pageSize);
	        },
	        prevClasses: function prevClasses() {
	            return [prefixCls + '-prev', (0, _defineProperty3.default)({}, prefixCls + '-disabled', this.current == 1)];
	        },
	        nextClasses: function nextClasses() {
	            return [prefixCls + '-next', (0, _defineProperty3.default)({}, prefixCls + '-disabled', this.current == this.allPages)];
	        }
	    },
	    methods: {
	        changePage: function changePage(page) {
	            if (this.current != page) {
	                this.current = page;
	                this.$emit('on-change', page);
	            }
	        },
	        prev: function prev() {
	            var current = this.current;
	            if (current <= 1) {
	                return false;
	            }
	            this.changePage(current - 1);
	        },
	        next: function next() {
	            var current = this.current;
	            if (current >= this.allPages) {
	                return false;
	            }
	            this.changePage(current + 1);
	        },
	        fastPrev: function fastPrev() {
	            var page = this.current - 5;
	            if (page > 0) {
	                this.changePage(page);
	            } else {
	                this.changePage(1);
	            }
	        },
	        fastNext: function fastNext() {
	            var page = this.current + 5;
	            if (page > this.allPages) {
	                this.changePage(this.allPages);
	            } else {
	                this.changePage(page);
	            }
	        }
	    }
	};

/***/ },
/* 264 */
/***/ function(module, exports) {

	module.exports = "\n<ul class=\"m-pager f-fr\" _v-255a645a=\"\">\n    <li title=\"上一页\" :class=\"prevClasses\" @click=\"prev\" _v-255a645a=\"\">\n        <a _v-255a645a=\"\"><i class=\"iconfont icon-arrow-left\" _v-255a645a=\"\"></i></a>\n    </li>\n    <li title=\"第一页\" :class=\"[`${prefixCls}`, {[`${prefixCls}-act`]: current == 1}]\" @click=\"changePage(1)\" _v-255a645a=\"\">\n        <a _v-255a645a=\"\">1</a>\n    </li>\n    <li title=\"向前 5 页\" v-if=\"current - 3 > 1\" :class=\"[`${prefixCls}-jump-prev`]\" @click=\"fastPrev\" _v-255a645a=\"\">\n        <a _v-255a645a=\"\">...</a>\n    </li>\n    <li :title=\"current - 2\" v-if=\"current - 2 > 1\" :class=\"[`${prefixCls}`]\" @click=\"changePage(current - 2)\" _v-255a645a=\"\">\n        <a _v-255a645a=\"\">{{ current - 2 }}</a>\n    </li>\n    <li :title=\"current - 1\" v-if=\"current - 1 > 1\" :class=\"[`${prefixCls}`]\" @click=\"changePage(current - 1)\" _v-255a645a=\"\">\n        <a _v-255a645a=\"\">{{ current - 1 }}</a>\n    </li>\n    <li :title=\"current\" v-if=\"current != 1 &amp;&amp; current != allPages\" :class=\"[`${prefixCls}`,`${prefixCls}-act`]\" _v-255a645a=\"\">\n        <a _v-255a645a=\"\">{{ current }}</a>\n    </li>\n    <li :title=\"current + 1\" v-if=\"current + 1 < allPages\" :class=\"[`${prefixCls}`]\" @click=\"changePage(current + 1)\" _v-255a645a=\"\">\n        <a _v-255a645a=\"\">{{ current + 1 }}</a>\n    </li>\n    <li :title=\"current + 2\" v-if=\"current + 2 < allPages\" :class=\"[`${prefixCls}`]\" @click=\"changePage(current + 2)\" _v-255a645a=\"\">\n        <a _v-255a645a=\"\">{{ current + 2 }}</a>\n    </li>\n    <li title=\"向后 5 页\" v-if=\"current + 3 < allPages\" :class=\"[`${prefixCls}-jump-next`]\" @click=\"fastNext\" _v-255a645a=\"\">\n        <a _v-255a645a=\"\">...</a>\n    </li>\n    <li :title=\"'最后一页:' + allPages\" v-if=\"allPages>1\" :class=\"[`${prefixCls}`, {[`${prefixCls}-act`]: current == allPages}]\" @click=\"changePage(allPages)\" _v-255a645a=\"\">\n        <a _v-255a645a=\"\">{{ allPages }}</a>\n    </li>\n    <li title=\"下一页\" :class=\"nextClasses\" @click=\"next\" _v-255a645a=\"\">\n        <a _v-255a645a=\"\"><i class=\"iconfont icon-arrow-right\" _v-255a645a=\"\"></i></a>\n    </li>\n</ul>\n";

/***/ },
/* 265 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getTplList = getTplList;
	exports.getAppType = getAppType;
	exports.add = add;
	exports.edit = edit;
	exports.del = del;
	exports.get = get;
	exports.addComponent = addComponent;
	exports.delComponent = delComponent;
	exports.addScript = addScript;
	exports.delScript = delScript;
	exports.getAllConfig = getAllConfig;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * 模板
	 */
	function getTplList(params) {
	    return request.get('/api/template/list', params);
	}
	
	//获取应用类型
	/*
	 * --------------------------------------------
	 * 模板配置
	 * @version  1.0
	 * @author   shirley(hztanxuewei@corp.netease.com)
	 * --------------------------------------------
	 */
	function getAppType(params) {
	    return request.get('/api/template/config/templateTypeList', params);
	}
	
	function add(params) {
	    return request.post('/api/template/add', params);
	}
	
	function edit(params) {
	    return request.post('/api/template/update', params);
	}
	
	function del(id) {
	    return request.del('/api/template/' + id, {});
	}
	
	function get(id) {
	    return request.get('/api/template/' + id, {});
	}
	
	/*
	 * 组件
	 */
	function addComponent(params) {
	    return request.post('/api/template/config/add', params);
	}
	
	function delComponent(id) {
	    return request.del('/api/template/config/' + id, {});
	}
	
	/*
	 * 脚本
	 */
	function addScript(params) {
	    return request.post('/api/template/config/file/add', params, 'formData');
	}
	
	function delScript(id) {
	    return request.del('/api/template/config/file/' + id, {});
	}
	
	/*
	 * 查看配置
	 */
	function getAllConfig(id) {
	    return request.get('/api/template/config/' + id, {});
	}

/***/ },
/* 266 */
/***/ function(module, exports) {

	module.exports = "\n<div _v-756735a2=\"\">\n  <input type=\"button\" name=\"submit\" class=\"u-btn u-btn-primary mb10\" value=\"添加模板\" @click=\"onAddTpl\" _v-756735a2=\"\">\n  <table class=\"m-table\" _v-756735a2=\"\">\n      <thead _v-756735a2=\"\">\n          <tr _v-756735a2=\"\">\n              <th _v-756735a2=\"\">名称</th>\n              <th _v-756735a2=\"\">类型</th>\n              <th _v-756735a2=\"\">描述</th>\n              <th _v-756735a2=\"\">操作</th>\n          </tr>\n      </thead>\n      <tbody _v-756735a2=\"\">\n          <tr v-for=\"item in tplList\" _v-756735a2=\"\">\n              <td _v-756735a2=\"\"><a @click.prevent=\"onEdit(item.id)\" href=\"\" _v-756735a2=\"\">{{ item.name }}</a></td>\n              <td _v-756735a2=\"\">{{ item.appType }}</td>\n              <td _v-756735a2=\"\">{{ item.descp }}</td>\n              <td class=\"u-btns\" _v-756735a2=\"\">\n                <span class=\"u-btn u-btn-s1\" @click=\"onAddComponent(item.id)\" _v-756735a2=\"\">增加组件</span>\n                <span class=\"u-btn u-btn-s1\" @click=\"onAddScript(item.id)\" _v-756735a2=\"\">添加脚本</span>\n                <span class=\"u-btn u-btn-s1\" @click=\"onShowAllConfig(item.id)\" _v-756735a2=\"\">查看</span>\n                <span class=\"u-btn u-btn-s1\" @click=\"onDel(item.id)\" _v-756735a2=\"\">删除</span>\n              </td>\n          </tr>\n      </tbody>\n  </table>\n  <pager :total=\"total\" v-ref:pager=\"\" _v-756735a2=\"\"></pager>\n</div>\n<!-- 添加模板 -->\n<modal :show.sync=\"showModal\" :submit=\"doAddTpl\" _v-756735a2=\"\">\n  <h3 slot=\"header\" _v-756735a2=\"\">{{ obj.id?'修改':'添加' }}模板</h3>\n  <div slot=\"body\" _v-756735a2=\"\">\n    <validator name=\"validation1\" _v-756735a2=\"\">\n      <form class=\"m-form\" v-el:form=\"\" novalidate=\"\" _v-756735a2=\"\">\n        <div class=\"fmitem\" _v-756735a2=\"\">\n            <label class=\"fmlab\" _v-756735a2=\"\"><i _v-756735a2=\"\">*</i>名称：</label>\n            <div class=\"fmcnt\" _v-756735a2=\"\">\n                <input type=\"text\" name=\"name\" class=\"u-ipt\" :class=\"{'check': check==true}\" v-model=\"obj.name\" v-validate:message=\"['required']\" _v-756735a2=\"\">\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-756735a2=\"\">\n            <label class=\"fmlab\" _v-756735a2=\"\"><i _v-756735a2=\"\">*</i>类型：</label>\n            <div class=\"fmcnt\" _v-756735a2=\"\">\n                <select class=\"u-ipt\" v-model=\"obj.appType\" name=\"appType\" _v-756735a2=\"\">\n                  <option value=\"{{ key }}\" v-for=\"(key, val) in appTypeList\" _v-756735a2=\"\">{{ val }}</option>\n                </select>\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-756735a2=\"\">\n            <label class=\"fmlab\" _v-756735a2=\"\">描述：</label>\n            <div class=\"fmcnt\" _v-756735a2=\"\">\n                <textarea class=\"u-ipt\" name=\"descp\" v-model=\"obj.descp\" _v-756735a2=\"\">                </textarea>\n            </div>\n        </div>\n      </form>\n    </validator>\n  </div>\n</modal>\n<!-- 添加组件 -->\n<modal :show.sync=\"showAddComponent\" :submit=\"doAddComponent\" _v-756735a2=\"\">\n  <h3 slot=\"header\" _v-756735a2=\"\">添加组件</h3>\n  <div slot=\"body\" _v-756735a2=\"\">\n    <h3 _v-756735a2=\"\">基础组件</h3>\n    <form class=\"m-form\" v-el:form=\"\" _v-756735a2=\"\">\n      <div class=\"fmitem\" v-for=\"(index, basic) in basicList\" _v-756735a2=\"\">\n          <label class=\"fmlab\" _v-756735a2=\"\"></label>\n          <div class=\"fmcnt\" _v-756735a2=\"\">\n              <select class=\"u-ipt\" v-model=\"basic.packageId\" @change=\"changePackage(basic.packageId, index)\" _v-756735a2=\"\">\n                <option value=\"\" _v-756735a2=\"\">请选择</option>\n                <option value=\"{{ item.id }}\" v-for=\"item in packageList\" _v-756735a2=\"\">{{ item.name }}</option>\n              </select>\n              <select class=\"u-ipt\" v-model=\"basic.configId\" _v-756735a2=\"\">\n                <option value=\"\" _v-756735a2=\"\">请选择</option>\n                <option value=\"{{ item.id }}\" v-for=\"item in basic.configList\" _v-756735a2=\"\">{{ item.name }}</option>\n              </select>\n              <i class=\"iconfont icon-add\" v-if=\"index==basicList.length-1\" @click=\"addRow\" _v-756735a2=\"\"></i>\n          </div>\n      </div>\n    </form>\n  </div>\n</modal>\n<!-- 添加脚本 -->\n<modal :show.sync=\"showAddScript\" :submit=\"doAddScript\" _v-756735a2=\"\">\n  <h3 slot=\"header\" _v-756735a2=\"\">添加脚本</h3>\n  <div slot=\"body\" _v-756735a2=\"\">\n    <form class=\"m-form\" v-el:form=\"\" _v-756735a2=\"\">\n      <div class=\"fmitem\" _v-756735a2=\"\">\n          <label class=\"fmlab\" _v-756735a2=\"\">名称：</label>\n          <div class=\"fmcnt\" _v-756735a2=\"\">\n              <input type=\"text\" name=\"name\" class=\"u-ipt\" disabled=\"\" v-model=\"tplObj.name\" _v-756735a2=\"\">\n          </div>\n      </div>\n      <div class=\"fmitem\" _v-756735a2=\"\">\n          <label class=\"fmlab\" _v-756735a2=\"\">描述：</label>\n          <div class=\"fmcnt\" _v-756735a2=\"\">\n              <textarea class=\"u-ipt\" name=\"descp\" v-model=\"tplObj.descp\" _v-756735a2=\"\">              </textarea>\n          </div>\n      </div>\n      <div class=\"fmitem\" _v-756735a2=\"\">\n          <label class=\"fmlab\" _v-756735a2=\"\">文件：</label>\n          <div class=\"fmcnt\" _v-756735a2=\"\">\n              <upload :file-name.sync=\"fileName\" _v-756735a2=\"\"></upload>\n          </div>\n      </div>\n    </form>\n  </div>\n</modal>\n<!-- 查看配置 -->\n<modal :show.sync=\"showAllConfig\" :bottom-bar=\"false\" _v-756735a2=\"\">\n  <h3 slot=\"header\" _v-756735a2=\"\">查看配置</h3>\n  <div slot=\"body\" _v-756735a2=\"\">\n      <h3 class=\"title\" _v-756735a2=\"\">组件信息</h3>\n      <ul class=\"m-view-config\" v-if=\"views.length!=0\" _v-756735a2=\"\">\n        <li v-for=\"(index, item) in views\" class=\"j-li\" _v-756735a2=\"\">\n          <p _v-756735a2=\"\">\n            {{ index+1 }}. {{ item.baseSoftwareName }}({{item.baseSoftwareConfigName}})\n            <i class=\"iconfont icon-del-2\" title=\"删除\" @click=\"delComponent(item.templateSoftwareId)\" _v-756735a2=\"\"></i>\n          </p>\n        </li>\n      </ul>\n      <p v-else=\"\" class=\"no-data\" _v-756735a2=\"\">无</p>\n      <h3 class=\"title\" _v-756735a2=\"\">脚本信息</h3>\n      <ul class=\"m-view-config\" v-if=\"templateFiles.length!=0\" _v-756735a2=\"\">\n        <li v-for=\"(index, item) in templateFiles\" class=\"j-li\" _v-756735a2=\"\">\n          <p _v-756735a2=\"\">\n            {{ index+1 }}. {{ item.fileName }}\n            <a href=\"/api/template/config/file/download/{{item.id}}\" _v-756735a2=\"\">\n              <i class=\"iconfont icon-download\" title=\"下载\" _v-756735a2=\"\"></i>\n            </a>\n            <i class=\"iconfont icon-del-2\" title=\"删除\" @click=\"delScript(item.id)\" _v-756735a2=\"\"></i>\n          </p>\n        </li>\n      </ul>\n      <p v-else=\"\" class=\"no-data\" _v-756735a2=\"\">无</p>\n  </div>\n</modal>\n<!-- 删除 -->\n<modal :show.sync=\"showDelModal\" :submit=\"doDel\" _v-756735a2=\"\">\n  <h3 slot=\"header\" _v-756735a2=\"\">删除模板</h3>\n  <div slot=\"body\" _v-756735a2=\"\">\n    <p class=\"tip\" _v-756735a2=\"\"><i class=\"iconfont icon-tip\" _v-756735a2=\"\"></i>确定删除该模板么？</p>\n  </div>\n</modal>\n";

/***/ },
/* 267 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(268)
	__vue_script__ = __webpack_require__(269)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/sysConfig/productSetting.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(271)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./productSetting.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 268 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 269 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _Select = __webpack_require__(189);
	
	var _Select2 = _interopRequireDefault(_Select);
	
	var _Pager = __webpack_require__(261);
	
	var _Pager2 = _interopRequireDefault(_Pager);
	
	var _util = __webpack_require__(66);
	
	var _util2 = _interopRequireDefault(_util);
	
	var _productSetting = __webpack_require__(270);
	
	var service = _interopRequireWildcard(_productSetting);
	
	var _common = __webpack_require__(22);
	
	var _nosStoreManage = __webpack_require__(239);
	
	var _buildServerManage = __webpack_require__(234);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: {
	    modal: _Modal2.default,
	    vSelect: _Select2.default,
	    pager: _Pager2.default
	  },
	  data: function data() {
	    return {
	      proList: [],
	      allProList: [],
	      nosList: [],
	      clusterList: [],
	      showModal: false,
	      showDelModal: false,
	      obj: this.initObj(),
	      total: 1
	    };
	  },
	  ready: function ready() {
	    this.getList();
	    this.getAllProductList();
	    this.getAllNos();
	    this.getClusterList();
	
	    this.$refs.pager.$on('on-change', function (page) {
	      this.getList(page);
	    }.bind(this));
	  },
	
	  methods: {
	    getList: function getList(num) {
	      var _this = this;
	
	      service.getList({
	        pageSize: 10,
	        pageNumber: num || 1
	      }).then(function (data) {
	        _this.proList = data.result || [];
	        _this.total = data.total;
	      });
	    },
	    getAllProductList: function getAllProductList() {
	      var _this2 = this;
	
	      (0, _common.getAllProductList)({}).then(function (data) {
	        _this2.allProList = _util2.default.optionsData(data.list || [], 'productId', 'productName');
	      });
	    },
	    getAllNos: function getAllNos() {
	      var _this3 = this;
	
	      (0, _nosStoreManage.getAllNos)({}).then(function (data) {
	        _this3.nosList = _util2.default.optionsData(data.list || [], 'id', 'name');
	        _this3.nosList.unshift({ value: '请选择', label: '请选择' });
	      });
	    },
	    getClusterList: function getClusterList() {
	      var _this4 = this;
	
	      (0, _buildServerManage.getAllServer)({}).then(function (data) {
	        _this4.clusterList = _util2.default.optionsData(data.list || [], 'clusterId', 'clusterName');
	        _this4.clusterList.unshift({ value: '请选择', label: '请选择' });
	      });
	    },
	    initObj: function initObj() {
	      return {
	        productId: '',
	        nosConfigId: '',
	        buildServerClusterId: '',
	        id: ''
	      };
	    },
	    add: function add() {
	      this.showModal = true;
	      this.obj = this.initObj();
	    },
	    edit: function edit(id) {
	      var _this5 = this;
	
	      service.get(id).then(function (data) {
	        _this5.showModal = true;
	        _this5.obj = data;
	      });
	    },
	    onDel: function onDel(id) {
	      this.showDelModal = true;
	      this.delId = id;
	    },
	    doDel: function doDel() {
	      var _this6 = this;
	
	      service.del(this.delId).then(function (data) {
	        _vue2.default.$alert('删除成功', 'success');
	        _this6.showDelModal = false;
	        _this6.delId = '';
	        _this6.getList();
	      });
	    },
	    doSubmit: function doSubmit() {
	      var _this7 = this;
	
	      if (!this.obj.productId) {
	        _vue2.default.$alert('请选择产品', 'danger');
	        return;
	      }
	      service.add(this.obj).then(function (data) {
	        _vue2.default.$alert('操作成功', 'success');
	        _this7.showModal = false;
	        _this7.getList();
	      });
	    }
	  },
	  events: {}
	};

/***/ },
/* 270 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getList = getList;
	exports.add = add;
	exports.del = del;
	exports.get = get;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * 
	 */
	function getList(params) {
	    return request.get('/api/product/config', params);
	} /*
	   * --------------------------------------------
	   * 产品设置
	   * @version  1.0
	   * @author   shirley(hztanxuewei@corp.netease.com)
	   * --------------------------------------------
	   */
	function add(params) {
	    return request.post('/api/product/config', params);
	}
	function del(id) {
	    return request.del('/api/product/config/' + id, {});
	}
	function get(id) {
	    return request.get('/api/product/config/' + id, {});
	}

/***/ },
/* 271 */
/***/ function(module, exports) {

	module.exports = "\n<div _v-68d62084=\"\">\n  <input type=\"button\" name=\"submit\" class=\"u-btn u-btn-primary mb10\" value=\"添加\" @click=\"add\" _v-68d62084=\"\">\n  <table class=\"m-table\" _v-68d62084=\"\">\n      <thead _v-68d62084=\"\">\n          <tr _v-68d62084=\"\">\n              <th _v-68d62084=\"\">产品</th>\n              <th _v-68d62084=\"\">nos存储</th>\n              <th _v-68d62084=\"\">构建集群</th>\n              <th _v-68d62084=\"\">操作</th>\n          </tr>\n      </thead>\n      <tbody _v-68d62084=\"\">\n          <tr v-for=\"item in proList\" _v-68d62084=\"\">\n              <td _v-68d62084=\"\">{{ item.productName }}</td>\n              <td _v-68d62084=\"\">{{ item.nosName }}</td>\n              <td title=\"{{ item.clusterName }}\" _v-68d62084=\"\">{{ item.clusterName }}</td>\n              <td _v-68d62084=\"\">\n                  <i class=\"iconfont icon-setting\" @click=\"edit(item.id)\" title=\"设置\" _v-68d62084=\"\"></i>\n                  <i class=\"iconfont icon-del\" @click=\"onDel(item.id)\" title=\"删除\" style=\"margin-left: 5px;\" _v-68d62084=\"\"></i>\n              </td>\n          </tr>\n      </tbody>\n  </table>\n  <pager :total=\"total\" v-ref:pager=\"\" _v-68d62084=\"\"></pager>\n</div>\n<modal :show.sync=\"showModal\" :submit=\"doSubmit\" :modalclazz=\"'modal-no-auto'\" _v-68d62084=\"\">\n  <h3 slot=\"header\" _v-68d62084=\"\">添加NOS</h3>\n  <div slot=\"body\" _v-68d62084=\"\">\n    <form class=\"m-form\" _v-68d62084=\"\">\n      <div class=\"fmitem\" _v-68d62084=\"\">\n          <label class=\"fmlab\" _v-68d62084=\"\"><i _v-68d62084=\"\">*</i>产品名称：</label>\n          <div class=\"fmcnt\" _v-68d62084=\"\">\n              <v-select :value.sync=\"obj.productId\" :options.sync=\"allProList\" search=\"\" justified=\"\" _v-68d62084=\"\"></v-select>\n          </div>\n      </div>\n      <div class=\"fmitem\" _v-68d62084=\"\">\n          <label class=\"fmlab\" _v-68d62084=\"\">nos存储：</label>\n          <div class=\"fmcnt\" _v-68d62084=\"\">\n              <v-select :value.sync=\"obj.nosConfigId\" :options.sync=\"nosList\" justified=\"\" _v-68d62084=\"\"></v-select>\n          </div>\n      </div>\n      <div class=\"fmitem\" _v-68d62084=\"\">\n          <label class=\"fmlab\" _v-68d62084=\"\">构建集群：</label>\n          <div class=\"fmcnt\" _v-68d62084=\"\">\n              <v-select :value.sync=\"obj.buildServerClusterId\" :options.sync=\"clusterList\" justified=\"\" _v-68d62084=\"\"></v-select>\n          </div>\n      </div>\n    </form>\n  </div>\n</modal>\n<modal :show.sync=\"showDelModal\" :submit=\"doDel\" _v-68d62084=\"\">\n  <h3 slot=\"header\" _v-68d62084=\"\">删除产品配置</h3>\n  <div slot=\"body\" _v-68d62084=\"\">\n    <p class=\"tip\" _v-68d62084=\"\"><i class=\"iconfont icon-tip\" _v-68d62084=\"\"></i>确定删除该产品配置么？</p>\n  </div>\n</modal>\n";

/***/ },
/* 272 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(273)
	__vue_script__ = __webpack_require__(274)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/sysConfig/admin.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(276)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./admin.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 273 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 274 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _Pager = __webpack_require__(261);
	
	var _Pager2 = _interopRequireDefault(_Pager);
	
	var _util = __webpack_require__(66);
	
	var _util2 = _interopRequireDefault(_util);
	
	var _admin = __webpack_require__(275);
	
	var service = _interopRequireWildcard(_admin);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: {
	    modal: _Modal2.default,
	    pager: _Pager2.default
	  },
	  data: function data() {
	    return {
	      adminList: [],
	      nosList: [],
	      account: '',
	      showModal: false,
	      showDelModal: false,
	      searchWord: '',
	      total: 1,
	      first: true
	    };
	  },
	
	  computed: {
	    showPage: function showPage() {
	      return this.total > 10 ? true : false;
	    }
	  },
	  watch: {
	    'total': function total(val) {
	      if (val > 10 && this.$refs.pager) {
	
	        this.$refs.pager.$on('on-change', function (page) {
	          this.getAdminList(page);
	        }.bind(this));
	        return true;
	      }
	    }
	  },
	  ready: function ready() {
	    this.getAdminList(1, 'init');
	  },
	
	  methods: {
	    getAdminList: function getAdminList(num, type) {
	      var _this = this;
	
	      service.getAdminList({
	        pageSize: 10,
	        pageNumber: num || 1
	      }).then(function (data) {
	        _this.adminList = data.list || [];
	        _this.total = data.total;
	        type == 'init' && (_this.first = false);
	      });
	    },
	    keyupIpt: function keyupIpt(e) {
	      if (e.which == 13) {
	        this.search();
	      }
	    },
	    search: function search() {
	      var _this2 = this;
	
	      if (!this.searchWord) {
	        this.getAdminList(1);
	        return;
	      }
	      service.searchUser({
	        keyWord: this.searchWord
	      }).then(function (data) {
	        _this2.adminList = data.list || [];
	        _this2.total = data.total || 1;
	      });
	    },
	    onAdd: function onAdd(account) {
	      this.account = account;
	      this.showModal = true;
	    },
	    doAdd: function doAdd() {
	      var _this3 = this;
	
	      service.setAdmin(this.account).then(function (data) {
	        _vue2.default.$alert('设置管理员成功', 'success');
	        _this3.searchWord = '';
	        _this3.showModal = false;
	        _this3.account = '';
	        _this3.getAdminList(1);
	      });
	    },
	    onDel: function onDel(account) {
	      this.account = account;
	      this.showDelModal = true;
	    },
	    doDel: function doDel() {
	      var _this4 = this;
	
	      service.cancelAdmin(this.account).then(function (data) {
	        _vue2.default.$alert('删除管理员成功', 'success');
	        _this4.searchWord = '';
	        _this4.showDelModal = false;
	        _this4.account = '';
	        _this4.getAdminList(1);
	      });
	    }
	  },
	  events: {}
	};

/***/ },
/* 275 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getAdminList = getAdminList;
	exports.searchUser = searchUser;
	exports.setAdmin = setAdmin;
	exports.cancelAdmin = cancelAdmin;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * get
	 */
	function getAdminList(params) {
	  return request.post('/api/user/listAdmin', params);
	} /*
	   * --------------------------------------------
	   * 权限
	   * @version  1.0
	   * @author   shirley(hztanxuewei@corp.netease.com)
	   * --------------------------------------------
	   */
	function searchUser(params) {
	  return request.get('/api/user/searchUser', params);
	}
	
	/*
	 * 设置管理员
	 */
	function setAdmin(account) {
	  return request.get('/api/user/setAdmin/' + account, {});
	}
	
	/*
	 * 取消管理员
	 */
	function cancelAdmin(account) {
	  return request.get('/api/user/cancelAdmin/' + account, {});
	}

/***/ },
/* 276 */
/***/ function(module, exports) {

	module.exports = "\n<div _v-6e55e5fc=\"\">\n  <div class=\"mb10\" _v-6e55e5fc=\"\">\n      <input type=\"text\" class=\"u-ipt\" placeholder=\"输入姓名或邮箱前缀搜索\" @keyup=\"keyupIpt($event)\" v-model=\"searchWord\" _v-6e55e5fc=\"\">\n      <input type=\"button\" name=\"\" class=\"u-btn u-btn-primary ml30\" value=\"搜索\" @click=\"search('refresh')\" _v-6e55e5fc=\"\">\n  </div>\n  <table class=\"m-table\" _v-6e55e5fc=\"\">\n      <thead _v-6e55e5fc=\"\">\n          <tr _v-6e55e5fc=\"\">\n              <th _v-6e55e5fc=\"\">姓名</th>\n              <th _v-6e55e5fc=\"\">邮箱前缀</th>\n              <th _v-6e55e5fc=\"\">工号</th>\n              <th _v-6e55e5fc=\"\">是否管理员</th>\n              <th _v-6e55e5fc=\"\">操作</th>\n          </tr>\n      </thead>\n      <tbody _v-6e55e5fc=\"\">\n          <tr v-for=\"item in adminList\" _v-6e55e5fc=\"\">\n              <td _v-6e55e5fc=\"\">{{ item.userName }}</td>\n              <td _v-6e55e5fc=\"\">{{ item.account }}</td>\n              <td _v-6e55e5fc=\"\">{{ item.jobNumber }}</td>\n              <td _v-6e55e5fc=\"\">{{ item.isAdmin==1?'是':'否' }}</td>\n              <td _v-6e55e5fc=\"\">\n                  <span v-if=\"item.isAdmin==0\" class=\" u-btn u-btn-s1\" @click=\"onAdd(item.account)\" _v-6e55e5fc=\"\">添加管理员</span>\n                  <span v-else=\"\" class=\" u-btn u-btn-s1\" @click=\"onDel(item.account)\" _v-6e55e5fc=\"\">删除管理员</span>\n              </td>\n          </tr>\n      </tbody>\n  </table>\n  <p class=\"table-no-data\" v-if=\"!first &amp;&amp; adminList.length==0\" _v-6e55e5fc=\"\">暂无数据</p>\n  <pager :total=\"total\" v-ref:pager=\"\" v-if=\"showPage\" _v-6e55e5fc=\"\"></pager>\n</div>\n<modal :show.sync=\"showModal\" :submit=\"doAdd\" _v-6e55e5fc=\"\">\n  <h3 slot=\"header\" _v-6e55e5fc=\"\">添加管理员</h3>\n  <div slot=\"body\" _v-6e55e5fc=\"\">\n    <p class=\"tip\" _v-6e55e5fc=\"\"><i class=\"iconfont icon-tip\" _v-6e55e5fc=\"\"></i>确定添加为管理员？</p>\n  </div>\n</modal>\n<modal :show.sync=\"showDelModal\" :submit=\"doDel\" _v-6e55e5fc=\"\">\n  <h3 slot=\"header\" _v-6e55e5fc=\"\">删除管理员</h3>\n  <div slot=\"body\" _v-6e55e5fc=\"\">\n    <p class=\"tip\" _v-6e55e5fc=\"\"><i class=\"iconfont icon-tip\" _v-6e55e5fc=\"\"></i>确定删除管理员？</p>\n  </div>\n</modal>\n";

/***/ },
/* 277 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(278)
	__vue_script__ = __webpack_require__(279)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/userConfig/index.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(280)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./index.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 278 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 279 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Tab = __webpack_require__(174);
	
	var _Tab2 = _interopRequireDefault(_Tab);
	
	var _Tabs = __webpack_require__(177);
	
	var _Tabs2 = _interopRequireDefault(_Tabs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: { Tab: _Tab2.default, Tabs: _Tabs2.default },
	  data: function data() {
	    return {};
	  },
	
	  methods: {}
	};

/***/ },
/* 280 */
/***/ function(module, exports) {

	module.exports = "\n  <div class=\"m-content\">\n    <tabs>\n      <tab header=\"密钥管理\" url=\"/userConfig/secretKey\">\n      </tab>\n    </tabs>\n    <router-view></router-view>\n</template>";

/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

	var __vue_script__, __vue_template__
	__webpack_require__(282)
	__vue_script__ = __webpack_require__(283)
	if (__vue_script__ &&
	    __vue_script__.__esModule &&
	    Object.keys(__vue_script__).length > 1) {
	  console.warn("[vue-loader] src/module/userConfig/secretKey.vue: named exports in *.vue files are ignored.")}
	__vue_template__ = __webpack_require__(285)
	module.exports = __vue_script__ || {}
	if (module.exports.__esModule) module.exports = module.exports.default
	if (__vue_template__) {
	(typeof module.exports === "function" ? (module.exports.options || (module.exports.options = {})) : module.exports).template = __vue_template__
	}
	if (false) {(function () {  module.hot.accept()
	  var hotAPI = require("vue-hot-reload-api")
	  hotAPI.install(require("vue"), false)
	  if (!hotAPI.compatible) return
	  var id = "./secretKey.vue"
	  if (!module.hot.data) {
	    hotAPI.createRecord(id, module.exports)
	  } else {
	    hotAPI.update(id, module.exports, __vue_template__)
	  }
	})()}

/***/ },
/* 282 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 283 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _vue = __webpack_require__(3);
	
	var _vue2 = _interopRequireDefault(_vue);
	
	var _Select = __webpack_require__(189);
	
	var _Select2 = _interopRequireDefault(_Select);
	
	var _Modal = __webpack_require__(89);
	
	var _Modal2 = _interopRequireDefault(_Modal);
	
	var _Upload = __webpack_require__(249);
	
	var _Upload2 = _interopRequireDefault(_Upload);
	
	var _secretKey = __webpack_require__(284);
	
	var service = _interopRequireWildcard(_secretKey);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  components: {
	    vSelect: _Select2.default,
	    modal: _Modal2.default,
	    upload: _Upload2.default
	  },
	  data: function data() {
	    return {
	      proList: [],
	      secretKeyList: [],
	      showModal: false,
	      showDelModal: false,
	      fileName: '',
	      fileTxt: '',
	      obj: this.initObj(),
	      check: false
	    };
	  },
	  ready: function ready() {
	    this.getList();
	  },
	
	  methods: {
	    initObj: function initObj() {
	      return {
	        name: '',
	        privateKey: '',
	        id: ''
	      };
	    },
	    getList: function getList() {
	      var _this = this;
	
	      service.getList({}).then(function (data) {
	        _this.secretKeyList = data.result || [];
	      });
	    },
	    add: function add() {
	      this.check = false;
	      this.$resetValidation();
	      this.obj = this.initObj();
	      this.obj.productId = this.proList[0] ? this.proList[0].productId : '';
	      this.showModal = true;
	    },
	    edit: function edit(id) {
	      var _this2 = this;
	
	      service.get(id).then(function (data) {
	        _this2.showModal = true;
	        _this2.obj = data;
	      });
	    },
	    doSubmit: function doSubmit() {
	      var _this3 = this;
	
	      this.check = true;
	      if (this.$validation1.invalid) {
	        _vue2.default.$alert('请填写必填项', 'danger');
	        return;
	      }
	      service.add(this.obj).then(function (data) {
	        _vue2.default.$alert('操作成功', 'success');
	        _this3.showModal = false;
	        _this3.getList();
	      });
	    },
	    del: function del(id) {
	      this.id = id;
	      this.showDelModal = true;
	    },
	    doDel: function doDel() {
	      var _this4 = this;
	
	      service.del(this.id).then(function (data) {
	        _this4.showDelModal = false;
	        _this4.getList();
	      });
	    }
	  },
	  events: {}
	};

/***/ },
/* 284 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getList = getList;
	exports.get = get;
	exports.add = add;
	exports.del = del;
	
	var _request = __webpack_require__(23);
	
	var request = _interopRequireWildcard(_request);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	/*
	 * 
	 */
	function getList(params) {
	    return request.get('/api/key/config/keyConfig/allkeys', params);
	} /*
	   * --------------------------------------------
	   * 个人配置 - 密钥管理
	   * @version  1.0
	   * @author   shirley(hztanxuewei@corp.netease.com)
	   * --------------------------------------------
	   */
	function get(id) {
	    return request.get('/api/key/config/keyConfig/' + id, {});
	}
	
	function add(params) {
	    return request.post('/api/key/config/keyConfig', params);
	}
	
	function del(id) {
	    return request.del('/api/key/config/keyConfig/' + id, {});
	}

/***/ },
/* 285 */
/***/ function(module, exports) {

	module.exports = "\n<div _v-57725620=\"\">\n  <input type=\"button\" name=\"submit\" class=\"u-btn u-btn-primary mb10\" value=\"添加\" @click=\"add\" _v-57725620=\"\">\n  <table class=\"m-table\" _v-57725620=\"\">\n      <thead _v-57725620=\"\">\n          <tr _v-57725620=\"\">\n              <th _v-57725620=\"\">ID</th>\n              <th _v-57725620=\"\">密钥对名称</th>\n              <th _v-57725620=\"\">密钥对生成时间</th>\n              <th _v-57725620=\"\">操作</th>\n          </tr>\n      </thead>\n      <tbody _v-57725620=\"\">\n          <tr v-for=\"item in secretKeyList\" _v-57725620=\"\">\n              <td _v-57725620=\"\">{{ item.id }}</td>\n              <td _v-57725620=\"\">{{ item.name }}</td>\n              <td _v-57725620=\"\">{{ item.modifyTime | moment \"YYYY-MM-DD HH:mm:ss\" }}</td>\n              <td _v-57725620=\"\">\n                  <i class=\"iconfont icon-edit\" @click=\"edit(item.id)\" title=\"编辑\" _v-57725620=\"\"></i>\n                  <i class=\"iconfont icon-del\" @click=\"del(item.id)\" title=\"删除\" style=\"margin-left: 5px;\" _v-57725620=\"\"></i>\n              </td>\n          </tr>\n      </tbody>\n  </table>\n</div>\n<modal :show.sync=\"showModal\" :submit=\"doSubmit\" :modalclazz=\"'modal-mid'\" _v-57725620=\"\">\n  <h3 slot=\"header\" _v-57725620=\"\">导入密钥</h3>\n  <div slot=\"body\" _v-57725620=\"\">\n    <validator name=\"validation1\" _v-57725620=\"\">\n      <form class=\"m-form\" novalidate=\"\" _v-57725620=\"\">\n        <div class=\"fmitem\" _v-57725620=\"\">\n            <label class=\"fmlab\" _v-57725620=\"\"><i _v-57725620=\"\">*</i>密钥对名称：</label>\n            <div class=\"fmcnt\" _v-57725620=\"\">\n                <input type=\"text\" name=\"name\" class=\"u-ipt\" :class=\"{'check': check==true}\" v-model=\"obj.name\" v-validate:name=\"['required']\" _v-57725620=\"\">\n            </div>\n        </div>\n        <div class=\"fmitem\" _v-57725620=\"\">\n            <label class=\"fmlab\" _v-57725620=\"\"><i _v-57725620=\"\">*</i>私钥内容：</label>\n            <div class=\"fmcnt\" _v-57725620=\"\">\n                <upload :file-name=\"fileName\" :file-txt.sync=\"obj.privateKey\" :show=\"true\" _v-57725620=\"\"></upload>\n                <p _v-57725620=\"\">您可以添加文件，或将私钥内容直接粘贴在下方的输入框内,不支持带密码的私钥</p>\n                <textarea class=\"u-ipt u-mid\" name=\"descp\" :class=\"{'check': check==true}\" v-model=\"obj.privateKey\" v-validate:privatekey=\"['required']\" _v-57725620=\"\">                </textarea>\n            </div>\n        </div>\n      </form>\n    </validator>\n  </div>\n</modal>\n<modal :show.sync=\"showDelModal\" :submit=\"doDel\" _v-57725620=\"\">\n  <h3 slot=\"header\" _v-57725620=\"\">删除密钥</h3>\n  <div slot=\"body\" _v-57725620=\"\">\n    <p class=\"tip\" _v-57725620=\"\"><i class=\"iconfont icon-tip\" _v-57725620=\"\"></i>确定删除该密钥么？</p>\n  </div>\n</modal>\n";

/***/ },
/* 286 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var moment = __webpack_require__(287);
	
	module.exports = {
		install: function install(Vue, options) {
			Object.defineProperties(Vue.prototype, {
				$moment: {
					get: function get() {
						return Vue.moment.bind(this);
					}
				}
			});
	
			if (options && options.moment) {
				moment = options.moment;
			}
	
			Vue.moment = function (data) {
				return moment(data);
			};
	
			Vue.filter('moment', function () {
				var args = Array.prototype.slice.call(arguments),
				    input = args.shift(),
				    date;
	
				if (Array.isArray(input) && typeof input[0] === 'string') {
					// If input is array, assume we're being passed a format pattern to parse against.
					// Format pattern will accept an array of potential formats to parse against.
					// Date string should be at [0], format pattern(s) should be at [1]
					date = moment(string = input[0], formats = input[1], true);
				} else {
					// Otherwise, throw the input at moment and see what happens...
					date = moment(input);
				}
	
				if (!date.isValid()) {
					// Log a warning if moment couldn't reconcile the input. Better than throwing an error?
					console.warn('Could not build a valid `moment` object from input.');
					return input;
				}
	
				function parse() {
					var args = Array.prototype.slice.call(arguments),
					    method = args.shift();
	
					switch (method) {
						case 'add':
	
							// Mutates the original moment by adding time.
							// http://momentjs.com/docs/#/manipulating/add/
	
							var addends = args.shift().split(',').map(Function.prototype.call, String.prototype.trim);
							obj = {};
							for (var n = 0; n < addends.length; n++) {
								var addend = addends[n].split(' ');
								obj[addend[1]] = addend[0];
							}
							date = date.add(obj);
							break;
	
						case 'subtract':
	
							// Mutates the original moment by subtracting time.
							// http://momentjs.com/docs/#/manipulating/subtract/
	
							var subtrahends = args.shift().split(',').map(Function.prototype.call, String.prototype.trim);
							obj = {};
							for (var n = 0; n < subtrahends.length; n++) {
								var subtrahend = subtrahends[n].split(' ');
								obj[subtrahend[1]] = subtrahend[0];
							}
							date = date.subtract(obj);
							break;
	
						case 'from':
	
							// Display a moment in relative time, either from now or from a specified date.
							// http://momentjs.com/docs/#/displaying/fromnow/
	
							var from = 'now';
							if (args[0] == 'now') args.shift();
	
							if (moment(args[0]).isValid()) {
								// If valid, assume it is a date we want the output computed against.
								from = moment(args.shift());
							}
	
							var removeSuffix = false;
							if (args[0] === true) {
								args.shift();
								var removeSuffix = true;
							}
	
							if (from != 'now') {
								date = date.from(from, removeSuffix);
								break;
							}
	
							date = date.fromNow(removeSuffix);
							break;
	
						case 'calendar':
	
							// Formats a date with different strings depending on how close to a certain date (today by default) the date is.
							// http://momentjs.com/docs/#/displaying/calendar-time/
	
							var referenceTime = moment();
	
							if (moment(args[0]).isValid()) {
								// If valid, assume it is a date we want the output computed against.
								referenceTime = moment(args.shift());
							}
	
							date = date.calendar(referenceTime);
							break;
	
						default:
							// Format
							// Formats a date by taking a string of tokens and replacing them with their corresponding values.
							// http://momentjs.com/docs/#/displaying/format/
	
							var format = method;
							date = date.format(format);
					}
	
					if (args.length) parse.apply(parse, args);
				}
	
				parse.apply(parse, args);
	
				return date;
			});
		}
	};

/***/ },
/* 287 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {'use strict';var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol?"symbol":typeof obj;};//! moment.js
	//! version : 2.15.0
	//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
	//! license : MIT
	//! momentjs.com
	;(function(global,factory){( false?'undefined':_typeof(exports))==='object'&&typeof module!=='undefined'?module.exports=factory(): true?!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):global.moment=factory();})(undefined,function(){'use strict';var hookCallback;function utils_hooks__hooks(){return hookCallback.apply(null,arguments);}// This is done to register the method called with moment()
	// without creating circular dependencies.
	function setHookCallback(callback){hookCallback=callback;}function isArray(input){return input instanceof Array||Object.prototype.toString.call(input)==='[object Array]';}function isObject(input){// IE8 will treat undefined and null as object if it wasn't for
	// input != null
	return input!=null&&Object.prototype.toString.call(input)==='[object Object]';}function isObjectEmpty(obj){var k;for(k in obj){// even if its not own property I'd still call it non-empty
	return false;}return true;}function isDate(input){return input instanceof Date||Object.prototype.toString.call(input)==='[object Date]';}function map(arr,fn){var res=[],i;for(i=0;i<arr.length;++i){res.push(fn(arr[i],i));}return res;}function hasOwnProp(a,b){return Object.prototype.hasOwnProperty.call(a,b);}function extend(a,b){for(var i in b){if(hasOwnProp(b,i)){a[i]=b[i];}}if(hasOwnProp(b,'toString')){a.toString=b.toString;}if(hasOwnProp(b,'valueOf')){a.valueOf=b.valueOf;}return a;}function create_utc__createUTC(input,format,locale,strict){return createLocalOrUTC(input,format,locale,strict,true).utc();}function defaultParsingFlags(){// We need to deep clone this object.
	return{empty:false,unusedTokens:[],unusedInput:[],overflow:-2,charsLeftOver:0,nullInput:false,invalidMonth:null,invalidFormat:false,userInvalidated:false,iso:false,parsedDateParts:[],meridiem:null};}function getParsingFlags(m){if(m._pf==null){m._pf=defaultParsingFlags();}return m._pf;}var some;if(Array.prototype.some){some=Array.prototype.some;}else{some=function some(fun){var t=Object(this);var len=t.length>>>0;for(var i=0;i<len;i++){if(i in t&&fun.call(this,t[i],i,t)){return true;}}return false;};}function valid__isValid(m){if(m._isValid==null){var flags=getParsingFlags(m);var parsedParts=some.call(flags.parsedDateParts,function(i){return i!=null;});var isNowValid=!isNaN(m._d.getTime())&&flags.overflow<0&&!flags.empty&&!flags.invalidMonth&&!flags.invalidWeekday&&!flags.nullInput&&!flags.invalidFormat&&!flags.userInvalidated&&(!flags.meridiem||flags.meridiem&&parsedParts);if(m._strict){isNowValid=isNowValid&&flags.charsLeftOver===0&&flags.unusedTokens.length===0&&flags.bigHour===undefined;}if(Object.isFrozen==null||!Object.isFrozen(m)){m._isValid=isNowValid;}else{return isNowValid;}}return m._isValid;}function valid__createInvalid(flags){var m=create_utc__createUTC(NaN);if(flags!=null){extend(getParsingFlags(m),flags);}else{getParsingFlags(m).userInvalidated=true;}return m;}function isUndefined(input){return input===void 0;}// Plugins that add properties should also add the key here (null value),
	// so we can properly clone ourselves.
	var momentProperties=utils_hooks__hooks.momentProperties=[];function copyConfig(to,from){var i,prop,val;if(!isUndefined(from._isAMomentObject)){to._isAMomentObject=from._isAMomentObject;}if(!isUndefined(from._i)){to._i=from._i;}if(!isUndefined(from._f)){to._f=from._f;}if(!isUndefined(from._l)){to._l=from._l;}if(!isUndefined(from._strict)){to._strict=from._strict;}if(!isUndefined(from._tzm)){to._tzm=from._tzm;}if(!isUndefined(from._isUTC)){to._isUTC=from._isUTC;}if(!isUndefined(from._offset)){to._offset=from._offset;}if(!isUndefined(from._pf)){to._pf=getParsingFlags(from);}if(!isUndefined(from._locale)){to._locale=from._locale;}if(momentProperties.length>0){for(i in momentProperties){prop=momentProperties[i];val=from[prop];if(!isUndefined(val)){to[prop]=val;}}}return to;}var updateInProgress=false;// Moment prototype object
	function Moment(config){copyConfig(this,config);this._d=new Date(config._d!=null?config._d.getTime():NaN);// Prevent infinite loop in case updateOffset creates new moment
	// objects.
	if(updateInProgress===false){updateInProgress=true;utils_hooks__hooks.updateOffset(this);updateInProgress=false;}}function isMoment(obj){return obj instanceof Moment||obj!=null&&obj._isAMomentObject!=null;}function absFloor(number){if(number<0){// -0 -> 0
	return Math.ceil(number)||0;}else{return Math.floor(number);}}function toInt(argumentForCoercion){var coercedNumber=+argumentForCoercion,value=0;if(coercedNumber!==0&&isFinite(coercedNumber)){value=absFloor(coercedNumber);}return value;}// compare two arrays, return the number of differences
	function compareArrays(array1,array2,dontConvert){var len=Math.min(array1.length,array2.length),lengthDiff=Math.abs(array1.length-array2.length),diffs=0,i;for(i=0;i<len;i++){if(dontConvert&&array1[i]!==array2[i]||!dontConvert&&toInt(array1[i])!==toInt(array2[i])){diffs++;}}return diffs+lengthDiff;}function warn(msg){if(utils_hooks__hooks.suppressDeprecationWarnings===false&&typeof console!=='undefined'&&console.warn){console.warn('Deprecation warning: '+msg);}}function deprecate(msg,fn){var firstTime=true;return extend(function(){if(utils_hooks__hooks.deprecationHandler!=null){utils_hooks__hooks.deprecationHandler(null,msg);}if(firstTime){var args=[];var arg;for(var i=0;i<arguments.length;i++){arg='';if(_typeof(arguments[i])==='object'){arg+='\n['+i+'] ';for(var key in arguments[0]){arg+=key+': '+arguments[0][key]+', ';}arg=arg.slice(0,-2);// Remove trailing comma and space
	}else{arg=arguments[i];}args.push(arg);}warn(msg+'\nArguments: '+Array.prototype.slice.call(args).join('')+'\n'+new Error().stack);firstTime=false;}return fn.apply(this,arguments);},fn);}var deprecations={};function deprecateSimple(name,msg){if(utils_hooks__hooks.deprecationHandler!=null){utils_hooks__hooks.deprecationHandler(name,msg);}if(!deprecations[name]){warn(msg);deprecations[name]=true;}}utils_hooks__hooks.suppressDeprecationWarnings=false;utils_hooks__hooks.deprecationHandler=null;function isFunction(input){return input instanceof Function||Object.prototype.toString.call(input)==='[object Function]';}function locale_set__set(config){var prop,i;for(i in config){prop=config[i];if(isFunction(prop)){this[i]=prop;}else{this['_'+i]=prop;}}this._config=config;// Lenient ordinal parsing accepts just a number in addition to
	// number + (possibly) stuff coming from _ordinalParseLenient.
	this._ordinalParseLenient=new RegExp(this._ordinalParse.source+'|'+/\d{1,2}/.source);}function mergeConfigs(parentConfig,childConfig){var res=extend({},parentConfig),prop;for(prop in childConfig){if(hasOwnProp(childConfig,prop)){if(isObject(parentConfig[prop])&&isObject(childConfig[prop])){res[prop]={};extend(res[prop],parentConfig[prop]);extend(res[prop],childConfig[prop]);}else if(childConfig[prop]!=null){res[prop]=childConfig[prop];}else{delete res[prop];}}}for(prop in parentConfig){if(hasOwnProp(parentConfig,prop)&&!hasOwnProp(childConfig,prop)&&isObject(parentConfig[prop])){// make sure changes to properties don't modify parent config
	res[prop]=extend({},res[prop]);}}return res;}function Locale(config){if(config!=null){this.set(config);}}var keys;if(Object.keys){keys=Object.keys;}else{keys=function keys(obj){var i,res=[];for(i in obj){if(hasOwnProp(obj,i)){res.push(i);}}return res;};}var defaultCalendar={sameDay:'[Today at] LT',nextDay:'[Tomorrow at] LT',nextWeek:'dddd [at] LT',lastDay:'[Yesterday at] LT',lastWeek:'[Last] dddd [at] LT',sameElse:'L'};function locale_calendar__calendar(key,mom,now){var output=this._calendar[key]||this._calendar['sameElse'];return isFunction(output)?output.call(mom,now):output;}var defaultLongDateFormat={LTS:'h:mm:ss A',LT:'h:mm A',L:'MM/DD/YYYY',LL:'MMMM D, YYYY',LLL:'MMMM D, YYYY h:mm A',LLLL:'dddd, MMMM D, YYYY h:mm A'};function longDateFormat(key){var format=this._longDateFormat[key],formatUpper=this._longDateFormat[key.toUpperCase()];if(format||!formatUpper){return format;}this._longDateFormat[key]=formatUpper.replace(/MMMM|MM|DD|dddd/g,function(val){return val.slice(1);});return this._longDateFormat[key];}var defaultInvalidDate='Invalid date';function invalidDate(){return this._invalidDate;}var defaultOrdinal='%d';var defaultOrdinalParse=/\d{1,2}/;function ordinal(number){return this._ordinal.replace('%d',number);}var defaultRelativeTime={future:'in %s',past:'%s ago',s:'a few seconds',m:'a minute',mm:'%d minutes',h:'an hour',hh:'%d hours',d:'a day',dd:'%d days',M:'a month',MM:'%d months',y:'a year',yy:'%d years'};function relative__relativeTime(number,withoutSuffix,string,isFuture){var output=this._relativeTime[string];return isFunction(output)?output(number,withoutSuffix,string,isFuture):output.replace(/%d/i,number);}function pastFuture(diff,output){var format=this._relativeTime[diff>0?'future':'past'];return isFunction(format)?format(output):format.replace(/%s/i,output);}var aliases={};function addUnitAlias(unit,shorthand){var lowerCase=unit.toLowerCase();aliases[lowerCase]=aliases[lowerCase+'s']=aliases[shorthand]=unit;}function normalizeUnits(units){return typeof units==='string'?aliases[units]||aliases[units.toLowerCase()]:undefined;}function normalizeObjectUnits(inputObject){var normalizedInput={},normalizedProp,prop;for(prop in inputObject){if(hasOwnProp(inputObject,prop)){normalizedProp=normalizeUnits(prop);if(normalizedProp){normalizedInput[normalizedProp]=inputObject[prop];}}}return normalizedInput;}var priorities={};function addUnitPriority(unit,priority){priorities[unit]=priority;}function getPrioritizedUnits(unitsObj){var units=[];for(var u in unitsObj){units.push({unit:u,priority:priorities[u]});}units.sort(function(a,b){return a.priority-b.priority;});return units;}function makeGetSet(unit,keepTime){return function(value){if(value!=null){get_set__set(this,unit,value);utils_hooks__hooks.updateOffset(this,keepTime);return this;}else{return get_set__get(this,unit);}};}function get_set__get(mom,unit){return mom.isValid()?mom._d['get'+(mom._isUTC?'UTC':'')+unit]():NaN;}function get_set__set(mom,unit,value){if(mom.isValid()){mom._d['set'+(mom._isUTC?'UTC':'')+unit](value);}}// MOMENTS
	function stringGet(units){units=normalizeUnits(units);if(isFunction(this[units])){return this[units]();}return this;}function stringSet(units,value){if((typeof units==='undefined'?'undefined':_typeof(units))==='object'){units=normalizeObjectUnits(units);var prioritized=getPrioritizedUnits(units);for(var i=0;i<prioritized.length;i++){this[prioritized[i].unit](units[prioritized[i].unit]);}}else{units=normalizeUnits(units);if(isFunction(this[units])){return this[units](value);}}return this;}function zeroFill(number,targetLength,forceSign){var absNumber=''+Math.abs(number),zerosToFill=targetLength-absNumber.length,sign=number>=0;return(sign?forceSign?'+':'':'-')+Math.pow(10,Math.max(0,zerosToFill)).toString().substr(1)+absNumber;}var formattingTokens=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;var localFormattingTokens=/(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;var formatFunctions={};var formatTokenFunctions={};// token:    'M'
	// padded:   ['MM', 2]
	// ordinal:  'Mo'
	// callback: function () { this.month() + 1 }
	function addFormatToken(token,padded,ordinal,callback){var func=callback;if(typeof callback==='string'){func=function func(){return this[callback]();};}if(token){formatTokenFunctions[token]=func;}if(padded){formatTokenFunctions[padded[0]]=function(){return zeroFill(func.apply(this,arguments),padded[1],padded[2]);};}if(ordinal){formatTokenFunctions[ordinal]=function(){return this.localeData().ordinal(func.apply(this,arguments),token);};}}function removeFormattingTokens(input){if(input.match(/\[[\s\S]/)){return input.replace(/^\[|\]$/g,'');}return input.replace(/\\/g,'');}function makeFormatFunction(format){var array=format.match(formattingTokens),i,length;for(i=0,length=array.length;i<length;i++){if(formatTokenFunctions[array[i]]){array[i]=formatTokenFunctions[array[i]];}else{array[i]=removeFormattingTokens(array[i]);}}return function(mom){var output='',i;for(i=0;i<length;i++){output+=array[i]instanceof Function?array[i].call(mom,format):array[i];}return output;};}// format date using native date object
	function formatMoment(m,format){if(!m.isValid()){return m.localeData().invalidDate();}format=expandFormat(format,m.localeData());formatFunctions[format]=formatFunctions[format]||makeFormatFunction(format);return formatFunctions[format](m);}function expandFormat(format,locale){var i=5;function replaceLongDateFormatTokens(input){return locale.longDateFormat(input)||input;}localFormattingTokens.lastIndex=0;while(i>=0&&localFormattingTokens.test(format)){format=format.replace(localFormattingTokens,replaceLongDateFormatTokens);localFormattingTokens.lastIndex=0;i-=1;}return format;}var match1=/\d/;//       0 - 9
	var match2=/\d\d/;//      00 - 99
	var match3=/\d{3}/;//     000 - 999
	var match4=/\d{4}/;//    0000 - 9999
	var match6=/[+-]?\d{6}/;// -999999 - 999999
	var match1to2=/\d\d?/;//       0 - 99
	var match3to4=/\d\d\d\d?/;//     999 - 9999
	var match5to6=/\d\d\d\d\d\d?/;//   99999 - 999999
	var match1to3=/\d{1,3}/;//       0 - 999
	var match1to4=/\d{1,4}/;//       0 - 9999
	var match1to6=/[+-]?\d{1,6}/;// -999999 - 999999
	var matchUnsigned=/\d+/;//       0 - inf
	var matchSigned=/[+-]?\d+/;//    -inf - inf
	var matchOffset=/Z|[+-]\d\d:?\d\d/gi;// +00:00 -00:00 +0000 -0000 or Z
	var matchShortOffset=/Z|[+-]\d\d(?::?\d\d)?/gi;// +00 -00 +00:00 -00:00 +0000 -0000 or Z
	var matchTimestamp=/[+-]?\d+(\.\d{1,3})?/;// 123456789 123456789.123
	// any word (or two) characters or numbers including two/three word month in arabic.
	// includes scottish gaelic two word and hyphenated months
	var matchWord=/[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;var regexes={};function addRegexToken(token,regex,strictRegex){regexes[token]=isFunction(regex)?regex:function(isStrict,localeData){return isStrict&&strictRegex?strictRegex:regex;};}function getParseRegexForToken(token,config){if(!hasOwnProp(regexes,token)){return new RegExp(unescapeFormat(token));}return regexes[token](config._strict,config._locale);}// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	function unescapeFormat(s){return regexEscape(s.replace('\\','').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,function(matched,p1,p2,p3,p4){return p1||p2||p3||p4;}));}function regexEscape(s){return s.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&');}var tokens={};function addParseToken(token,callback){var i,func=callback;if(typeof token==='string'){token=[token];}if(typeof callback==='number'){func=function func(input,array){array[callback]=toInt(input);};}for(i=0;i<token.length;i++){tokens[token[i]]=func;}}function addWeekParseToken(token,callback){addParseToken(token,function(input,array,config,token){config._w=config._w||{};callback(input,config._w,config,token);});}function addTimeToArrayFromToken(token,input,config){if(input!=null&&hasOwnProp(tokens,token)){tokens[token](input,config._a,config,token);}}var YEAR=0;var MONTH=1;var DATE=2;var HOUR=3;var MINUTE=4;var SECOND=5;var MILLISECOND=6;var WEEK=7;var WEEKDAY=8;var indexOf;if(Array.prototype.indexOf){indexOf=Array.prototype.indexOf;}else{indexOf=function indexOf(o){// I know
	var i;for(i=0;i<this.length;++i){if(this[i]===o){return i;}}return-1;};}function daysInMonth(year,month){return new Date(Date.UTC(year,month+1,0)).getUTCDate();}// FORMATTING
	addFormatToken('M',['MM',2],'Mo',function(){return this.month()+1;});addFormatToken('MMM',0,0,function(format){return this.localeData().monthsShort(this,format);});addFormatToken('MMMM',0,0,function(format){return this.localeData().months(this,format);});// ALIASES
	addUnitAlias('month','M');// PRIORITY
	addUnitPriority('month',8);// PARSING
	addRegexToken('M',match1to2);addRegexToken('MM',match1to2,match2);addRegexToken('MMM',function(isStrict,locale){return locale.monthsShortRegex(isStrict);});addRegexToken('MMMM',function(isStrict,locale){return locale.monthsRegex(isStrict);});addParseToken(['M','MM'],function(input,array){array[MONTH]=toInt(input)-1;});addParseToken(['MMM','MMMM'],function(input,array,config,token){var month=config._locale.monthsParse(input,token,config._strict);// if we didn't find a month name, mark the date as invalid.
	if(month!=null){array[MONTH]=month;}else{getParsingFlags(config).invalidMonth=input;}});// LOCALES
	var MONTHS_IN_FORMAT=/D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;var defaultLocaleMonths='January_February_March_April_May_June_July_August_September_October_November_December'.split('_');function localeMonths(m,format){if(!m){return this._months;}return isArray(this._months)?this._months[m.month()]:this._months[(this._months.isFormat||MONTHS_IN_FORMAT).test(format)?'format':'standalone'][m.month()];}var defaultLocaleMonthsShort='Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');function localeMonthsShort(m,format){if(!m){return this._monthsShort;}return isArray(this._monthsShort)?this._monthsShort[m.month()]:this._monthsShort[MONTHS_IN_FORMAT.test(format)?'format':'standalone'][m.month()];}function units_month__handleStrictParse(monthName,format,strict){var i,ii,mom,llc=monthName.toLocaleLowerCase();if(!this._monthsParse){// this is not used
	this._monthsParse=[];this._longMonthsParse=[];this._shortMonthsParse=[];for(i=0;i<12;++i){mom=create_utc__createUTC([2000,i]);this._shortMonthsParse[i]=this.monthsShort(mom,'').toLocaleLowerCase();this._longMonthsParse[i]=this.months(mom,'').toLocaleLowerCase();}}if(strict){if(format==='MMM'){ii=indexOf.call(this._shortMonthsParse,llc);return ii!==-1?ii:null;}else{ii=indexOf.call(this._longMonthsParse,llc);return ii!==-1?ii:null;}}else{if(format==='MMM'){ii=indexOf.call(this._shortMonthsParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._longMonthsParse,llc);return ii!==-1?ii:null;}else{ii=indexOf.call(this._longMonthsParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._shortMonthsParse,llc);return ii!==-1?ii:null;}}}function localeMonthsParse(monthName,format,strict){var i,mom,regex;if(this._monthsParseExact){return units_month__handleStrictParse.call(this,monthName,format,strict);}if(!this._monthsParse){this._monthsParse=[];this._longMonthsParse=[];this._shortMonthsParse=[];}// TODO: add sorting
	// Sorting makes sure if one month (or abbr) is a prefix of another
	// see sorting in computeMonthsParse
	for(i=0;i<12;i++){// make the regex if we don't have it already
	mom=create_utc__createUTC([2000,i]);if(strict&&!this._longMonthsParse[i]){this._longMonthsParse[i]=new RegExp('^'+this.months(mom,'').replace('.','')+'$','i');this._shortMonthsParse[i]=new RegExp('^'+this.monthsShort(mom,'').replace('.','')+'$','i');}if(!strict&&!this._monthsParse[i]){regex='^'+this.months(mom,'')+'|^'+this.monthsShort(mom,'');this._monthsParse[i]=new RegExp(regex.replace('.',''),'i');}// test the regex
	if(strict&&format==='MMMM'&&this._longMonthsParse[i].test(monthName)){return i;}else if(strict&&format==='MMM'&&this._shortMonthsParse[i].test(monthName)){return i;}else if(!strict&&this._monthsParse[i].test(monthName)){return i;}}}// MOMENTS
	function setMonth(mom,value){var dayOfMonth;if(!mom.isValid()){// No op
	return mom;}if(typeof value==='string'){if(/^\d+$/.test(value)){value=toInt(value);}else{value=mom.localeData().monthsParse(value);// TODO: Another silent failure?
	if(typeof value!=='number'){return mom;}}}dayOfMonth=Math.min(mom.date(),daysInMonth(mom.year(),value));mom._d['set'+(mom._isUTC?'UTC':'')+'Month'](value,dayOfMonth);return mom;}function getSetMonth(value){if(value!=null){setMonth(this,value);utils_hooks__hooks.updateOffset(this,true);return this;}else{return get_set__get(this,'Month');}}function getDaysInMonth(){return daysInMonth(this.year(),this.month());}var defaultMonthsShortRegex=matchWord;function monthsShortRegex(isStrict){if(this._monthsParseExact){if(!hasOwnProp(this,'_monthsRegex')){computeMonthsParse.call(this);}if(isStrict){return this._monthsShortStrictRegex;}else{return this._monthsShortRegex;}}else{if(!hasOwnProp(this,'_monthsShortRegex')){this._monthsShortRegex=defaultMonthsShortRegex;}return this._monthsShortStrictRegex&&isStrict?this._monthsShortStrictRegex:this._monthsShortRegex;}}var defaultMonthsRegex=matchWord;function monthsRegex(isStrict){if(this._monthsParseExact){if(!hasOwnProp(this,'_monthsRegex')){computeMonthsParse.call(this);}if(isStrict){return this._monthsStrictRegex;}else{return this._monthsRegex;}}else{if(!hasOwnProp(this,'_monthsRegex')){this._monthsRegex=defaultMonthsRegex;}return this._monthsStrictRegex&&isStrict?this._monthsStrictRegex:this._monthsRegex;}}function computeMonthsParse(){function cmpLenRev(a,b){return b.length-a.length;}var shortPieces=[],longPieces=[],mixedPieces=[],i,mom;for(i=0;i<12;i++){// make the regex if we don't have it already
	mom=create_utc__createUTC([2000,i]);shortPieces.push(this.monthsShort(mom,''));longPieces.push(this.months(mom,''));mixedPieces.push(this.months(mom,''));mixedPieces.push(this.monthsShort(mom,''));}// Sorting makes sure if one month (or abbr) is a prefix of another it
	// will match the longer piece.
	shortPieces.sort(cmpLenRev);longPieces.sort(cmpLenRev);mixedPieces.sort(cmpLenRev);for(i=0;i<12;i++){shortPieces[i]=regexEscape(shortPieces[i]);longPieces[i]=regexEscape(longPieces[i]);}for(i=0;i<24;i++){mixedPieces[i]=regexEscape(mixedPieces[i]);}this._monthsRegex=new RegExp('^('+mixedPieces.join('|')+')','i');this._monthsShortRegex=this._monthsRegex;this._monthsStrictRegex=new RegExp('^('+longPieces.join('|')+')','i');this._monthsShortStrictRegex=new RegExp('^('+shortPieces.join('|')+')','i');}// FORMATTING
	addFormatToken('Y',0,0,function(){var y=this.year();return y<=9999?''+y:'+'+y;});addFormatToken(0,['YY',2],0,function(){return this.year()%100;});addFormatToken(0,['YYYY',4],0,'year');addFormatToken(0,['YYYYY',5],0,'year');addFormatToken(0,['YYYYYY',6,true],0,'year');// ALIASES
	addUnitAlias('year','y');// PRIORITIES
	addUnitPriority('year',1);// PARSING
	addRegexToken('Y',matchSigned);addRegexToken('YY',match1to2,match2);addRegexToken('YYYY',match1to4,match4);addRegexToken('YYYYY',match1to6,match6);addRegexToken('YYYYYY',match1to6,match6);addParseToken(['YYYYY','YYYYYY'],YEAR);addParseToken('YYYY',function(input,array){array[YEAR]=input.length===2?utils_hooks__hooks.parseTwoDigitYear(input):toInt(input);});addParseToken('YY',function(input,array){array[YEAR]=utils_hooks__hooks.parseTwoDigitYear(input);});addParseToken('Y',function(input,array){array[YEAR]=parseInt(input,10);});// HELPERS
	function daysInYear(year){return isLeapYear(year)?366:365;}function isLeapYear(year){return year%4===0&&year%100!==0||year%400===0;}// HOOKS
	utils_hooks__hooks.parseTwoDigitYear=function(input){return toInt(input)+(toInt(input)>68?1900:2000);};// MOMENTS
	var getSetYear=makeGetSet('FullYear',true);function getIsLeapYear(){return isLeapYear(this.year());}function createDate(y,m,d,h,M,s,ms){//can't just apply() to create a date:
	//http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
	var date=new Date(y,m,d,h,M,s,ms);//the date constructor remaps years 0-99 to 1900-1999
	if(y<100&&y>=0&&isFinite(date.getFullYear())){date.setFullYear(y);}return date;}function createUTCDate(y){var date=new Date(Date.UTC.apply(null,arguments));//the Date.UTC function remaps years 0-99 to 1900-1999
	if(y<100&&y>=0&&isFinite(date.getUTCFullYear())){date.setUTCFullYear(y);}return date;}// start-of-first-week - start-of-year
	function firstWeekOffset(year,dow,doy){var// first-week day -- which january is always in the first week (4 for iso, 1 for other)
	fwd=7+dow-doy,// first-week day local weekday -- which local weekday is fwd
	fwdlw=(7+createUTCDate(year,0,fwd).getUTCDay()-dow)%7;return-fwdlw+fwd-1;}//http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	function dayOfYearFromWeeks(year,week,weekday,dow,doy){var localWeekday=(7+weekday-dow)%7,weekOffset=firstWeekOffset(year,dow,doy),dayOfYear=1+7*(week-1)+localWeekday+weekOffset,resYear,resDayOfYear;if(dayOfYear<=0){resYear=year-1;resDayOfYear=daysInYear(resYear)+dayOfYear;}else if(dayOfYear>daysInYear(year)){resYear=year+1;resDayOfYear=dayOfYear-daysInYear(year);}else{resYear=year;resDayOfYear=dayOfYear;}return{year:resYear,dayOfYear:resDayOfYear};}function weekOfYear(mom,dow,doy){var weekOffset=firstWeekOffset(mom.year(),dow,doy),week=Math.floor((mom.dayOfYear()-weekOffset-1)/7)+1,resWeek,resYear;if(week<1){resYear=mom.year()-1;resWeek=week+weeksInYear(resYear,dow,doy);}else if(week>weeksInYear(mom.year(),dow,doy)){resWeek=week-weeksInYear(mom.year(),dow,doy);resYear=mom.year()+1;}else{resYear=mom.year();resWeek=week;}return{week:resWeek,year:resYear};}function weeksInYear(year,dow,doy){var weekOffset=firstWeekOffset(year,dow,doy),weekOffsetNext=firstWeekOffset(year+1,dow,doy);return(daysInYear(year)-weekOffset+weekOffsetNext)/7;}// FORMATTING
	addFormatToken('w',['ww',2],'wo','week');addFormatToken('W',['WW',2],'Wo','isoWeek');// ALIASES
	addUnitAlias('week','w');addUnitAlias('isoWeek','W');// PRIORITIES
	addUnitPriority('week',5);addUnitPriority('isoWeek',5);// PARSING
	addRegexToken('w',match1to2);addRegexToken('ww',match1to2,match2);addRegexToken('W',match1to2);addRegexToken('WW',match1to2,match2);addWeekParseToken(['w','ww','W','WW'],function(input,week,config,token){week[token.substr(0,1)]=toInt(input);});// HELPERS
	// LOCALES
	function localeWeek(mom){return weekOfYear(mom,this._week.dow,this._week.doy).week;}var defaultLocaleWeek={dow:0,// Sunday is the first day of the week.
	doy:6// The week that contains Jan 1st is the first week of the year.
	};function localeFirstDayOfWeek(){return this._week.dow;}function localeFirstDayOfYear(){return this._week.doy;}// MOMENTS
	function getSetWeek(input){var week=this.localeData().week(this);return input==null?week:this.add((input-week)*7,'d');}function getSetISOWeek(input){var week=weekOfYear(this,1,4).week;return input==null?week:this.add((input-week)*7,'d');}// FORMATTING
	addFormatToken('d',0,'do','day');addFormatToken('dd',0,0,function(format){return this.localeData().weekdaysMin(this,format);});addFormatToken('ddd',0,0,function(format){return this.localeData().weekdaysShort(this,format);});addFormatToken('dddd',0,0,function(format){return this.localeData().weekdays(this,format);});addFormatToken('e',0,0,'weekday');addFormatToken('E',0,0,'isoWeekday');// ALIASES
	addUnitAlias('day','d');addUnitAlias('weekday','e');addUnitAlias('isoWeekday','E');// PRIORITY
	addUnitPriority('day',11);addUnitPriority('weekday',11);addUnitPriority('isoWeekday',11);// PARSING
	addRegexToken('d',match1to2);addRegexToken('e',match1to2);addRegexToken('E',match1to2);addRegexToken('dd',function(isStrict,locale){return locale.weekdaysMinRegex(isStrict);});addRegexToken('ddd',function(isStrict,locale){return locale.weekdaysShortRegex(isStrict);});addRegexToken('dddd',function(isStrict,locale){return locale.weekdaysRegex(isStrict);});addWeekParseToken(['dd','ddd','dddd'],function(input,week,config,token){var weekday=config._locale.weekdaysParse(input,token,config._strict);// if we didn't get a weekday name, mark the date as invalid
	if(weekday!=null){week.d=weekday;}else{getParsingFlags(config).invalidWeekday=input;}});addWeekParseToken(['d','e','E'],function(input,week,config,token){week[token]=toInt(input);});// HELPERS
	function parseWeekday(input,locale){if(typeof input!=='string'){return input;}if(!isNaN(input)){return parseInt(input,10);}input=locale.weekdaysParse(input);if(typeof input==='number'){return input;}return null;}function parseIsoWeekday(input,locale){if(typeof input==='string'){return locale.weekdaysParse(input)%7||7;}return isNaN(input)?null:input;}// LOCALES
	var defaultLocaleWeekdays='Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');function localeWeekdays(m,format){if(!m){return this._weekdays;}return isArray(this._weekdays)?this._weekdays[m.day()]:this._weekdays[this._weekdays.isFormat.test(format)?'format':'standalone'][m.day()];}var defaultLocaleWeekdaysShort='Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');function localeWeekdaysShort(m){return m?this._weekdaysShort[m.day()]:this._weekdaysShort;}var defaultLocaleWeekdaysMin='Su_Mo_Tu_We_Th_Fr_Sa'.split('_');function localeWeekdaysMin(m){return m?this._weekdaysMin[m.day()]:this._weekdaysMin;}function day_of_week__handleStrictParse(weekdayName,format,strict){var i,ii,mom,llc=weekdayName.toLocaleLowerCase();if(!this._weekdaysParse){this._weekdaysParse=[];this._shortWeekdaysParse=[];this._minWeekdaysParse=[];for(i=0;i<7;++i){mom=create_utc__createUTC([2000,1]).day(i);this._minWeekdaysParse[i]=this.weekdaysMin(mom,'').toLocaleLowerCase();this._shortWeekdaysParse[i]=this.weekdaysShort(mom,'').toLocaleLowerCase();this._weekdaysParse[i]=this.weekdays(mom,'').toLocaleLowerCase();}}if(strict){if(format==='dddd'){ii=indexOf.call(this._weekdaysParse,llc);return ii!==-1?ii:null;}else if(format==='ddd'){ii=indexOf.call(this._shortWeekdaysParse,llc);return ii!==-1?ii:null;}else{ii=indexOf.call(this._minWeekdaysParse,llc);return ii!==-1?ii:null;}}else{if(format==='dddd'){ii=indexOf.call(this._weekdaysParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._shortWeekdaysParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._minWeekdaysParse,llc);return ii!==-1?ii:null;}else if(format==='ddd'){ii=indexOf.call(this._shortWeekdaysParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._weekdaysParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._minWeekdaysParse,llc);return ii!==-1?ii:null;}else{ii=indexOf.call(this._minWeekdaysParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._weekdaysParse,llc);if(ii!==-1){return ii;}ii=indexOf.call(this._shortWeekdaysParse,llc);return ii!==-1?ii:null;}}}function localeWeekdaysParse(weekdayName,format,strict){var i,mom,regex;if(this._weekdaysParseExact){return day_of_week__handleStrictParse.call(this,weekdayName,format,strict);}if(!this._weekdaysParse){this._weekdaysParse=[];this._minWeekdaysParse=[];this._shortWeekdaysParse=[];this._fullWeekdaysParse=[];}for(i=0;i<7;i++){// make the regex if we don't have it already
	mom=create_utc__createUTC([2000,1]).day(i);if(strict&&!this._fullWeekdaysParse[i]){this._fullWeekdaysParse[i]=new RegExp('^'+this.weekdays(mom,'').replace('.','\.?')+'$','i');this._shortWeekdaysParse[i]=new RegExp('^'+this.weekdaysShort(mom,'').replace('.','\.?')+'$','i');this._minWeekdaysParse[i]=new RegExp('^'+this.weekdaysMin(mom,'').replace('.','\.?')+'$','i');}if(!this._weekdaysParse[i]){regex='^'+this.weekdays(mom,'')+'|^'+this.weekdaysShort(mom,'')+'|^'+this.weekdaysMin(mom,'');this._weekdaysParse[i]=new RegExp(regex.replace('.',''),'i');}// test the regex
	if(strict&&format==='dddd'&&this._fullWeekdaysParse[i].test(weekdayName)){return i;}else if(strict&&format==='ddd'&&this._shortWeekdaysParse[i].test(weekdayName)){return i;}else if(strict&&format==='dd'&&this._minWeekdaysParse[i].test(weekdayName)){return i;}else if(!strict&&this._weekdaysParse[i].test(weekdayName)){return i;}}}// MOMENTS
	function getSetDayOfWeek(input){if(!this.isValid()){return input!=null?this:NaN;}var day=this._isUTC?this._d.getUTCDay():this._d.getDay();if(input!=null){input=parseWeekday(input,this.localeData());return this.add(input-day,'d');}else{return day;}}function getSetLocaleDayOfWeek(input){if(!this.isValid()){return input!=null?this:NaN;}var weekday=(this.day()+7-this.localeData()._week.dow)%7;return input==null?weekday:this.add(input-weekday,'d');}function getSetISODayOfWeek(input){if(!this.isValid()){return input!=null?this:NaN;}// behaves the same as moment#day except
	// as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
	// as a setter, sunday should belong to the previous week.
	if(input!=null){var weekday=parseIsoWeekday(input,this.localeData());return this.day(this.day()%7?weekday:weekday-7);}else{return this.day()||7;}}var defaultWeekdaysRegex=matchWord;function weekdaysRegex(isStrict){if(this._weekdaysParseExact){if(!hasOwnProp(this,'_weekdaysRegex')){computeWeekdaysParse.call(this);}if(isStrict){return this._weekdaysStrictRegex;}else{return this._weekdaysRegex;}}else{if(!hasOwnProp(this,'_weekdaysRegex')){this._weekdaysRegex=defaultWeekdaysRegex;}return this._weekdaysStrictRegex&&isStrict?this._weekdaysStrictRegex:this._weekdaysRegex;}}var defaultWeekdaysShortRegex=matchWord;function weekdaysShortRegex(isStrict){if(this._weekdaysParseExact){if(!hasOwnProp(this,'_weekdaysRegex')){computeWeekdaysParse.call(this);}if(isStrict){return this._weekdaysShortStrictRegex;}else{return this._weekdaysShortRegex;}}else{if(!hasOwnProp(this,'_weekdaysShortRegex')){this._weekdaysShortRegex=defaultWeekdaysShortRegex;}return this._weekdaysShortStrictRegex&&isStrict?this._weekdaysShortStrictRegex:this._weekdaysShortRegex;}}var defaultWeekdaysMinRegex=matchWord;function weekdaysMinRegex(isStrict){if(this._weekdaysParseExact){if(!hasOwnProp(this,'_weekdaysRegex')){computeWeekdaysParse.call(this);}if(isStrict){return this._weekdaysMinStrictRegex;}else{return this._weekdaysMinRegex;}}else{if(!hasOwnProp(this,'_weekdaysMinRegex')){this._weekdaysMinRegex=defaultWeekdaysMinRegex;}return this._weekdaysMinStrictRegex&&isStrict?this._weekdaysMinStrictRegex:this._weekdaysMinRegex;}}function computeWeekdaysParse(){function cmpLenRev(a,b){return b.length-a.length;}var minPieces=[],shortPieces=[],longPieces=[],mixedPieces=[],i,mom,minp,shortp,longp;for(i=0;i<7;i++){// make the regex if we don't have it already
	mom=create_utc__createUTC([2000,1]).day(i);minp=this.weekdaysMin(mom,'');shortp=this.weekdaysShort(mom,'');longp=this.weekdays(mom,'');minPieces.push(minp);shortPieces.push(shortp);longPieces.push(longp);mixedPieces.push(minp);mixedPieces.push(shortp);mixedPieces.push(longp);}// Sorting makes sure if one weekday (or abbr) is a prefix of another it
	// will match the longer piece.
	minPieces.sort(cmpLenRev);shortPieces.sort(cmpLenRev);longPieces.sort(cmpLenRev);mixedPieces.sort(cmpLenRev);for(i=0;i<7;i++){shortPieces[i]=regexEscape(shortPieces[i]);longPieces[i]=regexEscape(longPieces[i]);mixedPieces[i]=regexEscape(mixedPieces[i]);}this._weekdaysRegex=new RegExp('^('+mixedPieces.join('|')+')','i');this._weekdaysShortRegex=this._weekdaysRegex;this._weekdaysMinRegex=this._weekdaysRegex;this._weekdaysStrictRegex=new RegExp('^('+longPieces.join('|')+')','i');this._weekdaysShortStrictRegex=new RegExp('^('+shortPieces.join('|')+')','i');this._weekdaysMinStrictRegex=new RegExp('^('+minPieces.join('|')+')','i');}// FORMATTING
	function hFormat(){return this.hours()%12||12;}function kFormat(){return this.hours()||24;}addFormatToken('H',['HH',2],0,'hour');addFormatToken('h',['hh',2],0,hFormat);addFormatToken('k',['kk',2],0,kFormat);addFormatToken('hmm',0,0,function(){return''+hFormat.apply(this)+zeroFill(this.minutes(),2);});addFormatToken('hmmss',0,0,function(){return''+hFormat.apply(this)+zeroFill(this.minutes(),2)+zeroFill(this.seconds(),2);});addFormatToken('Hmm',0,0,function(){return''+this.hours()+zeroFill(this.minutes(),2);});addFormatToken('Hmmss',0,0,function(){return''+this.hours()+zeroFill(this.minutes(),2)+zeroFill(this.seconds(),2);});function meridiem(token,lowercase){addFormatToken(token,0,0,function(){return this.localeData().meridiem(this.hours(),this.minutes(),lowercase);});}meridiem('a',true);meridiem('A',false);// ALIASES
	addUnitAlias('hour','h');// PRIORITY
	addUnitPriority('hour',13);// PARSING
	function matchMeridiem(isStrict,locale){return locale._meridiemParse;}addRegexToken('a',matchMeridiem);addRegexToken('A',matchMeridiem);addRegexToken('H',match1to2);addRegexToken('h',match1to2);addRegexToken('HH',match1to2,match2);addRegexToken('hh',match1to2,match2);addRegexToken('hmm',match3to4);addRegexToken('hmmss',match5to6);addRegexToken('Hmm',match3to4);addRegexToken('Hmmss',match5to6);addParseToken(['H','HH'],HOUR);addParseToken(['a','A'],function(input,array,config){config._isPm=config._locale.isPM(input);config._meridiem=input;});addParseToken(['h','hh'],function(input,array,config){array[HOUR]=toInt(input);getParsingFlags(config).bigHour=true;});addParseToken('hmm',function(input,array,config){var pos=input.length-2;array[HOUR]=toInt(input.substr(0,pos));array[MINUTE]=toInt(input.substr(pos));getParsingFlags(config).bigHour=true;});addParseToken('hmmss',function(input,array,config){var pos1=input.length-4;var pos2=input.length-2;array[HOUR]=toInt(input.substr(0,pos1));array[MINUTE]=toInt(input.substr(pos1,2));array[SECOND]=toInt(input.substr(pos2));getParsingFlags(config).bigHour=true;});addParseToken('Hmm',function(input,array,config){var pos=input.length-2;array[HOUR]=toInt(input.substr(0,pos));array[MINUTE]=toInt(input.substr(pos));});addParseToken('Hmmss',function(input,array,config){var pos1=input.length-4;var pos2=input.length-2;array[HOUR]=toInt(input.substr(0,pos1));array[MINUTE]=toInt(input.substr(pos1,2));array[SECOND]=toInt(input.substr(pos2));});// LOCALES
	function localeIsPM(input){// IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
	// Using charAt should be more compatible.
	return(input+'').toLowerCase().charAt(0)==='p';}var defaultLocaleMeridiemParse=/[ap]\.?m?\.?/i;function localeMeridiem(hours,minutes,isLower){if(hours>11){return isLower?'pm':'PM';}else{return isLower?'am':'AM';}}// MOMENTS
	// Setting the hour should keep the time, because the user explicitly
	// specified which hour he wants. So trying to maintain the same hour (in
	// a new timezone) makes sense. Adding/subtracting hours does not follow
	// this rule.
	var getSetHour=makeGetSet('Hours',true);var baseConfig={calendar:defaultCalendar,longDateFormat:defaultLongDateFormat,invalidDate:defaultInvalidDate,ordinal:defaultOrdinal,ordinalParse:defaultOrdinalParse,relativeTime:defaultRelativeTime,months:defaultLocaleMonths,monthsShort:defaultLocaleMonthsShort,week:defaultLocaleWeek,weekdays:defaultLocaleWeekdays,weekdaysMin:defaultLocaleWeekdaysMin,weekdaysShort:defaultLocaleWeekdaysShort,meridiemParse:defaultLocaleMeridiemParse};// internal storage for locale config files
	var locales={};var globalLocale;function normalizeLocale(key){return key?key.toLowerCase().replace('_','-'):key;}// pick the locale from the array
	// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	function chooseLocale(names){var i=0,j,next,locale,split;while(i<names.length){split=normalizeLocale(names[i]).split('-');j=split.length;next=normalizeLocale(names[i+1]);next=next?next.split('-'):null;while(j>0){locale=loadLocale(split.slice(0,j).join('-'));if(locale){return locale;}if(next&&next.length>=j&&compareArrays(split,next,true)>=j-1){//the next array item is better than a shallower substring of this one
	break;}j--;}i++;}return null;}function loadLocale(name){var oldLocale=null;// TODO: Find a better way to register and load all the locales in Node
	if(!locales[name]&&typeof module!=='undefined'&&module&&module.require){try{oldLocale=globalLocale._abbr;module.require('./locale/'+name);// because defineLocale currently also sets the global locale, we
	// want to undo that for lazy loaded locales
	locale_locales__getSetGlobalLocale(oldLocale);}catch(e){}}return locales[name];}// This function will load locale and then set the global locale.  If
	// no arguments are passed in, it will simply return the current global
	// locale key.
	function locale_locales__getSetGlobalLocale(key,values){var data;if(key){if(isUndefined(values)){data=locale_locales__getLocale(key);}else{data=defineLocale(key,values);}if(data){// moment.duration._locale = moment._locale = data;
	globalLocale=data;}}return globalLocale._abbr;}function defineLocale(name,config){if(config!==null){var parentConfig=baseConfig;config.abbr=name;if(locales[name]!=null){deprecateSimple('defineLocaleOverride','use moment.updateLocale(localeName, config) to change '+'an existing locale. moment.defineLocale(localeName, '+'config) should only be used for creating a new locale '+'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');parentConfig=locales[name]._config;}else if(config.parentLocale!=null){if(locales[config.parentLocale]!=null){parentConfig=locales[config.parentLocale]._config;}else{// treat as if there is no base config
	deprecateSimple('parentLocaleUndefined','specified parentLocale is not defined yet. See http://momentjs.com/guides/#/warnings/parent-locale/');}}locales[name]=new Locale(mergeConfigs(parentConfig,config));// backwards compat for now: also set the locale
	locale_locales__getSetGlobalLocale(name);return locales[name];}else{// useful for testing
	delete locales[name];return null;}}function updateLocale(name,config){if(config!=null){var locale,parentConfig=baseConfig;// MERGE
	if(locales[name]!=null){parentConfig=locales[name]._config;}config=mergeConfigs(parentConfig,config);locale=new Locale(config);locale.parentLocale=locales[name];locales[name]=locale;// backwards compat for now: also set the locale
	locale_locales__getSetGlobalLocale(name);}else{// pass null for config to unupdate, useful for tests
	if(locales[name]!=null){if(locales[name].parentLocale!=null){locales[name]=locales[name].parentLocale;}else if(locales[name]!=null){delete locales[name];}}}return locales[name];}// returns locale data
	function locale_locales__getLocale(key){var locale;if(key&&key._locale&&key._locale._abbr){key=key._locale._abbr;}if(!key){return globalLocale;}if(!isArray(key)){//short-circuit everything else
	locale=loadLocale(key);if(locale){return locale;}key=[key];}return chooseLocale(key);}function locale_locales__listLocales(){return keys(locales);}function checkOverflow(m){var overflow;var a=m._a;if(a&&getParsingFlags(m).overflow===-2){overflow=a[MONTH]<0||a[MONTH]>11?MONTH:a[DATE]<1||a[DATE]>daysInMonth(a[YEAR],a[MONTH])?DATE:a[HOUR]<0||a[HOUR]>24||a[HOUR]===24&&(a[MINUTE]!==0||a[SECOND]!==0||a[MILLISECOND]!==0)?HOUR:a[MINUTE]<0||a[MINUTE]>59?MINUTE:a[SECOND]<0||a[SECOND]>59?SECOND:a[MILLISECOND]<0||a[MILLISECOND]>999?MILLISECOND:-1;if(getParsingFlags(m)._overflowDayOfYear&&(overflow<YEAR||overflow>DATE)){overflow=DATE;}if(getParsingFlags(m)._overflowWeeks&&overflow===-1){overflow=WEEK;}if(getParsingFlags(m)._overflowWeekday&&overflow===-1){overflow=WEEKDAY;}getParsingFlags(m).overflow=overflow;}return m;}// iso 8601 regex
	// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
	var extendedIsoRegex=/^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;var basicIsoRegex=/^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;var tzRegex=/Z|[+-]\d\d(?::?\d\d)?/;var isoDates=[['YYYYYY-MM-DD',/[+-]\d{6}-\d\d-\d\d/],['YYYY-MM-DD',/\d{4}-\d\d-\d\d/],['GGGG-[W]WW-E',/\d{4}-W\d\d-\d/],['GGGG-[W]WW',/\d{4}-W\d\d/,false],['YYYY-DDD',/\d{4}-\d{3}/],['YYYY-MM',/\d{4}-\d\d/,false],['YYYYYYMMDD',/[+-]\d{10}/],['YYYYMMDD',/\d{8}/],// YYYYMM is NOT allowed by the standard
	['GGGG[W]WWE',/\d{4}W\d{3}/],['GGGG[W]WW',/\d{4}W\d{2}/,false],['YYYYDDD',/\d{7}/]];// iso time formats and regexes
	var isoTimes=[['HH:mm:ss.SSSS',/\d\d:\d\d:\d\d\.\d+/],['HH:mm:ss,SSSS',/\d\d:\d\d:\d\d,\d+/],['HH:mm:ss',/\d\d:\d\d:\d\d/],['HH:mm',/\d\d:\d\d/],['HHmmss.SSSS',/\d\d\d\d\d\d\.\d+/],['HHmmss,SSSS',/\d\d\d\d\d\d,\d+/],['HHmmss',/\d\d\d\d\d\d/],['HHmm',/\d\d\d\d/],['HH',/\d\d/]];var aspNetJsonRegex=/^\/?Date\((\-?\d+)/i;// date from iso format
	function configFromISO(config){var i,l,string=config._i,match=extendedIsoRegex.exec(string)||basicIsoRegex.exec(string),allowTime,dateFormat,timeFormat,tzFormat;if(match){getParsingFlags(config).iso=true;for(i=0,l=isoDates.length;i<l;i++){if(isoDates[i][1].exec(match[1])){dateFormat=isoDates[i][0];allowTime=isoDates[i][2]!==false;break;}}if(dateFormat==null){config._isValid=false;return;}if(match[3]){for(i=0,l=isoTimes.length;i<l;i++){if(isoTimes[i][1].exec(match[3])){// match[2] should be 'T' or space
	timeFormat=(match[2]||' ')+isoTimes[i][0];break;}}if(timeFormat==null){config._isValid=false;return;}}if(!allowTime&&timeFormat!=null){config._isValid=false;return;}if(match[4]){if(tzRegex.exec(match[4])){tzFormat='Z';}else{config._isValid=false;return;}}config._f=dateFormat+(timeFormat||'')+(tzFormat||'');configFromStringAndFormat(config);}else{config._isValid=false;}}// date from iso format or fallback
	function configFromString(config){var matched=aspNetJsonRegex.exec(config._i);if(matched!==null){config._d=new Date(+matched[1]);return;}configFromISO(config);if(config._isValid===false){delete config._isValid;utils_hooks__hooks.createFromInputFallback(config);}}utils_hooks__hooks.createFromInputFallback=deprecate('value provided is not in a recognized ISO format. moment construction falls back to js Date(), '+'which is not reliable across all browsers and versions. Non ISO date formats are '+'discouraged and will be removed in an upcoming major release. Please refer to '+'http://momentjs.com/guides/#/warnings/js-date/ for more info.',function(config){config._d=new Date(config._i+(config._useUTC?' UTC':''));});// Pick the first defined of two or three arguments.
	function defaults(a,b,c){if(a!=null){return a;}if(b!=null){return b;}return c;}function currentDateArray(config){// hooks is actually the exported moment object
	var nowValue=new Date(utils_hooks__hooks.now());if(config._useUTC){return[nowValue.getUTCFullYear(),nowValue.getUTCMonth(),nowValue.getUTCDate()];}return[nowValue.getFullYear(),nowValue.getMonth(),nowValue.getDate()];}// convert an array to a date.
	// the array should mirror the parameters below
	// note: all values past the year are optional and will default to the lowest possible value.
	// [year, month, day , hour, minute, second, millisecond]
	function configFromArray(config){var i,date,input=[],currentDate,yearToUse;if(config._d){return;}currentDate=currentDateArray(config);//compute day of the year from weeks and weekdays
	if(config._w&&config._a[DATE]==null&&config._a[MONTH]==null){dayOfYearFromWeekInfo(config);}//if the day of the year is set, figure out what it is
	if(config._dayOfYear){yearToUse=defaults(config._a[YEAR],currentDate[YEAR]);if(config._dayOfYear>daysInYear(yearToUse)){getParsingFlags(config)._overflowDayOfYear=true;}date=createUTCDate(yearToUse,0,config._dayOfYear);config._a[MONTH]=date.getUTCMonth();config._a[DATE]=date.getUTCDate();}// Default to current date.
	// * if no year, month, day of month are given, default to today
	// * if day of month is given, default month and year
	// * if month is given, default only year
	// * if year is given, don't default anything
	for(i=0;i<3&&config._a[i]==null;++i){config._a[i]=input[i]=currentDate[i];}// Zero out whatever was not defaulted, including time
	for(;i<7;i++){config._a[i]=input[i]=config._a[i]==null?i===2?1:0:config._a[i];}// Check for 24:00:00.000
	if(config._a[HOUR]===24&&config._a[MINUTE]===0&&config._a[SECOND]===0&&config._a[MILLISECOND]===0){config._nextDay=true;config._a[HOUR]=0;}config._d=(config._useUTC?createUTCDate:createDate).apply(null,input);// Apply timezone offset from input. The actual utcOffset can be changed
	// with parseZone.
	if(config._tzm!=null){config._d.setUTCMinutes(config._d.getUTCMinutes()-config._tzm);}if(config._nextDay){config._a[HOUR]=24;}}function dayOfYearFromWeekInfo(config){var w,weekYear,week,weekday,dow,doy,temp,weekdayOverflow;w=config._w;if(w.GG!=null||w.W!=null||w.E!=null){dow=1;doy=4;// TODO: We need to take the current isoWeekYear, but that depends on
	// how we interpret now (local, utc, fixed offset). So create
	// a now version of current config (take local/utc/offset flags, and
	// create now).
	weekYear=defaults(w.GG,config._a[YEAR],weekOfYear(local__createLocal(),1,4).year);week=defaults(w.W,1);weekday=defaults(w.E,1);if(weekday<1||weekday>7){weekdayOverflow=true;}}else{dow=config._locale._week.dow;doy=config._locale._week.doy;weekYear=defaults(w.gg,config._a[YEAR],weekOfYear(local__createLocal(),dow,doy).year);week=defaults(w.w,1);if(w.d!=null){// weekday -- low day numbers are considered next week
	weekday=w.d;if(weekday<0||weekday>6){weekdayOverflow=true;}}else if(w.e!=null){// local weekday -- counting starts from begining of week
	weekday=w.e+dow;if(w.e<0||w.e>6){weekdayOverflow=true;}}else{// default to begining of week
	weekday=dow;}}if(week<1||week>weeksInYear(weekYear,dow,doy)){getParsingFlags(config)._overflowWeeks=true;}else if(weekdayOverflow!=null){getParsingFlags(config)._overflowWeekday=true;}else{temp=dayOfYearFromWeeks(weekYear,week,weekday,dow,doy);config._a[YEAR]=temp.year;config._dayOfYear=temp.dayOfYear;}}// constant that refers to the ISO standard
	utils_hooks__hooks.ISO_8601=function(){};// date from string and format string
	function configFromStringAndFormat(config){// TODO: Move this to another part of the creation flow to prevent circular deps
	if(config._f===utils_hooks__hooks.ISO_8601){configFromISO(config);return;}config._a=[];getParsingFlags(config).empty=true;// This array is used to make a Date, either with `new Date` or `Date.UTC`
	var string=''+config._i,i,parsedInput,tokens,token,skipped,stringLength=string.length,totalParsedInputLength=0;tokens=expandFormat(config._f,config._locale).match(formattingTokens)||[];for(i=0;i<tokens.length;i++){token=tokens[i];parsedInput=(string.match(getParseRegexForToken(token,config))||[])[0];// console.log('token', token, 'parsedInput', parsedInput,
	//         'regex', getParseRegexForToken(token, config));
	if(parsedInput){skipped=string.substr(0,string.indexOf(parsedInput));if(skipped.length>0){getParsingFlags(config).unusedInput.push(skipped);}string=string.slice(string.indexOf(parsedInput)+parsedInput.length);totalParsedInputLength+=parsedInput.length;}// don't parse if it's not a known token
	if(formatTokenFunctions[token]){if(parsedInput){getParsingFlags(config).empty=false;}else{getParsingFlags(config).unusedTokens.push(token);}addTimeToArrayFromToken(token,parsedInput,config);}else if(config._strict&&!parsedInput){getParsingFlags(config).unusedTokens.push(token);}}// add remaining unparsed input length to the string
	getParsingFlags(config).charsLeftOver=stringLength-totalParsedInputLength;if(string.length>0){getParsingFlags(config).unusedInput.push(string);}// clear _12h flag if hour is <= 12
	if(config._a[HOUR]<=12&&getParsingFlags(config).bigHour===true&&config._a[HOUR]>0){getParsingFlags(config).bigHour=undefined;}getParsingFlags(config).parsedDateParts=config._a.slice(0);getParsingFlags(config).meridiem=config._meridiem;// handle meridiem
	config._a[HOUR]=meridiemFixWrap(config._locale,config._a[HOUR],config._meridiem);configFromArray(config);checkOverflow(config);}function meridiemFixWrap(locale,hour,meridiem){var isPm;if(meridiem==null){// nothing to do
	return hour;}if(locale.meridiemHour!=null){return locale.meridiemHour(hour,meridiem);}else if(locale.isPM!=null){// Fallback
	isPm=locale.isPM(meridiem);if(isPm&&hour<12){hour+=12;}if(!isPm&&hour===12){hour=0;}return hour;}else{// this is not supposed to happen
	return hour;}}// date from string and array of format strings
	function configFromStringAndArray(config){var tempConfig,bestMoment,scoreToBeat,i,currentScore;if(config._f.length===0){getParsingFlags(config).invalidFormat=true;config._d=new Date(NaN);return;}for(i=0;i<config._f.length;i++){currentScore=0;tempConfig=copyConfig({},config);if(config._useUTC!=null){tempConfig._useUTC=config._useUTC;}tempConfig._f=config._f[i];configFromStringAndFormat(tempConfig);if(!valid__isValid(tempConfig)){continue;}// if there is any input that was not parsed add a penalty for that format
	currentScore+=getParsingFlags(tempConfig).charsLeftOver;//or tokens
	currentScore+=getParsingFlags(tempConfig).unusedTokens.length*10;getParsingFlags(tempConfig).score=currentScore;if(scoreToBeat==null||currentScore<scoreToBeat){scoreToBeat=currentScore;bestMoment=tempConfig;}}extend(config,bestMoment||tempConfig);}function configFromObject(config){if(config._d){return;}var i=normalizeObjectUnits(config._i);config._a=map([i.year,i.month,i.day||i.date,i.hour,i.minute,i.second,i.millisecond],function(obj){return obj&&parseInt(obj,10);});configFromArray(config);}function createFromConfig(config){var res=new Moment(checkOverflow(prepareConfig(config)));if(res._nextDay){// Adding is smart enough around DST
	res.add(1,'d');res._nextDay=undefined;}return res;}function prepareConfig(config){var input=config._i,format=config._f;config._locale=config._locale||locale_locales__getLocale(config._l);if(input===null||format===undefined&&input===''){return valid__createInvalid({nullInput:true});}if(typeof input==='string'){config._i=input=config._locale.preparse(input);}if(isMoment(input)){return new Moment(checkOverflow(input));}else if(isArray(format)){configFromStringAndArray(config);}else if(isDate(input)){config._d=input;}else if(format){configFromStringAndFormat(config);}else{configFromInput(config);}if(!valid__isValid(config)){config._d=null;}return config;}function configFromInput(config){var input=config._i;if(input===undefined){config._d=new Date(utils_hooks__hooks.now());}else if(isDate(input)){config._d=new Date(input.valueOf());}else if(typeof input==='string'){configFromString(config);}else if(isArray(input)){config._a=map(input.slice(0),function(obj){return parseInt(obj,10);});configFromArray(config);}else if((typeof input==='undefined'?'undefined':_typeof(input))==='object'){configFromObject(config);}else if(typeof input==='number'){// from milliseconds
	config._d=new Date(input);}else{utils_hooks__hooks.createFromInputFallback(config);}}function createLocalOrUTC(input,format,locale,strict,isUTC){var c={};if(typeof locale==='boolean'){strict=locale;locale=undefined;}if(isObject(input)&&isObjectEmpty(input)||isArray(input)&&input.length===0){input=undefined;}// object construction must be done this way.
	// https://github.com/moment/moment/issues/1423
	c._isAMomentObject=true;c._useUTC=c._isUTC=isUTC;c._l=locale;c._i=input;c._f=format;c._strict=strict;return createFromConfig(c);}function local__createLocal(input,format,locale,strict){return createLocalOrUTC(input,format,locale,strict,false);}var prototypeMin=deprecate('moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',function(){var other=local__createLocal.apply(null,arguments);if(this.isValid()&&other.isValid()){return other<this?this:other;}else{return valid__createInvalid();}});var prototypeMax=deprecate('moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',function(){var other=local__createLocal.apply(null,arguments);if(this.isValid()&&other.isValid()){return other>this?this:other;}else{return valid__createInvalid();}});// Pick a moment m from moments so that m[fn](other) is true for all
	// other. This relies on the function fn to be transitive.
	//
	// moments should either be an array of moment objects or an array, whose
	// first element is an array of moment objects.
	function pickBy(fn,moments){var res,i;if(moments.length===1&&isArray(moments[0])){moments=moments[0];}if(!moments.length){return local__createLocal();}res=moments[0];for(i=1;i<moments.length;++i){if(!moments[i].isValid()||moments[i][fn](res)){res=moments[i];}}return res;}// TODO: Use [].sort instead?
	function min(){var args=[].slice.call(arguments,0);return pickBy('isBefore',args);}function max(){var args=[].slice.call(arguments,0);return pickBy('isAfter',args);}var now=function now(){return Date.now?Date.now():+new Date();};function Duration(duration){var normalizedInput=normalizeObjectUnits(duration),years=normalizedInput.year||0,quarters=normalizedInput.quarter||0,months=normalizedInput.month||0,weeks=normalizedInput.week||0,days=normalizedInput.day||0,hours=normalizedInput.hour||0,minutes=normalizedInput.minute||0,seconds=normalizedInput.second||0,milliseconds=normalizedInput.millisecond||0;// representation for dateAddRemove
	this._milliseconds=+milliseconds+seconds*1e3+// 1000
	minutes*6e4+// 1000 * 60
	hours*1000*60*60;//using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
	// Because of dateAddRemove treats 24 hours as different from a
	// day when working around DST, we need to store them separately
	this._days=+days+weeks*7;// It is impossible translate months into days without knowing
	// which months you are are talking about, so we have to store
	// it separately.
	this._months=+months+quarters*3+years*12;this._data={};this._locale=locale_locales__getLocale();this._bubble();}function isDuration(obj){return obj instanceof Duration;}function absRound(number){if(number<0){return Math.round(-1*number)*-1;}else{return Math.round(number);}}// FORMATTING
	function offset(token,separator){addFormatToken(token,0,0,function(){var offset=this.utcOffset();var sign='+';if(offset<0){offset=-offset;sign='-';}return sign+zeroFill(~~(offset/60),2)+separator+zeroFill(~~offset%60,2);});}offset('Z',':');offset('ZZ','');// PARSING
	addRegexToken('Z',matchShortOffset);addRegexToken('ZZ',matchShortOffset);addParseToken(['Z','ZZ'],function(input,array,config){config._useUTC=true;config._tzm=offsetFromString(matchShortOffset,input);});// HELPERS
	// timezone chunker
	// '+10:00' > ['10',  '00']
	// '-1530'  > ['-15', '30']
	var chunkOffset=/([\+\-]|\d\d)/gi;function offsetFromString(matcher,string){var matches=(string||'').match(matcher)||[];var chunk=matches[matches.length-1]||[];var parts=(chunk+'').match(chunkOffset)||['-',0,0];var minutes=+(parts[1]*60)+toInt(parts[2]);return parts[0]==='+'?minutes:-minutes;}// Return a moment from input, that is local/utc/zone equivalent to model.
	function cloneWithOffset(input,model){var res,diff;if(model._isUTC){res=model.clone();diff=(isMoment(input)||isDate(input)?input.valueOf():local__createLocal(input).valueOf())-res.valueOf();// Use low-level api, because this fn is low-level api.
	res._d.setTime(res._d.valueOf()+diff);utils_hooks__hooks.updateOffset(res,false);return res;}else{return local__createLocal(input).local();}}function getDateOffset(m){// On Firefox.24 Date#getTimezoneOffset returns a floating point.
	// https://github.com/moment/moment/pull/1871
	return-Math.round(m._d.getTimezoneOffset()/15)*15;}// HOOKS
	// This function will be called whenever a moment is mutated.
	// It is intended to keep the offset in sync with the timezone.
	utils_hooks__hooks.updateOffset=function(){};// MOMENTS
	// keepLocalTime = true means only change the timezone, without
	// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	// +0200, so we adjust the time as needed, to be valid.
	//
	// Keeping the time actually adds/subtracts (one hour)
	// from the actual represented time. That is why we call updateOffset
	// a second time. In case it wants us to change the offset again
	// _changeInProgress == true case, then we have to adjust, because
	// there is no such time in the given timezone.
	function getSetOffset(input,keepLocalTime){var offset=this._offset||0,localAdjust;if(!this.isValid()){return input!=null?this:NaN;}if(input!=null){if(typeof input==='string'){input=offsetFromString(matchShortOffset,input);}else if(Math.abs(input)<16){input=input*60;}if(!this._isUTC&&keepLocalTime){localAdjust=getDateOffset(this);}this._offset=input;this._isUTC=true;if(localAdjust!=null){this.add(localAdjust,'m');}if(offset!==input){if(!keepLocalTime||this._changeInProgress){add_subtract__addSubtract(this,create__createDuration(input-offset,'m'),1,false);}else if(!this._changeInProgress){this._changeInProgress=true;utils_hooks__hooks.updateOffset(this,true);this._changeInProgress=null;}}return this;}else{return this._isUTC?offset:getDateOffset(this);}}function getSetZone(input,keepLocalTime){if(input!=null){if(typeof input!=='string'){input=-input;}this.utcOffset(input,keepLocalTime);return this;}else{return-this.utcOffset();}}function setOffsetToUTC(keepLocalTime){return this.utcOffset(0,keepLocalTime);}function setOffsetToLocal(keepLocalTime){if(this._isUTC){this.utcOffset(0,keepLocalTime);this._isUTC=false;if(keepLocalTime){this.subtract(getDateOffset(this),'m');}}return this;}function setOffsetToParsedOffset(){if(this._tzm){this.utcOffset(this._tzm);}else if(typeof this._i==='string'){var tZone=offsetFromString(matchOffset,this._i);if(tZone===0){this.utcOffset(0,true);}else{this.utcOffset(offsetFromString(matchOffset,this._i));}}return this;}function hasAlignedHourOffset(input){if(!this.isValid()){return false;}input=input?local__createLocal(input).utcOffset():0;return(this.utcOffset()-input)%60===0;}function isDaylightSavingTime(){return this.utcOffset()>this.clone().month(0).utcOffset()||this.utcOffset()>this.clone().month(5).utcOffset();}function isDaylightSavingTimeShifted(){if(!isUndefined(this._isDSTShifted)){return this._isDSTShifted;}var c={};copyConfig(c,this);c=prepareConfig(c);if(c._a){var other=c._isUTC?create_utc__createUTC(c._a):local__createLocal(c._a);this._isDSTShifted=this.isValid()&&compareArrays(c._a,other.toArray())>0;}else{this._isDSTShifted=false;}return this._isDSTShifted;}function isLocal(){return this.isValid()?!this._isUTC:false;}function isUtcOffset(){return this.isValid()?this._isUTC:false;}function isUtc(){return this.isValid()?this._isUTC&&this._offset===0:false;}// ASP.NET json date format regex
	var aspNetRegex=/^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	// and further modified to allow for strings containing both week and day
	var isoRegex=/^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;function create__createDuration(input,key){var duration=input,// matching against regexp is expensive, do it on demand
	match=null,sign,ret,diffRes;if(isDuration(input)){duration={ms:input._milliseconds,d:input._days,M:input._months};}else if(typeof input==='number'){duration={};if(key){duration[key]=input;}else{duration.milliseconds=input;}}else if(!!(match=aspNetRegex.exec(input))){sign=match[1]==='-'?-1:1;duration={y:0,d:toInt(match[DATE])*sign,h:toInt(match[HOUR])*sign,m:toInt(match[MINUTE])*sign,s:toInt(match[SECOND])*sign,ms:toInt(absRound(match[MILLISECOND]*1000))*sign// the millisecond decimal point is included in the match
	};}else if(!!(match=isoRegex.exec(input))){sign=match[1]==='-'?-1:1;duration={y:parseIso(match[2],sign),M:parseIso(match[3],sign),w:parseIso(match[4],sign),d:parseIso(match[5],sign),h:parseIso(match[6],sign),m:parseIso(match[7],sign),s:parseIso(match[8],sign)};}else if(duration==null){// checks for null or undefined
	duration={};}else if((typeof duration==='undefined'?'undefined':_typeof(duration))==='object'&&('from'in duration||'to'in duration)){diffRes=momentsDifference(local__createLocal(duration.from),local__createLocal(duration.to));duration={};duration.ms=diffRes.milliseconds;duration.M=diffRes.months;}ret=new Duration(duration);if(isDuration(input)&&hasOwnProp(input,'_locale')){ret._locale=input._locale;}return ret;}create__createDuration.fn=Duration.prototype;function parseIso(inp,sign){// We'd normally use ~~inp for this, but unfortunately it also
	// converts floats to ints.
	// inp may be undefined, so careful calling replace on it.
	var res=inp&&parseFloat(inp.replace(',','.'));// apply sign while we're at it
	return(isNaN(res)?0:res)*sign;}function positiveMomentsDifference(base,other){var res={milliseconds:0,months:0};res.months=other.month()-base.month()+(other.year()-base.year())*12;if(base.clone().add(res.months,'M').isAfter(other)){--res.months;}res.milliseconds=+other-+base.clone().add(res.months,'M');return res;}function momentsDifference(base,other){var res;if(!(base.isValid()&&other.isValid())){return{milliseconds:0,months:0};}other=cloneWithOffset(other,base);if(base.isBefore(other)){res=positiveMomentsDifference(base,other);}else{res=positiveMomentsDifference(other,base);res.milliseconds=-res.milliseconds;res.months=-res.months;}return res;}// TODO: remove 'name' arg after deprecation is removed
	function createAdder(direction,name){return function(val,period){var dur,tmp;//invert the arguments, but complain about it
	if(period!==null&&!isNaN(+period)){deprecateSimple(name,'moment().'+name+'(period, number) is deprecated. Please use moment().'+name+'(number, period). '+'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');tmp=val;val=period;period=tmp;}val=typeof val==='string'?+val:val;dur=create__createDuration(val,period);add_subtract__addSubtract(this,dur,direction);return this;};}function add_subtract__addSubtract(mom,duration,isAdding,updateOffset){var milliseconds=duration._milliseconds,days=absRound(duration._days),months=absRound(duration._months);if(!mom.isValid()){// No op
	return;}updateOffset=updateOffset==null?true:updateOffset;if(milliseconds){mom._d.setTime(mom._d.valueOf()+milliseconds*isAdding);}if(days){get_set__set(mom,'Date',get_set__get(mom,'Date')+days*isAdding);}if(months){setMonth(mom,get_set__get(mom,'Month')+months*isAdding);}if(updateOffset){utils_hooks__hooks.updateOffset(mom,days||months);}}var add_subtract__add=createAdder(1,'add');var add_subtract__subtract=createAdder(-1,'subtract');function getCalendarFormat(myMoment,now){var diff=myMoment.diff(now,'days',true);return diff<-6?'sameElse':diff<-1?'lastWeek':diff<0?'lastDay':diff<1?'sameDay':diff<2?'nextDay':diff<7?'nextWeek':'sameElse';}function moment_calendar__calendar(time,formats){// We want to compare the start of today, vs this.
	// Getting start-of-today depends on whether we're local/utc/offset or not.
	var now=time||local__createLocal(),sod=cloneWithOffset(now,this).startOf('day'),format=utils_hooks__hooks.calendarFormat(this,sod)||'sameElse';var output=formats&&(isFunction(formats[format])?formats[format].call(this,now):formats[format]);return this.format(output||this.localeData().calendar(format,this,local__createLocal(now)));}function clone(){return new Moment(this);}function isAfter(input,units){var localInput=isMoment(input)?input:local__createLocal(input);if(!(this.isValid()&&localInput.isValid())){return false;}units=normalizeUnits(!isUndefined(units)?units:'millisecond');if(units==='millisecond'){return this.valueOf()>localInput.valueOf();}else{return localInput.valueOf()<this.clone().startOf(units).valueOf();}}function isBefore(input,units){var localInput=isMoment(input)?input:local__createLocal(input);if(!(this.isValid()&&localInput.isValid())){return false;}units=normalizeUnits(!isUndefined(units)?units:'millisecond');if(units==='millisecond'){return this.valueOf()<localInput.valueOf();}else{return this.clone().endOf(units).valueOf()<localInput.valueOf();}}function isBetween(from,to,units,inclusivity){inclusivity=inclusivity||'()';return(inclusivity[0]==='('?this.isAfter(from,units):!this.isBefore(from,units))&&(inclusivity[1]===')'?this.isBefore(to,units):!this.isAfter(to,units));}function isSame(input,units){var localInput=isMoment(input)?input:local__createLocal(input),inputMs;if(!(this.isValid()&&localInput.isValid())){return false;}units=normalizeUnits(units||'millisecond');if(units==='millisecond'){return this.valueOf()===localInput.valueOf();}else{inputMs=localInput.valueOf();return this.clone().startOf(units).valueOf()<=inputMs&&inputMs<=this.clone().endOf(units).valueOf();}}function isSameOrAfter(input,units){return this.isSame(input,units)||this.isAfter(input,units);}function isSameOrBefore(input,units){return this.isSame(input,units)||this.isBefore(input,units);}function diff(input,units,asFloat){var that,zoneDelta,delta,output;if(!this.isValid()){return NaN;}that=cloneWithOffset(input,this);if(!that.isValid()){return NaN;}zoneDelta=(that.utcOffset()-this.utcOffset())*6e4;units=normalizeUnits(units);if(units==='year'||units==='month'||units==='quarter'){output=monthDiff(this,that);if(units==='quarter'){output=output/3;}else if(units==='year'){output=output/12;}}else{delta=this-that;output=units==='second'?delta/1e3:// 1000
	units==='minute'?delta/6e4:// 1000 * 60
	units==='hour'?delta/36e5:// 1000 * 60 * 60
	units==='day'?(delta-zoneDelta)/864e5:// 1000 * 60 * 60 * 24, negate dst
	units==='week'?(delta-zoneDelta)/6048e5:// 1000 * 60 * 60 * 24 * 7, negate dst
	delta;}return asFloat?output:absFloor(output);}function monthDiff(a,b){// difference in months
	var wholeMonthDiff=(b.year()-a.year())*12+(b.month()-a.month()),// b is in (anchor - 1 month, anchor + 1 month)
	anchor=a.clone().add(wholeMonthDiff,'months'),anchor2,adjust;if(b-anchor<0){anchor2=a.clone().add(wholeMonthDiff-1,'months');// linear across the month
	adjust=(b-anchor)/(anchor-anchor2);}else{anchor2=a.clone().add(wholeMonthDiff+1,'months');// linear across the month
	adjust=(b-anchor)/(anchor2-anchor);}//check for negative zero, return zero if negative zero
	return-(wholeMonthDiff+adjust)||0;}utils_hooks__hooks.defaultFormat='YYYY-MM-DDTHH:mm:ssZ';utils_hooks__hooks.defaultFormatUtc='YYYY-MM-DDTHH:mm:ss[Z]';function toString(){return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');}function moment_format__toISOString(){var m=this.clone().utc();if(0<m.year()&&m.year()<=9999){if(isFunction(Date.prototype.toISOString)){// native implementation is ~50x faster, use it when we can
	return this.toDate().toISOString();}else{return formatMoment(m,'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');}}else{return formatMoment(m,'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');}}function format(inputString){if(!inputString){inputString=this.isUtc()?utils_hooks__hooks.defaultFormatUtc:utils_hooks__hooks.defaultFormat;}var output=formatMoment(this,inputString);return this.localeData().postformat(output);}function from(time,withoutSuffix){if(this.isValid()&&(isMoment(time)&&time.isValid()||local__createLocal(time).isValid())){return create__createDuration({to:this,from:time}).locale(this.locale()).humanize(!withoutSuffix);}else{return this.localeData().invalidDate();}}function fromNow(withoutSuffix){return this.from(local__createLocal(),withoutSuffix);}function to(time,withoutSuffix){if(this.isValid()&&(isMoment(time)&&time.isValid()||local__createLocal(time).isValid())){return create__createDuration({from:this,to:time}).locale(this.locale()).humanize(!withoutSuffix);}else{return this.localeData().invalidDate();}}function toNow(withoutSuffix){return this.to(local__createLocal(),withoutSuffix);}// If passed a locale key, it will set the locale for this
	// instance.  Otherwise, it will return the locale configuration
	// variables for this instance.
	function locale(key){var newLocaleData;if(key===undefined){return this._locale._abbr;}else{newLocaleData=locale_locales__getLocale(key);if(newLocaleData!=null){this._locale=newLocaleData;}return this;}}var lang=deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',function(key){if(key===undefined){return this.localeData();}else{return this.locale(key);}});function localeData(){return this._locale;}function startOf(units){units=normalizeUnits(units);// the following switch intentionally omits break keywords
	// to utilize falling through the cases.
	switch(units){case'year':this.month(0);/* falls through */case'quarter':case'month':this.date(1);/* falls through */case'week':case'isoWeek':case'day':case'date':this.hours(0);/* falls through */case'hour':this.minutes(0);/* falls through */case'minute':this.seconds(0);/* falls through */case'second':this.milliseconds(0);}// weeks are a special case
	if(units==='week'){this.weekday(0);}if(units==='isoWeek'){this.isoWeekday(1);}// quarters are also special
	if(units==='quarter'){this.month(Math.floor(this.month()/3)*3);}return this;}function endOf(units){units=normalizeUnits(units);if(units===undefined||units==='millisecond'){return this;}// 'date' is an alias for 'day', so it should be considered as such.
	if(units==='date'){units='day';}return this.startOf(units).add(1,units==='isoWeek'?'week':units).subtract(1,'ms');}function to_type__valueOf(){return this._d.valueOf()-(this._offset||0)*60000;}function unix(){return Math.floor(this.valueOf()/1000);}function toDate(){return new Date(this.valueOf());}function toArray(){var m=this;return[m.year(),m.month(),m.date(),m.hour(),m.minute(),m.second(),m.millisecond()];}function toObject(){var m=this;return{years:m.year(),months:m.month(),date:m.date(),hours:m.hours(),minutes:m.minutes(),seconds:m.seconds(),milliseconds:m.milliseconds()};}function toJSON(){// new Date(NaN).toJSON() === null
	return this.isValid()?this.toISOString():null;}function moment_valid__isValid(){return valid__isValid(this);}function parsingFlags(){return extend({},getParsingFlags(this));}function invalidAt(){return getParsingFlags(this).overflow;}function creationData(){return{input:this._i,format:this._f,locale:this._locale,isUTC:this._isUTC,strict:this._strict};}// FORMATTING
	addFormatToken(0,['gg',2],0,function(){return this.weekYear()%100;});addFormatToken(0,['GG',2],0,function(){return this.isoWeekYear()%100;});function addWeekYearFormatToken(token,getter){addFormatToken(0,[token,token.length],0,getter);}addWeekYearFormatToken('gggg','weekYear');addWeekYearFormatToken('ggggg','weekYear');addWeekYearFormatToken('GGGG','isoWeekYear');addWeekYearFormatToken('GGGGG','isoWeekYear');// ALIASES
	addUnitAlias('weekYear','gg');addUnitAlias('isoWeekYear','GG');// PRIORITY
	addUnitPriority('weekYear',1);addUnitPriority('isoWeekYear',1);// PARSING
	addRegexToken('G',matchSigned);addRegexToken('g',matchSigned);addRegexToken('GG',match1to2,match2);addRegexToken('gg',match1to2,match2);addRegexToken('GGGG',match1to4,match4);addRegexToken('gggg',match1to4,match4);addRegexToken('GGGGG',match1to6,match6);addRegexToken('ggggg',match1to6,match6);addWeekParseToken(['gggg','ggggg','GGGG','GGGGG'],function(input,week,config,token){week[token.substr(0,2)]=toInt(input);});addWeekParseToken(['gg','GG'],function(input,week,config,token){week[token]=utils_hooks__hooks.parseTwoDigitYear(input);});// MOMENTS
	function getSetWeekYear(input){return getSetWeekYearHelper.call(this,input,this.week(),this.weekday(),this.localeData()._week.dow,this.localeData()._week.doy);}function getSetISOWeekYear(input){return getSetWeekYearHelper.call(this,input,this.isoWeek(),this.isoWeekday(),1,4);}function getISOWeeksInYear(){return weeksInYear(this.year(),1,4);}function getWeeksInYear(){var weekInfo=this.localeData()._week;return weeksInYear(this.year(),weekInfo.dow,weekInfo.doy);}function getSetWeekYearHelper(input,week,weekday,dow,doy){var weeksTarget;if(input==null){return weekOfYear(this,dow,doy).year;}else{weeksTarget=weeksInYear(input,dow,doy);if(week>weeksTarget){week=weeksTarget;}return setWeekAll.call(this,input,week,weekday,dow,doy);}}function setWeekAll(weekYear,week,weekday,dow,doy){var dayOfYearData=dayOfYearFromWeeks(weekYear,week,weekday,dow,doy),date=createUTCDate(dayOfYearData.year,0,dayOfYearData.dayOfYear);this.year(date.getUTCFullYear());this.month(date.getUTCMonth());this.date(date.getUTCDate());return this;}// FORMATTING
	addFormatToken('Q',0,'Qo','quarter');// ALIASES
	addUnitAlias('quarter','Q');// PRIORITY
	addUnitPriority('quarter',7);// PARSING
	addRegexToken('Q',match1);addParseToken('Q',function(input,array){array[MONTH]=(toInt(input)-1)*3;});// MOMENTS
	function getSetQuarter(input){return input==null?Math.ceil((this.month()+1)/3):this.month((input-1)*3+this.month()%3);}// FORMATTING
	addFormatToken('D',['DD',2],'Do','date');// ALIASES
	addUnitAlias('date','D');// PRIOROITY
	addUnitPriority('date',9);// PARSING
	addRegexToken('D',match1to2);addRegexToken('DD',match1to2,match2);addRegexToken('Do',function(isStrict,locale){return isStrict?locale._ordinalParse:locale._ordinalParseLenient;});addParseToken(['D','DD'],DATE);addParseToken('Do',function(input,array){array[DATE]=toInt(input.match(match1to2)[0],10);});// MOMENTS
	var getSetDayOfMonth=makeGetSet('Date',true);// FORMATTING
	addFormatToken('DDD',['DDDD',3],'DDDo','dayOfYear');// ALIASES
	addUnitAlias('dayOfYear','DDD');// PRIORITY
	addUnitPriority('dayOfYear',4);// PARSING
	addRegexToken('DDD',match1to3);addRegexToken('DDDD',match3);addParseToken(['DDD','DDDD'],function(input,array,config){config._dayOfYear=toInt(input);});// HELPERS
	// MOMENTS
	function getSetDayOfYear(input){var dayOfYear=Math.round((this.clone().startOf('day')-this.clone().startOf('year'))/864e5)+1;return input==null?dayOfYear:this.add(input-dayOfYear,'d');}// FORMATTING
	addFormatToken('m',['mm',2],0,'minute');// ALIASES
	addUnitAlias('minute','m');// PRIORITY
	addUnitPriority('minute',14);// PARSING
	addRegexToken('m',match1to2);addRegexToken('mm',match1to2,match2);addParseToken(['m','mm'],MINUTE);// MOMENTS
	var getSetMinute=makeGetSet('Minutes',false);// FORMATTING
	addFormatToken('s',['ss',2],0,'second');// ALIASES
	addUnitAlias('second','s');// PRIORITY
	addUnitPriority('second',15);// PARSING
	addRegexToken('s',match1to2);addRegexToken('ss',match1to2,match2);addParseToken(['s','ss'],SECOND);// MOMENTS
	var getSetSecond=makeGetSet('Seconds',false);// FORMATTING
	addFormatToken('S',0,0,function(){return~~(this.millisecond()/100);});addFormatToken(0,['SS',2],0,function(){return~~(this.millisecond()/10);});addFormatToken(0,['SSS',3],0,'millisecond');addFormatToken(0,['SSSS',4],0,function(){return this.millisecond()*10;});addFormatToken(0,['SSSSS',5],0,function(){return this.millisecond()*100;});addFormatToken(0,['SSSSSS',6],0,function(){return this.millisecond()*1000;});addFormatToken(0,['SSSSSSS',7],0,function(){return this.millisecond()*10000;});addFormatToken(0,['SSSSSSSS',8],0,function(){return this.millisecond()*100000;});addFormatToken(0,['SSSSSSSSS',9],0,function(){return this.millisecond()*1000000;});// ALIASES
	addUnitAlias('millisecond','ms');// PRIORITY
	addUnitPriority('millisecond',16);// PARSING
	addRegexToken('S',match1to3,match1);addRegexToken('SS',match1to3,match2);addRegexToken('SSS',match1to3,match3);var token;for(token='SSSS';token.length<=9;token+='S'){addRegexToken(token,matchUnsigned);}function parseMs(input,array){array[MILLISECOND]=toInt(('0.'+input)*1000);}for(token='S';token.length<=9;token+='S'){addParseToken(token,parseMs);}// MOMENTS
	var getSetMillisecond=makeGetSet('Milliseconds',false);// FORMATTING
	addFormatToken('z',0,0,'zoneAbbr');addFormatToken('zz',0,0,'zoneName');// MOMENTS
	function getZoneAbbr(){return this._isUTC?'UTC':'';}function getZoneName(){return this._isUTC?'Coordinated Universal Time':'';}var momentPrototype__proto=Moment.prototype;momentPrototype__proto.add=add_subtract__add;momentPrototype__proto.calendar=moment_calendar__calendar;momentPrototype__proto.clone=clone;momentPrototype__proto.diff=diff;momentPrototype__proto.endOf=endOf;momentPrototype__proto.format=format;momentPrototype__proto.from=from;momentPrototype__proto.fromNow=fromNow;momentPrototype__proto.to=to;momentPrototype__proto.toNow=toNow;momentPrototype__proto.get=stringGet;momentPrototype__proto.invalidAt=invalidAt;momentPrototype__proto.isAfter=isAfter;momentPrototype__proto.isBefore=isBefore;momentPrototype__proto.isBetween=isBetween;momentPrototype__proto.isSame=isSame;momentPrototype__proto.isSameOrAfter=isSameOrAfter;momentPrototype__proto.isSameOrBefore=isSameOrBefore;momentPrototype__proto.isValid=moment_valid__isValid;momentPrototype__proto.lang=lang;momentPrototype__proto.locale=locale;momentPrototype__proto.localeData=localeData;momentPrototype__proto.max=prototypeMax;momentPrototype__proto.min=prototypeMin;momentPrototype__proto.parsingFlags=parsingFlags;momentPrototype__proto.set=stringSet;momentPrototype__proto.startOf=startOf;momentPrototype__proto.subtract=add_subtract__subtract;momentPrototype__proto.toArray=toArray;momentPrototype__proto.toObject=toObject;momentPrototype__proto.toDate=toDate;momentPrototype__proto.toISOString=moment_format__toISOString;momentPrototype__proto.toJSON=toJSON;momentPrototype__proto.toString=toString;momentPrototype__proto.unix=unix;momentPrototype__proto.valueOf=to_type__valueOf;momentPrototype__proto.creationData=creationData;// Year
	momentPrototype__proto.year=getSetYear;momentPrototype__proto.isLeapYear=getIsLeapYear;// Week Year
	momentPrototype__proto.weekYear=getSetWeekYear;momentPrototype__proto.isoWeekYear=getSetISOWeekYear;// Quarter
	momentPrototype__proto.quarter=momentPrototype__proto.quarters=getSetQuarter;// Month
	momentPrototype__proto.month=getSetMonth;momentPrototype__proto.daysInMonth=getDaysInMonth;// Week
	momentPrototype__proto.week=momentPrototype__proto.weeks=getSetWeek;momentPrototype__proto.isoWeek=momentPrototype__proto.isoWeeks=getSetISOWeek;momentPrototype__proto.weeksInYear=getWeeksInYear;momentPrototype__proto.isoWeeksInYear=getISOWeeksInYear;// Day
	momentPrototype__proto.date=getSetDayOfMonth;momentPrototype__proto.day=momentPrototype__proto.days=getSetDayOfWeek;momentPrototype__proto.weekday=getSetLocaleDayOfWeek;momentPrototype__proto.isoWeekday=getSetISODayOfWeek;momentPrototype__proto.dayOfYear=getSetDayOfYear;// Hour
	momentPrototype__proto.hour=momentPrototype__proto.hours=getSetHour;// Minute
	momentPrototype__proto.minute=momentPrototype__proto.minutes=getSetMinute;// Second
	momentPrototype__proto.second=momentPrototype__proto.seconds=getSetSecond;// Millisecond
	momentPrototype__proto.millisecond=momentPrototype__proto.milliseconds=getSetMillisecond;// Offset
	momentPrototype__proto.utcOffset=getSetOffset;momentPrototype__proto.utc=setOffsetToUTC;momentPrototype__proto.local=setOffsetToLocal;momentPrototype__proto.parseZone=setOffsetToParsedOffset;momentPrototype__proto.hasAlignedHourOffset=hasAlignedHourOffset;momentPrototype__proto.isDST=isDaylightSavingTime;momentPrototype__proto.isLocal=isLocal;momentPrototype__proto.isUtcOffset=isUtcOffset;momentPrototype__proto.isUtc=isUtc;momentPrototype__proto.isUTC=isUtc;// Timezone
	momentPrototype__proto.zoneAbbr=getZoneAbbr;momentPrototype__proto.zoneName=getZoneName;// Deprecations
	momentPrototype__proto.dates=deprecate('dates accessor is deprecated. Use date instead.',getSetDayOfMonth);momentPrototype__proto.months=deprecate('months accessor is deprecated. Use month instead',getSetMonth);momentPrototype__proto.years=deprecate('years accessor is deprecated. Use year instead',getSetYear);momentPrototype__proto.zone=deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/',getSetZone);momentPrototype__proto.isDSTShifted=deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information',isDaylightSavingTimeShifted);var momentPrototype=momentPrototype__proto;function moment__createUnix(input){return local__createLocal(input*1000);}function moment__createInZone(){return local__createLocal.apply(null,arguments).parseZone();}function preParsePostFormat(string){return string;}var prototype__proto=Locale.prototype;prototype__proto.calendar=locale_calendar__calendar;prototype__proto.longDateFormat=longDateFormat;prototype__proto.invalidDate=invalidDate;prototype__proto.ordinal=ordinal;prototype__proto.preparse=preParsePostFormat;prototype__proto.postformat=preParsePostFormat;prototype__proto.relativeTime=relative__relativeTime;prototype__proto.pastFuture=pastFuture;prototype__proto.set=locale_set__set;// Month
	prototype__proto.months=localeMonths;prototype__proto.monthsShort=localeMonthsShort;prototype__proto.monthsParse=localeMonthsParse;prototype__proto.monthsRegex=monthsRegex;prototype__proto.monthsShortRegex=monthsShortRegex;// Week
	prototype__proto.week=localeWeek;prototype__proto.firstDayOfYear=localeFirstDayOfYear;prototype__proto.firstDayOfWeek=localeFirstDayOfWeek;// Day of Week
	prototype__proto.weekdays=localeWeekdays;prototype__proto.weekdaysMin=localeWeekdaysMin;prototype__proto.weekdaysShort=localeWeekdaysShort;prototype__proto.weekdaysParse=localeWeekdaysParse;prototype__proto.weekdaysRegex=weekdaysRegex;prototype__proto.weekdaysShortRegex=weekdaysShortRegex;prototype__proto.weekdaysMinRegex=weekdaysMinRegex;// Hours
	prototype__proto.isPM=localeIsPM;prototype__proto.meridiem=localeMeridiem;function lists__get(format,index,field,setter){var locale=locale_locales__getLocale();var utc=create_utc__createUTC().set(setter,index);return locale[field](utc,format);}function listMonthsImpl(format,index,field){if(typeof format==='number'){index=format;format=undefined;}format=format||'';if(index!=null){return lists__get(format,index,field,'month');}var i;var out=[];for(i=0;i<12;i++){out[i]=lists__get(format,i,field,'month');}return out;}// ()
	// (5)
	// (fmt, 5)
	// (fmt)
	// (true)
	// (true, 5)
	// (true, fmt, 5)
	// (true, fmt)
	function listWeekdaysImpl(localeSorted,format,index,field){if(typeof localeSorted==='boolean'){if(typeof format==='number'){index=format;format=undefined;}format=format||'';}else{format=localeSorted;index=format;localeSorted=false;if(typeof format==='number'){index=format;format=undefined;}format=format||'';}var locale=locale_locales__getLocale(),shift=localeSorted?locale._week.dow:0;if(index!=null){return lists__get(format,(index+shift)%7,field,'day');}var i;var out=[];for(i=0;i<7;i++){out[i]=lists__get(format,(i+shift)%7,field,'day');}return out;}function lists__listMonths(format,index){return listMonthsImpl(format,index,'months');}function lists__listMonthsShort(format,index){return listMonthsImpl(format,index,'monthsShort');}function lists__listWeekdays(localeSorted,format,index){return listWeekdaysImpl(localeSorted,format,index,'weekdays');}function lists__listWeekdaysShort(localeSorted,format,index){return listWeekdaysImpl(localeSorted,format,index,'weekdaysShort');}function lists__listWeekdaysMin(localeSorted,format,index){return listWeekdaysImpl(localeSorted,format,index,'weekdaysMin');}locale_locales__getSetGlobalLocale('en',{ordinalParse:/\d{1,2}(th|st|nd|rd)/,ordinal:function ordinal(number){var b=number%10,output=toInt(number%100/10)===1?'th':b===1?'st':b===2?'nd':b===3?'rd':'th';return number+output;}});// Side effect imports
	utils_hooks__hooks.lang=deprecate('moment.lang is deprecated. Use moment.locale instead.',locale_locales__getSetGlobalLocale);utils_hooks__hooks.langData=deprecate('moment.langData is deprecated. Use moment.localeData instead.',locale_locales__getLocale);var mathAbs=Math.abs;function duration_abs__abs(){var data=this._data;this._milliseconds=mathAbs(this._milliseconds);this._days=mathAbs(this._days);this._months=mathAbs(this._months);data.milliseconds=mathAbs(data.milliseconds);data.seconds=mathAbs(data.seconds);data.minutes=mathAbs(data.minutes);data.hours=mathAbs(data.hours);data.months=mathAbs(data.months);data.years=mathAbs(data.years);return this;}function duration_add_subtract__addSubtract(duration,input,value,direction){var other=create__createDuration(input,value);duration._milliseconds+=direction*other._milliseconds;duration._days+=direction*other._days;duration._months+=direction*other._months;return duration._bubble();}// supports only 2.0-style add(1, 's') or add(duration)
	function duration_add_subtract__add(input,value){return duration_add_subtract__addSubtract(this,input,value,1);}// supports only 2.0-style subtract(1, 's') or subtract(duration)
	function duration_add_subtract__subtract(input,value){return duration_add_subtract__addSubtract(this,input,value,-1);}function absCeil(number){if(number<0){return Math.floor(number);}else{return Math.ceil(number);}}function bubble(){var milliseconds=this._milliseconds;var days=this._days;var months=this._months;var data=this._data;var seconds,minutes,hours,years,monthsFromDays;// if we have a mix of positive and negative values, bubble down first
	// check: https://github.com/moment/moment/issues/2166
	if(!(milliseconds>=0&&days>=0&&months>=0||milliseconds<=0&&days<=0&&months<=0)){milliseconds+=absCeil(monthsToDays(months)+days)*864e5;days=0;months=0;}// The following code bubbles up values, see the tests for
	// examples of what that means.
	data.milliseconds=milliseconds%1000;seconds=absFloor(milliseconds/1000);data.seconds=seconds%60;minutes=absFloor(seconds/60);data.minutes=minutes%60;hours=absFloor(minutes/60);data.hours=hours%24;days+=absFloor(hours/24);// convert days to months
	monthsFromDays=absFloor(daysToMonths(days));months+=monthsFromDays;days-=absCeil(monthsToDays(monthsFromDays));// 12 months -> 1 year
	years=absFloor(months/12);months%=12;data.days=days;data.months=months;data.years=years;return this;}function daysToMonths(days){// 400 years have 146097 days (taking into account leap year rules)
	// 400 years have 12 months === 4800
	return days*4800/146097;}function monthsToDays(months){// the reverse of daysToMonths
	return months*146097/4800;}function as(units){var days;var months;var milliseconds=this._milliseconds;units=normalizeUnits(units);if(units==='month'||units==='year'){days=this._days+milliseconds/864e5;months=this._months+daysToMonths(days);return units==='month'?months:months/12;}else{// handle milliseconds separately because of floating point math errors (issue #1867)
	days=this._days+Math.round(monthsToDays(this._months));switch(units){case'week':return days/7+milliseconds/6048e5;case'day':return days+milliseconds/864e5;case'hour':return days*24+milliseconds/36e5;case'minute':return days*1440+milliseconds/6e4;case'second':return days*86400+milliseconds/1000;// Math.floor prevents floating point math errors here
	case'millisecond':return Math.floor(days*864e5)+milliseconds;default:throw new Error('Unknown unit '+units);}}}// TODO: Use this.as('ms')?
	function duration_as__valueOf(){return this._milliseconds+this._days*864e5+this._months%12*2592e6+toInt(this._months/12)*31536e6;}function makeAs(alias){return function(){return this.as(alias);};}var asMilliseconds=makeAs('ms');var asSeconds=makeAs('s');var asMinutes=makeAs('m');var asHours=makeAs('h');var asDays=makeAs('d');var asWeeks=makeAs('w');var asMonths=makeAs('M');var asYears=makeAs('y');function duration_get__get(units){units=normalizeUnits(units);return this[units+'s']();}function makeGetter(name){return function(){return this._data[name];};}var milliseconds=makeGetter('milliseconds');var seconds=makeGetter('seconds');var minutes=makeGetter('minutes');var hours=makeGetter('hours');var days=makeGetter('days');var months=makeGetter('months');var years=makeGetter('years');function weeks(){return absFloor(this.days()/7);}var round=Math.round;var thresholds={s:45,// seconds to minute
	m:45,// minutes to hour
	h:22,// hours to day
	d:26,// days to month
	M:11// months to year
	};// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	function substituteTimeAgo(string,number,withoutSuffix,isFuture,locale){return locale.relativeTime(number||1,!!withoutSuffix,string,isFuture);}function duration_humanize__relativeTime(posNegDuration,withoutSuffix,locale){var duration=create__createDuration(posNegDuration).abs();var seconds=round(duration.as('s'));var minutes=round(duration.as('m'));var hours=round(duration.as('h'));var days=round(duration.as('d'));var months=round(duration.as('M'));var years=round(duration.as('y'));var a=seconds<thresholds.s&&['s',seconds]||minutes<=1&&['m']||minutes<thresholds.m&&['mm',minutes]||hours<=1&&['h']||hours<thresholds.h&&['hh',hours]||days<=1&&['d']||days<thresholds.d&&['dd',days]||months<=1&&['M']||months<thresholds.M&&['MM',months]||years<=1&&['y']||['yy',years];a[2]=withoutSuffix;a[3]=+posNegDuration>0;a[4]=locale;return substituteTimeAgo.apply(null,a);}// This function allows you to set the rounding function for relative time strings
	function duration_humanize__getSetRelativeTimeRounding(roundingFunction){if(roundingFunction===undefined){return round;}if(typeof roundingFunction==='function'){round=roundingFunction;return true;}return false;}// This function allows you to set a threshold for relative time strings
	function duration_humanize__getSetRelativeTimeThreshold(threshold,limit){if(thresholds[threshold]===undefined){return false;}if(limit===undefined){return thresholds[threshold];}thresholds[threshold]=limit;return true;}function humanize(withSuffix){var locale=this.localeData();var output=duration_humanize__relativeTime(this,!withSuffix,locale);if(withSuffix){output=locale.pastFuture(+this,output);}return locale.postformat(output);}var iso_string__abs=Math.abs;function iso_string__toISOString(){// for ISO strings we do not use the normal bubbling rules:
	//  * milliseconds bubble up until they become hours
	//  * days do not bubble at all
	//  * months bubble up until they become years
	// This is because there is no context-free conversion between hours and days
	// (think of clock changes)
	// and also not between days and months (28-31 days per month)
	var seconds=iso_string__abs(this._milliseconds)/1000;var days=iso_string__abs(this._days);var months=iso_string__abs(this._months);var minutes,hours,years;// 3600 seconds -> 60 minutes -> 1 hour
	minutes=absFloor(seconds/60);hours=absFloor(minutes/60);seconds%=60;minutes%=60;// 12 months -> 1 year
	years=absFloor(months/12);months%=12;// inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
	var Y=years;var M=months;var D=days;var h=hours;var m=minutes;var s=seconds;var total=this.asSeconds();if(!total){// this is the same as C#'s (Noda) and python (isodate)...
	// but not other JS (goog.date)
	return'P0D';}return(total<0?'-':'')+'P'+(Y?Y+'Y':'')+(M?M+'M':'')+(D?D+'D':'')+(h||m||s?'T':'')+(h?h+'H':'')+(m?m+'M':'')+(s?s+'S':'');}var duration_prototype__proto=Duration.prototype;duration_prototype__proto.abs=duration_abs__abs;duration_prototype__proto.add=duration_add_subtract__add;duration_prototype__proto.subtract=duration_add_subtract__subtract;duration_prototype__proto.as=as;duration_prototype__proto.asMilliseconds=asMilliseconds;duration_prototype__proto.asSeconds=asSeconds;duration_prototype__proto.asMinutes=asMinutes;duration_prototype__proto.asHours=asHours;duration_prototype__proto.asDays=asDays;duration_prototype__proto.asWeeks=asWeeks;duration_prototype__proto.asMonths=asMonths;duration_prototype__proto.asYears=asYears;duration_prototype__proto.valueOf=duration_as__valueOf;duration_prototype__proto._bubble=bubble;duration_prototype__proto.get=duration_get__get;duration_prototype__proto.milliseconds=milliseconds;duration_prototype__proto.seconds=seconds;duration_prototype__proto.minutes=minutes;duration_prototype__proto.hours=hours;duration_prototype__proto.days=days;duration_prototype__proto.weeks=weeks;duration_prototype__proto.months=months;duration_prototype__proto.years=years;duration_prototype__proto.humanize=humanize;duration_prototype__proto.toISOString=iso_string__toISOString;duration_prototype__proto.toString=iso_string__toISOString;duration_prototype__proto.toJSON=iso_string__toISOString;duration_prototype__proto.locale=locale;duration_prototype__proto.localeData=localeData;// Deprecations
	duration_prototype__proto.toIsoString=deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)',iso_string__toISOString);duration_prototype__proto.lang=lang;// Side effect imports
	// FORMATTING
	addFormatToken('X',0,0,'unix');addFormatToken('x',0,0,'valueOf');// PARSING
	addRegexToken('x',matchSigned);addRegexToken('X',matchTimestamp);addParseToken('X',function(input,array,config){config._d=new Date(parseFloat(input,10)*1000);});addParseToken('x',function(input,array,config){config._d=new Date(toInt(input));});// Side effect imports
	utils_hooks__hooks.version='2.15.0';setHookCallback(local__createLocal);utils_hooks__hooks.fn=momentPrototype;utils_hooks__hooks.min=min;utils_hooks__hooks.max=max;utils_hooks__hooks.now=now;utils_hooks__hooks.utc=create_utc__createUTC;utils_hooks__hooks.unix=moment__createUnix;utils_hooks__hooks.months=lists__listMonths;utils_hooks__hooks.isDate=isDate;utils_hooks__hooks.locale=locale_locales__getSetGlobalLocale;utils_hooks__hooks.invalid=valid__createInvalid;utils_hooks__hooks.duration=create__createDuration;utils_hooks__hooks.isMoment=isMoment;utils_hooks__hooks.weekdays=lists__listWeekdays;utils_hooks__hooks.parseZone=moment__createInZone;utils_hooks__hooks.localeData=locale_locales__getLocale;utils_hooks__hooks.isDuration=isDuration;utils_hooks__hooks.monthsShort=lists__listMonthsShort;utils_hooks__hooks.weekdaysMin=lists__listWeekdaysMin;utils_hooks__hooks.defineLocale=defineLocale;utils_hooks__hooks.updateLocale=updateLocale;utils_hooks__hooks.locales=locale_locales__listLocales;utils_hooks__hooks.weekdaysShort=lists__listWeekdaysShort;utils_hooks__hooks.normalizeUnits=normalizeUnits;utils_hooks__hooks.relativeTimeRounding=duration_humanize__getSetRelativeTimeRounding;utils_hooks__hooks.relativeTimeThreshold=duration_humanize__getSetRelativeTimeThreshold;utils_hooks__hooks.calendarFormat=getCalendarFormat;utils_hooks__hooks.prototype=momentPrototype;var _moment=utils_hooks__hooks;return _moment;});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(288)(module)))

/***/ },
/* 288 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = function (module) {
		if (!module.webpackPolyfill) {
			module.deprecate = function () {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map