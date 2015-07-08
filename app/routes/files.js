import Ember from 'ember';

export
default Ember.Route.extend({

  model: function(params) {
    return this.store.find('session', params.id);
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    var session = model;

    controller.set('session', session);
    controller.set('showSidebar', true);
    controller.set('selectedFile', null);

    controller.set('isLoading', true);

    this.store.find('file').then(function(files) {
      controller.set('files', files);

      files.forEach(function(file) {
        file.set('isSelected', false);
      });

      controller.set('isLoading', false);
    })
  }

});
