import Ember from 'ember';

export default Ember.Component.extend({
  filters: {},
  addressCountryItems: [],
  initialCountrySelection: ['AT', 'AU', 'DE'],

  didInsertElement: function() {
    this.send('getAddressCountryNames');
  },

  actions: {
    getAddressCountryNames() {
        let that = this;
        return that.duraark.getBuildingInformation({
          props: ['addressCountry']
        }).then(function(body) {
          if (body.results) {
            var items = body.results.bindings.map(function(item) {
              return item.result.value;
            });

            that.set('addressCountryItems', items);
          }
        });
      },

      filterChanged(filter) {
        let filters = this.get('filters');

        if (Object.keys(filter).length) {
          var key = Object.keys(filter)[0];
          filters[key] = filter[key];
          this.sendAction('filterChanged', filters);
        } else {
          throw new Error('No key present in filter array, aborting ...');
        }
      }
  }
});