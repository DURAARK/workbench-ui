import Ember from 'ember';
export
default Ember.Route.extend({

  model(params) {
      return this.store.find('session', params.id);
    },

    deactivate() {
      // NOTE: When linking back to the 'preingest' route the 'setupController'
      // hook of 'preingest' does not get called to remove the workflow step bar.
      // (that's because the 'preingest' model is already set and did not change).
      // Therefore we do this 'cleanup' here in any case:
      this.send('showWorkflowSteps', false);
    },

    setupController: function(controller, model) {
      this._super(controller, model);
      controller.set('session', model);
      controller.set('fileInfo', null);

      // setup 'duraark-header' component ('setSession' has to be called first!):
      this.send('setSession', model);

      var label = model.get('label');
      this.send('setTitle', 'Archive Buildings - ' + label);
      this.send('showWorkflowSteps', true);
      this.send('setActiveStep', 'metadata');
    },

    actions: {
      sessionChanged: function() {
        this.refresh();
      }
    }

});
