async function petsGet(ctx, next) {
  ctx.response.body = 'petsGet';
}

async function petsPost(ctx, next) {
  ctx.response.body = 'petsPost';
}

module.exports = {
  petsGet,
  petsPost,
};
