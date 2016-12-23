import test from 'ava';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';

import Router from '../lib/oai-router';

test.cb('extend key is string, value is function', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false
  };

  const router = new Router(opt);
  const server = app.listen();

  const FLAG = 'test string';

  router.extend('get /pets', (schema)=> {
    schema['x-oai-test'] = {
      value: FLAG
    }

    return schema;
  })

  router.use('x-oai-test', (opts)=> {
    return (ctx, next)=> {
      ctx.response.body = FLAG;
    };
  })

  app.use(bodyParser());
  app.use(router.routes());

  setTimeout(()=> {
    request(server)
    .get('/v1/api/pets')
    .query({page: 12})
    .expect(200)
    .end((err, res)=> {
      if (err) throw err;

      t.is(res.text, FLAG);
      t.end();
    })
  }, 500)
})

test.cb('extend key is object, value is function', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false
  };

  const router = new Router(opt);
  const server = app.listen();

  const FLAG = 'test object';

  router.extend({method: 'get', path: '/pets'}, (schema)=> {
    schema['x-oai-test'] = {
      value: FLAG
    }

    return schema;
  })

  router.use('x-oai-test', (opts)=> {
    return (ctx, next)=> {
      ctx.response.body = FLAG;
    };
  })

  app.use(bodyParser());
  app.use(router.routes());

  setTimeout(()=> {
    request(server)
    .get('/v1/api/pets')
    .query({page: 12})
    .expect(200)
    .end((err, res)=> {
      if (err) throw err;

      t.is(res.text, FLAG);
      t.end();
    })
  }, 500)
})

test.cb('extend key is array, value is function', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false
  };

  const router = new Router(opt);
  const server = app.listen();

  const FLAG = 'test array';

  router.extend(['get', '/pets'], (schema)=> {
    schema['x-oai-test'] = {
      value: FLAG
    }

    return schema;
  })

  router.use('x-oai-test', (opts)=> {
    return (ctx, next)=> {
      ctx.response.body = FLAG;
    };
  })

  app.use(bodyParser());
  app.use(router.routes());

  setTimeout(()=> {
    request(server)
    .get('/v1/api/pets')
    .query({page: 12})
    .expect(200)
    .end((err, res)=> {
      if (err) throw err;

      t.is(res.text, FLAG);
      t.end();
    })
  }, 500)
})

test.cb('extend key is function, value is function', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false
  };

  const router = new Router(opt);
  const server = app.listen();

  const FLAG = 'test function';

  function get() {
    return ['get', '/pets'];
  }

  router.extend(get, (schema)=> {
    schema['x-oai-test'] = {
      value: FLAG
    }

    return schema;
  })

  router.use('x-oai-test', (opts)=> {
    return (ctx, next)=> {
      ctx.response.body = FLAG;
    };
  })

  app.use(bodyParser());
  app.use(router.routes());

  setTimeout(()=> {
    request(server)
    .get('/v1/api/pets')
    .query({page: 12})
    .expect(200)
    .end((err, res)=> {
      if (err) throw err;

      t.is(res.text, FLAG);
      t.end();
    })
  }, 500)
})

test.cb('extend key is string, value is object', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false
  };

  const router = new Router(opt);
  const server = app.listen();

  const FLAG = 'test string';

  router.extend('get /pets', {'x-oai-test': {value: FLAG}})

  router.use('x-oai-test', (opts)=> {
    return (ctx, next)=> {
      ctx.response.body = FLAG;
    };
  })

  app.use(bodyParser());
  app.use(router.routes());

  setTimeout(()=> {
    request(server)
    .get('/v1/api/pets')
    .query({page: 12})
    .expect(200)
    .end((err, res)=> {
      if (err) throw err;

      t.is(res.text, FLAG);
      t.end();
    })
  }, 500)
})

test.cb('extend key is object, value is object', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false
  };

  const router = new Router(opt);
  const server = app.listen();

  const FLAG = 'test object';

  router.extend('get /pets', {'x-oai-test': {value: FLAG}})

  router.use('x-oai-test', (opts)=> {
    return (ctx, next)=> {
      ctx.response.body = FLAG;
    };
  })

  app.use(bodyParser());
  app.use(router.routes());

  setTimeout(()=> {
    request(server)
    .get('/v1/api/pets')
    .query({page: 12})
    .expect(200)
    .end((err, res)=> {
      if (err) throw err;

      t.is(res.text, FLAG);
      t.end();
    })
  }, 500)
})

test.cb('extend key is array, value is object', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false
  };

  const router = new Router(opt);
  const server = app.listen();

  const FLAG = 'test array';

  router.extend('get /pets', {'x-oai-test': {value: FLAG}})

  router.use('x-oai-test', (opts)=> {
    return (ctx, next)=> {
      ctx.response.body = FLAG;
    };
  })

  app.use(bodyParser());
  app.use(router.routes());

  setTimeout(()=> {
    request(server)
    .get('/v1/api/pets')
    .query({page: 12})
    .expect(200)
    .end((err, res)=> {
      if (err) throw err;

      t.is(res.text, FLAG);
      t.end();
    })
  }, 500)
})

test.cb('extend key is function, value is object', t => {
  const app = new Koa();
  const opt = {
    apiDoc: `${__dirname}/fixtures/api/api.yaml`,
    controllerDir: `${__dirname}/fixtures/controller`,
    apiExplorerVisible: false
  };

  const router = new Router(opt);
  const server = app.listen();

  const FLAG = 'test function';

  function get() {
    return ['get', '/pets'];
  }

  router.extend('get /pets', {'x-oai-test': {value: FLAG}})

  router.use('x-oai-test', (opts)=> {
    return (ctx, next)=> {
      ctx.response.body = FLAG;
    };
  })

  app.use(bodyParser());
  app.use(router.routes());

  setTimeout(()=> {
    request(server)
    .get('/v1/api/pets')
    .query({page: 12})
    .expect(200)
    .end((err, res)=> {
      if (err) throw err;

      t.is(res.text, FLAG);
      t.end();
    })
  }, 500)
})
