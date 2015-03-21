import Ember from 'ember';

export default Ember.Controller.extend({
	showSidebar: true,

	actions: {
		toggleSidebar: function() {
			this.toggleProperty('showSidebar');
			console.log('Toggled sidebar to: ' + this.get('showSidebar'));
		}
	}
});
