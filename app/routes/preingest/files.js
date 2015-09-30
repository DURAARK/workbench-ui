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
      console.log('setupController');
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

      this.store.findAll('file').then(function(files) {
        controller.set('files', files);

        router.highlightSelectedFiles(files);

        controller.send('isLoading', false);
      });
      // }
      // }


      console.log('activate');
      var label = model.get('label');
      this.send('setTitle', 'Archive Buildings - ' + label);
      this.send('showWorkflowSteps', true);
      this.send('setActiveStep', 'files');
      this.send('setSession', model);
    },

    highlightSelectedFiles(files) {
      let selectedFiles = this.get('selectedFiles');

      if (!selectedFiles) {
        return;
      };

      files.forEach(function(file) {
        file.set('isSelected', false);

        var matchingFiles = selectedFiles.filter(function(selectedFile, index, self) {
          return selectedFile.get('name') == file.get('name');
        });

        matchingFiles.forEach(function(fileToSelect) {
          fileToSelect.set('isSelected', true);
        })
      });
    }

});
