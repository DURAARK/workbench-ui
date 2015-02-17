import Ember from 'ember';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';

export
default Ember.ObjectController.extend({
    onFileStageChanged: function() {
        var that = this;

        var requestData = Em.RSVP.hash({
            metadataStage: this.get('model.metadatastage'),
            metadata: this.get('model.metadatastage.metadata'),
            fileStage: this.get('model.filestage'),
            store: this.store
        });

        requestData.then(function(result) {
            that.store.find('filestage').then(function(records) {
                updateMetadataStage(result.metadataStage, result.fileStage, result.metadata, result.store);
            });
        });
    }.observes('model.filestage'),

    actions: {
        editStage: function(stage) {
            console.log('[preingest.show] requesting stage editor: ' + stage.get('name'));
            this.transitionTo(stage.get('name'), stage);
        }
    }
});

// TODO: refactor into 'duraark-api' object which gets injected into controllers and routes!
function updateMetadataStage(metadataStage, fileStage, metadata, store) {
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

                var a = fileStage.get('files.length');
                var b = metadata.get('length');

                console.log('a: ' + a + ' / ' + 'b: ' + b);

                if (fileStage.get('files.length') === metadata.get('length')-1) { // take into account 'buildm' entry
                    metadataStage.set('isLoading', false);
                }
            });
        });
    });
}

function _getFileExtension(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}