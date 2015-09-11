import Ember from "ember";

export default Ember.Component.extend({
  propCounter: 0,
  buildmProperties: [{
    name: 'address',
    value: '',
    // menuId: 'menu-0'
    menuId: '0'
  }],

  actions: {
    searchSDAS() {
        console.log('searching with:');
        this.get('buildmProperties').forEach(filter => {
          console.log(' * filter\n\t* ' + filter.name + '\n\t* ' + filter.value);
        })
      },

      addFilter() {
        this.incrementProperty('propCounter');

        this.get('buildmProperties').pushObject({
          name: 'address',
          value: '',
          // menuId: 'menu-' + this.get('propCounter')
          menuId: this.get('propCounter')
        });
      },

      removeFilter(buildmProperty) {
        this.get('buildmProperties').removeObject(buildmProperty);
      }
  }
});
