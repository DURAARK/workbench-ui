import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		showSession: function(session) {
			this.transitionToRoute('sessions.show', session);
		}
	}
});