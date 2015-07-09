import Ember from 'ember';

export default Ember.Component.extend({

  actions: {
    click: function(topic) {

      topic.toggleProperty('isSelected');
      this.sendAction('click', topic);
    }
  }
});
