import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showInViewer(buildings) {
      this.set('buildings');
      this.set('showBuildingList');
    }
  }
});
