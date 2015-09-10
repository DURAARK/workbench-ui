import Ember from 'ember';

export
default Ember.Route.extend({

  model: function(params) {
    var sessions = this.modelFor('application');
    var session = sessions.objectAt(params.id - 1);

    session.files = [];

    return session;
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    var session = model;
    this.modelFor('application').set('session', session);

    controller.set('session', session);
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

      files.forEach(function(file) {
        file.set('isSelected', false);
      });

      controller.send('isLoading', false);
    });
    // }
    // }
  }

});
