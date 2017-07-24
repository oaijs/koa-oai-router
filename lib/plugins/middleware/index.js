import _ from 'lodash';
import assert from 'assert';
import compose from 'koa-compose';
import path from 'path';

function loadHandler({file, handler}, options) {
  if (!file && _.isFunction(handler)) return handler;

  const modulePath = path.resolve(options.middlewareDir, file);
  const module = require(modulePath);

  assert(module, 'middleware file not exists!');
  assert(_.isFunction(module[handler]), `module [${modulePath}] has no function [${handler}]!`);

  return module[handler];
}

function loadHandlers(controllers, options) {
  const handlers = [];
  for (const data of controllers) {
    const handler = loadHandler(data, options);
    handlers.push(handler);
  }

  return handlers;
}

/**
 * Load middleware(s) of the endpoint and mount to router.
 *
  ```yaml
  paths:
    /pets/{id}:
      get:
       x-oai-middleware:
          - file: user
            handler: isLogined
          - file: store
            handler: getPetById
  ```
 * x-oai-middleware is the field to watch. the value is an array, we will mount to router with the sort.
 *  file is the handler's relative path of the options middlewareDir.
 *  handler is an exported koa middleware to handle you business.
 *
 * @param {string} endpoint, the matched api endpoint
 * @param {string} method, method of the matched  api endpoint
 * @param {object} fieldData, data of the field in api doc
 * @param {object} operationData, data of the whole endpoint of with the method
 * @param {object} options, other options
 * @returns {function} koa middleware
 */
function middlewareHandler(endpoint, method, fieldData, operationData, options) {
  const mws = loadHandlers(fieldData, options);

  return compose(mws);
}

export default middlewareHandler;
