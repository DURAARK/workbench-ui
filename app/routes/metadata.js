import Ember from 'ember';
export
default Ember.Route.extend({

  model: function(params) {
    var sessions = this.modelFor('application').get('content');
    var session = sessions[params.id - 1];

    return session;
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('session', model);
  }

});
