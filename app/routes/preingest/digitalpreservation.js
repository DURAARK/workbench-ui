import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
      return this.store.find('session', params.id);
    },

    setupController: function(controller, model) {
      this._super(controller, model);

      controller.set('session', model);

      var label = model.get('label');
      this.send('setTitle', 'Data Archival - ' + label);
      this.send('showWorkflowSteps', true);
      this.send('setActiveStep', 'digitalpreservation');
      this.send('setSession', model);
    }
});
