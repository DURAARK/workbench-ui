import Ember from 'ember';

export default Ember.Component.extend({
  activeStep: 'files',

  filesActive: function() {
    return this.get('activeStep').toLowerCase() === 'files';
  }.property('activeStep'),

  metadataActive: function() {
    return this.get('activeStep').toLowerCase() === 'metadata';
  }.property('activeStep'),

  semanticenrichmentActive: function() {
    return this.get('activeStep').toLowerCase() === 'semanticenrichment';
  }.property('activeStep'),

  geometricenrichmentActive: function() {
    return this.get('activeStep').toLowerCase() === 'geometricenrichment';
  }.property('activeStep'),

  digitalpreservationActive: function() {
    return this.get('activeStep').toLowerCase() === 'digitalpreservation';
  }.property('activeStep')
});
