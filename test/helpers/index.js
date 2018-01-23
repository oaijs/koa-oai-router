import _ from 'lodash';
import _request from 'supertest';
import bodyParser from 'koa-bodyparser';
import Koa from 'koa';

import { expectApiExplorer } from './expect-api-explorer';
import Router from '../../src';

const Plugin = Router.Plugin;

async function init(opts) {
  const app = new Koa();
  const router = new Router(opts);
  const { plugins } = opts;

  _.each(plugins, (plugin) => {
    router.mount(plugin);
  });

  app.use(bodyParser());
  app.use(router.routes());

  await new Promise((resolve, reject) => {
    router.on('ready', resolve);
    router.on('error', reject);
  });

  return {
    app,
    router,
    request: _request(app.callback()),
  };
}

export {
  _,
  init,
  expectApiExplorer,
  Router,
  Plugin,
};
