import DS from 'ember-data';

export default DS.Model.extend({
  path: DS.attr('string'),
  format: DS.attr('string'),
  schemaName: DS.attr('string'),
  schemaVersion: DS.attr('string'),
  metadata: DS.attr()
});
