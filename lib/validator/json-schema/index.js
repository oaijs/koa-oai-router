import tv4Validator from './json-schema-tv4';
import ajvValidator from './json-schema-ajv';

/**
 * validate data with schema.
 * @param  object data              data to validate.
 * @param  object schema            json schema object.
 * @param  object customFormatters  add custom format validator.
 *           key     string    custom format validator name.
 *           value   function  validate function with parameters (data, schema). return true/false.
 * @param  string engine            at this moment, support tv4 only.
 * @return object
 *           valid   boolean
 *           message string   validate error message.
 *           path    string   validate error json path.
 *           error   mixed    raw error get from validate engine.
 *           data    object   some engine can't coerce the data, like ajv.
 */
export default function validate(data, schema, customFormatters = {}, engine = 'ajv') {
  const invalid = {
    valid: false,
    message: 'must input data and schema.',
    path: '',
    error: new Error('must input data and schema.'),
    data: null
  }

  if (!data) return invalid;
  if (!schema) return invalid;

  if (engine === 'tv4')
    return tv4Validator(data, schema, customFormatters);
  else if (engine === 'ajv')
    return ajvValidator(data, schema, customFormatters);
  else
    return invalid;
}
