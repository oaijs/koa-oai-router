'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _routerSuper = require('./router-super');

var _routerSuper2 = _interopRequireDefault(_routerSuper);

var _spec = require('./spec');

var _spec2 = _interopRequireDefault(_spec);

var _swagger = require('./swagger');

var _swagger2 = _interopRequireDefault(_swagger);

var _route = require('./util/route');

var _plugin = require('./plugin');

var _plugin2 = _interopRequireDefault(_plugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = new _debug2.default('koa-oai-router');

var OAIRouter = function (_Router) {
  _inherits(OAIRouter, _Router);

  function OAIRouter() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, OAIRouter);

    var _this = _possibleConstructorReturn(this, (OAIRouter.__proto__ || Object.getPrototypeOf(OAIRouter)).call(this, opts));

    var apiDoc = opts.apiDoc,
        _opts$apiExplorerVisi = opts.apiExplorerVisible,
        apiExplorerVisible = _opts$apiExplorerVisi === undefined ? true : _opts$apiExplorerVisi,
        _opts$options = opts.options,
        options = _opts$options === undefined ? {} : _opts$options;

    (0, _assert2.default)(_lodash2.default.isString(apiDoc), 'apiDoc must be string.');

    _this.apiExplorerVisible = apiExplorerVisible;
    _this.options = options;

    _this.api = null;
    _this.plugins = {};

    (0, _spec2.default)(apiDoc).then(function (api) {
      _this.api = api;

      _this.registerRoutes();
      _this.registerApiExplorer();
      _this.emit('ready');
    }).catch(function (error) {
      _this.emit('error', error);
    });
    return _this;
  }

  /**
   * Register a handler of the field in OpenApi operation object.
   * @public true
   * @param {Plugin} plugin plugin object
   */


  _createClass(OAIRouter, [{
    key: 'mount',
    value: function mount(plugin) {
      var _this2 = this;

      (0, _assert2.default)(plugin instanceof _plugin2.default, 'plugin must be instanceof Plugin');

      var fields = plugin.field;


      if (_lodash2.default.isString(fields)) {
        this.plugins[fields] = _lodash2.default.compact(_lodash2.default.concat(this.plugins[fields], plugin));
      } else {
        _lodash2.default.each(fields, function (field) {
          _this2.plugins[field] = _lodash2.default.compact(_lodash2.default.concat(_this2.plugins[field], plugin));
        });
      }
    }

    /**
     * Initiate routes
     */

  }, {
    key: 'registerRoutes',
    value: function registerRoutes() {
      var _this3 = this;

      var paths = _lodash2.default.get(this, 'api.paths', []);

      _lodash2.default.forEach(paths, function (pathValue, path) {
        var endpoint = (0, _route.oai2koaUrlJoin)(_this3.api.basePath, path);

        _lodash2.default.forEach(pathValue, function (operationValue, operation) {
          _this3.registerRoute(endpoint, operation, operationValue);
        });
      });
    }

    /**
     * Initiate a single route to koa.
     */

  }, {
    key: 'registerRoute',
    value: function registerRoute(endpoint, operation, operationValue) {
      var middlewareOpts = {
        endpoint,
        operation,
        operationValue,
        options: this.options
      };

      var middlewares = _plugin2.default.middlewares(this.plugins, middlewareOpts);

      debug('middlewares', middlewares);
      debug(`mount ${operation.toUpperCase()} ${endpoint} ${_lodash2.default.map(middlewares, 'name').join(' > ')}`);
      this[operation](endpoint, ...middlewares);
    }

    /**
     * OpenApi doc explorer
     * @public false
     */

  }, {
    key: 'registerApiExplorer',
    value: function registerApiExplorer() {
      var _this4 = this;

      if (this.apiExplorerVisible === false) return;
      debug(`apiExplorer: ${(0, _route.urlJoin)(this.options.prefix, 'api-explorer')}`);

      this.get('/api-explorer', function (ctx) {
        ctx.type = 'text/html';
        ctx.response.body = _swagger2.default.index;
      });

      this.get('/swagger-ui.css', function (ctx) {
        ctx.type = 'text/css';
        ctx.response.body = _swagger2.default.uiCss;
      });

      this.get('/swagger-ui-bundle.js', function (ctx) {
        ctx.type = 'application/javascript';
        ctx.response.body = _swagger2.default.bundleJs;
      });

      this.get('/swagger-ui-standalone-preset.js', function (ctx) {
        ctx.type = 'application/javascript';
        ctx.response.body = _swagger2.default.presetJs;
      });

      this.get('/api.json', function (ctx) {
        ctx.response.body = _this4.api;
      });

      this.get('/api-explorer-config.json', function (ctx) {
        ctx.response.body = {
          urls: [{ name: 'api-doc', url: (0, _route.urlJoin)(_this4.options.prefix, 'api.json') }],
          displayOperationId: true,
          displayRequestDuration: true
        };
      });
    }
  }]);

  return OAIRouter;
}(_routerSuper2.default);

exports.default = OAIRouter;