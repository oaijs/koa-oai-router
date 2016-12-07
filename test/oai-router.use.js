import test from 'ava';
import Koa from 'koa';
import request from 'supertest';

import Router from '../lib/oai-router';

test('router.use not valid name', t => {
  const app = new Koa();
  const server = app.listen();

  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    versioning: false,
    apiExplorerVisible: false
  };

  const router = new Router(opt);

  t.throws(()=> {
    router.use((options)=> {
      return (ctx, next)=> {
        return next()
        .then((data)=> {
        })
      }
    });

    app.use(router.routes());
    app.use(router.apiExplorer());
  })
})

test('router.use not valid function', t => {
  const app = new Koa();
  const server = app.listen();

  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    versioning: false,
    apiExplorerVisible: false
  };

  const router = new Router(opt);

  t.throws(()=> {
    router.use('x-oai-cache');
    app.use(router.routes());
    app.use(router.apiExplorer());
  })
})

test('router.use valid parameter', t => {
  const app = new Koa();
  const server = app.listen();

  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    versioning: false,
    apiExplorerVisible: false
  };

  const router = new Router(opt);

  t.notThrows(()=> {
    router.use('x-oai-cache', (options)=> {
      return (ctx, next)=> {
        return next()
        .then((data)=> {
        })
      }
    });

    app.use(router.routes());
    app.use(router.apiExplorer());
  })
})
