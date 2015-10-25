import Ember from 'ember';

export default Ember.Component.extend({
  name: Ember.computed('building', function() {
    let building = this.get('building');
    return this._extractKeyFromBuildm(building, 'name');
  }),

  description: Ember.computed('building', function() {
    let building = this.get('building');
    return this._extractKeyFromBuildm(building, 'description');
  }),

  actions: {
    openBuilding(building) {
        this.sendAction('openBuildingClicked', this.get('uri'), building);
      },

      showDetails(building) {
        debugger;
        this.sendAction('showDetailsClicked', this.get('uri'), building);
        // FIXXME: toggle selected state in 'building-list' component, to have
        // all the logic there!
        building.toggleProperty('isSelected');
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
