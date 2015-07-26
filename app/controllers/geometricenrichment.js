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

    showToolSelection: function(digObj) {
      this.set('fileInfo', digObj);
    },

    clickedTool: function(tool) {
      var selectedDigitalObject = this.get('fileInfo'),
        currentTools = selectedDigitalObject.get('geoTools');

      var isTool = currentTools.find(function(item) {
        return tool.get('label') === item.label;
      });

      if (isTool) {
        currentTools.removeObject(tool);
      } else {
        currentTools.pushObject(tool);

        tool.set('isLoading', true);
        setTimeout(function() {
          tool.set('isLoading', false);
        }, 1000);
      }
    },

    removeTool: function(digObj, tool) {
      tool.toggleProperty('isSelected');
      tool.set('isLoading', false);
      digObj.get('geoTools').removeObject(tool);

      // if (!digObj.get('geoTools').get('length')) {
      //   this.set('fileInfo', null);
      // this.set('tool', null);
      // }
    },

    // FIXXME: change name!
    showSelectedTool: function(digObj, tool) {
      this.set('fileInfo', null);
      this.set('tool', tool);
    },

    showToolInfo: function(digObj, tool) {
      console.log('tool: ' + tool);
    }
  },

  isElectricalApplianceDetectionTool: function() {
    var toolname = this.get('tool.label');
    return (toolname === 'Electrical Appliance Detection');
  }.property('tool'),

  isIFCReconstructionTool: function() {
    var tool = this.get('tool');
    return (tool.get('label') === 'IFC Reconstruction');
  }.property('tool'),


});
