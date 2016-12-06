var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var logger = require('koa-logger');

var Router = require('../').default;

var app = new Koa();

app.use(bodyParser());
app.use(logger());

var server = app.listen(9000);

var opt = {
  apiDoc: './example/api/example.yaml',
  controllerDir: './example/controller',
  server: server,
  versioning: true
};

var router = new Router(opt);

router.use('x-oai-cache', (options)=> {
  return (ctx, next)=> {
    console.log('x-oai-cache0', options, ctx.request.query, ctx.request.body);
    return next()
    .then((data)=>{
      console.log('x-oai-cache1', options, ctx.body);
    })
  }
});

app.use(router.routes());
app.use(router.apiExplorer());
