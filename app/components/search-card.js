import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',
  query: null, // set as component parameter
  queryConfig: {},
  suggestions: Ember.Object.create({}),

  didRender: function() {
    let query = this.get('query'),
      that = this;

    if (!query) {
      throw new Error('[search-card] ERROR: no "query" parameter. Did you forget to set it in the template?');
    }

    _.forEach(query.get('variables'), predicate => {
      that.duraark.getItemsForPredicate(predicate).then(items => {
        let suggestions = that.get('suggestions');
        suggestions.set(predicate, items);
      });
    });
  }.observes('suggestion'),

  actions: {
    selectItem(selection, component) {
        let queryConfig = this.get('queryConfig'),
          predicate = component.get('predicate');

        queryConfig[predicate] = selection;

        // console.log('selection: ' + predicate + ' = ' + selection);
      },

      showResults: function(session) {
        let queryConfig = this.get('queryConfig'),
          query = this.get('query'),
          suggestions = this.get('suggestions');

        if (query.get('variables')) {
          // If no value for a predicate was selected manually assign the first
          // (shown) item in the suggestions array to the respective
          query.get('variables').forEach(predicate => {
            if (!queryConfig[predicate]) {
              let defaultSuggestion = suggestions.get(predicate)[0];
              queryConfig[predicate] = defaultSuggestion;
            }
          });
        }

        console.log('queryConfig: %s', JSON.stringify(queryConfig, null, 4));
        this.sendAction('showResultsClicked', query, queryConfig);
      }
  }
});
