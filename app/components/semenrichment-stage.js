import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		editStage: function(stage) {
			debugger;
			this.sendAction('editClicked', stage);
		}
	}
});