import Ember from 'ember';

export default Ember.Component.extend({
  filters: {
    addressCountryItems: [],
    addressLocalityItem: ''
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
          this.set('addressCountries', data);
        }.bind(this));
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
