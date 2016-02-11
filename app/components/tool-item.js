import Ember from 'ember';

export
default Ember.Component.extend({
  tagName: '',

  actions: {
    remove: function(tool) {
      var item = this.get('item');
      Ember.set(tool, 'doRemove', true);
      this.sendAction('remove', item, tool);
    },

    infoClicked: function(tool) {
      var item = this.get('item');
      this.sendAction('infoClicked', item, tool);
    }
  }
});
