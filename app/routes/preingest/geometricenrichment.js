import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
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

    var session = model,
      digObjs = [],
      pointClouds = [];

    controller.set('session', model);

    let digitalObjects = session.get('digitalObjects');
    if (digitalObjects) {
      digitalObjects.forEach(function(digObj) {
        var obj = Ember.Object.create({
          label: digObj.label,
          buildm: digObj.buildm,
          semMD: Ember.Object.create(digObj.semMD),
          geoTools: digObj.geoTools ? digObj.geoTools : [],
          techMD: digObj.techMD,
          derivatives: [], // FIXXME?
          size: digObj.size,
          path: digObj.path
        });

        // 'ember objectify' geo tools:
        let geoTools = [];
        obj.get('geoTools').forEach(tool => {
          let toolObj = Ember.Object.create(tool);
          // // FIXXME: HACK: these parameters have to be set by the geometric enrichment service!
          // toolObj.set('hasData', true);
          // toolObj.set('hasError', false);
          // toolObj.set('isLoading', false);
          geoTools.pushObject(toolObj);
        });
        obj.set('geoTools', geoTools);

        digObjs.pushObject(obj);

        if (digObj.path && digObj.path.endsWith('e57') || digObj.path.endsWith('e57n') || digObj.path.endsWith('ifc')) {
          pointClouds.pushObject(obj);
        }
      });

      model.set('digitalObjects', digObjs);
      controller.set('digitalObjects', pointClouds);
    }

    // FIXXME: get from SDA service!
    // FIXXME: create Topic model to enable saving and linking into session model!
    var tools = [Ember.Object.create({
        label: 'Reconstruct BIM Model',
        description: 'Enable this tool to reconstruct a BIM model (IFC format) from the point cloud scan.',
        fileType: ['e57', 'e57n']
      }), Ember.Object.create({
        label: 'Detect Power Lines',
        description: 'Enable this tool to reconstruct a BIM model (IFC format) from the point cloud scan which contains a hypothesis of the in-wall electrical appliances of the building.',
        fileType: ['e57', 'e57n']
      }),
      Ember.Object.create({
        label: 'Difference Detection',
        description: 'Enable this tool to detect differences between two point cloud files, or a point cloud file with a BIM model.',
        fileType: ['ifc', 'e57', 'e57n']
      }),
      Ember.Object.create({
        label: 'Point Cloud Compression',
        description: 'Enable this tool to generate a compressed point cloud (with added normals.)',
        fileType: ['e57', 'e57n']
      })
    ];

    // FIXXME: incorporate selected tools from session!
    tools.forEach(function(tool) {
      tool.set('isSelected', false);
    });

    controller.set('allTools', tools);
    controller.set('selectedDigitalObject', null);
    controller.set('app', this.modelFor('application')); // FIXXME: create DuraarkController and extend!

    // setup 'duraark-header' component ('setSession' has to be called first!):
    this.send('setSession', model);

    var label = model.get('label');
    this.send('setTitle', 'Archive Buildings - ' + label);
    this.send('showWorkflowSteps', true);
    this.send('setActiveStep', 'geometricenrichment');

    controller.set('tool', null);
    controller.set('selectedDigitalObject', null);
    controller.set('app', this.modelFor('application')); // FIXXME: create DuraarkController and extend!
  }
});
