import Ember from 'ember';

export
default Ember.Component.extend({
    actions: {
        selectItem: function(item) {
            var item = this.get('item');
            this.sendAction('action', item);
        }
    }

    // change: function() {
    //     var item = this.get('item');
    //     this.sendAction('action', item);

    //     console.log('itemcomponent selected: ' + item.get('path'));
    // }
});