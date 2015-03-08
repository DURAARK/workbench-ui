import Ember from 'ember';

export
default Ember.Component.extend({
	actions: {
		onDelete: function(item) {
			this.sendAction('onDelete', item);
		}
	},

	filename: function() {
		var path = this.get('item.path');
		if (path) {
			return path.split('/').pop();
		}

		return '';
	}.property('item'),

	extension: function() {
		var path = this.get('item.path');
		if (path) {
			return _getFileExtension(path)[0];
		}
		
		return '';
	}.property('item')
});

function _getFileExtension(filepath) {
	return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}