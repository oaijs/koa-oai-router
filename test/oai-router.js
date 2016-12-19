import test from 'ava';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';

import Router from '../lib/oai-router';

test('load wrong apiDoc', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api-error.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false
  };

  const router = new Router(opt);
  const server = app.listen();

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());
  t.pass();
})

test('with server options', t => {
  const app = new Koa();
  const server = app.listen();

  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false,
    server: server
  };

  const router = new Router(opt);

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());
  t.pass();
})

test('with no server and no port options', t => {
  const app = new Koa();
  const server = app.listen();

  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false
  };

  const router = new Router(opt);

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());
  t.pass();
})

test('with versioning option', t => {
  const app = new Koa();
  const server = app.listen();

  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false,
    versioning: false
  };

  const router = new Router(opt);

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());
  t.pass();
})

test('with no apiExplorerVisible option', t => {
  const app = new Koa();
  const server = app.listen();

  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    versioning: false
  };

  const router = new Router(opt);

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());
  t.pass();
})

test('with no validator option', t => {
  const app = new Koa();
  const server = app.listen();

  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    versioning: false,
    validator: null
  };

  const router = new Router(opt);

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());
  t.pass();
})

test.cb('with enableParser false option', t => {
  const app = new Koa();
  const server = app.listen();

  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.json`,
    controllerDir: `${__dirname}/fixtures/controller`,
    versioning: true,
    enableParser: false
  };

  const router = new Router(opt);
  router.init(require(`${__dirname}/fixtures/api/api.json`));

  app.use(bodyParser());
  app.use(router.routes());

  request(server)
    .get('/v1/api/pets')
    .query({limit: 10, page: 1})
    .expect(200)
    .end(function(err, res) {
      if (err) {
        console.error(err, res);
        throw err;
      }
      t.end();
    });
})

test.cb('with handler function option', t => {
  const api = require(`${__dirname}/fixtures/api/api.json`);
  const app = new Koa();
  const server = app.listen();

  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.json`,
    controllerDir: `${__dirname}/fixtures/controller`,
    versioning: true,
    enableParser: false
  };

  const router = new Router(opt);
  api.paths['/pets'].get['x-oai-controller'] = [{
    handler: (ctx)=> {
      ctx.body = 'handler-function';
    }
  }]
  router.init(api);

  app.use(bodyParser());
  app.use(router.routes());

  request(server)
    .get('/v1/api/pets')
    .query({limit: 10, page: 1})
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
      t.is(res.text, 'handler-function');
      t.end();
    });
})
