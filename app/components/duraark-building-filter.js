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
    // if (!this.get('addressCountryItems.length')) {
      // this.send('getStreetAddressItems');
      this.send('getNameItems');
      this.send('getLocalityItems');
      this.send('getAddressCountryItems');
      this.send('getArchitectItems');
      this.send('getContributorItems');
      this.send('getOwnerItems');
      this.send('getCreatorItems');
      this.send('getFloorCountItems');
      this.send('getRoomCountItems');
      this.send('getFormatItems');
      this.send('getLicenseItems');
    // }
  },

  actions: {
    getNameItems() {
        const buildmProps = ['name'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          this.set('nameItems', data);
        }.bind(this));
      },

      getLocalityItems() {
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

      getArchitectItems() {
        const buildmProps = ['architect'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          this.set('architectItems', data);
        }.bind(this));
      },

      getContributorItems() {
        const buildmProps = ['contributor'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          this.set('contributorItems', data);
        }.bind(this));
      },

      getOwnerItems() {
        const buildmProps = ['owner'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          this.set('ownerItems', data);
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
          this.set('floorCountItems', data);
        }.bind(this));
      },

      getRoomCountItems() {
        const buildmProps = ['roomCount'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          this.set('roomCountItems', data);
        }.bind(this));
      },

      getFormatItems() {
        const buildmProps = ['format'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          data.push({format: 'E57 Point Cloud File'});
          this.set('formatItems', data);
        }.bind(this));
      },

      getLicenseItems() {
        const buildmProps = ['license'];

        this.duraark.getBuildmProperties(buildmProps).then(data => {
          this.set('licenseItems', data);
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
