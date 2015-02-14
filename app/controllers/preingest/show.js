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

                        var item = that.store.createRecord('metadatum', {
                            path: file.get('path'),
                            schema: 'e75m',
                            content: data
                        });

                        metadatafiles.pushObject(item);
                        // that.set('model.metadatastage', stage);
                    });
                });
            });

        });
    }.observes('model.filestage'),

    actions: {
        editStage: function() {
            var stage = this.get('filestage');

            console.log('[preingest.show] requesting stage editor: ' + stage.get('name'));

            this.transitionTo(stage.get('name'), stage);
        }
    }
});