import Ember from 'ember';

export default Ember.Controller.extend({
	selectedProperty: null,
	errorMessage: null,
	searchConstraints: Ember.A(),

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
	}.observes('buildings'),

	onErrorMessageChanged: function() {
		var message = this.get('errorMessage');

		if (message) {
			// TODO: replace with a popup message!
			alert('Error: ' + message);
			this.set('errorMessage', null);
		}
	}.observes('errorMessage'),

	actions: {
		addSearchConstraint: function() {
			var selectedProperty = this.get('selectedProperty'),
				propertyValue = this.get('propertyValue');

			if (!selectedProperty) {
				this.set('errorMessage', 'Please select a property first!');
				return;
			}

			if (!propertyValue) {
				this.set('errorMessage', 'Please enter a value for the property first!');
				return;
			}

			var constraints = this.get('searchConstraints');
			constraints.pushObject({
				property: selectedProperty,
				value: propertyValue
			});
			console.log('Added constraint | ' + selectedProperty + ': ' + propertyValue);
		},

		selectProperty: function(property) {
			console.log('selectedProperty: ' + property);
			this.set('selectedProperty', property);
		}
	}
});