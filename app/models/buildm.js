import DS from 'ember-data';

export
default DS.Model.extend({
    schema: DS.attr('string'),
    latitude: DS.attr('number'),
    longitude: DS.attr('number'),
});