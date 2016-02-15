import Ember from 'ember';

export default Ember.Component.extend({
  pollingInterval: 2000,
  cronHandler: null,

  viewerUrl: function() {
      return 'http://' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + '/api/v0.7/geometricenrichment' + this.get('tool.viewerUrl');
  }.property('tool'),

  pollForResult: function(files) {
    let data = {
      tool: this.get('tool'),
      session: this.get('session'),
      digitalObject: this.get('item'),
      tile: this,
      duraark: this.duraark
    };

    let cronHandler = this.cron.addJob(function(data) {
      let that = this;
      return data.duraark.getDifferenceDetection({
        fileIdA: files.fileIdA,
        fileIdB: files.fileIdB
      }).then(function(result) {
        let tool = data.tool;

        Ember.set(tool, 'jobId', result.id);
        Ember.set(tool, 'fileIdA', files.fileIdA);
        Ember.set(tool, 'fileIdB', files.fileIdB);

        if (result.status === 'finished') {
          Ember.set(tool, 'viewerUrl', result.viewerUrl);
          Ember.set(tool, 'isLoading', false);
          Ember.set(tool, 'hasData', true);
          Ember.set(tool, 'hasError', false);

          data.tile.set('cronHandler', undefined);

          data.duraark.fixxmeUpdateToolOnServer(data.session, data.digitalObject, tool);

          return true;
        } else if (result.status === 'error') {
          Ember.set(tool, 'isLoading', false);
          Ember.set(tool, 'hasData', false);
          Ember.set(tool, 'hasError', true);
          Ember.set(tool, 'errorText', result.errorText);
          Ember.set(tool, 'showStartButton', false);

          data.duraark.fixxmeUpdateToolOnServer(data.session, data.digitalObject, tool);

          return true;
        } else if (result.status === 'pending') {
          Ember.set(tool, 'isLoading', true);
          Ember.set(tool, 'hasData', false);
          Ember.set(tool, 'hasError', false);

          return false;
        }
      });
    }, data, this.get('pollingInterval'));

    this.set('cronHandler', cronHandler);
  },

  actions: {
    restartTool: function() {
      let files = {
        fileIdA: this.get('tool.fileIdA'),
        fileIdB: this.get('tool.fileIdB'),
        restart: true
      },
      tool = this.get('tool'),
      that = this;

      this.duraark.getDifferenceDetection(files).then(function(result) {
        let session = that.get('session'),
          digitalObject = that.get('item');

        if (result.status === 'finished') {
          Ember.run(function() {
            Ember.set(tool, 'jobId', result.id);
            Ember.set(tool, 'viewerUrl', result.viewerUrl);
            Ember.set(tool, 'isLoading', false);
            Ember.set(tool, 'hasData', true);
            Ember.set(tool, 'hasError', false);

            that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
          });
        } else if (result.status === 'error') {
          Ember.run(function() {
            Ember.set(tool, 'jobId', result.id);
            Ember.set(tool, 'isLoading', false);
            Ember.set(tool, 'hasData', false);
            Ember.set(tool, 'hasError', true);
            Ember.set(tool, 'errorText', result.errorText);
            Ember.set(tool, 'showStartButton', false);
            that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
          });
        } else if (result.status === 'pending') {
          Ember.run(function() {
            Ember.set(tool, 'jobId', result.id);
            Ember.set(tool, 'isLoading', true);
            Ember.set(tool, 'hasData', false);
            Ember.set(tool, 'hasError', false);
            that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
            that.pollForResult(files);
          });
        }
      });
    }
  }
});
