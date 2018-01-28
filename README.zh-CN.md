# Koa-OAI-Router

[![License][license-img]][license-url]
[![NPM Version][npm-img]][npm-url]
[![Node Version][node-image]][node-url]
[![Build Status][travis-img]][travis-url]
[![Test Coverage][coveralls-img]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-img]][david-url]

[travis-img]: https://travis-ci.org/BiteBit/koa-oai-router.svg?branch=master
[travis-url]: https://travis-ci.org/BiteBit/koa-oai-router
[coveralls-img]: https://coveralls.io/repos/github/BiteBit/koa-oai-router/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/BiteBit/koa-oai-router?branch=master
[npm-img]: https://img.shields.io/npm/v/koa-oai-router.svg
[npm-url]: https://npmjs.org/package/koa-oai-router
[david-img]: https://img.shields.io/david/BiteBit/koa-oai-router.svg
[david-url]: https://david-dm.org/BiteBit/koa-oai-router
[downloads-image]: https://img.shields.io/npm/dm/koa-oai-router.svg
[downloads-url]: https://npmjs.org/package/koa-oai-router
[license-img]: http://img.shields.io/badge/license-MIT-green.svg
[license-url]: http://opensource.org/licenses/MIT
[node-image]: https://img.shields.io/badge/node.js-v4.0.0-blue.svg
[node-url]: http://nodejs.org/download/
[koa-router]: https://github.com/alexmingoia/koa-router
[oai]: https://github.com/OAI/OpenAPI-Specification
[swagger]: http://swagger.io
[swagger-ui]: http://swagger.io/swagger-ui
[jsonschema]: http://json-schema.org
[oai-paths]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#pathsObject
[oai-definitions]: https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#definitionsObject
[oai-router-middleware]: https://github.com/oaijs/koa-oai-router-middleware
[oai-router-parameters]: https://github.com/oaijs/koa-oai-router-parameters
[oai-router-responses]: https://github.com/oaijs/koa-oai-router-responses
[oai-router-correction]: https://github.com/oaijs/koa-oai-router-correction
[oai-router-cache]: https://github.com/oaijs/koa-oai-router-cache
[oai-router-rbac]: https://github.com/oaijs/koa-oai-router-rbac
[oai-router-examples]: https://github.com/oaijs/koa-oai-router-examples
[migration]: ./docs/zh/migration.md
[usage-guides]: ./docs/zh/usage-guides.md
[references]: ./docs/zh/references.md
[api-explorer-img]: ./docs/api-explorer.png?raw=true

[中文](./README.zh-CN.md)    [English](./README.md)

我使用过Markdown，Wiki管理接口文档，过程实在难以称得上美好，工作量巨大并且十分无趣。接口的变更需要维护相关文档；接口无法方便地进行调试、测试；以及接口的管理完全依赖于人。这些问题不仅导致接口文档难以维持很高的质量，而且还会让开发人员花费更多的时间在接口调试上，甚至影响项目进度。最最最重要的是，这可能会影响到我们的心情，这可是无法忍受的事情 : (

于是乎我便四处寻求解决方案，功夫不负有心人。我发现了[OpenAPI Specification][oai]，并且OpenAPI协议生态圈也很完善。[Swagger][swagger] 包含了很多工具链，[Swagger UI][swagger-ui]可以自动根据协议文件生成接口文档。而OpenAPI中的数据类型和数据模型是基于[JSON-Schema Draft 4][jsonschema]。

希望此库可以帮到有同样需求的你，happy coding。

*哦，对了，PR & Issue & Star are welcome! : )*

---

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

