import Ember from 'ember';

export
default Ember.Component.extend({
  tagName: '',

  actions: {
    select: function(topic) {
      var digObj = this.get('digitalObject');
      this.sendAction('select', digObj, topic);
    },

    remove: function(topic) {
      var digObj = this.get('digitalObject');
      this.sendAction('remove', digObj, topic);
    },

    infoClicked: function(topic) {
      var digObj = this.get('digitalObject');
      this.sendAction('infoClicked', digObj, topic);
    }
  }
});
