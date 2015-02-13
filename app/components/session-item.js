import Ember from 'ember';

export default Ember.Component.extend({
	isSelected: false,

	actions: {
		onSelect: function(session) {
			this.toggleProperty('isSelected');
			this.sendAction('onSelect', session);
		},

		onDelete: function(session) {
			this.toggleProperty('isSelected');
			this.sendAction('onDelete', session);
		}		
	}
});
