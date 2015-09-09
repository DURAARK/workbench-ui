import Ember from 'ember';

export
default Ember.Route.extend({
  model: function() {
    return this.store.findAll('session');
  },

  activate: function() {
    this.modelFor('application').set('hideNavbar', true);
  },

  deactivate: function() {
    this.modelFor('application').set('hideNavbar', false);
  }
});
