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
        geoMD: Ember.Object.create({tools: Ember.A()}),
      });

      digObjs.pushObject(obj);
    });

    controller.set('digitalObjects', digObjs);

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

    controller.set('tools', tools);
  }
});
