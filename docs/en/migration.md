<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

* [Changes in 2.0](#changes-in-20)
	* [Remove the option controllerDir](#remove-the-option-controllerdir)
	* [Remove the option port](#remove-the-option-port)
	* [Remove the option server](#remove-the-option-server)
	* [Remove the option versioning](#remove-the-option-versioning)
	* [Remove the option apiExplorerPath](#remove-the-option-apiexplorerpath)
	* [Remove the option apiExplorerStaticPath](#remove-the-option-apiexplorerstaticpath)
	* [Remove the option validator](#remove-the-option-validator)
	* [Remove the option jsonSchemaFormatters](#remove-the-option-jsonschemaformatters)
	* [Remove the option errorHandler](#remove-the-option-errorhandler)
	* [Remove the option defaultResponseSchemas](#remove-the-option-defaultresponseschemas)
	* [Remove function router.apiExplorer()](#remove-function-routerapiexplorer)
	* [Remove function router.apiExplorerV3()](#remove-function-routerapiexplorerv3)
	* [Remove function router.use(keyword, fn)](#remove-function-routerusekeyword-fn)
	* [Remove function router.extend(endpoint, fn)](#remove-function-routerextendendpoint-fn)

<!-- /code_chunk_output -->

[koa-router]: https://github.com/alexmingoia/koa-router
[oai-router-middleware]: https://github.com/oaijs/koa-oai-router-middleware
[oai-router-parameters]: https://github.com/oaijs/koa-oai-router-parameters
[oai-router-responses]: https://github.com/oaijs/koa-oai-router-responses
[oai-router-correction]: https://github.com/oaijs/koa-oai-router-correction
[oai-router-cache]: https://github.com/oaijs/koa-oai-router-cache
[oai-router-rbac]: https://github.com/oaijs/koa-oai-router-rbac
[references-plugin]: ./references.md#plugin

# Changes in 2.0
Sorry, 1.x can not be easily upgraded to 2.0 for the sake of simplicity, elegance, maintainability, and extendibility. I want to build a good project, to solve some of the problems we actually encounter better.

If you are using the following features, please migrate as the document says.

## Remove the option controllerDir
Middleware loader is no longer built-in, supported by [koa-oai-router-middleware][oai-router-middleware]. Please refer to the following code:
```js
const Koa = require('koa');
const Router = require('koa-oai-router');
const middleware = require('koa-oai-router-middleware');

const app = new Koa();

const router = new Router({
  apiDoc: './api',
  options: {
    // Attention: `middleware` is name of plugin(defined by the plugin author)，`./controllers` is controllerDir
    // The key-value pairs in options pass the plug-in parameters to the plug-in based on the plug-in name when the plug-in is called.
    middleware: './controllers',
  },
});

router.mount(middleware());

app.use(router.routes());

app.listen(3000);
```
Or
```js
const Koa = require('koa');
const Router = require('koa-oai-router');
const middleware = require('koa-oai-router-middleware');

const app = new Koa();

const router = new Router({
  apiDoc: './api',
});

// Attention: Configure the middleware directory when the plug-in is mounted
router.mount(middleware('./controllers'));

app.use(router.routes());

app.listen(3000);
```

## Remove the option port
No longer output api-explorer visit address on console, visit: `http://{ip}:{port}/api-explorer`

## Remove the option server
No longer output api-explorer visit address on console, visit: `http://{ip}:{port}/api-explorer`

## Remove the option versioning
Disabled, It can be implemented by the API description `basePath`. api doc：
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

## Remove the option apiExplorerPath
No longer provide customized api-explorer path function, visit: `http://{ip}:{port}/api-explorer`

## Remove the option apiExplorerStaticPath
No longer supported.

## Remove the option validator
Form validation is no longer built-in, supported by [koa-oai-router-parameters][oai-router-parameters].

## Remove the option jsonSchemaFormatters
Form validation `JSON-Schema formatters` configuration features, supported by [koa-oai-router-parameters][oai-router-parameters].

## Remove the option errorHandler
Error handler is no longer built-in, supported by [koa-oai-router-responses][oai-router-responses].

## Remove the option defaultResponseSchemas
Error handler `Response Schemas` configuration features is no longer built-in, supported by [koa-oai-router-responses][oai-router-responses].

## Remove function router.apiExplorer()
No longer supported swagger-ui 2.x `api-explorer`.
There is no need to mount, it can be control by `apiExplorerVisible`.

## Remove function router.apiExplorerV3()
There is no need to mount, it can be control by `apiExplorerVisible`.

## Remove function router.use(keyword, fn)
Please use the new way to mount [Plugin][references-plugin], if the plugin is not supported, please give me an issue.

## Remove function router.extend(endpoint, fn)
No longer supported.
