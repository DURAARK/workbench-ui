import Ember from 'ember';

export default Ember.Route.extend({
      model: function(params) {
        return this.store.find('session', params.id);
      },

      setupController: function(controller, model) {
        this._super(controller, model);

        var session = model,
          digObjs = [],
          pointClouds = [];

        controller.set('session', model);

        if (session.get('digitalObjects')) {
            session.get('digitalObjects').forEach(function(digObj) {
              var geoMD = digObj.geoMD;

              if (!geoMD) {
                geoMD = Ember.Object.create({
                  tools: []
                });
              } else {
                geoMD = Ember.Object.create({
                  tools: digObj.geoMD.tools
                });
              }

              var tools = [];

              _.forEach(geoMD.tools, function(tool) {
                tools.pushObject(Ember.Object.create(tool));
              });

              geoMD.set('tools', tools);

              var obj = Ember.Object.create({
                label: digObj.label,
                buildm: digObj.buildm,
                semMD: Ember.Object.create(digObj.semMD),
                geoMD: Ember.Object.create(geoMD),
                techMD: digObj.techMD,
                derivatives: [], // FIXXME?
                size: digObj.size,
                path: digObj.path
              });

              digObjs.pushObject(obj);

              if (digObj.path && digObj.path.endsWith('e57')) {
                pointClouds.pushObject(obj);
              }
            });

            model.set('digitalObjects', digObjs);
            controller.set('digitalObjects', pointClouds);
          }

          // FIXXME: get from SDA service!
          // FIXXME: create Topic model to enable saving and linking into session model!
          var tools = [Ember.Object.create({
            label: 'IFC Reconstruction',
            description: 'Enable this tool to reconstruct a BIM model (IFC format) from the point cloud scan.',
            rooms: 0,
            area: 0,
            walls: 0
          }), Ember.Object.create({
            label: 'Electrical Appliance Detection',
            description: 'Enable this tool to reconstruct a BIM model (IFC format) from the point cloud scan which contains a hypothesis of the in-wall electrical appliances of the building.',
            rooms: 0,
            walls: 0,
            elecDetectImages: [{
              src: '/nygade/elecdetect-test-set/results/wall1-result.jpg'
            }, {
              src: '/nygade/elecdetect-test-set/results/wall0-result.jpg'
            }, {
              src: '/nygade/elecdetect-test-set/results/wall5-result.jpg'
            }, {
              src: '/nygade/elecdetect-test-set/results/wall4-result.jpg'
            }, {
              src: '/nygade/elecdetect-test-set/results/wall2-result.jpg'
            }, {
              src: '/nygade/elecdetect-test-set/results/wall3-result.jpg'
            }],
            ruleSetImages: [{
              src: '/nygade/wiregen/output/svg_grammar/wall1.svg'
            }, {
              src: '/nygade/wiregen/output/svg_grammar/wall0.svg'
            }, {
              src: '/nygade/wiregen/output/svg_grammar/wall5.svg'
            }, {
              src: '/nygade/wiregen/output/svg_grammar/wall4.svg'
            }, {
              src: '/nygade/wiregen/output/svg_grammar/wall2.svg'
            }, {
              src: '/nygade/wiregen/output/svg_grammar/wall3.svg'
            }],
            hypothesisImages: [{
              src: '/nygade/wiregen/output/svg_hypothesis/wall1.svg'
            }, {
              src: '/nygade/wiregen/output/svg_hypothesis/wall0.svg'
            }, {
              src: '/nygade/wiregen/output/svg_hypothesis/wall5.svg'
            }, {
              src: '/nygade/wiregen/output/svg_hypothesis/wall4.svg'
            }, {
              src: '/nygade/wiregen/output/svg_hypothesis/wall2.svg'
            }, {
              src: '/nygade/wiregen/output/svg_hypothesis/wall3.svg'
            }],
          })];

          // FIXXME: incorporate selected tools from session!
          tools.forEach(function(tool) {
            tool.set('isSelected', false);
          });

          controller.set('allTools', tools);

          // setup 'duraark-header' component:
          var label = model.get('label');
          this.send('setTitle', 'Data Archival - ' + label);
          this.send('showWorkflowSteps', true);
          this.send('setSession', model);
          this.send('setActiveStep', 'geometricenrichment');          
        }
      });
