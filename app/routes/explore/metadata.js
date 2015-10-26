import Ember from 'ember';

export default Ember.Route.extend({
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('building', model);

    this.send('setActiveroute', 'metadata');
  }
});
