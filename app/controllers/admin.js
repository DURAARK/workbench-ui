import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    setSessionsEndpoint: function() {
      var endpoint = this.get('sessionsEndpoint');
      console.log('asdfasdf: ' + endpoint);
      this.duraark.set('sessionsEndpoint', endpoint);
    },
    setMetadataEndpoint: function() {
      var endpoint = this.get('metadataEndpoint');
      this.duraark.set('metadataEndpoint', endpoint);
    },
    setSDAEndpoint: function() {
      var endpoint = this.get('sdaEndpoint');
      this.duraark.set('sdaEndpoint', endpoint);
    },
    setGeometricEnrichmentEndpoint: function() {
      var endpoint = this.get('geometricEnrichmentEndpoint');
      this.duraark.set('geometricEnrichmentEndpoint', endpoint);
    },
    setDigitalPreservationEndpoint: function() {
      var endpoint = this.get('digitalPreservationEndpoint');
      this.duraark.set('digitalPreservationEndpoint', endpoint);
    },
  }
});
