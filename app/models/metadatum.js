import DS from 'ember-data';

export default DS.Model.extend({
  path: DS.attr('string'),
  type: DS.attr('string'),
  metadata: DS.attr()
});
