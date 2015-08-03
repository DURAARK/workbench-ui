import Ember from 'ember';
import ENV from '../config/environment';

var sdaEndpoint = ENV.DURAARKAPI.sda;

export default Ember.Controller.extend({
  actions: {
    save: function() {
      var session = this.get('session');
      session.save().catch(function(err) {
        throw new Error(err);
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
      this.set('selectedDigitalObject', digObj);
      this.toggleDigitalObjectSelection(digObj);
    },

    clickedTool: function(tool) {
      var selectedDigitalObject = this.get('selectedDigitalObject'),
        currentTools = selectedDigitalObject.get('geoMD.tools');

      var selectedTool = currentTools.find(function(item) {
        return tool.get('label') === item.label;
      });

      if (selectedTool) {
        currentTools.removeObject(selectedTool);
      } else {
        // Create new instance of tool to be added to 'geoMD.tools'. It is not
        // possible to directly use the 'tool' instance, as multiple files can
        // have the same tool assigned.
        var t = Ember.Object.create({
          label: tool.get('label'),
          description: tool.get('description')
        });
        currentTools.pushObject(t);
      }

      this.send('save');
    },

    removeTool: function(digObj, topic) {
      // Set the 'selectedDigitalObject' property to the file the topic belongs to:
      this.selectDigitalObject(digObj);

      digObj.get('geoMD.tools').removeObject(topic);
    },

    showSelectedTool: function(digObj, tool) {
      this.set('fileInfo', null);
      this.set('tool', tool);
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

  tools: function() {
    // Bail out if no digital object is selected:
    if (!this.get('selectedDigitalObject')) {
      return;
    }

    let allTools = this.get('allTools'),
      configuredTools = this.get('session.config.geometricenrichment.tools'),
      selectedDigitalObject = this.get('selectedDigitalObject'),
      digObjTools = selectedDigitalObject.get('geoMD.tools'),
      shownTools = [];

    configuredTools.forEach(function(myTool) {
      var tool = allTools.find(function(tool, index, enumerable) {
        return myTool === tool.get('label');
      });
      shownTools.push(tool);
    });

    // Set selection state based on selected file:
    shownTools.forEach(function(shownTool, index, enumerable) {
      var curFileTool = digObjTools.find(function(fileTool, index, enumerable) {
        return fileTool.label === shownTool.get('label');
      });

      // If the file contains the tool from the selection set the selection
      // state in the shown tool accordingly:
      if (curFileTool) {
        shownTool.set('isSelected', true);
      } else {
        shownTool.set('isSelected', false);
      }
    });

    return shownTools;
  }.property('session.config', 'selectedDigitalObject.geoMD.tools.@each'),

  toggleDigitalObjectSelection: function(digObj) {
    var flag = digObj.get('isSelected');

    this.get('digitalObjects').forEach(function(obj) {
      obj.set('isSelected', false);
    });

    digObj.set('isSelected', !flag);

    this.set('selectedDigitalObject', digObj);

    if (digObj.get('isSelected') === false) {
      this.set('selectedDigitalObject', null);
    }
  },

  selectDigitalObject: function(digObj) {
    var flag = digObj.get('isSelected');

    if (flag) return;

    this.get('digitalObjects').forEach(function(obj) {
      obj.set('isSelected', false);
    });

    digObj.set('isSelected', true);
    this.set('selectedDigitalObject', digObj);
  }
});
