import Ember from 'ember';

export default Ember.Component.extend({
	isSelected: false,

	actions: {
		onSelection: function(session) {
			this.toggleProperty('isSelected');
			this.sendAction('action', session);
		}
	}
});
