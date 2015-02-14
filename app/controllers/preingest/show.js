import Ember from 'ember';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';

export
default Ember.ObjectController.extend({
    onFilesChanged: function() {
        var that = this;

        this.get('model.metadatastage.files').then(function(metadatafiles) {

            var e57MetadataAPI = new E57MetadataAPI();

            that.get('model.filestage.files').then(function(files) {
                console.log('#files: ' + files.get('length'));

                files.forEach(function(file) {
                    var path = file.getProperties('path');
                    e57MetadataAPI.getMetadataFor(path).then(function(data) {
                        console.log('  path: ' + file.get('path'));
                        console.log('  metadata: ' + JSON.stringify(data, null, 4));

                        var ext = that._getFileExtension(file.get('path'))[0],
                            schema = null;

                        console.log('ext: ' + ext);

                        if (ext.toLowerCase() === 'e57') {
                            schema = 'e57m';
                        } else if (ext.toLowerCase() === 'ifc') {
                            schema = 'ifcm';
                        }

                        var item = that.store.createRecord('metadatum', {
                            path: file.get('path'),
                            schema: schema,
                            content: data
                        });

                        metadatafiles.pushObject(item);
                    });
                });
            });

        });
    }.observes('model.filestage'),

    _getFileExtension: function(filename) {
        return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename) : undefined;
    },

    actions: {
        editStage: function() {
            var stage = this.get('filestage');

            console.log('[preingest.show] requesting stage editor: ' + stage.get('name'));

            this.transitionTo(stage.get('name'), stage);
        }
    }
});