import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    showHaus30: function() {
      this.transitionToRoute('files', 1);
    },
    showNygade: function() {
      this.transitionToRoute('files', 2);
    },
    showRetrieval: function() {
      this.transitionToRoute('searchretrieve');
    },

    createSession: function(initialSessionData) {
      var store = this.store;

      this.duraark.createSession(initialSessionData).then(function(session) {
        console.log('Created new session:\n' + JSON.stringify(session, null, 4));
        store.push('session', session);
      }).catch(function(err) {
        console.log('err: ' + err);
      })
    },

    deleteSession(session) {
      console.log('removing session: ' + session.get('label'));

      this.duraark.deleteSession(session).then(function() {
        session.unloadRecord();
      }).catch(function(err) {
        throw new Error(err);
      });
    }
  }
});
