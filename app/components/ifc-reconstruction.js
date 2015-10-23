import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    roomClicked(roomName) {
      alert('Showing data for: ' + roomName);
    },

    retry() {
      this.sendAction('retry', tool);
    }
  }
});
