import DS from 'ember-data';

export
default DS.Model.extend({
    originatingFile: DS.attr('string'),
    status: DS.attr('string'),
    // metadata: DS.hasMany('enrichment-item')
    metadata: DS.attr()
});