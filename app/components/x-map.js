import Ember from 'ember';

// L.Map = L.Map.extend({
//     openPopup: function (popup, latlng, options) {
//         if (!(popup instanceof L.Popup)) {
//         var content = popup;
//
//         popup = new L.Popup(options).setContent(content);
//         }
//
//         if (latlng) {
//         popup.setLatLng(latlng);
//         }
//
//         if (this.hasLayer(popup)) {
//         return this;
//         }
//
//         // NOTE THIS LINE : COMMENTING OUT THE CLOSEPOPUP CALL
//         //this.closePopup();
//         this._popup = popup;
//         return this.addLayer(popup);
//     }
// });

export default Ember.Component.extend({
  places: [],
  selected: null,

  didInsertElement: function() {
    // NOTE: manually copied over leaflet/dist/images/* to the following folder
    // to display markers:
    L.Icon.Default.imagePath = '/images';

    var map = L.map('map');
    this.set('map', map);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var places = this.get('places');

    places.forEach(function(place) {
      console.log('Adding marker at: lat: ' + place.latitude + '/' + place.longitude);
      L.marker([place.latitude, place.longitude]).addTo(map)
        .bindPopup(place.name)
        .openPopup();
    });

    map.setView([47.032666667, 15.37], 12);

    let selectedBuilding = this.get('selected');
    if (selectedBuilding) {
      Ember.run.once(this, '_centerBuildingOnMap');
    }
  },

  selectDidChange: Ember.observer('selected', function() {
    Ember.run.once(this, '_centerBuildingOnMap');
  }),

  _centerBuildingOnMap() {
    const building = this.get('selected');
    if (building) {
      // this.get('map').setView([building.get('longitude'), building.get('latitued'), 12]);
      // FIXXME: get data from buildling!
      const lat = building['http://data.duraark.eu/vocab/buildm/latitude'][0]['@value'];
      const lng = building['http://data.duraark.eu/vocab/buildm/longitude'][0]['@value'];
      this.get('map').setView([lat, lng, 12]);
  }
}
});
