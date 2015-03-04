import Ember from 'ember';

export
default Ember.Route.extend({
    // selectedFile: function(file) {
    //     console.log('asdfadsfasdfasdF: ' + file.get('path'));
    //     return file;
    // }.property(),

    model: function(params) {
        return this.store.find('metadatastage', params.id);
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set('stage', model);
    },

    actions: {
        save: function() {
            // NOTE: see http://stackoverflow.com/questions/26940363/ember-data-belongsto-async-relationship-omitted-from-createrecord-save-seria
            // on how to save a 'belongsTo' relationship:
            this.get('controller.stage.buildm').then(function(buildmRecord) {
                buildmRecord.save().then(function() {
                    var session = this.get('controller.model.session');
                    this.transitionTo('preingest.show', session);
                }.bind(this));
            }.bind(this));
        },

        editMetadata: function(instance) {
            this.set('controller.selectedInstance', instance);
        }
    }
});