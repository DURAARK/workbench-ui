import Ember from 'ember';

export
default Ember.Component.extend({
  tagName: '',

  actions: {
    selectItem: function(item) {
      this.sendAction('select', item);
    },

    toggleSelection: function(item) {
      if (this.get('item.isSelected')) {
        this.set('item.isSelected', false);
        this.sendAction('details', null);
      } else {
        this.set('item.isSelected', true);
        this.sendAction('details', item);
      }
    },
  },

  name: function() {
    var path = this.get('item.path');
    if (path) {
      return path.split('/').pop();
    } else {
      var buildm = this.get('item.buildm');
      var name = "Session";

      if (buildm['http://data.duraark.eu/vocab/buildm/name'] && buildm['http://data.duraark.eu/vocab/buildm/name'].length) {
        name = buildm['http://data.duraark.eu/vocab/buildm/name'][0]['@value'];
      }
      return name;
    }
  }.property('item'),

  address: function() {
    debugger;
    var address = this.get('item.buildm')['http://data.duraark.eu/vocab/buildm/streetAddress'];

    if (!address) {
      return 'No address';
    }

    if (address.length) {
      return address[0]['@value'];
    } else {
      return 'No address given.'
    }
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
