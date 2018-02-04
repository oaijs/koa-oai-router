import assert from 'assert';
import Debug from 'debug';
import Promise from 'bluebird';

import * as util from './util';
import Plugin from './plugin';
import Container from './container';

const debug = new Debug('koa-oai-router:plugin-register');

class PluginRegister {
  constructor(options) {
    // plugin class name
    this.registerSequence = [];
    // plugin fields
    this.fieldsSequence = {};
    // ioc container
    this.container = new Container();
    // plugin config when new Router({options})
    this.options = options;
  }

  /**
   * Register a plugin.
   * @public
   * @param {class} pluginClass
   * @param {any} args
   */
  async register(pluginClass, args) {
    assert(pluginClass && pluginClass.prototype instanceof Plugin, 'plugin must inherits from class Plugin.');

    const name = util.get(pluginClass, 'name');
    const opts = util.get(this, `options.${name}`, args);

    debug('register new plugin', name, JSON.stringify(opts));

    this.plugin(name, pluginClass);
    this.plugin(name).check();
    this.plugin(name).setArgs(opts);

    await this.plugin(name).init();
  }

  /**
   * set or get a plugin.
   * @private
   * @param {string} name
   * @param {class} pluginClass
   */
  plugin(name, pluginClass) {
    if (name && pluginClass) {
      this.container.set(name, pluginClass);
      this.registerSequence.push(name);

      util.concat(this.fieldsSequence, name, this.container.get(name).field);

      return undefined;
    }

    return this.container.get(name);
  }

  /**
   * Load middlewares.
   * @private
   * @param {object} docOpts
   * @returns {object[]}
   */
  async load(docOpts) {
    const middlewares = await Promise.map(this.registerSequence, async (pluginName) => {
      debug('load', pluginName, docOpts);
      const middlewaresFields = await this.evokedMiddlewares(pluginName, docOpts);
      debug('middlewares fields', middlewaresFields);

      return middlewaresFields;
    });

    return util.compactFlatten(middlewares);
  }

  /**
   * Load evoked middlewares from plugin fields in doc.
   * @private
   * @param {string} pluginName
   * @param {object} docOpts
   */
  async evokedMiddlewares(pluginName, docOpts) {
    const sequences = util.get(this, `fieldsSequence.${pluginName}`, []);
    const operationValue = util.get(docOpts, 'operationValue');
    debug(`evoked sequences: ${pluginName} ${sequences.join()}`);

    const middlewares = await Promise.map(sequences, async (field) => {
      const fieldValue = util.get(operationValue, field);

      // field not evoked
      if (!fieldValue) return null;

      const opts = {
        field,
        fieldValue,
        ...docOpts,
      };

      const middleware = await this.plugin(pluginName).middleware(opts);

      return middleware;
    }, { concurrency: 10 });

    return middlewares;
  }
}

export default PluginRegister;
