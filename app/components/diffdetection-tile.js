import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  digitalObjects: [],
  choices: function() {
    let that = this;
    return this.get('digitalObjects').filter(function(item) {
      return item.path !== that.get('item.path');
    }).map(function(item) {
      return item.path.split('/').pop();
    });
  }.property('digitalObjects'),
  fileToCompareWith: null,
  name: 'diffFile',
  showStart: true,

  onFileToCompareWithChanged: function() {
    let fileToCompareWith = this.get('fileToCompareWith');
    console.log('fileToCompareWith: ' + fileToCompareWith);
  }.observes('fileToCompareWith'),

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
      let fileToCompareWith = this.get('fileToCompareWith'),
        that = this;

      // Select first element as default:
      if (!fileToCompareWith) {
        fileToCompareWith = this.get('choices')[0];
        this.set('fileToCompareWith', fileToCompareWith);
      }

      this.duraark.getDifferenceDetection({
        fileIdA: this.get('item.path'),
        fileIdB: fileToCompareWith
      }).then(function() {
        that.set('tool.hasData', true);
        that.set('tool.isLoading', false);
        that.set('tool.hasError', false);
        that.set('showStart', false);
      });
    }
  }
});
