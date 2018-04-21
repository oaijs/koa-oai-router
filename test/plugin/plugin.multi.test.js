import { init, Plugin } from '../helpers';

describe('Plugin multi', () => {
  it('multi plugin, should success', async () => {
    class PluginX extends Plugin {
      constructor() {
        super();

        this.field = 'parameters';
      }
      handler() {
        const { args } = this;

        return (ctx, next) => {
          ctx.value = args;

          return next();
        };
      }
    }

    class PluginY extends Plugin {
      constructor() {
        super();

        this.field = 'parameters';
      }
      handler() {
        const { args } = this;

        return (ctx, next) => {
          ctx.value += args;

          return next();
        };
      }
    }

    class PluginZ extends Plugin {
      constructor() {
        super();

        this.field = 'parameters';
      }
      handler() {
        const { args } = this;

        return (ctx, next) => {
          ctx.value += args;

          ctx.response.body = ctx.value;
        };
      }
    }

    const { request } = await init({
      apiDoc: './test/plugin/api',
      plugins: [PluginX, PluginY, PluginZ],
      options: {
        PluginX: 'x',
        PluginY: 'y',
        PluginZ: 'z',
      },
    });

    await request
      .get('/api/pets')
      .expect(200)
      .expect('xyz');
  });
});
