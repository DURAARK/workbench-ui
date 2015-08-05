import Ember from 'ember';
import ENV from '../config/environment';

var sdaEndpoint = ENV.DURAARKAPI.sda;

export default Ember.Controller.extend({
  actions: {
    save: function() {
      var session = this.get('session');

      session.get('digitalObjects').forEach(function(digObj) {
        // FIXXME: remove ember-data and plain javascript models ASAP!
        if (_.isFunction(digObj.get)) {
          let geoMD = digObj.get('geoMD'),
            tmp = JSON.parse(JSON.stringify(geoMD));
          digObj.set('geoMD', tmp);
        }
      });

      session.save().catch(function(err) {
        throw new Error(err);
      });
    },

    next: function() {
      var session = this.get('session'),
        controller = this;

      session.get('digitalObjects').forEach(function(digObj) {
        // FIXXME: remove ember-data and plain javascript models ASAP!
        if (_.isFunction(digObj.get)) {
          let geoMD = digObj.get('geoMD'),
            tmp = JSON.parse(JSON.stringify(geoMD));
          digObj.set('geoMD', tmp);
        }
      });

      session.save().then(function(session) {
        controller.unselectDigitalObjects();
        controller.transitionToRoute('digitalpreservation', session);
      }).catch(function(err) {
        throw new Error(err);
      });
    },

    back: function() {
      var session = this.get('session'),
        controller = this;

      session.get('digitalObjects').forEach(function(digObj) {
        // FIXXME: remove ember-data and plain javascript models ASAP!
        if (_.isFunction(digObj.get)) {
          let geoMD = digObj.get('geoMD'),
            tmp = JSON.parse(JSON.stringify(geoMD));
          digObj.set('geoMD', tmp);
        }
      });

      session.save().then(function(session) {
        controller.transitionToRoute('semanticenrichment', session);
      }).catch(function(err) {
        throw new Error(err);
      });
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

    showToolInfo: function(tool) {
      this.set('selectedDigitalObject', null);
      this.set('tool', tool);
    },

    clickedTool: function(tool) {
      var selectedDigitalObject = this.get('selectedDigitalObject'),
        currentTools = selectedDigitalObject.get('geoMD.tools');

      var selectedTool = currentTools.find(function(item) {
        return tool.get('label') === item.label;
      });

      var path = selectedDigitalObject.get('path'),
        derivative = null;

      // FIXXME!
      if (tool.get('label') === 'IFC Reconstruction') {
        if (path.endsWith('Nygade_Scan1001.e57')) {
          derivative = {
            path: '/duraark-storage/files/Nygade_Scan1001_RECONSTRUCTED.ifc'
          };
        } else if (path.endsWith('Plan3D_OG_subsampled.e57')) {
          derivative = {
            path: '/duraark-storage/files/Plan3D_OG_subsampled_RECONSTRUCTED.ifc'
          };
        }
      }

      if (selectedTool) {
        currentTools.removeObject(selectedTool);
        if (derivative) {
          var idx = selectedDigitalObject.derivatives.indexOf(derivative);
          selectedDigitalObject.derivatives.splice(idx, 1);
        }
      } else {
        // Create new instance of tool to be added to 'geoMD.tools'. It is not
        // possible to directly use the 'tool' instance, as multiple files can
        // have the same tool assigned.
        var t = Ember.Object.create({
          label: tool.get('label'),
          description: tool.get('description')
        });

        // FIXXME: delegate this over to duraark-geometricenrichment service!
        if (t.get('label') === 'Electrical Appliance Detection') {
          t.set('electDetectImages', tool.get('elecDetectImages'));
          t.set('ruleSetImages', tool.get('ruleSetImages'));
          t.set('hypothesisImages', tool.get('hypothesisImages'));
        }
        currentTools.pushObject(t);

        if (derivative) {
          selectedDigitalObject.derivatives.push(derivative);
        }
      }

      // this.send('save');
    },

    removeTool: function(digObj, topic) {
      // Set the 'selectedDigitalObject' property to the file the topic belongs to:
      this.selectDigitalObject(digObj);

      digObj.get('geoMD.tools').removeObject(topic);

      // this.send('save');
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
  },

  unselectDigitalObjects: function() {
    debugger;
    this.get('digitalObjects').forEach(function(obj) {
      obj.set('isSelected', false);
    });
  }
});
