import _ from 'lodash';
import Debug from 'debug';
import {defaultErrorSchema, defaultParamErrorSchema} from './error-schema';

const debug = Debug('koa-oai-router:responses');

function defaultErrorHandler(error, ctx, responses, options) {
  const status = error.status;
  let respSchema = null;

  if (status === 400) {
    respSchema =
      responses[String(status)] ||
      options.defaultResponseSchemas[String(status)] ||
      responses.default ||
      defaultParamErrorSchema;
  } else {
    respSchema =
      responses[String(status)] ||
      options.defaultResponseSchemas[String(status)] ||
      responses.default ||
      defaultErrorSchema;
  }

  debug('response schema:', respSchema, _.keys(respSchema.schema.properties));
  const data = _.pick(error, _.keys(respSchema.schema.properties));
  return data;
}

/**
 * Return a response middleware of the endpoint.
 * @param {string} endpoint, the matched api endpoint
 * @param {string} method, method of the matched  api endpoint
 * @param {object} fieldData, data of the field in api doc
 * @param {object} operationData, data of the whole endpoint of with the method
 * @param {object} options, other options
 * @returns {function} koa middleware
 */
function responseHandler(endpoint, method, fieldData, operationData, options) {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      error.status = error.status || 500;

      ctx.status = error.status;
      ctx.body = typeof options.errorHandler === 'function' ?
        options.errorHandler(error, ctx, fieldData, options) :
        defaultErrorHandler(error, ctx, fieldData, options);

      // since we handled this manually we'll want to delegate to the regular app
      // level error handling as well so that centralized still functions correctly.
      ctx.app.emit('error', error, ctx);
    }
  };
}

export default responseHandler;
