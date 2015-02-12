import Ember from 'ember';

export
default Ember.ObjectController.extend({
    actions: {
        editStage: function() {
        	var stage = this.get('filestage');

            console.log('[preingest.show] requesting stage editor: ' + stage.get('name'));
            
            this.transitionTo(stage.get('name'), stage);
        }
    }
});