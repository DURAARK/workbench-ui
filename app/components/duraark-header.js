import Ember from 'ember';

export default Ember.Component.extend({
  activeStep: 'files',

  filesActive: function() {
      return this.get('activeStep').toLowerCase() === 'files';
  }.property(),

  metadataActive: function() {
      return this.get('activeStep').toLowerCase() === 'metadata';
  }.property(),

  semanticenrichmentActive: function() {
      return this.get('activeStep').toLowerCase() === 'semanticenrichment';
  }.property(),

  geometricenrichmentActive: function() {
      return this.get('activeStep').toLowerCase() === 'geometricenrichment';
  }.property(),

  digitalpreservationActive: function() {
      return this.get('activeStep').toLowerCase() === 'digitalpreservation';
  }.property()
});
