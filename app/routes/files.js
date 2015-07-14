import Ember from 'ember';

export
default Ember.Route.extend({

  model: function(params) {
    var sessions = this.modelFor('application');
    var session = sessions.objectAt(params.id - 1);

    return session;
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    var session = model;

    controller.set('session', session);
    controller.set('showSidebar', true);
    controller.set('selectedFile', null);

    controller.send('isLoading', true);

    this.store.find('file').then(function(files) {
      controller.set('files', files);

      files.forEach(function(file) {
        file.set('isSelected', false);
      });

      controller.send('isLoading', false);
    })
  }

});
