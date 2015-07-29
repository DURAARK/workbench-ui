import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    search: function(tool) {
      tool.toggleProperty('isSelected');
      this.sendAction('click', tool);
    }
  }
});
