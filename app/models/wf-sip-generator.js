import DS from 'ember-data';

export default DS.Model.extend({
  status: DS.attr('string'),
  files: DS.hasMany('file'),
  archive: DS.attr('string')
});
