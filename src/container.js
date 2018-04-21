import Bottle from 'bottlejs';
import Debug from 'debug';

import { get } from './util';

const debug = new Debug('koa-oai-router:container');

class Container {
  constructor() {
    this.bottle = new Bottle();
  }

  get(name) {
    debug('get', name, this.bottle.list());

    return this.bottle.container[String(name)];
  }

  set(name, pluginClass) {
    debug('before set', name, this.bottle.list());

    this.bottle.service(String(name), pluginClass);

    debug('after set', name, this.bottle.list());
  }

  clear(name) {
    debug('before clear', name, this.bottle.list());

    delete this.bottle.container[String(name)];

    debug('after clear', name, this.bottle.list());
  }

  tempGet(pluginClass, path, def) {
    const randomName = Math.random().toString(36).substr(2);

    this.bottle.service(randomName, pluginClass);

    const value = get(this, `bottle.container.${randomName}.${path}`, def);
    debug('temp', path, value);

    this.clear(randomName);

    return value;
  }
}

export default Container;
