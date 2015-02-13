import Ember from 'ember';
import E57MetadataAPI from 'workbench-ui/bindings/api-e57metadata';

export
default Ember.ObjectController.extend({
    onFilesChanged: function() {
        this.get('model.filestage.files').then(function(files) {
            if (files) {
                console.log('#files: ' + files.get('length'));

                var e57MetadataAPI = new E57MetadataAPI();

                files.forEach(function(file) {
                    var bla = file.getProperties('path');
                    e57MetadataAPI.getMetadataFor(bla).then(function(data) {
                        console.log('  path: ' + file.get('path'));
                        console.log('  metadata: ' + JSON.stringify(data, null, 4));
                    });
                });
            }
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