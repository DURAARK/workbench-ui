/** This file serves as the public client-side API for the
 *  DURAARK Service Platform.
 */

import Ember from 'ember';
import ENV from '../config/environment';

var defaultHost = ENV.DURAARKAPI.defaultHost || 'http://mimas.cgv.tugraz.at';

export default Ember.Service.extend({
  sessionsEndpoint: defaultHost + '/api/v0.7/sessions',
  metadataEndpoint: defaultHost + '/api/v0.7/metadata',
  sdaEndpoint: defaultHost + '/api/v0.7/sda',
  geometricEnrichmentEndpoint: defaultHost + '/api/v0.7/geometricEnrichment',
  digitalPreservationEndpoint: defaultHost + '/api/v0.7/digitalPreservation',

  getAPIEndpoint: function(service) {
    return this.get(service + 'Endpoint');
  },

  createSession: function(initialSessionData) {
    let duraark = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let sessionsEndpoint = duraark.getAPIEndpoint('sessions') + '/sessions';

      duraark._post(sessionsEndpoint, initialSessionData).then(function(session) {
        resolve(session);
      }).catch(function(err) {
        reject(err);
      });
    })
  },

  deleteSession: function(session) {
    let duraark = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let sessionsEndpoint = duraark.getAPIEndpoint('sessions') + '/sessions/',
        sessionId = session.get('id');

      var model = sessionsEndpoint + sessionId;
      duraark._delete(model).then(function(session) {
        resolve(session);
      }).catch(function(err) {
        reject(err);
      });
    })
  },

  storeInSDAS: function(session) {
    let duraark = this,
      sdaEndpoint = duraark.getAPIEndpoint('sda') + '/store';

    console.log('[DURAARK::storeInSDAS] successfully stored session: ' + session.get('label'));

    // session.get('physicalAssets').forEach(function(item) {
    //   console.log('[DURAARK::storeInSDAS] Storing physicalAsset metadata: ' + item.label);
    //
    //   duraark._post(sdaEndpoint, {
    //     buildm: item.buildm
    //   });
    // });

    // NOTE: Currently there is always only a single PhysicalAsset present in a session.
    // Therefore we know that the DigitalObjects in the session belong to that PhysicalAsset
    // to related them in the schema instance:
    var pa = session.get('physicalAssets').objectAt(0);

    duraark._post(sdaEndpoint, {
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

        duraark._post(sdaEndpoint, {
          buildm: item.buildm
        }).then(function(doBuildm) {
          // Update 'isRepresentedBy' triple for PhysicalAsset:
          if (!paBuildm['http://data.duraark.eu/vocab/buildm/isRepresentedBy']) {
            paBuildm['http://data.duraark.eu/vocab/buildm/isRepresentedBy'] = [];
          }

          paBuildm['http://data.duraark.eu/vocab/buildm/isRepresentedBy'].push({
            '@value': doBuildm['@id']
          });

          duraark._post(sdaEndpoint, {
            buildm: paBuildm
          });
        }).catch(function(err) {
          throw new Error(err);
        });
      });
    });
  },

  getAllPhysicalAssets() {
    let duraark = this,
      sdaEndpoint = duraark.getAPIEndpoint('sda') + '/concepts/physicalAssets';
      // sdaEndpoint = 'http://localhost:5013/concepts/physicalAssets';

    console.log('[DURAARK::getPhysicalAssets] requesting from SDAS ...');

    return duraark._get(sdaEndpoint);
  },

  _get: function(url) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      function handler(data, status, jqxhr) {
        if (status === 'success') {
          resolve(data);
        } else {
          reject(new Error('[DURAARK::_get]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
        }
      }

      var jqxhr = Ember.$.get(url, handler);

      jqxhr.fail(function() {
        reject(new Error('[DURAARK::_get]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
      });
    });
  },

  _post: function(url, data) {
    var that = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      function handler(data, status, jqxhr) {
        if (status === 'success') {
          resolve(data);
        } else {
          reject(new Error('[_post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
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
  },

  _delete: function(url) {
    var that = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      function handler(data, status, jqxhr) {
        if (status === 'success') {
          resolve(data);
        } else {
          reject(new Error('[_delete]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
        }
      }

      Ember.$.ajax(url, {
        type: 'DELETE',
        success: handler
      });
    });
  }
});
