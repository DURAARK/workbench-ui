import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		return this.store.find('stage', params.id);
	},

	setupController: function(controller, model) {
		// Request files:
		controller.set('model', model);
		var files = model.get('model').files;
		debugger;
		controller.set('files', [this.store.find('file', files[0])]);

		// this.store.find('file').then(function(records) {
		// 	debugger;
		// 	var bla = records.toArray();
		// 	// controller.set('files', [records.toArray()[0], records.toArray()[1]]);
		// });
	}
});