import _ from 'lodash';
import assert from 'assert';
import Debug from 'debug';

import Router from './router-super';
import spec from './spec';
import swagger from './swagger';
import { oai2koaUrlJoin, urlJoin } from './util/route';

import Plugin from './plugin';

const debug = new Debug('koa-oai-router');

class OAIRouter extends Router {
  constructor(opts = {}) {
    super(opts);

    const {
      apiDoc,
      apiExplorerVisible = true,
      options = {},
    } = opts;
    assert(_.isString(apiDoc), 'apiDoc must be string.');

    this.apiExplorerVisible = apiExplorerVisible;
    this.options = options;

    this.api = null;
    this.plugins = {};

    spec(apiDoc)
      .then((api) => {
        this.api = api;

        this.registerRoutes();
        this.registerApiExplorer();
        this.emit('ready');
      })
      .catch((error) => {
        this.emit('error', error);
      });
  }

  /**
   * Register a handler of the field in OpenApi operation object.
   * @public true
   * @param {Plugin} plugin plugin object
   */
  mount(plugin) {
    assert(plugin instanceof Plugin, 'plugin must be instanceof Plugin');

    const { field: fields } = plugin;

    if (_.isString(fields)) {
      this.plugins[fields] = _.compact(_.concat(this.plugins[fields], plugin));
    } else {
      _.each(fields, (field) => {
        this.plugins[field] = _.compact(_.concat(this.plugins[field], plugin));
      });
    }
  }

  /**
   * Initiate routes
   */
  registerRoutes() {
    const paths = _.get(this, 'api.paths', []);

    _.forEach(paths, (pathValue, path) => {
      const endpoint = oai2koaUrlJoin(this.api.basePath, path);

      _.forEach(pathValue, (operationValue, operation) => {
        this.registerRoute(endpoint, operation, operationValue);
      });
    });
  }

  /**
   * Initiate a single route to koa.
   */
  registerRoute(endpoint, operation, operationValue) {
    const middlewareOpts = {
      endpoint,
      operation,
      operationValue,
      options: this.options,
    };

    const middlewares = Plugin.middlewares(this.plugins, middlewareOpts);

    debug('middlewares', middlewares);
    debug(`mount ${operation.toUpperCase()} ${endpoint} ${_.map(middlewares, 'name').join(' > ')}`);
    this[operation](endpoint, ...middlewares);
  }

  /**
   * OpenApi doc explorer
   * @public false
   */
  registerApiExplorer() {
    if (this.apiExplorerVisible === false) return;
    debug(`apiExplorer: ${urlJoin(this.options.prefix, 'api-explorer')}`);

    this.get('/api-explorer', (ctx) => {
      ctx.type = 'text/html';
      ctx.response.body = swagger.index;
    });

    this.get('/swagger-ui.css', (ctx) => {
      ctx.type = 'text/css';
      ctx.response.body = swagger.uiCss;
    });

    this.get('/swagger-ui-bundle.js', (ctx) => {
      ctx.type = 'application/javascript';
      ctx.response.body = swagger.bundleJs;
    });

    this.get('/swagger-ui-standalone-preset.js', (ctx) => {
      ctx.type = 'application/javascript';
      ctx.response.body = swagger.presetJs;
    });

    this.get('/api.json', (ctx) => {
      ctx.response.body = this.api;
    });

    this.get('/api-explorer-config.json', (ctx) => {
      ctx.response.body = {
        urls: [{ name: 'api-doc', url: urlJoin(this.options.prefix, 'api.json') }],
        displayOperationId: true,
        displayRequestDuration: true,
      };
    });
  }
}

export default OAIRouter;
