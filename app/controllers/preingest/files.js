import Ember from 'ember';

export default Ember.Controller.extend({
  selectedFiles: [],
  fileInfo: null,

  fileInfoShortName: function() {
    if (!this.get('fileInfo')) return 'No file selected';

    var path = this.get('fileInfo.path');
    return path.replace('/duraark-storage/files/', ''); // FIXXME!
  }.property('fileInfo'),

  fileInfoIsE57: function() {
    if (!this.get('fileInfo')) return false;

    var path = this.get('fileInfo.path');
    return path.endsWith('.e57');
  }.property('fileInfo'),

  fileInfoIsIFC: function() {
    if (!this.get('fileInfo')) return false;

    var path = this.get('fileInfo.path');
    return path.endsWith('.ifc');
  }.property('fileInfo'),

  actions: {
    next: function() {
      var controller = this;

      if (!this.get('selectedFiles.length')) {
        alert('Select one or multiple files first!');
        return;
      }

      controller.send('isLoading', true, 'Extracting metadata ...');

      // console.log('Selected files:');
      // controller.get('selectedFiles').forEach(function(file) {
      //   console.log('  * ' + file.get('path'));
      // });

      var session = controller.get('session'),
        files = controller.get('selectedFiles'),
        sessionLabel = controller.get('session.label'),
        buildingAddress = controller.get('session.address'),
        hasPA = session.get('physicalAssets').length,
        paNew = {};

      session.set('files', files);
      // session['files'] = files;

      // Take files and create a physicalAsset and digitalObjects from the files:

      if (!hasPA) {
        paNew = {
          label: sessionLabel,
          buildm: {}
        };
      }

      // Check if files have metadata attached already. If not, get it from the metadata service.
      var promises = [];

      files.forEach(function(file) {
        // For programming reasons we request the metadata for all files. Internally the 'addTechnicalMetadata' will
        // return a present 'metadata' object and not request the metadata again. The reason for getting the
        // metadata for *all* files is that the data is then present in the
        //if (!file.get('metadata')) {

        // FIXXME!
        // if (file.get('path') !== '/duraark-storage/files/Nygade_Scan1001.e57') {
        if (file.get('path').endsWith('.ifc')) {
          promises.push(controller.addDescriptiveMetadataTo(file));
        }
      });

      Ember.RSVP.Promise.all(promises).then(function() {
        // NOTE: work on the 'files' variable from the outer context, as this function only gets
        // the files which did not have metadata before, which could be empty even.

        var das = [];

        files.forEach(function(file) {
          var hasMetadata = true;

          if (file.get('path').endsWith('e57')) {
            hasMetadata = false;
          }

          if (!hasPA) {
            // FIXXME: how to combine pa data from all files?
            var paMD = (hasMetadata) ? file.get('metadata').physicalAsset : {
              '@type': 'http://data.duraark.eu/vocab/buildm/PhysicalAsset',
              'http://data.duraark.eu/vocab/buildm/name': [{
                '@value': 'Nygade Building'
              }],
              'http://data.duraark.eu/vocab/buildm/streetAddress': [{
                '@value': buildingAddress
              }]
            };

            paMD['http://data.duraark.eu/vocab/buildm/name'] = [{
              '@value': sessionLabel
            }];

            paNew.buildm = paMD;
            session.set('physicalAssets', [paNew]);
          }

          var name = file.get('path').replace('/duraark-storage/files/', ''); // FIXXME!
          var daMD = (hasMetadata) ? file.get('metadata').digitalObject : {
            '@type': 'http://data.duraark.eu/vocab/buildm/E57File',
            'http://data.duraark.eu/vocab/buildm/name': [{
              '@value': name
            }]
          };

          if (hasMetadata) {
            daMD['@type'] = 'http://data.duraark.eu/vocab/buildm/IFCSPFFile';
          }

          daMD['http://data.duraark.eu/vocab/buildm/name'] = [{
            '@value': name
          }];

          var duraarkType = (hasMetadata) ? 'http://data.duraark.eu/vocab/buildm/IFCSPFFile' : 'http://data.duraark.eu/vocab/buildm/E57File'
          let type = duraarkType.split('/').pop().toLowerCase();
          var uri = 'http://data.duraark.eu/' + type + '_' + uuid.v4();

          daMD['@id'] = uri;

          var digOb = Ember.Object.create({
            label: (hasMetadata) ? daMD['http://data.duraark.eu/vocab/buildm/name'][0]['@value'] : 'Edit name',
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

          // console.log('PATH: ' + file.get('path'));

          das.pushObject(digOb);
        });

        session.set('digitalObjects', das);

        session.save().then(function(session) {
          controller.transitionToRoute('preingest.metadata', session);
          controller.send('isLoading', false);
        }).catch(function(err) {
          controller.send('isLoading', false);
          alert(err);
        });
      }).catch(function(err) {
        alert('Error extracting metadata for selected file(s)');
        controller.send('isLoading', false);
        throw new Error(err);
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
      var controller = this;

      // Reset details pane:
      controller.set('errors', null);
      controller.set('fileInfo', null);

      controller.send('isLoading', true, 'Extracting metadata ...');

      this.addTechnicalMetadata(file).then(function(file) {
        var md = file.get('metadata');

        console.log('showing technical metadata for:   ' + file.get('path'));

        controller.set('fileInfo', file);
        controller.send('isLoading', false);

        // // NOTE: override 'name' from extraction with filename:
        // var name = file.get('path').split('/').pop(),
        //   digObj = file.get('metadata.digitalObject'),
        //   pa = file.get('metadata.physicalAsset');
        //
        // if (digObj['http://data.duraark.eu/vocab/buildm/name']) {
        //   digObj['http://data.duraark.eu/vocab/buildm/name'] = [{
        //     '@value': name
        //   }];
        // }
        //
        // if (pa['http://data.duraark.eu/vocab/buildm/name']) {
        //   pa['http://data.duraark.eu/vocab/buildm/name'] = [{
        //     '@value': 'Session Name' // FIXXME: set session name
        //   }];
        // }
        //
        // controller.set('fileInfo', file);
        // controller.send('isLoading', false);
      }).catch(function(err) {
        controller.send('isLoading', false);
        // FIXXME: use either one of those two error handling methods!
        controller.set('errors', err);
        controller.send('showError', err);
        throw new Error(err);
      });
    },

    addFiles: function(files) {
      this.store.findAll('file').then(function(files) {
        controller.set('files', files);
      });

      // for (var idx = 0; idx < files.length; idx++) {
      //   var file = files[idx];
      //   delete file.id;
      //   var record = this.store.createRecord('file', file);
      //   this.get('files').pushObject(record);
      //   // this.store.push(this.store.normalize('file', file));
      // }
    }
  },

  addTechnicalMetadata: function(file) {
    var mdInstance = null,
      controller = this;

    console.log('[addTechnicalMetadata] file type: ' + file.get('type'));

    if (file.get('path').endsWith('ifc')) {
      mdInstance = controller.store.createRecord('ifcm');
    } else if (file.get('path').endsWith('e57')) {
      mdInstance = controller.store.createRecord('e57m');
    } else {
      alert('File type not supported: ' + file.get('path'));
      throw Error('File type not supported: ' + file.get('path'));
    }

    return new Ember.RSVP.Promise(function(resolve, reject) {
      mdInstance.set('path', file.get('path'));
      mdInstance.set('type', file.get('type'));

      mdInstance.save().then(function(result) {
        if (result.get('extractionErrors')) {
          return reject(result.get('extractionErrors'));
        }

        var metadata = result.get('metadata');
        file.set('techMD', metadata);

        file.save().then(function(file) {
          resolve(file);
        });
      }).catch(function(err) {
        reject(err);
      });
    });
  },

  addDescriptiveMetadataTo: function(file) {
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
      var md = controller.store.createRecord('buildm');
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
