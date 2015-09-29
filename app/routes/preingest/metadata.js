import Ember from 'ember';
export
default Ember.Route.extend({

  model(params) {
    return this.store.find('session', params.id);
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('session', model);
    controller.set('fileInfo', null);

    // setup 'duraark-header' component ('setSession' has to be called first!):
    this.send('setSession', model);

    var label = model.get('label');
    this.send('setTitle', 'Data Archival - ' + label);
    this.send('showWorkflowSteps', true);
    this.send('setActiveStep', 'metadata');
  },

  actions: {
    sessionChanged: function() {
      this.refresh();
    }
  }

});
