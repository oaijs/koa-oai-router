import { AssertionError } from 'assert';

import { _, init, Plugin, expectApiExplorer } from '../helpers';

describe('Plugin field', () => {
  it('filed is string, shoud be ok', async () => {
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

  it('filed is array, shoud be ok', async () => {
    const fields = ['summary', 'description'];
    const { request } = await init({
      apiDoc: './test/plugin/api',
      plugins: [new Plugin({
        name: 'summary_description',
        field: fields,
        middlewareWrapper: ({ field }) => {
          return (ctx, next) => {
            if (ctx.response.body === undefined) {
              ctx.response.body = '';
            }
            ctx.response.body += `${field}`;
            return next();
          };
        },
      })],
    });

    const { text } = await request.get('/api/pets').expect(200);

    expect(fields.join('')).toEqual(text);
  });

  it('filed is invalid, shoud throw error', async () => {
    try {
      await init({
        apiDoc: './test/plugin/api',
        plugins: [new Plugin({
          name: 'parameters',
          field: {},
          middlewareWrapper: ({ fieldValue }) => {
            return (ctx, next) => {
              ctx.response.body = fieldValue;
            };
          },
        })],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AssertionError);
    }
  });
});
