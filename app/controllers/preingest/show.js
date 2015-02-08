import Ember from 'ember';

export default Ember.ObjectController.extend({
	stageFile: null,

	// onModelChange: function() {
	// 	this.get('model.stages').then(function(records) {
	// 		debugger;

	// 		var bla = null;
	// 		records.forEach(function(record) {
	// 			console.log('record: ' + record.get('type'));
	// 			bla = record;
	// 		});

	// 		this.set('stageFile', bla);
	// 	}.bind(this));
	// }.observes('model'),

	actions: {
		editStage: function(stage) {
			console.log('[preingest.show] requesting stage editor: ' + JSON.stringify(stage, null, 4));
			this.get('model.stages').then(function(records) {
				var blas = [];

				records.forEach(function(record) {
					console.log('record: ' + record.get('type'));
					blas.push(record);
				});

				// this.set('stageFile', blas);

				var asdf = blas[0];
				var model = asdf.get('model');
				debugger;
				this.transitionToRoute('files', 0);
			}.bind(this));
		}
	}
});