import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		editFiles: function() {
			this.sendAction('editClicked', 'files');
		}
	}
});
