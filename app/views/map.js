import Ember from 'ember';

var MarkerLayer =
    EmberLeaflet.MarkerLayer.extend(
        // EmberLeaflet.DraggableMixin,
        EmberLeaflet.PopupMixin, {
            popupContentBinding: 'content.title'
        });

var MarkerCollectionLayer =
    EmberLeaflet.MarkerCollectionLayer.extend({
        contentBinding: 'controller.markers',
        itemLayerClass: MarkerLayer
    });

// var MarkerClusterLayer =
//     EmberLeaflet.ContainerLayer.extend({
//         childLayers: [
//             MarkerCollectionLayer
//         ],
//         _newLayer: function() {
//             return new L.MarkerClusterGroup();
//         }
//     });

export
default EmberLeaflet.MapView.extend({
    classNames: ['ember-leaflet-map'],
    childLayers: [
        EmberLeaflet.DefaultTileLayer,
        MarkerCollectionLayer
        // MarkerClusterLayer
    ],
    center: L.latLng(48, 13),
    zoom: 4,
    options: {
        maxZoom: 19,
        minZoom: 0
    }
});