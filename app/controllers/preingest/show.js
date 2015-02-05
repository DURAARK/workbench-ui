import Ember from 'ember';

export default Ember.ObjectController.extend({
	needs: ['application'],

	actions: {
		handleEdit: function(route) {
			console.log('handlingEdit: route = ' + route);

			// // FIXXME: store current session, for later access in files route:
			// var session = this.get('model');
			// var app = this.get('controllers.application');
			// app.set('session', session);
			
			this.transitionToRoute(route);
		}
	}
});