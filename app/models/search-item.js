import DS from 'ember-data';

export
default DS.Model.extend({
    url: DS.attr('string'),
    latitude: DS.attr('number'),
    longitude: DS.attr('number'),
    properties: DS.attr()
});