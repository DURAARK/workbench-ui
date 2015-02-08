import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		editFiles: function(stage) {
			this.sendAction('editClicked', stage);
		}
	}
});