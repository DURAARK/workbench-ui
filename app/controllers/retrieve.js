import Ember from 'ember';

export default Ember.Controller.extend({
  selectedBuilding: null,

  actions: {
    openBuildingAsSession(uri, building) {
        let controller = this;

        // Check if session already exists:
        let result = this.duraark.querySession({
          uri: uri
        }).then(function(existingSession) {
          var bla = JSON.stringify(existingSession);

          console.log('asdf: ' + JSON.stringify(existingSession, null, 4));

          debugger;

          if (existingSession.length) {
            let id = existingSession[0].id;
            console.log('session (id: ' + id + ') exists, opening now ...');
            // NOTE: Providing the 'id' of the session here so that the 'model' hook
            // of the 'preingest.files' route gets called. Currently we have a mix of
            // ember-data and native objects for 'session' models, which makes this
            // necessary.
            controller.transitionToRoute('preingest.files', id);
          } else {
            console.log('no session exists for building, creating new ...');
            controller.duraark.createSessionFromBuilding(uri, building).then(function(newSession) {
              // NOTE: Providing the 'id' of the session here so that the 'model' hook
              // of the 'preingest.files' route gets called. Currently we have a mix of
              // ember-data and native objects for 'session' models, which makes this
              // necessary.
              controller.transitionToRoute('preingest.files', newSession.id);
            });
          }
        });
      },

      showDetails(building) {
        this.set('showSidebarDetails', true);
        this.set('selectedBuilding', building);
      }
  }
});
