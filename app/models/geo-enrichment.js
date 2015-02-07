import DS from 'ember-data';

export default DS.Model.extend({
  application: DS.attr('string'),
  enrichments: DS.attr()
});
