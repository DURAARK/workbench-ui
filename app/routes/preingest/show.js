import Ember from 'ember';

export
default Ember.Route.extend({
    model: function(params) {
        return this.store.find('session', params.id);
    },

    setupController: function(controller, model) {
        this._super(controller, model);

        this.store.find('file').then(function(files) {
            controller.set('files', files);
        });
    }
});