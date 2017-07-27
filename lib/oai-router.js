import _ from 'lodash';
import assert from 'assert';
import Debug from 'debug';
import Router from 'koa-router';
import swaggerParser from 'swagger-parser';

import SwaggerExplorer from './oai-explorer';
import {routerFormat, versionApi} from './util/string';

import correction from './plugins/correction';
import responses from './plugins/responses';
import parameters from './plugins/parameters';
import middleware from './plugins/middleware';

const debug = new Debug('koa-oai-router');

class OAIRouter extends Router {
  constructor(options) {
    super(options);

    this.apiDoc = options.apiDoc;
    this.middlewareDir = options.middlewareDir || options.controllerDir;
    this.port = options.port;
    this.server = options.server;
    this.versioning = options.versioning === undefined ? true : options.versioning;
    this.apiExplorerVisible = options.apiExplorerVisible === undefined ? true : options.apiExplorerVisible;
    this.apiExplorerPath = options.apiExplorerPath || '/api-explorer';
    this.apiExplorerStaticPath = options.apiExplorerStaticPath || '/koa-oai-router';
    this.adjustBasePath = !!options.adjustBasePath;

    this.apiExplorerTitle = options.apiExplorerTitle || 'koa-oai-router';
    this.apiExplorerLink = options.apiExplorerLink || 'https://github.com/BiteBit/koa-oai-router';
    this.api = null;

    this.plugins = {};

    if (!this.port && this.server) {
      this.port = this.server.address().port;
    } else if (!this.port && !this.server) {
      this.port = 80;
    }

    this.mountInternal('parameters', correction, -99);
    this.mountInternal('parameters', parameters, 1);

    this.mountInternal('responses', responses, 0);

    this.mountInternal('x-controller', middleware, 51);
    this.mountInternal('x-oai-middleware', middleware, 51);
    this.mountInternal('x-oai-controller', middleware, 51);

    this.parse()
    .then((api) => {
      this.api = api;
      this.init();
    })
    .catch((error) => {
      console.error(error);
      process.exit(0);
    });
  }

  parse() {
    return swaggerParser.validate(this.apiDoc, {validate: {schema: true, spec: true}})
    .then((api) => {
      debug(`swagger version [${api.swagger}]`);
      debug(`api title [${api.info.title}]`);
      debug(`api version [${api.info.version}]`);
      return api;
    });
  }

  init() {
    const paths = _.get(this, 'api.paths') || _.get(this, 'api.paths.allOf');

    _.forEach(paths, (endpointInfo, endpoint) => {
      // version api endpoint
      const apiEndpoint = versionApi(!!this.versioning, this.api.info.version, this.api.basePath, endpoint);
      // convert OpenApi endpoint path format to koa-router format
      const apiEndpointKoa = routerFormat(apiEndpoint);

      _.forEach(endpointInfo, (methodInfo, method) => {
        this.hookEndpoint(method, apiEndpointKoa, methodInfo);
      });
    });
  }

  routes() {
    this.init();

    return super.routes();
  }

  /**
   * Parse OpenApi operation object and mount all plugins to router.
   * @param {string} method
   * @param {string} endpoint
   * @param {object} operationData
   */
  hookEndpoint(method, endpoint, operationData) {
    const unsortMws = [];

    debug(`parse [${method.toUpperCase()}] [${endpoint}]`);

    _.forEach(operationData, (fieldData, field) => {
      const plugins = this.plugins[field];

      _.forEach(plugins, (plugin) => {
        const {priority, handler} = plugin;
        if (!handler) return;

        const options = {
          middlewareDir: this.middlewareDir,
        };

        const fieldMiddleware = handler(endpoint, method, fieldData, operationData, options);
        assert(_.isFunction(fieldMiddleware), `plugin handler param need return a koa middleware, not ${typeof fieldMiddleware}`);

        unsortMws.push({
          field,
          priority,
          middleware: Object.defineProperty(fieldMiddleware, 'name', {value: `${field}:${handler.name}`}),
        });
      });
    });

    // A stable sort, that is, it preserves the original sort order of equal elements.
    const sortedMws = _.sortBy(unsortMws, 'priority');
    const mws = _.concat(endpoint, _.map(sortedMws, 'middleware'));
    this[method](...mws);

    debug(`mount [${method.toUpperCase()}] ${_.map(sortedMws, 'middleware.name')}`);
  }

  /**
   * Register a handler of the field in OpenApi operation object.
   * @public Yes
   * @param {string} field in operation object
   * @param {function} field handler, must return a koa middleware
   * @param {number} priority, the priority of the handler, 0-100 0 is the max level priority. default
   *
   * If you want to implement a operation field handler, there are some parameters you can use.
   *   * endpoint {string} api endpoint
   *   * method {string} api method
   *   * fieldData {object} the field's data in api doc
   *   * operationData {object} the hole operation's data in api doc
   *   * options {object} the extra options
   * The handler must return a koa middleware function to use in router.
   *
   * function handler(endpoint, method, fieldData, operationData, options) {
   *   return (ctx, next) => {
   *     ...
   *     ...
   *   }
   * }
   */
  mount(field, handler, priority = 50) {
    assert(_.isString(field), `field must be typeof string, not ${typeof field}`);
    assert(_.isFunction(handler), `handler must be typeof function, not ${typeof handler}`);
    assert(_.isNumber(priority), `priority must be typeof number, not ${typeof priority}`);
    assert(_.inRange(priority, 0, 100), `priority must in range 0-100, not ${priority}`);

    this.mountInternal(field, handler, priority);
  }

  mountInternal(field, handler, priority) {
    const plugin = {
      priority,
      handler,
    };

    if (_.isEmpty(this.plugins[field])) {
      this.plugins[field] = [plugin];
    } else {
      this.plugins[field].push(plugin);
    }
  }

  /**
   * OpenApi doc explorer config for render api explorer.
   * @returns {object}
   */
  apiExplorerConfig() {
    return {
      port: this.port,
      versioning: this.versioning,
      apiDoc: this.apiDoc,
      apiExplorerPath: this.apiExplorerPath,
      apiExplorerVisible: this.apiExplorerVisible,
      apiExplorerStaticPath: this.apiExplorerStaticPath,
      apiExplorerTitle: this.apiExplorerTitle,
      apiExplorerLink: this.apiExplorerLink,
      adjustBasePath: this.adjustBasePath,
    };
  }

  /**
   * OpenApi doc explorer middleware.
   * @returns {function} koa middleware
   */
  apiExplorer() {
    return new SwaggerExplorer(this.apiExplorerConfig());
  }
}

module.exports = OAIRouter;
