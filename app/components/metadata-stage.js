import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		editStage: function(stage) {
			this.sendAction('editClicked', stage);
		}
	}
});