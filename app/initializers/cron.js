export function initialize(container, app) {
  app.inject('controller', 'cron', 'service:cron');
  app.inject('component', 'cron', 'service:cron');
}

export default {
  name: 'cron',
  initialize: initialize
};
