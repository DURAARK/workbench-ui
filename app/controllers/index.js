import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		startApplication: function() {
			this.transitionToRoute('sessions');
		}
	}
});