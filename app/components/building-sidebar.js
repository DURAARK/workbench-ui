import Ember from 'ember';

export
default Ember.Component.extend({
  actions: {
    selectBuilding(buildm) {
      console.log('selected buildm:\n' + JSON.stringify(buildm, null, 4));
      this.set('selectedBuildm', buildm);
      this.sendAction('selectedBuilding', buildm);
    }
  }
});
