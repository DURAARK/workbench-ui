import Ember from 'ember';

export default Ember.Controller.extend({
  selectedBuilding: null,

  actions: {
    showDetails(building) {
      debugger;
      this.set('showSidebarDetails', true);
      this.set('selectedBuilding', building);
    }
  }
});
