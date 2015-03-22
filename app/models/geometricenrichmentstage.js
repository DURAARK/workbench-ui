import DS from 'ember-data';

export
default DS.Model.extend({
    name: DS.attr('string', {
        defaultValue: 'geoenrichment'
    }),
    
    ifcReconstructions: DS.attr(),
    hiddenFeatures: DS.attr(),

    session: DS.belongsTo('session', {
        async: true
    }),

    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date')
});