import Ember from "ember";
import AutoComplete from "./auto-complete";

export default AutoComplete.extend({
  valueProperty: "addressLocality",
  determineSuggestions: function(options, input) {
    var list = options.filter(function(item) {
      var bla = Ember.get(item, "addressLocality");
      // FIXXME: using 'input.toString()' as input does not seem to be of type String?!
      return Ember.get(item, "addressLocality").toLowerCase().indexOf(input.toString().toLowerCase()) > -1;
    });
    return Ember.A(list);
  },
  actions: {
    selectItem: function(item) {
      var valueProperty = this.get("valueProperty"),
      selectedValue = Ember.get(item, valueProperty);
      this.set("selectedFromList", true);
      this.set("selectedValue", selectedValue);

      let filter = {};
      filter[valueProperty] = [selectedValue];

      this.sendAction('onSelectionChange', filter);
    }
  }
});
