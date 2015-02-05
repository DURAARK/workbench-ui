import Ember from 'ember';

export
default Ember.Route.extend({
	model: function() {
		return this.store.find('file');
	},

	setupController: function(controller, files) {
		controller.set('model', files);
	}
});