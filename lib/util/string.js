import _ from 'lodash';
import urljoin from 'url-join';

/**
 * get version object. major, minor, patch
 *
 * @param version string, like 1.0.1
 * @return {major: 1, minor: 0, patch: 1}
 */
function version (version) {
  const vers = _.split(version, '.');

  return {
    major: String(_.nth(vers, 0) || 0),
    monor: String(_.nth(vers, 1) || 0),
    patch: String(_.nth(vers, 2) || 0),
  }
}

/**
 * add major version to url
 * @param  boolean enable   enable version or disable version
 * @param  string  ver      like '10.0.1'
 * @param  url     baseUrl  like '/api'
 * @param  url     endpoint like  '/people'
 * @return string           the url path.
 */
function versionApi(enable, ver, baseUrl = '', endpoint = '') {
  if (enable === undefined || ver === undefined) return '';

  const versionPrefix = `/v${version(ver).major}`;

  return urljoin(!!enable ? versionPrefix : '', baseUrl, endpoint);
}

/**
 * convert swagger url format to koa-router url
 * ps: api/test/{id} --> api/test/:id
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
function routerFormat (path) {
  if (!path || typeof(path) != 'string') return '';

  let params = _.words(path, /{([\s\S]+?)}/g)
  let data = {};
  _.forEach(params, function (param) {
    param = param.replace(/[{|}]/g, '');
    data[param] = `:${param}`
  })

  _.templateSettings.interpolate = /{([\s\S]+?)}/g;
  var compiled = _.template(path);
  return compiled(data);
}

export {
  version,
  versionApi,
  routerFormat
}
