import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.duraark.getPhysicalAssets();
  },

  setupController(controller, model) {
    this._super(controller, model);

    var places = [{
      name: 'Haus 30',
      latitude: 15.37,
      longitude: 47
    }];

    controller.set('places', places);
  }
});
