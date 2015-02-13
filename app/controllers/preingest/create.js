import Ember from 'ember';

export
default Ember.Controller.extend({
    actions: {
        createSession: function() {
            var name = this.get('name'),
                creator = this.get('creator'),
                description = this.get('description'),
                that = this;

            // TODO: check input and give visual feedback!
            if (!name.trim() || !creator.trim()) {
                return;
            }

            // TODO: Is there a more straightforward way of creating records
            // that are referencing each other?
            
            var filestage = this.store.createRecord('filestage');

            filestage.save().then(function(stage) {
                var session = that.store.createRecord('session', {
                    name: name,
                    creator: creator,
                    description: description,
                    filestage: stage
                });

                session.save().then(function(record) {
                    stage.set('session', record);
                    stage.save().then(function() {
                        that.transitionToRoute('preingest.show', record);
                    });
                });
            });
        }
    }
});