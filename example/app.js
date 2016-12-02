var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var logger = require('koa-logger');

var Router = require('../').default;

var app = new Koa();

app.use(bodyParser());
app.use(logger());

var server = app.listen();

var opt = {
  apiDoc: './example/api/example.yaml',
  controllerDir: './example/controller',
  server: server,
  versioning: true
};

var swagger = new Router(opt);
app.use(swagger.routes());
app.use(swagger.apiExplorer());
