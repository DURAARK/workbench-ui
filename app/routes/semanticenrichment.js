import Ember from 'ember';

export
default Ember.Route.extend({

    model: function(params) {
        return this.store.find('semanticenrichmentstage', params.id);
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set('stage', model);
    },

    actions: {
        save: function() {
            this.get('controller.model').save().then(function() {
                var session = this.get('controller.model.session');
                this.transitionTo('preingest.show', session);
            }.bind(this));
        },

        selectItem: function(item) {
            var stage = this.get('controller');
            stage.get('stage.selectedItems').pushObject(item);
        },

        deselectItem: function(item) {
            var stage = this.get('controller');
            stage.get('stage.selectedItems').removeObject(item);
        }
    }
});