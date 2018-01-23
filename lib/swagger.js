'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _swaggerUiDist = require('swagger-ui-dist');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var files = {};
var filesInfo = {
  index: 'index.html',
  uiCss: 'swagger-ui.css',
  bundleJs: 'swagger-ui-bundle.js',
  presetJs: 'swagger-ui-standalone-preset.js'
};

_lodash2.default.each(filesInfo, function (fileName, alias) {
  var content = _fs2.default.readFileSync(`${(0, _swaggerUiDist.absolutePath)()}/${fileName}`).toString();

  if (alias === 'index') {
    var oldSegment = 'url: "http://petstore.swagger.io/v2/swagger.json",';
    var newSegment = 'configUrl: "./api-explorer-config.json",';
    content = content.replace(oldSegment, newSegment);
  }

  files[alias] = content;
});

exports.default = files;