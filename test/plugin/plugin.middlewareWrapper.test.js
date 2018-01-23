import { AssertionError } from 'assert';

import { _, init, Plugin, expectApiExplorer } from '../helpers';

describe('Plugin middlewareWrapper', () => {
  it('middlewareWrapper is function, shoud be ok', async () => {
    const { request } = await init({
      apiDoc: './test/plugin/api',
      plugins: [new Plugin({
        name: 'tags',
        field: 'tags',
        middlewareWrapper: ({ fieldValue }) => {
          return (ctx, next) => {
            ctx.response.body = fieldValue;
          };
        },
      })],
    });

    const { apiJson } = await expectApiExplorer(request, 200);
    const { body } = await request.get('/api/pets').expect(200);

    expect(_.get(apiJson, 'body.paths./pets.get.tags')).toEqual(body);
  });

  it('middlewareWrapper is not function, shoud throw error', async () => {
    try {
      await init({
        apiDoc: './test/plugin/api',
        plugins: [new Plugin({
          name: 'tags',
          field: 'tags',
        })],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AssertionError);
    }
  });
});
