import Ember from 'ember';
export
default Ember.Route.extend({

  model: function(params) {
    var sessions = this.modelFor('application');
    var session = sessions[params.id - 1];

    return session;
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('session', model);

    // FIXXME: get from service!
    var topics = [Ember.Object.create({
      label: 'Energy Efficiency',
      seeds: ['http://energy-efficiency.io', 'http://sustainable-materials.io'],
      dependencies: [{
        type: 'physicalAsset',
        elements: ['streetAddress', 'buildingArea']
      }, {
        type: 'digitalObject',
        elements: ['dateCreated']
      }]
    }), Ember.Object.create({
      label: 'Architectural Style',
      seeds: ['http://energy-efficiency.io', 'http://sustainable-materials.io'],
      dependencies: [{
        type: 'physicalAsset',
        elements: ['streetAddress', 'buildingArea']
      }, {
        type: 'digitalObject',
        elements: ['dateCreated']
      }]
    })];

    // FIXXME: incorporate selected topics from session!
    topics.forEach(function(topic) {
      topic.set('isSelected', false);
    });

    controller.set('topics', topics);
  }

});
