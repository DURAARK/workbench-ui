import Ember from 'ember';

export default Ember.Component.extend({
  selectedTopics: [],

  actions: {
    toggleSelection: function(topic) {

      topic.toggleProperty('isSelected');

      var topics = this.get('selectedTopics');

      if (topic.get('isSelected')) {
        topics.pushObject(topic);
        console.log('selected topic:   ' + topic.get('label'));
      } else {
        topics.removeObject(topic);
        console.log('deselected topic:   ' + topic.get('label'));
      }

      console.log('Currently selected topics:');
      topics.forEach(function(topic) {
        console.log('  * ' + topic.get('label'));
      });
    }
  }
});
