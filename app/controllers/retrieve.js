import Ember from 'ember';

export default Ember.Controller.extend({
  selectedBuilding: null,

  actions: {
    openBuildingAsSession(session) {
        // NOTE: Providing the 'id' of the session here so that the 'model' hook
        // of the 'preingest.files' route gets called. Currently we have a mix of
        // ember-data and native objects for 'session' models, which makes this
        // necessary.
        this.transitionToRoute('preingest.files', session.id);
      },

      showDetails(building) {
        this.set('showSidebarDetails', true);
        this.set('selectedBuilding', building);
      }
  }
});
