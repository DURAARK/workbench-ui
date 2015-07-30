import Ember from 'ember';
import ENV from '../config/environment';

var sdaEndpoint = ENV.DURAARKAPI.sda;

export default Ember.Controller.extend({
  actions: {
    save: function() {
      var session = this.get('session');
      session.save().catch(function(err) {
        throw new Error(err)
      });
    },

    next: function() {
      var session = this.get('session');
      this.transitionToRoute('digitalpreservation', session);
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
      var selectedDigitalObject = this.get('fileInfo');
      // selectedDigitalObject.set('geoMD.tools', Ember.A());
      var digObjTools = selectedDigitalObject.get('geoMD.tools');
debugger;
      var isTool = digObjTools.find(function(item) {
        return tool.get('label') === item.label;
      });

      if (isTool) {
        digObjTools.removeObject(tool);
      } else {
        digObjTools.pushObject(tool);
      }

      tool.set('isLoading', true);
      setTimeout(function() {
        tool.set('isLoading', false);
      }, 1000);

        var session = this.get('session');
      selectedDigitalObject.set('geoMD.tools', digObjTools);

      this.send('save');
      // }
    },

    removeTool: function(digObj, tool) {
      // tool.toggleProperty('isSelected');
      tool.set('isSelected', false);
      tool.set('isLoading', false);
      digObj.get('geoMD.tools').removeObject(tool);

      // if (!digObj.get('geoMD.tools').get('length')) {
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
