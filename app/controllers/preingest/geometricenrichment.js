import Ember from 'ember';
import ENV from '../../config/environment';

var sdaEndpoint = ENV.DURAARKAPI.sda;

export default Ember.Controller.extend({
  actions: {
    save: function() {
      var session = this.get('session');

      session.get('digitalObjects').forEach(function(digObj) {
        // FIXXME: remove ember-data and plain javascript models ASAP!
        if (_.isFunction(digObj.get)) {
          let geoTools = digObj.get('geoTools'),
            tmp = JSON.parse(JSON.stringify(geoTools));
          digObj.set('geoTools', tmp);
        }
      });

      session.save().catch(function(err) {
        throw new Error(err);
      });
    },

    next: function() {
      var session = this.get('session'),
        controller = this;

      session.save().then(function(session) {
        if (session.get('digitalObjects')) {
          controller.unselectDigitalObjects();
        }
        controller.transitionToRoute('preingest.semanticenrichment', session);
      }).catch(function(err) {
        throw new Error(err);
      });
    },

    back: function() {
      var session = this.get('session'),
        controller = this;

      session.save().then(function(session) {
        controller.transitionToRoute('preingest.metadata', session);
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
      this.set('tool', null);
      this.set('selectedDigitalObject', digObj);
      this.toggleDigitalObjectSelection(digObj);
    },

    showToolUI: function(digObj, tool) {
      this.set('tool', tool);
      this.set('selectedDigitalObject', digObj);
      this.selectDigitalObject(digObj);
    },

    closeToolUI: function() {
      this.set('tool', null);
    },

    clickedTool: function(tool) {
      var selectedDigitalObject = this.get('selectedDigitalObject'),
        currentTools = selectedDigitalObject.get('geoTools'),
        controller = this,
        duraark = this.duraark;

      var selectedTool = currentTools.find(function(item) {
        return tool.get('label') === item.label;
      });

      var path = selectedDigitalObject.get('path'),
        derivative = null;

      if (selectedTool) {
        currentTools.removeObject(selectedTool);
        if (derivative) {
          var idx = selectedDigitalObject.derivatives.indexOf(derivative);
          selectedDigitalObject.derivatives.splice(idx, 1);
        }
      } else {
        let filename = selectedDigitalObject.get('path');
        // FIXXME: introduce tool registry!
        if (tool.get('label') === 'Detect Power Lines') {
          this.send('scheduleRISE', tool, filename);
        }

        if (tool.get('label') === 'Reconstruct BIM Model') {
          this.send('scheduleBIMReconstruction', tool, filename);
        }

        if (tool.get('label') === 'Difference Detection') {
          this.send('scheduleDiffDetection', tool, filename);
        }

        if (tool.get('label') === 'Point Cloud Compression') {
          this.send('scheduleCompression', tool, filename);
        }
      }
    },

    removeTool: function(digObj, topic) {
      // Set the 'selectedDigitalObject' property to the file the topic belongs to:
      this.selectDigitalObject(digObj);
      digObj.get('geoTools').removeObject(topic);

      this.send('closeToolUI');
      this.send('save');
    },

    scheduleCompression(tool, filename, removeToolFirst) {
      let controller = this,
        eventId = new Date();

      // controller.send('showLoadingSpinner', true, 'Scheduling difference detection ...');

      controller.send('addPendingEvent', {
        label: 'Scheduled compression',
        displayType: 'info',
        id: eventId
      });

      if (removeToolFirst) {
        let geoTools = controller.get('selectedDigitalObject.geoTools');
        let removeThis = geoTools.findBy('label', 'Point Cloud Compression');
        geoTools.removeObject(removeThis);
      }

      if (!_.isFunction(tool.get)) {
        tool = Ember.Object.create(tool);
        session = controller.get('session');
      }

      // Create new instance of tool to be added to 'geoTools'. It is not
      // possible to directly use the 'tool' instance, as multiple files can
      // have the same tool assigned.
      var t = Ember.Object.create({
        label: tool.get('label'),
        description: tool.get('description'),
        isLoading: true,
        hasError: false,
        hasData: false,
        downloadUrl: null,
        // filename: filename
      });

      // t.set('electDetectImages', tool.get('elecDetectImages'));
      // t.set('ruleSetImages', tool.get('ruleSetImages'));
      // t.set('hypothesisImages', tool.get('hypothesisImages'));

      var digObj = controller.get('selectedDigitalObject');
      digObj.get('geoTools').pushObject(t);

      controller.send('save');
    },

    scheduleDiffDetection(tool, filename, removeToolFirst) {
      let controller = this,
        eventId = new Date();

      // controller.send('showLoadingSpinner', true, 'Scheduling difference detection ...');

      controller.send('addPendingEvent', {
        label: 'Scheduled difference detection',
        displayType: 'info',
        id: eventId
      });

      if (removeToolFirst) {
        let geoTools = controller.get('selectedDigitalObject.geoTools');
        let removeThis = geoTools.findBy('label', 'Difference Detection');
        geoTools.removeObject(removeThis);
      }

      if (!_.isFunction(tool.get)) {
        tool = Ember.Object.create(tool);
        session = controller.get('session');
      }

      // Create new instance of tool to be added to 'geoTools'. It is not
      // possible to directly use the 'tool' instance, as multiple files can
      // have the same tool assigned.
      var t = Ember.Object.create({
        label: tool.get('label'),
        description: tool.get('description'),
        isLoading: true,
        hasError: false,
        hasData: false,
        downloadUrl: null,
        // filename: filename
      });

      // t.set('electDetectImages', tool.get('elecDetectImages'));
      // t.set('ruleSetImages', tool.get('ruleSetImages'));
      // t.set('hypothesisImages', tool.get('hypothesisImages'));

      var digObj = controller.get('selectedDigitalObject');
      digObj.get('geoTools').pushObject(t);

      controller.send('save');
    },

    scheduleRISE(tool, filename, removeToolFirst) {
      let controller = this,
        eventId = new Date();

      controller.send('showLoadingSpinner', true, 'Scheduling power line detection ...');

      controller.send('addPendingEvent', {
        label: 'Scheduled power line detection',
        displayType: 'info',
        id: eventId
      });

      if (removeToolFirst) {
        let geoTools = controller.get('selectedDigitalObject.geoTools');
        let removeThis = geoTools.findBy('label', 'Detect Power Lines');
        geoTools.removeObject(removeThis);
      }

      if (!_.isFunction(tool.get)) {
        tool = Ember.Object.create(tool);
        session = controller.get('session');
      }

      // Create new instance of tool to be added to 'geoTools'. It is not
      // possible to directly use the 'tool' instance, as multiple files can
      // have the same tool assigned.
      var t = Ember.Object.create({
        label: tool.get('label'),
        description: tool.get('description'),
        isLoading: true,
        hasError: false,
        hasData: false,
        downloadUrl: null,
        // filename: filename
      });

      // t.set('electDetectImages', tool.get('elecDetectImages'));
      // t.set('ruleSetImages', tool.get('ruleSetImages'));
      // t.set('hypothesisImages', tool.get('hypothesisImages'));

      var digObj = controller.get('selectedDigitalObject');
      digObj.get('geoTools').pushObject(t);

      controller.send('save');

      // FIXXME: for now give the impression that a processing is taking place on the backend ...
      setTimeout(function() {
        let digObjs = controller.get('digitalObjects'),
          curTool = null,
          myDigObj = null;

        digObjs.forEach(digObj => {
          let tool = digObj.get('geoTools').findBy('label', 'Detect Power Lines');
          // FIXXME: narrow down to current tool!
          if (tool) {
            myDigObj = digObj;
            curTool = tool;

            // FIXXME: the first time an object is created it is no ember object. Find out why!
            // This workaround fixes that:
            if (!_.isFunction(curTool.get)) {
              myDigObj.get('geoTools').removeObject(curTool);
              curTool = Ember.Object.create(curTool);
              myDigObj.get('geoTools').pushObject(curTool);
            }
          }
        });

        if (curTool) {
          // FIXXME: To get the bindings to correctly fire the tool has to be removed and added again.
          // Otherwise setting e.g. the tool's 'isLoading' property does not reflect in the GUI.
          myDigObj.get('geoTools').removeObject(curTool);
          myDigObj.get('geoTools').pushObject(curTool);
        } else {
          throw new Error('this should not happen, investigate!');
        }

        curTool.set('isLoading', false);
        curTool.set('hasError', false);
        curTool.set('hasData', true);

        controller.send('save');

        controller.duraark.getFloorPlanData(filename).then(data => {
          controller.set('wallConfig', data);
        }).catch(err => {
          controller.set('wallConfig', false);
        });

        controller.send('addFinishedEvent', {
          label: 'Finished power line detection',
          displayType: 'success',
          id: eventId
        });
      }, 500);

      controller.send('showLoadingSpinner', false);
    },

    scheduleBIMReconstruction(tool, filename, removeToolFirst) {
      let controller = this,
        eventId = new Date();

      if (removeToolFirst) {
        let geoTools = controller.get('selectedDigitalObject.geoTools');
        let removeThis = geoTools.findBy('label', 'Reconstruct BIM Model');
        geoTools.removeObject(removeThis);
      }

      // FIXXME: fix duality!
      if (!_.isFunction(tool.get)) {
        tool.set('filename', filename); // ?
        tool = Ember.Object.create(tool);
      } else {
        tool.set('filename', filename);
      }

      tool.set('isLoading', true);
      tool.set('hasError', false);
      tool.set('hasData', false);

      controller.get('selectedDigitalObject.geoTools').pushObject(tool);

      controller.send('showLoadingSpinner', true, 'Scheduling BIM reconstruction ...');

      controller.send('addPendingEvent', {
        label: 'Scheduled BIM reconstruction: ' + filename.split('/').pop(),
        displayType: 'info',
        id: eventId
      });

      this.duraark.getIFCReconstruction({
        inputFile: filename,
        restart: false
      }).then(function(pc2bim) {
        if (!pc2bim) {
          pc2bim = {};
        }

        // Create new instance of tool to be added to 'geoTools'. It is not
        // possible to directly use the 'tool' instance, as multiple files can
        // have the same tool assigned.
        var t = Ember.Object.create({
          label: tool.get('label'),
          description: tool.get('description'),
          isLoading: true,
          hasError: false,
          hasData: false,
          downloadUrl: null,
          filename: pc2bim.inputFile
        });

        let digObjs = controller.get('digitalObjects'),
          myDigObj = null;

        digObjs.forEach(digObj => {
          let tool = digObj.get('geoTools').findBy('label', 'Reconstruct BIM Model');
          if (tool && tool.get('filename') === pc2bim.inputFile) {
            myDigObj = digObj;

            digObj.get('geoTools').removeObject(tool);
          }
        });

        if (!myDigObj) {
          throw new Error('no digObj found!');
        }

        // console.log('pc2bim: ' + JSON.stringify(pc2bim, null, 4));
        if (pc2bim.status === 'finished') {
          console.log('IFC reconstruction finished for file: ' + pc2bim.inputFile);

          t.set('isLoading', false);
          t.set('hasError', false);
          t.set('hasData', true);
          t.set('bimDownloadUrl', pc2bim.bimDownloadUrl);
          t.set('wallsDownloadUrl', pc2bim.wallsDownloadUrl);

          // controller.get('selectedDigitalObject.derivatives').pushObject({
          myDigObj.get('derivatives').pushObject({
            path: pc2bim.bimFilePath
          });

          controller.send('save');

          controller.send('addFinishedEvent', {
            label: 'Finished BIM reconstruction: ' + pc2bim.inputFile.split('/').pop(),
            displayType: 'success',
            id: eventId
          });
        }

        if (pc2bim.status === 'error') {
          t.set('hasError', true);
          t.set('isLoading', false);
          t.set('errorText', pc2bim.errorText);
          t.set('hasData', false);

          controller.get('selectedDigitalObject.geoTools').pushObject(t);

          controller.send('addFinishedEvent', {
            label: 'BIM reconstruction failure: ' + pc2bim.inputFile.split('/').pop(),
            displayType: 'error',
            id: eventId
          });
        }

        if (pc2bim.status === 'pending') {
          t.set('isLoading', true);
          t.set('hasError', false);
          t.set('hasData', false);

          var timer = setInterval(function() {
            console.log('requesting pc2bim status for file: ' + pc2bim.inputFile);
            controller.duraark.getIFCReconstruction({
              inputFile: filename,
              restart: false
            }).then(function(pc2bim) {
              let digObjs = controller.get('digitalObjects'),
                curTool = null,
                myDigObj = null;

              digObjs.forEach(digObj => {
                let tool = digObj.get('geoTools').findBy('label', 'Reconstruct BIM Model');
                if (tool && tool.filename === pc2bim.inputFile) {
                  myDigObj = digObj;
                  curTool = tool;

                  // FIXXME: the first time an object is created it is no ember object. Find out why!
                  // This workaround fixes that:
                  if (!_.isFunction(curTool.get)) {
                    myDigObj.get('geoTools').removeObject(curTool);
                    curTool = Ember.Object.create(curTool);
                    myDigObj.get('geoTools').pushObject(curTool);
                  }
                }
              });

              // console.log('pc2bim: ' + JSON.stringify(pc2bim, null, 4));
              // pc2bim.status = 'finished';

              if (pc2bim.status === 'finished') {
                console.log('IFC reconstruction finished for file: ' + pc2bim.inputFile);
                curTool.set('isLoading', false);
                curTool.set('hasError', false);
                curTool.set('hasData', true);
                curTool.set('bimDownloadUrl', pc2bim.bimDownloadUrl);
                curTool.set('wallsDownloadUrl', pc2bim.wallsDownloadUrl);
                clearInterval(timer);

                myDigObj.get('derivatives').pushObject({
                  path: pc2bim.bimFilePath
                });

                controller.send('save');

                controller.send('addFinishedEvent', {
                  label: 'Finished BIM reconstruction: ' + pc2bim.inputFile.split('/').pop(),
                  displayType: 'success',
                  id: eventId
                });
              }

              if (pc2bim.status === 'pending') {
                curTool.set('isLoading', true);
                curTool.set('hasError', false);
                curTool.set('hasData', false);
              }

              if (pc2bim.status === 'error') {
                curTool.set('hasError', true);
                curTool.set('isLoading', false);
                curTool.set('hasData', false);
                clearInterval(timer);

                controller.send('addFinishedEvent', {
                  label: 'BIM reconstruction failure: ' + pc2bim.inputFile.split('/').pop(),
                  displayType: 'error',
                  id: eventId
                });
              }
            });
          }, 20000);
        }
      });

      // controller.send('save');
      controller.send('showLoadingSpinner', false);
    }
  },

  isElectricalApplianceDetectionTool: function() {
    let toolname = this.get('tool.label');
    return (toolname === 'Detect Power Lines' || toolname === 'Extract Floor Plan and Room Information');
  }.property('tool'),

  isIFCReconstructionTool: function() {
    let toolname = this.get('tool.label');
    return (toolname === 'Reconstruct BIM Model');
  }.property('tool'),

  isDifferenceDetectionTool: function() {
    let toolname = this.get('tool.label');
    return (toolname === 'Difference Detection');
  }.property('tool'),

  isCompressionTool: function() {
    let toolname = this.get('tool.label');
    return (toolname === 'Poinc Cloud Compression');
  }.property('tool'),

  tools: function() {
    // Bail out if no digital object is selected:
    if (!this.get('selectedDigitalObject')) {
      return;
    }

    // return this.get('allTools');

    let allTools = this.get('allTools'),
      configuredTools = this.get('session.config.geometricenrichment.tools'),
      selectedDigitalObject = this.get('selectedDigitalObject'),
      digObjTools = selectedDigitalObject.get('geoTools'),
      shownTools = [];

    // NOTE: we enable all tools for all datasets, bypassing the custom config
    // in disabling this code block:
    // configuredTools.forEach(function(myTool) {
    //   var tool = allTools.find(function(tool, index, enumerable) {
    //     return myTool === tool.get('label');
    //   });
    //   shownTools.push(tool);
    // });
    shownTools = allTools;

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
  }.property('session.config', 'selectedDigitalObject.geoTools.[]'),

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
    this.get('digitalObjects').forEach(function(obj) {
      obj.set('isSelected', false);
    });
  }
});
