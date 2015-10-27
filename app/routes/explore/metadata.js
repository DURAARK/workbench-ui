import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    debugger;
    this._super(controller, model);

    if (parseInt(Ember.get(model, 'id')) === 0) {
      controller.set('building', null);
    } else {
      controller.set('building', model);
    }
  }
});
