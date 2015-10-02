import Ember from 'ember';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';

export default Ember.Route.extend({
	model: function(params) {
		return this.store.find('e57m', params.id);
	},

	setupController: function(controller, model) {
		this._super(controller, model);
		
		var filename = model.get('file');
		// controller.set('showLoadingSpinner', true);

		console.log('updating e57m  for file: ' + filename);

		var metadataAPI = new E57MetadataAPI(),
			controller = this;

		metadataAPI.getMetadataFor({
			path: filename
		}).then(function(md) {
			var e57m = model;
			e57m.set('instance', md.e57m.instance);

			controller.set('showLoadingSpinner', false);
		});
	}
});