import test from 'ava';

import {version, versionApi, routerFormat} from '../lib/util/string';

test('version', (t)=> {
  const v = version('2.1.0');
  t.is(v.major, '2');
  t.is(v.monor, '1');
  t.is(v.patch, '0');

  const v1 = version('34.21.09');
  t.is(v1.major, '34');
  t.is(v1.monor, '21');
  t.is(v1.patch, '09');

  const v2 = version();
  t.is(v2.major, '0');
  t.is(v2.monor, '0');
  t.is(v2.patch, '0');
})

test('versionApi', (t)=> {
  t.is(versionApi(), '/');

  t.is(versionApi(true), '/');
  t.is(versionApi(false), '/');

  t.is(versionApi(true, '2.1.0'), '/v2/');
  t.is(versionApi(false, '2.1.0'), '/');

  t.is(versionApi(true, '2.1.0', 'api', 'test'), '/v2/api/test');
  t.is(versionApi(false, '2.1.0', 'api', 'test'), '/api/test');

  t.is(versionApi(true, '34.21.09', 'api', 'test'), '/v34/api/test');
  t.is(versionApi(false, '34.21.09', 'api', 'test'), '/api/test');

  t.is(versionApi(true, '2.1.0', '/', 'test'), '/v2/test');
  t.is(versionApi(false, '2.1.0', '/', 'test'), '/test');

  t.is(versionApi(true, '2.1.0', '/api'), '/v2/api');
  t.is(versionApi(false, '2.1.0', '/api'), '/api');
})

test('routerFormat', (t)=> {
  t.is(routerFormat(), '');
  t.is(routerFormat({}), '');

  t.is(routerFormat('/api/{peopleId}'), '/api/:peopleId');
  t.is(routerFormat('/api/{peopleId}/{mailId}'), '/api/:peopleId/:mailId');
  t.is(routerFormat('/api/{peopleId}/{mailId}/{attachId}'), '/api/:peopleId/:mailId/:attachId');
  t.is(routerFormat('/api/{people-id}/{mail-id}/{attach-id}'), '/api/:people-id/:mail-id/:attach-id');
})
