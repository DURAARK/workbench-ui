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
		console.log('updated markers');
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

		removeSearchConstraint: function(constraint) {
			var constraints = this.get('searchConstraints');
			constraints.removeObject(constraint);
		},

		selectProperty: function(property) {
			console.log('selectedProperty: ' + property);
			this.set('selectedProperty', property);
		},

		listAll: function() {
			debugger;
			this.store.find('physicalAsset').then(function(records) {
				debugger;
				console.log('records: ' + records.get('length'));
				this.set('buildings', records);
			}.bind(this));
		},

		performSearch: function() {
			var constraints = this.get('searchConstraints'),
				that = this;

			if (!constraints.length) {
				this.set('errorMessage', 'You have to add a search constraint first!');
				return;
			}

			var data = JSON.parse(JSON.stringify(constraints, null, 4));
			console.log('Searching for: ' + JSON.stringify(data, null, 4));

			var payload = {
				constraints: data
			};

			$.ajax({
				type: 'POST',
				url: 'http://localhost:5005/example/search',
				data: payload
			}).done(function(response) {
				that.store.unloadAll('physicalAsset');
				that.store.pushMany('physicalAsset', response);
				// console.log('Search response: ' + JSON.stringify(response, 4, null));

				that.set('buildings', that.store.all('physicalAsset'));
			}).fail(function(error) {
				console.log('Search error: ' + JSON.stringify(error, 4, null));
			})
		}
	}
});