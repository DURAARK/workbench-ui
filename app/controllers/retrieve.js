import Ember from 'ember';

export default Ember.Controller.extend({
  showFilterSidebar: false,

  actions: {
    showInViewer(buildings) {
      this.set('buildings');
      this.set('showFilterSidebar');
    }
  }
});
