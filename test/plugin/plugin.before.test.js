import { AssertionError } from 'assert';

import { _, init, Plugin, expectApiExplorer } from '../helpers';

describe('Plugin before', () => {
  it('before is function, shoud be ok', async () => {
    class PluginX extends Plugin {
      constructor() {
        super();

        this.pluginName = 'tags';
        this.field = 'tags';
        this.before = undefined;
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
