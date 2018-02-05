<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

* [Router](#router)
	* [new Router(options)](#new-routeroptions)
	* [router.mount(Plugin, pluginArgs)](#routermountplugin-pluginargs)
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
	* [constructor(args)](#constructorargs)
	* [init()](#init)
	* [before(docOpts)](#beforedocopts)
	* [handler(docOpts)](#handlerdocopts)
	* [after(docOpts)](#afterdocopts)

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

## router.mount(Plugin, pluginArgs)
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
Its activation depends on whether the api document contains its activation `field`. Once the plugin is activated, `handler` will be invoked internally and passed in the `(docOpts)` parameter and must return a koa middleware that will be mounted on the current api.


`pluginArgs` can be configured when creating a router and the configuration of this method will have the highest priority.
```js
class PluginX extends Plugin {
  constructor() {
    super();

    this.pluginName = 'tags';
    this.field = 'tags';
    this.after = undefined;
  }
  handler({ fieldValue }) {
    return (ctx, next) => {
      // what do you want to do.
    };
  }
}

// PluginName and Plugin class name both can be config for arguments
const router = new Router({
  apiDoc: './api',
  options: {
    PluginX: pluginArgs,
    // OR
    tags: pluginArgs
  }
});

router.mount(PluginX);
```

`pluginArgs` it can also be configured when creating a plugin, and the method's configuration will have the lowest priority.
```js
class PluginX extends Plugin {
  constructor() {
    super();

    this.pluginName = 'tags';
    this.field = 'tags';
    this.after = undefined;
  }
  handler({ fieldValue }) {
    return (ctx, next) => {
      // what do you want to do.
    };
  }
}

const router = new Router({
  apiDoc: './api',
});

router.mount(plugin, pluginArgs);
```


## constructor(args)
Must set these properties in constructor: `pluginName`, `field`, `args`.
* `pluginName` `string` `required` name of plugin
* `fields` `string|string[]` `required` invoked fields
* `args` `any` `optional` args of plugin

## init()
Called when plugin is initializing and called before `before`. Only called once, suit for prepare works.

`optional` implemented

## before(docOpts)
Previous works for plugin, called before `handler`.

`optional` implemented

* `docOpts` {object} Information about the current interface document fragment when the plug-in is activated.
  * `endpoint` {string} ednpoint
  * `field` {string} the keyword when activated
  * `fieldValue` {object} The data corresponding to the keyword when it is activated
  * `operation` {string} http method
  * `operationValue` {object} api's meta data

## handler(docOpts)
Main works for plugin.

`required` implemented, must return a koa middleware function, eg: `function(ctx, next) {}`.

* `docOpts` {object} Information about the current interface document fragment when the plug-in is activated.
  * `endpoint` {string} ednpoint
  * `field` {string} the keyword when activated
  * `fieldValue` {object} The data corresponding to the keyword when it is activated
  * `operation` {string} http method
  * `operationValue` {object} api's meta data

## after(docOpts)
Post works for plugin, called after `handler`.

`optional` implemented

* `docOpts` {object} Information about the current interface document fragment when the plug-in is activated.
  * `endpoint` {string} ednpoint
  * `field` {string} the keyword when activated
  * `fieldValue` {object} The data corresponding to the keyword when it is activated
  * `operation` {string} http method
  * `operationValue` {object} api's meta data
