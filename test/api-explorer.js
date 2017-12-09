import test from 'ava';
import {request} from './helpers/server';

test('api-explorer apiExplorerVisible=true', async (t) => {
  const req = await request({
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    middlewareDir: `${__dirname}/fixtures/controller`,
  });

  await req
  .get('/api-explorer')
  .expect(200);

  t.pass();
});

test('api-explorer apiExplorerVisible=false', async (t) => {
  const req = await request({
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    middlewareDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false,
  });

  await req
  .get('/api-explorer')
  .expect(404);

  t.pass();
});

test('api-explorer apiExplorerPath: /api-explorer-custom', async (t) => {
  const req = await request({
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    middlewareDir: `${__dirname}/fixtures/controller`,
    apiExplorerPath: '/api-explorer-custom',
  });

  await req
  .get('/api-explorer-custom')
  .expect(200);

  await req
  .get('/api-explorer')
  .expect(404);

  t.pass();
});

test('api-explorer apiExplorerStaticPath: /koa-oai-router-custom', async (t) => {
  const req = await request({
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    middlewareDir: `${__dirname}/fixtures/controller`,
    apiExplorerStaticPath: '/koa-oai-router-custom',
  });

  await req
  .get('/koa-oai-router-custom/api.yaml')
  .expect(200);

  await req
  .get('/koa-oai-router/api.yaml')
  .expect(404);

  t.pass();
});
