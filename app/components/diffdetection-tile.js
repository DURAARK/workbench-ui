import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  digitalObjects: [],
  fileToCompareWith: null,
  name: 'diffFile',
  showStart: true,

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
        that = this;

      // Select first element as default:
      if (!fileIdBBasename) {
        fileIdBBasename = this.get('choices')[0];
        this.set('fileToCompareWith', fileIdBBasename);
      }

      let fileIdB = this.extractFileIdPath(fileIdA) + fileIdBBasename;

      this.duraark.getDifferenceDetection({
        fileIdA: fileIdA,
        fileIdB: fileIdB
      }).then(function(result) {
        // FIXXME: implement strategy for being updated when job is finished!
        that.set('tool.viewerUrl', result.viewerUrl);
        that.set('tool.hasData', true);
        that.set('tool.isLoading', false);
        that.set('tool.hasError', false);
        that.set('showStart', false);
      });
    }
  }
});
