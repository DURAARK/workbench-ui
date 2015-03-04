import Ember from 'ember';

export
default Ember.Route.extend({
    model: function(params) {
        return this.store.find('metadatastage', params.id);
    },

    setupController: function(controller, model) {
        this._super(controller, model);
        controller.set('stage', model);

        this.store.find('filestage', model.get('id')).then(function(stage) {
            stage.get('files').then(function(records) {
                controller.set('files', records);
            });
        });
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
        }
    }
});