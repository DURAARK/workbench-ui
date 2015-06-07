import Ember from 'ember';

function _getFileExtension(filepath) {
	return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}

function _setFileType(file) {
	var ext = _getFileExtension(file.get('path'))[0];
	if (ext.toLowerCase() === 'ifc') {
		file.set('isIFC', true);
		file.set('isE57', false);
	} else {
		file.set('isIFC', false);
		file.set('isE57', true);
	}
}

export default Ember.Route.extend({
	model: function() {
		var route = this;
		return route.store.find('file').then(function(allFileRecords) {
			return route.store.find('filestage', 1).then(function(filestageRecord) {
				var allFiles = [],
					selectedFiles = [];

				allFileRecords.forEach(function(file) {
					_setFileType(file);
					allFiles.pushObject(file);
				});

				filestageRecord.get('files').forEach(function(file) {
					_setFileType(file);
					selectedFiles.pushObject(file);
				});

				return {
					allFiles: allFiles,
					selectedFiles: selectedFiles
				};
			});
		});
	},

	actions: {
		goToRetrieval: function() {
			console.log('Go to retrieval...');
			this.transitionTo('workflows.retrieval');
		},

		goToArchival: function() {
			console.log('Go to archival...');
			this.transitionTo('workflows.files');
		},

		removeFile: function() {
			console.log('removed file: ');
		},

		detailsFile: function() {
			console.log('show file details for: ');
			this.transitionTo('fileDetails');
		}
	}
});