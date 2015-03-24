import Ember from 'ember';

export
default Ember.Component.extend({
	filename: function() {
		debugger;
		var ba = this.get('model.file');
		return this.get('model.file').split('/').pop();
	}.property('model')
});