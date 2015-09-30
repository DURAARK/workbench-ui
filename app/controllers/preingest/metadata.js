import Ember from 'ember';
import ENV from '../../config/environment';

var sessionEndpoint = ENV.DURAARKAPI.sessions;

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
  actions: {
    next: function() {

      // FIXXME: check if everything is saved in the buildm-editor and display modal in case of unsaved changes!

      var session = this.get('session');
      this.transitionToRoute('preingest.semanticenrichment', session);
    },

    back: function() {

      // FIXXME: check if everything is saved in the buildm-editor and display modal in case of unsaved changes!

      var session = this.get('session');
      this.transitionToRoute('preingest.files', session);
    },

    showDetails: function(item) {
      this.set('fileInfo', item);
    },

    updateMetadata: function(buildm) {
      var session = this.get('session'),
        //entityType = buildm['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0]['@value'],
        // entityId = buildm['@id'],
        controller = this;

      // console.log('entityType: ' + entityType);
      // console.log('entityId: ' + entityId);

      var entityToUpdate = null,
        entityCandidates = null;

      // if (entityType === 'http://data.duraark.eu/vocab/buildm/PhysicalAsset') {
      //   console.log('About to update PhysicalAsset');
      //   entityCandidates = session.get('physicalAssets');
      // } else if (entityType === 'http://data.duraark.eu/vocab/buildm/IFCSPFFile' || entityType === 'http://data.duraark.eu/vocab/buildm/E57File') {
      //   console.log('About to update DigitalObject');
      //   entityCandidates = session.get('digitalObjects');
      // }

      var entityType = this.get('entityType');
      if (entityType === 'physicalAsset') {
        console.log('About to update PhysicalAsset');
        entityCandidates = session.get('physicalAssets');
      } else if (entityType === 'http://data.duraark.eu/vocab/buildm/IFCSPFFile' || entityType === 'http://data.duraark.eu/vocab/buildm/E57File') {
        console.log('About to update DigitalObject');
        entityCandidates = session.get('digitalObjects');
      }
      entityToUpdate = session.get('physicalAssets')[0];

      // entityCandidates.forEach(function(candidate) {
      //   if (candidate.buildm['@id'] === entityId) {
      //     entityToUpdate = candidate;
      //   }
      // });

      // FIXXME: I found no other way to update the buildm object, due to ember error messages. ..
      _.forEach(buildm, function(value, key) {
        entityToUpdate.buildm[key] = value;
      });

      var sessionId = session.get('id'),
        url = sessionEndpoint.host + '/sessions/' + sessionId;

      controller.send('isLoading', true);

      var payload = session.toJSON();
      var ds = [];
      if (payload.digitalObjects) {
        payload.digitalObjects.forEach(function(item) {
          ds.push(JSON.parse(JSON.stringify(item)));
        });
      }
      payload.digitalObjects = ds;

      var pa = [];
      payload.physicalAssets.forEach(function(item) {
        pa.push(JSON.parse(JSON.stringify(item)));
      });
      payload.physicalAssets = pa;

      // FIXXME: I also found no way to update the session with ember board utilities, I guess I have an
      // logical error in my approach, it cannot be that hard with ember data and plain objects. Anyways,
      // this does the job, too:
      post(url, payload).then(function(result) {
        console.log('stored session ...');
        controller.send('isLoading', false);
        // controller.send('sessionChanged');
      }).catch(function(err) {
        controller.send('isLoading', false);
        throw new Error(err);
      });

    }
  },

  isPhysicalAsset: function() {
    let buildm = this.get('fileInfo')['buildm'];
    return this.duraark.isOfType(buildm, 'http://data.duraark.eu/vocab/buildm/PhysicalAsset');
  }.property('fileInfo'),

  isIFC: function() {
    let buildm = this.get('fileInfo')['buildm'];
    return this.duraark.isOfType(buildm, 'http://data.duraark.eu/vocab/buildm/IFCSPFFile');
  }.property('fileInfo'),

  isE57: function() {
    let buildm = this.get('fileInfo')['buildm'];
    return this.duraark.isOfType(buildm, 'http://data.duraark.eu/vocab/buildm/E57File');
  }.property('fileInfo')

});
