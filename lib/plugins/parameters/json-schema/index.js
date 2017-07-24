import _ from 'lodash';
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
export default function validate(data, schema, customFormatters = {}) {
  const invalid = {
    valid: false,
    message: 'must input data and schema.',
    path: '',
    error: new Error('must input data and schema.'),
    data: null,
  };

  if (!data) return invalid;
  if (!schema) return invalid;

  // ajv bug, for empty required array
  if (_.isEmpty(schema.required)) delete schema.required;

  return ajvValidator(data, schema, customFormatters);
}
