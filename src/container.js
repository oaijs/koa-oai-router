import Bottle from 'bottlejs';

class Container {
  constructor() {
    this.bottle = new Bottle();
  }

  get(name) {
    return this.bottle.container[name];
  }

  set(name, pluginClass) {
    this.bottle.service(name, pluginClass);
  }
}

export default Container;
