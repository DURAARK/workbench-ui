import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    clickImage: function(img) {
      var win = window.open(img.src, '_blank');
      win.focus();
    }
  }
});
