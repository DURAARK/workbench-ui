import Ember from 'ember';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';
import IfcMetadataAPI from 'workbench-ui/bindings/api-ifcmetadata';

function _getFileExtension(filepath) {
	return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}

export default Ember.Controller.extend({
	actions: {
		selectItem: function(item) {
			var filename = item.get('file');
			var fileext = _getFileExtension(filename)[0];

			if (fileext === 'e57' && item.get('schema') === 'e57m') {
				console.log('selectItem: ' + item.get('schema'));
				this.transitionToRoute('metadata.e57m', item);
			}

			if (fileext === 'ifc' && item.get('schema') === 'ifcm') {
				console.log('selectItem: ' + item.get('schema'));
				this.transitionToRoute('metadata.ifcm', item);
			}
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
						physicalAsset.save().then(function() {
							metadataStage.set('physicalAsset', physicalAsset);
						});

						var digitalObject = that.store.createRecord('digitalObject', md.digitalObject);
						digitalObject.save().then(function() {
							metadataStage.get('digitalObjects').pushObject(digitalObject);
						});

						var ifcm = that.store.createRecord('ifcm', md.ifcm);
						ifcm.save().then(function() {
							metadataStage.get('ifcms').pushObject(ifcm);
						});
					} else if (md.type === 'e57') {
						var e57m = that.store.createRecord('e57m', md.e57m);
						e57m.save().then(function() {
							metadataStage.get('e57ms').pushObject(e57m);
						});
					}
				});
			}

			console.log('path: ' + file.get('path'));
		});
	}.observes('files')
});