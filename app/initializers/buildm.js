export function initialize(container, app) {
  app.inject('adapter', 'buildm', 'service:buildm');
  app.inject('route', 'buildm', 'service:buildm');
  app.inject('controller', 'buildm', 'service:buildm');
  app.inject('component', 'buildm', 'service:buildm');
}

export default {
  name: 'buildm',
  initialize: initialize
};
