import _ from 'lodash'
import Debug from 'debug';

import validate from './json-schema';

const debug = Debug('koa-oai-router:responses');

export default class Responses {
  constructor(schema, errorHandler) {
    this.schema = schema;
    this.schema.responses = this.schema.responses || {};
    this.errorHandler = errorHandler || this._defaultErrorHandler_;

    debug('responses:', this.schema.responses);

    return (ctx, next)=> {
      debug(ctx.query, ctx.request.body, ctx.params);

      return next()
      .then((data)=> {
        // not validate and sanitate response body yet.
        return data;
      })
      .catch((error)=> {
        ctx.status = error.status || 500;
        ctx.body = this.errorHandler(error, ctx, this.schema);

        // since we handled this manually we'll want to delegate to the regular app
        // level error handling as well so that centralized still functions correctly.
        ctx.app.emit('error', error, ctx, this.schema);
      })
    }
  }

  _defaultErrorHandler_(error, ctx, schema) {
    const status = error.status || 500;
    const respSchema = schema.responses[String(status)] || schema.responses.default;
    debug('using response schema:', respSchema, _.keys(respSchema.schema.properties));

    const data = _.pick(error, _.keys(respSchema.schema.properties));
    return data;
  }
}
