import Ember from 'ember';
import SemanticEnrichmentAPI from 'workbench-ui/bindings/api-semanticenrichment';

export
default Ember.Controller.extend({
    actions: {
        getSemanticEnrichments: function() {
            var store = this.store,
                controller = this,
                stage = this.get('stage'),
                that = this,
                sessionId = stage.session;

            controller.set('_isUpdatingMetadata', true);
            stage.set('isLoading', true);

            var semanticEnrichmentAPI = new SemanticEnrichmentAPI();
            semanticEnrichmentAPI.getMetadataFor({
                path: 'dummy.ifc',
                session: parseInt(sessionId)
            }).then(function(data) {
                this.set('stage', data);
            }.bind(this));
        }
    }
});