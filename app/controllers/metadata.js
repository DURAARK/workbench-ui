import Ember from 'ember';

function post(url, data) {
  var that = this;

  return new Ember.RSVP.Promise(function(resolve, reject) {
    function handler(data, status, jqxhr) {
      if (status === 'success') {
        resolve(data);
      } else {
        reject(new Error('[FocusedCrawlerAPI::_post]: "' + url + '" failed with status: [' + jqxhr.status + ']'));
      }
    }

    Ember.$.post(url, data, handler);
  });
};

export default Ember.Controller.extend({
  actions: {
    showDetails: function(item) {
      this.set('fileInfo', item);
    },

    updateMetadata: function(buildm) {
      var session = this.get('session'),
        entityType = buildm['@type'][0],
        entityId = buildm['@id'];

      console.log('entityType: ' + entityType);
      console.log('entityId: ' + entityId);

      var entityToUpdate = null,
        entityCandidates = null;

      if (entityType === 'http://data.duraark.eu/vocab/PhysicalAsset') {
        console.log('About to update PhysicalAsset');
        entityCandidates = session.get('physicalAssets');
      } else if (entityType === 'http://data.duraark.eu/vocab/IFCSPFFile' || entityType === 'http://data.duraark.eu/vocab/E57File') {
        console.log('About to update DigitalObject');
        entityCandidates = session.get('digitalObjects');
      }

      entityCandidates.forEach(function(candidate) {
        if (candidate.buildm['@id'] === entityId) {
          entityToUpdate = candidate;
        }
      });

      // FIXXME: I found no other way to update the buildm object, due to ember error messages. ..
      _.forEach(buildm, function(value, key) {
        entityToUpdate.buildm[key] = value;
      });

      var sessionId = session.get('id'),
        url = 'http://localhost:5001/sessions/' + sessionId;

      // FIXXME: I also found no way to update the session with ember board utilities, I guess I have an
      // logical error in my approach, it cannot be that hard with ember data and plain objects. Anyways,
      // this does the job, too:
      post(url, session.toJSON()).then(function(result) {
        console.log('stored session ...');
      }).catch(function(err) {
        throw new Error(err);
      });

    }
  },

  isPhysicalAsset: function() {
    var type = this.get('fileInfo')['buildm']['@type'][0];
    return type === 'http://data.duraark.eu/vocab/PhysicalAsset';
  }.property('fileInfo'),

  isIFC: function() {
    var type = this.get('fileInfo')['buildm']['@type'][0];
    return type === 'http://data.duraark.eu/vocab/IFCSPFFile';
  }.property('fileInfo'),

  isE57: function() {
    var type = this.get('fileInfo')['buildm']['@type'][0];
    return type === 'http://data.duraark.eu/vocab/E57File';
  }.property('fileInfo')

});
