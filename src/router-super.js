import util from 'util';
import events from 'events';
import Router from 'koa-router';

util.inherits(Router, events.EventEmitter);

export default Router;
