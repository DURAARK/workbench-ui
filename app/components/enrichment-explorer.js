import Ember from 'ember';

export
default Ember.Component.extend({
    actions: {
        onClick: function(item) {
            this.sendAction('selectItem', item);
        }
    }
});