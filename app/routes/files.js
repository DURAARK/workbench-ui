import Ember from 'ember';

export
default Ember.Route.extend({

  model: function(params) {

    var promises = {
      session: this.store.find('session', params.id),
      files: this.store.find('file'),
    };

    return Ember.RSVP.hash(promises);
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    var session = model.session,
      files = model.files;

    controller.set('session', session);
    controller.set('files', files);

    files.forEach(function(file) {
      file.set('isSelected', false);
    });

    controller.set('showSidebar', true);
    controller.set('selectedFile', null);
  }

});
