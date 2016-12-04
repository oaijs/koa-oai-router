import test from 'ava';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';

import Router from '../lib/oai-router';

let server = null;

test.cb.before(t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.json`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false
  };
  const router = new Router(opt);
  server = app.listen();

  app.use(bodyParser());
  app.use(router.routes());
  app.use(router.apiExplorer());

  setTimeout(t.end, 500);
})

test.cb('GET /v1/api/pets 200', t => {
  request(server)
    .get('/v1/api/pets')
    .query({limit: 10, page: 1})
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
      t.end();
    });
})

test.cb('GET /v1/api/pets no parameter', t => {
  request(server)
    .get('/v1/api/pets')
    .expect(400)
    .end(function(err, res) {
      if (err) throw err;
      t.end();
    });
})

test.cb('GET /v1/api/pets invalid parameters', t => {
  request(server)
    .get('/v1/api/pets')
    .query({limit: 'aaa', page: 1})
    .expect(400)
    .end(function(err, res) {
      if (err) throw err;
      t.end();
    });
})

test.cb('GET /v1/api/pets one unrequired parameters', t => {
  request(server)
    .get('/v1/api/pets')
    .query({limit: 1})
    .expect(400)
    .end(function(err, res) {
      if (err) throw err;
      t.end();
    });
})

test.cb('GET /v1/api/pets one required parameters', t => {
  request(server)
    .get('/v1/api/pets')
    .query({page: 1})
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
      t.end();
    });
})

test.cb('POST /v1/api/pets valid parameters', t => {
  request(server)
    .post('/v1/api/pets')
    .send([{
      "id": 0,
      "name": "string",
      "tag": "string"}])
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
      t.end();
    });
})

test.cb('POST /v1/api/pets valid parameters string to number', t => {
  request(server)
    .post('/v1/api/pets')
    .send([{
      "id": "1234",
      "name": "string",
      "tag": "string"}])
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
      t.end();
    });
})

test.cb('POST /v1/api/pets invalid parameters array -> object', t => {
  request(server)
    .post('/v1/api/pets')
    .send({
      "id": "1234",
      "name": "string",
      "tag": "string"})
    .expect(400)
    .end(function(err, res) {
      if (err) throw err;
      t.end();
    });
})

test.cb('POST /v1/api/pets invalid parameters array -> required', t => {
  request(server)
    .post('/v1/api/pets')
    .send([{
      "id": "1234",
      "tag": "string"}])
    .expect(400)
    .end(function(err, res) {
      if (err) throw err;
      t.end();
    });
})

test.cb('POST /v1/api/pets invalid parameters array -> optional', t => {
  request(server)
    .post('/v1/api/pets')
    .send([{
      "id": "1234",
      "name": "string"}])
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
      t.end();
    });
})

test.cb('GET /v1/api/pets/crash', t => {
  request(server)
    .get('/v1/api/crash1')
    .expect(500)
    .end(function(err, res) {
      if (err) throw err;
      t.end();
    });
})
