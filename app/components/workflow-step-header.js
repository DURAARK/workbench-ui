import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    nextClicked() {
      this.sendAction('onNext', true);
    },

    backClicked() {
      console.log('asdf');
      this.sendAction('onBack', true);
    }
  }
});
