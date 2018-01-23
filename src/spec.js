import { statSync } from 'fs';
import swaggerParser from 'swagger-parser';

import { bundle } from './util/spec-bundle';

/**
 * Load and parse specification from apiDir. support json or yaml.
 * @param {string} apiDir
 * @returns {Promise}
 */
function parse(apiDir) {
  return swaggerParser.validate(apiDir, { validate: { schema: true, spec: true } })
    .then((api) => {
      return api;
    });
}

/**
 * Load openapi specification to json object from api path or api directory.
 * @param {string} api
 * @returns {object}
 */
function load(api) {
  const stat = statSync(api);
  if (stat.isFile()) {
    return parse(api);
  } else if (stat.isDirectory()) {
    return parse(bundle(api));
  }

  throw new Error('Not support api!');
}

export default load;
