# Koa-OAI-Router

[![License][license-img]][license-url]
[![NPM Version][npm-img]][npm-url]
[![Node Version][node-image]][node-url]
[![Build Status][travis-img]][travis-url]
[![Test Coverage][coveralls-img]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-img]][david-url]

[![NPM](https://nodei.co/npm/koa-oai-router.png?downloads=true&stars=true)](https://nodei.co/npm/koa-oai-router/)

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

[中文](./README.zh-CN.md)    [English](./README.md)

I have used markdown and wiki to manage api doc, from which I have suffered a lot. It wastes too much time and is very boring. The docuement should be repaired when you change the api. It's very unconvenient to test and debug. The management of api doc totally depends on people. As a result, it is hard to make docuement have high quality. Meanwhile, the developers will spend more time on testing, which may have a bad effect on project. What's worse, it will affect our mood, which is unbearable for me : (.

So I try my best to solve this problem. When there is a will, there is a way. Finally, I find The OpenAPI Specification. And it's ecological circle is perfect. Swagger includes lots of tool chain. According to the Specification, Swagger UI can produce the docuement. The data types and models of OpenAPI are based on the JSON-Schema Draft 4.

I truly hope that this library can help those who are in the same trouble. Happy coding.

*BTW，PR & Issue & Star are welcome! : )*

---

- [Koa-OAI-Router](#koa-oai-router)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
  - [Creating API doc](#creating-api-doc)
  - [Creating controller](#creating-controller)
  - [Creating koa app](#creating-koa-app)
  - [Using api-explorer](#using-api-explorer)
- [Advanced](#advanced)
  - [Router](#router)
    - [apiDoc](#apidoc)
    - [controllerDir](#controllerdir)
    - [port](#port)
    - [server](#server)
    - [validator](#validator)
    - [versioning](#versioning)
    - [apiExplorerVisible](#apiexplorervisible)
    - [apiExplorerPath](#apiexplorerpath)
    - [apiExplorerStaticPath](#apiexplorerstaticpath)
    - [jsonSchemaFormatters](#jsonschemaformatters)
    - [errorHandler](#errorhandler)
  - [Router.use(keyword, fn)](#routerusekeyword-fn)
  - [Router.extend(endpoint, fn)](#routerextendendpoint-fn)
  - [Contrller](#contrller)
    - [file](#file)
    - [handler](#handler)
  - [Parameter validate](#parameter-validate)
    - [header](#header)
    - [path](#path)
    - [query(formData)](#queryformdata)
    - [body](#body)
  - [Response validate（incomplete）](#response-validateincomplete)
  - [Error handle](#error-handle)
- [Plan](#plan)

---

**<u>Notice：Testing stage，Production not recommend！！！</u>**

# Features
* Built-in Swagger-UI, easy view and debug
* Auto generate route by OpenAPI/Swagger api doc, and validate parameters
* Support OpenAPI/Swagger2.0 Specification with yaml or json file
* Support Json Schema v4, validate query,body,path,header
* Support custom Json Schema format
* Support custom error handler

# Installation

> For koa@>=2.x (next):

```bash
npm install koa-oai-router@next --save
```

> For koa@<2.x:

**Not Support Yet!**

# Quick Start

## Creating API doc
If you not know how to do this. please read [OpenAPI](https://github.com/OAI/OpenAPI-Specification) first.

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
      x-oai-controller:
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
      x-oai-controller:
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

## Creating controller

do your staff code

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

## Creating koa app

```javascript
// app.js

import Koa from ('koa');
import bodyParser from ('koa-bodyparser');
import Router from ('koa-oai-router');

const app = new Koa();
const server = app.listen(9000);

app.use(bodyParser());

// set koa-oai-router options
var opt = {
  // path of api doc
  apiDoc: './api/api.yaml',
  // dir of controllers
  controllerDir: './controllers',
  // get listening port from server
  server: server,
  // add major version to api prefix
  versioning: true,
  // show api-explorer
  apiExplorerVisible: true
};

var router = new Router(opt);
// mount routes in api doc
app.use(router.routes());
// mount api-explorer
app.use(router.apiExplorer());
```

## Using api-explorer

open http://127.0.0.1:9000/api-explorer with browser，enjoy it!

![Api Explorer](./images/api-explorer.png?raw=true)

# Advanced

## Router

### apiDoc

string required

Api doc's path, support OpenAPI2.0 json,yaml.

### controllerDir

string required

Dir of controllers, it's used when set  **file and handler** of a api.

### port

number optional default 80

The port is koa server listening, used to be log out api-explorer url.

### server

net.Socket optional

The Socket is koa serving, which will find serving **port** automatically. No need to set *port* and *server* together.

### validator

string optional default is *ajv*

You can choice [ajv](https://github.com/epoberezkin/ajv), [tv4](https://github.com/geraintluff/tv4) or *null*. **I'm still finding a perfect Json Schema validator**.

* ajv Best performance in [Benchmark ](https://github.com/ebdrup/json-schema-benchmark), support data type coercion, this feature is very suit for query parameters, because *querystring* always pase json value as string. But at this moment, It is not support add custom format to other data type, except *string*.
* tv4 Not support data type coercion, but support add custom fromat to all data type.
* null Not use parameter validator.

### versioning

boolean optional default true

Add the major version of api doc to the api endpoint. You also can use **basePath** to manage the api.

### apiExplorerVisible

boolean optional default true

Show api-explorer. Showing on production is not recommended.

### apiExplorerPath

string optional default */api-explorer*

The path of *api-explorer*.

### apiExplorerStaticPath

string optional default*/koa-oai-router*

Static file path of swagger-ui is only set when your static file path is */koa-oai-router*.

### jsonSchemaFormatters

object optional default {}

You can add custom format validation through this.

Key in object is the **format** keyword.

Value in object must be a function with parameters **data** and **schema**.

* data filed to validate
* schema

When it is valid you should return **null**. When it is invalid you should return error **string**.

Return what kind of result depends on which validator you choice.

- ajv if valid return true, otherwise return false.
- tv4 if valid return null, otherwise return error message string.

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

function optional [default error handler](#error-handle)

You can design your custom error handler by doing this. The function has parameters **error, ctx, schema**. The returned value is response to the reqeust.

* error Error, created by [http-errors](https://github.com/jshttp/http-errors). if HTTP status code is 400, the error will have extra keywords below.
  * type string invalid parameter type, *header, path, query, body*
  * path string invalid parameter's path
  * error string invalid message
  * data object data been validated
  * detail object the original error
* ctx koa ctx
* schema Json Schema of the api



## Router.use(keyword, fn)

TODO



## Router.extend(endpoint, fn)

TODO



## Contrller

**koa-oai-router** enlarges OpenAPI, now we will recognize **x-oai-controller** keyword in all **method**.

**x-oai-controller** is an object array and every element must include **file** and **handler**.

Handler will be executed from up to down, if you have multi handlers. Eg, *acl.isAdmin* will be executed before *people.get*

```yaml
paths:
  /people:
    get:
      tags:
        - People
      description: find a people by name or mobile
      x-oai-controller:
        - file: acl
          handler: isAdmin
        - file: people
          handler: get
```

### file

The controller's file path was related to **controllerDir**.

### handler

The function is exported from the **file**. The following functions are same to [koa@next](https://github.com/koajs/koa/tree/v2.x#common-function).

* support common function
* support async function
* support generator function

## Parameter validate

Validation is based on [JSON-Schema Draft 4](http://json-schema.org/latest/json-schema-core.html#anchor8), and it enlarges some OpenAPI's format, like *int32,int64,float,double*.

At this moment **query, body, path and header** is supported. The validate order is *header -> path -> query -> body*. Any step validate failed will throw HTTP 400 error and response error message.

Recommended Reading:

[OpenAPI data types and format](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types)

[OpenAPI parameter object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterObject)

### header

Validate the header of request.

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

### path

Validate the path, multi path parameters are supported. If **peopleId** is missing, the route will not be macthed. At this moment, validation of path only support data type and format.

**Notice: Path parameter syntax in OpenAPI is "{pathId}".**

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

### query(formData)

Validate query parameter. Multi query parameters are supported.

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

### body

Validate body parameter, the *id* and *name* are required.

**NOTICE: OpenAPI2.0 Specification only supports one request <u>body</u>. If a api has multi body, the first body will be validated.**

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

## Response validate（incomplete）



## Error handle

If the default error handler is not fit you, you can design your custom error handler. The default error handler will get the response's schema by HTTP status code(if not, using default). Then it will pick schema's properties from the error.

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
      x-oai-controller:
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
      type:
      	type: string
      path:
        type: string
      error:
        type: string
      detail:
        type: object
```

When page is not inputed, the api will send HTTP 400 with the response body handled by error handler.

```json
{
    "status": 400,
    "type": "query",
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


# Plan
* Support OpenAPI/Swagger1.x
* Support OpenAPI/Swagger2.0 Security keyword
* Support Response validate
* Research more Json Schema validator
* More unit test
* Benchmark
