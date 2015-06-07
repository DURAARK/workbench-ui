import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		removeFile: function() {
			console.log('removed file: ');
		},

		detailsFile: function() {
			console.log('show file details for: ');
			this.get('currentController').transitionToRoute('fileDetails');
		}
	}
});
