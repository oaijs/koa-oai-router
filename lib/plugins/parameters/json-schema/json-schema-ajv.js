import Ajv from 'ajv';

import {RANGES} from './constants';

const ajv = new Ajv({
  format: 'full',
  coerceTypes: true,
  unknownFormats: 'ignore',
  useDefaults: true,
});

ajv.addFormat('int32', (data, schema) => {
  const mayInt32 = Number(data);

  if (mayInt32 <= RANGES.int32.max && mayInt32 >= RANGES.int32.min) return true;

  return false;
});

ajv.addFormat('int64', (data, schema) => {
  const mayInt64 = Number(data);

  if (mayInt64 <= RANGES.int64.max && mayInt64 >= RANGES.int64.min) return true;

  return false;
});

ajv.addFormat('float', (data, schema) => {
  const mayFloat = Number(data);

  if (mayFloat <= RANGES.float.max && mayFloat >= RANGES.float.min) return true;

  return false;
});

ajv.addFormat('double', (data, schema) => {
  const mayDouble = Number(data);

  if (mayDouble <= RANGES.double.max && mayDouble >= RANGES.double.min) return true;

  return false;
});

function addCustomFormat(customFormatters) {
  for (const key in customFormatters) {
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
  const error = (validator.errors && validator.errors.length > 0) ? validator.errors[0] : {};

  return {
    valid,
    message: error.message || '',
    path: error.dataPath || '',
    error,
    data,
  };
}
