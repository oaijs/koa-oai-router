import _ from 'lodash';
import urljoin from 'url-join';

/**
 * get version object. major, minor, patch
 *
 * @param version string, like 1.0.1
 * @return {major: 1, minor: 0, patch: 1}
 */
function version(ver) {
  const vers = _.split(ver, '.');

  return {
    major: String(_.nth(vers, 0) || 0),
    monor: String(_.nth(vers, 1) || 0),
    patch: String(_.nth(vers, 2) || 0),
  };
}

/**
 * add major version to url
 * @param  boolean enable   enable version or disable version
 * @param  string  ver      like '10.0.1'
 * @param  url     baseUrl  like '/api'
 * @param  url     endpoint like  '/people'
 * @return string           the url path.
 */
function versionApi(enable, ver, baseUrl = '/', endpoint = '') {
  let url = '';
  let enableReal = enable;

  if (!ver) enableReal = false;

  if (enableReal && endpoint) url = urljoin(`/v${version(ver).major}`, baseUrl, endpoint);
  else if (enableReal && !endpoint) url = urljoin(`/v${version(ver).major}`, baseUrl);
  else if (!enableReal && endpoint && baseUrl === '/') url = urljoin(endpoint);
  else if (!enableReal && endpoint && baseUrl !== '/') url = urljoin(baseUrl, endpoint);
  else if (!enableReal && !endpoint) url = urljoin(baseUrl);

  if (!_.startsWith(url, '/')) url = `/${url}`;

  return url;
}

/**
 * Convert path segment parameters from OpenAPI notation to koa-router notation.
 * @param  {string}  pathSegment like '{people}' (OpenAPI)
 * @return {string}  koa-router path segment like ':people'
 */
function openApiToKoa(pathSegment) {
  return pathSegment.replace(/^\{(.+)\}$/, ':$1');
}

/**
 * Converts URL paths from OpenAPI format to koa-router format.
 * @param  {string} path OpenAPI path like 'api/test/{id}'
 * @return {string}      koa-router path like 'api/test/:id'
 */
function routerFormat(path) {
  if (!path || typeof path !== 'string') return '';
  return _.map(path.split('/'), openApiToKoa).join('/');
}

export {
  version,
  versionApi,
  routerFormat,
};
