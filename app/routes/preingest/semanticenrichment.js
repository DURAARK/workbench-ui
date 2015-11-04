import Ember from 'ember';
export
default Ember.Route.extend({

  model(params) {
      return this.store.find('session', params.id);
      // return Ember.Object.create({
      //   state: 'archived',
      //   label: 'Nygade',
      //   address: 'Nygade Straat, Kopenhagen',
      //   description: 'Session documenting the renovation of the Nygade building.',
      //
      //   physicalAssets: [],
      //   digitalObjects: [],
      //
      //   config: {
      //     sda: {
      //       topics: ["Nygade (general context)"]
      //     },
      //     geometricenrichment: {
      //       tools: ["IFC Reconstruction", "Electrical Appliance Detection"]
      //     }
      //   },
      //
      //   files: [{
      //     path: "/duraark-storage/sessions/nygade1005-1006-fixed/master/Nygade_Scan1005-1006.e57",
      //     type: "e57",
      //     size: 538401792,
      //     directory: false,
      //     atime: "2015-07-30T16:16:04.000Z",
      //     mtime: "2015-07-30T16:16:08.000Z",
      //     ctime: "2015-07-30T16:18:51.000Z",
      //     createdAt: "2015-07-31T14:20:40.373Z",
      //     updatedAt: "2015-07-31T14:20:40.402Z",
      //     id: 1
      //   }, {
      //     path: "/duraark-storage/sessions/nygade1005-1006-fixed/master/Nygade_Scan1005-1006.ifc",
      //     type: "ifc-spf",
      //     size: 54495,
      //     directory: false,
      //     atime: "2015-07-30T16:16:08.000Z",
      //     mtime: "2015-07-30T16:16:10.000Z",
      //     ctime: "2015-07-30T16:18:51.000Z",
      //     createdAt: "2015-07-31T14:20:40.378Z",
      //     updatedAt: "2015-08-02T09:00:34.781Z",
      //     id: 2
      //   }]
      // });
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

      var session = model,
        pas = [];

      controller.set('session', session);

      if (session.get('physicalAssets')) {
        session.get('physicalAssets').forEach(function(pa) {
          var obj = Ember.Object.create({
            label: pa.label,
            buildm: pa.buildm,
            semTopics: pa.semTopics ? pa.semTopics : [],
            isSelected: false
          });

          pas.pushObject(obj);
        });

        controller.set('physicalAssets', pas);
      }

      // FIXXME: get from SDA service!
      // FIXXME: create Topic model to enable saving and linking into session model!
      var allTopics = [Ember.Object.create({
        label: 'Architectural Context',
        description: "Adds information on the building, architecture and the region around the building.",
        seeds: ['http://dbpedia.org/resource/Berlin,http://dbpedia.org/resource/List_of_museums,http://de.dbpedia.org/resource/Ludwig_Hoffmann(Architekt),http://de.dbpedia.org/resource/Bogensee_(Berlin-Buch),http://de.dbpedia.org/resource/Bucher_Forst,http://de.dbpedia.org/resource/Karpfenteiche_(Berlin-Buch),http://de.dbpedia.org/resource/Kategorie:Ehemaliges_Krankenhaus_in_Berlin'],
        crawlId: 27,
        candidates: [],
        isSelected: false
      }), Ember.Object.create({
        label: 'Political Context',
        description: "Adds information on the political context at the location (Berlin) of the building. E.g., political parties and organizations in Berlin.",
        seeds: ['http://dbpedia.org/resource/Berlin,http://dbpedia.org/resource/Social_Democratic_Party_of_Germany,http://de.dbpedia.org/resource/Ludwig_Hoffmann(Architekt),http://de.dbpedia.org/resource/Mosse-Stift,http://de.dbpedia.org/resource/Landesgeschichtliche_Vereinigung_für_die_Mark_Brandenburg'],
        crawlId: 19,
        candidates: [],
        isSelected: false
      }), Ember.Object.create({
        label: 'Energy Context',
        description: "Adds information on the energy and environmental context.",
        seeds: ['http://dbpedia.org/resource/Rosenborg_Castle,http://dbpedia.org/resource/Copenhagen_Opera_House,http://dbpedia.org/resource/Copenhagen,http://dbpedia.org/resource/Capital_Region_of_Denmark,http://dbpedia.org/resource/List_of_museums'],
        crawlId: 20,
        candidates: [],
        isSelected: false
      })];

      // FIXXME: incorporate selected allTopics from session!
      allTopics.forEach(function(topic) {
        topic.set('isSelected', false);
      });

      controller.set('allTopics', allTopics);

      // // FIXXME: fixture data testing only:
      // controller.set('topic', {
      //   label: 'Haus 30 (general context)',
      //   description: "Adds information on the building, architecture and the region around the building.",
      //   seeds: ['http://dbpedia.org/resource/Berlin,http://dbpedia.org/resource/List_of_museums,http://de.dbpedia.org/resource/Ludwig_Hoffmann(Architekt),http://de.dbpedia.org/resource/Bogensee_(Berlin-Buch),http://de.dbpedia.org/resource/Bucher_Forst,http://de.dbpedia.org/resource/Karpfenteiche_(Berlin-Buch),http://de.dbpedia.org/resource/Kategorie:Ehemaliges_Krankenhaus_in_Berlin'],
      //   crawlId: 27,
      //   candidateSelection: [{
      //     entity: 'http://blablub.at',
      //     score: 1
      //   },{
      //     entity: 'http://biblob.at',
      //     score: 1
      //   },{
      //     entity: 'http://biblob.at',
      //     score: 1
      //   },{
      //     entity: 'http://biblob.at',
      //     score: 1
      //   },{
      //     entity: 'http://biblob.at',
      //     score: 1
      //   },{
      //     entity: 'http://biblob.at',
      //     score: 1
      //   },{
      //     entity: 'http://biblob.at',
      //     score: 1
      //   },{
      //     entity: 'http://biblob.at',
      //     score: 1
      //   },{
      //     entity: 'http://biblob.at',
      //     score: 1
      //   },{
      //     entity: 'http://biblob.at',
      //     score: 1
      //   }],
      //   isSelected: false
      // });

      // setup 'duraark-header' component ('setSession' has to be called first!):
      this.send('setSession', model);

      var label = model.get('label');
      this.send('setTitle', 'Archive Buildings - ' + label);
      this.send('showWorkflowSteps', true);
      this.send('setActiveStep', 'semanticenrichment');

      controller.set('topic', null);
      controller.set('selectedPhysicalAsset', null);
      controller.set('app', this.modelFor('application')); // FIXXME: create DuraarkController and extend!
    }

});
