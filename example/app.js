const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');

const Router = require('../dist/oai-router');

const app = new Koa();

app.use(bodyParser());
app.use(logger());

const server = app.listen(9000);

const opt = {
  apiDoc: './example/api/petstore.yaml',
  controllerDir: './example/controller',
  server,
  versioning: false,
};

const router = new Router(opt);

app.use(router.routes());
app.use(router.apiExplorer());
app.use(router.apiExplorerV3());
