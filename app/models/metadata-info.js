import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  available: DS.attr('boolean'),
  metadata: DS.attr()
});
