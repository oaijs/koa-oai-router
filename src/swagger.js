import fs from 'fs';
import { absolutePath } from 'swagger-ui-dist';

import * as util from './util';

const files = {};
const filesInfo = {
  index: 'index.html',
  uiCss: 'swagger-ui.css',
  bundleJs: 'swagger-ui-bundle.js',
  presetJs: 'swagger-ui-standalone-preset.js',
};

util.each(filesInfo, (fileName, alias) => {
  let content = fs.readFileSync(`${absolutePath()}/${fileName}`).toString();

  if (alias === 'index') {
    const oldSegment = /url: "(http|https):\/\/petstore\.swagger\.io\/v2\/swagger\.json",/;
    const newSegment = 'configUrl: "./api-explorer-config.json",';
    content = content.replace(oldSegment, newSegment);
  }

  files[alias] = content;
});

export default files;
