import { AssertionError } from 'assert';

import { _, init, Plugin, expectApiExplorer } from '../helpers';

describe('Plugin handler', () => {
  it('handler is function, shoud be ok', async () => {
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

  it('handler is not function, shoud throw error', async () => {
    try {
      class PluginX extends Plugin {
        constructor() {
          super();

          this.pluginName = 'tags';
          this.field = 'tags';
        }
      }

      await init({
        apiDoc: './test/plugin/api',
        plugins: [PluginX],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
