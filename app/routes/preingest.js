import Ember from 'ember';

export
default Ember.Route.extend({
    // beforeModel: function() {
    //     this.transitionTo('index');
    // },

    activate: function() {
            this.modelFor('application').set('hideNavbar', true);
    },

    deactivate: function() {
          this.modelFor('application').set('hideNavbar', false);
    }
});
