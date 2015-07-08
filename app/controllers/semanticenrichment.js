import Ember from 'ember';

function post(url, data) {
  var that = this;

  return new Ember.RSVP.Promise(function(resolve, reject) {
    function handler(data, status, jqxhr) {
      if (status === 'success') {
        resolve(data);
      } else {
        reject(new Error('[post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
      }
    }

    Ember.$.post(url, data, handler);
  });
};

export default Ember.Controller.extend({
  seeds: null,

  actions: {
    next: function() {

      // FIXXME: check if everytihng is saved in the buildm-editor and display modal in case of unsaved changes!

      var session = this.get('session');
      this.transitionToRoute('semanticenrichment', session);
    },

    back: function() {

      // FIXXME: check if everytihng is saved in the buildm-editor and display modal in case of unsaved changes!

      var session = this.get('session');
      this.transitionToRoute('metadata', session);
    },

    addEnrichment: function(item) {
      this.set('fileInfo', item);
    },

    addTopics: function(buildm) {
      var session = this.get('session');

      // // FIXXME: I also found no way to update the session with ember board utilities, I guess I have an
      // // logical error in my approach, it cannot be that hard with ember data and plain objects. Anyways,
      // // this does the job, too:
      // post(url, session.toJSON()).then(function(result) {
      //   console.log('stored session ...');
      // }).catch(function(err) {
      //   throw new Error(err);
      // });
    }
  }
});
