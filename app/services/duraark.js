import Ember from 'ember';

export default Ember.Service.extend({
  sessionsEndpoint: 'http://mimas.cgv.tugraz.at/api/v0.7/sessions',
  metadataEndpoint: 'http://mimas.cgv.tugraz.at/api/v0.7/metadata',
  sdaEndpoint: 'http://mimas.cgv.tugraz.at/api/v0.7/sda',
  geometricEnrichmentEndpoint: 'http://mimas.cgv.tugraz.at/api/v0.7/geometricEnrichment',
  digitalPreservationEndpoint: 'http://mimas.cgv.tugraz.at/api/v0.7/digitalPreservation',

  getAPIEndpoint: function(service) {
    return this.get(service + 'Endpoint');
  }
});
