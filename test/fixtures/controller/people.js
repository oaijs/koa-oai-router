let people = {name: 'bitebit'};

function get(ctx, next) {
  ctx.body = people;
}

function post(ctx, next) {
  people = ctx.request.body;
  ctx.body = people;
}

function crash(ctx, next) {
  let status = undefined;
  ctx.body = status['undefined'];
}

function ctxThrow(ctx, next) {
  ctx.throw(403, {error_code: -1, error_description: 'Forbidden'})
}

function rawThrow(ctx, next) {
  let err = new Error();
  err.error_code = -2;
  err.error_description = 'Internal Error';
  throw err;
}

module.exports = {
  get: get,
  post: post,
  crash: crash,
  ctxThrow: ctxThrow,
  rawThrow: rawThrow
};
