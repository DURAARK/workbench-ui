import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showHaus30: function() {
      this.transitionToRoute('files', 1);
    },
    showNygade: function() {
      this.transitionToRoute('files', 2);
    },
    showRetrieval: function() {
      this.transitionToRoute('searchretrieve');
    }
  }
});
