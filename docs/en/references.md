<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

* [Router](#router)
	* [new Router(options)](#new-routeroptions)
	* [router.mount(Plugin)](#routermountplugin)
	* [router.get|put|post|patch|delete|del](#routergetputpostpatchdeletedel)
	* [router.routes()](#routerroutes)
	* [router.use([path], middleware)](#routerusepath-middleware)
	* [router.allowedMethods([options])](#routerallowedmethodsoptions)
	* [router.redirect(source, destination, [code])](#routerredirectsource-destination-code)
	* [router.route(name)](#routerroutename)
	* [router.url(name, params, [options])](#routerurlname-params-options)
	* [router.param(param, middleware)](#routerparamparam-middleware)
	* [Router.url(path, params)](#routerurlpath-params)
* [Plugin](#plugin)
	* [new Plugin(options)](#new-pluginoptions)

<!-- /code_chunk_output -->

[router-verbs]: https://github.com/alexmingoia/koa-router#routergetputpostpatchdeletedel--router
[router-routes]: https://github.com/alexmingoia/koa-router#routerroutes--function
[router-use]: https://github.com/alexmingoia/koa-router#routerusepath-middleware--router
[router-allowmethods]: https://github.com/alexmingoia/koa-router#routerallowedmethodsoptions--function
[router-redirect]: https://github.com/alexmingoia/koa-router#routerredirectsource-destination-code--router
[router-route]: https://github.com/alexmingoia/koa-router#routerroutename--layer--false
[router-url]: https://github.com/alexmingoia/koa-router#routerurlname-params-options--string--error
[router-param]: https://github.com/alexmingoia/koa-router#routerparamparam-middleware--router
[Router-url]: https://github.com/alexmingoia/koa-router#routerurlpath-params--string
[oai-fields]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#fixed-fields-5

# Router
Inherited from [koa-router](https://github.com/alexmingoia/koa-router), in addition to that the `prefix` option is not supported temporarily, to maintain other original function, features and performance. And some new features added.

## new Router(options)

* `options` {object} configuration options. Can have the following fields:
  * `apiDoc` {string} `required` api document or document directory. When the api document is directory, it will load other files in the directory automatically.
  * `apiExplorerVisible` {boolean} `optional` enable `api-explorer`. default `true`.
  * `options` {object} `optional` plugin options. `key` is plugin name, `value` is plugin arguments.

`apiDoc` document can be yaml or json format. When `apiDoc` is a directory, the contents of each api file description directory will be merged into the OpenAPI protocol file. The contents of `/project/paths` will be loaded into the `paths` field of the document, the contents of `/project/definitions` will be loaded into the document's `definitions` field, and the other folders will not be loaded.

api document directory structure is as follows:
* `project`
  * `api.yaml`
  * `paths`
  * `definitions`
  * `parameters`
  * `responses`
  * `securityDefinitions`
  * `security`
  * `tags`
  * `externalDocs`

There is no need to use any plugins if you only want to use the basic functionality of the router and `api-explorer`. You just need to configure ` apiDoc` and `apiExplorerVisible`. route and middleware need to be bound manually. Here is the code:
```js
const Koa = require('koa');
const Router = require('koa-oai-router');

const app = new Koa();

const router = new Router({
  apiDoc: './api',
  apiExplorerVisible: true,
});

// Manually mount /hello with business middleware
router.get('/hello', (ctx, next) => {
  ctx.response.body = 'world';
});

app.use(router.routes());

app.listen(3000);
```

## router.mount(Plugin)
Mount the plugin to the router, the plugin will be executed with order of mount.
If one of the plugins does not evoke next(), execution of the subsequent plugin chain will be terminated.

## router.get|put|post|patch|delete|del
Same as koa-router: [router.get|put|post|patch|delete|del][router-verbs]

## router.routes()
Same as koa-router: [router.routes()][router-routes]

## router.use([path], middleware)
Same as koa-router: [router.use([path], middleware)][router-use]

## router.allowedMethods([options])
Same as koa-router: [router.allowedMethods([options])][router-allowmethods]

## router.redirect(source, destination, [code])
Same as koa-router: [router.redirect(source, destination, [code])][router-redirect]

## router.route(name)
Same as koa-router: [router.route(name)][router-route]

## router.url(name, params, [options])
Same as koa-router: [router.url(name, params, [options])][router-url]

## router.param(param, middleware)
Same as koa-router: [router.param(param, middleware)][router-param]

## Router.url(path, params)
Same as koa-router: [Router.url(path, params)][Router-url]


# Plugin
Plugins can be applied to every api as koa middleware.
Its activation depends on whether the api document contains its activation `field`. Once the plugin is activated, `middlewareWrapper` will be invoked internally and passed in the `(middlewareOpts, middlewareArgs)` parameter and must return a koa middleware that will be mounted on the current api.

## new Plugin(options)
Create a plugin.

* `options` {object} Plugin configuration options. Can have the following fields:
  * `name` {string} `required` The name of the plugin. Configure the plugin parameters in the router options as the key.
  * `field` {string|string[]} `required` Activate field. The plugin is activated when this field is included in the API document. Field range reference [Operation Object][oai-fields].
  * `middlewareWrapper` {object} `required` Plugin logic module, you must return a koa middleware.
  * `middlewareArgs` {object} `optional` Plugin global options.

`middlewareWrapper` Must return a koa middleware, there (middlewareOpts, middlewareArgs) Parameters:
* `middlewareOpts` {object} Information about the current interface document fragment when the plug-in is activated.
  * `endpoint` {string} ednpoint
  * `field` {string} the keyword when activated
  * `fieldValue` {object} The data corresponding to the keyword when it is activated
  * `operation` {string} http method
  * `operationValue` {object} api's meta data
* `middlewareArgs` {any} Plugin global options.

`middlewareArgs` can be configured when creating a router and the configuration of this method will have the highest priority.
```js
const plugin = new PluginXXX({
  name: 'pluginXXX',
  field: 'parameters',
  // middlewareArgs: pluginArgs,
  middlewareWrapper: () => {
    return (ctx, next) => {return next();};
  },
});

const router = new Router({
  apiDoc: './api',
  options: {
    pluginXXX: pluginArgs,
  }
});

router.mount(plugin);
```

`middlewareArgs` it can also be configured when creating a plugin, and the method's configuration will have the lowest priority.

```js
const plugin = new PluginXXX({
  name: 'pluginXXX',
  field: 'parameters',
  middlewareArgs: pluginArgs,
  middlewareWrapper: () => {
    return (ctx, next) => {return next();};
  },
});

const router = new Router({
  apiDoc: './api',
});

router.mount(plugin);
```
