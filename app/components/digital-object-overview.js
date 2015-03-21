import Ember from 'ember';

export default Ember.Component.extend({
	filename: function() {
		return this.get('item.file').split('/').pop();
	}.property()
});