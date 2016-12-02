# Koa-OAI-Router

[![License][license-img]][license-url]
[![NPM Version][npm-img]][npm-url]
[![Node Version][node-image]][node-url]
[![Build Status][travis-img]][travis-url]
[![Test Coverage][coveralls-img]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-img]][david-url]

[![NPM](https://nodei.co/npm/koa-oai-router.png?downloads=true&stars=true)](https://nodei.co/npm/koa-oai-router/)

[travis-img]: https://travis-ci.org/BiteBit/koa-oai-router.svg?branch=new
[travis-url]: https://travis-ci.org/BiteBit/koa-oai-router
[coveralls-img]: https://coveralls.io/repos/github/BiteBit/koa-oai-router/badge.svg?branch=new
[coveralls-url]: https://coveralls.io/github/BiteBit/koa-oai-router?branch=new
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

[中文](./README.zh-CN.md)    [English](./README.md)

我使用过Markdown，Wiki管理接口文档，过程实在难以称得上美好，工作量巨大并且十分无趣。接口的变更需要维护相关文档；接口无法方便地进行调试、测试；以及接口的管理完全依赖于人。这些问题不仅导致接口文档难以维持很高的质量，而且还会让开发人员花费更多的时间在接口调试上，甚至影响项目进度。最最最重要的是，这可能会影响到我们的心情，这可是无法忍受的事情 : ( 。

于是乎我便四处寻求解决方案，功夫不负有心人。我发现了[The OpenAPI Specification](https://github.com/OAI/OpenAPI-Specification)，并且OpenAPI协议生态圈也很完善。[Swagger](http://swagger.io/) 包含了很多工具链，[Swagger UI](http://swagger.io/swagger-ui/)可以自动根据协议文件生成接口文档。而OpenAPI中的数据类型和数据模型是基于[JSON-Schema Draft 4](http://json-schema.org/latest/json-schema-core.html#anchor8)。

希望此库可以帮到有同样需求的你，happy coding。

*哦，对了，PR & Issue & Star are welcome! : )*

**<u>注意：目前仍然处于测试阶段，生产环境谨慎使用！！！</u>**

---

- [Koa-OAI-Router](#koa-oai-router)
- [特性](#%E7%89%B9%E6%80%A7)
- [安装](#%E5%AE%89%E8%A3%85)
- [快速上手](#%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B)
  - [新建API描述文档](#%E6%96%B0%E5%BB%BAapi%E6%8F%8F%E8%BF%B0%E6%96%87%E6%A1%A3)
  - [新建控制器](#%E6%96%B0%E5%BB%BA%E6%8E%A7%E5%88%B6%E5%99%A8)
  - [新建koa app](#%E6%96%B0%E5%BB%BAkoa-app)
  - [使用api-explorer](#%E4%BD%BF%E7%94%A8api-explorer)
- [使用说明](#%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)
  - [Router的参数](#router%E7%9A%84%E5%8F%82%E6%95%B0)
    - [apiDoc](#apidoc)
    - [controllerDir](#controllerdir)
    - [port](#port)
    - [server](#server)
    - [versioning](#versioning)
    - [apiExplorerVisible](#apiexplorervisible)
    - [apiExplorerPath](#apiexplorerpath)
    - [apiExplorerStaticsPath](#apiexplorerstaticspath)
    - [jsonSchemaFormatters](#jsonschemaformatters)
    - [errorHandler](#errorhandler)
  - [接口的控制器](#%E6%8E%A5%E5%8F%A3%E7%9A%84%E6%8E%A7%E5%88%B6%E5%99%A8)
    - [file](#file)
    - [handler](#handler)
  - [参数校验](#%E5%8F%82%E6%95%B0%E6%A0%A1%E9%AA%8C)
    - [header](#header)
    - [path](#path)
    - [query(formData)](#queryformdata)
    - [body](#body)
  - [结果校验（暂不支持）](#%E7%BB%93%E6%9E%9C%E6%A0%A1%E9%AA%8C%E6%9A%82%E4%B8%8D%E6%94%AF%E6%8C%81)
  - [错误处理](#%E9%94%99%E8%AF%AF%E5%A4%84%E7%90%86)
- [计划](#%E8%AE%A1%E5%88%92)

---

# 特性
* 内置Swagger-UI，方便查看、调试接口
* 使用OpenAPI/Swagger API文档自动生成Koa路由，并支持参数校验
* 支持OpenAPI/Swagger2.0规范，支持json、yaml格式
* 支持基于JsonSchema V4的接口query、body、path、header参数校验
* 支持自定义JsonSchema format校验
* 支持自定义接口错误处理

# 安装

> For koa@>=2.x (next):

```bash
npm install koa-oai-router@next --save
```

> For koa@<2.x:

**暂不支持！**

# 快速上手

## 新建API描述文档
如果你不了解如何新建该文件，请参考[OpenAPI](https://github.com/OAI/OpenAPI-Specification)。

```yaml
# api/api.yaml

swagger: '2.0'
info:
  version: 1.0.0
  title: koa-oai-router
consumes:
  - application/json
produces:
  - application/json
basePath: /api
paths:
  /people:
    get:
      tags:
        - People
      description: find a people by name or mobile
      x-controller:
        - file: people
          handler: get
      parameters:
        - name: name
          in: query
          type: string
        - name: mobile
          in: query
          type: string
      responses:
        200:
          description: people's info
          schema:
            $ref: '#/definitions/People'
        default:
          description: unexpected error
          schema:
            $ref: '#/definitions/Error'
    post:
      tags:
        - People
      description: input a people's info
      x-controller:
        - file: people
          handler: post
      parameters:
        - name: body
          in: body
          required: true
          schema:
            $ref: '#/definitions/People'
      responses:
        200:
          description: people's info
          schema:
            $ref: '#/definitions/People'
        default:
          description: unexpected error
          schema:
            $ref: '#/definitions/Error'
definitions:
  People:
    type: object
    required:
      - name
      - sex
      - height
      - weight
    properties:
      name:
        type: string
      sex:
        type: string
        enum:
          - male
          - female
      height:
        type: integer
        format: int32
        minimum: 10
        maximum: 1000
      weight:
        type: number
        format: float
        minimum: 50
        maximum: 200
      mobile:
        type: string
  Error:
    title: Error
    type: object
    required:
      - status
      - error
    properties:
      status:
        type: integer
      path:
        type: string
      error:
        type: string
      detail:
        type: object
```

## 新建控制器

在这里添加你的业务逻辑

```javascript
// controllers/people.js

var people = {name: 'BiteBit'};

function get(ctx, next) {
  ctx.body = people;
}

function post(ctx, next) {
  people = ctx.request.body;
  ctx.body = people;
}

module.exports = {
  get: get,
  post: post
};
```

## 新建koa app

```javascript
// app.js

import Koa from ('koa');
import bodyParser from ('koa-bodyparser');
import Router from ('koa-oai-router');

const app = new Koa();
const server = app.listen(9000);

app.use(bodyParser());

// 配置koa-oai-router选项
var opt = {
  // API文档路径
  apiDoc: './api/api.yaml',
  // controllers的目录
  controllerDir: './controllers',
  // 从server中获取监听的端口，为了方便打开api-explorer
  server: server,
  // 对接口做版本控制
  versioning: true,
  // 展示api-explorer
  apiExplorerVisible: true
};

var router = new Router(opt);
// 挂载由apiDoc识别的接口
app.use(router.routes());
// 挂载api-explorer工具
app.use(router.apiExplorer());
```

## 使用api-explorer

根据提示，用浏览器打开http://127.0.0.1:9000/api-explorer，测试你的接口吧！

![Api Explorer](./images/api-explorer.png?raw=true)

# 使用说明

## Router的参数

### apiDoc

string 必须

api描述文件的路径，目前支持OpenAPI2.0的json/yaml格式文件。

### controllerDir  

string 必须

控制器所在的文件夹目录，主要的业务逻辑处理入口。

### port 

number 可选 默认80

koa服务监听的端口，用于生成api-explorer链接提示信息。

### server  

net.Socket 可选

koa服务监听时返回的Socket，用于自动获取服务的端口，也是用于生成api-explorer链接提示信息。当*port*与*server*同时指定时，优先使用*port*。*server*与*port*设置其一即可。

### versioning 

boolean 可选 默认true

是否使用主版本号对接口做版本管理。即如果API描述文档版本号是"1.2.3"，那么接口地址会自动增加"/v1/xxx"的前缀。
如果想在接口中体现更多的版本信息，可关闭该选项，在API描述文档中的basePath字段手动管理。

### apiExplorerVisible

boolean 可选 默认true

是否显示api-explorer，建议生产环境不要显示api-explorer。

### apiExplorerPath

string 可选 默认*/api-explorer*

api-explorer工具的路径。

### apiExplorerStaticsPath

string 可选（不推荐设置） 默认*/koa-oai-router*

swagger-ui静态资源的目录，除非和你的静态资源目录发生冲突。

### jsonSchemaFormatters 

object 可选 默认{}

是否为Json Schema添加自定义format校验器。

object的key为自定义format的关键字。
object的key对应的value是一个函数。参数列表为(data, schema)。

* data 需要校验的数据。
* schema 该数据对应的Json Schema。

校验函数返回null表示校验通过，返回string表示校验失败（该错误字符串将作为错误信息）。

```javascript
import Koa from ('koa');
import bodyParser from ('koa-bodyparser');
import Router from ('koa-oai-router');

const app = new Koa();
const server= app.listen(9000);

app.use(bodyParser());

var opt = {
  apiDoc: './api/api.yaml',
  controllerDir: './controllers',
  server: server
  jsonSchemaFormatters: {
    "zh-CN": (data, schema)=> {
      return data !== 'zh-CN' ? null : 'language is not zh-CN';
    }
  }
};

const router = new Router(opt);
app.use(router.routes());
app.use(router.apiExplorer());
```

### errorHandler

function 可选 [默认处理函数](#)

如果想自己实现错误结果定义，那么你需要实现该函数，该函数有三个参数(error, ctx, schema)，并返回处理结果。

* error Error对象，由[http-errors](https://github.com/jshttp/http-errors)创建。如果是400错误，那么error对象额外包含以下字段
  * path string 参数校验失败的字段
  * error string 参数校验失败的错误提示
  * data object 参与校验的参数
  * detail object 校验失败原始错误
* ctx
* schema 该接口的schema


## 接口的控制器

**koa-oai-router**对OpenAPI进行了扩展，会识别API文档中每个path下的method中包含的**x-controller**字段。

**x-controller**是一个对象数组，每个元素均需包含参数**file**和**handler**。

**如果x-controller包含多个元素，那么中间件处理的优先级按照由上至下依次进行。**


```yaml
paths:
  /people:
    get:
      tags:
        - People
      description: find a people by name or mobile
      x-controller:
        - file: acl
          handler: isAdmin
        - file: people
          handler: get
```

### file

表示该接口对应控制器文件的名称。

### handler

控制器文件导出的函数。[koa@next](https://github.com/koajs/koa/tree/v2.x#common-function)

* 支持common function
* 支持async function
* 支持generator function

## 参数校验

参数校验基于Json Schema，目前支持query(formData)，body，path，header四种类型的参数校验。

校验的顺序是：header -> path -> query -> formData -> body，其中任何一部校验失败，接口报错HTTP 400错误，并返回相关错误提示。

详细请深入了解以下文档：

[OpenAPI的data types以及format](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types)

[OpenAPI的参数校验规范](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterObject)

### header

```yaml
paths:
  /users:
    get:
      summary: List all users
      parameters:
        - name: token
          in: header
          description: token to be passed as a header
          required: true
          type: string
```

校验接口请求的header中是否包含token字段，并且要求为string类型。支持多个header参数同时校验。

### path

```yaml
paths:
  /user/{peopleId}:
    get:
      summary: pet
      parameters:
        - name: peopleId
          in: path
          description: peopleId'id
          required: true
          type: string
```

校验接口path中petId是否存在并且为字符串。支持多个path参数同时校验。

### query(formData)

```yaml
paths:
  /users:
    get:
      summary: find a user by name
      parameters:
        - name: name
          in: query
          description: name of user
          required: true
          type: string
```

校验接口的query参数是否为存在并且为字符串。支持多个query参数同时校验。

### body

```yaml
paths:
  /user:
    post:
      summary: add user
      parameters:
        - name: user
          in: body
          description: user to add to the system
          required: true
          schema:
            $ref: '#/definitions/User'
definitions:
  User:
    required:
      - id
      - name
    properties:
      id:
        type: integer
        format: int64
      name:
        type: string
      tag:
        type: string
```

校验接口的body参数，其中id和name是必须字段。

**注意：OpenAPI2.0规范定义每个接口中仅支持一个body参数，如果API描述文档中包含多个body，那么只会校验第一个body**。

## 结果校验（暂不支持）

TODO..

## 错误处理

如果接口抛出异常，那么错误处理函数将会捕捉到异常并处理。默认错误处理函数会根据抛出异常的HTTP状态码获取API文档中设置的response相匹配的schema（如果未找到，那么使用default）。然后会从Error对象中Pick出该schema中定义的所有字段。

```yaml
swagger: '2.0'
info:
  version: 1.0.0
  title: koa-oai-router
consumes:
  - application/json
produces:
  - application/json
basePath: /api
paths:
  /user:
    get:
      x-controller:
        - file: people
          handler: get
      parameters:
        - name: name
          in: query
          type: string
          required: true
      responses:
        200:
          description: user's info
          schema:
            $ref: '#/definitions/User'
        default:
          description: unexpected error
          schema:
            $ref: '#/definitions/Error'
definitions:
  User:
    required:
      - id
      - name
    properties:
      id:
        type: integer
        format: int64
      name:
        type: string
      tag:
        type: string
  Error:
    title: Error
    type: object
    required:
      - status
      - error
    properties:
      status:
        type: integer
      path:
        type: string
      error:
        type: string
      detail:
        type: object
```

当接口未传入任何参数时抛出HTTP 400错误的时候，接口返回以下结果：

```json
{
    "status": 400,
    "path": "",
    "error": "Missing required property: page",
    "data": {},
    "detail": {
        "message": "Missing required property: page",
        "params": {
            "key": "page"
        },
        "code": 302,
        "dataPath": "",
        "schemaPath": "/required/0",
        "subErrors": null,
        "stack": "...."
    }
}
```


# 计划
* 支持OpenAPI/Swagger1.x规范
* 支持OpenAPI/Swagger2.0协议中的Security校验
* 支持接口的返回结果校验
* 内置更多常用的format校验（邮箱，电话号码，IP地址等）
* 更多的单元测试
* Benchmark
