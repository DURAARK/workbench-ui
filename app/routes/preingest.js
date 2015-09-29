import Ember from 'ember';

export
default Ember.Route.extend({
  model(params) {
      return this.store.findAll('session');
    },

    setupController(controller, model) {
      this._super(controller, model);

      model.set('title', 'Data Archival - Sessions');
      model.set('showWorkflowSetps', false);
    },

    actions: {
      setTitle(title) {
        let model = this.modelFor('preingest');
        model.set('title', title);
      },

      showWorkflowSteps(flag) {
        let model = this.modelFor('preingest');
        model.set('showWorkflowSteps', flag);
      },

      setActiveStep(stepName) {
        let model = this.modelFor('preingest');
        model.set('activeStep', stepName);        
      },

      setSession(session) {
        let model = this.modelFor('preingest');
        model.set('session', session);
      }
    }
});
