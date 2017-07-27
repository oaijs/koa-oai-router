const store = {};

async function petsGet(ctx, next) {
  ctx.response.body = 'petsGet';
}

async function petsPost(ctx, next) {
  ctx.response.body = 'petsPost';
}

async function getPetById(ctx, next) {
  ctx.response.body = 'getPetById';
}

async function delPetById(ctx, next) {
  ctx.response.body = 'delPetById';
}

module.exports = {
  petsGet,
  petsPost,
  getPetById,
  delPetById,
};
