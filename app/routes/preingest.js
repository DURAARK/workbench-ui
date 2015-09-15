import Ember from 'ember';

export
default Ember.Route.extend({
  model(params) {
      return this.store.findAll('session');
    },

    setupController(controller, model) {
      this._super(controller, model);
      model.set('hideNavbar', true);
    }
});
