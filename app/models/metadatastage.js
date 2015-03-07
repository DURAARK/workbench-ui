import DS from 'ember-data';

export
default DS.Model.extend({
    name: DS.attr('string', {
        defaultValue: 'metadata'
    }),
    
    physicalAssets: DS.hasMany('physical-asset', {
        async: true
    }),

    digitalObjects: DS.hasMany('digital-object', {
        async: true
    }),

    ifcms: DS.hasMany('ifcm', {
        async: true
    }),

    e57ms: DS.hasMany('e57m', {
        async: true
    }),

    session: DS.belongsTo('session', {
        async: true
    }),

    createdAt: DS.attr('date'),

    updatedAt: DS.attr('date'),

    isLoading: DS.attr('boolean', {
        defaultValue: false
    })
});