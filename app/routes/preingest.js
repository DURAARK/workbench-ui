import Ember from 'ember';

export
default Ember.Route.extend({
  model(params) {
      return this.store.findAll('session');
    },

    setupController(controller, model) {
      this._super(controller, model);

      this.send('setTitle', 'Archive Buildings - Sessions');
      this.send('showWorkflowSteps', false);

      var appState = this.modelFor('application');
      controller.set('preingestState', appState.get('preingest'));
    }
});
