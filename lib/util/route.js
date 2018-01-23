'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.koa2oaiUrlJoin = exports.oai2koaUrlJoin = exports.koa2oai = exports.oai2koa = exports.urlJoin = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _urlJoin = require('url-join');

var _urlJoin2 = _interopRequireDefault(_urlJoin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Ensure string have prefix.
 * @param {string} str
 * @param {string} prefix
 */
function ensurePrefix(str, prefix) {
  if (_lodash2.default.startsWith(str, prefix)) {
    return str;
  }

  return `${prefix}${str}`;
}

/**
 * Join all segments to a url.
 * @param {[string]} args url segment
 * @returns {string}      url string
 */
function urlJoin() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var urlArray = _lodash2.default.pull(args, '/', undefined, null);
  if (_lodash2.default.isEmpty(urlArray)) {
    urlArray = ['/'];
  }

  return ensurePrefix((0, _urlJoin2.default)(...urlArray), '/');
}

/**
 * Converts URL paths from OpenAPI format to koa-router format.
 * @param  {string} path koa-router path like 'api/test/:id'
 * @return {string}      OpenAPI path like 'api/test/{id}'
 */
function oai2koa(path) {
  if (!path || typeof path !== 'string') return '';

  function o2k(pathSegment) {
    return pathSegment.replace(/^\{(.+)\}$/, ':$1');
  }

  return _lodash2.default.map(path.split('/'), o2k).join('/');
}

/**
 * Converts URL paths from koa-router format to OpenAPI format.
 * @param  {string} path OpenAPI path like 'api/test/{id}'
 * @return {string}      koa-router path like 'api/test/:id'
 */
function koa2oai(path) {
  if (!path || typeof path !== 'string') return '';

  function o2k(pathSegment) {
    return pathSegment.replace(/:(\w+)$/, '{$1}');
  }

  return _lodash2.default.map(path.split('/'), o2k).join('/');
}

/**
 * Join all segments to a url and converts URL path from OpenAPI format to koa-router format.
 * @param {string[]} args url segment
 * @returns {string}
 */
function oai2koaUrlJoin() {
  return oai2koa(urlJoin(...arguments));
}

/**
 * Join all segments to a url and converts URL path from koa-router format to OpenAPI format.
 * @param {string[]} args url segment
 * @returns {string}
 */
function koa2oaiUrlJoin() {
  return koa2oai(urlJoin(...arguments));
}

exports.urlJoin = urlJoin;
exports.oai2koa = oai2koa;
exports.koa2oai = koa2oai;
exports.oai2koaUrlJoin = oai2koaUrlJoin;
exports.koa2oaiUrlJoin = koa2oaiUrlJoin;