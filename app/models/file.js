import DS from 'ember-data';

var File = DS.Model.extend({
  path: DS.attr('string'),
  type: DS.attr('string'),
  directory: DS.attr('boolean'),
  size: DS.attr('number'),
  thumbnail: DS.attr('string'),
  mtime: DS.attr('date'),
  atime: DS.attr('date'),
  ctime: DS.attr('date'),

  metadata: DS.attr(),
  techMD: DS.attr()
});

export
default File;
