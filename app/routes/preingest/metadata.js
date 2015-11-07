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

      controller.set('app', this.modelFor('app'));

      controller.set('session', model);
      controller.set('fileInfo', null);

      // setup 'duraark-header' component ('setSession' has to be called first!):
      this.send('setSession', model);
      controller.set('app', this.modelFor('application')); // FIXXME: create DuraarkController and extend!

      var label = model.get('label');
      this.send('setTitle', 'Archive Buildings - ' + label);
      this.send('showWorkflowSteps', true);
      this.send('setActiveStep', 'metadata');

      var pas = [];

      model.get('physicalAssets').forEach(function(pa) {
        var item = Ember.Object.create(pa);
        item.set('isSelected', false);
        pas.pushObject(item);
      });

      model.set('physicalAssets', pas);

      var das = [];

      model.get('digitalObjects').forEach(function(dobj) {
        var item = Ember.Object.create(dobj);
        item.set('isSelected', false);
        das.pushObject(item);
      });

      model.set('digitalObjects', das);
    },

    actions: {
      sessionChanged: function() {
        this.refresh();
      }
    }

});
