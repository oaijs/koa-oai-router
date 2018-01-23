'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bundle = exports.load = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _klawSync = require('klaw-sync');

var _klawSync2 = _interopRequireDefault(_klawSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOAD_DIRS = ['paths', 'definitions', 'parameters', 'responses', 'securityDefinitions', 'security', 'tags', 'externalDocs'];

/**
 * Read json or yaml file to spec object.
 * @param {string} filePath
 * @returns {object}
 */
function read(filePath) {
  var content = {};
  var raw = _fs2.default.readFileSync(filePath);

  if (_lodash2.default.endsWith(filePath, '.json')) {
    content = JSON.parse(raw);
  } else if (_lodash2.default.endsWith(filePath, '.yaml')) {
    content = _jsYaml2.default.safeLoad(raw);
  } else {
    content = JSON.parse(raw);
  }

  return content;
}

/**
 * Load api base info.
 * @param {string} dir
 */
function loadMainSpec(dir) {
  try {
    return read(_path2.default.join(dir, 'api.yaml'));
  } catch (error) {}

  try {
    return read(_path2.default.join(dir, 'api.json'));
  } catch (error) {}

  try {
    return read(_path2.default.join(dir, 'api'));
  } catch (error) {}

  return {};
}

/**
 * Load api split info from directory.
 * @param {string} dir
 */
function loadSplittableKeywords(dir) {
  var splitSpecs = {};

  LOAD_DIRS.forEach(function (folder) {
    var destFiles = [];
    var destPath = _path2.default.join(dir, folder);

    try {
      destFiles = (0, _klawSync2.default)(destPath, {
        nodir: true,
        filter: function (item) {
          return _lodash2.default.endsWith(item.path, '.json') || _lodash2.default.endsWith(item.path, '.yaml');
        }
      });
    } catch (error) {}

    destFiles.forEach(function (_ref) {
      var specPath = _ref.path;

      _lodash2.default.merge(splitSpecs, _lodash2.default.set({}, folder, read(specPath)));
    });
  });

  return splitSpecs;
}

/**
 * Load api specification from directory.
 * @param {string} dir
 */
function load(dir) {
  var specMain = loadMainSpec(dir);
  var specSplits = loadSplittableKeywords(dir);

  return _lodash2.default.merge({}, specMain, specSplits);
}

/**
 * Bundle api specification in directory to a single api specification file.
 * @param {string} dir
 */
function bundle(dir) {
  var specObject = load(dir);

  return specObject;
}

exports.load = load;
exports.bundle = bundle;