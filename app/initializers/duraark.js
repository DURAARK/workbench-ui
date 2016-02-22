export function initialize(container, app) {
  app.inject('adapter', 'duraark', 'service:duraark');
  app.inject('route', 'duraark', 'service:duraark');
  app.inject('controller', 'duraark', 'service:duraark');
  app.inject('component', 'duraark', 'service:duraark');
  app.inject('helper', 'duraark', 'service:duraark');
}

export default {
  name: 'duraark',
  initialize: initialize
};
