import Ember from 'ember';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';
import IfcMetadataAPI from 'workbench-ui/bindings/api-ifcmetadata';
import SemanticEnrichmentAPI from 'workbench-ui/bindings/api-semanticenrichment';

export
default Ember.ObjectController.extend({
    _isUpdatingMetadata: false,

    onFileStageChanged: function() {
        if (this.get('_isUpdatingMetadata')) {
            return;
        }

        // FIXXME: for some weird reason the semanticenrichmentstage is not loaded, nor is the geometricenrichmentstage.
        // The metadatastage is... This is a quick workaround until I found the root cause:
        this.store.find('semanticenrichmentstage', 1).then(function(stage) {
            this.set('semanticenrichmentstage', stage);
        }.bind(this));

        // Note: when calling the code below the 'model.filestage' property is changed (where?) and causes
        // the observer to recurse endlessly. This is a quick workaround for that.
        this.set('_isUpdatingMetadata', true);

        var that = this;

        var requestData = Em.RSVP.hash({
            metadataStage: this.get('model.metadatastage'),
            // metadata: this.get('model.metadatastage.metadata'),
            fileStage: this.get('model.filestage'),
            semanticenrichmentStage: this.get('model.semanticenrichmentstage'),
            store: this.store,
            controller: this
        });

        requestData.then(function(result) {
            that.store.find('filestage').then(function(records) {
                updateMetadataStage(result.metadataStage, result.fileStage, result.metadata, result.store, result.controller);
                updateSemanticEnrichmentStage(result.semanticenrichmentStage, result.fileStage, result.store, result.controller);
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

function updateSemanticEnrichmentStage(semanticenrichmentStage, fileStage, store, controller) {
    fileStage.get('files').then(function(files) {

        console.log('NUMFILES: ' + files.get('length'));

        // FIXXME: is this necessary and the correct place to do it?
        store.unloadAll('enrichment-item');

        files.forEach(function(file) {
            var path = file.getProperties('path'),
                ext = _getFileExtension(file.get('path'))[0],
                schema = null;

            if (ext.toLowerCase() === 'ifc') {
                console.log('[show::updateSemanticEnrichmentStage] requesting semenrichment for file: ' + path);

                var semanticEnrichmentAPI = new SemanticEnrichmentAPI();
                semanticEnrichmentAPI.getMetadataFor({
                    path: path
                }).then(function(data) {
                    console.log('ADSFASDFASDFASDFdata: ' + JSON.stringify(data, null, 4));
                    for (var idx = 0; idx < data.metadata.length; idx++) {
                        var item = data.metadata[idx]
                        var record = store.createRecord('enrichment-item', item);
                        semanticenrichmentStage.get('availableItems').pushObject(record);
                    };

                    // FIXXME: adapte to multiple files!
                    controller.set('_isUpdatingMetadata', false);
                    semanticenrichmentStage.set('isLoading', false);
                });
            }
        });
    });
}

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
            var path = file.getProperties('path'),
                ext = _getFileExtension(file.get('path'))[0],
                schema = null,
                metadataAPI = null;

            if (ext.toLowerCase() === 'e57') {
                metadataAPI = new E57MetadataAPI();
                schema = 'e57m';
            } else if (ext.toLowerCase() === 'ifc') {
                metadataAPI = new IfcMetadataAPI();
                schema = 'ifcm';
            }

            metadataAPI.getMetadataFor(path).then(function(data) {
                var item = store.createRecord('metadatum', {
                    schema: schema,
                    format: 'application/json',
                    model: data,
                    file: file
                });

                metadata.pushObject(item);

                item.save().then(function(bla) {
                    //if (fileStage.get('files.length') === metadata.get('length') - 1) { // take into account 'buildm' entry
                    metadataStage.set('isLoading', false);
                    controller.set('_isUpdatingMetadata', false);
                    metadataStage.save();
                    //}
                });
            });
        });
    });
}

function _getFileExtension(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}