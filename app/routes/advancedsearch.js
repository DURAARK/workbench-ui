import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('queries');
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    model.forEach(function(query) {
      query.set('isSelected', false);
    });

    controller.set('queries', model);

    this.send('setTitle', 'Explore Knowledge Graph');

    var appState = this.modelFor('application');
    controller.set('knowledgeState', appState.get('knowledge'));
    controller.set('app', appState);
  }
});
