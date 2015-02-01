import Ember from 'ember';

export
default Ember.Route.extend({
	model: function() {
		return this.store.find('file');
	},

	setupController: function(controller, model) {
		controller.set('model', model);
		controller.set('files', model);
	},

	renderTemplate: function() {
		this.render({
			outlet: 'main'
		});
	}
});