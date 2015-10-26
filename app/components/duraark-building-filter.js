import Ember from 'ember';

export default Ember.Component.extend({
  filters: {
    addressCountry: [],
    addressLocality: []
  },
  addressCountryItems: [],
  addressLocalityItems: [],
  initialCountrySelection: ['AT', 'DE'],

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

      filterChanged(filter) {
        let filters = this.get('filters');

        if (Object.keys(filter).length) {
          let filterKey = Object.keys(filter)[0];

          if (filterKey === 'addressCountry') {
            this.set('filters.addressCountry', filter[filterKey]);
          }

          this.set('filters.' + filterKey, filter[filterKey]);
          this.sendAction('filterChanged', filters);
        } else {
          throw new Error('[duraark-building-filter] No "filterKey" present in filter: ' + JSON.stringify(filter, null, 4));
        }
      }
  }
});
