import DS from 'ember-data';

export default DS.Model.extend({
  label: DS.attr('string'),
  buildm: DS.attr(),

  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});
