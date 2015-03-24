import Ember from 'ember';

export
default Ember.Component.extend({
	actions: {
		filename: function() {
			return this.get('model.file').split('/').pop();
		}.property('model')
	}
});