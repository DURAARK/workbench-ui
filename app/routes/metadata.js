import Ember from 'ember';

export
default Ember.Route.extend({
    selectedFile: function(file) {
        console.log('asdfadsfasdfasdF: ' + file.get('path'));
        return file;
    }.property(),

    model: function(params) {
        return this.store.find('filestage', params.id);
    },

    setupController: function(controller, model) {
        this._super(controller, model);

        controller.set('selectedFiles', model.get('files'));
        controller.set('selectedFile', null);

        this.store.find('metadatum').then(function(records) {
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

        editMetadata: function(file) {
            console.log('editMetadata: ' + file.get('schema'));
            this.set('controller.selectedFile', file);

            // file.get('metadata').then(function(records) {
            //     records.forEach(function(item) {
            //         console.log('metadata item: ' + item.get('schema'));
            //     });
            // });
        }
    }
});