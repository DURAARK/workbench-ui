import Ember from 'ember';

export default Ember.Component.extend({
  isFullscreen: false,
  
  actions: {
    close() {
      this.sendAction('close');
    },

    fullscreen() {
      this.toggleProperty('isFullscreen', true);
    }
  }
});
