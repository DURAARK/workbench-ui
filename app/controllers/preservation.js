import Ember from 'ember';

export
default Ember.Controller.extend({
    needs: ['preservation', 'preservation/show'],

    actions: {
        showSession: function(session) {
            this.transitionToRoute('preservation.show', session);
        },

        deleteSession: function(session) {
            // TODO: add modal dialog to confirm deletion!
            // this.transitionToRoute('preservation.delete', session);

            var visibleSessionId = this.get('controllers.preservation/show.id');

            session.deleteRecord();
            session.save().then(function(record) {
                if (record.get('id') === visibleSessionId) {
                    this.transitionToRoute('preservation');
                }
            }.bind(this));
        }
    }
});