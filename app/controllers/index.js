import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    openArchivalSession: function() {
      console.log('[info] Open archival session ...');
      this.transitionToRoute('files', 1);
    }
  }
});
