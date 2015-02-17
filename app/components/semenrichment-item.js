import Ember from 'ember';

export
default Ember.Component.extend({
    semItem: function() {
        var item = this.get('item');

        return {
            context: 'bla',
            entry: 'blub'
        };
    }.property('item'),

    actions: {
        onDelete: function(item) {
            item.deleteRecord();
        }
    }
});