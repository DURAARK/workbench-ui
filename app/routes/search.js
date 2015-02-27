import Ember from 'ember';

export
default Ember.Route.extend({
    model: function() {
        return this.store.find('physicalAsset');
    },

    setupController: function(controller, model) {
        this._super(controller, model);

        var markers = [];

        model.forEach(function(item) {
            markers.push({
                location: L.latLng(item.get('latitude'), item.get('longitude')),
                title: 'test'
            });
        });
        controller.set('markers', markers);
    }
});