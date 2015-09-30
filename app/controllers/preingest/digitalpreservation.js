import Ember from 'ember';
import ENV from '../../config/environment';

var sipGeneratorEndpoint = ENV.DURAARKAPI.digitalpreservation,
  enableRosettaDeposit = false;

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
      this.duraark.storeInSDAS(this.get('session'));

      if (!enableRosettaDeposit) {
        // FIXXME: add authentification mechanism!
        alert('Data deposit to Rosetta is disabled for the public version, to not overload the system. You can use the "Download BagIt SIP" option.');
      } else {
        console.log('Schedule Rosetta SIP creation and deposit ...');

        let session = this.get('session'),
          url = sipGeneratorEndpoint.host + '/sip',
          controller = this;

        var plainSession = {};

        plainSession['physicalAssets'] = session.get('physicalAssets').toArray();
        plainSession['digitalObjects'] = session.get('digitalObjects').toArray();

        let body = {
          session: [plainSession],
          output: {
            type: 'rosetta'
          }
        };

        controller.set('rosettaIsCreating', true);

        _post(url, body).then(function(result) {
          console.log('Sucessfully created Rosetta SIP at: ' + JSON.stringify(result, 4, null));
          controller.set('rosettaIsCreating', false);
        }).catch(function(err) {
          controller.set('rosettaIsCreating', false);
          throw new Error(err);
        });
      }
    },

    createBagItSIP: function() {
      console.log('Schedule BagIt SIP creation ...');

      let session = this.get('session'),
        url = sipGeneratorEndpoint.host + '/sip',
        controller = this;

      var plainSession = {};

      plainSession['physicalAssets'] = session.get('physicalAssets').toArray();
      plainSession['digitalObjects'] = session.get('digitalObjects').toArray();

      let body = {
        session: [plainSession],
        output: {
          type: 'bag'
        }
      };

      controller.set('bagIsCreating', true);

      _post(url, body).then(function(result) {
        console.log('Sucessfully created BagIt SIP at: ' + JSON.stringify(result, 4, null));
        console.log('Download-URL: ' + sipGeneratorEndpoint.host + result.url);

        function downloadURL(url) {
          var hiddenIFrameID = 'hiddenDownloader',
            iframe = document.getElementById(hiddenIFrameID);
          if (iframe === null) {
            iframe = document.createElement('iframe');
            iframe.id = hiddenIFrameID;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
          }
          iframe.src = url;

          controller.set('bagIsCreating', false);
        };

        console.log('Downloading from: ' + sipGeneratorEndpoint.host + result.url);
        downloadURL(sipGeneratorEndpoint.host + result.url);
      }).catch(function(err) {
        controller.set('bagIsCreating', false);
        throw new Error(err);
      });
    },

    back: function() {

      // FIXXME: check if everytihng is saved in the buildm-editor and display modal in case of unsaved changes!

      var session = this.get('session');
      this.transitionToRoute('preingest.semanticenrichment', session);
    },
  }
});

var _post = function(url, data) {
  var that = this;

  return new Ember.RSVP.Promise(function(resolve, reject) {
    function handler(data, status, jqxhr) {
      if (status === 'success') {
        resolve(data);
      } else {
        reject(new Error('[_post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
      }
    }

    // Ember.$.post(url, data, handler);
    Ember.$.ajax({
      type: 'POST',
      url: url,
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      success: handler
    });
  });
}
