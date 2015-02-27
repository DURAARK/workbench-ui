import Ember from 'ember';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';

export
default Ember.ObjectController.extend({
    _isUpdatingMetadata: false,

    onFileStageChanged: function() {
        if (this.get('_isUpdatingMetadata')) {
            return;
        }

        // Note: when calling the code below the 'model.filestage' property is changed (where?) and causes
        // the observer to recurse indefinitely. This is a quick workaround for that.
        this.set('_isUpdatingMetadata', true);

        var that = this;

        var requestData = Em.RSVP.hash({
            metadataStage: this.get('model.metadatastage'),
            metadata: this.get('model.metadatastage.metadata'),
            fileStage: this.get('model.filestage'),
            store: this.store,
            controller: this
        });

        requestData.then(function(result) {
            that.store.find('filestage').then(function(records) {
                updateMetadataStage(result.metadataStage, result.fileStage, result.metadata, result.store, result.controller);
            });
        });
    }.observes('model.filestage'),

    // test: function() {
    //     var files = this.get('model.filestage.files');
    //     var metadatastage = this.get('model.metadatastage');
    //     var metadata = this.get('model.metadatastage.metadata');

    //     if (files && metadata) {
    //         var mdToRemove = [];

    //         files.forEach(function(file) {
    //             metadata.forEach(function(datum) {
    //                 var keepMD = false;

    //                 var compare = datum.get('file');

    //                 if (compare) {
    //                     if (file === compare) {
    //                         keepMD = true;
    //                     }
    //                 } else {
    //                     // 'datum' is buildm data, keep it
    //                     keepMD = true;
    //                 }

    //                 if (!keepMD) {
    //                     mdToRemove.push(datum);
    //                 }
    //             });
    //         });

    //         mdToRemove.forEach(function(item) {
    //             metadatastage.get('metadata').removeObject(item);
    //         }.bind(this));
    //     }
    // }.observes('model.filestage.files.@each'),

    actions: {
        editStage: function(stage) {
            console.log('[preingest.show] requesting stage editor: ' + stage.get('name'));
            this.transitionTo(stage.get('name'), stage);
        }
    }
});

// TODO: refactor into 'duraark-api' object which gets injected into controllers and routes!
function updateMetadataStage(metadataStage, fileStage, metadata, store, controller) {
    metadataStage.set('isLoading', true);

    // reset current metadataStage:
    var md = metadata.toArray();

    md.forEach(function(item) {
        if (item.get('schema') === 'e57m') {
            metadata.removeObject(item);
        } else if (item.get('schema') === 'ifcm') {
            metadata.removeObject(item);
        }
    });

    if (fileStage.get('files.length') === 0) {
        metadataStage.set('isLoading', false);
        return;
    }


    fileStage.get('files').then(function(files) {
        console.log('NUMFILES: ' + files.get('length'));

        files.forEach(function(file) {
            var path = file.getProperties('path');

            var e57MetadataAPI = new E57MetadataAPI();
            e57MetadataAPI.getMetadataFor(path).then(function(data) {
                var ext = _getFileExtension(file.get('path'))[0],
                    schema = null;

                if (ext.toLowerCase() === 'e57') {
                    schema = 'e57m';
                } else if (ext.toLowerCase() === 'ifc') {
                    schema = 'ifcm';
                }

                var item = store.createRecord('metadatum', {
                    schema: schema,
                    format: 'application/json',
                    model: data,
                    file: file
                });

                metadata.pushObject(item);

                if (fileStage.get('files.length') === metadata.get('length') - 1) { // take into account 'buildm' entry
                    metadataStage.set('isLoading', false);
                    controller.set('_isUpdatingMetadata', false);
                }
            });
        });
    });
}

function _getFileExtension(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}