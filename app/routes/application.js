import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    // Stores application state:
    return Ember.Object.create({
      showLoadingSpinner: false,
      preingest: {
        session: null,
        title: 'No Name',
        showWorkflowSteps: false,
        activeStep: 'files'
      },
      retrieve: {
        title: 'No Name'
      },
      explore: {
        activeRoute: 'knowledgedatabase'
      }
    });
  },

  actions: {
    setTitle(title) {
        let model = this.modelFor('application');
        model.set('preingest.title', title);
        model.set('retrieve.title', title); // FIXXME: this is weird...
        model.set('knowledge.title', title); // FIXXME: this is weird...
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

      showLoadingSpinner(flag, message) {
        let model = this.modelFor('application');
        model.set('showLoadingSpinner', flag)
        model.set('loadingMessage', message);
      }
  }
});
