import Ember from 'ember';

export
default Ember.Component.extend({
  selectedBuilding: null,

  actions: {
    openBuilding(building) {
        let controller = this;
        this.duraark.createSessionFromBuilding(building).then(function(session) {
          controller.sendAction('openBuilding', session);
        });
      },

      showDetails(building) {
        // console.log('Selected building:\n' + JSON.stringify(building, null, 4));
        this.sendAction('showBuildingDetails', building);
      }
  }
});
