import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    var sessions = this.modelFor('application');
    var session = sessions.objectAt(params.id - 1);

    return session;
  },

  setupController: function(controller, model) {
    this._super(controller, model);

    var session = model,
      digObjs = [];

    controller.set('session', model);

    session.get('digitalObjects').forEach(function(digObj) {
      var obj = Ember.Object.create({
        label: digObj.label,
        buildm: digObj.buildm,
        semMD: Ember.Object.create(digObj.semMD),
        techMD: digObj.techMD,
        derivatives: digObj.derivatives,
        geoTools: []
      });

      digObjs.pushObject(obj);
    });

    controller.set('digitalObjects', digObjs);

    // FIXXME: get from SDA service!
    // FIXXME: create Topic model to enable saving and linking into session model!
    var tools = [Ember.Object.create({
      label: 'IFC Reconstruction',
      description: 'Enable this tool to reconstruct a BIM model (IFC format) from the point cloud scan.'
    }), Ember.Object.create({
      label: 'Electrical Appliance Detection',
      description: 'Enable this tool to reconstruct a BIM model (IFC format) from the point cloud scan which contains a hypothesis of the in-wall electrical applicances of the building.'
    })];

    // FIXXME: incorporate selected tools from session!
    tools.forEach(function(tool) {
      tool.set('isSelected', false);
    });

    controller.set('tools', tools);
  }
});
