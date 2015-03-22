import Ember from 'ember';

function _getFileExtension(filepath) {
	return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}

export default Ember.Controller.extend({
	compatibleFiles: [],

	onFilesChange: function() {
		var files = this.get('files'),
		controller = this;

		console.log('onFileChange: ' + files.get('length'));

		files.forEach(function(file) {
			var ext = _getFileExtension(file.get('path'))[0];
			if (ext.toLowerCase() === 'e57') {
				file.set('shortName', file.get('path').split('/').pop());
				controller.get('compatibleFiles').pushObject(file);
			}
		}.bind(this));
	}.observes('files')
});