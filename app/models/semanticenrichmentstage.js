import DS from 'ember-data';

export
default DS.Model.extend({
    name: DS.attr('string', {
        defaultValue: 'semenrichment'
    }),
    semEnrichment: DS.hasMany('sem-enrichment', {
        async: true
    }, {
        defaultValue: []
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