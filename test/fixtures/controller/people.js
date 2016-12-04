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

module.exports = {
  get: get,
  post: post,
  crash: crash
};
