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

继承自[koa-router](https://github.com/alexmingoia/koa-router)，除了`prefix`选项暂时不支持外，保持其他原功能、特性、性能。在此之外增加一些新功能。

## new Router(options)

* `options` {object} 路由的配置选项。有以下字段：
  * `apiDoc` {string} `必须` api文档或者文档目录。当为api文档目录时，会自动加载目录内的其他文件。
  * `apiExplorerVisible` {boolean} `可选` 是否启用`api-explorer`。默认为`true`。
  * `options` {object} `可选` 插件的选项，也可以在插件使用时配置。`key`是插件的名称，`value`是插件的参数。

`apiDoc`描述文档可以是yaml或者json格式。当`apiDoc`是目录时，各个api文档描述目录中的内容将被合并之后加载到OpenAPI协议文档中。`/project/paths`中的内容将被加载到文档的`paths`字段下，`/project/definitions`中的内容将被加载到文档的`definitions`字段下，其他文件夹不会被加载。

api文档描述目录结构如下：
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


如果你只想使用router的基础功能和`api-explorer`，那么你可以不使用任何插件，只需要配置`apiDoc`和`apiExplorerVisible`即可。服务的路由和业务中间件需要由你手动来绑定。代码如下：
```js
const Koa = require('koa');
const Router = require('koa-oai-router');

const app = new Koa();

const router = new Router({
  apiDoc: './api',
  apiExplorerVisible: true,
});

// 手动挂载/hello路由与业务中间件
router.get('/hello', (ctx, next) => {
  ctx.response.body = 'world';
});

app.use(router.routes());

app.listen(3000);
```

## router.mount(Plugin, pluginArgs)
将插件挂载到router上，先挂载的插件先被执行。如果其中一个插件未唤起next()，那么后续插件链的执行将被结束。

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
插件是可以应用在每一个接口上的koa中间。
它的激活取决于该接口描述文档中是否包含它的`激活字段(field)`。一旦插件被激活，那么`handler`将在内部被调用，并传入`(docOpts)`参数，且必须返回一个koa中间件，该中间件将被挂载到当前接口上。


`pluginArgs`可以在创建router时配置，本方法的配置将拥有最高优先级。
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

`pluginArgs`也可以在创建插件时配置，本方法的配置将拥有最低的优先级。
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
在构造函数请设置参数：`pluginName`, `field`, `args`。
* `pluginName` `string` `optional` 插件名称，用于配置插件参数。如果不设置默认使用插件类名称。
* `fields` `string|string[]` `required` 插件的激活字段
* `args` `any` `optional` 插件的参数

## init()
在插件初始化时调用，在`before`之前。插件生命周期中只执行一次，适合做一些插件启动工作。

`可选`实现

## before(docOpts)
插件的前置业务逻辑，在`handler`之前执行，

`可选`实现

* `docOpts` {object} 插件被激活时当前接口文档片段的信息。
  * `endpoint` {string} 接口的路径
  * `field` {string} 被激活时的关键字
  * `fieldValue` {object} 被激活时的关键字对应的数据
  * `operation` {string} 接口的方法
  * `operationValue` {object} 接口的描述信息

## handler(docOpts)
插件的主要业务逻辑。

`必须`实现，且要求返回koa中间件，形如：`function(ctx, next) {}`。

* `docOpts` {object} 插件被激活时当前接口文档片段的信息。
  * `endpoint` {string} 接口的路径
  * `field` {string} 被激活时的关键字
  * `fieldValue` {object} 被激活时的关键字对应的数据
  * `operation` {string} 接口的方法
  * `operationValue` {object} 接口的描述信息

## after(docOpts)
插件的后置业务逻辑，在`handler`之后执行，

`可选`实现

* `docOpts` {object} 插件被激活时当前接口文档片段的信息。
  * `endpoint` {string} 接口的路径
  * `field` {string} 被激活时的关键字
  * `fieldValue` {object} 被激活时的关键字对应的数据
  * `operation` {string} 接口的方法
  * `operationValue` {object} 接口的描述信息
