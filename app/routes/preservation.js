import Ember from 'ember';

export
default Ember.Route.extend({
    model: function() {
        return this.store.find('session');
    },

    setupController: function(controller, model) {
        var sessions = model.get('content');

        // Add the 'view model' properties to the sessions:
        sessions.forEach(function(session) {
            session.set('isSelected', false);
        });

        controller.set('model', model);
        controller.set('sessions', sessions);
    }
});