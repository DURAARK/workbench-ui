import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    nextClicked() {
      this.sendAction('onNext', true);
    },

    backClicked() {
      this.sendAction('onBack', true);
    }
  }
});
