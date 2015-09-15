import Ember from 'ember';

export
default Ember.Component.extend({
  selectedBuilding: null,

  actions: {
    openBuilding(uri, building) {
        this.sendAction('openBuilding', uri, building);
      },

      showDetails(building) {
        // console.log('Selected building:\n' + JSON.stringify(building, null, 4));
        this.sendAction('showBuildingDetails', building);
      }
  }
});
