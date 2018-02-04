import { AssertionError } from 'assert';

import { _, init, Plugin, expectApiExplorer } from '../helpers';

describe('Plugin after', () => {
  it('after is undefined, shoud throw error', async () => {
    class PluginX extends Plugin {
      constructor() {
        super();

        this.pluginName = 'tags';
        this.field = 'tags';
        this.after = undefined;
      }
      handler({ fieldValue }) {
        return (ctx, next) => {
          ctx.response.body = fieldValue;
        };
      }
    }

    try {
      const { request } = await init({
        apiDoc: './test/plugin/api',
        plugins: [PluginX],
      });
    } catch (error) {
      expect(error);
    }
  });
});
