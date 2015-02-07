import Ember from 'ember';

export default Ember.ObjectController.extend({
	needs: ['application'],

	actions: {
		handleEdit: function(files) {
			debugger;
			// console.log('handlingEdit: files = ' + JSON.stringify(files, null, 4));


			// this.transitionToRoute('editor/' + files.editor, files.model);
			this.transitionToRoute(files.editor, files.model);
		}
	}
});