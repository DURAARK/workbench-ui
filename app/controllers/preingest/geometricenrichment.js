import Ember from 'ember';
import ENV from '../../config/environment';

var sdaEndpoint = ENV.DURAARKAPI.sda;

export default Ember.Controller.extend({
  pollingInterval: 10000,
  cronHandlerPC2BIM: null,
  cronHandlerCompression: null,
  cronHandlerDifferenceDetection: null,

  pollForDifferenceDetectionResult: function(files, digitalObject, tool) {
    let data = {
      files: files,
      tool: tool,
      session: this.get('session'),
      digitalObject: digitalObject,
      duraark: this.duraark,
      controller: this
    };

    let cronHandler = this.cron.addJob(function(data) {
      return data.duraark.getDifferenceDetection({
        fileIdA: files.fileIdA,
        fileIdB: files.fileIdB
      }).then(function(result) {
        let tool = data.tool,
          session = data.session,
          digitalObject = data.digitalObject,
          controller = data.controller;

        // FIXXME: introduce DifferenceDetectionTool object to do such things!
        if (tool.get('doRemove')) {
          controller.cron.removeJob(controller.get('cronHandlerDifferenceDetection'));
          tool.set('doRemove', false);
          data.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
          return;
        }

        Ember.set(tool, 'jobId', result.id);
        Ember.set(tool, 'fileIdA', files.fileIdA);
        Ember.set(tool, 'fileIdB', files.fileIdB);

        if (result.status === 'finished') {
          Ember.set(tool, 'viewerUrl', result.viewerUrl);
          Ember.set(tool, 'isLoading', false);
          Ember.set(tool, 'hasData', true);
          Ember.set(tool, 'hasError', false);

          controller.set('cronHandlerDifferenceDetection', null);

          data.duraark.fixxmeUpdateToolOnServer(data.session, data.digitalObject, tool);

          return true;
        } else if (result.status === 'error') {
          Ember.set(tool, 'isLoading', false);
          Ember.set(tool, 'hasData', false);
          Ember.set(tool, 'hasError', true);
          Ember.set(tool, 'errorText', result.errorText);
          Ember.set(tool, 'showStartButton', false);

          data.duraark.fixxmeUpdateToolOnServer(data.session, data.digitalObject, tool);

          return true;
        } else if (result.status === 'pending') {
          Ember.set(tool, 'isLoading', true);
          Ember.set(tool, 'hasData', false);
          Ember.set(tool, 'hasError', false);

          return false;
        }
      });
    }, data, this.get('pollingInterval'));

    this.set('cronHandlerDifferenceDetection', cronHandler);
  },

  pollForCompressionResult: function(filename, digitalObject, tool) {
    let data = {
        tool: tool,
        session: this.get('session'),
        digitalObject: digitalObject,
        duraark: this.duraark
      },
      that = this;

    console.log('[pollForCompressionResult] scheduling new request in: ' + this.get('pollingInterval'));

    let cronHandler = this.cron.addJob(function(data) {
      return data.duraark.getE57CompressedFile({
        inputFile: filename,
        ratio: tool.get('compressionRatio')
      }).then(function(result) {
        let tool = data.tool,
          digitalObject = data.digitalObject,
          session = data.session;

        console.log('polling result: ' + JSON.stringify(result, null, 4));

        // FIXXME: introduce PC2BIMTool object to do such things!
        if (tool.get('doRemove')) {
          that.cron.removeJob(that.get('cronHandlerCompression'));
          tool.set('doRemove', false);
          that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
          return;
        }

        Ember.set(tool, 'jobId', result.id);

        if (result.status === 'finished') {
          Ember.run(function() {
            Ember.set(tool, 'jobId', result.id);
            Ember.set(tool, 'isLoading', false);
            Ember.set(tool, 'hasData', true);
            Ember.set(tool, 'hasError', false);
            Ember.set(tool, 'downloadUrl', result.bimDownloadUrl);

            that.cron.removeJob(that.get('cronHandlerCompression'));
            that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
          });

          return true;
        } else if (result.status === 'error') {
          Ember.run(function() {
            Ember.set(tool, 'jobId', result.id);
            Ember.set(tool, 'isLoading', false);
            Ember.set(tool, 'hasData', false);
            Ember.set(tool, 'hasError', true);

            that.cron.removeJob(that.get('cronHandlerCompression'));
            that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
          });

          return true;
        } else if (result.status === 'pending') {
          Ember.run(function() {
            Ember.set(tool, 'jobId', result.id);
            Ember.set(tool, 'isLoading', true);
            Ember.set(tool, 'hasData', false);
            Ember.set(tool, 'hasError', false);

            that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
          });

          return false;
        }
      });
    }, data, this.get('pollingInterval'));

    this.set('cronHandlerCompression', cronHandler);
  },

  pollForPC2BIMResult: function(filename, digitalObject, tool) {
    let data = {
        tool: tool,
        session: this.get('session'),
        digitalObject: digitalObject,
        duraark: this.duraark
      },
      that = this;

    console.log('[pollForPC2BIMResult] scheduling new request in: ' + this.get('pollingInterval'));

    let cronHandler = this.cron.addJob(function(data) {
      return data.duraark.getIFCReconstruction({
        inputFile: filename,
        restart: false
      }).then(function(result) {
        let tool = data.tool,
          digitalObject = data.digitalObject,
          session = data.session;

        console.log('polling result: ' + JSON.stringify(result, null, 4));

        // FIXXME: introduce PC2BIMTool object to do such things!
        if (tool.get('doRemove')) {
          that.cron.removeJob(that.get('cronHandler'));
          tool.set('doRemove', false);
          that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
          return;
        }

        Ember.set(tool, 'jobId', result.id);

        if (result.status === 'finished') {
          Ember.run(function() {
            Ember.set(tool, 'jobId', result.id);
            Ember.set(tool, 'isLoading', false);
            Ember.set(tool, 'hasData', true);
            Ember.set(tool, 'hasError', false);
            Ember.set(tool, 'bimDownloadUrl', result.bimDownloadUrl);
            Ember.set(tool, 'wallsDownloadUrl', result.wallsDownloadUrl);

            that.cron.removeJob(that.get('cronHandler'));
            that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
          });

          return true;
        } else if (result.status === 'error') {
          Ember.run(function() {
            Ember.set(tool, 'jobId', result.id);
            Ember.set(tool, 'isLoading', false);
            Ember.set(tool, 'hasData', false);
            Ember.set(tool, 'hasError', true);

            that.cron.removeJob(that.get('cronHandler'));
            that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
          });

          return true;
        } else if (result.status === 'pending') {
          Ember.run(function() {
            Ember.set(tool, 'jobId', result.id);
            Ember.set(tool, 'isLoading', true);
            Ember.set(tool, 'hasData', false);
            Ember.set(tool, 'hasError', false);

            that.duraark.fixxmeUpdateToolOnServer(session, digitalObject, tool);
          });

          return false;
        }
      });
    }, data, this.get('pollingInterval'));

    this.set('cronHandler', cronHandler);
  },

  enableRISE: function() {
    let description = this.get('session.description');
    return description === 'Electrical appliance showcase dataset';
  }.property('session'),

  actions: {
    save: function() {
      console.log('saving session ...');
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
        controller.transitionToRoute('preingest.digitalpreservation', session);
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

        this.send('save');
      } else {
        let filename = selectedDigitalObject.get('path');
        console.log('filename: ' + filename);
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

        this.send('save');
      }
    },

    removeTool: function(digObj, topic) {
      // Set the 'selectedDigitalObject' property to the file the topic belongs to:
      this.selectDigitalObject(digObj);
      digObj.get('geoTools').removeObject(topic);

      this.send('closeToolUI');
      this.send('save');
    },

    scheduleCompression(tool, filename) {
      let controller = this,
        eventId = new Date();

      controller.send('addPendingEvent', {
        label: 'Scheduled compression',
        displayType: 'info',
        id: eventId
      });

      var t = Ember.Object.create({
        label: tool.get('label'),
        description: tool.get('description'),
        inputFile: filename,
        downloadUrl: null,
        compressionRatio: 0.5,
        showSlider: true,
        isLoading: false,
        hasError: false,
        hasData: false,
        jobId: null
      });

      controller.get('selectedDigitalObject.geoTools').pushObject(t);
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
      }

      // Create new instance of tool to be added to 'geoTools'. It is not
      // possible to directly use the 'tool' instance, as multiple files can
      // have the same tool assigned.
      var t = Ember.Object.create({
        label: tool.get('label'),
        description: tool.get('description'),
        isLoading: false,
        hasError: false,
        hasData: false,
        viewerUrl: null,
        fileIdA: null,
        fileIdB: null,
        jobId: null,
        showStartButton: true
      });

      controller.get('selectedDigitalObject.geoTools').pushObject(t);

      controller.send('save');
    },

    scheduleRISE(tool, filename, removeToolFirst) {
      let controller = this,
        eventId = new Date();

      controller.send('addPendingEvent', {
        label: 'Scheduled power line detection',
        displayType: 'info',
        id: eventId
      });

      tool.set('isLoading', true);
      tool.set('hasError', false);
      tool.set('hasData', false);

      var digObj = controller.get('selectedDigitalObject');
      digObj.get('geoTools').pushObject(tool);

      this.duraark.fixxmeUpdateToolOnServer(this.get('session'), this.get('selectedDigitalObject'), tool);

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

        controller.duraark.fixxmeUpdateToolOnServer(controller.get('session'), controller.get('selectedDigitalObject'), curTool);

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
    },

    scheduleBIMReconstruction(tool, filename, removeToolFirst) {
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
      }

      // Create new instance of tool to be added to 'geoTools'. It is not
      // possible to directly use the 'tool' instance, as multiple files can
      // have the same tool assigned.
      var t = Ember.Object.create({
        label: tool.get('label'),
        description: tool.get('description'),
        isLoading: false,
        hasError: false,
        hasData: false,
        viewerUrl: null,
        fileIdA: null,
        fileIdB: null,
        jobId: null,
        showStartButton: true
      });

      controller.get('selectedDigitalObject.geoTools').pushObject(t);

      controller.send('save');
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
    let result = (toolname === 'Point Cloud Compression') ? true : false;
    console.log('result: ' + result);
    return result;
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
