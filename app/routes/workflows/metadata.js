import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.find('filestage', 1);
	},

	setupController: function(controller, model) {
		this._super(controller, model);

		var files = model.get('files');
		debugger;
		controller.set('files', files);
	}
});