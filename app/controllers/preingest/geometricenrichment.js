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
        // FIXXME: refactor and cleanup!

        // FIXXME: delegate this over to duraark-geometricenrichment service!
        if (tool.get('label') === 'Detect Power Lines') {
          // Create new instance of tool to be added to 'geoTools'. It is not
          // possible to directly use the 'tool' instance, as multiple files can
          // have the same tool assigned.
          var t = Ember.Object.create({
            label: tool.get('label'),
            description: tool.get('description'),
            isLoading: false,
            hasError: false,
            hasData: true,
            downloadUrl: null,
            // filename: filename
          });

          t.set('electDetectImages', tool.get('elecDetectImages'));
          t.set('ruleSetImages', tool.get('ruleSetImages'));
          t.set('hypothesisImages', tool.get('hypothesisImages'));

          var digObj = controller.get('selectedDigitalObject'),
            session = controller.get('session');

          // var selectedDigObj = session.get('digitalObjects').find(function(dob) {
          //   return dob.get('label') === digObj.get('label');
          // });
          digObj.get('geoTools').pushObject(t);

          controller.send('save');
          controller.send('showLoadingSpinner', false);
        }

        if (tool.get('label') === 'Reconstruct BIM Model') {
          let filename = selectedDigitalObject.get('path');
          console.log('filename: ' + filename);

          controller.send('showLoadingSpinner', true, 'Scheduling BIM reconstruction ...');

          this.duraark.getIFCReconstruction({
            inputFile: filename,
            restart: false
          }).then(function(pc2bim) {
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
              filename: filename
            });

            // console.log('pc2bim: ' + JSON.stringify(pc2bim, null, 4));

            if (pc2bim.status === 'finished') {
              console.log('IFC reconstruction finished for file: ' + pc2bim.inputFile);
              t.set('isLoading', false);
              t.set('hasError', false);
              t.set('hasData', true);
              t.set('bimDownloadUrl', pc2bim.bimDownloadUrl);
              t.set('wallsDownloadUrl', pc2bim.wallsDownloadUrl);
              selectedDigitalObject.get('derivatives').pushObject({
                path: pc2bim.bimFilePath
              });
            }

            if (pc2bim.status === 'error') {
              t.set('hasError', true);
              t.set('isLoading', false);
              t.set('errorText', pc2bim.errorText);
              t.set('hasData', false);
            }

            if (pc2bim.status === 'pending') {
              t.set('isLoading', true);
              t.set('hasError', false);
              t.set('hasData', false);

              var timer = setInterval(function() {
                console.log('requesting pc2bim status for file: ' + pc2bim.inputFile);
                duraark.getIFCReconstruction({
                  inputFile: filename,
                  restart: false
                }).then(function(pc2bim) {
                  console.log('pc2bim: ' + JSON.stringify(pc2bim, null, 4));

                  if (pc2bim.status === 'finished') {
                    console.log('IFC reconstruction finished for file: ' + pc2bim.inputFile);
                    t.set('isLoading', false);
                    t.set('hasError', false);
                    t.set('hasData', true);
                    t.set('bimDownloadUrl', pc2bim.bimDownloadUrl);
                    t.set('wallsDownloadUrl', pc2bim.wallsDownloadUrl);
                    clearInterval(timer);
                  }

                  if (pc2bim.status === 'pending') {
                    t.set('isLoading', true);
                    t.set('hasError', false);
                    t.set('hasData', false);
                  }

                  if (pc2bim.status === 'error') {
                    t.set('hasError', true);
                    t.set('isLoading', false);
                    t.set('hasData', false);
                    clearInterval(timer);
                  }
                });
              }, 10000);
            }

            var digObj = controller.get('selectedDigitalObject'),
              session = controller.get('session');

            // var selectedDigObj = session.get('digitalObjects').find(function(dob) {
            //   return dob.get('label') === digObj.get('label');
            // });
            digObj.get('geoTools').pushObject(t);

            controller.send('save');
            controller.send('showLoadingSpinner', false);
          });
        }

        // if (derivative) {
        //   selectedDigitalObject.derivatives.push(derivative);
        // }
      }
    },

    removeTool: function(digObj, topic) {
      // Set the 'selectedDigitalObject' property to the file the topic belongs to:
      this.selectDigitalObject(digObj);
      digObj.get('geoTools').removeObject(topic);

      this.send('closeToolUI');
      this.send('save');
    },
  },

  isElectricalApplianceDetectionTool: function() {
    var toolname = this.get('tool.label');
    return (toolname === 'Detect Power Lines' || toolname === 'Extract Floor Plan and Room Information');
  }.property('tool'),

  isIFCReconstructionTool: function() {
    var toolname = this.get('tool.label');
    return (toolname === 'Reconstruct BIM Model');
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
