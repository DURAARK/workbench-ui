import Ember from 'ember';

export
default Ember.Controller.extend({
    needs: ['preingest', 'preingest/show'],

    actions: {
        showSession: function(session) {
            this.transitionToRoute('preingest.show', session);
        },

        deleteSession: function(session) {
            // TODO: add modal dialog to confirm deletion!
            // this.transitionToRoute('preingest.delete', session);

            var visibleSessionId = this.get('controllers.preingest/show.id');

            session.deleteRecord();
            session.save().then(function(record) {
                if (record.get('id') === visibleSessionId) {
                    this.transitionToRoute('preingest');
                }
            }.bind(this));
        }
    }
});