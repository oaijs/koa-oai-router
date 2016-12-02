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
    this.apiExplorerStaticsPath = options.apiExplorerStaticsPath || '/koa-oai-router';
    this.jsonSchemaFormatters = options.jsonSchemaFormatters;
    this.errorHandler = options.errorHandler;

    this.router = new Router();
    this.api = null;

    if (!this.port && this.server) {
      this.port = this.server.address().port;
    } else if (!this.port && !this.server) {
      this.port = 80;
    }

    swaggerParser.validate(this.apiDoc, {validate: {schema: false, spec: false}})
    .then((api)=> {
      debug(`swagger version [${api.swagger}]`);
      debug(`api title [${api.info.title}]`);
      debug(`api version [${api.info.version}]`);

      this.api = api;

      this._init_();
    })
    .catch((e)=> {
      console.error(e);
      process.exit(0);
    });
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
      apiExplorerStaticsPath: this.apiExplorerStaticsPath
    });
  }

  _init_() {
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

  _hookEndpoint_(method, endpoint, detail) {
    const apiPath = routerFormat(versionApi(!!this.versioning, this.api.info.version, this.api.basePath, endpoint));
    debug(`mount ${method} ${apiPath}`);

    const paramValidator = new Parameters(detail, this.jsonSchemaFormatters);
    const respValidator = new Responses(detail, this.errorHandler);

    const handlers = this._loadHandlers_(detail['x-controller']);

    const middlewares = compose(_.flattenDeep([respValidator, paramValidator, handlers]));
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
    const modulePath = path.resolve(this.controllerDir, file);
    const module = require(modulePath);

    if (!module || 'function' !== typeof(module[handler]))
      throw new Error(`module [${modulePath}] has no function [${handler}]`)

    return module[handler];
  }
}
