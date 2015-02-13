import Ember from 'ember';

export
default Ember.Route.extend({
    model: function(params) {
        return this.store.find('session', params.id);
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        model.set('isSelected', true);

        this.send('highlightSession', model);
    }
});