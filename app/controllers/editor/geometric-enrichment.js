import Ember from 'ember';

function _getFileExtension(filepath) {
	return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}

export default Ember.Controller.extend({
	enrichements: [],
	ifcReconstructionEnrichments: false,
	hiddenFeaturesEnrichments: false,

	onFilesChange: function() {
		var files = this.get('files'),
			controller = this;

		controller.set('enrichments', []);

		files.forEach(function(file) {
			if (_getFileExtension(file.get('path'))[0].toLowerCase() === 'e57') {
				var enrichment = controller.store.createRecord('enrichment', {
					path: file.get('path'),
					ifcReconstruction: {},
					hiddenFeatures: {}
				});

				controller.get('enrichments').pushObject(enrichment);
			}
		});

		// console.log('onFileChange: ' + files.get('length'));

		// files.forEach(function(file) {
		// 	var ext = _getFileExtension(file.get('path'))[0];
		// 	if (ext.toLowerCase() === 'e57') {
		// 		file.set('shortName', file.get('path').split('/').pop());
		// 		controller.get('compatibleFiles').pushObject(file);
		// 	}
		// }.bind(this));
	}.observes('files'),

	onEnrichmentChange: function() {
		// console.log('asdflkajsdflkajsdlfkjasdlkfjasdf: CHANGED');

		var enrichments = this.get('enrichments'),
			controller = this;

		enrichments.forEach(function(item) {
			var recon = item.get('ifcReconstruction');
			if (recon.label) {
				item.set('hasIfcReconstruction', true);
				controller.set('ifcReconstructionEnrichments', true); // FIXXME: visualize no items. this is a quick hack, which is not really working
			} else {
				item.set('hasIfcReconstruction', false);
			}

			var hiddenFeatures = item.get('hiddenFeatures');
			if (hiddenFeatures.label) {
				item.set('hasHiddenFeatures', true);
				controller.set('hiddenFeaturesEnrichments', true);
			} else {
				item.set('hasHiddenFeatures', false);
			}
		});
	}.observes('enrichments.@each.ifcReconstruction', 'enrichments.@each.hiddenFeatures')

});