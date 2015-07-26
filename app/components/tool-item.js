import Ember from 'ember';

export
default Ember.Component.extend({
  tagName: '',

  actions: {
    select: function(tool) {
      var digObj = this.get('digitalObject');
      this.sendAction('select', digObj, tool);
    },

    remove: function(tool) {
      var digObj = this.get('digitalObject');
      this.sendAction('remove', digObj, tool);
    },

    infoClicked: function(tool) {
      var digObj = this.get('digitalObject');
      this.sendAction('infoClicked', digObj, tool);
    }
  }
});
