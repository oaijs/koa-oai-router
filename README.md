# Koa-OAI-Router

[![License][license-img]][license-url]
[![Node Version][node-image]][node-url]
[![NPM Version][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Test Coverage][coveralls-img]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-img]][david-url]

[travis-img]: https://github.com/amazing-gao/koa-oai-router/workflows/Node.js%20CI/badge.svg
[travis-url]: https://github.com/amazing-gao/koa-oai-router/actions
[coveralls-img]: https://coveralls.io/repos/github/amazing-gao/koa-oai-router/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/amazing-gao/koa-oai-router?branch=master
[npm-img]: https://img.shields.io/npm/v/koa-oai-router.svg
[npm-url]: https://npmjs.org/package/koa-oai-router
[david-img]: https://img.shields.io/david/amazing-gao/koa-oai-router.svg
[david-url]: https://david-dm.org/amazing-gao/koa-oai-router
[downloads-image]: https://img.shields.io/npm/dm/koa-oai-router.svg
[downloads-url]: https://npmjs.org/package/koa-oai-router
[license-img]: http://img.shields.io/badge/license-MIT-green.svg
[license-url]: http://opensource.org/licenses/MIT
[node-image]: https://img.shields.io/badge/node.js-v6.0.0-blue.svg
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
[oai-router-controller-mongo]: https://github.com/oaijs/koa-oai-router-controller-mongo
[oai-router-examples]: https://github.com/oaijs/koa-oai-router-examples
[migration]: ./docs/en/migration.md
[usage-guides]: ./docs/en/usage-guides.md
[references]: ./docs/en/references.md
[api-explorer-img]: ./docs/api-explorer.png?raw=true

[中文](./README.zh-CN.md)    [English](./README.md)

I have used markdown and wiki to manage api doc, from which I have suffered a lot. It wastes too much time and is very boring. The document should be repaired when you change the api. It's very unconvenient to test and debug. The management of api doc totally depends on people. As a result, it is hard to make document have high quality. Meanwhile, the developers will spend more time on testing, which may have a bad effect on project. What's worse, it will affect our mood, which is unbearable for me : (

So I try my best to solve this problem. When there is a will, there is a way. Finally, I find The [OpenAPI Specification][oai]. And its ecological circle is perfect. [Swagger][swagger] includes lots of tool chain. According to the Specification, [Swagger UI][swagger-ui] can produce the document. The data types and models of OpenAPI are based on the [JSON-Schema Draft 4][jsonschema].

I truly hope that this library can help those who are in the same trouble. Happy coding.

BTW，PR & Issue & Star are welcome! : )

---

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
<!-- code_chunk_output -->

- [Koa-OAI-Router](#koa-oai-router)
- [Features](#features)
- [Migration](#migration)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Creating web server](#creating-web-server)
  - [Creating business middleware](#creating-business-middleware)
  - [Creating api doc](#creating-api-doc)
    - [Writing api base info](#writing-api-base-info)
    - [Writing `paths` info](#writing-paths-info)
    - [Writing `definitions` info](#writing-definitions-info)
  - [Enjoying api-explorer](#enjoying-api-explorer)
- [Documentation](#documentation)
- [Ecosystem](#ecosystem)
- [Plan](#plan)

<!-- /code_chunk_output -->

---

# Features
* Built-in Swagger-UI, easy to view and debug
* Support OpenAPI/Swagger2.0 specification with yaml or json file
* More friendly and convenient api doc splitting solution
* Plugin system. Middleware loader, form validator, response handler, error handler supported as plugin
* Inherit from [Koa-Router][koa-router], maintain the original function, features and performance

# Migration
If you are not a 1.x user, please skip this section directly.
If you are a 1.x user and want to upgrade to version 2.0, I'm sorry that you will not upgrade to version 2.0 easily. Please read this [Migration][migration] carefully and follow the operation manual to upgrade.

# Installation
```sh
# required koa 2.x
> npm install koa-oai-router --save
```

# Getting Started
The following will teach you how to use the router to build a web server with a good organizational structure and `api-explorer`.

In this case, it basically covers all the key points of the router, including:
* configure router
* configure plugin
* mount plugin to router
* mount router to app
* write api doc
* use plugin
* enjoy api-explorer

our target is:
* to create a REST API Server
* to implement a pets query api and return the array of pets found
* to implement a creating api for pets and return the pet and id
* to generate api documentation and enjoy api-explorer

Here we go.

## Creating web server
```javascript
// ./app.js

const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-oai-router');
const middleware = require('koa-oai-router-middleware');

const app = new Koa();

// *configure router - load api doc from directory api
const router = new Router({
  apiDoc: './api',
});

// *configure plugin - identify x-oai-middleware in the api file and load the appropriate middleware from controllers
// *mount plugin to router
router.mount(middleware, './controllers');

app.use(logger());
app.use(bodyParser());
// *mount router to app
app.use(router.routes());

app.listen(3000);
```

## Creating business middleware
Create business middleware directory `controllers` and write business middleware.
```js
// ./controllers/pets.js

const database = [];

// Query pets in the database according to tags, and limit the query result according to the limit.
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

// Create a pet store to the database.
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

## Creating api doc
If you know nothing about [OpenAPI][oai], please read [OpenAPI][oai] carefully.

### Writing api base info
You can describe the basic information of the service, such as the version of the service, the basic path, transmission protocol, author and permission license.
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

### Writing `paths` info
Holds the relative paths to the individual endpoints. The path is appended to the basePath in order to construct the full URL. Please refer to [Paths][oai-paths].

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

### Writing `definitions` info
You can define an object to hold data types that can be consumed and produced by operations. These data types can be primitives, arrays or models. Please refer to [Definitions][oai-definitions].

1.Define interface error response data model `ErrorModel`.
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

2.Define query success response data model `Pet`, define new request data model `NewPet`.
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

## Enjoying api-explorer
Start WEB service, test interface and enjoy api-explorer.

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
As you can see, all of the business middleware we wrote has been called normally.
Use a browser to open `http://localhost:3000/api-explorer`, and you can enjoy api-explorer now.
![Api Explorer][api-explorer-img]

# Documentation
* [Usage Guides][usage-guides]
* [References  ][references]
* [Migration   ][migration]
* [Examples    ][oai-router-examples]

# Ecosystem

| name                                                           | description         | status     |
| -------------------------------------------------------------- | ------------------- | ---------- |
| [koa-oai-router-middleware][oai-router-middleware]             | middleware loader   | Done       |
| [koa-oai-router-correction][oai-router-correction]             | form correction     | Done       |
| [koa-oai-router-parameters][oai-router-parameters]             | form validator      | Done       |
| [koa-oai-router-responses][oai-router-responses]               | response handler    | Done       |
| [koa-oai-router-cache][oai-router-cache]                       | request cache       | Done       |
| [koa-oai-router-rbac][oai-router-rbac]                         | request rbac        | Planning   |
| [koa-oai-router-controller-mongo][oai-router-controller-mongo] | MongoDB REST server | Developing |

# Plan
* Support OpenAPI/Swagger3.0
* More plugins
* More unit tests
* Benchmark
