import Ember from 'ember';

export default Ember.Component.extend({
  selectedCandidate: null,

  actions: {
    click(topic) {

      topic.toggleProperty('isSelected');
      this.sendAction('click', topic);
    },

    selectCandidate(candidate) {
      this.set('selectedCandidate', candidate);
    },

    unselectCandidate() {
      this.set('selectedCandidate', null);
    },

    removeCandidate(candidate) {
      let topic = this.get('topic');
      topic.candidates.removeObject(candidate);
      this.send('unselectCandidate');
    }
  }
});
