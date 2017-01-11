import _ from 'lodash'
import Debug from 'debug';

import validate from './json-schema';
import {paramErrorSchema, defaultErrorSchema} from './schema-default';

const debug = Debug('koa-oai-router:responses');

export default class Responses {
  constructor(schema, validator, errorHandler, defaultResponseSchemas) {
    this.schema = schema;
    this.schema.responses = this.schema.responses || {};
    this.errorHandler = errorHandler || this._defaultErrorHandler_;
    this.defaultResponseSchemas = defaultResponseSchemas || {};

    debug('responses:', this.schema.responses);

    return (ctx, next)=> {
      debug(ctx.query, ctx.request.body, ctx.params);

      return next()
      .then((data)=> {
        // not validate and sanitate response body yet.
        return data;
      })
      .catch((error)=> {
        error.status = error.status || 500;

        ctx.status = error.status;
        ctx.body = this.errorHandler(error, ctx, this.schema);

        // since we handled this manually we'll want to delegate to the regular app
        // level error handling as well so that centralized still functions correctly.
        ctx.app.emit('error', error, ctx, this.schema);
      })
    }
  }

  _defaultErrorHandler_(error, ctx, schema) {
    const status = error.status;
    let respSchema = null;

    if (status === 400)
      respSchema = schema.responses[String(status)] || this.defaultResponseSchemas[String(status)] || paramErrorSchema;
    else
      respSchema = schema.responses[String(status)] || this.defaultResponseSchemas[String(status)] || schema.responses.default || defaultErrorSchema;

    debug('using response schema:', respSchema, _.keys(respSchema.schema.properties));
    const data = _.pick(error, _.keys(respSchema.schema.properties));
    return data;
  }
}
