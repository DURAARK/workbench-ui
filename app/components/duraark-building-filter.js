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
      this.send('getStreetAddressItems');
      this.send('getAddressCountryItems');
      this.send('getCreatorItems');
      this.send('getFloorCountItems');
      this.send('getRoomCountItems');
    }
  },

  actions: {
    getStreetAddressItems() {
        const buildmProps = ['addressLocality', 'addressCountry'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          var data = this.buildm.code2name(data, 'countryName');
          this.set('addressLocalityItems', data);
        }.bind(this));
      },

      getAddressCountryItems() {
        const buildmProps = ['addressCountry'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          var data = this.buildm.code2name(data, 'countryName');
          this.set('addressCountryItems', data);
        }.bind(this));
      },

      getCreatorItems() {
        const buildmProps = ['creator'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          this.set('creatorItems', data);
        }.bind(this));
      },

      getFloorCountItems() {
        const buildmProps = ['floorCount'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          debugger;
          this.set('floorCountItems', data);
        }.bind(this));
      },

      getRoomCountItems() {
        const buildmProps = ['roomCount'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          this.set('roomCountItems', data);
        }.bind(this));
      },

      filterChanged(filter) {
        if (filter.type && filter.predicate && filter.values) {
          let predicate = filter.predicate;

          if (predicate === 'addressCountry') {
            this.set('filters.addressCountry', filter.values);
          } else if (predicate === 'addressLocality') {
            // this.set('selectedAddressCountries', [filter.userData.addressCountry]);
          }

          // Cache the current filter set:
          this.set('filters.' + predicate, filter);

          // NOTE: The action only sends the currently changed filter, not the whole filter set.
          this.sendAction('filterChanged', filter);
        } else {
          throw new Error('[duraark-building-filter] No "type", "predicate", or "values" key present in filter: ' + JSON.stringify(filter, null, 4));
        }
      }
  }
});
