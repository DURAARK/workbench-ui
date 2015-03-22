import Ember from 'ember';

export default Ember.Component.extend({
	itemMatches: function() {
		var item = this.get('item');
		if (item.get('path')) {
			var features = item.get('ifcReconstruction');
			console.log('asdf: ' + JSON.stringify(features, null, 4));
			return (features.label) ? true : false;
		}
	}.property('item.path'),

	shortName: function() {
		return this.get('item.path').split('/').pop();
	}.property('item.path')
});