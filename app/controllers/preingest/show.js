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

                var lkj = result.store.createRecord('filestage');
                //updateMetadataStage(result.metadataStage, result.fileStage, result.store);

                var metadataStage = result.metadataStage;
                var fileStage = result.fileStage;
                var metadata = result.metadata;
                var store = result.store;

                // function updateMetadataStage(metadataStage, fileStage, store) {

                // reset current metadataStage:
                var md = metadata.toArray();

                md.forEach(function(item) {
                    if (item.get('schema') === 'e57m') {
                        metadata.removeObject(item);
                    } else if (item.get('schema') === 'ifcm') {
                        metadata.removeObject(item);
                    }
                });

                fileStage.get('files').then(function(files) {
                    // console.log('#files: ' + files.get('length'));

                    files.forEach(function(file) {
                        var path = file.getProperties('path');

                        var e57MetadataAPI = new E57MetadataAPI();
                        e57MetadataAPI.getMetadataFor(path).then(function(data) {
                            // console.log('  path: ' + file.get('path'));
                            // console.log('  metadata: ' + JSON.stringify(data, null, 4));

                            var ext = _getFileExtension(file.get('path'))[0],
                                schema = null;

                            // console.log('ext: ' + ext);

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
                        });
                    });
                });
                // }(result.metadataStage, result.fileStage, that.store);
            });
        });
    }.observes('model.filestage'),

    actions: {
        editStage: function(stage) {
            console.log('stage: ' + stage);
            debugger;
            console.log('[preingest.show] requesting stage editor: ' + stage.get('name'));
            this.transitionTo(stage.get('name'), stage);
        }
    }
});

function _getFileExtension(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
}