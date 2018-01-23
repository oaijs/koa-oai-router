'use strict';

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _plugin = require('./plugin');

var _plugin2 = _interopRequireDefault(_plugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _router2.default;

_router2.default.Plugin = _plugin2.default;

// Plugin.correction = require('koa-oai-router-correction');
// Plugin.responses = require('koa-oai-router-responses');
// Plugin.parameters = require('koa-oai-router-parameters');
// Plugin.middleware = require('koa-oai-router-middleware');