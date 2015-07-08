    import Ember from 'ember';
    export
    default Ember.Route.extend({

      model: function(params) {
        var sessions = this.modelFor('application').get('content');
        var session = sessions[params.id - 1];

        return session;
      },

      setupController: function(controller, model) {
        this._super(controller, model);
        controller.set('session', model);
      }
    });

    //
    //
    // function _getFileExtension(filepath) {
    //     return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
    // }
    //
    // export
    // default Ember.Route.extend({
    //     model: function(params) {
    //         return this.store.find('metadatastage', params.id);
    //     },
    //
    //     setupController: function(controller, model) {
    //         var store = this.store,
    //             stage = model,
    //             physicalAssets = [],
    //             digitalObjects = [],
    //             ifcms = [],
    //             e57ms = [];
    //
    //         this._super(controller, model);
    //
    //         controller.set('stage', stage);
    //         controller.set('physicalAssets', physicalAssets);
    //         controller.set('digitalObjects', digitalObjects);
    //         controller.set('ifcms', ifcms);
    //         controller.set('e57ms', e57ms);
    //
    //         // Check if the physicalAsset already has metadata associated with it within the metadatastage from microservice-sip.
    //         // If so, create and populate a physical-asset instance, else create an empty instance:
    //         model.get('physicalAssets').then(function(assets) {
    //             var assets = stage.get('physicalAssets'),
    //                 asset = null;
    //
    //             if (assets.get('length') === 1) { // NOTE: We know, that there is alwasy exactly one physical asset in the array.
    //                 asset = assets.toArray()[0];
    //             } else {
    //                 asset = store.createRecord('digital-object');
    //
    //                 // Create empty instance:
    //                 var physicalAssetInstanceTemplate = {
    //                     identifier: '',
    //                     latitude: '',
    //                     longitude: '',
    //                     owner: '',
    //                     buildingArea: -1,
    //                     floorCount: -1,
    //                     numberOfRooms: -1,
    //                     'function': '',
    //                     architecturalStyle: '',
    //                     description: '',
    //                     location: '',
    //                     streetAddress: '',
    //                     postalCodeStart: '',
    //                     postalCodeEnd: '',
    //                     postOfficeBoxNumber: '',
    //                     addressRegion: '',
    //                     postalLocality: '',
    //                     architect: '',
    //                     contributor: '',
    //                     startDate: -1,
    //                     completionDate: -1,
    //                     constructionTime: -1,
    //                     rebuildingDate: -1,
    //                     modificationDetails: '',
    //                     cost: -1,
    //                     rightsDetails: ''
    //                 };
    //
    //                 asset.set('instance', physicalAssetInstanceTemplate);
    //                 asset.set('schema', 'buildm');
    //
    //                 // FIXXME: this is a hack to set the first found ifc file within the
    //                 // physicalAsset. The file(name) is needed to extract metadata.
    //                 // If there are multiple ifc files the user should be able to choose,
    //                 // which metadata to take or to combine from different ifcs!
    //                 // asset.set('file', file.get('path'));
    //             }
    //
    //             physicalAssets.pushObject(asset);
    //         });
    //
    //         this.store.find('filestage', stage.get('id')).then(function(filestage) {
    //             filestage.get('files').then(function(files) {
    //                 controller.set('files', files);
    //
    //                 // For each file, add corresponding metadata instances:
    //                 files.forEach(function(file) {
    //                     var ext = _getFileExtension(file.get('path'))[0];
    //
    //                     if (ext === 'ifc') {
    //                         var isNewRecord = false;
    //
    //                         // Check if the physicalAsset already has metadata associated with it within the metadatastage from microservice-sip.
    //                         // If so, create and populate a physical-asset instance, else create an empty instance:
    //                         model.get('digitalObjects').then(function(storedObjects) {
    //                             var filepath = file.get('path');
    //                             console.log('checking if "' + filepath + '" is already poplated:');
    //                             var object = storedObjects.findBy('file', filepath);
    //
    //                             if (!object) {
    //                                 object = store.createRecord('digital-object');
    //                                 object.set('file', file.get('path'));
    //                                 object.set('instance', {
    //                                     type: 'PLAN'
    //                                 });
    //
    //                                 var digitalObjectInstanceTemplate = {
    //                                     identifier: '',
    //                                     creator: '',
    //                                     name: '',
    //                                     dateCreated: -1,
    //                                     isPartOf: -1,
    //                                     hasPart: -1,
    //                                     format: '',
    //                                     hasType: -1,
    //                                     hasFormatDetails: '',
    //                                     description: '',
    //                                     provenance: '',
    //                                     license: '',
    //                                     unitCode: -1,
    //                                     levelOfDetail: ''
    //                                 };
    //                                 object.set('instance', digitalObjectInstanceTemplate);
    //                                 object.set('schema', 'buildm');
    //
    //                                 isNewRecord = true;
    //                             }
    //
    //                             if (isNewRecord) {
    //                                 object.save().then(function(record) {
    //                                     digitalObjects.pushObject(record);
    //                                 });
    //                             } else {
    //                                 digitalObjects.pushObject(object);
    //                             }
    //
    //                             var ifcm = store.createRecord('ifcm');
    //
    //                             var ifcmSchemaTemplate = {
    //                                 header: {
    //                                     creationDate: new Date(),
    //                                     author: 'Martin Hecher',
    //                                     organization: 'TU Graz',
    //                                     preprocessor: 'none',
    //                                     originatingSystem: 'none',
    //                                     authorization: 'none',
    //                                     fileSchema: 'IFC-SPF',
    //                                     viewDefinition: 'none',
    //                                     exportOptions: 'none'
    //                                 },
    //                                 ifcparameters: {
    //                                     ifcApplication: 'Blender',
    //                                     IfcGeometricRepresentationContext: 'none',
    //                                     ifcSiUnit: 'none'
    //                                 },
    //                                 countObjects: {
    //                                     floorCount: 3,
    //                                     roomCount: 3,
    //                                     wallCount: 3,
    //                                     windowsCount: 3,
    //                                     doorCount: 3,
    //                                     pipeCount: 3,
    //                                     columnCount: 3,
    //                                     numberOfComponents: 3,
    //                                     numberOfRelations: 3,
    //                                     numberOfActors: 3
    //                                 },
    //                                 informationMetric: {
    //                                     numberOfEntityTypesUsed: 3,
    //                                     numberOfTotalEntitiesUsed: 3,
    //                                     optionalAttributes: 0
    //                                 },
    //                                 dependencies: {
    //                                     webResourceLink: 'none'
    //                                 }
    //                             };
    //
    //                             ifcm.set('file', file.get('path'));
    //                             ifcm.set('instance', ifcmSchemaTemplate);
    //                             ifcm.set('schema', 'ifcm');
    //                             ifcms.pushObject(ifcm);
    //                         });
    //                     } else if (ext === 'e57') {
    //                         var e57m = store.createRecord('e57m');
    //                         e57m.set('file', file.get('path'));
    //                         e57m.set('instance', {});
    //                         e57m.set('schema', 'e57m');
    //                         e57ms.pushObject(e57m);
    //                     }
    //                 });
    //             });
    //         });
    //     },
    //
    //
    //     actions: {
    //         save: function() {
    //             var that = this;
    //
    //             // NOTE: see http://stackoverflow.com/questions/26940363/ember-data-belongsto-async-relationship-omitted-from-createrecord-save-seria
    //             // on how to save a 'belongsTo' relationship:
    //             var metadatastage = this.get('controller.stage');
    //
    //             // metadatastage.set('physicalAssets', []);
    //             metadatastage.get('physicalAssets').then(function(records) {
    //                 // records.forEach(function(item) {
    //                 //     item.deleteRecord();
    //                 // })
    //
    //                 // records.save().then(function() {
    //                 //     debugger;
    //
    //                 that.get('controller.physicalAssets').forEach(function(asset) {
    //                     console.log('owner: ' + asset.get('instance.owner'));
    //                     asset.save();
    //                 });
    //
    //                 that.get('controller.digitalObjects').forEach(function(dobject) {
    //                     dobject.save();
    //                 });
    //             });
    //             // });
    //
    //             this.transitionTo('preingest.show', metadatastage.get('session'));
    //         }
    //     }
    // });
