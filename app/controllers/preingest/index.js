import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
      createSession: function(initialSessionData) {
        var store = this.store;

        this.duraark.createSession(initialSessionData).then(function(session) {
          console.log('Created new session:\n' + JSON.stringify(session, null, 4));
          // See https://github.com/emberjs/data/issues/3402:
          store.push(store.normalize('session', session));
        }).catch(function(err) {
          console.log('err: ' + err);
        })
      },

      editSession: function(session) {
          console.log('Starting session edit ' + session.get('label'));
          this.transitionToRoute('preingest.files', session);
      },

      deleteSession(session) {
        console.log('Removing session: ' + session.get('label'));

        this.duraark.deleteSession(session).then(function() {
          session.unloadRecord();
        }).catch(function(err) {
          throw new Error(err);
        });
      },

      searchInArchive() {
        this.transitionToRoute('retrieve');
      }
    }
});
