import Ember from 'ember';

export default Ember.Route.extend({
	model: function(param) {
		return this.store.find('geometricenrichmentstage', param.id);
	},

	setupController: function(controller, model) {
		this._super(controller, model);

		var stage = model;

		controller.set('stage', stage);
		controller.set('files', []);
		controller.set('enrichments', []);
		controller.set('hasIfcReconstructionEnrichments', false);
		controller.set('hasHiddenFeaturesEnrichments', false);

		this.store.find('filestage', stage.get('id')).then(function(filestage) {
			filestage.get('files').then(function(files) {
				controller.set('files', files);
			});
		});
	},

	actions: {
		save: function(stage) {
                var stage = this.get('controller.stage');
                this.transitionTo('preingest.show', stage.get('session'));
		}
	}
});