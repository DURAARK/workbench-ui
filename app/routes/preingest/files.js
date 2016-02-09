import Ember from 'ember';

export
default Ember.Route.extend({
  model(params) {
      return this.store.find('session', params.id);
    },

    // willTransition(transition) {
    //   // NOTE: Prepare and save session data before transitioning, as other parts of the application
    //   // are depending on the session data.
    //
    //   let filesController = this.controllerFor('files');
    //   filesController.set('previousTransition', transition);
    //   filesController.saveSession();
    //   this.send('showWorkflowSteps', false);
    // },

    setupController(controller, model) {
      this._super(controller, model);

      let router = this;

      controller.set('app', this.modelFor('application')); // FIXXME: create DuraarkController and extend!

      controller.set('session', model);
      controller.set('showSidebar', true);
      controller.set('selectedFile', null);

      // NOTE: We are not using ember-data's relations here (maybe in the future). Therefore we have to convert the
      // plain javascript file objects to Ember.Records here to work with them in the Controller:
      let files = [];

      if (model.get('files.length')) {
        model.get('files').forEach(function(file) {
          var hasFileRecord = router.store.hasRecordForId('file', file.id);
          if (!hasFileRecord) {
            files.pushObject(router.store.createRecord('file', file));
          } else {
            // FIXXME: this is causing an error still, which has no effect in our current case!
            router.store.find('file', file.id).then(file => {
              files.pushObject(file);
            });
          }
        });
      }
      controller.set('files', files);

      var label = model.get('label');
      this.send('setTitle', 'Archive Buildings - ' + label);
      this.send('showWorkflowSteps', true);
      this.send('setActiveStep', 'files');
      this.send('setSession', model);

      controller.set('fileInfo', null);
      controller.set('fileInfoIsE57', null);
      controller.set('fileInfoIsIFC', null);

      // If this is the first call to the route after the API got initialized with
      // a set of fixed sessions we have to prepare the session data first:
      // FIXXME: prepare session in duraark-sessions service after fixed session
      // initialization and after a file is added.
      if (!model.get('physicalAssets.length')) {
        controller.saveSession();
      }
    },

    actions: {
      highlightSelectedFiles(availableFiles, selectedFiles) {
        let route = this;

        if (!selectedFiles) {
          return;
        };

        availableFiles.forEach(function(availableFile) {
          availableFile.set('isSelected', false);
        });

        selectedFiles.forEach(function(selectedFile) {
          var matchingFiles = availableFiles.filter(function(availableFile, index, self) {
            console.log('path: ' + availableFile.get('path'));
            return selectedFile.path == availableFile.get('path');
          });

          matchingFiles.forEach(function(fileToSelect) {
            fileToSelect.set('isSelected', true);
            route.get('controller.selectedFiles').pushObject(fileToSelect);
          })
        });
      }
    }
});
