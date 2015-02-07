import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		editFiles: function(files) {
			debugger;
			this.sendAction('editClicked', {
				editor: 'documents',
				model: files
			});
		}
	}
});