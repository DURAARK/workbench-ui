import Ember from 'ember';

export default Ember.Component.extend({
  addressCountryItems: [],

  init() {
    this._super();

    let that = this;

    var addressCountryItems = this.duraark.getBuildingInformation({
      props: ['addressCountry']
    }).then(function(body) {
      var items = body.results.bindings.map(function(item) {
        return item.result.value;
      });

      that.set('addressCountryItems', items);
    });

    // FIXXME: shouldn't that work?
    //this.set('addressCountryItems', addressCountryItems);
  },

  actions: {
    filterChanged() {
      let filters = [{
        addressCountry: this.get('addressCountryItems')
      }];
      this.sendAction('filterChanged', filters);
    }
  }
});
