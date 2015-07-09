import Ember from 'ember';
export
default Ember.Route.extend({

  model: function(params) {
    var sessions = this.modelFor('application');
    var session = sessions.objectAt(params.id - 1);

    return session;
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    var session = model,
      digObjs = [];

    controller.set('session', session);

    session.get('digitalObjects').forEach(function(digObj) {
      var obj = Ember.Object.create({
        label: digObj.label,
        buildm: digObj.buildm,
        semMD: Ember.Object.create(digObj.semMD),
        techMD: digObj.techMD,
        derivatives: digObj.derivatives
      });

      digObjs.pushObject(obj);
    });

    controller.set('digitalObjects', digObjs);

    // FIXXME: get from SDA service!
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
