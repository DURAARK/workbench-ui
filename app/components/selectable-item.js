import Ember from 'ember';

export
default Ember.Component.extend({
    actions: {
        selectItem: function(item) {
            this.sendAction('action', item);
        }
    }
});