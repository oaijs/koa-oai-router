import _ from 'lodash';
import Debug from 'debug';

const debug = Debug('koa-oai-router:correction');

const COLLECTION_FORMAT_MAP = {
  csv: ',',
  ssv: ' ',
  tsv: '\\',
  pipes: '|',
  multi: '&',
};

function collectionFormatHandler(ctx, fieldData) {
  _.each(fieldData, (field) => {
    const origin = ctx.request.query[field.name];
    const splitWord = COLLECTION_FORMAT_MAP[field.collectionFormat];
    if (!origin || !splitWord) return;

    const words = _.split(origin, splitWord);
    debug(`split words with [${splitWord}]:`, words);

    ctx.request.query[field.name] = words;
  });
}

/**
 * OAI ParameterObject validator middleware
 * @param {object} fieldData
 * @param {object} operationData
 * @returns {function} koa middleware
 */
function correctionHandler(endpoint, method, fieldData, operationData, options) {
  return (ctx, next) => {
    debug(method, endpoint, fieldData, options);
    debug(ctx.request.query, ctx.request.body, ctx.params);

    collectionFormatHandler(ctx, fieldData);

    return next();
  };
}

export default correctionHandler;
