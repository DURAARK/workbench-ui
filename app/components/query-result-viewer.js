import Ember from 'ember';

export default Ember.Component.extend({
  results: null,
  query: null,
  showShowButton: true,

  onShowButtonChanged: function() {
    let urlField = this.get('query.urlField');

    if (urlField) {
      this.set('showShowButton', true)
    } else {
      this.set('showShowButton', false);
    }
  }.observes('query').on('init'),

  actions: {
    selectCandidate(row) {
        let url = null,
          urlField = this.get('query.urlField');

        if (row[urlField]) {
          url = row[urlField].value;
          this.set('showShowButton', true);
        } else {
          this.set('showShowButton', false);
        }
        this.set('selectedCandidate', url);
      },

      unselectCandidate() {
        this.set('selectedCandidate', null);
      }
  }
});
