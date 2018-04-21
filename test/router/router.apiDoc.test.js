import { AssertionError } from 'assert';
import { init, expectApiExplorer } from '../helpers';

describe('router.apiDoc', () => {
  it('apiDoc undefined, should throw error', async () => {
    try {
      await init({
        // apiDoc: undefined,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(AssertionError);
    }
  });

  it('apiDoc invalid directory, should throw error', async () => {
    try {
      await init({
        apiDoc: './test/router/api-yaml-404',
      });
    } catch (error) {
      expect(error.message).toMatch('ENOENT');
    }
  });

  it('apiDoc invalid split, should throw error', async () => {
    try {
      await init({
        apiDoc: './test/router/api-invalid-split',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
    }
  });

  it('apiDoc bundled file no extension, should be ok', async () => {
    const { request } = await init({
      apiDoc: './test/router/api',
    });

    await expectApiExplorer(request, 200);
  });

  it('apiDoc bundled yaml directory , should be ok', async () => {
    const { request } = await init({
      apiDoc: './test/router/api-yaml',
    });

    await expectApiExplorer(request, 200);
  });

  it('apiDoc split yaml directory, should be ok', async () => {
    const { request } = await init({
      apiDoc: './test/router/api-yaml-split',
    });

    await expectApiExplorer(request, 200);
  });

  it('apiDoc bundled json directory , should be ok', async () => {
    const { request } = await init({
      apiDoc: './test/router/api-json',
    });

    await expectApiExplorer(request, 200);
  });

  it('apiDoc split json directory, should be ok', async () => {
    const { request } = await init({
      apiDoc: './test/router/api-json-split',
    });

    await expectApiExplorer(request, 200);
  });
});
