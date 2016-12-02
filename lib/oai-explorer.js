import views from 'koa-views-swagger';
import mount from 'koa-mount';
import statics from 'koa-static';
import compose from 'koa-compose';
import path from 'path';
import Debug from 'debug';

const debug = Debug('koa-oai-router:explorer');

export default class SwaggerExplorer {
  constructor(options) {
    if (!options.apiExplorerVisible)
      return (ctx, next) => {return next();};

    debug('render api-explorer', options);
    console.log(`ApiExplorer: http://127.0.0.1:${options.port}${options.apiExplorerPath}`);

    return compose([
      views(`${__dirname}/swagger-ui`, {map: {html: 'mustache'}}),
      mount(options.apiExplorerStaticsPath, statics(path.dirname(options.apiDoc))),
      mount(options.apiExplorerStaticsPath, statics(`${__dirname}/swagger-ui`)),
      mount(options.apiExplorerPath, async (ctx, next) => {
        options.apiDoc = path.basename(options.apiDoc);
        await ctx.renderSwaggerApiExplorer('index', options);
      })
    ]);
  }
}

