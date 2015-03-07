import Ember from 'ember';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';
import IfcMetadataAPI from 'workbench-ui/bindings/api-ifcmetadata';

function _getFileExtension(filepath) {
	return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}

export default Ember.Controller.extend({
	physicalAsset: null,
	digitalObjects: [],

	e57mFileShort: function() {
		var e57mName = this.get('stage.e57m.file');
		if (e57mName) {
			return e57mName.split('/').pop();
		}

		return 'no file given';
	}.property('stage.e57m.file'),

	ifcmFileShort: function() {
		var ifcmName = this.get('stage.ifcm.file');
		if (ifcmName) {
			return ifcmName.split('/').pop();
		}

		return 'no file given';
	}.property('stage.ifcm.file'),

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
					if (md.type === 'ifc') {
						var physicalAsset = that.store.createRecord('physicalAsset', md.physicalAsset);
						metadataStage.set('physicalAsset', physicalAsset);

						var digitalObject = that.store.createRecord('digitalObject', md.digitalObject);
						metadataStage.get('digitalObjects').pushObject(digitalObject);

						var ifcm = that.store.createRecord('ifcm', md.ifcm);
						metadataStage.get('ifcms').pushObject(ifcm);
					} else if (md.type === 'e57') {
						var e57m = that.store.createRecord('e57m', md.e57m);
						metadataStage.get('e57ms').pushObject(e57m);
					}
				});
			}

			console.log('path: ' + file.get('path'));
		});
	}.observes('files')
});