import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    click: function(tool) {
      tool.toggleProperty('isSelected');
      this.sendAction('click', tool);
    }
  }
});