* [Koa-OAI-Router](#koa-oai-router)
* [特性](#特性)
* [迁移](#迁移)
* [安装](#安装)
* [快速入门](#快速入门)
	* [编写WEB服务](#编写web服务)
	* [编写业务中间件](#编写业务中间件)
	* [编写Api描述文档](#编写api描述文档)
		* [编写基础信息](#编写基础信息)
		* [编写`paths`信息](#编写paths信息)
		* [编写`definitions`信息](#编写definitions信息)
	* [体验api-explorer](#体验api-explorer)
* [文档](#文档)
* [生态](#生态)
* [计划](#计划)

<!-- /code_chunk_output -->

---

# 特性
* 内置Swagger-UI，方便查看、调试接口
* 支持OpenAPI/Swagger2.0规范，支持json、yaml格式
* 支持更友好、方便的API文档切分方案
* 支持自定义插件（中间件加载、表单校验、响应处理、错误处理等将以插件形式提供）
* 继承自[Koa-Router][koa-router]，保持原功能、特性，性能。

# 迁移
如果你不是1.x的用户，请直接跳过本部分内容。
如果你是1.x的用户并且想升级到2.0版本，很抱歉你将无法傻瓜式的升级到2.0版本，请仔细阅读本部分的内容[Migration][migration]并且按照操作手册升级。

# 安装
```sh
# required koa 2.x
> npm install koa-oai-router --save
```

# 快速入门
下面将带你学习如何使用router构建一个良好组织结构和配备接口文档的Web Server。
本例中基本涉及了router的所有重点内容，包括：
* 配置router
* 配置插件
* 挂载插件到router
* 挂载router到app
* 编写接口描述文档
* 使用插件
* 使用api-explorer

我们的目标是：
* 创建一个REST API Server
* 编写一个pets查询接口，并返回查询到的pets数组
* 编写一个pets新建接口，并返回pet和id
* 生成接口文档，体验api-explorer

下面我们就正式开始喽。

## 编写WEB服务
```javascript
// ./app.js

const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-oai-router');
const middleware = require('koa-oai-router-middleware');

const app = new Koa();

// *配置router - 从api目录下加载接口描述并生成api文档
const router = new Router({
  apiDoc: './api',
});

// *配置插件 - 识别api文档中的x-oai-middleware并从controllers中加载相应的中间件
// *挂载插件到router
router.mount(middleware('./controllers'));

app.use(logger());
app.use(bodyParser());
// *挂载router到app
app.use(router.routes());

app.listen(3000);
```

## 编写业务中间件
创建业务中间件目录`controllers`并编写业务中间件。
```js
// ./controllers/pets.js

const database = [];

// 根据tags查询数据库中的pets，并根据limit限制查询结果。
async function get(ctx, next) {
  const { tags = '', limit = 999 } = ctx.request.query;
  const tagsArray = tags.split(',');
  const docs = [];

  database.forEach((item, idx) => {
    if (tagsArray.indexOf(item.tag) !== -1 && docs.length < limit) {
      item.id = idx + 1;
      docs.push(item);
    }
  });

  ctx.response.body = docs;
}

// 新建一个pet存储到数据库中。
async function post(ctx, next) {
  const body = ctx.request.body;

  database.push(body);

  ctx.response.body = {
    id: database.length,
    name: body.name,
    tag: body.tag,
  };
}

module.exports = {
  get,
  post,
};
```

## 编写Api描述文档
如果你还不了解[OpenAPI][oai]，请仔细阅读[OpenAPI][oai]。

### 编写基础信息
在这里你可以对服务的基础信息进行描述，如服务的版本，基础路径，传输协议，作者，许可协议等。
```yaml
# ./api/api.yaml

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
basePath: /api
schemes:
  - http
consumes:
  - application/json
produces:
  - application/json
```

### 编写`paths`信息
编写api接口描述信息，这里的path是一个相对路径。path会追加在basePath的后面组成一个完成的URL，其他字段描述了接口的详细信息。详情请参考[Paths][oai-paths]。

```yaml
# ./api/paths/pets.yaml

/pets:
  get:
    description: "Returns all pets from the system that the user has access to"
    operationId: "findPets"
    produces:
      - "application/json"
    tags:
      - pets
    x-oai-middleware:
      - file: pets
        handler: get
    parameters:
      - name: "tags"
        in: "query"
        description: "tags to filter by"
        required: false
        type: "array"
        items:
          type: "string"
        collectionFormat: "csv"
      - name: "limit"
        in: "query"
        description: "maximum number of results to return"
        required: false
        type: "integer"
        format: "int32"
    responses:
      "200":
        description: "pet response"
        schema:
          type: "array"
          items:
            $ref: "#/definitions/Pet"
      default:
        description: "unexpected error"
        schema:
          $ref: "#/definitions/ErrorModel"
  post:
    description: "Creates a new pet in the store.  Duplicates are allowed"
    operationId: "addPet"
    produces:
      - "application/json"
    tags:
      - pets
    x-oai-middleware:
      - file: pets
        handler: post
    parameters:
      - name: "pet"
        in: "body"
        description: "Pet to add to the store"
        required: true
        schema:
          $ref: "#/definitions/NewPet"
    responses:
      "200":
        description: "pet response"
        schema:
          $ref: "#/definitions/Pet"
      default:
        description: "unexpected error"
        schema:
          $ref: "#/definitions/ErrorModel"
```

### 编写`definitions`信息
你可以通过definitions定义一些常用的数据模型，这些模型可以很方便地复用在请求参数或者响应结果的定义中，减少文档的“坏味道”。这些数据模型可以是基础数据类型、数组、复杂的JSON对象，详情请参考[Definitions][oai-definitions]。

1.定义接口错误响应数据模型ErrorModel。
```yaml
# ./api/definitions/error.yaml

ErrorModel:
  type: "object"
  required:
    - "code"
    - "message"
  properties:
    code:
      type: "integer"
      format: "int32"
    message:
      type: "string"
```

2.定义查询成功响应数据模型Pet，定义新增请求数据模型NewPet。
```yaml
# ./api/definitions/pets.yaml

Pet:
  type: "object"
  allOf:
    - $ref: "#/definitions/NewPet"
    - required:
        - "id"
      properties:
        id:
          type: "integer"
          format: "int64"

NewPet:
  type: "object"
  required:
    - "name"
  properties:
    name:
      type: "string"
    tag:
      type: "string"
```

## 体验api-explorer
启动WEB服务，测试接口，体验api-explorer。
```bash
> node app.js
>
> curl -X POST "http://localhost:3000/api/pets" -H "Content-Type: application/json" -d "{ \"name\": \"luck\", \"tag\": \"dog\"}"
> {"id":1,"name":"luck","tag":"dog"}
>
> curl -X POST "http://localhost:3000/api/pets" -H "Content-Type: application/json" -d "{ \"name\": \"lily\", \"tag\": \"cat\"}"
> {"id":2,"name":"lily","tag":"cat"}
>
> curl -X POST "http://localhost:3000/api/pets" -H "Content-Type: application/json" -d "{ \"name\": \"mike\", \"tag\": \"dog\"}"
> {"id":3,"name":"mike","tag":"dog"}
>
> curl -X GET "http://localhost:3000/api/pets?tags=cat,dog&limit=2"
> [{"name":"luck","tag":"dog","id":1},{"name":"lily","tag":"cat","id":2}]

```
可以看到，我们编写的业务中间件都已经被正常调用了。
使用浏览器打开**http://localhost:3000/api-explorer**，现在你可以体验api-explorer了。
![Api Explorer][api-explorer-img]

# 文档
* [Usage Guides][usage-guides]
* [References  ][references]
* [Migration   ][migration]
* [Examples    ][oai-router-examples]

# 生态

|名称|描述|状态|
|---|---|---|
|[koa-oai-router-middleware][oai-router-middleware]|业务中间件加载|开发中|
|[koa-oai-router-correction][oai-router-correction]|请求表单预处理|开发中|
|[koa-oai-router-parameters][oai-router-parameters]|请求表单校验|开发中|
|[koa-oai-router-responses][oai-router-responses]|请求结果处理|开发中|
|[koa-oai-router-cache][oai-router-cache]|请求缓存插件|计划中|
|[koa-oai-router-rbac][oai-router-rbac]|请求权限控制|计划中|
|koa-oai-router-mongo|MongoDB REST server|计划中|

# 计划
* 支持OpenAPI 3.x规范
* 更多的插件
* 更多的单元测试
* Benchmark
