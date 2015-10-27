import Ember from 'ember';

export default Ember.Component.extend({
  filters: {
    addressCountry: [],
    addressLocality: []
  },
  addressCountryItems: [],
  addressLocalityItems: [],
  selectedAddressCountries: ['AT', 'DE'],

  didInsertElement: function() {
    if (!this.get('addressCountryItems.length')) {
      this.send('getStreetAddresses');
      this.send('getAddressCountryNames');
    }
  },

  actions: {
    getStreetAddresses() {
        const buildmProps = ['addressLocality', 'addressCountry'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          var data = this.buildm.code2name(data, 'countryName');
          this.set('addressLocalityItems', data);
        }.bind(this));
      },

      getAddressCountryNames() {
        const buildmProps = ['addressCountry'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          var data = this.buildm.code2name(data, 'countryName');
          this.set('addressCountryItems', data);
        }.bind(this));
      },

      // FIXXME: cleanup 'filter' and 'selection' mess!
      filterChanged(selection) {
        let selections = this.get('filters'),
          filter = selection.filter;

        if (Object.keys(filter).length) { // FIXXME: check for correct keys 'filter' and 'data'!
          let filterKey = Object.keys(filter)[0];

          if (filterKey === 'addressCountry') {
            this.set('filters.addressCountry', filter[filterKey]);
          } else if (filterKey === 'addressLocality') {
            var data = selection.data;
            console.log('data.addressCountry: ' + data.addressCountry);
            this.set('selectedAddressCountries', [data.addressCountry]);
          }

          // Cache the current filter set:
          this.set('filters.' + filterKey, filter[filterKey]);

          // NOTE: The action only sends the currently changed filter, not the whole
          // filter set.
          this.sendAction('filterChanged', filter);
        } else {
          throw new Error('[duraark-building-filter] No "filterKey" present in filter: ' + JSON.stringify(filter, null, 4));
        }
      }
  }
});
