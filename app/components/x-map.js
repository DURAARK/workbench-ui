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

  didInsertElement: function() {
    // NOTE: manually copied over leaflet/dist/images/* to the following folder
    // to display markers:
    L.Icon.Default.imagePath = '/images';

    var map = L.map('map');

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var places = this.get('places');

    places.forEach(function(place) {
      console.log('Adding marker at: lat: ' + place.latitude + '/' + place.longitude);
      L.marker([place.longitude, place.latitude]).addTo(map)
        .bindPopup(place.name)
        .openPopup();
    });

    map.setView([47.032666667, 15.37], 12);
  }
});
