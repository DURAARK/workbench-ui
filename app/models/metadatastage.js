import DS from 'ember-data';

export
default DS.Model.extend({
    name: DS.attr('string', {
        defaultValue: 'metadata'
    }),
    // metadata: DS.hasMany('metadatum', {
    //     async: true
    // }, {
    //     defaultValue: []
    // }),

    buildm: DS.belongsTo('buildm', {
        async: true
    }),

    ifcm: DS.belongsTo('ifcm', {
        async: true
    }),

    e57m: DS.belongsTo('e57m', {
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