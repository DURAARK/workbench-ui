import Ember from 'ember';

export
default Ember.Component.extend({
	tagName: '',

	actions: {
		selectItem: function(item) {
			this.sendAction('select', item);
		},
		showDetails: function(item) {
			this.sendAction('details', item);
		},
		select: function() {
	      var item = this.get('item');
	      this.sendAction('select', item);
	    }
	},

	name: function() {
		var buildm = this.get('item.buildm');
		var name = buildm['http://data.duraark.eu/vocab/name'][0]['@value'];

		if (name) {
			return name;
		}

		return 'No name given';
	}.property('item'),

	size: function() {
    var size = this.get('item.size');
    return numeral(size).format('0 b');
  }.property('item'),

	extension: function() {
		var path = this.get('item.path');
		if (path) {
			return _getFileExtension(path)[0];
		}

		return '';
	}.property('item'),

	isPhysicalAsset: function() {
			var type = this.get('item')['buildm']['@type'][0];
			return type === 'http://data.duraark.eu/vocab/PhysicalAsset';
	},

	isIFC: function() {
		var type = this.get('item')['buildm']['@type'][0];
		return type === 'http://data.duraark.eu/vocab/IFCSPFFile';
	}.property('item'),

	isE57: function() {
		var type = this.get('item')['buildm']['@type'][0];
		return type === 'http://data.duraark.eu/vocab/E57File';
	}.property('item')
});

function _getFileExtension(filepath) {
	return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}
