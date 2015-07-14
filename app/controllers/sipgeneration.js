import Ember from 'ember';
import ENV from '../config/environment';

var sipGeneratorEndpoint = ENV.DURAARKAPI.sipgenerator;

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

    Ember.$.ajax(url, {
      type: 'POST',
      dataType: 'json',
      contentType: "application/json; charset=utf-8", // NOTE: This line is important!
      data: JSON.stringify(data), // NOTE: JSON.stringify() is important!
      success: handler
    });

  });
};

export default Ember.Controller.extend({
  actions: {
    createRosettaSIP: function() {
      console.log('Schedule Rosetta SIP creation ...');

      var url = sipGeneratorEndpoint.host + '/sip',
        session = this.get('session');

      var payload = {
        session: session.toJSON(),
        output: 'rosetta'
      };

      payload.session.digitalObjects = [];

      session.get('digitalObjects').forEach(function(dobj) {
        payload.session.digitalObjects.push(JSON.parse(JSON.stringify(dobj)));
      });

      console.log('url: ' + url);

      // FIXXME: I also found no way to update the session with ember board utilities, I guess I have an
      // logical error in my approach, it cannot be that hard with ember data and plain objects. Anyways,
      // this does the job, too:
      post(url, payload).then(function(result) {
        console.log('created SIP at: ' + JSON.stringify(result, null, 4));
      }).catch(function(err) {
        throw new Error(err);
      });
    },

    createBagItSIP: function() {
      console.log('Schedule BagIt SIP creation ...');

    },

    back: function() {

      // FIXXME: check if everytihng is saved in the buildm-editor and display modal in case of unsaved changes!

      var session = this.get('session');
      this.transitionToRoute('geometricenrichment', session);
    },
  }
});
