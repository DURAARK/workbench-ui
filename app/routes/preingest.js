import Ember from 'ember';

export
default Ember.Route.extend({
  model(params) {
      return this.store.findAll('session');
    },

    setupController(controller, model) {
      this._super(controller, model);

      model.set('hideNavbar', true);
      model.set('title', 'Data Archival - Sessions');
    },

    actions: {
      setTitle(title) {
        let model = this.modelFor('preingest');
        model.set('title', title);
      },

      setSession(session) {
        let model = this.modelFor('preingest');
        model.set('session', session);
      }
    }
});
