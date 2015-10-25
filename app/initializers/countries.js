export function initialize(container, app) {
  app.inject('adapter', 'countries', 'service:countries');
  app.inject('route', 'countries', 'service:countries');
  app.inject('controller', 'countries', 'service:countries');
  app.inject('component', 'countries', 'service:countries');
}

export default {
  name: 'countries',
  initialize: initialize
};
