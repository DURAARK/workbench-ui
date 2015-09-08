import Ember from 'ember';
import ENV from '../config/environment';

var defaultHost = ENV.DURAARKAPI.defaultHost || 'http://mimas.cgv.tugraz.at';
var usePorts = ENV.DURAARKAPI.usePorts;

export default Ember.Service.extend({
  sessionsEndpoint: {
    url: defaultHost + '/api/v0.7/sessions',
    port: 5011
  },
  metadataEndpoint: {
    url: defaultHost + '/api/v0.7/metadata',
    port: 5012
  },
  sdaEndpoint: {
    url: defaultHost + '/api/v0.7/sda',
    port: 5013
  },
  geometricEnrichmentEndpoint: {
    url: defaultHost + '/api/v0.7/geometricEnrichment',
    port: 5014
  },
  digitalPreservationEndpoint: {
    url: defaultHost + '/api/v0.7/digitalPreservation',
    port: 5015
  },

  getAPIEndpoint: function(service) {
    var url;

    if (usePorts) {
      url = defaultHost + ':' + this.get(service + 'Endpoint').port;
    } else {
      url = this.get(service + 'Endpoint');
    }

    console.log('url: ' + url);

    return url;
  },

  storeInSDAS: function(session) {
    let duraark = this,
      sdaEndpoint = duraark.getAPIEndpoint('sda') + '/sdas';

    console.log('[DURAARK::storeInSDAS] successfully stored session: ' + session.get('label'));

    // session.get('physicalAssets').forEach(function(item) {
    //   console.log('[DURAARK::storeInSDAS] Storing physicalAsset metadata: ' + item.label);
    //
    //   duraark.post(sdaEndpoint, {
    //     buildm: item.buildm
    //   });
    // });

    // NOTE: Currently there is always only a single PhysicalAsset present in a session.
    // Therefore we know that the DigitalObjects in the session belong to that PhysicalAsset
    // to related them in the schema instance:
    var pa = session.get('physicalAssets').objectAt(0);

    duraark.post(sdaEndpoint, {
      buildm: pa.buildm
    }).then(function(paBuildm) {
      session.get('digitalObjects').forEach(function(item) {
        console.log('[DURAARK::storeInSDAS] Storing digitalObject metadata: ' + item.label);

        var paURI = paBuildm['@id'];
        // console.log('paURI: ' + paURI);

        item.buildm['http://data.duraark.eu/vocab/buildm/represents'] = [{
          '@value': paURI
        }];

        // console.log('buildm_represents: ' + JSON.stringify(item.buildm, null, 4));

        duraark.post(sdaEndpoint, {
          buildm: item.buildm
        }).then(function(doBuildm) {
          debugger;
          // Update 'isRepresentedBy' triple for PhysicalAsset:
          if (!paBuildm['http://data.duraark.eu/vocab/buildm/isRepresentedBy']) {
            paBuildm['http://data.duraark.eu/vocab/buildm/isRepresentedBy'] = [];
          }

          paBuildm['http://data.duraark.eu/vocab/buildm/isRepresentedBy'].push({
            '@value': doBuildm['@id']
          });

          duraark.post(sdaEndpoint, {
            buildm: paBuildm
          });
        }).catch(function(err) {
          throw new Error(err);
        });
      });
    });
  },

  post: function(url, data) {
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
  }
});
