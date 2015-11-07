import Ember from 'ember';

var EventHistory = Ember.Object.extend({
  currentEvent: null,
  pendingEvents: [],
  allEvents: []
});

export default Ember.Route.extend({
  model: function() {
    // Stores application state:
    return Ember.Object.create({
      showLoadingSpinner: false,
      eventHistory: EventHistory.create(),
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
        model.set('explore.title', title); // FIXXME: this is weird...
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
      },

      showError(error) {
        alert(error);
      },

      addPendingEvent(historyEvent) {
        let eventHistory = this.modelFor('application').get('eventHistory');

        Ember.merge(historyEvent, {
          eventType: 'pending'
        });

        eventHistory.set('currentEvent', historyEvent);
      },

      addFinishedEvent(historyEvent) {
        let eventHistory = this.modelFor('application').get('eventHistory');

        Ember.merge(historyEvent, {
          eventType: 'finished'
        });

        eventHistory.set('currentEvent', historyEvent);
      }
  }
});
