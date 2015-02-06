import Ember from 'ember';

export
default Ember.Controller.extend({
	needs: ['preingest'],

    actions: {
        showSession: function(session) {
            this._updateVisualSelections(session);

            this.transitionToRoute('preingest.show', session);
        }
    },

    _updateVisualSelections: function(session) {
        var sessions = this.get('controllers.preingest').get('sessions');
        
        sessions.forEach(function(session) {
            session.set('isSelected', false);
        });

        session.set('isSelected', true);
    }
});