import Ember from 'ember';

export default Ember.Component.extend({
  activeStep: 'files',

  filesActive: function() {
    let activeStep = this.get('activeStep');
    debugger;
    return this.get('activeStep').toLowerCase() === 'files';
  }.property('activeStep'),

  metadataActive: function() {
    let activeStep = this.get('activeStep');
    debugger;
    return this.get('activeStep').toLowerCase() === 'metadata';
  }.property('activeStep'),

  semanticenrichmentActive: function() {
    let activeStep = this.get('activeStep');
    debugger;
    return this.get('activeStep').toLowerCase() === 'semanticenrichment';
  }.property('activeStep'),

  geometricenrichmentActive: function() {
    let activeStep = this.get('activeStep');
    debugger;
    return this.get('activeStep').toLowerCase() === 'geometricenrichment';
  }.property('activeStep'),

  digitalpreservationActive: function() {
    let activeStep = this.get('activeStep');
    debugger;
    return this.get('activeStep').toLowerCase() === 'digitalpreservation';
  }.property('activeStep')
});
