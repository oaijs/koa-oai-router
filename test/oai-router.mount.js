import test from 'ava';
import Koa from 'koa';
import request from 'supertest';

import Router from '../lib/oai-router';

test('router.mount invalid field type', async (t) => {
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
  };
  const router = new Router(opt);

  t.throws(() => {
    router.mount(1, () => {});
  });
});

test('router.mount invalid handler type', async (t) => {
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
  };
  const router = new Router(opt);

  t.throws(() => {
    router.mount('x-oai-middleware');
  });
});

test('router.mount invalid priority type', async (t) => {
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
  };
  const router = new Router(opt);

  t.throws(() => {
    function handler() {

    }
    router.mount('x-oai-middleware', handler, 'xx');
  });
});

test('router.mount invalid priority range', async (t) => {
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
  };
  const router = new Router(opt);

  t.throws(() => {
    function handler() {

    }
    router.mount('x-oai-middleware', handler, -1);
  });
});

test('router.mount success', async (t) => {
  const app = new Koa();
  const server = app.listen();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    server,
  };
  const handler = (endpoint, method, fieldData, operationData, options) => {
    return (ctx, next) => {
      const cached = true;

      if (cached) {
        ctx.response.body = 'cached';
      } else {
        next();
      }
    };
  };

  const router = new Router(opt);
  router.mount('x-oai-cache', handler);

  app.use(router.routes());
  app.use(router.apiExplorer());

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });

  const ret = await request(server)
  .get('/v1/api/pets')
  .query({limit: 10, page: 1})
  .expect(200);

  t.deepEqual(ret.text, 'cached');
});
