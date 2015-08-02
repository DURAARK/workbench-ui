import Ember from 'ember';

export default Ember.Controller.extend({
  selectedFiles: [],
  fileInfo: null,

  fileInfoShortName: function() {
    if (!this.get('fileInfo')) return 'No file selected';

    var path = this.get('fileInfo.path');
    return path.replace('/duraark-storage/files/', ''); // FIXXME!
  }.property('fileInfo'),

  actions: {
    next: function() {
      var controller = this;

      controller.send('isLoading', true, 'Extracting metadata ...');

      console.log('Selected files:');
      this.get('selectedFiles').forEach(function(file) {
        console.log('  * ' + file.get('path'));
      });

      var session = this.get('session'),//this.store.createRecord('session'),
        files = this.get('selectedFiles');

      session.set('files', files);

      // Take files and create a physicalAsset and digitalObjects from the files:
      var pa = {
        label: 'Building Site Name',
        buildm: {}
      };

      // Check if files have metadata attached already. If not, get it from the metadata service.
      var promises = [];

      files.forEach(function(file) {
        // For programming reasons we request the metadata for all files. Internally the 'addMetadataTo' will
        // return a present 'metadata' object and not request the metadata again. The reason for getting the
        // metadata for *all* files is that the data is then present in the
        //if (!file.get('metadata')) {

        // FIXXME!
        // if (file.get('path') !== '/duraark-storage/files/Nygade_Scan1001.e57') {
        if (file.get('path').endsWith('.ifc')) {
          promises.push(controller.addMetadataTo(file));
        }
      });

      Ember.RSVP.Promise.all(promises).then(function() {
        // NOTE: work on the 'files' variable from the outer context, as this function only gets
        // the files which did not have metadata before, which could be empty even.

        files.forEach(function(file) {
          var hasMetadata = true;

          if (file.get('path').endsWith('e57')) {
            hasMetadata = false;
          }

          // FIXXME: how to combine pa data from all files?
          var paMD = (hasMetadata) ? file.get('metadata').physicalAsset : {
            '@type': ['http://data.duraark.eu/vocab/PhysicalAsset'],
            'http://data.duraark.eu/vocab/name': [{
              '@value': 'Nygade Building'
            }]
          };

          var sessionLabel = controller.get('session.label');

          paMD['http://data.duraark.eu/vocab/name'] = [{
            '@value': sessionLabel
          }];

          pa.buildm = paMD;
          session.set('physicalAssets', [pa]);

          var name = file.get('path').replace('/duraark-storage/files/', ''); // FIXXME!
          var daMD = (hasMetadata) ? file.get('metadata').digitalObject : {
            '@type': ['http://data.duraark.eu/vocab/E57File'],
            'http://data.duraark.eu/vocab/name': [{
              '@value': name
            }]
          };

          daMD['http://data.duraark.eu/vocab/name'] = [{
            '@value': name
          }];

          var digOb = Ember.Object.create({
            label: (hasMetadata) ? daMD['http://data.duraark.eu/vocab/name'][0]['@value'] : 'Edit name',
            // label: file.get('path'),
            buildm: daMD,
            semMD: Ember.Object.create({
              topics: []
            }),
            techMD: {},
            derivatives: {},
            path: file.get('path'),
            size: file.get('size')
          });

          console.log('PATH: ' + file.get('path'));

          var das = null;

          var das = session.get('digitalObjects');
          if (!das) {
            das = [];
          }

          das.pushObject(digOb);
          session.set('digitalObjects', das);
        });
      }).catch(function(err) {
        throw new Error(err);
      });

      session.save().then(function(session) {
        controller.transitionToRoute('metadata', session);
        controller.send('isLoading', false);
      }).catch(function(err) {
        controller.send('isLoading', false);
        alert(err);
      });
    },

    toggleSelection: function(file) {
      file.toggleProperty('isSelected');

      var files = this.get('selectedFiles');

      if (file.get('isSelected')) {
        files.pushObject(file);
        // console.log('selected file:   ' + file.get('path'));
      } else {
        files.removeObject(file);
        // console.log('deselected file:   ' + file.get('path'));
      }

      // console.log('Currently selected files:');
      // files.forEach(function(file) {
      //   console.log('  * ' + file.get('path'));
      // });
    },

    showDetails: function(file) {
      if (file.get('path').endsWith('e57')) {
        return;
      }

      var controller = this;

      // Reset details pane:
      controller.set('errors', null);
      controller.set('fileInfo', null);

      controller.send('isLoading', true, 'Extracting metadata ...');

      this.addMetadataTo(file).then(function(file) {
        var md = file.get('metadata');

        console.log('showing details for file:   ' + file.get('path'));
        // console.log('md: ' + JSON.stringify(md, null, 4));

        // NOTE: override 'name' from extraction with filename:
        var name = file.get('path').split('/').pop(),
          digObj = file.get('metadata.digitalObject'),
          pa = file.get('metadata.physicalAsset');

        if (digObj['http://data.duraark.eu/vocab/name']) {
          digObj['http://data.duraark.eu/vocab/name'] = [{
            '@value': name
          }];
        }

        if (pa['http://data.duraark.eu/vocab/name']) {
          pa['http://data.duraark.eu/vocab/name'] = [{
            '@value': 'Session Name' // FIXXME: set session name
          }];
        }

        controller.set('fileInfo', file);
        controller.send('isLoading', false);
      }).catch(function(err) {
        controller.send('isLoading', false);
        // FIXXME: use either one of those two error handling methods!
        controller.set('errors', err);
        controller.send('showError', err);
        throw new Error(err);
      });
    }
  },

  addMetadataTo: function(file) {
    var controller = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      // // Do not request metadata if already present:
      // var asdf = file.get('metadata');
      // if (typeof(file.get('metadata')) !== 'undefined') {
      //   return resolve(file);
      // }

      // TODO: check local store before sending network request!

      // NOTE: requests metadata for the given file via the
      //       'metadata-extraction' service
      // FIXXME: utilize store as cache, do not request every time!
      var md = controller.store.createRecord('metadatum');
      md.set('path', file.get('path'));
      md.set('type', file.get('type'));

      md.save().then(function(result) {
        if (result.get('extractionErrors')) {
          return reject(result.get('extractionErrors'));
        }

        var metadata = result.get('metadata');
        file.set('metadata', metadata);

        file.save().then(function(file) {
          resolve(file);
        });
      }).catch(function(err) {
        reject(err);
      });
    });
  }
});
