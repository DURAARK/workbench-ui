import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  cronHandler: null,
  pollingInterval: 10000,

  _cancelCronJob() {
    let cronHandler = this.get('cronHandler');
    if (cronHandler) {
      this.cron.removeJob(cronHandler);
    }

    // TODO: ask user if she wants to cancel the job in the backend also!
  },

  pollForResult: function(config) {
    let data = {
      tool: this.get('tool'),
      session: this.get('session'),
      digitalObject: this.get('item'),
      tile: this,
      duraark: this.duraark,
      config: config
    };

    let cronHandler = this.cron.addJob(function(data) {
      let that = this;
      return data.duraark.getIFCReconstruction(data.config).then(function(result) {
        let tool = data.tool;

        Ember.set(tool, 'jobId', result.id);

        if (result.status === 'finished') {
          Ember.set(tool, 'jobId', result.id);
          Ember.set(tool, 'downloadUrl', result.downloadUrl);
          Ember.set(tool, 'isLoading', false);
          Ember.set(tool, 'hasData', true);
          Ember.set(tool, 'hasError', false);

          data.tile.set('cronHandler', undefined);
          data.duraark.fixxmeUpdateToolOnServer(data.session, data.digitalObject, tool);

          return true;
        } else if (result.status === 'error') {
          Ember.set(tool, 'jobId', result.id);
          Ember.set(tool, 'isLoading', false);
          Ember.set(tool, 'hasData', false);
          Ember.set(tool, 'hasError', true);

          data.duraark.fixxmeUpdateToolOnServer(data.session, data.digitalObject, tool);

          return true;
        } else if (result.status === 'pending') {
          Ember.set(tool, 'jobId', result.id);
          Ember.set(tool, 'isLoading', true);
          Ember.set(tool, 'hasData', false);
          Ember.set(tool, 'hasError', false);
          data.duraark.fixxmeUpdateToolOnServer(data.session, data.digitalObject, tool);

          return false;
        }
      });
    }, data, this.get('pollingInterval'));

    this.set('cronHandler', cronHandler);
  },

  actions: {
    remove: function(tool) {
      var item = this.get('item');
      this._cancelCronJob();
      Ember.set(tool, 'doRemove', true);
      this.sendAction('remove', item, tool);
    },

    infoClicked: function(tool) {
      var item = this.get('item');
      this.sendAction('infoClicked', item, tool);
    },

    startClicked: function() {
      let filename = this.get('item.path'),
        digitalObject = this.get('item'),
        that = this;

      this.set('tool.hasData', false);
      this.set('tool.isLoading', true);
      this.set('tool.hasError', false);
      this.set('tool.showSlider', false);
      this.set('tool.filename', filename);

      let config = {
        inputFile: filename,
        restart: false
      };

      this.duraark.getIFCReconstruction(config).then(function(result) {
        let session = that.get('session'),
          digitalObject = that.get('item'),
          tool = that.get('tool');

        if (result.status === 'finished') {
          Ember.set(tool, 'jobId', result.id);
          Ember.set(tool, 'downloadUrl', result.downloadUrl);
          Ember.set(tool, 'isLoading', false);
          Ember.set(tool, 'hasData', true);
          Ember.set(tool, 'hasError', false);

          that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);

          return true;
        } else if (result.status === 'error') {
          Ember.set(tool, 'jobId', result.id);
          Ember.set(tool, 'isLoading', false);
          Ember.set(tool, 'hasData', false);
          Ember.set(tool, 'hasError', true);

          that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);

          return true;
        } else if (result.status === 'pending') {
          Ember.set(tool, 'jobId', result.id);
          Ember.set(tool, 'isLoading', true);
          Ember.set(tool, 'hasData', false);
          Ember.set(tool, 'hasError', false);
          that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
          that.pollForResult(config);

          return false;
        }
      });
    }
  }
});
