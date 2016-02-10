import Ember from 'ember';

export default Ember.Service.extend({
  jobs: [],

  addJob(callback, data, interval) {
    console.log('[cron] Scheduling new job at interval: ' + interval);

    let desc = {
      interval: interval,
      callback: callback,
      data: data
    }

    let handler = setInterval(function() {
      callback(data).then(function(flag) {
        if (flag) {
          clearInterval(handler);
        }
      });
    }, interval);

    return handler;
  },

  removeJob(handler) {
    clearInterval(handler);
  }
});
