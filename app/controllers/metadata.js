import Ember from 'ember';

function _getFileExtension(filepath) {
    return (/[.]/.exec(filepath)) ? /[^.]+$/.exec(filepath) : null;
}

export
default Ember.Controller.extend({
    actions: {
        selectItem: function(item) {
            var filename = item.get('file');
            var fileext = _getFileExtension(filename)[0];

            if (fileext === 'e57' && item.get('schema') === 'e57m') { // --> e57m
                this.transitionToRoute('metadata.e57m', item);
            }

            if (fileext === 'ifc' && item.get('schema') === 'ifcm') { // --> ifcm
                this.transitionToRoute('metadata.ifcm', item);
            }

            // FIXXME: refactor differentiation between digital-object and physical-asset!
            if (fileext === 'ifc' && item.get('schema') === 'buildm' && item.get('instance').creator) { // --> digitalObject
                this.transitionToRoute('metadata.digitalobject', item);
            }

            // FIXXME: refactor differentiation between digital-object and physical-asset!
            if (fileext === 'ifc' && item.get('schema') === 'buildm' && item.get('instance').hasOwnProperty('latitude')) { // --> physicalAsset
                this.transitionToRoute('metadata.physicalasset', item);
            }
        }
    },

    // onFilesStageChanged: function() {
    //     var files = this.get('files'),
    //         metadataStage = this.get('stage'),
    //         schema = null,
    //         that = this;

    //     files.forEach(function(file) {
    //         var ext = _getFileExtension(file.get('path'))[0],
    //             metadataAPI = null;

    //         if (ext.toLowerCase() === 'ifc') {
    //             metadataAPI = new IfcMetadataAPI();
    //             schema = 'ifcm';
    //         } else if (ext.toLowerCase() === 'e57') {
    //             metadataAPI = new E57MetadataAPI();
    //             schema = 'e57m';
    //         }

    //         if (metadataAPI) {
    //             metadataAPI.getMetadataFor({
    //                 path: file.get('path')
    //             }).then(function(md) {
    //                 if (md.type === 'ifc') {

    //                     var physicalAssets = metadataStage.get('physicalAssets');
    //                     var digitalObjects = metadataStage.get('digitalObjects');

    //                     // var dasset = metadataStage.get('physicalAssets').filterBy('file', md.physicalAsset.file);
    //                     var dasset = null;
    //                     physicalAssets.forEach(function(asset) {
    //                         var file = asset.get('file');
    //                         if (md.physicalAsset.file === file) {
    //                             dasset = md.physicalAsset;
    //                         }
    //                     });

    //                     //if (!dasset) {
    //                         var physicalAsset = that.store.createRecord('physicalAsset', md.physicalAsset);
    //                         physicalAsset.save().then(function() {
    //                             metadataStage.get('physicalAssets').pushObject(physicalAsset);
    //                         });
    //                     //}

    //                     var dobj = digitalObjects.filterBy('file', md.digitalObject.file);
    //                     if (!dobj) {
    //                         var digitalObject = that.store.createRecord('digitalObject', md.digitalObject);
    //                         digitalObject.save().then(function() {
    //                             metadataStage.get('digitalObjects').pushObject(digitalObject);
    //                         });
    //                     }

    //                     // var difcm = metadataStage.get('ifcms').filterBy('file', md.ifcm.file);
    //                     // if (!difcm) {
    //                     //     var ifcm = that.store.createRecord('ifcm', md.ifcm);
    //                     //     ifcm.save().then(function() {
    //                     //         metadataStage.get('ifcms').pushObject(ifcm);
    //                     //     });
    //                     // }
    //                 } else if (md.type === 'e57') {
    //                     var de57m = metadataStage.get('e57ms').filterBy('file', md.e57m.file);

    //                     if (!de57m) {
    //                         var e57m = that.store.createRecord('e57m', md.e57m);
    //                         e57m.save().then(function() {
    //                             metadataStage.get('e57ms').pushObject(e57m);
    //                         });
    //                     }
    //                 }
    //             });
    //         }

    //         // console.log('path: ' + file.get('path'));
    //     });
    // }.observes('files')
});