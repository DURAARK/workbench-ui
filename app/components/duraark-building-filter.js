import Ember from 'ember';

export default Ember.Component.extend({
  addressCountryItems: [],

  didInsertElement: function() {
    let that = this;

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
        var newFilter = {};
        newFilter[filter.filterName] = [filter.selected];

        let filters = [newFilter];
        this.sendAction('filterChanged', filters);
      }
  }
});
