import DS from 'ember-data';

export default DS.Model.extend({
  path: DS.attr('string'),
  type: DS.attr('string'),
  directory: DS.attr('boolean'),
  size: DS.attr('number'),
  mtime: DS.attr('date'),
  atime: DS.attr('date'),
  ctime: DS.attr('date')
});
