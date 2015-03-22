import DS from 'ember-data';

export
default DS.Model.extend({
    name: DS.attr('string'),
    creator: DS.attr('string'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date'),
    filestage: DS.belongsTo('filestage', { async: true }),
    metadatastage: DS.belongsTo('metadatastage', { async: true }),
    //semanticenrichmentstage: DS.belongsTo('semanticenrichmentstage', { async: true }),
    geometricenrichmentstage: DS.belongsTo('geometricenrichmentstage', { async: true })
});