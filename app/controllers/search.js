import Ember from 'ember';

export default Ember.Controller.extend({
  buildings: [],
  selectedBuilding: null,
  activeTab: 'location',
  locationActive: true,
  geometricActive: false,
  metadataActive: false,
  customActive: false,

  unselectAllTabs() {
    this.set('locationActive', false);
    this.set('geometricActive', false);
    this.set('metadataActive', false);
    this.set('customActive', false);
  },

  actions: {
    activateSearchTab(name) {
        this.unselectAllTabs();
        this.set(name + 'Active', true);
        this.set('activeTab', name);
      },

      openBuildingAsSession(uri, building) {
        let controller = this;

        // Check if session already exists:
        let result = this.duraark.querySession({
          uri: uri
        }).then(function(existingSession) {
          // console.log('existingSession: ' + JSON.stringify(existingSession, null, 4));

          if (existingSession.length) {
            let id = existingSession[0].id;
            console.log('session (id: ' + id + ') exists, opening now ...');
            // NOTE: Providing the 'id' of the session here so that the 'model' hook
            // of the 'preingest.files' route gets called. Currently we have a mix of
            // ember-data and native objects for 'session' models, which makes this
            // necessary.
            controller.transitionToRoute('metadata', id);
          } else {
            console.log('no session exists for building, creating new ...');
            controller.duraark.createSessionFromBuilding(uri, building).then(function(newSession) {
              // NOTE: Providing the 'id' of the session here so that the 'model' hook
              // of the 'preingest.files' route gets called. Currently we have a mix of
              // ember-data and native objects for 'session' models, which makes this
              // necessary.
              controller.transitionToRoute('preingest.metadata', newSession.id);
            });
          }
        });
      },

      showDetails(uri, building) {
        if (!building.get('isSelected')) {
          this.set('selectedBuilding', building);
        } else {
          this.set('selectedBuilding', null);
        }
      },

      showMetadata(uri, building) {
        debugger;
        var plainBuilding = JSON.parse(JSON.stringify(building));
        var b = this.store.createRecord('building', plainBuilding);
        plainBuilding['id'] = 0;
        building.set('id', 3);
        this.transitionToRoute('explore.metadata', building);
      },

      onFilterChanged(filters) {
        var that = this;

        console.log('[search] filters: ' + JSON.stringify(filters, null, 4));

        this.duraark.getBuildings({
          filters: filters
        }).then(buildings => {
          // console.log('buildings: ' + JSON.stringify(buildings));

          var items = buildings.results.bindings.filter(item => {
            return (item.url.value !== 'http://data.duraark.eu/resource/'); // ? item.result.value : false;
          });

          items = items.map(item => {
            return Ember.Object.create({
              url: item.url.value,
              label: item.url.value.split('/').pop(),
              latitude: (item.lat) ? item.lat.value : "", // because of OPTIONAL clause in SPARQL query
              longitude: (item.lng) ? item.lng.value : "", // because of OPTIONAL clause in SPARQL query
              isSelected: false
            });
          });

          that.set('buildings', items);
        });
      }
  },

  onBuildingsChanged: function() {
    let buildings = this.get('buildings'),
      places = [];

    buildings.forEach(building => {
      places.push({
        label: building.get('label'),
        latitude: building.get('latitude'),
        longitude: building.get('longitude')
      });
    });

    this.set('places', places);
  }.observes('buildings').on('init')
});
