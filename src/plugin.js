import _ from 'lodash';
import assert from 'assert';
import Debug from 'debug';

const debug = new Debug('koa-oai-router:plugin');

class Plugin {
  /**
   * Create a oai router plugin
   * @param {object} param0
   * @param {string} param0.name plugin name
   * @param {string|[]string} param0.field plugin invoke field
   * @param {function} param0.middlewareWrapper field middleware wrapper function(middlewareOpts, middlewareArgs) {}
   * @param {object} param0.middlewareArgs field middleware args
   */
  constructor({ name, field, middlewareWrapper, middlewareArgs }) {
    assert(_.isString(name), 'name must be string.');
    assert(_.isString(field) || (_.isArray(field) && _.every(field, _.isString)), 'field must be string or [string].');
    assert(_.isFunction(middlewareWrapper), 'middlewareWrapper must be function.');

    this.name = name;
    this.field = field;
    this.middlewareWrapper = middlewareWrapper;
    this.middlewareArgs = middlewareArgs;
  }

  /**
   * Create a plugin middlewares
   * @public true
   * @param {object} plugins
   * @param {string} plugins.key field
   * @param {Plugin} plugins.value Plugin
   * @param {object} middlewareOpts
   */
  static middlewares(plugins, middlewareOpts) {
    let middlewares = [];
    const { operationValue } = middlewareOpts;

    debug('middlewares', plugins);
    _.each(plugins, (fieldPlugins, field) => {
      const fieldValue = operationValue[field];
      if (!fieldValue) return;

      const opts = {
        field,
        fieldValue,
        ...middlewareOpts,
      };
      const mw = Plugin.pluginsToMiddlewares(fieldPlugins, opts);

      debug(field, fieldPlugins);
      middlewares = middlewares.concat(mw);
    });

    return middlewares;
  }

  /**
   * Create a plugin middleware.
   * @public false
   * @param {function} middlewareWrapper koa middleware wrapper with args
   * @param {object} middlewareOpts
   * @param {object} middlewareOpts.api whole open api object
   * @param {string} middlewareOpts.endpoint endpoint
   * @param {string} middlewareOpts.field operationObject field name or extensions
   * @param {object} middlewareOpts.fieldValue operationObject field value
   * @param {string} middlewareOpts.operation http verbs https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#path-item-object
   * @param {object} middlewareOpts.operationValue https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#operationObject
   * @returns {function} koa middleware
   */
  middleware(middlewareOpts) {
    const { field, options } = middlewareOpts;
    const { name } = this;

    const newMiddlewareOpts = _.pick(middlewareOpts, ['api', 'endpoint', 'field', 'fieldValue', 'operation', 'operationValue']);
    const newMiddlewareArgs = _.get(options, name) || this.middlewareArgs;

    const mw = this.middlewareWrapper(newMiddlewareOpts, newMiddlewareArgs);
    Object.defineProperty(mw, 'name', { value: `${field}.${name}` });

    return mw;
  }

  /**
   * Convert plugins to middlewares array.
   * @public false
   * @param {Plugin[]} plugins
   * @param {object} middlewareOpts
   */
  static pluginsToMiddlewares(plugins, middlewareOpts) {
    const middlewares = [];

    plugins.forEach((plugin) => {
      middlewares.push(plugin.middleware(middlewareOpts));
    });

    return middlewares;
  }
}

export default Plugin;
