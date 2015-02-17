import Ember from 'ember';

export
default Ember.Component.extend({
    actions: {
        editFiles: function(stage) {
            this.sendAction('editClicked', stage);
        },

        onDelete: function(item) {
            var filestage = this.get('stage');
            filestage.get('files').removeObject(item);
        }
    }
});