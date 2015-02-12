import Ember from 'ember';

export
default Ember.Route.extend({
    selectedFiles: [],
    availableFiles: [],

    model: function(params) {
        return this.store.find('filestage', params.id);
    },

    setupController: function(controller, model) {
        this._super(controller, model);

        controller.set('selectedFiles', model.get('files'));

        this.store.find('file').then(function(records) {
            controller.set('availableFiles', records);
        });
    },

    actions: {
        save: function() {
            this.get('controller.model').save().then(function() {
                var session = this.get('controller.model.session');
                this.transitionTo('preingest.show', session);
            }.bind(this));
        },

        selectFile: function(file) {
            // console.log('selected: ' + file.get('path'));

            var model = this.get('controller.model');
            model.get('files').pushObject(file);
        },

        deselectFile: function(file) {
            // console.log('deselected: ' + file.get('path'));

            var model = this.get('controller.model');
            model.get('files').removeObject(file);
        }
    }
});