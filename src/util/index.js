const _ = require('lodash');
const Promise = require('bluebird');

function concatAt(target, path, fields) {
  const oldArr = _.get(target, path, []);
  const newArr = _.concat(oldArr, fields);

  _.set(target, path, _.compact(newArr));

  return target;
}

function concat(target, path, fields) {
  if (_.isString(fields)) {
    concatAt(target, path, fields);
  } else if (_.isArray(fields)) {
    _.each(fields, (field) => {
      concatAt(target, path, field);
    });
  }

  return target;
}

function compactFlatten(params) {
  return _.compact(_.flattenDeep(params));
}

async function eachPromise(obj, handler) {
  const keys = _.keys(obj);

  await Promise.each(keys, async (key) => {
    const value = obj[key];

    await handler(key, value);
  });
}

module.exports = {
  isArray: _.isArray,
  isUndefined: _.isUndefined,
  isFunction: _.isFunction,
  isString: _.isString,
  get: _.get,
  set: _.set,
  pick: _.pick,
  each: _.each,
  every: _.every,
  map: _.map,
  concat,
  compactFlatten,
  eachPromise,
};
