import test from 'ava';

import validate from '../lib/validator/json-schema';

test('validate invalid data', (t)=> {
  t.is(validate({}, null, null, 'tv4').valid, false)
  t.is(validate(null, {}, null, 'tv4').valid, false)
  t.is(validate(null, null, null, 'tv4').valid, false)
})

test('validate valid data', (t)=> {
  const schema = {
    "title": "Example Schema",
    "type": "object",
    "properties": {
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      },
      "age": {
        "type": "integer",
        "format": "int32"
      },
      "weight": {
        "type": "integer",
        "format": "int64"
      },
      "height": {
        "type": "number",
        "format": "float"
      },
      "money": {
        "type": "number",
        "format": "double"
      },
    },
    "required": ["firstName", "lastName"]
  };

  const data = {
    firstName: 'gao',
    lastName: 'jin',
    age: 27,
    weight: 180,
    height: 65.9,
    money: 99999999999999.99999
  }

  t.is(validate(data, schema, null, 'tv4').valid, true)
})

test('validate string to number', (t)=> {
  const schema = {
    "title": "Example Schema",
    "type": "object",
    "properties": {
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      },
      "age": {
        "type": "integer",
        "format": "int32"
      },
      "weight": {
        "type": "number",
        "format": "int64"
      },
      "height": {
        "type": "number",
        "format": "float"
      },
      "money": {
        "type": "number",
        "format": "double"
      },
    },
    "required": ["firstName", "lastName"]
  };

  const data = {
    firstName: 'gao',
    lastName: 'jin',
    age: '27',
    weight: 180,
    height: '65.9',
    money: '99999999999999.99999'
  }

  t.is(validate(data, schema, null, 'tv4').valid, true)
})

test('validate int32 data', (t)=> {
  const schema = {
    "type": "object",
    "properties": {
      "age": {
        "type": "integer",
        "format": "int32"
      }
    }
  };

  const data = {
    age: 2147483648 + 1,
  }

  const data1 = {
    age: -2147483648 - 1,
  }

  const data2 = {
    age: 2147483648 - 1,
  }

  const data3 = {
    age: -2147483648 + 1,
  }

  t.is(validate(data, schema, null, 'tv4').valid, false)
  t.is(validate(data1, schema, null, 'tv4').valid, false)
  t.is(validate(data2, schema, null, 'tv4').valid, true)
  t.is(validate(data3, schema, null, 'tv4').valid, true)
})

test('validate int64 data', (t)=> {
  const schema = {
    "type": "object",
    "properties": {
      "age": {
        "type": "integer",
        "format": "int64"
      }
    }
  };

  const data = {
    age: Number.MAX_SAFE_INTEGER + 1,
  }

  const data1 = {
    age: Number.MIN_SAFE_INTEGER - 1,
  }

  const data2 = {
    age: Number.MAX_SAFE_INTEGER - 1,
  }

  const data3 = {
    age: Number.MIN_SAFE_INTEGER + 1,
  }

  t.is(validate(data, schema, null, 'tv4').valid, false)
  t.is(validate(data1, schema, null, 'tv4').valid, false)
  t.is(validate(data2, schema, null, 'tv4').valid, true)
  t.is(validate(data3, schema, null, 'tv4').valid, true)
})

test('validate float data', (t)=> {
  const schema = {
    "type": "object",
    "properties": {
      "age": {
        "type": "number",
        "format": "float"
      }
    }
  };

  const data = {
    age: 3.402823e38 + 1,
  }

  const data1 = {
    age: -3.402823e38 - 1,
  }

  const data2 = {
    age: 3.402823e38 - 1,
  }

  const data3 = {
    age: -3.402823e38 + 1,
  }

  const data4 = {
    age: -3.402823e38 - 100099999999999999999999,
  }

  const data5 = {
    age: 3.402823e38 + 100099999999999999999999,
  }

  t.is(validate(data, schema, null, 'tv4').valid, true)
  t.is(validate(data1, schema, null, 'tv4').valid, true)
  t.is(validate(data2, schema, null, 'tv4').valid, true)
  t.is(validate(data3, schema, null, 'tv4').valid, true)
  t.is(validate(data4, schema, null, 'tv4').valid, false)
  t.is(validate(data5, schema, null, 'tv4').valid, false)
})

test('validate double data', (t)=> {
  const schema = {
    "type": "object",
    "properties": {
      "age": {
        "type": "number",
        "format": "double"
      }
    }
  };

  const data = {
    age: Number.MAX_VALUE + 1,
  }

  const data1 = {
    age: Number.MIN_VALUE,
  }

  const data2 = {
    age: Number.MAX_VALUE - 1,
  }

  const data3 = {
    age: Number.MIN_VALUE,
  }

  const data4 = {
    age: Number.MAX_VALUE * 1.01,
  }

  const data5 = {
    age: Number.MIN_VALUE * 0.1,
  }

  t.is(validate(data, schema, null, 'tv4').valid, true)
  t.is(validate(data1, schema, null, 'tv4').valid, true)
  t.is(validate(data2, schema, null, 'tv4').valid, true)
  t.is(validate(data3, schema, null, 'tv4').valid, true)
  t.is(validate(data4, schema, null, 'tv4').valid, false)
  t.is(validate(data5, schema, null, 'tv4').valid, false)
})

test('validate custom formater', (t)=> {
  const schema = {
    "title": "Example Schema",
    "type": "object",
    "properties": {
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      },
      "language": {
        "type": "string",
        "format": "zh-CN"
      }
    },
    "required": ["firstName", "lastName"]
  };

  const data = {
    firstName: 'gao',
    lastName: 'jin',
    language: 'zh-CN'
  }

  function languageFormater (data, schema) {
    return data === 'zh-CN';
  }

  function languageFormater1 (data, schema) {
    return 'error';
  }

  t.is(validate(data, schema, {'zh-CN': languageFormater}, 'tv4').valid, true)
  t.is(validate(data, schema, {'zh-CN': languageFormater1}, 'tv4').valid, false)
})

test('validate invalid engine', (t)=> {
  const schema = {
    "title": "Example Schema",
    "type": "object",
    "properties": {
      "firstName": {
        "type": "string"
      },
      "lastName": {
        "type": "string"
      },
      "language": {
        "type": "string",
        "format": "zh-CN"
      }
    },
    "required": ["firstName", "lastName"]
  };

  const data = {
    firstName: 'gao',
    lastName: 'jin',
    language: 'zh-CN'
  }

  function languageFormater (data, schema) {
    return data === 'zh-CN';
  }

  function languageFormater1 (data, schema) {
    return 'error';
  }

  t.is(validate(data, schema, {'zh-CN': languageFormater}, 'invalid engine').valid, false)
  t.is(validate(data, schema, {'zh-CN': languageFormater1}, 'invalid engine').valid, false)
})
