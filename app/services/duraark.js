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
  geometricEnrichmentEndpoint: defaultHost + '/api/v0.7/geometricenrichment',
  digitalPreservationEndpoint: defaultHost + '/api/v0.7/digitalPreservation',

  vocabBase: 'http://data.duraark.eu/vocab/buildm/',

  getType(buildm) {
    let type = null;
    if (buildm['@type']) {
      type = buildm['@type'];
    }

    return type;
  },

  isOfType(buildm, typeName) {
    var type = this.getType(buildm);
    // FIXXME: PhysicalAsset type comes as array:
    if (_.isArray(type)) {
      type = type[0];
    }
    return type === typeName;
  },

  getAPIEndpoint(service) {
    return this.get(service + 'Endpoint');
  },

  getAllSessions() {
    let duraark = this,
      sessionsEndpoint = duraark.getAPIEndpoint('sessions') + '/sessions';
    //sessionsEndpoint = 'http://localhost:5013/concepts/physicalAssets';

    console.log('[DURAARK::getAllSessions] requesting from sessions ...');

    return duraark._get(sessionsEndpoint);
  },

  getSession(id) {
    let duraark = this,
      sessionUrl = duraark.getAPIEndpoint('sessions') + '/sessions/' + id;
    //sessionUrl = 'http://localhost:5013/concepts/physicalAssets';

    console.log('[DURAARK::getAllSessions] requesting session from: ' + sessionUrl);

    return duraark._get(sessionUrl);
  },

  querySession(params) {
    let duraark = this,
      sessionUrl = duraark.getAPIEndpoint('sessions') + '/sessions/?' + $.param(params);
    //sessionUrl = 'http://localhost:5013/concepts/physicalAssets';

    console.log('[DURAARK::getAllSessions] querying session: ' + sessionUrl);

    return duraark._get(sessionUrl);
  },

  createSession(initialSessionData) {
    let duraark = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let sessionsEndpoint = duraark.getAPIEndpoint('sessions') + '/sessions';

      duraark._post(sessionsEndpoint, initialSessionData).then(function(session) {
        resolve(session);
      }).catch(function(err) {
        reject(err);
      });
    });
  },

  createSessionFromBuilding(uri, building) {
    let duraark = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let sessionsEndpoint = duraark.getAPIEndpoint('sessions') + '/sessions',
        vocab = duraark.vocabBase,
        description = 'No description';

      if (building[vocab + 'description'] && building[vocab + 'description'][0]) {
        description = building[vocab + 'name'][0]['value']
      };

      // get full buildm record from SDAS:
      duraark.getPhysicalAsset(uri).then(function(buildm) {
        // console.log('buildm: ' + JSON.stringify(buildm, null, 4));

        buildm = _.extend(buildm, {
          '@id': uri,
          '@type': 'http://data.duraark.eu/vocab/buildm/PhysicalAsset',
        });

        const initialSessionData = {
          state: 'new',
          label: building[vocab + 'name'][0]['value'],
          description: description,
          physicalAssets: [{
            label: building[vocab + 'name'][0]['value'],
            buildm: buildm,
            buildmOriginal: buildm
          }],
          // FIXXME: get digitalObjects from 'represents' predicate!
          // digitalObjects: [{
          //   buildm: {}
          // }]
          digitalObjects: [{
            "label": "Nygade_Scan1001.e57",
            "buildm": {
              "@id": "http://data.duraark.eu/ifcspffile_2529694f-7bbe-4653-b63f-f76c010b3afe",
              "@type": "http://data.duraark.eu/vocab/buildm/E57File",
              "http://data.duraark.eu/vocab/buildm/actorCount": [{
                "@value": "0",
                "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
              }],
              "http://data.duraark.eu/vocab/buildm/creator": [{
                "@value": " "
              }],
              "http://data.duraark.eu/vocab/buildm/dateCreated": [{
                "@value": "2015-07-24T15:54:00"
              }],
              "http://data.duraark.eu/vocab/buildm/entityCount": [{
                "@value": "38",
                "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
              }],
              "http://data.duraark.eu/vocab/buildm/filename": [{
                "@value": "Nygade_Scan1001.e57"
              }],
              "http://data.duraark.eu/vocab/buildm/hasType": [{
                "@value": "Model"
              }, {
                "@value": "Plan"
              }],
              "http://data.duraark.eu/vocab/buildm/instanceCount": [{
                "@value": "359",
                "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
              }],
              "http://data.duraark.eu/vocab/buildm/optionalAttributesSet": [{
                "@value": "0.473404255319",
                "@type": "http://www.w3.org/2001/XMLSchema#double"
              }],
              "http://data.duraark.eu/vocab/buildm/relationshipCount": [{
                "@value": "35",
                "@type": "http://www.w3.org/2001/XMLSchema#nonNegativeInteger"
              }],
              "http://data.duraark.eu/vocab/buildm/unit": [{
                "@id": "http://qudt.org/vocab/unit#Millimeter"
              }],
              "http://data.duraark.eu/vocab/buildm/name": [{
                "@value": "Nygade_Scan1001.e57"
              }]
            }
          }],
          config: {
            sda: {
              topics: [
                "Haus 30 (general context)",
                "Haus 30 (political context)"
              ]
            },
            geometricenrichment: {
              tools: [
                "IFC Reconstruction"
              ]
            }
          }
        };

        duraark._post(sessionsEndpoint, initialSessionData).then(function(session) {
          resolve(session);
        }).catch(function(err) {
          reject(err);
        });
      });
    });
  },

  deleteSession(session) {
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

  addFilesToSession(files, session) {
    let duraark = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let sessionsEndpoint = duraark.getAPIEndpoint('sessions') + '/sessions/addFilesToSession',
        sessionId = session.get('id');

      console.log('sessionId: ' + sessionId);
      duraark._post(sessionsEndpoint, {
        sessionId: sessionId,
        files: files
      }).then(function(session) {
        resolve(session);
      }).catch(function(err) {
        reject(err);
      });
    });
  },

  storeInSDAS(session) {
    let duraark = this,
      sdaEndpoint = duraark.getAPIEndpoint('sda') + '/store';

    console.log('[DURAARK::storeInSDAS] successfully stored session: ' + session.get('label'));

    // session.get('physicalAssets').forEach(function(item) {/metadata/14
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
      buildm: pa.buildm,
      buildmOriginal: pa.buildmOriginal,
    }).then(function(paBuildm) {
      if (session.get('digitalObjects')) {
        session.get('digitalObjects').forEach(function(item) {
          console.log('[DURAARK::storeInSDAS] Storing digitalObject metadata: ' + item.label);

          var paURI = paBuildm['@id'];
          // console.log('paURI: ' + paURI);

          item.buildm['http://data.duraark.eu/vocab/buildm/represents'] = [{
            '@value': paURI
          }];
          // console.log('buildm_represents: ' + JSON.stringify(item.buildm, null, 4));

          // FIXXME: temporary download URL from Rosetta:
          item.buildm['http://data.duraark.eu/vocab/buildm/downloadUrl'] = [{
            '@value': "http://rosetta.develop.lza.tib.eu/delivery/DeliveryManagerServlet?dps_pid=FL668512&dps_func=stream"
          }];

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

            // FIXXME: temporary download URL from Rosetta:
            doBuildm['http://data.duraark.eu/vocab/buildm/downloadUrl'] = [{
              '@value': "http://rosetta.develop.lza.tib.eu/delivery/DeliveryManagerServlet?dps_pid=FL668512&dps_func=stream"
            }];

            duraark._post(sdaEndpoint, {
              buildm: paBuildm
            });
          }).catch(function(err) {
            throw new Error(err);
          });
        });
      }
    });
  },

  getAllPhysicalAssets() {
    let duraark = this,
      sdaEndpoint = duraark.getAPIEndpoint('sda') + '/concepts/physicalAssets';
    //sdaEndpoint = 'http://localhost:5013/concepts/physicalAssets';

    console.log('[DURAARK::getPhysicalAssets] requesting from SDAS ...');

    return duraark._get(sdaEndpoint).then(results => {
      // console.log('jsonld: ' + JSON.stringify(results, null, 4));
      return results;
    });
  },

  getPhysicalAsset(uri) {
    let duraark = this,
      sdaEndpoint = duraark.getAPIEndpoint('sda') + '/concepts/physicalAsset';
    //sdaEndpoint = 'http://localhost:5013/concepts/physicalAssets';

    console.log('[DURAARK::getPhysicalAssets] requesting from SDAS ...');

    let url = sdaEndpoint + '/?uri=' + uri;

    return duraark._get(url);
  },

  getIFCReconstruction(config) {
    let duraark = this;
config.restart = true;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let geometricEnrichmentEndpoint = duraark.getAPIEndpoint('geometricEnrichment') + '/pc2bim';

      duraark._post(geometricEnrichmentEndpoint, config).then(function(pc2bim) {
        resolve(pc2bim);
      }).catch(function(err) {
        reject(err);
      });
    })
  },

  _get(url) {
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

  _post(url, data) {
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

  _delete(url) {
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
  },

  _generateURI(duraarkType) {
    let type = duraarkType.split('/').pop().toLowerCase();
    return 'http://data.duraark.eu/' + type + '_' + uuid.v4();
  }
});
