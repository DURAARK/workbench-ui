import Ember from 'ember';

export default Ember.Controller.extend({
	selectedProperty: null,

	onBuildingsChanged: function() {
		var markers = [],
			buildings = this.get('buildings');

		buildings.forEach(function(item) {
			markers.push({
				location: L.latLng(item.get('latitude'), item.get('longitude')),
				title: 'Building'
			});
		});
		this.set('markers', markers);
	}.observes('buildings')
});