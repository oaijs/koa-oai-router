<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

* [2.0变更](#20变更)
	* [去除选项controllerDir](#去除选项controllerdir)
	* [去除选项port](#去除选项port)
	* [去除选项server](#去除选项server)
	* [去除选项versioning](#去除选项versioning)
	* [去除选项apiExplorerPath](#去除选项apiexplorerpath)
	* [去除选项apiExplorerStaticPath](#去除选项apiexplorerstaticpath)
	* [去除选项validator](#去除选项validator)
	* [去除选项jsonSchemaFormatters](#去除选项jsonschemaformatters)
	* [去除选项errorHandler](#去除选项errorhandler)
	* [去除选项defaultResponseSchemas](#去除选项defaultresponseschemas)
	* [去除成员函数router.apiExplorer()](#去除成员函数routerapiexplorer)
	* [去除成员函数router.apiExplorerV3()](#去除成员函数routerapiexplorerv3)
	* [去除成员函数router.use(keyword, fn)](#去除成员函数routerusekeyword-fn)
	* [去除成员函数router.extend(endpoint, fn)](#去除成员函数routerextendendpoint-fn)

<!-- /code_chunk_output -->

[koa-router]: https://github.com/alexmingoia/koa-router
[oai-router-middleware]: https://github.com/oaijs/koa-oai-router-middleware
[oai-router-parameters]: https://github.com/oaijs/koa-oai-router-parameters
[oai-router-responses]: https://github.com/oaijs/koa-oai-router-responses
[oai-router-correction]: https://github.com/oaijs/koa-oai-router-correction
[oai-router-cache]: https://github.com/oaijs/koa-oai-router-cache
[oai-router-rbac]: https://github.com/oaijs/koa-oai-router-rbac
[references-plugin]: ./references.md#plugin

# 2.0变更
很抱歉，为了项目的简洁、优雅、可维护、可扩展的目的，1.x无法简单升级到2.0。我想构建一个优秀的项目，更好的解决我们实际中遇到的一些问题。

如果你有使用到以下变更项，请按照文档变更。

## 去除选项controllerDir
加载中间件的功能不再内置，由插件[koa-oai-router-middleware][oai-router-middleware]实现。请参考以下代码：
```js
const Koa = require('koa');
const Router = require('koa-oai-router');
const middleware = require('koa-oai-router-middleware');

const app = new Koa();

const router = new Router({
  apiDoc: './api',
  options: {
    // 划重点：`middleware`是插件的名称（由插件作者定义），`./controllers`是controllerDir目录
    // options中的键值对将会在调用插件时根据插件名称将插件参数传递给插件。
    middleware: './controllers',
  },
});

router.mount(middleware());

app.use(router.routes());

app.listen(3000);
```
或者
```js
const Koa = require('koa');
const Router = require('koa-oai-router');
const middleware = require('koa-oai-router-middleware');

const app = new Koa();

const router = new Router({
  apiDoc: './api',
});

// 划重点：在插件挂载时配置中间件目录
router.mount(middleware('./controllers'));

app.use(router.routes());

app.listen(3000);
```

## 去除选项port
不再控制台提示api-explorer访问地址，请访问：`http://{ip}:{port}/api-explorer`

## 去除选项server
不再控制台提示api-explorer访问地址，请访问：`http://{ip}:{port}/api-explorer`

## 去除选项versioning
接口版本化不再提供，可由api描述文档`basePath`配置实现。如下api描述文档：
```yaml
swagger: '2.0'
info:
  version: 1.0.0
  title: Swagger Petstore
  description: >-
    A sample API that uses a petstore as an example to demonstrate features in
    the swagger-2.0 specification
  termsOfService: 'http://swagger.io/terms/'
  contact:
    name: Swagger API Team
  license:
    name: MIT
basePath: /v1/api
...
...
```

## 去除选项apiExplorerPath
不再提供定制化api-explorer路径的功能，请访问：`http://{ip}:{port}/api-explorer`

## 去除选项apiExplorerStaticPath
不再提供定制化api-explorer静态资源路径的功能。

## 去除选项validator
表单校验功能不再内置，由插件[koa-oai-router-parameters][oai-router-parameters]实现。

## 去除选项jsonSchemaFormatters
表单校验的JSON-Schema formatters配置功能，由插件[koa-oai-router-parameters][oai-router-parameters]实现。

## 去除选项errorHandler
错误处理功能不再内置，由插件[koa-oai-router-responses][oai-router-responses]实现。

## 去除选项defaultResponseSchemas
错误处理的默认Response Schemas配置功能，由插件[koa-oai-router-responses][oai-router-responses]实现。

## 去除成员函数router.apiExplorer()
不再提供swagger-ui 2.x版本的`api-explorer`。
使用`api-explorer`不再需要额外挂载到app上，由`apiExplorerVisible`实现控制。

## 去除成员函数router.apiExplorerV3()
使用`api-explorer`不再需要额外挂载到app上，由`apiExplorerVisible`实现控制。

## 去除成员函数router.use(keyword, fn)
请使用新的方式挂载插件[Plugin][references-plugin]，如果你使用的插件并未得到支持，请提需求。

## 去除成员函数router.extend(endpoint, fn)
不再提供。
