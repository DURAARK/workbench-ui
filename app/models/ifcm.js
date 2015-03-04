import DS from 'ember-data';

export
default DS.Model.extend({
    schema: DS.attr('string'),
    creator: DS.attr('string'),
    streetAdress: DS.attr('string'),
});