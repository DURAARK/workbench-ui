import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller, model) {
    this._super(controller, model);

    controller.set('sessionsEndpoint', this.duraark.get('sessionsEndpoint'));
    controller.set('metadataEndpoint', this.duraark.get('metadataEndpoint'));
    controller.set('sdaEndpoint', this.duraark.get('sdaEndpoint'));
    controller.set('geometricEnrichmentEndpoint', this.duraark.get('geometricEnrichmentEndpoint'));
    controller.set('digitalPreservationEndpoint', this.duraark.get('digitalPreservationEndpoint'));
  }
});
