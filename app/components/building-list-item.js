import Ember from 'ember';

export default Ember.Component.extend({
  name: Ember.computed('model', function() {
    let building = this.get('model');
    return this._extractKeyFromBuildm(building, 'name');
  }),

  description: Ember.computed('model', function() {
    let building = this.get('model');
    return this._extractKeyFromBuildm(building, 'description');
  }),

  actions: {
    showDetails(building) {
      console.log('building-list-item::showDetails: ' + JSON.stringify(building, null, 4));
      this.sendAction('showDetailsClicked', building);
    }
  },

  _extractKeyFromBuildm(buildm, key) {
    let buildmKey = 'http://data.duraark.eu/vocab/buildm/' + key,
      item = buildm[buildmKey];

    if (!item) {
      return 'No ' + key;
    }

    if (_.isArray(item)) {
      return item[0]['value'];
    } else {
      return item['value'];
    }
  }
});
