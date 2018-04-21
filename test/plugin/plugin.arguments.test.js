import { AssertionError } from 'assert';

import { _, init, Plugin } from '../helpers';

describe('Plugin arguments', () => {
  it('arguments is object, shoud be ok', async () => {
    class PluginX extends Plugin {
      constructor() {
        super();

        this.pluginName = 'tags';
        this.field = 'tags';
      }
      handler({ fieldValue }) {
        return (ctx, next) => {
          ctx.response.body = this.args.key;
        };
      }
    }

    const { request } = await init({
      apiDoc: './test/plugin/api',
      options: {
        PluginX: { key: '123' },
      },
      plugins: [PluginX],
    });

    const ret = await request.get('/api/pets').expect(200);
    expect(ret.text).toEqual('123');
  });

  it('arguments is not object, shoud throw error', async () => {
    try {
      class PluginX extends Plugin {
        constructor() {
          super();

          this.pluginName = 'tags';
          this.field = 'tags';
        }
        handler({ fieldValue }) {
        }
      }

      await init({
        apiDoc: './test/plugin/api',
        plugins: [PluginX],
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AssertionError);
    }
  });
});
