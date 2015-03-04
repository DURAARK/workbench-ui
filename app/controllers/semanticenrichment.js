import Ember from 'ember';
import SemanticEnrichmentAPI from 'workbench-ui/bindings/api-semanticenrichment';

export
default Ember.Controller.extend({
    actions: {
        getSemanticEnrichments: function() {
            var store = this.store,
                controller = this,
                stage = this.get('model'),
                that = this;

            controller.set('_isUpdatingMetadata', true);
            stage.set('isLoading', true);

            var semanticEnrichmentAPI = new SemanticEnrichmentAPI();
            semanticEnrichmentAPI.getMetadataFor({
                path: 'dummy.ifc'
            }).then(function(data) {
                // console.log('data: ' + JSON.stringify(data, null, 4));

                store.unloadAll('enrichment-item');

                for (var idx = 0; idx < data.availableItems.length; idx++) {
                    var item = data.availableItems[idx]
                    var record = store.createRecord('enrichment-item', item);
                    stage.get('availableItems').pushObject(record);
                };

                controller.set('_isUpdatingMetadata', false);
                stage.set('isLoading', false);
            });
        }

        // saveEnrichments: function() {
        //     var stage = this.get('model');
        //     var items = this.get('enrichmentItems');

        //     items.forEach(function(item) {
        //         stage.get('semEnrichment').pushObject(item);
        //     })
        //     stage.save();
        // }
    }
});