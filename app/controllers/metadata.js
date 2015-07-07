import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showDetails: function(item) {
      var controller = this;

      // Reset details pane:
      controller.set('fileInfo', item);
    }
  },

  isPhysicalAsset: function() {
			var type = this.get('fileInfo')['buildm']['@type'][0];
			return type === 'http://data.duraark.eu/vocab/PhysicalAsset';
	}.property('fileInfo'),

	isIFC: function() {
		var type = this.get('fileInfo')['buildm']['@type'][0];
		return type === 'http://data.duraark.eu/vocab/IFCSPFFile';
	}.property('fileInfo'),

	isE57: function() {
		var type = this.get('fileInfo')['buildm']['@type'][0];
		return type === 'http://data.duraark.eu/vocab/E57File';
	}.property('fileInfo')
});
