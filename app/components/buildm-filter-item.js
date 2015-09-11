import Ember from 'ember';

export default Ember.Component.extend({
  buildmProps: ['address', 'latitude', 'longitude'],

  actions: {
    selectProperty(prop) {
      console.log('prop: ' + prop + ' | ' + this.get('value'));
      this.set('buildmProperty.name', prop);
      this.set('buildmProperty.value', this.get('value'));
    },

    clickedDelete() {
      this.sendAction('clickedDelete', this.get('buildmProperty'));
    }
  }
});
