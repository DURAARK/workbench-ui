import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('session');
  },

  actions: {
    showError: function(err) {
      alert('Error occured:\n' + err);
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
