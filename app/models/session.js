import DS from 'ember-data';

export
default DS.Model.extend({
    name: DS.attr('string'),
    creator: DS.attr('string'),
    created: DS.attr('date'),
    status: DS.attr('string'),
    wfFiles: DS.belongsTo('wfFiles'),
    wfMetadata: DS.belongsTo('wfMetadata'),
    wfSemEnrichment: DS.belongsTo('wfSemEnrichment'),
    wfGeoEnrichment: DS.belongsTo('wfGeoEnrichment'),
    wfSipGenerator: DS.belongsTo('wfSipGenerator')
});