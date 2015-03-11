import Ember from 'ember';

export
default Ember.Route.extend({
    model: function() {
        return Ember.RSVP.hash({
            buildings: this.store.find('searchItem'),
            properties: this.store.find('property')
        });
    },

    setupController: function(controller, model) {
        this._super(controller, model);

        controller.set('buildings', model.buildings);
        controller.set('properties', model.properties);
    }
});