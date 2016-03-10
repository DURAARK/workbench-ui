  import Ember from 'ember';

  export default Ember.Controller.extend({
    hasResults: false,
    hasError: false,

    actions: {
      showResult: function(query, queryConfig) {
        let queryId = query.get('id'),
          that = this;

        // Store the current query to have the 'urlField' available in the show results pane.
        this.set('currentQuery', query);

        // FIXXME: add loading spinner while executing query!
        this.set('hasError', false);
        this.set('app.showLoadingSpinner', true);

        this.duraark.executeSDASQuery(queryId, queryConfig).then(results => {
          //console.log('results: ' + JSON.stringify(results, null, 4));
          console.log('got results');
          that.set('results', results);
          that.set('hasResults', true);
          that.set('hasError', false);
          that.set('app.showLoadingSpinner', false);
        }).catch(function(err) {
          let errorText = JSON.parse(err.responseText).error;
          console.log('error: ' + errorText);
          that.set('error', errorText);
          that.set('hasResults', false);
          that.set('hasError', true);
          that.set('app.showLoadingSpinner', false);
        });
      }
    }
  });
