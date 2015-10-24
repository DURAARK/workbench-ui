import Ember from 'ember';

export default Ember.Component.extend({
  addressCountryItems: [],
  addressCountryLabels: Ember.computed.mapBy('addressCountryItems', 'label'),

  init() {
    this._super();

    let that = this;

    Ember.run(function() {
      var addressCountryItems = that.duraark.getBuildingInformation({
        props: ['addressCountry']
      }).then(function(body) {
        debugger;
        var items = body.results.bindings.map(function(item) {
          return item.result.value;
        });

        that.set('addressCountryItems', items);
      });
    });

    // FIXXME: shouldn't that work?
    //this.set('addressCountryItems', addressCountryItems);
  },

  actions: {
    filterChanged(filter) {
      debugger;

      var newFilter = {};
      newFilter[filter.filterName] = [filter.selected];

      let filters = [newFilter];
      this.sendAction('filterChanged', filters);
    }
  }
});
