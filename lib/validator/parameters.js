import _ from 'lodash'
import Debug from 'debug';

import validate from './json-schema';

const debug = Debug('koa-oai-router:parameters');

/**
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterObject
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#data-types
 */
export default class Parameters {
  constructor(schema, formater) {
    this.schema = schema;
    this.formater = formater;
    this.schema.parameters = this.schema.parameters || [];

    debug('parameters:', this.schema.parameters);

    return (ctx, next)=> {
      debug(ctx.query, ctx.request.body, ctx.params);

      this._validate_(ctx, 'header', ctx.headers);
      this._validate_(ctx, 'path', ctx.params);
      this._validate_(ctx, 'query', ctx.query);
      this._validate_(ctx, 'formData', ctx.query);
      this._validate_(ctx, 'body', ctx.request.body);
      return next();
    }
  }

  /**
   * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#parameterObject
   * Path - Used together with Path Templating, where the parameter value is actually part of the operation's URL. This does not include the host or base path of the API. For example, in /items/{itemId}, the path parameter is itemId.
   * Query - Parameters that are appended to the URL. For example, in /items?id=###, the query parameter is id.
   * Header - Custom headers that are expected as part of the request.
   * Body - The payload that's appended to the HTTP request. Since there can only be one payload, there can only be one body parameter. The name of the body parameter has no effect on the parameter itself and is used for documentation purposes only. Since Form parameters are also in the payload, body and form parameters cannot exist together for the same operation.
   * Form - Used to describe the payload of an HTTP request when either application/x-www-form-urlencoded, multipart/form-data or both are used as the content type of the request (in Swagger's definition, the consumes property of an operation). This is the only parameter type that can be used to send files, thus supporting the file type. Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation. Form parameters have a different format based on the content-type used (for further details, consult http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4):
   *        application/x-www-form-urlencoded - Similar to the format of Query parameters but as a payload. For example, foo=1&bar=swagger - both foo and bar are form parameters. This is normally used for simple parameters that are being transferred
   *        multipart/form-data - each parameter takes a section in the payload with an internal header. For example, for the header Content-Disposition: form-data; name="submit-name" the name of the parameter is submit-name. This type of form parameters is more commonly used for file transfers.
   *
   * @param object ctx
   * @param type   query,path,header,body,form
   * @param data   data to validate
   */
  _validate_ (ctx, type = 'query', originData = {}) {
    const jsonSchema = this._fetchAsSchema_(type, this.schema.parameters);

    if (!jsonSchema) return;

    const {valid, message, path, error, data} = validate(originData, jsonSchema, this.formater);
    debug(`validate [${type}] [${valid}]`, jsonSchema, data, error);

    if (valid) return;

    ctx.throw(400, {type: type, path: path, error: message, data: data, detail: error});
  }

  /**
   * fetch the endpoint's parameters as json-schema.
   * @param  string type        parameter type, support[query, path, body].
   * @param  array  parameters  swagger api doc parameters.
   * @return null,object        json-schema object
   */
  _fetchAsSchema_ (type, parameters) {
    let schema = null;

    if (type.toLowerCase() === 'body') {
      schema = _.find(parameters, (item)=> {return item.in.toLowerCase() === 'body';});
      schema = schema ? schema.schema : null;
    } else if (type.toLowerCase() === 'query' || type.toLowerCase() === 'path') {
      schema = this._fetchMulti_(type, parameters);
    } else if (type.toLowerCase() === 'header') {
      schema = this._fetchMulti_(type, parameters);
    }

    return schema;
  }

  /**
   * fetch multi parameters in query,path as a json-schema object.
   * @param  string type        parameter type, support[query, path, body].
   * @param  array  parameters  swagger api doc parameters.
   * @return object             json-schema object
   */
  _fetchMulti_ (type, parameters) {
    const tmpSchema = {
      required: [],
      properties: {}
    };

    _.each(parameters, (field)=> {
      if (field.in.toLowerCase() !== type) return;
      if (field.required) tmpSchema.required.push(field.name);

      tmpSchema.properties[field.name] = _.omit(field, ['name', 'in', 'description', 'required']);
    });

    return _.isEmpty(tmpSchema.properties) ? null : tmpSchema;
  }
}
