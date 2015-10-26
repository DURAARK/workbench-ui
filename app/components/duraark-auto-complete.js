import Ember from "ember";
import AutoComplete from "./auto-complete";

export default AutoComplete.extend({
  valueProperty: "addressLocality",
  determineSuggestions: function(options, input) {
      var list = options.filter(function(item) {
          return Ember.get(item, "addressLocality").toLowerCase().indexOf(input.toLowerCase()) > -1;
      });
      return Ember.A(list);
  }
});
