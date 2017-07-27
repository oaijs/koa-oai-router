import views from 'koa-views-swagger';
import mount from 'koa-mount';
import statics from 'koa-static';
import compose from 'koa-compose';
import path from 'path';
import Debug from 'debug';

const debug = Debug('koa-oai-router:explorer');

export default class SwaggerExplorer {
  constructor(options) {
    options.apiExplorerPath = `${options.apiExplorerPath}`;
    options.apiExplorerStaticPath = `${options.apiExplorerStaticPath}`;
    options.apiExplorerLink = `${options.apiExplorerLink}`;

    if (!options.apiExplorerVisible) return (ctx, next) => { return next(); };

    debug('render api-explorer', options);
    console.log(`ApiExplorer: http://127.0.0.1:${options.port}${options.apiExplorerPath}`);

    const swaggerUiDist = path.dirname(require.resolve('koa-oai-router-swagger-ui-dist'));

    return compose([
      views(swaggerUiDist, {map: {html: 'mustache'}, renderName: 'renderSwagger'}),
      mount(options.apiExplorerStaticPath, statics(path.dirname(options.apiDoc))),
      mount(options.apiExplorerStaticPath, statics(swaggerUiDist)),
      mount(options.apiExplorerPath, async (ctx, next) => {
        options.apiDoc = path.basename(options.apiDoc);
        await ctx.renderSwagger('index.html', options);
      }),
    ]);
  }
}

