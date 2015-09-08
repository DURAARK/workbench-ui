import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showPreingestWorkflow: function() {
      this.transitionToRoute('preingest');
    },
    showRetrieveWorkflow: function() {
      this.transitionToRoute('retrieve');
    }
  }
});
