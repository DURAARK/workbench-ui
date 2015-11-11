import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    setResult: function(result) {
      this.set('result', result);
    }
  }
});
