import Ember from 'ember';

export default Ember.Controller.extend({
  numDigitalObjects: 0,
  numActionsPending: 0,

  actions: {
    setNumDigitalObjects: function(num) {
      this.set('numDigitalObjects', num);
    },

    setNumActionsPending: function(num) {
      this.set('numActionsPending', num)
    }
  }
});
