import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		// return this.store.find('e57');

		return {
			e57: [{
				key: 'Creator',
				value: 'Martin'
			}, {
				key: 'Latitude',
				value: '15'
			}, {
				key: 'Longitude',
				value: '43'
			}]
		}
	},

	setupController: function(controller, model) {
		controller.set('model', model)
		controller.set('metadata', model.e57);

		console.log('')
	}
});