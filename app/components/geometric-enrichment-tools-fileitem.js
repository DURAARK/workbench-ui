import Ember from 'ember';

export default Ember.Component.extend({
	hasIfcReconstruction: false,
	hasHiddenFeatures: false,

	actions: {
		toggleIfcReconstruction: function() {
			this.toggleProperty('hasIfcReconstruction');

			var flag = this.get('hasIfcReconstruction'),
				item = this.get('item');

			if (flag) {
				item.set('ifcReconstruction', {
					label: 'test',
					description: 'asdf'
				});
			} else {
				item.set('ifcReconstruction', {});
			}

			//console.log('ifcRecon: ' + JSON.stringify(item.get('ifcReconstruction'), null, 4));
		},

		toggleHiddenFeatureDetection: function() {
			this.toggleProperty('hasHiddenFeatures');

			var flag = this.get('hasHiddenFeatures'),
				item = this.get('item');

			if (flag) {
				item.set('hiddenFeatures', {
					label: 'test',
					description: 'asdf'
				});
			} else {
				item.set('hiddenFeatures', {});
			}
		}
	},

	// onItemChange: function() {
	// 	var item = this.get('item');
	// 	console.log('ALKSDJFLKASDJFLKASDJFLKAJSDFLKJALKSDF');
	// 	this.set('shortName', item.get('path').split('/').pop());
	// }.observes('item')

	shortName: function() {
		var item = this.get('item');
		if (item.get('path')) {
			return item.get('path').split('/').pop();
		};
	}.property('item.path')
});