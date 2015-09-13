import Ember from 'ember';

export default Ember.Controller.extend({
  selectedBuilding: null,

  actions: {
    showDetails(building) {
      this.set('showDetailsSidebar', true);
      this.set('selectedBuilding', building);
    }
  }
});
