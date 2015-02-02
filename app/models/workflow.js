import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  component: DS.attr('string'),
  status: DS.attr('string'),
  customData: DS.attr()
});
