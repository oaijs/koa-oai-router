import test from 'ava';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';

import Router from '../lib/oai-router';

test.cb('api explorer', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.json`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: true
  };
  const router = new Router(opt);
  const server = app.listen();

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());

  setTimeout(() => {
    request(server)
      .get('/api-explorer')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        t.end();
      });
  }, 500)
})

test.cb('no api explorer', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.json`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false
  };
  const router = new Router(opt);
  const server = app.listen();

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());

  setTimeout(() => {
    request(server)
      .get('/api-explorer')
      .expect(404)
      .end(function(err, res) {
        if (err) throw err;
        t.end();
      });
  }, 500)
})

test.cb('default apiExplorerVisible option', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.json`,
    controllerDir: `${__dirname}/fixtures/controller`,
  };
  const router = new Router(opt);
  const server = app.listen();

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());

  setTimeout(() => {
    request(server)
      .get('/api-explorer')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        t.end();
      });
  }, 500)
})

test.cb('custom api explorer', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.json`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: true,
    apiExplorerPath: '/custom-api-explorer',
    apiExplorerStaticPath: '/apiExplorerStaticPath'
  };
  const router = new Router(opt);
  const server = app.listen();

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());

  setTimeout(() => {
    request(server)
      .get('/custom-api-explorer')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        t.end();
      });
  }, 500)
})

test.cb('custom api explorer static', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.json`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: true,
    apiExplorerPath: '/custom-api-explorer',
    apiExplorerStaticPath: '/apiExplorerStaticPath'
  };
  const router = new Router(opt);
  const server = app.listen();

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());

  setTimeout(() => {
    request(server)
      .get('/apiExplorerStaticPath')
      .expect(200)
      .end(function(err, res) {
        if (err) throw err;
        t.end();
      });
  }, 500)
})
