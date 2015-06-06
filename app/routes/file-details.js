import Ember from 'ember';

export default Ember.Route.extend({
	actions: {
		goToRetrieval: function() {
			console.log('Go to retrieval...');
			this.transitionTo('workflows.retrieval');
		},

		goToArchival: function() {
			console.log('Go to archival...');
			this.transitionTo('workflows.files');
		},

		removeFile: function() {
			console.log('removed file: ');
		},

		detailsFile: function() {
			console.log('show file details for: ');
			this.transitionTo('fileDetails');
		}
	}
});
