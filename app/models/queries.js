import DS from 'ember-data';

export default DS.Model.extend({
  label: DS.attr('string'),
  description: DS.attr('string'),
  sparql: DS.attr('string'),
  variables: DS.attr(),
  urlField: DS.attr('string'),
  result: DS.attr()
});
