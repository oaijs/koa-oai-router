import Ajv from 'ajv';

import {RANGES} from './constants';

const ajv = new Ajv({
  format: 'full',
  coerceTypes: true,
  unknownFormats: 'ignore'
});

ajv.addFormat('int32', function (data, schema) {
  data = Number(data);
  if (data <= RANGES['int32'].max && data >= RANGES['int32'].min)
    return true;
  else
    return false;
});

ajv.addFormat('int64', function (data, schema) {
  data = Number(data);
  if (data <= RANGES['int64'].max && data >= RANGES['int64'].min)
    return true;
  else
    return false;
});

ajv.addFormat('float', function (data, schema) {
  data = Number(data);
  if (data <= RANGES['float'].max && data >= RANGES['float'].min)
    return true;
  else
    return false;
});

ajv.addFormat('double', function (data, schema) {
  data = Number(data);
  if (data <= RANGES['double'].max && data >= RANGES['double'].min)
    return true;
  else
    return false;
});

function addCustomFormat(customFormatters) {
  for (let key in customFormatters) {
    ajv.addFormat(key, customFormatters[key]);
  }
}

/**
 * [validate description]
 * @param  {[type]} data             [description]
 * @param  {[type]} schema           [description]
 * @param  {[type]} customFormatters [description]
 * @return object                  [description]
 *           valid   boolean
 *           message string   validate error message.
 *           path    string   validate error json path.
 *           error   mixed    raw error get from validate engine.
 *           data    object   some engine can't coerce the data, like ajv.
 */
export default function validate(data, schema, customFormatters) {
  addCustomFormat(customFormatters);

  const validator = ajv.compile(schema);
  const valid = validator(data);
  const error = (validator.errors && validator.errors.length  > 0) ? validator.errors[0] : {};

  return {
    valid: valid,
    message: error.message || '',
    path: error.dataPath || '',
    error: error,
    data: data
  }
}
