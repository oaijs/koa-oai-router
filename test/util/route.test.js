import {
  urlJoin,
  oai2koa,
  koa2oai,
  oai2koaUrlJoin,
  koa2oaiUrlJoin,
} from '../../src/util/route';

describe('util.route', () => {
  it('urlJoin', () => {
    expect(urlJoin('/a/', '/b/')).toBe('/a/b/');
    expect(urlJoin('/a', '/b')).toBe('/a/b');
    expect(urlJoin('/a', 'b')).toBe('/a/b');
    expect(urlJoin('a', '/b')).toBe('/a/b');
    expect(urlJoin('a', 'b')).toBe('/a/b');

    expect(urlJoin('a', 'b', 'c')).toBe('/a/b/c');
    expect(urlJoin('/', 'a', 'b', 'c')).toBe('/a/b/c');
    expect(urlJoin('/', 'a', 'b', 'c', null)).toBe('/a/b/c');
    expect(urlJoin('/', 'a', 'b', 'c', undefined)).toBe('/a/b/c');
    expect(urlJoin('/', 'a', 'b', 'c', '/')).toBe('/a/b/c');

    expect(urlJoin(null, undefined, '/')).toBe('/');
  });

  it('oai2koa', () => {
    expect(oai2koa('api/test/{id}')).toBe('api/test/:id');
    expect(oai2koa('api/test/{id}/{abc}')).toBe('api/test/:id/:abc');

    expect(oai2koa()).toBe('');
    expect(oai2koa(123)).toBe('');
  });

  it('koa2oai', () => {
    expect(koa2oai('api/test/:id')).toBe('api/test/{id}');
    expect(koa2oai('api/test/:id/:abc')).toBe('api/test/{id}/{abc}');

    expect(koa2oai()).toBe('');
    expect(koa2oai(123)).toBe('');
  });

  it('oai2koaUrlJoin', async () => {
    expect(oai2koaUrlJoin('api', '/test', '/{id}')).toBe('/api/test/:id');
    expect(oai2koaUrlJoin('api', '/test', '/{id}/{abc}')).toBe('/api/test/:id/:abc');

    expect(oai2koaUrlJoin('api', '/test', undefined, '/{id}', '/', null)).toBe('/api/test/:id');
    expect(oai2koaUrlJoin(123)).toBe('/123');
    expect(oai2koaUrlJoin()).toBe('/');
  });

  it('koa2oaiUrlJoin', async () => {
    expect(koa2oaiUrlJoin('api', '/test', '/:id')).toBe('/api/test/{id}');
    expect(koa2oaiUrlJoin('api', '/test', '/:id', '/:abc')).toBe('/api/test/{id}/{abc}');

    expect(koa2oaiUrlJoin()).toBe('/');
    expect(koa2oaiUrlJoin(123)).toBe('/123');
    expect(koa2oaiUrlJoin()).toBe('/');
  });
});
