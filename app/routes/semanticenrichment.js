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
      }],
      candidates: [{
        "entity": "http://dbpedia.org/resource/Wilmot_Moses_Smith",
        "score": 0.0019919
      }, {
        "entity": "http://dbpedia.org/resource/WDKM",
        "score": 7.562E-4
      }, {
        "entity": "http://dbpedia.org/resource/CJRS",
        "score": 7.562E-4
      }, {
        "entity": "http://dbpedia.org/resource/Ladew_Topiary_Gardens",
        "score": 0.0014985
      }, {
        "entity": "http://dbpedia.org/resource/WGTN-FM",
        "score": 0.0014985
      }, {
        "entity": "http://dbpedia.org/resource/Arabella_Station",
        "score": 7.562E-4
      }, {
        "entity": "http://dbpedia.org/ontology/pastMember",
        "score": 0.0019919
      }, {
        "entity": "http://dbpedia.org/resource/Yokohama_Archives_of_History",
        "score": 0.0022273
      }, {
        "entity": "http://dbpedia.org/resource/Greenwich_Heritage_Centre",
        "score": 0.0014985
      }, {
        "entity": "http://dbpedia.imp.fu-berlin.de:49156/resource/Gerhard_Thieme",
        "score": 0.0
      }, {
        "entity": "http://dbpedia.org/resource/WDVE",
        "score": 0.0014985
      }, {
        "entity": "http://dbpedia.org/resource/Karnice,_Masovian_Voivodeship",
        "score": 0.0022273
      }, {
        "entity": "http://dbpedia.org/resource/Makowiska,_%C5%81%C3%B3d%C5%BA_Voivodeship",
        "score": 0.0022273
      }]
    })];

    // FIXXME: incorporate selected topics from session!
    topics.forEach(function(topic) {
      topic.set('isSelected', false);
    });

    controller.set('topics', topics);
  }

});
