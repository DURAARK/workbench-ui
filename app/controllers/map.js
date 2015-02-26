import Ember from 'ember';

export
default Ember.Controller.extend({
    content: [{
        location: L.latLng(40.714, -74.000)
    }, {
        location: L.latLng(40.714, -73.989)
    }, {
        location: L.latLng(40.721, -73.991)
    }]
});