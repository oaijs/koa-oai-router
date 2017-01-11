import _ from 'lodash';
import Debug from 'debug';
import Router from 'koa-router';
import compose from 'koa-compose';
import swaggerParser from 'swagger-parser';
import path from 'path';

import SwaggerExplorer from './oai-explorer';
import {routerFormat, versionApi} from './util/string';
import Parameters from './validator/parameters';
import Responses from './validator/responses';

const debug = new Debug('koa-oai-router');

export default class OAIRouter {
  constructor(options) {
    this.apiDoc = options.apiDoc;
    this.controllerDir = options.controllerDir;
    this.port = options.port;
    this.server = options.server;
    this.versioning = options.versioning === undefined ? true : options.versioning;
    this.apiExplorerVisible = options.apiExplorerVisible === undefined ? true : options.apiExplorerVisible;
    this.apiExplorerPath = options.apiExplorerPath || '/api-explorer';
    this.apiExplorerStaticPath = options.apiExplorerStaticPath || '/koa-oai-router';
    this.jsonSchemaFormatters = options.jsonSchemaFormatters;
    this.errorHandler = options.errorHandler;
    this.defaultResponseSchemas = options.defaultResponseSchemas;

    this.enableParser = options.enableParser === undefined ? true : options.enableParser;
    this.apiExplorerTitle = options.apiExplorerTitle || 'koa-oai-router';
    this.apiExplorerLink = options.apiExplorerLink || 'https://github.com/BiteBit/koa-oai-router';

    this.validator = options.validator === undefined ? 'ajv' : options.validator;
    if (this.validator !== 'ajv' && this.validator !== 'tv4')
      this.validator = null;

    this.plugins = [];
    this.extends = {};

    this.router = new Router();
    this.api = null;

    if (!this.port && this.server) {
      this.port = this.server.address().port;
    } else if (!this.port && !this.server) {
      this.port = 80;
    }

    if (this.enableParser)
      this._parse_();
  }

  extend(endpointConf, fn) {
    let endpoint = '';

    if (_.isFunction(endpointConf))
      endpointConf = endpointConf();

    if (_.isString(endpointConf)) {
      endpointConf = _.split(endpointConf, /\s+/g);
    }

    if (_.isArray(endpointConf)) {
      endpoint = `${_.nth(endpointConf, 0).toUpperCase()} ${_.nth(endpointConf, 1)}`;
    } else if (_.isObject(endpointConf)) {
      endpoint = `${endpointConf.method.toUpperCase()} ${endpointConf.path}`;
    }

    if (_.isFunction(fn)) {
      debug(`extend ${endpoint}`)
      this.extends[endpoint] = fn;
    } else if (_.isObject(fn)) {
      debug(`extend ${endpoint}`)
      this.extends[endpoint] = fn;
    }
  }

  use(name, fn) {
    if ('string' !== typeof name) throw new TypeError('name must be string.');
    if ('function' !== typeof fn) throw new TypeError('fn must be a function.');

    this.plugins.push({name: name, fn: fn});
  }

  routes() {
    return this.router.routes();
  }

  apiExplorer() {
    return new SwaggerExplorer({
      port: this.port,
      versioning: this.versioning,
      apiDoc: this.apiDoc,
      apiExplorerPath: this.apiExplorerPath,
      apiExplorerVisible: this.apiExplorerVisible,
      apiExplorerStaticPath: this.apiExplorerStaticPath,
      apiExplorerTitle: this.apiExplorerTitle,
      apiExplorerLink: this.apiExplorerLink,
    });
  }

  init(api) {
    this.api = api;
    debug('api doc', this.api);

    for (const endpoint in this.api.paths) {
      const endpointDetail = this.api.paths[endpoint];

      for (const method in endpointDetail) {
        debug(`----------------------------------start init--------------------------------------`);
        this._hookEndpoint_(method, endpoint, endpointDetail[method]);
        debug(`----------------------------------finish init-------------------------------------`);
      }
    }
  }

  _parse_() {
    swaggerParser.validate(this.apiDoc, {validate: {schema: false, spec: false}})
    .then((api)=> {
      debug(`swagger version [${api.swagger}]`);
      debug(`api title [${api.info.title}]`);
      debug(`api version [${api.info.version}]`);

      this.init(api);
    })
    .catch((e)=> {
      console.error(e);
      process.exit(0);
    });
  }

  _hookEndpoint_(method, endpoint, detail) {
    const apiPath = routerFormat(versionApi(!!this.versioning, this.api.info.version, this.api.basePath, endpoint));
    debug(`mount ${method} ${apiPath}`);

    const extendsHook = this.extends[`${method.toUpperCase()} ${endpoint}`];
    if (_.isFunction(extendsHook)) {
      detail = extendsHook(detail);
    } else if (_.isObject(extendsHook)) {
      detail = _.merge(detail, extendsHook);
    }

    const plugins = this._loadPlugins_(detail);

    const respValidator = new Responses(detail, this.validator, this.errorHandler, this.defaultResponseSchemas);
    const paramValidator = new Parameters(detail, this.validator, this.jsonSchemaFormatters);

    const handlers = this._loadHandlers_(detail['x-oai-controller'] || detail['x-controller']);

    const middlewares = compose(_.compact(_.flattenDeep([plugins, respValidator, paramValidator, handlers])));
    this.router[method](apiPath, middlewares);
  }

  _loadHandlers_(controllers) {
    const handlers = [];
    for (const data of controllers) {
      const handler = this._loadHandler_(data);
      handlers.push(handler);
    }

    debug('load user custom handlers: ', handlers);
    return handlers;
  }

  _loadHandler_({file, handler}) {
    if (!file && _.isFunction(handler)) {
      return handler;
    } else {
      const modulePath = path.resolve(this.controllerDir, file);
      const module = require(modulePath);

      if (!module || 'function' !== typeof(module[handler]))
        throw new Error(`module [${modulePath}] has no function [${handler}]`)

      return module[handler];
    }
  }

  _loadPlugins_(detail) {
    const plugins = [];
    for (let plugin of this.plugins) {
      const pluginOpts = detail[plugin.name];

      if (_.startsWith(plugin.name, 'x-oai-') && pluginOpts) {
        debug(`use custom plugin ${plugin.name} ${JSON.stringify(pluginOpts)}`);
        plugins.push(plugin.fn(pluginOpts));
      }
    }

    return plugins;
  }
}
