import { init, expectApiExplorer } from '../helpers';

describe('router.apiExplorerVisible', () => {
  it('apiExplorerVisible = undefined, should have api-explorer', async () => {
    const { request } = await init({
      apiDoc: './test/router/api-yaml',
    });

    const { apiJson } = await expectApiExplorer(request, 200);

    expect(apiJson.body.paths['/pets']).toBeTruthy();
  });

  it('apiExplorerVisible = true, should have api-explorer', async () => {
    const { request } = await init({
      apiDoc: './test/router/api-yaml',
      apiExplorerVisible: true,
    });

    const { apiJson } = await expectApiExplorer(request, 200);

    expect(apiJson.body.paths['/pets']).toBeTruthy();
  });

  it('apiExplorerVisible = false, should not have api-explorer', async () => {
    const { request } = await init({
      apiDoc: './test/router/api-yaml',
      apiExplorerVisible: false,
    });

    await expectApiExplorer(request, 404);
  });
});
