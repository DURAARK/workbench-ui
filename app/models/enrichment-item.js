import DS from 'ember-data';

export default DS.Model.extend({
  datasetId: DS.attr('number'),
  datasetName: DS.attr('string'),
  resourceId: DS.attr('number'),
  resourceUri: DS.attr('string'),
  propertyUri: DS.attr('string')
});
