import DS from 'ember-data';

export
default DS.Model.extend({
    schema: DS.attr('string'),
    status: DS.attr('string'),
    digitalObject: DS.attr('number'),
    originatingFile: DS.attr('number'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});