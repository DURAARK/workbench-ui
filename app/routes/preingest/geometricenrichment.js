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

    if (session.get('digitalObjects')) {
      session.get('digitalObjects').forEach(function(digObj) {
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
      label: 'Reconstruct BIM Model',
      description: 'Enable this tool to reconstruct a BIM model (IFC format) from the point cloud scan.',
    }), Ember.Object.create({
      label: 'Detect Power Lines',
      description: 'Enable this tool to reconstruct a BIM model (IFC format) from the point cloud scan which contains a hypothesis of the in-wall electrical appliances of the building.',
    }), Ember.Object.create({
      label: 'Extract Floor Plan and Room Information',
      description: 'Enable this tool to extract a floor plan with additional geometric information for each room.',
      rooms: 0,
      walls: 0
    })];

    // FIXXME!
    Ember.$.get('/assets/bygade/wall.json').then(function(response) {
      controller.set('wallConfig', response);
    });

    // FIXXME: incorporate selected tools from session!
    tools.forEach(function(tool) {
      tool.set('isSelected', false);
    });

    controller.set('allTools', tools);
    controller.set('selectedDigitalObject', null);

    // setup 'duraark-header' component ('setSession' has to be called first!):
    this.send('setSession', model);

    var label = model.get('label');
    this.send('setTitle', 'Archive Buildings - ' + label);
    this.send('showWorkflowSteps', true);
    this.send('setActiveStep', 'geometricenrichment');

    controller.set('app', this.modelFor('application')); // FIXXME: create DuraarkController and extend!
  }
});
