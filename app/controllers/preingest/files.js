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
      if (!this.get('files.length')) {
        alert('Add at least one master file first!');
        return;
      }

      controller.send('showLoadingSpinner', true, 'Extracting metadata ...');

      // console.log('Files:');
      // controller.get('files').forEach(function(file) {
      //   console.log('  * ' + file.get('path'));
      // });

      var session = controller.get('session'),
        files = controller.get('files'),
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
      var promises = [],
        newFiles = [];

      files.forEach(function(file) {
        var hasMD = _.isObject(file.get('metadata'));
        if (!hasMD) {
          newFiles.pushObject(file);
          if (file.get('path').endsWith('.ifc')) {
            promises.push(controller.addDescriptiveMetadataTo(file));
          } else {
            file.set('metadata', {});
          }
        }
      });

      Ember.RSVP.Promise.all(promises).then(function() {
        // NOTE: work on the 'files' variable from the outer context, as this function only gets
        // the files which did not have metadata before, which could be empty even.

        var das = [];

        newFiles.forEach(function(file) {
          var hasMetadata = true;

          if (file.get('path').endsWith('e57')) {
            hasMetadata = false;
          }

          if (!hasPA) {
            // FIXXME: how to combine pa data from all files?
            var paMD = (hasMetadata && file.get('metadata') && file.get('metadata').physicalAsset) ? file.get('metadata').physicalAsset : {
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

          let digObj = controller.createDigitalObjectFromFile(file, hasMetadata);

          das.pushObject(digObj);
        });

        var sessionDAs = session.get('digitalObjects');
        if (!sessionDAs) {
          sessionDAs = [];
          session.set('sessionDAs', das);
        }
        das.forEach(function(da) {
          sessionDAs.pushObject(da);
        })

        session.save().then(function(session) {
          controller.transitionToRoute('preingest.metadata', session);
          controller.send('showLoadingSpinner', false);
        }).catch(function(err) {
          controller.send('showLoadingSpinner', false);
          alert(err);
        });
      }).catch(function(err) {
        alert('Error extracting metadata for selected file(s)');
        controller.send('showLoadingSpinner', false);
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
      if (file.get('isSelected')) {
        this.unselectFile(file);
        return;
      }

      this.selectFile(file);

      // Reset details pane:
      controller.set('errors', null);
      controller.set('fileInfo', null);

      controller.send('showLoadingSpinner', true, 'Extracting metadata ...');

      this.addTechnicalMetadata(file).then(function(file) {
        var md = file.get('metadata');

        console.log('showing technical metadata for:   ' + file.get('path'));

        controller.set('fileInfo', file);
        controller.send('showLoadingSpinner', false);

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
        // controller.send('showLoadingSpinner', false);
      }).catch(function(err) {
        controller.send('showLoadingSpinner', false);
        // FIXXME: use either one of those two error handling methods!
        controller.set('errors', err);
        controller.send('showError', err);
        throw new Error(err);
      });

      this.showInViewer(file);
    },

    addFiles: function(uploadedFiles) {
      let files = this.get('files'),
      controller = this;

      if (!files) {
        files = [];
      }

      _.forEach(uploadedFiles, function(file) {
        // The uploaded files are stored in the 'uploads' folder on the server. They have to
        // be moved to this session's folder before proceeding:
        controller.duraark.addFilesToSession(uploadedFiles, controller.get('session'));
        var record = controller.store.createRecord('file', file);
        files.pushObject(record);
      })

      controller.set('files', files);
    },

    closeToolUI() {
      this.unselectFile(this.get('fileInfo'));
      this.set('fileInfo', null);
    }
  },

  createDigitalObjectFromFile(file, hasMetadata) {
    var name = file.get('path').split('/').pop();
    var daMD = (hasMetadata && file.get('metadata') && file.get('metadata').digitalObject) ? file.get('metadata').digitalObject : {
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

    return digOb;
  },

  showInViewer(file) {
    return;
    var isE57 = file.get('path').endsWith('.e57');
    var isIfc = file.get('path').endsWith('.ifc');
    if (isIfc) {
      this.transitionToRoute('ifc-viewer');
    } else if (isE57) {
      Ember.run(function() {
        location = '/viewer/pointcloud';
      });
      this.transitionToRoute('ifc-viewer');
    } else {
      console.log('[ifc-viewer] Format not supported.');
    }
  },

  addTechnicalMetadata: function(file) {
    var mdInstance = null,
      controller = this;

    console.log('[addTechnicalMetadata] file type: ' + file.type);

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

        // file.save().then(function(file) {
        resolve(file);
        // });
      }).catch(function(err) {
        reject(err);
      });
    });
  },

  selectFile(file) {
    let fileInfo = this.get('fileInfo');
    if (fileInfo) {
      fileInfo.set('isSelected', false);
    }

    file.set('isSelected', true);
    file.set('fileInfo', file);
  },

  unselectFile(file) {
    this.set('fileInfo', null);
    file.set('isSelected', false);
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

            controller.send('showLoadingSpinner', true, 'Extracting metadata ...');
      md.save().then(function(result) {

                    controller.send('showLoadingSpinner', false);
        if (result.get('extractionErrors')) {
          return reject(result.get('extractionErrors'));
        }

        var metadata = result.get('metadata');
        // FIXXME: workaround for faulty file.save():
        file.metadata = metadata;
        //file.set('metadata', metadata);

        //file.save().then(function(file) {
        resolve(file);
        //});
      }).catch(function(err) {
        reject(err);
      });
    });
  }
});
