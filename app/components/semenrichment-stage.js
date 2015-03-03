import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		edit: function(stage) {
			this.sendAction('editClicked', stage);
		}
	}
});