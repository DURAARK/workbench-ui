import DS from 'ember-data';

export default DS.Model.extend({
  label: DS.attr('string'),
  latitutde: DS.attr(),
  longitude: DS.attr(),
  url: DS.attr('string')
});
