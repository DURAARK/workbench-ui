import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		createCustomFilter: function() {
			this.transitionToRoute('workflows.retrieval-custom');
		}
	}
});
