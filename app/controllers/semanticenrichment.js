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

            // FIXXME: check if those two are still necessary and remove if not!
            controller.set('_isUpdatingMetadata', true);
            stage.set('isLoading', true);

            controller.set('isUpdatingEnrichments', true);

            var semanticEnrichmentAPI = new SemanticEnrichmentAPI();
            semanticEnrichmentAPI.getMetadataFor({
                path: 'dummy.ifc',
                session: parseInt(sessionId)
            }).then(function(data) {
                this.set('stage', data);
                controller.set('isUpdatingEnrichments', false);
            }.bind(this));
        }
    }
});