import Ember from 'ember';

export
default Ember.Component.extend({
    actions: {
        onDelete: function(item) {
            item.deleteRecord();
        }
    }
});