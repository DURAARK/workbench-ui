import Ember from 'ember';
import AutoComplete from './auto-complete';

export default AutoComplete.extend({
  valueProperty: 'addressLocality',
  propertyType: null,
  determineSuggestions: function(options, input) {
    var that = this;
    var list = options.filter(function(item) {
      let valueProperty = that.get('valueProperty');
      // FIXXME: using 'input.toString()' as input does not seem to be of type String?!
      return Ember.get(item, valueProperty).toLowerCase().indexOf(input.toString().toLowerCase()) > -1;
    });
    return Ember.A(list);
  },
  actions: {
    selectItem: function(item) {
      let valueProperty = this.get('valueProperty');
      this.set('selectedFromList', true);
      this.set('selectedValue', Ember.get(item, valueProperty));

      let filter = {
        predicate: this.get('valueProperty'), // FIXXME: rename 'valueProperty' to 'predicate'
        type: this.get('propertyType'),
        values: [this.get('selectedValue')],
        userData: item
      };

      this.sendAction('onSelectionChange', filter);
    }
  }
});
