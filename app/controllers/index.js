import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    openArchivalSession: function() {
      console.log('[info] Open archival session ...');
      this.transitionToRoute('workflows.files');
    },

    openRetrievalSession: function() {
      console.log('[info] Open retrieval session ...');
      this.transitionToRoute('workflows.retrieval');
    }
  }
});