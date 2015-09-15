import Ember from 'ember';

export
default Ember.Component.extend({
  selectedBuilding: null,

  actions: {
    openBuilding(building) {
        // get session ...
        //this.transitionToRoute()
      },

      showDetails(building) {
        console.log('Selected building:\n' + JSON.stringify(building, null, 4));
        this.sendAction('showBuildingDetails', building);
      }
  },

  buildingsArray: Ember.computed('buildings', function() {
    debugger;
    let buildings = this.get('buildings'),
      buildingsArray = [];

    buildings.forEach((key, value) => {
      buildingsArray.pushObject(value);
    });
  })
});
