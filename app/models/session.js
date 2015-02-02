import DS from 'ember-data';

export
default DS.Model.extend({
    name: DS.attr('string'),
    author: DS.attr('string'),
    created: DS.attr('date'),
    status: DS.attr('string'),
    workflows: DS.hasMany('workflow')
});