import DS from 'ember-data';

export default DS.Model.extend({
  subject: DS.attr('string'),
  type: DS.attr('string'),
  creator: DS.attr('string'),
  dateCreated: DS.attr('string'),
  event: DS.attr('string'),
  filename: DS.attr('string'),
  format: DS.attr('string'),
  hasFormatDetails: DS.attr('string'),
  hasPart: DS.attr('string'),
  hasType: DS.attr('string'),
  isPartOf: DS.attr('string'),
  levelOfDetail: DS.attr('string'),
  license: DS.attr('string'),
  provenance: DS.attr('string'),
  represents: DS.attr('string'),
  unit: DS.attr('string'),
  unitCode: DS.attr('string'),
  hasPart: DS.attr('string'),
  isPartOf: DS.attr('string'),
  isRepresentedBy: DS.attr('string'),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});
