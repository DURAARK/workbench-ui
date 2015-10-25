import Ember from 'ember';
// import _ from 'underscore';

export default Ember.Route.extend({
  setupController(controller, model) {
    this._super(controller, model);

    controller.set('places', []);

    this.send('setTitle', 'Search Buildings');

    var appState = this.modelFor('application');
    controller.set('retrieveState', appState.get('retrieve'));
  }
});
