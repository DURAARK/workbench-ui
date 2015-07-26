import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    next: function() {

      // FIXXME: check if everytihng is saved in the buildm-editor and display modal in case of unsaved changes!

      var session = this.get('session');
      this.transitionToRoute('sipgeneration', session);
    },

    back: function() {

      // FIXXME: check if everytihng is saved in the buildm-editor and display modal in case of unsaved changes!

      var session = this.get('session');
      this.transitionToRoute('semanticenrichment', session);
    },

    toggleToolSelection: function(digObj, toolName, isChecked) {
      if (isChecked) {
        console.log('Added "' + toolName + '" on digital object: ' + digObj.label);
      } else {
        console.log('Removed tool "' + toolName + '" on digital object: ' + digObj.label);
      }
    },

    showTopicSelection: function(digObj) {
      this.set('fileInfo', digObj);
    },

    clickedTool: function(tool) {
      var selectedDigitalObject = this.get('fileInfo'),
        currentTools = selectedDigitalObject.get('geoTools');

      var isTopic = currentTools.find(function(item) {
        return tool.get('label') === item.label;
      });

      if (isTopic) {
        currentTools.removeObject(tool);
      } else {
        currentTools.pushObject(tool);
      }

      tool.set('isLoading', true);
      setTimeout(function() {
        tool.set('isLoading', false);
      }, 5000);
    },

    // FIXXME: change name!
    removeTopic: function(digObj, tool) {
      tool.toggleProperty('isSelected');
      tool.set('isLoading', false);
      digObj.get('geoTools').removeObject(tool);
    },

    // FIXXME: change name!
    showSelectedTopic: function(digObj, tool) {
      this.set('fileInfo', null);
      this.set('tool', tool);
    }
  }
});
