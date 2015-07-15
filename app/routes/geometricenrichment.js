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
      description: 'If enabled an IFC file is reconstructed from the point cloud scan and added to the archive.'
    }), Ember.Object.create({
      label: 'Electrical Applicane Detection',
      description: 'If enabled an IFC file is generated containing a hypothesis of the in-wall electrical applicances of the building, which are extracted from the point cloud scan.'
    })];

    // FIXXME: incorporate selected tools from session!
    tools.forEach(function(tool) {
      tool.set('isSelected', false);
    });

    controller.set('tools', tools);
  }
});
