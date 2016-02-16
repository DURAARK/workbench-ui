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
		// incoming filename is either 'http://download.able.url/file.ext' or 'file.ext' for non-downloadable files
		var name = buildm['http://data.duraark.eu/vocab/buildm/filename']['@value'].split('/').pop();

		console.log('name: ' + name);

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
    let buildm = this.get('item')['buildm'];
    return this.duraark.isOfType(buildm, 'http://data.duraark.eu/vocab/buildm/PhysicalAsset');
  }.property('item'),

  isIFC: function() {
    let buildm = this.get('item')['buildm'];
    return this.duraark.isOfType(buildm, 'http://data.duraark.eu/vocab/buildm/IFCSPFFile');
  }.property('item'),

  isE57: function() {
    let buildm = this.get('item')['buildm'];
    return this.duraark.isOfType(buildm, 'http://data.duraark.eu/vocab/buildm/E57File');
  }.property('item')
});

function _getFileExtension(filepath) {
	return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}
