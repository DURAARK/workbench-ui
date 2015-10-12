import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createSession: function() {
      let store = this.store,
        initialSessionData = {
          label: this.get('name'),
          address: this.get('address'),
          description: this.get('description')
        };

      // console.log('initialSessionData: ' + JSON.stringify(initialSessionData, null, 4));

      this.duraark.createSession(initialSessionData).then(function(session) {
        // console.log('Created new session:\n' + JSON.stringify(session, null, 4));
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

      // FIXXME: prevent demo sessions from being removed:
      var label = session.get('label');
      if (label === 'Haus 30' || label === 'Nygade') {
        alert('"' + label + '" is a demo session and cannot be deleted.');
        return;
      }

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
