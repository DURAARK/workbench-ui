/** This file serves as the public client-side API for the
 *  DURAARK Service Platform.
 */

import Ember from 'ember';
import ENV from '../config/environment';
import Buildm from './buildm';

var defaultHost = ENV.DURAARKAPI.defaultHost || 'http://mimas.cgv.tugraz.at';

export default Ember.Service.extend({
  sessionsEndpoint: defaultHost + '/api/v0.7/sessions',
  metadataEndpoint: defaultHost + '/api/v0.7/metadata',
  sdaEndpoint: defaultHost + '/api/v0.7/sda',
  geometricEnrichmentEndpoint: defaultHost + '/api/v0.7/geometricenrichment',
  digitalPreservationEndpoint: defaultHost + '/api/v0.7/digitalpreservation',

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

  //
  // Access to duraark-sessions
  //

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
          label: building.get('label'),
          address: building.get('streetAddress') || 'No address given',
          description: building.get('description') || 'No description given',
          type: 'fromArchive'
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

  //
  // Access to duraark-sda
  //

  getBuildmProperties(props) {
    return this.getBuildingInformation({
      props: props
    }).then(function(body) {
      if (body.results) {
        let items = body.results.bindings.map(function(result) {
          let item = {};

          props.forEach(prop => {
            item[prop] = result[prop].value;
          });

          return item;
        });

        return items;
      }
    });
  },

  serialize: function(obj, prefix) {
    var str = [];
    for (var p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push(typeof v == "object" ?
          this.serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  },

  getBuildingInformation(props) {
    let duraark = this,
      sdaEndpoint = duraark.getAPIEndpoint('sda') + '/buildings',
      url = sdaEndpoint;
    // queryParams = this.serialize(props),
    // url = sdaEndpoint + '?' + queryParams;

    console.log('[duraark-sda] GET /buildings');
    _.forEach(props, function(prop) {
      // console.log('[duraark-sda]       * prop: ' + prop);
    });

    return new Ember.RSVP.Promise(function(resolve, reject) {
      // console.log('[duraark-sda] Query-URL: ' + url);

      // FIXXME: for some reason _get is not working correctly here when initially
      // loading the data. It returns a "" result. When you do a page reload the data
      // is retrieved correctly. The server sends the data correctly in any case, but
      // in _get something seems to go sideways...
      // return duraark._get(url).then(result => {
      //   // alert('result: ' + JSON.stringify(result, null, 4));
      //   return resolve(result);
      // }).catch(function(err) {
      //   return reject(err);
      // });

      return duraark._post(url, props).then(result => {
        return resolve(result);
      }).catch(function(err) {
        return reject(err);
      });
    });
  },

  getBuildings(filters) {
    let duraark = this,
      url = duraark.getAPIEndpoint('sda') + '/buildings/filter';

    return new Ember.RSVP.Promise(function(resolve, reject) {
      // console.log('[duraark-sda] POST /buildings/filter');
      _.forEach(filters, function(filter) {
        // console.log('[duraark-sda]       * filter: ' + JSON.stringify(filter, null, 4));
      });

      return duraark._post(url, {
        filters: filters
      }).then(result => {
        resolve(result);
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
      buildm: pa.buildm
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

          // // FIXXME: temporary download URL from Rosetta:
          // item.buildm['http://data.duraark.eu/vocab/buildm/downloadUrl'] = [{
          //   '@value': "http://rosetta.develop.lza.tib.eu/delivery/DeliveryManagerServlet?dps_pid=FL668512&dps_func=stream"
          // }];

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

  //
  // Access to duraark-geometricenrichment
  //

  getIFCReconstruction(config) {
    let duraark = this;

    // config = { filename: abc, restart: false }

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let geometricEnrichmentEndpoint = duraark.getAPIEndpoint('geometricEnrichment') + '/pc2bim';

      duraark._post(geometricEnrichmentEndpoint, config).then(function(pc2bimResult) {
        resolve(pc2bimResult);
      }).catch(function(err) {
        reject(err);
      });
    })
  },

  getDifferenceDetection(config) {
    let duraark = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let diffDetectionEndpoint = duraark.getAPIEndpoint('geometricEnrichment') + '/differencedetection';

      console.log('[duraark] Requesting difference detection between file %s and file %s', config.fileIdA, config.fileIdB);

      duraark._post(diffDetectionEndpoint, config).then(function(diffDetectionResult) {
        resolve(diffDetectionResult);
      }).catch(function(err) {
        reject(err);
      });
    })
  },

  getRoomInfo(file, roomId) {
    let duraark = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let url = duraark.getAPIEndpoint('geometricEnrichment') + '/rise/roomInfo?file=' + file + '&roomId=' + roomId;

      // console.log('url: ' + url);

      // FIXXME: a GET request with jQuery or XMLHttpRequest object is corrupt in my setup with the weird behaviour to only
      // work when the developer tools are open. Investigate (this is extremely anoying ...)!
      return duraark._post(url, {}).then(function(roomInfo) {
        resolve(roomInfo);
      }).catch(function(err) {
        reject(err);
      });

    });
  },

  getRoomX3D(file, roomId) {
    let duraark = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let url = duraark.getAPIEndpoint('geometricEnrichment') + '/rise/x3d?file=' + file;
      if (roomId) {
        url += '&roomId=' + roomId;
      }

      console.log('url: ' + url);

      // FIXXME: a GET request with jQuery or XMLHttpRequest object is corrupt in my setup with the weird behaviour to only
      // work when the developer tools are open. Investigate (this is extremely annoying ...)!
      return duraark._post(url, {}).then(function(roomInfo) {
        resolve(roomInfo);
      }).catch(function(err) {
        reject(err);
      });

    });
  },

  getWallJSON(file) {
    let duraark = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      let wallJSONPath = '/sessions/byg72-2nd-scan_fixed/tmp/CITA_Byg72_2nd_Scan_wall.json';
      let url = duraark.getAPIEndpoint('geometricEnrichment') + wallJSONPath;

      // console.log('url: ' + url);

      // FIXXME: a GET request with jQuery or XMLHttpRequest object is corrupt in my setup with the weird behaviour to only
      // work when the developer tools are open. Investigate (this is extremely anoying ...)!
      return duraark._post(url, {}).then(function(wallJSON) {
        resolve(wallJSON);
      }).catch(function(err) {
        reject(err);
      });

    });
  },

  getFloorPlanData(file) {
    let url = this.getAPIEndpoint('geometricEnrichment') + '/rise/getFloorplandata?e57master=' + file,
      duraark = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      return duraark._post(url, {}).then(function(repsonse) {
        resolve(repsonse);
      }).catch(function(err) {
        reject(err);
      });
    });
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
  },

  // moral FIXXME: Dear developer, recruiter or other curious reader! Please ignore this piece of code.
  // It is an ugly, temporarily necessary piece of something that will always remind me of
  // how far technical dept can bring you when you have to meet a deadline ...
  // technical FIXXME: use ember-data, for god's sake ...
  fixxmeUpdateToolOnServer(session, digitalObject, tool) {
    let geoToolsPlain = JSON.parse(JSON.stringify(digitalObject.get('geoTools')));
    let sessionPlain = JSON.parse(JSON.stringify(session));
    let digObj = _.where(sessionPlain.digitalObjects, {
      label: digitalObject.get('label')
    });

    let geoTool = _.where(geoToolsPlain, {
      label: Ember.get(tool, 'label')
    });

    sessionPlain.id = session.get('id');
    console.log('sessionid: ' + sessionPlain.id);

    if (geoTool.length) { // NOTE: when saving after the removal of a tool in the GUI length === 0
      geoTool[0].isLoading = Ember.get(tool, 'isLoading');
      geoTool[0].hasData = Ember.get(tool, 'hasData');
      geoTool[0].hasError = Ember.get(tool, 'hasError');
      geoTool[0].jobId = Ember.get(tool, 'jobId');
      geoTool[0].viewerUrl = Ember.get(tool, 'viewerUrl');
      geoTool[0].errorText = Ember.get(tool, 'errorText');
      if (Ember.get(tool, 'showStartButton')) {
        geoTool[0].showStartButton = tool.get('showStartButton');
      }
      if (Ember.get(tool, 'downloadUrl')) {
        geoTool[0].downloadUrl = Ember.get(tool, 'downloadUrl');
      }
      // FIXXME: remove after renaming all 'filename' to 'inputFile' occurences
      if (Ember.get(tool, 'filename')) {
        geoTool[0].filename = Ember.get(tool, 'filename');
      }
      if (Ember.get(tool, 'inputFile')) {
        geoTool[0].inputFile = Ember.get(tool, 'inputFile');
      }
      if (Ember.get(tool, 'bimDownloadUrl')) {
        geoTool[0].bimDownloadUrl = Ember.get(tool, 'bimDownloadUrl');
      }
      if (Ember.get(tool, 'wallsDownloadUrl')) {
        geoTool[0].wallsDownloadUrl = Ember.get(tool, 'wallsDownloadUrl');
      }
      if (Ember.get(tool, 'fileIdA')) {
        geoTool[0].fileIdA = Ember.get(tool, 'fileIdA');
      }
      if (Ember.get(tool, 'fileIdB')) {
        geoTool[0].fileIdB = Ember.get(tool, 'fileIdB');
      }
    }

    digObj[0].geoTools = geoToolsPlain;

    let sessionsEndpoint = this.getAPIEndpoint('sessions') + '/sessions/fixxmeSaveSession';
    return this._post(sessionsEndpoint, sessionPlain);
  }
});
