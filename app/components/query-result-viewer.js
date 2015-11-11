import Ember from 'ember';

export default Ember.Component.extend({
  results: null,

  actions: {
    selectCandidate(row) {
        let url = null;
        if (row.buildingName) {
          url = row.buildingName.value;
        } else {
          url = row.building.value;
        }
        this.set('selectedCandidate', url);
      },

      unselectCandidate() {
        this.set('selectedCandidate', null);
      }
  }
});
