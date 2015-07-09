import Ember from 'ember';

export
default Ember.Component.extend({
	tagName: '',

	actions: {
		select: function(topic) {
			this.sendAction('select', topic);
		},

		remove: function(topic) {
			this.sendAction('remove', topic);
		}
	}
});
