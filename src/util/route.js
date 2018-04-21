import _ from 'lodash';
import urlJoin_ from 'url-join';

/**
 * Ensure string have prefix.
 * @param {string} str
 * @param {string} prefix
 */
function ensurePrefix(str, prefix) {
  if (_.startsWith(str, prefix)) {
    return str;
  }

  return `${prefix}${str}`;
}

/**
 * Join all segments to a url.
 * @param {[string]} args url segment
 * @returns {string}      url string
 */
function urlJoin(...args) {
  let urlArray = _.pull(args, '/', undefined, null);
  if (_.isEmpty(urlArray)) {
    urlArray = ['/'];
  }

  return ensurePrefix(urlJoin_(...urlArray), '/');
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

  return _.map(path.split('/'), o2k).join('/');
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

  return _.map(path.split('/'), o2k).join('/');
}

/**
 * Join all segments to a url and converts URL path from OpenAPI format to koa-router format.
 * @param {string[]} args url segment
 * @returns {string}
 */
function oai2koaUrlJoin(...args) {
  return oai2koa(urlJoin(...args));
}

/**
 * Join all segments to a url and converts URL path from koa-router format to OpenAPI format.
 * @param {string[]} args url segment
 * @returns {string}
 */
function koa2oaiUrlJoin(...args) {
  return koa2oai(urlJoin(...args));
}

export {
  urlJoin,
  oai2koa,
  koa2oai,
  oai2koaUrlJoin,
  koa2oaiUrlJoin,
};
