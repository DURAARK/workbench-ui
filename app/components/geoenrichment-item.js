import Ember from 'ember';

export
default Ember.Component.extend({
    application: function() {
        var model = this.get('item.model');

        if (model) {
            return model.application;
        } else {
            return 'Loading...';
        }
    }.property('item.model'),

    actions: {
        onDelete: function(item) {
            item.deleteRecord();
        }
    }
});