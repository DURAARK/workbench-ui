import Ember from 'ember';

export
default Ember.Component.extend({
	actions: {
		selectItem: function(item) {
			this.sendAction('action', item);
		}
	},

	resourceName: function() {
		var resource = window.unescape(this.get('item.resourceUri'));
		var name = resource.split('/').pop();
		return name.replace(/_/g, ' ');
	}.property('item')
});