import _ from 'lodash';
import Debug from 'debug';

import validate from './json-schema';

const debug = Debug('koa-oai-router:parameters');

function fetchMulti(type, parameters) {
  const tmpSchema = {
    required: [],
    properties: {},
  };

  _.each(parameters, (field) => {
    if (field.in.toLowerCase() !== type) return;
    if (field.required) tmpSchema.required.push(field.name);

    tmpSchema.properties[field.name] = _.omit(field, ['name', 'in', 'description', 'required']);
  });

  return _.isEmpty(tmpSchema.properties) ? null : tmpSchema;
}

function fetchAsSchema(type, parameters) {
  let schema = null;

  if (type.toLowerCase() === 'body') {
    schema = _.find(parameters, (item) => { return item.in.toLowerCase() === 'body'; });
    schema = schema ? schema.schema : null;
  } else if (type.toLowerCase() === 'query' || type.toLowerCase() === 'path') {
    schema = fetchMulti(type, parameters);
  } else if (type.toLowerCase() === 'header') {
    schema = fetchMulti(type, parameters);
  }

  return schema;
}

function validateParam(ctx, type, originData, fieldData, options) {
  const jsonSchema = fetchAsSchema(type, fieldData);
  if (!jsonSchema) return;

  debug(type, originData, fieldData, options);
  debug(jsonSchema);

  const {valid, message, path, error, data} = validate(originData, jsonSchema);
  debug(valid, message, path, error, data);
  if (valid) return;

  ctx.throw(400, {type, path, error: message, data, detail: error});
}


/**
 * OAI ParameterObject validator middleware
 * @param {object} fieldData
 * @param {object} operationData
 * @returns {function} koa middleware
 */
function parametersHandler(endpoint, method, fieldData, operationData, options) {
  return (ctx, next) => {
    debug(ctx.request.query, ctx.request.body, ctx.params);

    validateParam(ctx, 'header', ctx.headers, fieldData, options);
    validateParam(ctx, 'path', ctx.params, fieldData, options);
    validateParam(ctx, 'query', ctx.query, fieldData, options);
    validateParam(ctx, 'formData', ctx.query, fieldData, options);
    validateParam(ctx, 'body', ctx.request.body, fieldData, options);

    return next();
  };
}

export default parametersHandler;
