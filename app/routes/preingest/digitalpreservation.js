import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return this.store.find('session', params.id);
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    controller.set('session', model);

    // setup 'duraark-header' component:
    var label = model.get('label');
    this.send('setTitle', 'Data Archival - ' + label);
    this.send('showWorkflowSteps', true);
    this.send('setSession', model);
    this.send('setActiveStep', 'digitalpreservation');    
  }
});
