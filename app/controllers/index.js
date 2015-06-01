import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    openNewSession: function() {
      console.log('[info] Open new session ...');
      this.transitionToRoute('workflows.files');
    },

    openExistingSession: function() {
      console.log('[info] Open existing session ...');
      this.transitionToRoute('workflows.files');
    },

    openDemoSession: function() {
      console.log('[info] Open demo session ...');
      this.transitionToRoute('workflows.files');
    }
  }
});
