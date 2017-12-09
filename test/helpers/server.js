import _ from 'lodash';
import supertest from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import Router from '../../lib/oai-router';

const request = async (opts) => {
  const app = new Koa();
  const server = app.listen();

  const opt = {
    server,
  };
  const router = new Router(_.merge({}, opt, opts));

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });

  return supertest.agent(server);
};

export {
  request,
};
