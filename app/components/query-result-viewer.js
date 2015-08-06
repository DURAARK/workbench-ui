import Ember from 'ember';

export default Ember.Component.extend({
  results: null,

  actions: {
    click: function(topic) {

      topic.toggleProperty('isSelected');
      this.sendAction('click', topic);
    }
  }
});
