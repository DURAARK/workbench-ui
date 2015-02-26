import Ember from 'ember';

var MarkerCollectionLayer =
    EmberLeaflet.MarkerCollectionLayer.extend({
        contentBinding: "controller.markers"
    });

export
default EmberLeaflet.MapView.extend({
    classNames: ['ember-leaflet-map'],
    childLayers: [
        EmberLeaflet.DefaultTileLayer,
        MarkerCollectionLayer
    ],
    center: L.latLng(48, 13),
    zoom: 4,
    options: {
        maxZoom: 19,
        minZoom: 0
    }
});