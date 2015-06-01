import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showDifferenceDetectionPage: function() {
      this.transitionToRoute('workflows.differencedetection');
    }
  }
});
