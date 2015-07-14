import Ember from 'ember';

export
default Ember.Component.extend({
  tagName: '',
  isChecked: false,

  onIsCheckedChange: function() {
    var digObj = this.get('digitalObject'),
      toolName = this.get('label'),
      isChecked = this.get('isChecked');

    this.sendAction('toggleSelection', digObj, toolName, isChecked);
  }.observes('isChecked')
});
