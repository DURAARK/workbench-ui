import Ember from 'ember';

export
default Ember.Route.extend({

  model(params) {
      return this.store.find('session', params.id);
    },

    activate() {
      this.modelFor('preingest').set('hideNavbar', false);
    },

    deactivate() {
      this.modelFor('preingest').set('hideNavbar', true);
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

      this.store.findAll('file').then(function(files) {
        controller.set('files', files);

        router.highlightSelectedFiles(files);

        controller.send('isLoading', false);
      });
      // }
      // }

      var label = model.get('label');
      this.send('setTitle', 'Data Archival - ' + label);
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
