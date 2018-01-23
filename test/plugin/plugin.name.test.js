import { AssertionError } from 'assert';

import { init, Plugin } from '../helpers';

describe('Plugin name', () => {
  it('name is string, shoud be ok', async () => {
    const { request } = await init({
      apiDoc: './test/plugin/api',
      plugins: [new Plugin({
        name: 'parameters',
        field: 'parameters',
        middlewareWrapper: () => {
          return (ctx, next) => {
            ctx.response.body = '1234';
          };
        },
      })],
    });

    await request.get('/api/pets')
      .expect(200)
      .expect('1234');
  });

  it('name is invalid, shoud throw error', async () => {
    try {
      await init({
        apiDoc: './test/plugin/api',
        plugins: [new Plugin({
          name: 1234,
        })],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AssertionError);
    }
  });
});
