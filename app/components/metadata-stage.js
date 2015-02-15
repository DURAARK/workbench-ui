import Ember from 'ember';

export default Ember.Component.extend({
	itemController: 'metadata-item',
	actions: {
		editFiles: function(stage) {
			this.sendAction('editClicked', stage);
		}
	}
});