'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = new _debug2.default('koa-oai-router:plugin');

var Plugin = function () {
  /**
   * Create a oai router plugin
   * @param {object} param0
   * @param {string} param0.name plugin name
   * @param {string|[]string} param0.field plugin invoke field
   * @param {function} param0.middlewareWrapper field middleware wrapper function(middlewareOpts, middlewareArgs) {}
   * @param {object} param0.middlewareArgs field middleware args
   */
  function Plugin(_ref) {
    var name = _ref.name,
        field = _ref.field,
        middlewareWrapper = _ref.middlewareWrapper,
        middlewareArgs = _ref.middlewareArgs;

    _classCallCheck(this, Plugin);

    (0, _assert2.default)(_lodash2.default.isString(name), 'name must be string.');
    (0, _assert2.default)(_lodash2.default.isString(field) || _lodash2.default.isArray(field) && _lodash2.default.every(field, _lodash2.default.isString), 'field must be string or [string].');
    (0, _assert2.default)(_lodash2.default.isFunction(middlewareWrapper), 'middlewareWrapper must be function.');
    (0, _assert2.default)(_lodash2.default.isObject(middlewareArgs) || _lodash2.default.isUndefined(middlewareArgs), 'middlewareWrapper must be object.');

    this.name = name;
    this.field = field;
    this.middlewareWrapper = middlewareWrapper;
    this.middlewareArgs = middlewareArgs;
  }

  /**
   * Create a plugin middlewares
   * @public true
   * @param {object} plugins
   * @param {string} plugins.key field
   * @param {Plugin} plugins.value Plugin
   * @param {object} middlewareOpts
   */


  _createClass(Plugin, [{
    key: 'middleware',


    /**
     * Create a plugin middleware.
     * @public false
     * @param {function} middlewareWrapper koa middleware wrapper with args
     * @param {object} middlewareOpts
     * @param {object} middlewareOpts.api whole open api object
     * @param {string} middlewareOpts.endpoint endpoint
     * @param {string} middlewareOpts.field operationObject field name or extensions
     * @param {object} middlewareOpts.fieldValue operationObject field value
     * @param {string} middlewareOpts.operation http verbs https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#path-item-object
     * @param {object} middlewareOpts.operationValue https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#operationObject
     * @returns {function} koa middleware
     */
    value: function middleware(middlewareOpts) {
      var field = middlewareOpts.field,
          options = middlewareOpts.options;
      var name = this.name;


      var newMiddlewareOpts = _lodash2.default.pick(middlewareOpts, ['api', 'endpoint', 'field', 'fieldValue', 'operation', 'operationValue']);
      var newMiddlewareArgs = _lodash2.default.get(options, name) || this.middlewareArgs;

      var mw = this.middlewareWrapper(newMiddlewareOpts, newMiddlewareArgs);
      Object.defineProperty(mw, 'name', { value: `${field}.${name}` });

      return mw;
    }

    /**
     * Convert plugins to middlewares array.
     * @public false
     * @param {Plugin[]} plugins
     * @param {object} middlewareOpts
     */

  }], [{
    key: 'middlewares',
    value: function middlewares(plugins, middlewareOpts) {
      var middlewares = [];
      var operationValue = middlewareOpts.operationValue;


      debug('middlewares', plugins);
      _lodash2.default.each(plugins, function (fieldPlugins, field) {
        var fieldValue = operationValue[field];
        if (!fieldValue) return;

        var opts = _extends({
          field,
          fieldValue
        }, middlewareOpts);
        var mw = Plugin.pluginsToMiddlewares(fieldPlugins, opts);

        debug(field, fieldPlugins);
        middlewares = middlewares.concat(mw);
      });

      return middlewares;
    }
  }, {
    key: 'pluginsToMiddlewares',
    value: function pluginsToMiddlewares(plugins, middlewareOpts) {
      var middlewares = [];

      plugins.forEach(function (plugin) {
        middlewares.push(plugin.middleware(middlewareOpts));
      });

      return middlewares;
    }
  }]);

  return Plugin;
}();

exports.default = Plugin;