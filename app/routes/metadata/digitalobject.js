import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		return this.store.find('digital-object', params.digitalObject_id);
	},

	setupController: function(controller, model) {
		this._super(controller, model);
	}

});
