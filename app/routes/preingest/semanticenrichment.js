import Ember from 'ember';
export
default Ember.Route.extend({

  model(params) {
    return this.store.find('session', params.id);
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    var session = model,
      digObjs = [];

    controller.set('session', session);

    if (session.get('digitalObjects')) {
      session.get('digitalObjects').forEach(function(digObj) {
        var semMD = digObj.semMD;

        if (!semMD) {
          semMD = {
            topics: []
          };
        }

        var obj = Ember.Object.create({
          label: digObj.label,
          buildm: digObj.buildm,
          semMD: semMD,
          geoMD: Ember.Object.create(digObj.geoMD),
          techMD: digObj.techMD,
          derivatives: digObj.derivatives,
          size: digObj.size,
          isSelected: false
        });

        digObjs.pushObject(obj);
      });

      controller.set('digitalObjects', digObjs);
    }

    // FIXXME: get from SDA service!
    // FIXXME: create Topic model to enable saving and linking into session model!
    var allTopics = [Ember.Object.create({
      label: 'Haus 30 (general context)',
      description: "Adds information on the building, architecture and the region around the building.",
      seeds: ['http://dbpedia.org/resource/Berlin,http://dbpedia.org/resource/List_of_museums,http://de.dbpedia.org/resource/Ludwig_Hoffmann(Architekt),http://de.dbpedia.org/resource/Bogensee_(Berlin-Buch),http://de.dbpedia.org/resource/Bucher_Forst,http://de.dbpedia.org/resource/Karpfenteiche_(Berlin-Buch),http://de.dbpedia.org/resource/Kategorie:Ehemaliges_Krankenhaus_in_Berlin'],
      crawlId: 13,
      candidates: [],
      isSelected: false
    }), Ember.Object.create({
      label: 'Haus 30 (political context)',
      description: "Adds information on the political context at the location (Berlin) of the building. E.g., political parties and organizations in Berlin.",
      seeds: ['http://dbpedia.org/resource/Berlin,http://dbpedia.org/resource/Social_Democratic_Party_of_Germany,http://de.dbpedia.org/resource/Ludwig_Hoffmann(Architekt),http://de.dbpedia.org/resource/Mosse-Stift,http://de.dbpedia.org/resource/Landesgeschichtliche_Vereinigung_für_die_Mark_Brandenburg'],
      crawlId: 14,
      candidates: [],
      isSelected: false
    }), Ember.Object.create({
      label: 'Nygade (general context)',
      description: "Adds information on the building, architecture and the region around the building.",
      seeds: ['http://dbpedia.org/resource/Rosenborg_Castle,http://dbpedia.org/resource/Copenhagen_Opera_House,http://dbpedia.org/resource/Copenhagen,http://dbpedia.org/resource/Capital_Region_of_Denmark,http://dbpedia.org/resource/List_of_museums'],
      crawlId: 15,
      candidates: [],
      isSelected: false
    })];

    // FIXXME: incorporate selected allTopics from session!
    allTopics.forEach(function(topic) {
      topic.set('isSelected', false);
    });

    controller.set('allTopics', allTopics);

    // setup 'duraark-header' component ('setSession' has to be called first!):
    this.send('setSession', model);

    var label = model.get('label');
    this.send('setTitle', 'Archive Buildings - ' + label);
    this.send('showWorkflowSteps', true);
    this.send('setActiveStep', 'semanticenrichment');
  }

});