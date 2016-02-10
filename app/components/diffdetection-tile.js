import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  digitalObjects: [],
  fileToCompareWith: null,
  pollingInterval: 10000,

  didInsertElement: function() {
    this.set('tool.hasData', false);
    this.set('tool.isLoading', false);
    this.set('tool.hasError', false);
    this.set('tool.showStart', true);
  },

  choices: function() {
    let that = this;
    return this.get('digitalObjects').filter(function(item) {
      return item.path !== that.get('item.path');
    }).map(function(item) {
      return item.path.split('/').pop();
    });
  }.property('digitalObjects'),

  extractFileIdPath: function(fileId) {
    let fileIdBasename = fileId.split('/').pop();
    return fileId.substring(0, fileId.length - fileIdBasename.length);
  },

  willDestroy: function() {
    let cronHandler = this.get('cronHandler');
    if (cronHandler) {
      this.cron.removeJob(cronHandler);
    }

    // TODO: ask user if she wants to cancel the job in the backend also!
  },

  pollForResult: function(files) {
    let data = {
      tool: this.get('tool'),
      duraark: this.duraark,
      tile: this
    };

    let cronHandler = this.cron.addJob(function(data) {
      return data.duraark.getDifferenceDetection({
        fileIdA: files.fileIdA,
        fileIdB: files.fileIdB
      }).then(function(result) {
        if (result.status === 'finished') {
          Ember.set(data.tool, 'viewerUrl', result.viewerUrl);
          Ember.set(data.tool, 'isLoading', false);
          Ember.set(data.tool, 'hasData', true);
          Ember.set(data.tool, 'hasError', false);

          data.tile.set('cronHandler', undefined);

          return true;
        } else if (result.status === 'error') {
          Ember.set(data.tool, 'isLoading', false);
          Ember.set(data.tool, 'hasData', false);
          Ember.set(data.tool, 'hasError', true);
          Ember.set(data.tool, 'errorText', result.errorText);
          Ember.set(data.tool, 'showStart', false);

          return true;
        } else if (result.status === 'pending') {
          Ember.set(data.tool, 'isLoading', true);
          Ember.set(data.tool, 'hasData', false);
          Ember.set(data.tool, 'hasError', false);

          return false;
        }
      });
    }, data, this.get('pollingInterval'));

    this.set('cronHandler', cronHandler);
  },

  actions: {
    remove: function(tool) {
      var item = this.get('item');
      this.sendAction('remove', item, tool);
    },

    infoClicked: function(tool) {
      var item = this.get('item');
      this.sendAction('infoClicked', item, tool);
    },

    startClicked: function() {
      let fileIdA = this.get('item.path'),
        fileIdBBasename = this.get('fileToCompareWith'),
        tool = this.get('tool'),
        that = this;

      // Select first element as default:
      if (!fileIdBBasename) {
        fileIdBBasename = this.get('choices')[0];
        this.set('fileToCompareWith', fileIdBBasename);
      }

      let fileIdB = this.extractFileIdPath(fileIdA) + fileIdBBasename;

      this.set('tool.hasData', false);
      this.set('tool.isLoading', true);
      this.set('tool.hasError', false);
      this.set('tool.showStart', false);

      let files = {
        fileIdA: fileIdA,
        fileIdB: fileIdB
      };

      this.duraark.getDifferenceDetection(files).then(function(result) {
        if (result.status === 'finished') {
          Ember.set(tool, 'viewerUrl', result.viewerUrl);
          Ember.set(tool, 'isLoading', false);
          Ember.set(tool, 'hasData', true);
          Ember.set(tool, 'hasError', false);

          return true;
        } else if (result.status === 'error') {
          Ember.set(tool, 'isLoading', false);
          Ember.set(tool, 'hasData', false);
          Ember.set(tool, 'hasError', true);
          Ember.set(tool, 'errorText', result.errorText);
          Ember.set(tool, 'showStart', false);

          return true;
        } else if (result.status === 'pending') {
          Ember.set(tool, 'isLoading', true);
          Ember.set(tool, 'hasData', false);
          Ember.set(tool, 'hasError', false);

          that.pollForResult(files);

          return false;
        }
      });
    }
  }
});
