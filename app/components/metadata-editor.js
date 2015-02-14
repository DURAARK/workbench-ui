import Ember from 'ember';

export default Ember.Component.extend({
	onFileChanged: function() {
		debugger;
		var file = this.get('file');
		console.log('showing metadata for file: ' + file.get('path'));
	}.observes('file')
});
