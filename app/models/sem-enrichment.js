import DS from 'ember-data';

export default DS.Model.extend({
  concept: DS.attr('string'),
  value: DS.attr('string')
});
