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
        // FIXXME: get buildm based on 'building'!
        const buildm = {
          '@type': [
            'http://data.duraark.eu/vocab/buildm/PhysicalAsset'
          ],
          'http://data.duraark.eu/vocab/buildm/name': [{
            '@value': building.label.value
          }],
          'http://data.duraark.eu/vocab/buildm/latitude': [{
            '@value': building.latitude.value
          }],
          'http://data.duraark.eu/vocab/buildm/longitude': [{
            '@value': building.longitude.value
          }]
        };

        // console.log('Selected buildm:\n' + JSON.stringify(buildm, null, 4));

        this.sendAction('showDetailsClicked', buildm);
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
