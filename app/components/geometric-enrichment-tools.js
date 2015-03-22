import Ember from 'ember';

export default Ember.Component.extend({
	classNameBindings: ['isSelected:js-is-selected'],

	isSelected: false,

	// actions: {
	// 	postIfcReconstruction: function() {
	// 		console.log('postIfcReconstruction');
	// 		this.set('isSelected', true);
	// 	},
	// 	postHiddenFeatureDetection: function() {
	// 		console.log('postHiddenFeatureDetection');
	// 		this.set('isSelected', false);
	// 	}
	// }
});