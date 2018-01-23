'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _swaggerParser = require('swagger-parser');

var _swaggerParser2 = _interopRequireDefault(_swaggerParser);

var _specBundle = require('./util/spec-bundle');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Load and parse specification from apiDir. support json or yaml.
 * @param {string} apiDir
 * @returns {Promise}
 */
function parse(apiDir) {
  return _swaggerParser2.default.validate(apiDir, { validate: { schema: true, spec: true } }).then(function (api) {
    return api;
  });
}

/**
 * Load openapi specification to json object from api path or api directory.
 * @param {string} api
 * @returns {object}
 */
function load(api) {
  var stat = (0, _fs.statSync)(api);
  if (stat.isFile()) {
    return parse(api);
  } else if (stat.isDirectory()) {
    return parse((0, _specBundle.bundle)(api));
  }

  throw new Error('Not support api!');
}

exports.default = load;