import Ember from 'ember';
import SemanticEnrichmentAPI from 'workbench-ui/bindings/api-semanticenrichment';

export
default Ember.Controller.extend({
    actions: {
        getSemanticEnrichments: function() {
            var store = this.store,
                that = this;

            var semanticEnrichmentAPI = new SemanticEnrichmentAPI();
            semanticEnrichmentAPI.getMetadataFor({
                path: 'dummy.ifc'
            }).then(function(data) {
                console.log('data: ' + JSON.stringify(data, null, 4));

                for (var idx = 0; idx < data.metadata.length; idx++) {
                    var item = data.metadata[idx]
                    var record = store.createRecord('sem-enrichment', item);
                    console.log('created item: ' + record.get('datasetName'));
                };

                // metadata.pushObject(item);

                // if (fileStage.get('files.length') === metadata.get('length') - 1) { // take into account 'buildm' entry
                // 	metadataStage.set('isLoading', false);
                // 	controller.set('_isUpdatingMetadata', false);
                // }

                that.set('enrichmentItems', store.all('sem-enrichment'));
            });
        }
    }
});