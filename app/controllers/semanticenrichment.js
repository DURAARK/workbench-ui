import Ember from 'ember';
import SemanticEnrichmentAPI from 'workbench-ui/bindings/api-semanticenrichment';

export default Ember.Controller.extend({
	actions: {
		getSemanticEnrichments: function() {
			var semanticEnrichmentAPI = new SemanticEnrichmentAPI();
			semanticEnrichmentAPI.getMetadataFor({
				path: 'dummy.ifc'
			}).then(function(data) {
				console.log('data: ' + JSON.stringify(data, null, 4));

				// var ext = _getFileExtension(file.get('path'))[0],
				// 	schema = null;

				// if (ext.toLowerCase() === 'e57') {
				// 	schema = 'e57m';
				// } else if (ext.toLowerCase() === 'ifc') {
				// 	schema = 'ifcm';
				// }

				// var item = store.createRecord('metadatum', {
				// 	schema: schema,
				// 	format: 'application/json',
				// 	model: data,
				// 	file: file
				// });

				// metadata.pushObject(item);

				// if (fileStage.get('files.length') === metadata.get('length') - 1) { // take into account 'buildm' entry
				// 	metadataStage.set('isLoading', false);
				// 	controller.set('_isUpdatingMetadata', false);
				// }
			});
		}
	}
});