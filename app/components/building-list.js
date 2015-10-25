import Ember from 'ember';

export
default Ember.Component.extend({
  buildings: [],
  selectedBuilding: null,

  actions: {
    openBuilding(uri, building) {
        this.sendAction('openBuilding', uri, building);
      },

      showDetails(uri, building) {
        let flag = building.get('isSelected');
        if (flag) {
            building.set('isSelected', false);
        } else {
          this.get('buildings').forEach(building => {
            building.set('isSelected', false);
          });
          building.set('isSelected', true);
        }
        building.toggleProperty('isSelected');

        // console.log('Selected building:\n' + JSON.stringify(building, null, 4));
        this.sendAction('showBuildingDetails', uri, building);
      }
  }
});
