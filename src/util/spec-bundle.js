import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import klawSync from 'klaw-sync';

const LOAD_DIRS = [
  'paths',
  'definitions',
  'parameters',
  'responses',
  'securityDefinitions',
  'security',
  'tags',
  'externalDocs',
];

/**
 * Read json or yaml file to spec object.
 * @param {string} filePath
 * @returns {object}
 */
function read(filePath) {
  let content = {};
  const raw = fs.readFileSync(filePath);

  if (_.endsWith(filePath, '.json')) {
    content = JSON.parse(raw);
  } else if (_.endsWith(filePath, '.yaml')) {
    content = yaml.safeLoad(raw);
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
    return read(path.join(dir, 'api.yaml'));
  } catch (error) { }

  try {
    return read(path.join(dir, 'api.json'));
  } catch (error) { }

  try {
    return read(path.join(dir, 'api'));
  } catch (error) { }

  return {};
}

/**
 * Load api split info from directory.
 * @param {string} dir
 */
function loadSplittableKeywords(dir) {
  const splitSpecs = {};

  LOAD_DIRS.forEach((folder) => {
    let destFiles = [];
    const destPath = path.join(dir, folder);

    try {
      destFiles = klawSync(destPath, {
        nodir: true,
        filter: (item) => {
          return _.endsWith(item.path, '.json') || _.endsWith(item.path, '.yaml');
        },
      });
    } catch (error) { }

    destFiles.forEach(({ path: specPath }) => {
      _.merge(splitSpecs, _.set({}, folder, read(specPath)));
    });
  });

  return splitSpecs;
}

/**
 * Load api specification from directory.
 * @param {string} dir
 */
function load(dir) {
  const specMain = loadMainSpec(dir);
  const specSplits = loadSplittableKeywords(dir);

  return _.merge({}, specMain, specSplits);
}

/**
 * Bundle api specification in directory to a single api specification file.
 * @param {string} dir
 */
function bundle(dir) {
  const specObject = load(dir);

  return specObject;
}

export {
  load,
  bundle,
};
