import { AssertionError } from 'assert';

import { _, init, Plugin } from '../helpers';

describe('Plugin middlewareArgs', () => {
  it('middlewareArgs is object, shoud be ok', async () => {
    const { request } = await init({
      apiDoc: './test/plugin/api',
      plugins: [new Plugin({
        name: 'tags',
        field: 'tags',
        middlewareWrapper: ({ fieldValue }, { key }) => {
          return (ctx, next) => {
            ctx.response.body = key;
          };
        },
        middlewareArgs: { key: '123' },
      })],
    });

    const ret = await request.get('/api/pets').expect(200);
    expect(ret.text).toEqual('123');
  });

  it('middlewareArgs is not object, shoud throw error', async () => {
    try {
      await init({
        apiDoc: './test/plugin/api',
        plugins: [new Plugin({
          name: 'tags',
          field: 'tags',
          middlewareWrapper: ({ fieldValue }) => {
            return (ctx, next) => {
              ctx.response.body = fieldValue;
            };
          },
          middlewareArgs: () => {

          },
        })],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AssertionError);
    }
  });
});
