import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.find('session');
	},

	setupController: function(controller, model) {
		this._super(controller, model);
	},

	actions: {
		highlightSession: function(session) {
			var sessions = this.modelFor('application');

			sessions.forEach(function(session) {
				session.set('isSelected', false);
			});

			session.set('isSelected', true);
		}
	}
});