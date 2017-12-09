import test from 'ava';
import {request} from './helpers/server';

test('with port option', async (t) => {
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    middlewareDir: `${__dirname}/fixtures/controller`,
    versioning: true,
  };

  const req = await request(opt);

  await req
  .get('/v1/api/pets')
  .query({limit: 10, page: 1})
  .expect(200);

  t.pass();
});

test('with port&server undefine option', async (t) => {
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    middlewareDir: `${__dirname}/fixtures/controller`,
    versioning: true,
    server: null,
  };

  const req = await request(opt);

  await req
  .get('/v1/api/pets')
  .query({limit: 10, page: 1})
  .expect(200);

  t.pass();
});

test('with middlewareDir option', async (t) => {
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    middlewareDir: `${__dirname}/fixtures/controller`,
    versioning: true,
  };

  const req = await request(opt);

  await req
  .get('/v1/api/pets')
  .query({limit: 10, page: 1})
  .expect(200);

  t.pass();
});

test('with controllerDir option', async (t) => {
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    versioning: true,
  };

  const req = await request(opt);

  await req
  .get('/v1/api/pets')
  .query({limit: 10, page: 1})
  .expect(200);

  t.pass();
});

test('with versioning=true option', async (t) => {
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    middlewareDir: `${__dirname}/fixtures/controller`,
    versioning: true,
  };

  const req = await request(opt);

  await req
  .get('/v1/api/pets')
  .query({limit: 10, page: 1})
  .expect(200);

  t.pass();
});

test('with versioning=false option', async (t) => {
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    middlewareDir: `${__dirname}/fixtures/controller`,
    versioning: false,
  };

  const req = await request(opt);

  await req
  .get('/api/pets')
  .query({limit: 10, page: 1})
  .expect(200);

  t.pass();
});
