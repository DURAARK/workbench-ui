import Ember from 'ember';

export
default Ember.Component.extend({
  actions: {
    selectBuilding(building) {
      this.set('selectedBuildm', building);
      this.sendAction('selectedBuilding', building);
    }
  }
});
