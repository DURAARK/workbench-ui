import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showInViewer(buildm) {
      this.set('selectedBuildm', buildm);
    }
  }
});
