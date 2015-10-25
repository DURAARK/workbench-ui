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
  currentMarkers: [],
  selected: null,

  didInsertElement: function() {
    // NOTE: manually copied over leaflet/dist/images/* to the following folder
    // to display markers:
    L.Icon.Default.imagePath = '/assets/images';

    var map = L.map('map');
    this.set('map', map);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.setView([47.032666667, 15.43], 5);

    let selectedBuilding = this.get('selected');
    if (selectedBuilding) {
      Ember.run.once(this, 'highlightPlace');
    }
  },

  selectDidChange: Ember.observer('selected', function() {
    Ember.run.once(this, 'highlightPlace');
  }),

  onPlacesChanged: function() {
    let places = this.get('places'),
      currentMarkers = this.get('currentMarkers'),
      map = this.get('map');

    currentMarkers.forEach(marker => {
      map.removeLayer(marker);
    });

    places.forEach(function(place) {
      console.log('Adding marker at: lat: ' + place.latitude + '/' + place.longitude + ' | ' + place.label);
      try {
        let marker = L.marker([place.latitude, place.longitude]).addTo(map)
          .bindPopup(place.label);
        // .openPopup();

        currentMarkers.pushObject(marker);
      } catch (err) {
        console.log('Adding marker error: ' + err);
      };
    });

  }.observes('places'),

  highlightPlace() {
    const selectedPlace = this.get('selected');
    if (selectedPlace) {
      let lat = selectedPlace.latitude,
        lng = selectedPlace.longitude,
        map = this.get('map');

      var marker = this.get('currentMarkers').filter(marker => {
        let location = marker.getLatLng();
        return (location.lat.toString() === selectedPlace.latitude && location.lng.toString() === selectedPlace.longitude);
      });

      var selectedMarker =  this.get('currentlySelectedMarker');
      if (selectedMarker) {
        var icon = L.icon({
          iconUrl: L.Icon.Default.imagePath + '/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [0, -35]
        });
        selectedMarker.setIcon(icon);
      }

      var icon = L.icon({
        iconUrl: L.Icon.Default.imagePath + '/marker-icon-selected-2x.png',
        iconSize: [50, 82],
        iconAnchor: [25, 82],
        popupAnchor: [0, -65]
      });
      marker[0].setIcon(icon).openPopup();
      //bindPopup(selectedPlace.label).openPopup();
      this.set('currentlySelectedMarker', marker[0]);

      map.setView([lat, lng, 12]);
    }
  }
});
