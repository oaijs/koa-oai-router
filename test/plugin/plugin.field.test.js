import { AssertionError } from 'assert';

import { _, init, Plugin, expectApiExplorer } from '../helpers';

describe('Plugin field', () => {
  it('filed is string, shoud be ok', async () => {
    class PluginX extends Plugin {
      constructor() {
        super();

        this.pluginName = 'tags';
        this.field = 'tags';
      }

      handler({ fieldValue }) {
        return (ctx, next) => {
          ctx.response.body = fieldValue;
        };
      }
    }

    const { request } = await init({
      apiDoc: './test/plugin/api',
      plugins: [PluginX],
    });

    const { apiJson } = await expectApiExplorer(request, 200);
    const { body } = await request.get('/api/pets').expect(200);

    expect(_.get(apiJson, 'body.paths./pets.get.tags')).toEqual(body);
  });

  it('filed is array, shoud be ok', async () => {
    const fields = ['summary', 'description'];

    class PluginX extends Plugin {
      constructor() {
        super();

        this.pluginName = 'summary_description';
        this.field = fields;
      }

      handler({ field }) {
        return (ctx, next) => {
          if (ctx.response.body === undefined) {
            ctx.response.body = '';
          }
          ctx.response.body += `${field}`;
          return next();
        };
      }
    }

    const { request } = await init({
      apiDoc: './test/plugin/api',
      plugins: [PluginX],
    });

    const { text } = await request.get('/api/pets').expect(200);

    expect(fields.join('')).toEqual(text);
  });

  it('filed is invalid, shoud throw error', async () => {
    class PluginX extends Plugin {
      constructor() {
        super();

        this.pluginName = 'parameters';
        this.field = {};
      }

      handler({ fieldValue }) {
        return (ctx, next) => {
          ctx.response.body = fieldValue;
        };
      }
    }

    try {
      await init({
        apiDoc: './test/plugin/api',
        plugins: [PluginX],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AssertionError);
    }
  });
});
