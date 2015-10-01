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

      controller.set('session', model);
      controller.set('showSidebar', true);
      controller.set('selectedFile', null);

      // controller.send('isLoading', true, 'Loading files ...');

      // if (!controller.get('files')) {
      //   controller.set('selectedFiles', []);
      //   controller.send('isLoading', true);
      //   var files = [];
      //
      //   // A session can define which files are presented to the user for selection
      //   // to allow the creation of 'showcases':
      //   if (session.get('fixedInputFiles')) {
      //
      //     session.get('fixedInputFiles').forEach(function(item) {
      //       var file = controller.store.createRecord('file', item);
      //       file.set('path', item.path);
      //       files.pushObject(file);
      //     });
      //
      //     // For showcase sessions remove files which could have been stored before:
      //
      //     controller.set('files', files);
      //     controller.send('isLoading', false);
      //
      //   } else {

      this.store.findAll('file').then(function(availableFiles) {
        controller.set('files', availableFiles);

        let selectedFiles = model.get('files');

        router.send('highlightSelectedFiles', availableFiles, selectedFiles);

        controller.send('isLoading', false);
      });
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
