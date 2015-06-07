import Ember from 'ember';

function _getFileExtension(filepath) {
	return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}

export default Ember.Route.extend({
	model: function() {
		// return this.store.find('filestage', 1);
		return this.store.find('file');
	},

	setupController: function(controller, model) {
		var files = model;

		// model.get('files').forEach(function(file) {
		// 	debugger;
		// 	// var ext = _getFileExtension(file.get('path'))[0];
		// 	// if (ext.toLowerCase() === 'ifc') {
		// 	// 	file.set('isIFC', true);
		// 	// 	file.set('isE57', false);
		// 	// } else {
		// 	// 	file.set('isIFC', false);
		// 	// 	file.set('isE57', true);
		// 	// }

		// 	files.pushObject(file);
		// });

		controller.set('files', files);
	}
});