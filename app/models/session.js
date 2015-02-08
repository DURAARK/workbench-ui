import DS from 'ember-data';

export
default DS.Model.extend({
    name: DS.attr('string'),
    creator: DS.attr('string'),
    created: DS.attr('date'),
    stages: DS.hasMany('stages', { async: true })
});