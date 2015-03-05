import Ember from 'ember';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';
import IfcMetadataAPI from 'workbench-ui/bindings/api-ifcmetadata';

function _getFileExtension(filepath) {
	return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}

export default Ember.Controller.extend({
	physicalAsset: null,
	digitalObjects: [],

	actions: {
		editMetadata: function(file) {
			console.log('editMetadata: ' + file.get('schema'));
			this.set('selectedInstance', file);
		}
	},

	onFilesStageChanged: function() {
		var files = this.get('files'),
			metadataStage = this.get('stage'),
			schema = null,
			that = this;

		files.forEach(function(file) {
			var ext = _getFileExtension(file.get('path'))[0],
				metadataAPI = null;

			if (ext.toLowerCase() === 'ifc') {
				metadataAPI = new IfcMetadataAPI();
				schema = 'ifcm';
			} else if (ext.toLowerCase() === 'e57') {
				metadataAPI = new E57MetadataAPI();
				schema = 'e57m';
			}

			if (metadataAPI) {
				metadataAPI.getMetadataFor({
					path: file.get('path')
				}).then(function(md) {
					debugger;
					if (md.schema === 'ifcm') {
						that.set('physicalAsset', md.physicalAsset);
						that.get('digitalObjects').pushObject(md.digitalObject);
					} else if (md.schema === 'e57m') {
						var record = that.store.createRecord('e57m', md);
						// metadataStage.set('e57m', record);
						that.get('digitalObjects').pushObject(record);
					}
				});
			}

			console.log('path: ' + file.get('path'));
		});
	}.observes('files')
});