import Ember from 'ember';

export
default Ember.Controller.extend({
    actions: {
        selectFiles: function() {
        	debugger;
            // TODO: add files to session!
            console.log('Selected files!');

            this.transitionToRoute('preingest');
        }
    }
    
});