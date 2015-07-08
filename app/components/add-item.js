import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    select: function() {
      var item = this.get('item');
      this.sendAction('select', item);
    }
  }
})
