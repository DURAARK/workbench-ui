import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    // Stores application state:
    return Ember.Object.create({
      preingest: {
        session: null,
        title: 'No Name',
        showWorkflowSteps: false,
        activeStep: 'files'
      }
    });
  },

  actions: {
    setTitle(title) {
        let model = this.modelFor('application');
        model.set('preingest.title', title);
      },

      showWorkflowSteps(flag) {
        let model = this.modelFor('application');
        model.set('preingest.showWorkflowSteps', flag);
      },

      setActiveStep(stepName) {
        let model = this.modelFor('application');
        model.set('preingest.activeStep', stepName);
      },

      setSession(session) {
        let model = this.modelFor('application');
        model.set('preingest.session', session);
      },

      isLoading(flag, message) {
        let model = this.modelFor('application');
        model.set('isLoading', flag)
        model.set('loadingMessage', message);
      }
  }
});
