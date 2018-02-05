import { AssertionError } from 'assert';

import { init, Plugin } from '../helpers';

describe('Plugin name', () => {
  it('name is string, shoud be ok', async () => {
    class PluginX extends Plugin {
      constructor() {
        super();

        this.pluginName = 'parameters';
        this.field = 'parameters';
      }
      handler() {
        return (ctx, next) => {
          ctx.response.body = '1234';
        };
      }
    }

    const { request } = await init({
      apiDoc: './test/plugin/api',
      plugins: [PluginX],
    });

    await request.get('/api/pets')
      .expect(200)
      .expect('1234');
  });

  it('name is invalid, shoud throw error', async () => {
    try {
      class PluginX extends Plugin {
        constructor() {
          super();

          this.pluginName = 1234;
          this.field = 'parameters';
        }
        handler() {
          return (ctx, next) => {
            ctx.response.body = '1234';
          };
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

  it('name is undefined, shoud should use class name', async () => {
    class PluginX extends Plugin {
      constructor() {
        super();

        // this.pluginName = 1234;
        this.field = 'parameters';
      }
      handler() {
        const args = this.args;

        return (ctx, next) => {
          ctx.response.body = args;
        };
      }
    }

    const { request } = await init({
      apiDoc: './test/plugin/api',
      options: {
        PluginX: '1234',
      },
      plugins: [PluginX],
    });

    await request
      .get('/api/pets')
      .expect('1234');
  });
});
