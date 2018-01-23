async function expectApiExplorer(request, statusCode) {
  return {
    apiExplorer: await request
      .get('/api-explorer')
      .expect(statusCode),

    apiExplorerConfigJson: await request
      .get('/api-explorer-config.json')
      .expect(statusCode),

    apiJson: await request
      .get('/api.json')
      .expect(statusCode),

    swaggerUiCss:
      await request
        .get('/swagger-ui.css')
        .expect(statusCode),

    swaggerUiBundleJs: await request
      .get('/swagger-ui-bundle.js')
      .expect(statusCode),

    swaggerUiStandalonePresetJs: await request
      .get('/swagger-ui-standalone-preset.js')
      .expect(statusCode),
  };
}

export {
  expectApiExplorer,
};
