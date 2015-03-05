import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		download: function() {
			alert('Downloading...');
		}
	}
});