import Ember from 'ember';

export
default Ember.Route.extend({
  model(params) {
      return this.store.find('session', params.id);
    },

    deactivate() {
      // NOTE: When linking back to the 'preingest' route the 'setupController'
      // hook of 'preingest' does not get called to remove the workflow step bar.
      // (that's because the 'preingest' model is already set and did not change).
      // Therefore we do this 'cleanup' here in any case:
      this.send('showWorkflowSteps', false);
    },

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
          files.pushObject(router.store.createRecord('file', file));
        });
      }
      controller.set('files', files);

      //       this.store.findAll('file').then(function(availableFiles) {
      //         controller.set('files', availableFiles);
      //
      //         let selectedFiles = model.get('files');
      // debugger;
      //         router.send('highlightSelectedFiles', availableFiles, selectedFiles);
      //
      //         controller.send('showLoadingSpinner', false);
      //       });
      // }
      // }

      var label = model.get('label');
      this.send('setTitle', 'Archive Buildings - ' + label);
      this.send('showWorkflowSteps', true);
      this.send('setActiveStep', 'files');
      this.send('setSession', model);
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
