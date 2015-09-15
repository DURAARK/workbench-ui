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
  },

  actions: {
    sessionChanged: function() {
      this.refresh();
    }
  }

});
