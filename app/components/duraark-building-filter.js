import Ember from 'ember';

export default Ember.Component.extend({
  filters: {},
  addressCountryItems: [],
  initialCountrySelection: ['AT', 'DE'],

  didInsertElement: function() {
    if (!this.get('addressCountryItems.length')) {
      this.send('getAddressCountryNames');
    }
  },

  init: function() {
    this._super();
    var that = this;
    var Foo = Ember.Object.extend({});
    var Bar = Ember.Object.extend({
      code: ""
    });

    var streetAddresses = [];
    streetAddresses.pushObject(Foo.create({
      code: "Nygade",
      text: "(Kopenhagen)"
    }));
    streetAddresses.pushObject(Foo.create({
      code: "Inffeldgasse",
      text: "(Austria)"
    }));
    streetAddresses.pushObject(Foo.create({
      code: "Haus30 Strasse",
      text: "(Germany)"
    }));

    this.set('addressSelection', Bar.create());
    this.set('streetAddresses', streetAddresses);
  },

  actions: {
    getAddressCountryNames() {
        let that = this;
        return that.duraark.getBuildingInformation({
          props: ['addressCountry']
        }).then(function(body) {
          if (body.results) {
            var items = body.results.bindings.map(function(item) {
              let countryCode = item.result.value,
                countryName = that.countries.code2name(countryCode);

              if (!countryName) {
                countryName = countryCode;
              }

              return {
                label: countryName,
                code: countryCode
              }
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
