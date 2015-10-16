import Ember from 'ember';

export default Ember.Component.extend({
  results: null,

  actions: {
    selectCandidate(row) {
      var url = row.buildingName.value;
      this.set('selectedCandidate', url);
    },

    unselectCandidate() {
      this.set('selectedCandidate', null);
    }
  }
});
