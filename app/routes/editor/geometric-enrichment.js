import Ember from 'ember';

export default Ember.Route.extend({
	model: function(param) {
		return this.store.find('geometricenrichmentstage', param.id);
	},

	setupController: function(controller, model) {
		this._super(controller, model);
		
		var stage = model;

		this.store.find('filestage', stage.get('id')).then(function(filestage) {
			filestage.get('files').then(function(files) {
				controller.set('files', files);
				files.forEach(function(file) {
					console.log('file: ' + file.get('path'));
				})
			});
		});
	}
});