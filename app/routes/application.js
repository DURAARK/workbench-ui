import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('session');

    // return this.store.find('session').then(function(sessions) {
    //
    //   var newSessions = [];
    //
    //   sessions.forEach(function(session) {
    //     // FIXXME: this code is obsolete when the session model is completely constructed via Ember models...
    //     // Convert (some) parts to Ember.Objects to make them accessible in the templates:
    //     var newSession = Ember.Object.create({
    //       physicalAssets: session.get('physicalAssets'),
    //       digitalObjects: []
    //     });
    //
    //     session.get('digitalObjects').forEach(function(digObj) {
    //       var obj = Ember.Object.create({
    //         label: digObj.label,
    //         buildm: digObj.buildm,
    //         semMD: Ember.Object.create(digObj.semMD),
    //         techMD: digObj.techMD,
    //         derivatives: digObj.derivatives
    //       });
    //
    //       newSession.get('digitalObjects').pushObject(obj);
    //     });
    //
    //     newSessions.pushObject(newSession);
    //   });
    //
    //   return newSessions;
    // });
  },

  setupController: function(controller, model) {
    this._super(controller, model);
  },

  actions: {
    showError: function(err) {
      alert('Error occured:\n' + err);
    },

    setNumDigitalObjects: function(num) {
      this.controller.set('numDigitalObjects', num);
    },

    setNumActionsPending: function(num) {
      this.controller.set('numActionsPending', num)
    },

    addPendingAction: function() {
      var num = this.controller.get('numActionsPending');
      this.controller.set('numActionsPending', ++num);
    }
  }

  //
  // setupController: function(controller, model) {
  // 	debugger;
  // 	this._super(controller, model);
  // },

  // actions: {
  // 	highlightSession: function(session) {
  // 		var sessions = this.modelFor('application');

  // 		sessions.forEach(function(item) {
  // 			item.set('isSelected', false);
  // 		});

  // 		session.set('isSelected', true);
  // 	}
  // }
});
