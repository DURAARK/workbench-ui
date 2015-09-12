import Ember from 'ember';

export default Ember.Route.extend({
  model() {
      return this.duraark.getAllPhysicalAssets();
    },

    setupController(controller, model) {
      this._super(controller, model);

      let places = [];

      model.results.bindings.forEach(function(building) {
        places.push({
          name: building.label.value,
          latitude: building.latitude.value,
          longitude: building.longitude.value
        });
      });

      controller.set('buildings', model);
      controller.set('places', places);
    }
});
