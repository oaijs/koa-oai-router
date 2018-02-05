import assert from 'assert';
import Debug from 'debug';

import * as util from './util';

const debug = new Debug('koa-oai-router:plugin');

class Plugin {
  check() {
    assert(util.isString(this.field) || (util.isArray(this.field) && util.every(this.field, util.isString)), 'field must be string or [string].');
    assert(util.isString(this.pluginName) || util.isUndefined(this.pluginName), 'pluginName must be string.');
    assert(util.isFunction(this.init) || util.isUndefined(this.init), 'init must be function.');
    assert(util.isFunction(this.before) || util.isUndefined(this.before), 'before must be function.');
    assert(util.isFunction(this.handler), 'handler must be function, and return a koa middleware.');
    assert(util.isFunction(this.after) || util.isUndefined(this.after), 'after must be function.');
  }

  // set plugin arguments
  setArgs(args) {
    debug(`${this.constructor.name} setArgs:`, args);
    this.args = args;
  }

  // optional override, init only once
  async init() {
    return null;
  }

  // optional override
  async before(docOpts) {
    return null;
  }

  // must override
  async handler(docOpts) {
    throw new Error('Plugin must implement handler function.');
  }

  // optional override
  async after(docOpts) {
    return null;
  }

  /**
   * Create a plugin middleware.
   * @public false
   * @param {object} middlewareOpts
   * @param {object} middlewareOpts.api whole open api object
   * @param {string} middlewareOpts.endpoint endpoint
   * @param {string} middlewareOpts.field operationObject field name or extensions
   * @param {object} middlewareOpts.fieldValue operationObject field value
   * @param {string} middlewareOpts.operation http verbs https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#path-item-object
   * @param {object} middlewareOpts.operationValue https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#operationObject
   * @returns {function} koa middleware
   */
  async middleware(middlewareOpts) {
    debug('convert to middleware: ', middlewareOpts);
    const { pluginName } = this;
    const { field } = middlewareOpts;

    const newMiddlewareOpts = util.pick(middlewareOpts, ['api', 'endpoint', 'field', 'fieldValue', 'operation', 'operationValue']);
    const newMiddlewareArgs = this.args;

    debug('middleware arguments: ', newMiddlewareOpts, newMiddlewareArgs);

    // do something before.
    await this.before(newMiddlewareOpts, newMiddlewareArgs);

    // wrap to middleware.
    const mw = await this.handler(newMiddlewareOpts, newMiddlewareArgs);
    Object.defineProperty(mw || {}, 'name', { value: `${field}.${pluginName}` });

    // do something after.
    await this.after(newMiddlewareOpts, newMiddlewareArgs);

    return mw;
  }
}

export default Plugin;
