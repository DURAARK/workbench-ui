import Ember from 'ember';
import ENV from '../config/environment';

var apiConfig = ENV.DURAARKAPI.physicalAssets;

export default Ember.Controller.extend({
	selectedProperty: null,
	errorMessage: null,
	filters: Ember.A(),

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
		addFilter: function() {
			var selectedProperty = this.get('selectedProperty'),
				propertyValue = this.get('propertyValue'),
				filters = this.get('filters');

			if (!selectedProperty) {
				this.set('errorMessage', 'Please select a property first!');
				return;
			}

			if (!propertyValue) {
				this.set('errorMessage', 'Please enter a value for the property first!');
				return;
			}

			filters.pushObject({
				property: selectedProperty,
				value: propertyValue
			});

			console.log('Added filter | ' + selectedProperty + ': ' + propertyValue);

			this.send('performSearch');
		},

		clearFilter: function(filter) {
			var filters = this.get('filters');
			filters.removeObject(filter);

			if (filters.get('length')) {
				this.send('performSearch');
			} else {
				this.send('listAll');
			}
		},

		clearAllFilters: function() {
			this.set('filters', Ember.A());
			this.send('listAll');
		},

		selectProperty: function(property) {
			console.log('selectedProperty: ' + property);
			this.set('selectedProperty', property);
		},

		listAll: function() {
			this.store.find('physicalAsset').then(function(records) {
				this.set('buildings', records);
				// FIXXME: for some reason the observer does not fire, we
				// have to call the callback manually:
				this.onBuildingsChanged();
			}.bind(this));
		},

		performSearch: function() {
			var constraints = this.get('filters'),
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
				url: apiConfig.host + '/search',
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